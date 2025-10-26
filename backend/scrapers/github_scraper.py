import requests
import re
from datetime import datetime

def extract_username(url_or_username):
    """Extract GitHub username from URL or return username as-is"""
    if not url_or_username:
        return None
    
    # If it's just a username, return it
    if '/' not in url_or_username and '.' not in url_or_username:
        return url_or_username.strip()
    
    # Extract from GitHub URL
    patterns = [
        r'github\.com/([^/\s]+)',
        r'github\.com/u/([^/\s]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url_or_username)
        if match:
            return match.group(1).strip()
    
    return url_or_username.strip()

def scrape_profile(url_or_username):
    """
    Scrape GitHub profile using GitHub API (public data)
    Returns a dictionary with profile information
    """
    username = extract_username(url_or_username)
    
    if not username:
        raise ValueError("Invalid GitHub username or URL")
    
    # GitHub API endpoints
    user_url = f"https://api.github.com/users/{username}"
    repos_url = f"https://api.github.com/users/{username}/repos?per_page=100"
    
    headers = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Mozilla/5.0'
    }
    
    try:
        # Fetch user data
        user_response = requests.get(user_url, headers=headers, timeout=10)
        
        if user_response.status_code == 404:
            raise ValueError(f"GitHub user '{username}' not found")
        elif user_response.status_code != 200:
            raise Exception(f"GitHub API error: {user_response.status_code}")
        
        user_data = user_response.json()
        
        # Fetch repositories
        repos_response = requests.get(repos_url, headers=headers, timeout=10)
        repos_data = repos_response.json() if repos_response.status_code == 200 else []
        
        # Calculate stats
        total_repos = user_data.get('public_repos', 0)
        total_gists = user_data.get('public_gists', 0)
        followers = user_data.get('followers', 0)
        following = user_data.get('following', 0)
        
        # Calculate stars, forks, and languages from repos
        total_stars = 0
        total_forks = 0
        languages = {}
        
        for repo in repos_data:
            total_stars += repo.get('stargazers_count', 0)
            total_forks += repo.get('forks_count', 0)
            lang = repo.get('language')
            if lang:
                languages[lang] = languages.get(lang, 0) + 1
        
        # Get top 5 languages
        top_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)[:5]
        top_languages_list = [lang for lang, _ in top_languages]
        
        profile_data = {
            'github_username': username,
            'profile_url': f"https://github.com/{username}",
            'name': user_data.get('name'),
            'bio': user_data.get('bio'),
            'avatar_url': user_data.get('avatar_url'),
            'company': user_data.get('company'),
            'location': user_data.get('location'),
            'email': user_data.get('email'),
            'blog': user_data.get('blog'),
            'twitter_username': user_data.get('twitter_username'),
            'public_repos': total_repos,
            'public_gists': total_gists,
            'followers': followers,
            'following': following,
            'total_stars': total_stars,
            'total_forks': total_forks,
            'top_languages': top_languages_list,
            'full_data': user_data
        }
        
        return profile_data
        
    except requests.exceptions.Timeout:
        raise Exception("GitHub API request timed out")
    except requests.exceptions.RequestException as e:
        raise Exception(f"Failed to fetch GitHub profile: {str(e)}")
    except Exception as e:
        raise Exception(f"Error scraping GitHub profile: {str(e)}")
