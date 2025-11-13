from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import httpx
import json
import os
import PyPDF2
import io

router = APIRouter()

# Gemini API Configuration
# Read Gemini API configuration from environment for safety and flexibility
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
# Use gemini-2.5-flash which is available for v1beta API
GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"


class AIRequest(BaseModel):
    project_title: str
    project_description: str


class AIResponse(BaseModel):
    caption: str
    hashtags: list[str]
    tagging_suggestions: dict
    reach_tips: list[str]
    media_recommendations: dict
    posting_strategy: str


def extract_text_from_pdf(pdf_file: bytes) -> str:
    """Extract text content from a PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file))
        text = ""
        
        # Extract text from all pages
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text() + "\n"
        
        return text.strip()
    except Exception as e:
        raise Exception(f"Error reading PDF: {str(e)}")


@router.post("/generate-linkedin-suggestions", response_model=AIResponse)
async def generate_linkedin_suggestions(request: AIRequest):
    """
    Generate LinkedIn posting suggestions using Google Gemini API from text input
    """
    try:
        # Construct the prompt
        prompt = f"""You are a LinkedIn marketing expert. Analyze this student project and provide detailed LinkedIn posting suggestions.

Project Title: {request.project_title}
Project Description: {request.project_description}

Provide a comprehensive LinkedIn posting strategy in the following JSON format:
{{
  "caption": "An engaging, professional LinkedIn post caption (3-4 sentences) that highlights the key achievements and impact of this project",
  "hashtags": ["10-15 relevant hashtags including trending tech hashtags, project-specific tags, and general professional hashtags"],
  "taggingSuggestions": {{
    "companies": ["5-8 relevant companies that work in this domain or might be interested in this project"],
    "ministries": ["2-3 relevant government ministries or organizations if applicable"],
    "influencers": ["3-5 tech influencers or thought leaders in this field"]
  }},
  "reachTips": [
    "5-7 specific, actionable tips to maximize post reach and engagement on LinkedIn"
  ],
  "mediaRecommendations": {{
    "images": ["3-4 specific types of images/screenshots to include with descriptions"],
    "videos": ["2-3 specific video content suggestions with duration and content details"]
  }},
  "postingStrategy": "A detailed paragraph about the best time to post, how to structure the post, engagement strategies, and follow-up actions"
}}

Make sure all suggestions are:
- Specific to this project
- Actionable and practical
- Professional and appropriate for LinkedIn
- Optimized for maximum reach and engagement
- Relevant to the tech/education industry

Return ONLY valid JSON, no additional text."""

        # Validate API key
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="Gemini API key is not configured. Set GEMINI_API_KEY in environment.")

        # Make request to Gemini API
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [
                        {
                            "parts": [
                                {"text": prompt}
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.7,
                        "topK": 40,
                        "topP": 0.95,
                        "maxOutputTokens": 8192,
                    },
                },
            )

        if response.status_code != 200:
            # Include status and body to make debugging easier
            detail = f"Gemini API error: status={response.status_code} body={response.text}"
            print(detail)
            raise HTTPException(status_code=500, detail=detail)

        # Parse Gemini response (be permissive about response shape)
        data = response.json()
        ai_response_text = None
        
        # Debug: print response structure
        print("Gemini API response structure:", json.dumps(data, indent=2)[:1000])

        # Check for finish reason issues
        candidates = data.get("candidates", [])
        if candidates and len(candidates) > 0:
            finish_reason = candidates[0].get("finishReason")
            if finish_reason == "MAX_TOKENS":
                raise HTTPException(
                    status_code=500,
                    detail="AI response was cut off due to token limit. Please try with a shorter project description."
                )
            elif finish_reason and finish_reason not in ["STOP", "FINISH_REASON_UNSPECIFIED"]:
                print(f"Warning: Unexpected finish reason: {finish_reason}")

        # Try multiple possible field names used by different GL API versions
        try:
            # common: candidates -> content -> parts -> text
            if candidates and len(candidates) > 0:
                print(f"Found {len(candidates)} candidates")
                candidate = candidates[0]
                print(f"First candidate keys: {list(candidate.keys())}")
                content = candidate.get("content", {})
                if content:
                    print(f"Content keys: {list(content.keys())}")
                    parts = content.get("parts", [])
                    if parts and len(parts) > 0:
                        print(f"Found {len(parts)} parts, first part keys: {list(parts[0].keys())}")
                        ai_response_text = parts[0].get("text")
                        if ai_response_text:
                            print(f"✓ Successfully extracted text (length: {len(ai_response_text)})")
        except (IndexError, KeyError, TypeError) as e:
            print(f"Error parsing standard response format: {e}")
            ai_response_text = None

        if not ai_response_text:
            # another possible shape: candidates[0].output
            try:
                candidates = data.get("candidates", [])
                if candidates and len(candidates) > 0:
                    ai_response_text = candidates[0].get("output")
            except (IndexError, KeyError, TypeError):
                ai_response_text = None

        if not ai_response_text:
            # fallback: try top-level 'output' or 'result'
            ai_response_text = data.get("output") or data.get("result")

        if not ai_response_text:
            # Last resort: stringify full response for debugging
            print("Unexpected Gemini response shape:", json.dumps(data, indent=2)[:2000])
            raise HTTPException(status_code=500, detail=f"Unexpected Gemini response shape. Response keys: {list(data.keys())}")

        # Extract JSON from response (handle markdown code blocks)
        ai_response_text = ai_response_text.strip()
        
        # Remove markdown code blocks if present
        if ai_response_text.startswith("```json"):
            ai_response_text = ai_response_text[7:]
        elif ai_response_text.startswith("```"):
            ai_response_text = ai_response_text[3:]
        
        if ai_response_text.endswith("```"):
            ai_response_text = ai_response_text[:-3]
        
        ai_response_text = ai_response_text.strip()

        # Parse JSON
        try:
            suggestions = json.loads(ai_response_text)
        except json.JSONDecodeError:
            # Try to extract JSON object from text
            import re
            json_match = re.search(r'\{[\s\S]*\}', ai_response_text)
            if json_match:
                try:
                    suggestions = json.loads(json_match.group(0))
                except json.JSONDecodeError:
                    print("Failed to decode extracted JSON fragment:", json_match.group(0)[:400])
                    raise HTTPException(status_code=500, detail="Failed to parse AI response JSON fragment")
            else:
                print("AI response could not be parsed as JSON. Raw response:\n", ai_response_text[:2000])
                raise HTTPException(status_code=500, detail="Failed to parse AI response as JSON")

        # Normalize keys to match response model (camelCase to snake_case)
        # Support both camelCase and PascalCase from different AI response formats
        normalized_response = {
            "caption": suggestions.get("caption") or suggestions.get("Caption") or "No caption generated",
            "hashtags": suggestions.get("hashtags") or suggestions.get("Hashtags") or [],
            "tagging_suggestions": suggestions.get("taggingSuggestions") or suggestions.get("TaggingSuggestions") or {},
            "reach_tips": suggestions.get("reachTips") or suggestions.get("ReachTips") or [],
            "media_recommendations": suggestions.get("mediaRecommendations") or suggestions.get("MediaRecommendations") or {},
            "posting_strategy": suggestions.get("postingStrategy") or suggestions.get("PostingStrategy") or "No posting strategy generated",
        }

        print(f"✓ Successfully generated AI suggestions with {len(normalized_response['hashtags'])} hashtags")
        return normalized_response

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Request to Gemini API timed out"
        )
    except HTTPException:
        # Re-raise HTTPExceptions as-is
        raise
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error generating AI suggestions: {str(e)}")
        print(f"Full traceback:\n{error_details}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate AI suggestions: {str(e) or type(e).__name__}"
        )



@router.get("/list-models")
async def list_gemini_models():
    """Diagnostic endpoint: list available Generative Language models for the configured key"""
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key not configured")

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={GEMINI_API_KEY}")

        try:
            body = resp.json()
        except Exception:
            body = resp.text

        return JSONResponse(content={"status": resp.status_code, "body": body})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing models: {e}")


@router.post("/generate-linkedin-suggestions-from-pdf", response_model=AIResponse)
async def generate_linkedin_suggestions_from_pdf(file: UploadFile = File(...)):
    """
    Generate LinkedIn posting suggestions using Google Gemini API from PDF upload
    """
    
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Read PDF file
        pdf_content = await file.read()
        
        # Extract text from PDF
        pdf_text = extract_text_from_pdf(pdf_content)
        
        if not pdf_text or len(pdf_text) < 50:
            raise HTTPException(
                status_code=400, 
                detail="Could not extract enough text from PDF. Please ensure the PDF contains readable text."
            )
        
        # Construct the prompt with PDF content
        prompt = f"""You are a LinkedIn marketing expert. I have extracted project details from a PDF document. Analyze this content and provide detailed LinkedIn posting suggestions.

PROJECT CONTENT FROM PDF:
{pdf_text}

Based on the content above, provide a comprehensive LinkedIn posting strategy in the following JSON format:
{{
  "caption": "An engaging, professional LinkedIn post caption (3-4 sentences) that highlights the key achievements and impact of this project",
  "hashtags": ["10-15 relevant hashtags including trending tech hashtags, project-specific tags, and general professional hashtags"],
  "taggingSuggestions": {{
    "companies": ["5-8 relevant companies that work in this domain or might be interested in this project"],
    "ministries": ["2-3 relevant government ministries or organizations if applicable"],
    "influencers": ["3-5 tech influencers or thought leaders in this field"]
  }},
  "reachTips": [
    "5-7 specific, actionable tips to maximize post reach and engagement on LinkedIn"
  ],
  "mediaRecommendations": {{
    "images": ["3-4 specific types of images/screenshots to include with descriptions"],
    "videos": ["2-3 specific video content suggestions with duration and content details"]
  }},
  "postingStrategy": "A detailed paragraph about the best time to post, how to structure the post, engagement strategies, and follow-up actions"
}}

Make sure all suggestions are:
- Specific to this project based on the PDF content
- Actionable and practical
- Professional and appropriate for LinkedIn
- Optimized for maximum reach and engagement
- Relevant to the tech/education industry

Return ONLY valid JSON, no additional text."""

        # Make request to Gemini API
        async with httpx.AsyncClient(timeout=60.0) as client:  # Longer timeout for PDF
            response = await client.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [
                        {
                            "parts": [
                                {
                                    "text": prompt,
                                }
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.7,
                        "topK": 40,
                        "topP": 0.95,
                        "maxOutputTokens": 8192,
                    },
                },
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Gemini API error: {response.text}"
            )

        # Parse Gemini response
        data = response.json()
        ai_response_text = data["candidates"][0]["content"]["parts"][0]["text"]

        # Extract JSON from response (handle markdown code blocks)
        ai_response_text = ai_response_text.strip()
        
        # Remove markdown code blocks if present
        if ai_response_text.startswith("```json"):
            ai_response_text = ai_response_text[7:]
        elif ai_response_text.startswith("```"):
            ai_response_text = ai_response_text[3:]
        
        if ai_response_text.endswith("```"):
            ai_response_text = ai_response_text[:-3]
        
        ai_response_text = ai_response_text.strip()

        # Parse JSON
        try:
            suggestions = json.loads(ai_response_text)
        except json.JSONDecodeError:
            # Try to extract JSON object from text
            import re
            json_match = re.search(r'\{[\s\S]*\}', ai_response_text)
            if json_match:
                suggestions = json.loads(json_match.group(0))
            else:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to parse AI response as JSON"
                )

        # Normalize keys to match response model
        # Support both camelCase and PascalCase from different AI response formats
        normalized_response = {
            "caption": suggestions.get("caption") or suggestions.get("Caption") or "No caption generated",
            "hashtags": suggestions.get("hashtags") or suggestions.get("Hashtags") or [],
            "tagging_suggestions": suggestions.get("taggingSuggestions") or suggestions.get("TaggingSuggestions") or {},
            "reach_tips": suggestions.get("reachTips") or suggestions.get("ReachTips") or [],
            "media_recommendations": suggestions.get("mediaRecommendations") or suggestions.get("MediaRecommendations") or {},
            "posting_strategy": suggestions.get("postingStrategy") or suggestions.get("PostingStrategy") or "No posting strategy generated",
        }

        print(f"✓ Successfully generated AI suggestions from PDF with {len(normalized_response['hashtags'])} hashtags")
        return normalized_response

    except HTTPException as he:
        raise he
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Request to Gemini API timed out. Please try again."
        )
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Error processing PDF: {str(e)}")
        print(error_details)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process PDF: {str(e) or type(e).__name__}"
        )

    """
    Generate LinkedIn posting suggestions using Google Gemini API
    """
    try:
        # Construct the prompt
        prompt = f"""You are a LinkedIn marketing expert. Analyze this student project and provide detailed LinkedIn posting suggestions.

Project Title: {request.project_title}
Project Description: {request.project_description}

Provide a comprehensive LinkedIn posting strategy in the following JSON format:
{{
  "caption": "An engaging, professional LinkedIn post caption (3-4 sentences) that highlights the key achievements and impact of this project",
  "hashtags": ["10-15 relevant hashtags including trending tech hashtags, project-specific tags, and general professional hashtags"],
  "taggingSuggestions": {{
    "companies": ["5-8 relevant companies that work in this domain or might be interested in this project"],
    "ministries": ["2-3 relevant government ministries or organizations if applicable"],
    "influencers": ["3-5 tech influencers or thought leaders in this field"]
  }},
  "reachTips": [
    "5-7 specific, actionable tips to maximize post reach and engagement on LinkedIn"
  ],
  "mediaRecommendations": {{
    "images": ["3-4 specific types of images/screenshots to include with descriptions"],
    "videos": ["2-3 specific video content suggestions with duration and content details"]
  }},
  "postingStrategy": "A detailed paragraph about the best time to post, how to structure the post, engagement strategies, and follow-up actions"
}}

Make sure all suggestions are:
- Specific to this project
- Actionable and practical
- Professional and appropriate for LinkedIn
- Optimized for maximum reach and engagement
- Relevant to the tech/education industry

Return ONLY valid JSON, no additional text."""

        # Make request to Gemini API
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
                headers={"Content-Type": "application/json"},
                json={
                    "contents": [
                        {
                            "parts": [
                                {
                                    "text": prompt,
                                }
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.7,
                        "topK": 40,
                        "topP": 0.95,
                        "maxOutputTokens": 2048,
                    },
                },
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=500,
                detail=f"Gemini API error: {response.text}"
            )

        # Parse Gemini response
        data = response.json()
        ai_response_text = data["candidates"][0]["content"]["parts"][0]["text"]

        # Extract JSON from response (handle markdown code blocks)
        ai_response_text = ai_response_text.strip()
        
        # Remove markdown code blocks if present
        if ai_response_text.startswith("```json"):
            ai_response_text = ai_response_text[7:]
        elif ai_response_text.startswith("```"):
            ai_response_text = ai_response_text[3:]
        
        if ai_response_text.endswith("```"):
            ai_response_text = ai_response_text[:-3]
        
        ai_response_text = ai_response_text.strip()

        # Parse JSON
        try:
            suggestions = json.loads(ai_response_text)
        except json.JSONDecodeError:
            # Try to extract JSON object from text
            import re
            json_match = re.search(r'\{[\s\S]*\}', ai_response_text)
            if json_match:
                suggestions = json.loads(json_match.group(0))
            else:
                raise HTTPException(
                    status_code=500,
                    detail="Failed to parse AI response as JSON"
                )

        # Normalize keys to match response model (camelCase to snake_case)
        normalized_response = {
            "caption": suggestions.get("caption", ""),
            "hashtags": suggestions.get("hashtags", []),
            "tagging_suggestions": suggestions.get("taggingSuggestions", {}),
            "reach_tips": suggestions.get("reachTips", []),
            "media_recommendations": suggestions.get("mediaRecommendations", {}),
            "posting_strategy": suggestions.get("postingStrategy", ""),
        }

        return normalized_response

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="Request to Gemini API timed out"
        )
    except Exception as e:
        print(f"Error generating AI suggestions: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate AI suggestions: {str(e)}"
        )
