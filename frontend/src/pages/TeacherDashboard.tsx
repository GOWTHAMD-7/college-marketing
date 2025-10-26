import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function TeacherDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

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
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="2"
                />
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
            Manage your college's marketing campaigns, approve student
            submissions, and monitor performance across all channels from this
            central dashboard.
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div
              className="card-icon"
              style={{ background: "rgba(0, 212, 255, 0.1)" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 11l3 3L22 4"
                  stroke="var(--color-cyan)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                  stroke="var(--color-cyan)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Approvals</h3>
            <p>Review & approve content</p>
          </div>

          <div className="dashboard-card">
            <div
              className="card-icon"
              style={{ background: "rgba(30, 42, 120, 0.1)" }}
            >
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
            <div
              className="card-icon"
              style={{ background: "rgba(0, 212, 255, 0.1)" }}
            >
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

          <div
            className="dashboard-card"
            onClick={() => navigate("/competitive-dashboard")}
          >
            <div
              className="card-icon"
              style={{ background: "rgba(30, 42, 120, 0.1)" }}
            >
              <svg
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 320 320"
                xmlSpace="preserve"
              >
                <g id="XMLID_235_">
                  <rect
                    id="XMLID_236_"
                    x="110"
                    y="160"
                    style={{ fill: "#0052B4" }}
                    width="100"
                    height="160"
                  />
                  <rect
                    id="XMLID_237_"
                    x="10"
                    y="260"
                    style={{ fill: "#0052B4" }}
                    width="100"
                    height="60"
                  />
                  <rect
                    id="XMLID_238_"
                    x="60"
                    y="260"
                    style={{ fill: "#006DF0" }}
                    width="50"
                    height="60"
                  />
                  <rect
                    id="XMLID_239_"
                    x="160"
                    y="160"
                    style={{ fill: "#78B9EB" }}
                    width="50"
                    height="160"
                  />
                  <polygon
                    id="XMLID_240_"
                    style={{ fill: "#FFDA44" }}
                    points="210,160 160,160 160,130 180,130 	"
                  />
                  <polygon
                    id="XMLID_241_"
                    style={{ fill: "#FF9811" }}
                    points="110,160 160,160 160,130 140,130 	"
                  />
                  <rect
                    id="XMLID_242_"
                    x="210"
                    y="210"
                    style={{ fill: "#0052B4" }}
                    width="100"
                    height="110"
                  />
                  <rect
                    id="XMLID_243_"
                    x="260"
                    y="210"
                    style={{ fill: "#006DF0" }}
                    width="50"
                    height="110"
                  />
                  <g id="XMLID_244_">
                    <circle
                      id="XMLID_245_"
                      style={{ fill: "#BF720D" }}
                      cx="90.361"
                      cy="68.461"
                      r="11.538"
                    />
                    <circle
                      id="XMLID_307_"
                      style={{ fill: "#BF720D" }}
                      cx="83.437"
                      cy="43.077"
                      r="23.077"
                    />
                    <circle
                      id="XMLID_308_"
                      style={{ fill: "#FFFFFF" }}
                      cx="83.437"
                      cy="43.077"
                      r="9.231"
                    />
                  </g>
                  <g id="XMLID_309_">
                    <circle
                      id="XMLID_311_"
                      style={{ fill: "#FF9811" }}
                      cx="229.639"
                      cy="68.461"
                      r="11.538"
                    />
                    <circle
                      id="XMLID_312_"
                      style={{ fill: "#FF9811" }}
                      cx="236.562"
                      cy="43.077"
                      r="23.077"
                    />
                    <circle
                      id="XMLID_333_"
                      style={{ fill: "#FFFFFF" }}
                      cx="236.562"
                      cy="43.077"
                      r="9.231"
                    />
                  </g>
                  <path
                    id="XMLID_334_"
                    style={{ fill: "#FFDA44" }}
                    d="M90,17.272V30c0,38.66,31.34,70,70,70s70-31.34,70-70V17.272H90z"
                  />
                  <path
                    id="XMLID_337_"
                    style={{ fill: "#FF9811" }}
                    d="M160,17.272H90V30c0,38.66,31.34,70,70,70V17.272z"
                  />
                  <g id="XMLID_338_">
                    <rect
                      id="XMLID_340_"
                      x="90"
                      style={{ fill: "#BF720D" }}
                      width="70"
                      height="20"
                    />
                    <rect
                      id="XMLID_341_"
                      x="160"
                      style={{ fill: "#FF9811" }}
                      width="70"
                      height="20"
                    />
                  </g>
                  <rect
                    id="XMLID_348_"
                    x="140"
                    y="90"
                    style={{ fill: "#FF9811" }}
                    width="20"
                    height="40"
                  />
                  <rect
                    id="XMLID_350_"
                    x="160"
                    y="90"
                    style={{ fill: "#FFDA44" }}
                    width="20"
                    height="40"
                  />
                  <rect
                    id="XMLID_351_"
                    x="140"
                    y="280"
                    style={{ fill: "#FF9811" }}
                    width="20"
                    height="20"
                  />
                  <rect
                    id="XMLID_352_"
                    x="160"
                    y="280"
                    style={{ fill: "#FFDA44" }}
                    width="20"
                    height="20"
                  />
                  <rect
                    id="XMLID_439_"
                    x="40"
                    y="280"
                    style={{ fill: "#FF9811" }}
                    width="20"
                    height="20"
                  />
                  <rect
                    id="XMLID_440_"
                    x="60"
                    y="280"
                    style={{ fill: "#FFDA44" }}
                    width="20"
                    height="20"
                  />
                  <rect
                    id="XMLID_441_"
                    x="240"
                    y="280"
                    style={{ fill: "#FF9811" }}
                    width="20"
                    height="20"
                  />
                  <rect
                    id="XMLID_443_"
                    x="260"
                    y="280"
                    style={{ fill: "#FFDA44" }}
                    width="20"
                    height="20"
                  />
                </g>
              </svg>
            </div>
            <h3>Analysis</h3>
            <p>Competitors Analysis & Insights</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TeacherDashboard;
