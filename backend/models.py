from sqlalchemy import Column, Integer, String, DateTime, JSON, Float
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class LeetCodeProfile(Base):
    __tablename__ = "leetcode_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)  # Student username
    leetcode_username = Column(String)
    profile_url = Column(String)
    
    # Profile data
    real_name = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    ranking = Column(Integer, nullable=True)
    reputation = Column(Integer, default=0)
    country = Column(String, nullable=True)
    
    # Statistics
    total_solved = Column(Integer, default=0)
    easy_solved = Column(Integer, default=0)
    medium_solved = Column(Integer, default=0)
    hard_solved = Column(Integer, default=0)
    acceptance_rate = Column(Float, default=0.0)
    total_active_days = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    max_streak = Column(Integer, default=0)
    
    # Contest info
    contest_rating = Column(Float, nullable=True)
    contest_ranking = Column(String, nullable=True)
    contests_attended = Column(Integer, default=0)
    
    # Full data (JSON)
    full_data = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class GitHubProfile(Base):
    __tablename__ = "github_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)  # Student username
    github_username = Column(String)
    profile_url = Column(String)
    
    # Profile data
    name = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    company = Column(String, nullable=True)
    location = Column(String, nullable=True)
    email = Column(String, nullable=True)
    blog = Column(String, nullable=True)
    twitter_username = Column(String, nullable=True)
    
    # Statistics
    public_repos = Column(Integer, default=0)
    public_gists = Column(Integer, default=0)
    followers = Column(Integer, default=0)
    following = Column(Integer, default=0)
    total_stars = Column(Integer, default=0)
    total_forks = Column(Integer, default=0)
    top_languages = Column(JSON, nullable=True)  # Array of languages
    
    # Full data (JSON)
    full_data = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class HackerRankProfile(Base):
    __tablename__ = "hackerrank_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)  # Student username
    hackerrank_username = Column(String)
    profile_url = Column(String)
    
    # Profile data
    name = Column(String, nullable=True)
    country = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    school = Column(String, nullable=True)
    level = Column(Integer, default=0)
    
    # Statistics
    total_score = Column(Float, default=0)
    total_badges = Column(Integer, default=0)
    
    # Language scores
    python_score = Column(Float, default=0)
    java_score = Column(Float, default=0)
    cpp_score = Column(Float, default=0)
    problem_solving_score = Column(Float, default=0)
    algorithms_score = Column(Float, default=0)
    data_structures_score = Column(Float, default=0)
    
    # Stars by category
    python_stars = Column(Integer, default=0)
    java_stars = Column(Integer, default=0)
    problem_solving_stars = Column(Integer, default=0)
    sql_stars = Column(Integer, default=0)
    
    # Full data (JSON)
    full_data = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
