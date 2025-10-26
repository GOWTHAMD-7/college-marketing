import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function TeacherDashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  const handleNavigateToAchievements = () => {
    navigate('/student-achievements')
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
          <div className="dashboard-card" onClick={handleNavigateToAchievements} style={{ cursor: 'pointer' }}>
            <div className="card-icon" style={{ background: 'rgba(0, 212, 255, 0.1)' }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  stroke="var(--color-cyan)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="var(--color-cyan)"
                  fillOpacity="0.2"
                />
              </svg>
            </div>
            <h3>Student Achievements</h3>
            <p>View student performance & profiles</p>
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
                <rect
                  x="3"
                  y="3"
                  width="7"
                  height="7"
                  stroke="var(--color-navy)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  stroke="var(--color-navy)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="14"
                  y="14"
                  width="7"
                  height="7"
                  stroke="var(--color-navy)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  stroke="var(--color-navy)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Campaigns</h3>
            <p>Create & manage campaigns</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon" style={{ background: 'rgba(0, 212, 255, 0.1)' }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                  stroke="var(--color-cyan)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="3.27 6.96 12 12.01 20.73 6.96"
                  stroke="var(--color-cyan)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="22.08"
                  x2="12"
                  y2="12"
                  stroke="var(--color-cyan)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Reports</h3>
            <p>Advanced analytics & insights</p>
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
