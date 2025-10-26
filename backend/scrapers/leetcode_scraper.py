"""
LeetCode Profile Scraper Module
"""

import requests
import json
import re
from datetime import datetime, timedelta


class LeetCodeScraper:
    def __init__(self):
        self.base_url = "https://leetcode.com"
        self.graphql_url = "https://leetcode.com/graphql"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Content-Type': 'application/json',
        }
    
    def extract_username(self, profile_url):
        """Extract username from LeetCode profile URL"""
        patterns = [
            r'leetcode\.com/([^/]+)/?$',
            r'leetcode\.com/u/([^/]+)/?$'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, profile_url)
            if match:
                return match.group(1)
        
        raise ValueError("Invalid LeetCode profile URL")
    
    def get_user_profile(self, username):
        """Fetch user profile data using GraphQL API"""
        query = """
        query getUserProfile($username: String!) {
            matchedUser(username: $username) {
                username
                profile {
                    realName
                    userAvatar
                    ranking
                    reputation
                    countryName
                }
                submitStats {
                    acSubmissionNum {
                        difficulty
                        count
                    }
                }
                userCalendar {
                    streak
                    totalActiveDays
                    submissionCalendar
                }
            }
        }
        """
        
        variables = {"username": username}
        payload = {"query": query, "variables": variables}
        
        try:
            response = requests.post(self.graphql_url, json=payload, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching profile: {e}")
            return None
    
    def get_contest_info(self, username):
        """Fetch user contest information"""
        query = """
        query userContestRankingInfo($username: String!) {
            userContestRanking(username: $username) {
                attendedContestsCount
                rating
                globalRanking
            }
        }
        """
        
        variables = {"username": username}
        payload = {"query": query, "variables": variables}
        
        try:
            response = requests.post(self.graphql_url, json=payload, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Error fetching contest data: {e}")
            return None
    
    def scrape_profile(self, profile_url):
        """Main method to scrape LeetCode profile"""
        try:
            username = self.extract_username(profile_url)
            profile_data = self.get_user_profile(username)
            contest_data = self.get_contest_info(username)
            
            if not profile_data or 'data' not in profile_data:
                return {"error": "Failed to fetch profile data"}
            
            data = profile_data.get('data', {})
            matched_user = data.get('matchedUser')
            
            if not matched_user:
                return {"error": f"User '{username}' not found"}
            
            profile = matched_user.get('profile', {})
            submit_stats = matched_user.get('submitStats', {})
            calendar = matched_user.get('userCalendar', {})
            
            # Process submission stats
            ac_submissions = submit_stats.get('acSubmissionNum', [])
            problems_solved = {'easy': 0, 'medium': 0, 'hard': 0, 'total': 0}
            
            for item in ac_submissions:
                difficulty = item.get('difficulty', '').lower()
                count = item.get('count', 0)
                if difficulty in ['easy', 'medium', 'hard']:
                    problems_solved[difficulty] = count
                elif difficulty == 'all':
                    problems_solved['total'] = count
            
            # Calculate max streak from calendar
            submission_calendar_raw = calendar.get('submissionCalendar', '{}')
            try:
                submission_calendar = json.loads(submission_calendar_raw) if submission_calendar_raw else {}
            except:
                submission_calendar = {}
            
            max_streak = 0
            if submission_calendar:
                sorted_dates = sorted(submission_calendar.keys(), key=lambda x: int(x))
                temp_streak = 0
                prev_date = None
                
                for date_str in sorted_dates:
                    date = datetime.fromtimestamp(int(date_str))
                    if prev_date and (date - prev_date).days == 1:
                        temp_streak += 1
                    else:
                        max_streak = max(max_streak, temp_streak)
                        temp_streak = 1
                    prev_date = date
                
                max_streak = max(max_streak, temp_streak)
            
            # Extract contest information
            contest_info = {}
            if contest_data and 'data' in contest_data:
                contest_ranking = contest_data['data'].get('userContestRanking')
                if contest_ranking:
                    contest_info = {
                        'attended_contests': contest_ranking.get('attendedContestsCount', 0),
                        'rating': round(contest_ranking.get('rating', 0), 2),
                        'global_ranking': contest_ranking.get('globalRanking', 'N/A')
                    }
            
            # Compile structured data
            structured_data = {
                'username': matched_user.get('username'),
                'profile_url': profile_url,
                'profile': {
                    'real_name': profile.get('realName', 'N/A'),
                    'avatar': profile.get('userAvatar', ''),
                    'ranking': profile.get('ranking', 0),
                    'reputation': profile.get('reputation', 0),
                    'country': profile.get('countryName', 'N/A')
                },
                'statistics': {
                    'problems_solved': problems_solved,
                    'total_active_days': calendar.get('totalActiveDays', 0),
                    'current_streak': calendar.get('streak', 0),
                    'max_streak': max_streak
                },
                'contests': contest_info,
                'scraped_at': datetime.now().isoformat()
            }
            
            return structured_data
        
        except Exception as e:
            return {"error": str(e)}
