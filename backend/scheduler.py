from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from database import SessionLocal
from models import LeetCodeProfile, GitHubProfile, HackerRankProfile
from scrapers.leetcode_scraper import LeetCodeScraper
from scrapers import github_scraper, hackerrank_scraper

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

leetcode_scraper = LeetCodeScraper()


def update_all_leetcode_profiles():
    """Update all LeetCode profiles in the database"""
    db = SessionLocal()
    try:
        profiles = db.query(LeetCodeProfile).all()
        logger.info(f"Starting auto-update for {len(profiles)} LeetCode profiles")
        
        for profile in profiles:
            try:
                logger.info(f"Updating LeetCode profile for {profile.username}")
                
                # Scrape latest data
                scraped_data = leetcode_scraper.scrape_profile(profile.profile_url)
                
                if "error" not in scraped_data:
                    # Update profile
                    profile.real_name = scraped_data['profile']['real_name']
                    profile.avatar = scraped_data['profile']['avatar']
                    profile.ranking = scraped_data['profile']['ranking']
                    profile.reputation = scraped_data['profile']['reputation']
                    profile.total_solved = scraped_data['statistics']['problems_solved']['total']
                    profile.easy_solved = scraped_data['statistics']['problems_solved']['easy']
                    profile.medium_solved = scraped_data['statistics']['problems_solved']['medium']
                    profile.hard_solved = scraped_data['statistics']['problems_solved']['hard']
                    profile.current_streak = scraped_data['statistics']['current_streak']
                    profile.max_streak = scraped_data['statistics']['max_streak']
                    profile.total_active_days = scraped_data['statistics']['total_active_days']
                    
                    if scraped_data.get('contests'):
                        profile.contest_rating = scraped_data['contests'].get('rating')
                        profile.contest_ranking = str(scraped_data['contests'].get('global_ranking', 'N/A'))
                        profile.contests_attended = scraped_data['contests'].get('attended_contests', 0)
                    
                    profile.full_data = scraped_data
                    profile.last_updated = datetime.utcnow()
                    
                    db.commit()
                    logger.info(f"Successfully updated LeetCode profile for {profile.username}")
                else:
                    logger.error(f"Error updating LeetCode {profile.username}: {scraped_data['error']}")
            
            except Exception as e:
                logger.error(f"Exception updating LeetCode {profile.username}: {str(e)}")
                continue
        
        logger.info("LeetCode auto-update completed")
    
    except Exception as e:
        logger.error(f"Error in LeetCode auto-update job: {str(e)}")
    finally:
        db.close()


def update_all_github_profiles():
    """Update all GitHub profiles in the database"""
    db = SessionLocal()
    try:
        profiles = db.query(GitHubProfile).all()
        logger.info(f"Starting auto-update for {len(profiles)} GitHub profiles")
        
        for profile in profiles:
            try:
                logger.info(f"Updating GitHub profile for {profile.username}")
                
                # Scrape latest data
                scraped_data = github_scraper.scrape_profile(profile.profile_url)
                
                if "error" not in scraped_data:
                    # Update profile
                    profile.name = scraped_data.get('name')
                    profile.bio = scraped_data.get('bio')
                    profile.avatar_url = scraped_data.get('avatar_url')
                    profile.company = scraped_data.get('company')
                    profile.location = scraped_data.get('location')
                    profile.email = scraped_data.get('email')
                    profile.blog = scraped_data.get('blog')
                    profile.twitter_username = scraped_data.get('twitter_username')
                    profile.public_repos = scraped_data.get('public_repos', 0)
                    profile.public_gists = scraped_data.get('public_gists', 0)
                    profile.followers = scraped_data.get('followers', 0)
                    profile.following = scraped_data.get('following', 0)
                    profile.total_stars = scraped_data.get('total_stars', 0)
                    profile.total_forks = scraped_data.get('total_forks', 0)
                    profile.top_languages = scraped_data.get('top_languages', [])
                    profile.full_data = scraped_data
                    profile.last_updated = datetime.utcnow()
                    
                    db.commit()
                    logger.info(f"Successfully updated GitHub profile for {profile.username}")
                else:
                    logger.error(f"Error updating GitHub {profile.username}: {scraped_data['error']}")
            
            except Exception as e:
                logger.error(f"Exception updating GitHub {profile.username}: {str(e)}")
                continue
        
        logger.info("GitHub auto-update completed")
    
    except Exception as e:
        logger.error(f"Error in GitHub auto-update job: {str(e)}")
    finally:
        db.close()


def update_all_hackerrank_profiles():
    """Update all HackerRank profiles in the database"""
    db = SessionLocal()
    try:
        profiles = db.query(HackerRankProfile).all()
        logger.info(f"Starting auto-update for {len(profiles)} HackerRank profiles")
        
        for profile in profiles:
            try:
                logger.info(f"Updating HackerRank profile for {profile.username}")
                
                # Scrape latest data
                scraped_data = hackerrank_scraper.scrape_profile(profile.profile_url)
                
                if "error" not in scraped_data:
                    # Update profile
                    profile.name = scraped_data.get('name')
                    profile.country = scraped_data.get('country')
                    profile.avatar = scraped_data.get('avatar')
                    profile.school = scraped_data.get('school')
                    profile.level = scraped_data.get('level', 0)
                    profile.total_score = scraped_data.get('total_score', 0)
                    profile.total_badges = scraped_data.get('total_badges', 0)
                    profile.python_score = scraped_data.get('python_score', 0)
                    profile.java_score = scraped_data.get('java_score', 0)
                    profile.problem_solving_score = scraped_data.get('problem_solving_score', 0)
                    profile.python_stars = scraped_data.get('python_stars', 0)
                    profile.java_stars = scraped_data.get('java_stars', 0)
                    profile.problem_solving_stars = scraped_data.get('problem_solving_stars', 0)
                    profile.sql_stars = scraped_data.get('sql_stars', 0)
                    profile.full_data = scraped_data
                    profile.last_updated = datetime.utcnow()
                    
                    db.commit()
                    logger.info(f"Successfully updated HackerRank profile for {profile.username}")
                else:
                    logger.error(f"Error updating HackerRank {profile.username}: {scraped_data['error']}")
            
            except Exception as e:
                logger.error(f"Exception updating HackerRank {profile.username}: {str(e)}")
                continue
        
        logger.info("HackerRank auto-update completed")
    
    except Exception as e:
        logger.error(f"Error in HackerRank auto-update job: {str(e)}")
    finally:
        db.close()


def start_scheduler():
    """Start the background scheduler"""
    scheduler = BackgroundScheduler()
    
    # Schedule LeetCode updates every 1 hour
    scheduler.add_job(
        update_all_leetcode_profiles,
        'interval',
        hours=1,
        id='update_leetcode_profiles',
        name='Update all LeetCode profiles',
        replace_existing=True
    )
    
    # Schedule GitHub updates every 1 hour
    scheduler.add_job(
        update_all_github_profiles,
        'interval',
        hours=1,
        id='update_github_profiles',
        name='Update all GitHub profiles',
        replace_existing=True
    )
    
    # Schedule HackerRank updates every 1 hour
    scheduler.add_job(
        update_all_hackerrank_profiles,
        'interval',
        hours=1,
        id='update_hackerrank_profiles',
        name='Update all HackerRank profiles',
        replace_existing=True
    )
    
    scheduler.start()
    logger.info("Scheduler started - all profiles will be updated every 1 hour")
    
    return scheduler
