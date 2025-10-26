import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './StudentAchievements.css'

interface LeetCodeProfile {
  leetcode_username: string
  profile_url: string
  real_name: string
  avatar: string
  ranking: number
  total_solved: number
  easy_solved: number
  medium_solved: number
  hard_solved: number
  current_streak: number
  max_streak: number
  total_active_days: number
  contest_rating: number
  contest_ranking: string
  contests_attended: number
  last_updated: string
}

interface GitHubProfile {
  github_username: string
  profile_url: string
  name: string
  avatar: string
  bio: string
  location: string
  company: string
  public_repos: number
  followers: number
  following: number
  total_stars: number
  total_forks: number
  top_languages: string[]
  last_updated: string
}

interface HackerRankProfile {
  hackerrank_username: string
  profile_url: string
  name: string
  country: string
  avatar: string
  level: number
  total_score: number
  total_badges: number
  python_score: number
  java_score: number
  problem_solving_score: number
  python_stars: number
  java_stars: number
  problem_solving_stars: number
  sql_stars: number
  last_updated: string
}

interface StudentData {
  username: string
  email: string
  leetcode?: LeetCodeProfile
  github?: GitHubProfile
  hackerrank?: HackerRankProfile
}

function StudentAchievements() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({})

  // List of all student usernames
  const studentUsernames = [
    'student1', 'student2', 'student3', 'student4', 'student5',
    'student6', 'student7', 'student8', 'student9', 'student10'
  ]

  useEffect(() => {
    fetchAllStudentsData()
  }, [])

  const fetchAllStudentsData = async () => {
    setLoading(true)
    const studentsData: StudentData[] = []

    for (const username of studentUsernames) {
      const studentData: StudentData = {
        username,
        email: `${username}@bitsathy.ac.in`
      }

      // Fetch LeetCode profile
      try {
        const leetcodeRes = await fetch(`http://localhost:8000/api/leetcode/profile/${username}`)
        if (leetcodeRes.ok) {
          studentData.leetcode = await leetcodeRes.json()
        }
      } catch (error) {
        console.log(`No LeetCode profile for ${username}`)
      }

      // Fetch GitHub profile
      try {
        const githubRes = await fetch(`http://localhost:8000/api/github/profile/${username}`)
        if (githubRes.ok) {
          studentData.github = await githubRes.json()
        }
      } catch (error) {
        console.log(`No GitHub profile for ${username}`)
      }

      // Fetch HackerRank profile
      try {
        const hackerrankRes = await fetch(`http://localhost:8000/api/hackerrank/profile/${username}`)
        if (hackerrankRes.ok) {
          studentData.hackerrank = await hackerrankRes.json()
        }
      } catch (error) {
        console.log(`No HackerRank profile for ${username}`)
      }

      studentsData.push(studentData)
    }

    setStudents(studentsData)
    setLoading(false)
  }

  const toggleDetails = (username: string) => {
    setShowDetails(prev => ({
      ...prev,
      [username]: !prev[username]
    }))
  }

  const handleBack = () => {
    navigate('/teacher-dashboard')
  }

  const getConnectedPlatformsCount = (student: StudentData) => {
    let count = 0
    if (student.leetcode) count++
    if (student.github) count++
    if (student.hackerrank) count++
    return count
  }

  return (
    <div className="achievements-container">
      <header className="achievements-header">
        <button className="back-button" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </button>
        <h1>Student Achievements</h1>
      </header>

      <main className="achievements-main">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading student data...</p>
          </div>
        ) : (
          <div className="students-grid">
            {students.map((student) => (
              <div key={student.username} className="student-card">
                <div className="student-basic-info">
                  <div className="student-avatar">
                    {student.leetcode?.avatar ? (
                      <img src={student.leetcode.avatar} alt={student.username} />
                    ) : student.github?.avatar ? (
                      <img src={student.github.avatar} alt={student.username} />
                    ) : student.hackerrank?.avatar ? (
                      <img src={student.hackerrank.avatar} alt={student.username} />
                    ) : (
                      <div className="default-avatar">
                        {student.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <div className="student-info">
                    <h3>{student.username}</h3>
                    <p className="student-email">{student.email}</p>
                    <div className="platforms-badge">
                      <span className="badge-icon">🏆</span>
                      {getConnectedPlatformsCount(student)} Platform{getConnectedPlatformsCount(student) !== 1 ? 's' : ''} Connected
                    </div>
                  </div>

                  <button 
                    className="toggle-details-btn"
                    onClick={() => toggleDetails(student.username)}
                  >
                    {showDetails[student.username] ? 'Hide Details' : 'Show More'}
                  </button>
                </div>

                {showDetails[student.username] && (
                  <div className="student-details">
                    {/* LeetCode Details */}
                    {student.leetcode ? (
                      <div className="platform-section leetcode-section">
                        <div className="platform-header">
                          <div className="platform-title">
                            <img src="https://cdn.iconscout.com/icon/free/png-256/leetcode-3628885-3030025.png" alt="LeetCode" />
                            <h4>LeetCode</h4>
                          </div>
                          <a href={student.leetcode.profile_url} target="_blank" rel="noopener noreferrer" className="view-profile-link">
                            View Profile →
                          </a>
                        </div>
                        <div className="platform-stats">
                          <div className="stat-item">
                            <span className="stat-label">Total Solved</span>
                            <span className="stat-value">{student.leetcode.total_solved}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Easy</span>
                            <span className="stat-value easy">{student.leetcode.easy_solved}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Medium</span>
                            <span className="stat-value medium">{student.leetcode.medium_solved}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Hard</span>
                            <span className="stat-value hard">{student.leetcode.hard_solved}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Ranking</span>
                            <span className="stat-value">{student.leetcode.ranking.toLocaleString()}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Current Streak</span>
                            <span className="stat-value">{student.leetcode.current_streak} days</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="platform-section not-connected">
                        <p>❌ LeetCode not connected</p>
                      </div>
                    )}

                    {/* GitHub Details */}
                    {student.github ? (
                      <div className="platform-section github-section">
                        <div className="platform-header">
                          <div className="platform-title">
                            <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" />
                            <h4>GitHub</h4>
                          </div>
                          <a href={student.github.profile_url} target="_blank" rel="noopener noreferrer" className="view-profile-link">
                            View Profile →
                          </a>
                        </div>
                        <div className="platform-stats">
                          <div className="stat-item">
                            <span className="stat-label">Public Repos</span>
                            <span className="stat-value">{student.github.public_repos}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Total Stars</span>
                            <span className="stat-value">⭐ {student.github.total_stars}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Followers</span>
                            <span className="stat-value">{student.github.followers}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Following</span>
                            <span className="stat-value">{student.github.following}</span>
                          </div>
                          <div className="stat-item full-width">
                            <span className="stat-label">Top Languages</span>
                            <span className="stat-value languages">{student.github.top_languages.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="platform-section not-connected">
                        <p>❌ GitHub not connected</p>
                      </div>
                    )}

                    {/* HackerRank Details */}
                    {student.hackerrank ? (
                      <div className="platform-section hackerrank-section">
                        <div className="platform-header">
                          <div className="platform-title">
                            <img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/160_Hackerrank_logo_logos-512.png" alt="HackerRank" />
                            <h4>HackerRank</h4>
                          </div>
                          <a href={student.hackerrank.profile_url} target="_blank" rel="noopener noreferrer" className="view-profile-link">
                            View Profile →
                          </a>
                        </div>
                        <div className="platform-stats">
                          <div className="stat-item">
                            <span className="stat-label">Level</span>
                            <span className="stat-value">{student.hackerrank.level}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Total Score</span>
                            <span className="stat-value">{student.hackerrank.total_score}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Badges</span>
                            <span className="stat-value">🏅 {student.hackerrank.total_badges}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Python</span>
                            <span className="stat-value">⭐ {student.hackerrank.python_stars}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Problem Solving</span>
                            <span className="stat-value">⭐ {student.hackerrank.problem_solving_stars}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">SQL</span>
                            <span className="stat-value">⭐ {student.hackerrank.sql_stars}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="platform-section not-connected">
                        <p>❌ HackerRank not connected</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentAchievements
