import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function TeacherDashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  const handleStudentAchievements = () => {
    navigate('/student-achievements')
  }

  const handleCompetitiveAnalysis = () => {
    navigate('/competitive-analysis')
  }

  const handleStudentSegmentation = () => {
    navigate('/student-segmentation')
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="ai-icon-small">
              <svg
                width="32"
                height="32"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" />
                <circle cx="18" cy="20" r="2" fill="currentColor" />
                <circle cx="30" cy="20" r="2" fill="currentColor" />
                <path
                  d="M16 28C16 28 18 32 24 32C30 32 32 28 32 28"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h1>Teacher Dashboard</h1>
              <p className="user-email">teacher.bitsathy.ac.in</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="16 17 21 12 16 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="21"
                y1="12"
                x2="9"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>Welcome, Teacher! 👨‍🏫</h2>
          <p>
            Manage your college's marketing campaigns, approve student submissions, and
            monitor performance across all channels from this central dashboard.
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={handleStudentAchievements} style={{ cursor: 'pointer' }}>
            <div className="card-icon" style={{ background: 'rgba(0, 212, 255, 0.1)' }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15l-2 2-2-2m4-6l2-2 2 2"
                  stroke="var(--color-cyan)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 2a3 3 0 0 0-3 3v1a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2V5a3 3 0 0 0-3-3z"
                  stroke="var(--color-cyan)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 13v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8"
                  stroke="var(--color-cyan)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Student Achievements</h3>
            <p>Monitor student performance</p>
          </div>

          <div className="dashboard-card" onClick={handleCompetitiveAnalysis} style={{ cursor: 'pointer' }}>
            <div className="card-icon" style={{ background: 'rgba(30, 42, 120, 0.1)' }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3v18h18"
                  stroke="var(--color-navy)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18 9l-5 5-4-4-6 6"
                  stroke="var(--color-navy)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Competitor Analysis</h3>
            <p>Compare with other colleges</p>
          </div>

          <div className="dashboard-card" onClick={handleStudentSegmentation} style={{ cursor: 'pointer' }}>
            <div className="card-icon" style={{ background: 'rgba(0, 212, 255, 0.1)' }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="var(--color-cyan)" strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" stroke="var(--color-cyan)" strokeWidth="2"/>
                <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" stroke="var(--color-cyan)" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="var(--color-cyan)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>AI Student Segmentation</h3>
            <p>ML-powered admission analysis</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon" style={{ background: 'rgba(30, 42, 120, 0.1)' }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="var(--color-navy)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                  stroke="var(--color-navy)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Settings</h3>
            <p>Configure platform settings</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TeacherDashboard
