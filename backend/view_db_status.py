# Quick Test - View Current Database Status
# Run this to see what data is currently in the database

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from database import SessionLocal
from models import LeetCodeProfile, GitHubProfile, HackerRankProfile

def view_database_status():
    """Display current database status for all students"""
    db = SessionLocal()
    
    print("\n" + "="*70)
    print("📊 CURRENT DATABASE STATUS")
    print("="*70)
    
    for i in range(1, 11):
        username = f"student{i}"
        print(f"\n{'🎯' if i == 1 else '📝'} {username.upper()}")
        print("-" * 70)
        
        # Check LeetCode
        leetcode = db.query(LeetCodeProfile).filter(
            LeetCodeProfile.username == username
        ).first()
        
        if leetcode:
            print(f"  ✅ LeetCode: {leetcode.leetcode_username}")
            print(f"     • Problems: {leetcode.total_solved} | Rating: {leetcode.contest_rating or 'N/A'}")
        else:
            print("  ❌ LeetCode: Not Connected")
        
        # Check GitHub
        github = db.query(GitHubProfile).filter(
            GitHubProfile.username == username
        ).first()
        
        if github:
            print(f"  ✅ GitHub: {github.github_username}")
            print(f"     • Repos: {github.public_repos} | Stars: {github.total_stars}")
        else:
            print("  ❌ GitHub: Not Connected")
        
        # Check HackerRank
        hackerrank = db.query(HackerRankProfile).filter(
            HackerRankProfile.username == username
        ).first()
        
        if hackerrank:
            print(f"  ✅ HackerRank: {hackerrank.hackerrank_username}")
            print(f"     • Level: {hackerrank.level} | Score: {hackerrank.total_score:.1f}")
        else:
            print("  ❌ HackerRank: Not Connected")
    
    print("\n" + "="*70)
    print("💡 Legend:")
    print("   🎯 = Reserved for REAL data (Student 1)")
    print("   📝 = Can have mock or real data (Students 2-10)")
    print("="*70 + "\n")
    
    db.close()

if __name__ == "__main__":
    view_database_status()
