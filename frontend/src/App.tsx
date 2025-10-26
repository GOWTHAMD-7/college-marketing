import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import CompetitiveDashboard from './pages/CompetitiveDashboard'
import SocialMedia from './pages/SocialMedia'
import StudentAchievements from './pages/StudentAchievements'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/competitive-dashboard" element={<CompetitiveDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-achievements" element={<StudentAchievements />} />
        <Route path="/social-media" element={<SocialMedia />} />
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </Router>
  )
}

export default App
