"""
LinkedIn Post Optimizer for Student Projects
Uses Google Gemini AI to generate LinkedIn post suggestions
"""

import google.generativeai as genai
import json
from typing import Dict, List
import os
import PyPDF2
from pathlib import Path

class LinkedInPostOptimizer:
    def __init__(self, api_key: str):
        """Initialize the optimizer with Gemini API key"""
        genai.configure(api_key=api_key)
        # use a stable model if available
        try:
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        except Exception:
            # fallback to a commonly available model name
            self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    def analyze_project(self, project_details: Dict) -> Dict:
        """
        Analyze student project and generate LinkedIn post suggestions
        
        Args:
            project_details: Dictionary containing project information
                - title: Project title
                - description: Project description
                - technologies: List of technologies used
                - outcomes: Key outcomes/results
                - duration: Project duration
                - team_size: Number of team members
                - category: Project category (e.g., Web Dev, AI/ML, Mobile App)
        
        Returns:
            Dictionary with post suggestions, hashtags, tags, and media recommendations
        """
        
        # Create a comprehensive prompt for Gemini
        prompt = self._create_prompt(project_details)
        
        # Generate content using Gemini
        response = self.model.generate_content(prompt)
        
        # Parse and structure the response
        suggestions = self._parse_response(response.text)
        
        return suggestions
    
    def _create_prompt(self, project_details: Dict) -> str:
        """Create a detailed prompt for Gemini API"""
        
        prompt = f"""
You are a LinkedIn content strategist specializing in helping students showcase their projects professionally.

Analyze the following student project and provide comprehensive LinkedIn post recommendations:

PROJECT DETAILS:
- Title: {project_details.get('title', 'N/A')}
- Description: {project_details.get('description', 'N/A')}
- Technologies Used: {', '.join(project_details.get('technologies', []))}
- Key Outcomes: {project_details.get('outcomes', 'N/A')}
- Duration: {project_details.get('duration', 'N/A')}
- Team Size: {project_details.get('team_size', 'Individual')}
- Category: {project_details.get('category', 'General')}

Please provide the following in a structured format:

1. POST CAPTIONS (provide 3 different versions):
   - Version 1: Professional and formal tone
   - Version 2: Engaging and storytelling approach
   - Version 3: Technical and achievement-focused

2. HASHTAGS:
   - Provide 10-15 relevant hashtags
   - Mix of popular and niche hashtags
   - Industry-specific hashtags

3. PEOPLE/ENTITIES TO TAG:
   - Relevant companies in this domain
   - Industry influencers and thought leaders
   - Technology organizations/communities
   - Educational institutions or programs (if applicable)
   - Government ministries or departments (if applicable)

4. TARGET AUDIENCE:
   - Industries to target
   - Job roles that would be interested
   - Companies that might be hiring for similar skills

5. VISUAL CONTENT RECOMMENDATIONS:
   - Type of images to post (screenshots, diagrams, team photos, etc.)
   - Video content ideas
   - Carousel post structure ideas
   - Design tips for visual appeal

6. POSTING STRATEGY:
   - Best time to post
   - Engagement tips
   - How to structure the post for maximum reach

7. KEYWORDS AND SEO:
   - Keywords to include for better discoverability
   - Profile optimization tips based on this project

Format your response in clear sections with headers and bullet points.
"""
        
        return prompt
    
    def _parse_response(self, response_text: str) -> Dict:
        """Parse Gemini's response into structured format"""
        
        # Return structured response
        return {
            "raw_response": response_text,
            "formatted_output": self._format_output(response_text)
        }
    
    def _format_output(self, text: str) -> str:
        """Format the output for better readability"""
        
        # Add visual separators and formatting
        formatted = "\n" + "="*80 + "\n"
        formatted += "📊 LINKEDIN POST OPTIMIZATION REPORT\n"
        formatted += "="*80 + "\n\n"
        formatted += text
        formatted += "\n" + "="*80 + "\n"
        
        return formatted
    
    def save_suggestions(self, suggestions: Dict, filename: str = "linkedin_suggestions.txt"):
        """Save suggestions to a file"""
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(suggestions['formatted_output'])
        
        print(f"\n✅ Suggestions saved to: {filename}")
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text content from a PDF file"""
        
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                
                # Extract text from all pages
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    text += page.extract_text() + "\n"
                
                return text.strip()
        
        except Exception as e:
            raise Exception(f"Error reading PDF: {e}")
    
    def analyze_project_from_pdf(self, pdf_path: str) -> Dict:
        """
        Analyze project from a PDF document
        
        Args:
            pdf_path: Path to the PDF file containing project details
        
        Returns:
            Dictionary with post suggestions
        """
        
        # Extract text from PDF
        print(f"\n📄 Reading PDF: {pdf_path}")
        pdf_text = self.extract_text_from_pdf(pdf_path)
        
        if not pdf_text:
            raise Exception("No text could be extracted from the PDF")
        
        print(f"✅ Extracted {len(pdf_text)} characters from PDF\n")
        
        # Create prompt with PDF content
        prompt = self._create_prompt_from_pdf(pdf_text)
        
        # Generate content using Gemini
        response = self.model.generate_content(prompt)
        
        # Parse and structure the response
        suggestions = self._parse_response(response.text)
        
        return suggestions
    
    def _create_prompt_from_pdf(self, pdf_text: str) -> str:
        """Create a detailed prompt for Gemini API using PDF content"""
        
        prompt = f"""
You are a LinkedIn content strategist specializing in helping students showcase their projects professionally.

I have extracted the following project details from a PDF document. Please analyze this content and provide comprehensive LinkedIn post recommendations:

PROJECT CONTENT FROM PDF:
{pdf_text}

Based on the content above, please provide the following in a structured format:

1. POST CAPTIONS (provide 3 different versions):
   - Version 1: Professional and formal tone
   - Version 2: Engaging and storytelling approach
   - Version 3: Technical and achievement-focused

2. HASHTAGS:
   - Provide 10-15 relevant hashtags
   - Mix of popular and niche hashtags
   - Industry-specific hashtags

3. PEOPLE/ENTITIES TO TAG:
   - Relevant companies in this domain
   - Industry influencers and thought leaders
   - Technology organizations/communities
   - Educational institutions or programs (if applicable)
   - Government ministries or departments (if applicable)

4. TARGET AUDIENCE:
   - Industries to target
   - Job roles that would be interested
   - Companies that might be hiring for similar skills

5. VISUAL CONTENT RECOMMENDATIONS:
   - Type of images to post (screenshots, diagrams, team photos, etc.)
   - Video content ideas
   - Carousel post structure ideas
   - Design tips for visual appeal

6. POSTING STRATEGY:
   - Best time to post
   - Engagement tips
   - How to structure the post for maximum reach

7. KEYWORDS AND SEO:
   - Keywords to include for better discoverability
   - Profile optimization tips based on this project

Format your response in clear sections with headers and bullet points.
"""
        
        return prompt


def get_project_details_interactive() -> Dict:
    """Interactive function to collect project details from user"""
    
    print("\n" + "="*80)
    print("📝 LINKEDIN POST OPTIMIZER - PROJECT DETAILS INPUT")
    print("="*80 + "\n")
    
    project = {}
    
    project['title'] = input("📌 Project Title: ").strip()
    
    print("\n📄 Project Description (press Enter twice when done):")
    description_lines = []
    while True:
        line = input()
        if line == "":
            break
        description_lines.append(line)
    project['description'] = " ".join(description_lines)
    
    print("\n💻 Technologies Used (comma-separated): ")
    tech_input = input().strip()
    project['technologies'] = [t.strip() for t in tech_input.split(',') if t.strip()]
    
    project['outcomes'] = input("\n🎯 Key Outcomes/Results: ").strip()
    project['duration'] = input("⏱️  Project Duration (e.g., 2 months, 1 semester): ").strip()
    project['team_size'] = input("👥 Team Size (e.g., Solo, 3 members): ").strip()
    
    print("\n📂 Project Category:")
    print("  1. Web Development")
    print("  2. Mobile App Development")
    print("  3. AI/Machine Learning")
    print("  4. Data Science/Analytics")
    print("  5. Blockchain/Web3")
    print("  6. IoT/Hardware")
    print("  7. Game Development")
    print("  8. DevOps/Cloud")
    print("  9. Other")
    
    category_map = {
        '1': 'Web Development',
        '2': 'Mobile App Development',
        '3': 'AI/Machine Learning',
        '4': 'Data Science/Analytics',
        '5': 'Blockchain/Web3',
        '6': 'IoT/Hardware',
        '7': 'Game Development',
        '8': 'DevOps/Cloud',
        '9': 'Other'
    }
    
    category_choice = input("Choose category (1-9): ").strip()
    project['category'] = category_map.get(category_choice, 'General')
    
    return project


def main():
    """Main function to run the LinkedIn Post Optimizer"""
    
    # API Key - intentionally left to be provided via environment for security
    API_KEY = os.environ.get('GEMINI_API_KEY', 'YOUR_API_KEY')
    
    print("\n" + "🚀"*40)
    print("     LINKEDIN POST OPTIMIZER FOR STUDENT PROJECTS")
    print("🚀"*40 + "\n")
    
    # Initialize optimizer
    try:
        optimizer = LinkedInPostOptimizer(API_KEY)
        print("✅ Connected to Gemini AI\n")
    except Exception as e:
        print(f"❌ Error initializing: {e}")
        return
    
    # Option to use interactive input or provide details directly
    print("Choose input method:")
    print("1. Interactive input (recommended)")
    print("2. Upload PDF document")
    print("3. Use example project")
    
    choice = input("\nYour choice (1-3): ").strip()
    
    if choice == '1':
        project_details = get_project_details_interactive()
        use_pdf = False
    elif choice == '2':
        # PDF upload option
        use_pdf = True
        print("\n📄 PDF Upload Mode")
        print("-" * 80)
        pdf_path = input("Enter the path to your PDF file: ").strip()
        
        # Remove quotes if user copied path with quotes
        pdf_path = pdf_path.strip('"').strip("'")
        
        # Check if file exists
        if not os.path.exists(pdf_path):
            print(f"❌ Error: File not found at '{pdf_path}'")
            print("Please make sure the file path is correct and try again.")
            return
        
        # Check if it's a PDF
        if not pdf_path.lower().endswith('.pdf'):
            print("❌ Error: File must be a PDF (.pdf extension)")
            return
    else:
        # Example project
        project_details = {
            'title': 'Smart Campus Navigation System',
            'description': 'Developed an AI-powered mobile application that helps students navigate the campus using indoor positioning and provides real-time updates about class schedules, events, and facilities.',
            'technologies': ['React Native', 'Python', 'TensorFlow', 'Firebase', 'Google Maps API'],
            'outcomes': 'Successfully deployed to 500+ students, reduced navigation time by 40%, won Best Innovation Award at college tech fest',
            'duration': '4 months',
            'team_size': '4 members',
            'category': 'Mobile App Development'
        }
        print("\n📋 Using example project: Smart Campus Navigation System")
        use_pdf = False
    
    # Generate suggestions
    print("\n⏳ Analyzing your project and generating LinkedIn post suggestions...\n")
    
    try:
        if use_pdf:
            suggestions = optimizer.analyze_project_from_pdf(pdf_path)
        else:
            suggestions = optimizer.analyze_project(project_details)
        
        # Display suggestions
        print(suggestions['formatted_output'])
        
        # Ask if user wants to save
        save_choice = input("\n💾 Would you like to save these suggestions to a file? (y/n): ").strip().lower()
        
        if save_choice == 'y':
            filename = input("Enter filename (or press Enter for default 'linkedin_suggestions.txt'): ").strip()
            if not filename:
                filename = "linkedin_suggestions.txt"
            if not filename.endswith('.txt'):
                filename += '.txt'
            
            optimizer.save_suggestions(suggestions, filename)
        
        print("\n✨ Done! Good luck with your LinkedIn post! ✨\n")
        
    except Exception as e:
        print(f"\n❌ Error generating suggestions: {e}")
        print("Please check your API key and internet connection.")


if __name__ == "__main__":
    main()
