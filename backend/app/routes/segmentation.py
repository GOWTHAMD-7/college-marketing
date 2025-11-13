from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
import pandas as pd
import os
from pathlib import Path

router = APIRouter()

# Path to the default segmentation CSV
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_CSV = BACKEND_DIR / "student_data_with_segments_20251005_223612.csv"

def analyze_csv_data(df: pd.DataFrame):
    """Analyze the segmented CSV data and return insights"""
    
    total_students = len(df)
    
    # Geographic Distribution
    geo_dist = df['geographic_segment'].value_counts()
    geographic_segments = [
        {
            "name": name,
            "count": int(count),
            "percentage": round((count / total_students) * 100, 1)
        }
        for name, count in geo_dist.items()
    ]
    
    # Academic Performance
    acad_dist = df['academic_segment'].value_counts()
    academic_segments = [
        {
            "name": name,
            "count": int(count),
            "percentage": round((count / total_students) * 100, 1)
        }
        for name, count in acad_dist.items()
    ]
    
    # Socio-Economic Status
    socio_dist = df['socioeconomic_segment'].value_counts()
    socioeconomic_segments = [
        {
            "name": name,
            "count": int(count),
            "percentage": round((count / total_students) * 100, 1)
        }
        for name, count in socio_dist.items()
    ]
    
    # Marketing Channels
    marketing_dist = df['marketing_channel_type'].value_counts()
    marketing_channels = [
        {
            "name": name,
            "count": int(count),
            "percentage": round((count / total_students) * 100, 1)
        }
        for name, count in marketing_dist.items()
    ]
    
    # Accommodation preferences
    accom_dist = df['accommodation'].value_counts()
    accommodation_segments = [
        {
            "name": name,
            "count": int(count),
            "percentage": round((count / total_students) * 100, 1)
        }
        for name, count in accom_dist.items()
    ]
    
    # Parent sentiment
    sentiment_dist = df['parents_sentiment'].value_counts()
    parent_sentiments = [
        {
            "name": name,
            "count": int(count),
            "percentage": round((count / total_students) * 100, 1)
        }
        for name, count in sentiment_dist.items()
    ]
    
    # Generate insights
    insights = generate_insights(df, geographic_segments, marketing_channels, academic_segments)
    
    return {
        "total_students": total_students,
        "segments_created": 7,
        "geographic_segments": geographic_segments,
        "academic_segments": academic_segments,
        "socioeconomic_segments": socioeconomic_segments,
        "marketing_channels": marketing_channels,
        "accommodation_segments": accommodation_segments,
        "parent_sentiments": parent_sentiments,
        "insights": insights
    }

def generate_insights(df, geo_segments, marketing_channels, academic_segments):
    """Generate marketing insights from the data"""
    
    insights = []
    
    # Find dominant geographic segment
    if geo_segments:
        top_geo = max(geo_segments, key=lambda x: x['count'])
        if top_geo['name'] == 'Local':
            insights.append({
                "icon": "📍",
                "title": "Local Market Dominance",
                "description": f"{top_geo['percentage']}% of students are from local areas. Focus on strengthening day-scholar facilities and local outreach programs."
            })
        elif top_geo['name'] == 'Metro':
            insights.append({
                "icon": "🏙️",
                "title": "Metro Market Strength",
                "description": f"{top_geo['percentage']}% from metro cities. Invest in hostel facilities and metro-specific digital campaigns."
            })
    
    # Marketing channel insight
    if marketing_channels:
        top_channel = max(marketing_channels, key=lambda x: x['count'])
        insights.append({
            "icon": "💻" if top_channel['name'] == 'Digital' else "🤝" if top_channel['name'] == 'Referral' else "📺",
            "title": f"{top_channel['name']} Channel Success",
            "description": f"{top_channel['percentage']}% of admissions come from {top_channel['name'].lower()} channels. {'Increase investment in social media and Google ads.' if top_channel['name'] == 'Digital' else 'Strengthen referral programs with incentives.' if top_channel['name'] == 'Referral' else 'Optimize traditional marketing ROI.'}"
        })
    
    # Academic performance insight
    if academic_segments:
        high_performers = next((seg for seg in academic_segments if seg['name'] == 'High Performer'), None)
        if high_performers:
            insights.append({
                "icon": "🎓",
                "title": "High Performer Attraction",
                "description": f"{high_performers['percentage']}% are high performers. Showcase advanced learning opportunities and research facilities to attract top talent."
            })
    
    # Growth opportunity
    metro_seg = next((seg for seg in geo_segments if seg['name'] == 'Metro'), None)
    if metro_seg and metro_seg['percentage'] < 35:
        insights.append({
            "icon": "🎯",
            "title": "Metro Expansion Opportunity",
            "description": f"Only {metro_seg['percentage']}% metro students - significant growth potential. Target Chennai, Bangalore, and Hyderabad with specialized campaigns."
        })
    
    return insights[:4]  # Return top 4 insights

@router.get("/initial-analysis")
async def get_initial_analysis():
    """Get initial analysis from the default segmented CSV file"""
    try:
        if not DEFAULT_CSV.exists():
            raise HTTPException(status_code=404, detail="Default segmentation data not found")
        
        # Read CSV
        df = pd.read_csv(DEFAULT_CSV)
        
        # Analyze data
        analysis = analyze_csv_data(df)
        
        return JSONResponse(content=analysis)
    
    except Exception as e:
        print(f"Error loading initial analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to load initial analysis: {str(e)}")

@router.post("/analyze-new-data")
async def analyze_new_data(file: UploadFile = File(...)):
    """Analyze a newly uploaded CSV file"""
    try:
        # Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are allowed")
        
        # Read uploaded CSV
        contents = await file.read()
        
        # Save temporarily and analyze
        import io
        df = pd.read_csv(io.BytesIO(contents))
        
        # Check if required columns exist
        required_columns = ['geographic_segment', 'academic_segment', 'socioeconomic_segment', 
                          'marketing_channel_type', 'accommodation', 'parents_sentiment']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail=f"CSV missing required columns: {', '.join(missing_columns)}"
            )
        
        # Analyze data
        analysis = analyze_csv_data(df)
        
        return JSONResponse(content=analysis)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error analyzing new data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze data: {str(e)}")
