import requests
import re
from bs4 import BeautifulSoup

def extract_username(url_or_username):
    """Extract HackerRank username from URL or return username as-is"""
    if not url_or_username:
        return None
    
    # If it's just a username, return it
    if '/' not in url_or_username and '.' not in url_or_username:
        return url_or_username.strip()
    
    # Extract from HackerRank URL - updated patterns
    patterns = [
        r'hackerrank\.com/profile/([^/\s?]+)',  # New format with /profile/
        r'hackerrank\.com/([^/\s?]+)(?:\?|$)',  # Old format
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url_or_username)
        if match:
            username = match.group(1).strip()
            # Skip if it's just 'profile' (common mistake)
            if username.lower() != 'profile':
                return username
    
    # If no pattern matched, try to get the last path segment
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url_or_username)
        path_parts = [p for p in parsed.path.split('/') if p and p.lower() != 'profile']
        if path_parts:
            return path_parts[-1].strip()
    except:
        pass
    
    return url_or_username.strip()

def scrape_profile(url_or_username):
    """
    Scrape HackerRank profile using HackerRank API
    Returns a dictionary with profile information
    """
    username = extract_username(url_or_username)
    
    if not username:
        raise ValueError("Invalid HackerRank username or URL")
    
    if username.lower() == 'profile':
        raise ValueError("Could not extract username from URL. Please provide the full URL (e.g., https://www.hackerrank.com/profile/username) or just the username")
    
    # HackerRank API endpoint
    api_url = f"https://www.hackerrank.com/rest/hackers/{username}/scores_elo"
    profile_url = f"https://www.hackerrank.com/rest/hackers/{username}"
    badges_url = f"https://www.hackerrank.com/rest/hackers/{username}/badges"
    
    headers = {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        # Fetch basic profile data
        profile_response = requests.get(profile_url, headers=headers, timeout=10)
        
        if profile_response.status_code == 404:
            raise ValueError(f"HackerRank user '{username}' not found")
        elif profile_response.status_code != 200:
            raise Exception(f"HackerRank API error: {profile_response.status_code}")
        
        profile_data = profile_response.json()
        model = profile_data.get('model', {})
        
        # Fetch scores
        scores_response = requests.get(api_url, headers=headers, timeout=10)
        scores_data = scores_response.json() if scores_response.status_code == 200 else []
        
        # Fetch badges
        badges_response = requests.get(badges_url, headers=headers, timeout=10)
        badges_data = badges_response.json() if badges_response.status_code == 200 else []
        
        # Extract badges first
        # badges_data is already a list of badge models
        badges_list = badges_data if isinstance(badges_data, list) else badges_data.get('models', [])
        total_badges = len(badges_list)
        
        # Extract scores by category from scores API
        scores = {}
        total_score = 0
        # scores_data is already a list of models
        models = scores_data if isinstance(scores_data, list) else scores_data.get('models', [])
        
        for item in models:
            category = item.get('category', 'unknown')
            score = item.get('score', 0)
            scores[category] = score
            total_score += score
        
        # If scores are empty, try to get from badges
        if total_score == 0:
            for badge in badges_list:
                badge_type = badge.get('badge_type', '').title()
                current_points = badge.get('current_points', 0)
                if badge_type and current_points:
                    scores[badge_type] = current_points
                    total_score += current_points
        
        # Get stars per category from badge data
        stars = {}
        for badge in badges_list:
            badge_type = badge.get('badge_type', '').lower()
            current_stars = badge.get('stars', 0)
            
            # Map badge types to our categories
            if badge_type == 'python':
                stars['Python'] = current_stars
            elif badge_type == 'java':
                stars['Java'] = current_stars
            elif badge_type == 'problem solving':
                stars['Problem Solving'] = current_stars
            elif badge_type == 'sql':
                stars['SQL'] = current_stars
        
        result = {
            'hackerrank_username': username,
            'profile_url': f"https://www.hackerrank.com/{username}",
            'name': model.get('name'),
            'country': model.get('country'),
            'avatar': model.get('avatar'),
            'school': model.get('school'),
            'level': int(model.get('level', 0)),
            'total_score': float(total_score),
            'total_badges': int(total_badges),
            'python_score': float(scores.get('Python', 0)),
            'java_score': float(scores.get('Java', 0)),
            'cpp_score': float(scores.get('C++', 0)),
            'problem_solving_score': float(scores.get('Problem Solving', 0)),
            'algorithms_score': float(scores.get('Algorithms', 0)),
            'data_structures_score': float(scores.get('Data Structures', 0)),
            'python_stars': int(stars.get('Python', 0)),
            'java_stars': int(stars.get('Java', 0)),
            'problem_solving_stars': int(stars.get('Problem Solving', 0)),
            'sql_stars': int(stars.get('SQL', 0)),
            'full_data': {
                'profile': model,
                'scores': scores,
                'badges': badges_list
            }
        }
        
        return result
        
    except requests.exceptions.Timeout:
        raise Exception("HackerRank API request timed out")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to fetch HackerRank profile: {str(e)}")
    except Exception as e:
        raise Exception(f"Error scraping HackerRank profile: {str(e)}")
