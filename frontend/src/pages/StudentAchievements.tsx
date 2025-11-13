import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './StudentAchievements.css'

interface Student {
  username: string
  displayName: string
}

interface LeetCodeProfile {
  leetcode_username: string
  profile_url: string
  real_name: string | null
  avatar: string | null
  ranking: number | null
  total_solved: number
  easy_solved: number
  medium_solved: number
  hard_solved: number
  current_streak: number
  max_streak: number
  total_active_days: number
  contest_rating: number | null
  contest_ranking: string | null
  contests_attended: number
  last_updated: string
}

interface GitHubProfile {
  github_username: string
  profile_url: string
  name: string | null
  bio: string | null
  avatar_url: string | null
  company: string | null
  location: string | null
  public_repos: number
  public_gists: number
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
  name: string | null
  country: string | null
  avatar: string | null
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

interface StudentDetails {
  username: string
  displayName: string
  leetcode: LeetCodeProfile | null
  github: GitHubProfile | null
  hackerrank: HackerRankProfile | null
}

// Mock usernames - these profiles are demo data
const MOCK_USERNAMES = [
  'alice_coder', 'bob_algorithm', 'charlie-opensource', 'diana_codes',
  'eve_hacker', 'frank_solver', 'grace-learning', 'henry_newbie',
  'alice-codes', 'bobsmith-dev', 'diana-dev', 'grace-learning', 'henry-codes',
  'alice_j', 'diana_p', 'eve_hacker', 'frank_m', 'henry_w'
]

function StudentAchievements() {
  const navigate = useNavigate()
  const [students] = useState<Student[]>([
    { username: 'student1', displayName: 'Student 1' },
    { username: 'student2', displayName: 'Student 2' },
    { username: 'student3', displayName: 'Student 3' },
    { username: 'student4', displayName: 'Student 4' },
    { username: 'student5', displayName: 'Student 5' },
    { username: 'student6', displayName: 'Student 6' },
    { username: 'student7', displayName: 'Student 7' },
    { username: 'student8', displayName: 'Student 8' },
    { username: 'student9', displayName: 'Student 9' },
    { username: 'student10', displayName: 'Student 10' },
  ])

  const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [showMore, setShowMore] = useState(false)

  // Helper to check if a profile is mock data
  const isMockData = (platformUsername: string | undefined) => {
    return platformUsername && MOCK_USERNAMES.includes(platformUsername)
  }

  const handleBack = () => {
    navigate('/teacher')
  }

  const handleStudentClick = async (student: Student) => {
    setIsLoadingDetails(true)
    setShowMore(false)

    try {
      // Fetch all platform profiles for the student
      const [leetcodeRes, githubRes, hackerrankRes] = await Promise.allSettled([
        fetch(`http://localhost:8000/api/leetcode/profile/${student.username}`),
        fetch(`http://localhost:8000/api/github/profile/${student.username}`),
        fetch(`http://localhost:8000/api/hackerrank/profile/${student.username}`)
      ])

      const leetcode = leetcodeRes.status === 'fulfilled' && leetcodeRes.value.ok
        ? await leetcodeRes.value.json()
        : null

      const github = githubRes.status === 'fulfilled' && githubRes.value.ok
        ? await githubRes.value.json()
        : null

      const hackerrank = hackerrankRes.status === 'fulfilled' && hackerrankRes.value.ok
        ? await hackerrankRes.value.json()
        : null

      setSelectedStudent({
        username: student.username,
        displayName: student.displayName,
        leetcode,
        github,
        hackerrank
      })
    } catch (error) {
      console.error('Error fetching student details:', error)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleCloseDetails = () => {
    setSelectedStudent(null)
    setShowMore(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="achievements-container">
      <header className="achievements-header">
        <button className="back-button" onClick={handleBack}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Dashboard
        </button>
        <h1>Student Achievements</h1>
        <p className="subtitle">Monitor student performance across all platforms</p>
      </header>

      <main className="achievements-main">
        <div className="students-grid">
          {students.map((student) => (
            <div
              key={student.username}
              className="student-card"
              onClick={() => handleStudentClick(student)}
            >
              <div className="student-avatar">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
                  <circle cx="24" cy="18" r="6" fill="currentColor" />
                  <path
                    d="M12 38c0-6.627 5.373-12 12-12s12 5.373 12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>{student.displayName}</h3>
              <p className="student-username">@{student.username}</p>
              <div className="view-details">
                View Performance
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={handleCloseDetails}>
            <div className="student-details-modal" onClick={(e) => e.stopPropagation()}>
              {isLoadingDetails ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading student details...</p>
                </div>
              ) : (
                <>
                  <div className="modal-header">
                    <div className="modal-title-section">
                      <h2>{selectedStudent.displayName}</h2>
                      <p className="modal-username">@{selectedStudent.username}</p>
                    </div>
                    <button className="close-button" onClick={handleCloseDetails}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 6L6 18M6 6l12 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                    {/* Basic Stats Summary */}
                    <div className="summary-section">
                      <h3>Performance Overview</h3>
                      <div className="summary-grid">
                        <div className="summary-card">
                          <div className="summary-icon leetcode-color">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                            </svg>
                          </div>
                          <div className="summary-info">
                            <span className="summary-label">LeetCode</span>
                            <span className="summary-value">
                              {selectedStudent.leetcode
                                ? `${selectedStudent.leetcode.total_solved} Problems`
                                : 'Not Connected'}
                            </span>
                          </div>
                        </div>

                        <div className="summary-card">
                          <div className="summary-icon github-color">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </div>
                          <div className="summary-info">
                            <span className="summary-label">GitHub</span>
                            <span className="summary-value">
                              {selectedStudent.github
                                ? `${selectedStudent.github.public_repos} Repos`
                                : 'Not Connected'}
                            </span>
                          </div>
                        </div>

                        <div className="summary-card">
                          <div className="summary-icon hackerrank-color">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V6.908h.701c.141 0 .254-.115.254-.258 0-.094-.049-.176-.123-.221L9.223 4.92c-.049-.063-.141-.109-.226-.109-.084 0-.16.045-.207.107L7.11 6.43c-.072.045-.12.126-.12.218 0 .143.114.258.255.258h.704l.008 10.035c0 .145.111.258.254.258h4.021a.257.257 0 00.254-.258V10.79h4.073v6.164h-.7a.257.257 0 00-.255.257c0 .094.049.178.121.223l1.574 1.512c.047.062.141.107.225.107.084 0 .16-.045.209-.109l1.678-1.51c.072-.047.12-.127.12-.219 0-.143-.113-.258-.254-.258h-.703l-.007-10.035a.255.255 0 00-.254-.258h-4.024l-.008-.002z"/>
                            </svg>
                          </div>
                          <div className="summary-info">
                            <span className="summary-label">HackerRank</span>
                            <span className="summary-value">
                              {selectedStudent.hackerrank
                                ? `${selectedStudent.hackerrank.total_score.toFixed(0)} Points`
                                : 'Not Connected'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Show More Details Button */}
                    {(selectedStudent.leetcode || selectedStudent.github || selectedStudent.hackerrank) && (
                      <button
                        className="show-more-button"
                        onClick={() => setShowMore(!showMore)}
                      >
                        {showMore ? 'Show Less Details' : 'Show More Details'}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ transform: showMore ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}

                    {/* Detailed Platform Stats */}
                    {showMore && (
                      <div className="detailed-stats">
                        {/* LeetCode Details */}
                        {selectedStudent.leetcode && (
                          <div className="platform-details leetcode-section">
                            <div className="platform-header">
                              <div className="platform-title">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
                                </svg>
                                <h4>LeetCode Performance</h4>
                                {isMockData(selectedStudent.leetcode.leetcode_username) && (
                                  <span className="mock-badge" title="This is demo data for demonstration purposes">
                                    Mock Data
                                  </span>
                                )}
                              </div>
                              <a
                                href={selectedStudent.leetcode.profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="profile-link"
                              >
                                View Profile →
                              </a>
                            </div>
                            <div className="stats-grid">
                              <div className="stat-card">
                                <span className="stat-label">Total Solved</span>
                                <span className="stat-value">{selectedStudent.leetcode.total_solved}</span>
                              </div>
                              <div className="stat-card easy">
                                <span className="stat-label">Easy</span>
                                <span className="stat-value">{selectedStudent.leetcode.easy_solved}</span>
                              </div>
                              <div className="stat-card medium">
                                <span className="stat-label">Medium</span>
                                <span className="stat-value">{selectedStudent.leetcode.medium_solved}</span>
                              </div>
                              <div className="stat-card hard">
                                <span className="stat-label">Hard</span>
                                <span className="stat-value">{selectedStudent.leetcode.hard_solved}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Current Streak</span>
                                <span className="stat-value">{selectedStudent.leetcode.current_streak} days</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Max Streak</span>
                                <span className="stat-value">{selectedStudent.leetcode.max_streak} days</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Active Days</span>
                                <span className="stat-value">{selectedStudent.leetcode.total_active_days}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Contest Rating</span>
                                <span className="stat-value">{selectedStudent.leetcode.contest_rating || 'N/A'}</span>
                              </div>
                            </div>
                            <p className="last-updated">Last updated: {formatDate(selectedStudent.leetcode.last_updated)}</p>
                          </div>
                        )}

                        {/* GitHub Details */}
                        {selectedStudent.github && (
                          <div className="platform-details github-section">
                            <div className="platform-header">
                              <div className="platform-title">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                <h4>GitHub Activity</h4>
                                {isMockData(selectedStudent.github.github_username) && (
                                  <span className="mock-badge" title="This is demo data for demonstration purposes">
                                    Mock Data
                                  </span>
                                )}
                              </div>
                              <a
                                href={selectedStudent.github.profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="profile-link"
                              >
                                View Profile →
                              </a>
                            </div>
                            <div className="stats-grid">
                              <div className="stat-card">
                                <span className="stat-label">Public Repos</span>
                                <span className="stat-value">{selectedStudent.github.public_repos}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Total Stars</span>
                                <span className="stat-value">{selectedStudent.github.total_stars}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Total Forks</span>
                                <span className="stat-value">{selectedStudent.github.total_forks}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Followers</span>
                                <span className="stat-value">{selectedStudent.github.followers}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Following</span>
                                <span className="stat-value">{selectedStudent.github.following}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Gists</span>
                                <span className="stat-value">{selectedStudent.github.public_gists}</span>
                              </div>
                            </div>
                            {selectedStudent.github.top_languages.length > 0 && (
                              <div className="languages-section">
                                <span className="languages-label">Top Languages:</span>
                                <div className="languages-tags">
                                  {selectedStudent.github.top_languages.map((lang, idx) => (
                                    <span key={idx} className="language-tag">{lang}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <p className="last-updated">Last updated: {formatDate(selectedStudent.github.last_updated)}</p>
                          </div>
                        )}

                        {/* HackerRank Details */}
                        {selectedStudent.hackerrank && (
                          <div className="platform-details hackerrank-section">
                            <div className="platform-header">
                              <div className="platform-title">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.115.645 10.885 0 12S13.287 24 12 24s-9.75-4.885-10.395-6c-.641-1.115-.641-10.885 0-12C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V6.908h.701c.141 0 .254-.115.254-.258 0-.094-.049-.176-.123-.221L9.223 4.92c-.049-.063-.141-.109-.226-.109-.084 0-.16.045-.207.107L7.11 6.43c-.072.045-.12.126-.12.218 0 .143.114.258.255.258h.704l.008 10.035c0 .145.111.258.254.258h4.021a.257.257 0 00.254-.258V10.79h4.073v6.164h-.7a.257.257 0 00-.255.257c0 .094.049.178.121.223l1.574 1.512c.047.062.141.107.225.107.084 0 .16-.045.209-.109l1.678-1.51c.072-.047.12-.127.12-.219 0-.143-.113-.258-.254-.258h-.703l-.007-10.035a.255.255 0 00-.254-.258h-4.024l-.008-.002z"/>
                                </svg>
                                <h4>HackerRank Skills</h4>
                                {isMockData(selectedStudent.hackerrank.hackerrank_username) && (
                                  <span className="mock-badge" title="This is demo data for demonstration purposes">
                                    Mock Data
                                  </span>
                                )}
                              </div>
                              <a
                                href={selectedStudent.hackerrank.profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="profile-link"
                              >
                                View Profile →
                              </a>
                            </div>
                            <div className="stats-grid">
                              <div className="stat-card">
                                <span className="stat-label">Total Score</span>
                                <span className="stat-value">{selectedStudent.hackerrank.total_score.toFixed(1)}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Level</span>
                                <span className="stat-value">{selectedStudent.hackerrank.level}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Total Badges</span>
                                <span className="stat-value">{selectedStudent.hackerrank.total_badges}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Python Score</span>
                                <span className="stat-value">{selectedStudent.hackerrank.python_score.toFixed(1)}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Python Stars</span>
                                <span className="stat-value">{'⭐'.repeat(selectedStudent.hackerrank.python_stars)}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Java Score</span>
                                <span className="stat-value">{selectedStudent.hackerrank.java_score.toFixed(1)}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Java Stars</span>
                                <span className="stat-value">{'⭐'.repeat(selectedStudent.hackerrank.java_stars)}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">Problem Solving</span>
                                <span className="stat-value">{selectedStudent.hackerrank.problem_solving_score.toFixed(1)}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">PS Stars</span>
                                <span className="stat-value">{'⭐'.repeat(selectedStudent.hackerrank.problem_solving_stars)}</span>
                              </div>
                              <div className="stat-card">
                                <span className="stat-label">SQL Stars</span>
                                <span className="stat-value">{'⭐'.repeat(selectedStudent.hackerrank.sql_stars)}</span>
                              </div>
                            </div>
                            <p className="last-updated">Last updated: {formatDate(selectedStudent.hackerrank.last_updated)}</p>
                          </div>
                        )}

                        {/* No Data Message */}
                        {!selectedStudent.leetcode && !selectedStudent.github && !selectedStudent.hackerrank && (
                          <div className="no-data-message">
                            <p>This student hasn't connected any platform accounts yet.</p>
                          </div>
                        )}
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentAchievements
