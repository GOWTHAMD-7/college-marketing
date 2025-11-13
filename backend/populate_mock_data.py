"""
Populate mock data for students 2-10 to demonstrate the platform
Some students will have complete profiles, others partial, and some none
This makes the demo look realistic
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from database import SessionLocal, engine
from models import Base, LeetCodeProfile, GitHubProfile, HackerRankProfile
from datetime import datetime

# Create tables
Base.metadata.create_all(bind=engine)

def clear_existing_mock_data():
    """Clear existing mock data for students 2-10"""
    db = SessionLocal()
    try:
        # Delete existing profiles for students 2-10
        for i in range(2, 11):
            username = f"student{i}"
            db.query(LeetCodeProfile).filter(LeetCodeProfile.username == username).delete()
            db.query(GitHubProfile).filter(GitHubProfile.username == username).delete()
            db.query(HackerRankProfile).filter(HackerRankProfile.username == username).delete()
        db.commit()
        print("✅ Cleared existing mock data")
    except Exception as e:
        db.rollback()
        print(f"❌ Error clearing data: {e}")
    finally:
        db.close()

def add_mock_data():
    """Add realistic mock data for students 2-10"""
    db = SessionLocal()
    
    mock_profiles = {
        # Student 2 - All platforms connected, high performer
        'student2': {
            'leetcode': {
                'leetcode_username': 'alice_coder',
                'profile_url': 'https://leetcode.com/alice_coder',
                'real_name': 'Alice Johnson',
                'ranking': 12453,
                'total_solved': 387,
                'easy_solved': 156,
                'medium_solved': 189,
                'hard_solved': 42,
                'current_streak': 23,
                'max_streak': 67,
                'total_active_days': 234,
                'contest_rating': 1847,
                'contests_attended': 15
            },
            'github': {
                'github_username': 'alice-codes',
                'profile_url': 'https://github.com/alice-codes',
                'name': 'Alice Johnson',
                'bio': 'Full-stack developer | React enthusiast',
                'public_repos': 42,
                'public_gists': 8,
                'followers': 89,
                'following': 56,
                'total_stars': 234,
                'total_forks': 67,
                'top_languages': ['JavaScript', 'Python', 'TypeScript', 'CSS']
            },
            'hackerrank': {
                'hackerrank_username': 'alice_j',
                'profile_url': 'https://www.hackerrank.com/alice_j',
                'name': 'Alice Johnson',
                'country': 'United States',
                'level': 7,
                'total_score': 2456.8,
                'total_badges': 23,
                'python_score': 876.5,
                'java_score': 543.2,
                'problem_solving_score': 1234.7,
                'python_stars': 5,
                'java_stars': 4,
                'problem_solving_stars': 5,
                'sql_stars': 3
            }
        },
        
        # Student 3 - Only LeetCode and GitHub
        'student3': {
            'leetcode': {
                'leetcode_username': 'bob_algorithm',
                'profile_url': 'https://leetcode.com/bob_algorithm',
                'real_name': 'Bob Smith',
                'ranking': 45678,
                'total_solved': 156,
                'easy_solved': 89,
                'medium_solved': 54,
                'hard_solved': 13,
                'current_streak': 7,
                'max_streak': 21,
                'total_active_days': 98,
                'contest_rating': 1523,
                'contests_attended': 6
            },
            'github': {
                'github_username': 'bobsmith-dev',
                'profile_url': 'https://github.com/bobsmith-dev',
                'name': 'Bob Smith',
                'bio': 'Backend developer | Node.js',
                'public_repos': 28,
                'public_gists': 4,
                'followers': 45,
                'following': 67,
                'total_stars': 123,
                'total_forks': 34,
                'top_languages': ['JavaScript', 'Java', 'Python']
            }
        },
        
        # Student 4 - Only GitHub (active in open source)
        'student4': {
            'github': {
                'github_username': 'charlie-opensource',
                'profile_url': 'https://github.com/charlie-opensource',
                'name': 'Charlie Brown',
                'bio': 'Open source contributor | Go & Rust',
                'public_repos': 67,
                'public_gists': 15,
                'followers': 234,
                'following': 123,
                'total_stars': 567,
                'total_forks': 189,
                'top_languages': ['Go', 'Rust', 'Python', 'Shell']
            }
        },
        
        # Student 5 - All platforms, moderate performer
        'student5': {
            'leetcode': {
                'leetcode_username': 'diana_codes',
                'profile_url': 'https://leetcode.com/diana_codes',
                'real_name': 'Diana Prince',
                'ranking': 67890,
                'total_solved': 234,
                'easy_solved': 123,
                'medium_solved': 89,
                'hard_solved': 22,
                'current_streak': 12,
                'max_streak': 34,
                'total_active_days': 156,
                'contest_rating': 1634,
                'contests_attended': 9
            },
            'github': {
                'github_username': 'diana-dev',
                'profile_url': 'https://github.com/diana-dev',
                'name': 'Diana Prince',
                'bio': 'Mobile app developer | Flutter',
                'public_repos': 31,
                'public_gists': 6,
                'followers': 67,
                'following': 89,
                'total_stars': 178,
                'total_forks': 45,
                'top_languages': ['Dart', 'JavaScript', 'Swift', 'Kotlin']
            },
            'hackerrank': {
                'hackerrank_username': 'diana_p',
                'profile_url': 'https://www.hackerrank.com/diana_p',
                'name': 'Diana Prince',
                'country': 'Canada',
                'level': 5,
                'total_score': 1567.4,
                'total_badges': 15,
                'python_score': 567.3,
                'java_score': 345.6,
                'problem_solving_score': 789.2,
                'python_stars': 4,
                'java_stars': 3,
                'problem_solving_stars': 4,
                'sql_stars': 2
            }
        },
        
        # Student 6 - Only HackerRank (competitive coder)
        'student6': {
            'hackerrank': {
                'hackerrank_username': 'eve_hacker',
                'profile_url': 'https://www.hackerrank.com/eve_hacker',
                'name': 'Eve Anderson',
                'country': 'United Kingdom',
                'level': 6,
                'total_score': 1987.6,
                'total_badges': 19,
                'python_score': 723.4,
                'java_score': 456.8,
                'problem_solving_score': 987.5,
                'python_stars': 5,
                'java_stars': 3,
                'problem_solving_stars': 5,
                'sql_stars': 4
            }
        },
        
        # Student 7 - LeetCode and HackerRank
        'student7': {
            'leetcode': {
                'leetcode_username': 'frank_solver',
                'profile_url': 'https://leetcode.com/frank_solver',
                'real_name': 'Frank Miller',
                'ranking': 34567,
                'total_solved': 298,
                'easy_solved': 134,
                'medium_solved': 123,
                'hard_solved': 41,
                'current_streak': 18,
                'max_streak': 45,
                'total_active_days': 187,
                'contest_rating': 1756,
                'contests_attended': 12
            },
            'hackerrank': {
                'hackerrank_username': 'frank_m',
                'profile_url': 'https://www.hackerrank.com/frank_m',
                'name': 'Frank Miller',
                'country': 'Australia',
                'level': 6,
                'total_score': 2123.5,
                'total_badges': 21,
                'python_score': 789.4,
                'java_score': 678.3,
                'problem_solving_score': 1045.6,
                'python_stars': 5,
                'java_stars': 4,
                'problem_solving_stars': 5,
                'sql_stars': 3
            }
        },
        
        # Student 8 - Nothing connected (new student)
        # No data
        
        # Student 9 - Only GitHub (beginner)
        'student9': {
            'github': {
                'github_username': 'grace-learning',
                'profile_url': 'https://github.com/grace-learning',
                'name': 'Grace Hopper',
                'bio': 'Computer Science student | Learning to code',
                'public_repos': 12,
                'public_gists': 2,
                'followers': 23,
                'following': 45,
                'total_stars': 34,
                'total_forks': 8,
                'top_languages': ['Python', 'HTML', 'CSS']
            }
        },
        
        # Student 10 - All platforms, beginner level
        'student10': {
            'leetcode': {
                'leetcode_username': 'henry_newbie',
                'profile_url': 'https://leetcode.com/henry_newbie',
                'real_name': 'Henry Wilson',
                'ranking': 123456,
                'total_solved': 67,
                'easy_solved': 54,
                'medium_solved': 12,
                'hard_solved': 1,
                'current_streak': 3,
                'max_streak': 8,
                'total_active_days': 34,
                'contest_rating': 1234,
                'contests_attended': 2
            },
            'github': {
                'github_username': 'henry-codes',
                'profile_url': 'https://github.com/henry-codes',
                'name': 'Henry Wilson',
                'bio': 'Aspiring developer',
                'public_repos': 8,
                'public_gists': 1,
                'followers': 12,
                'following': 34,
                'total_stars': 15,
                'total_forks': 3,
                'top_languages': ['JavaScript', 'Python']
            },
            'hackerrank': {
                'hackerrank_username': 'henry_w',
                'profile_url': 'https://www.hackerrank.com/henry_w',
                'name': 'Henry Wilson',
                'country': 'India',
                'level': 3,
                'total_score': 456.7,
                'total_badges': 5,
                'python_score': 234.5,
                'java_score': 123.4,
                'problem_solving_score': 345.6,
                'python_stars': 2,
                'java_stars': 1,
                'problem_solving_stars': 2,
                'sql_stars': 1
            }
        }
    }
    
    try:
        current_time = datetime.utcnow()
        
        for username, platforms in mock_profiles.items():
            print(f"\n📝 Adding data for {username}...")
            
            # Add LeetCode profile if exists
            if 'leetcode' in platforms:
                leetcode = LeetCodeProfile(
                    username=username,
                    **platforms['leetcode'],
                    last_updated=current_time
                )
                db.add(leetcode)
                print(f"  ✅ Added LeetCode: {platforms['leetcode']['leetcode_username']}")
            
            # Add GitHub profile if exists
            if 'github' in platforms:
                github = GitHubProfile(
                    username=username,
                    **platforms['github'],
                    last_updated=current_time
                )
                db.add(github)
                print(f"  ✅ Added GitHub: {platforms['github']['github_username']}")
            
            # Add HackerRank profile if exists
            if 'hackerrank' in platforms:
                hackerrank = HackerRankProfile(
                    username=username,
                    **platforms['hackerrank'],
                    last_updated=current_time
                )
                db.add(hackerrank)
                print(f"  ✅ Added HackerRank: {platforms['hackerrank']['hackerrank_username']}")
        
        db.commit()
        print("\n" + "="*60)
        print("✅ Mock data population complete!")
        print("="*60)
        print("\n📊 Summary:")
        print("  • Student 2: All platforms (high performer)")
        print("  • Student 3: LeetCode + GitHub")
        print("  • Student 4: GitHub only (open source)")
        print("  • Student 5: All platforms (moderate)")
        print("  • Student 6: HackerRank only")
        print("  • Student 7: LeetCode + HackerRank")
        print("  • Student 8: Nothing connected")
        print("  • Student 9: GitHub only (beginner)")
        print("  • Student 10: All platforms (beginner)")
        print("\n💡 Note: Student 1 is reserved for REAL data from student login")
        print("💡 When students connect their accounts, real data will override mock data")
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error adding mock data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Starting mock data population...\n")
    clear_existing_mock_data()
    add_mock_data()
    print("\n🎉 Done! You can now test the Student Achievements page with realistic data.")
