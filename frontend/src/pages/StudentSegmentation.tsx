import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './StudentSegmentation.css'
// Charts
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts'
import { motion } from 'framer-motion'

interface SegmentData {
  name: string
  count: number
  percentage: number
  color?: string
}

interface Insight {
  icon: string
  title: string
  description: string
}

interface AnalysisData {
  total_students: number
  segments_created: number
  geographic_segments: SegmentData[]
  academic_segments: SegmentData[]
  socioeconomic_segments: SegmentData[]
  marketing_channels: SegmentData[]
  accommodation_segments: SegmentData[]
  parent_sentiments: SegmentData[]
  insights: Insight[]
}

function StudentSegmentation() {
  const navigate = useNavigate()
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load initial analysis on component mount
  useEffect(() => {
    loadInitialAnalysis()
  }, [])

  const loadInitialAnalysis = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('http://localhost:8000/api/segmentation/initial-analysis')
      
      if (!response.ok) {
        throw new Error('Failed to load analysis data')
      }
      
      const data = await response.json()
      setAnalysisData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error loading initial analysis:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const assignColors = (segments: SegmentData[]): SegmentData[] => {
    const colors = ['#00D4FF', '#1E2A78', '#7C88CC', '#00BDEB', '#3A4A9A']
    return segments.map((seg, idx) => ({
      ...seg,
      color: seg.color || colors[idx % colors.length]
    }))
  }

  // Convert segment data to Recharts-friendly arrays
  const pieData = (segments?: SegmentData[]) => {
    if (!segments) return []
    return segments.map(s => ({ name: s.name, value: s.count, percentage: s.percentage, color: s.color }))
  }

  const barData = (segments?: SegmentData[]) => {
    if (!segments) return []
    return segments.map(s => ({ name: s.name, value: s.count }))
  }

  // Compute top 3 segments for a quick insight
  const topSegments = (segments?: SegmentData[]) => {
    if (!segments) return []
    return [...segments].sort((a, b) => b.count - a.count).slice(0, 3)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.endsWith('.csv')) {
      setCsvFile(file)
    } else {
      alert('Please upload a valid CSV file')
    }
  }

  const handleAnalyze = async () => {
    if (!csvFile) {
      alert('Please upload a CSV file first')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', csvFile)
      
      const response = await fetch('http://localhost:8000/api/segmentation/analyze-new-data', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to analyze data')
      }
      
      const data = await response.json()
      setAnalysisData(data)
      setShowUploadModal(false)
      setCsvFile(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze data'
      setError(errorMessage)
      alert(errorMessage)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleBack = () => {
    navigate('/teacher-dashboard')
  }

  if (isLoading) {
    return (
      <div className="segmentation-container">
        <header className="segmentation-header">
          <div className="header-title">
            <div className="ai-icon">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="#00D4FF" strokeWidth="2" />
                <circle cx="18" cy="20" r="2" fill="#00D4FF" />
                <circle cx="30" cy="20" r="2" fill="#00D4FF" />
                <path d="M16 28C16 28 18 32 24 32C30 32 32 28 32 28" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1>Student Admission Segmentation</h1>
              <p className="powered-by">Powered by AI Machine Learning</p>
            </div>
          </div>
        </header>
        <main className="segmentation-main">
          <div className="loading-container">
            <div className="spinner-large"></div>
            <p>Loading analysis data...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error && !analysisData) {
    return (
      <div className="segmentation-container">
        <header className="segmentation-header">
          <button className="back-button" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </button>
        </header>
        <main className="segmentation-main">
          <div className="error-container">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#FF4444" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="#FF4444" strokeWidth="2" strokeLinecap="round"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="#FF4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h2>Error Loading Data</h2>
            <p>{error}</p>
            <button className="analyze-button" onClick={loadInitialAnalysis}>Retry</button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="segmentation-container">
      <header className="segmentation-header">
        <button className="back-button" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </button>
        <div className="header-title">
          <div className="ai-icon">
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="#00D4FF" strokeWidth="2" />
              <circle cx="18" cy="20" r="2" fill="#00D4FF" />
              <circle cx="30" cy="20" r="2" fill="#00D4FF" />
              <path d="M16 28C16 28 18 32 24 32C30 32 32 28 32 28" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 24L8 20M36 20L40 24M24 8V4" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1>Student Admission Segmentation</h1>
            <p className="powered-by">Powered by AI Machine Learning</p>
          </div>
        </div>
      </header>

      <main className="segmentation-main">
        {analysisData ? (
          <div className="results-section">
            <div className="results-header">
              <h2>Segmentation Analysis Results</h2>
              <button className="upload-new-button" onClick={() => setShowUploadModal(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Upload New Data
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(0, 212, 255, 0.1)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{analysisData.total_students.toLocaleString()}</h3>
                  <p>Total Students</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(30, 42, 120, 0.1)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" stroke="#1E2A78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{analysisData.segments_created}</h3>
                  <p>Segments Created</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(0, 212, 255, 0.1)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#00D4FF" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>91.2%</h3>
                  <p>Avg Accuracy</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(30, 42, 120, 0.1)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#1E2A78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{analysisData.geographic_segments.length + analysisData.academic_segments.length}</h3>
                  <p>Categories</p>
                </div>
              </div>
            </div>

            <div className="segments-grid">
              <motion.div className="segment-card" layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <h3>Geographic Distribution</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie dataKey="value" data={pieData(assignColors(analysisData.geographic_segments))} innerRadius={60} outerRadius={100} label={(entry) => `${entry.name}: ${entry.percentage}%`}>
                        {assignColors(analysisData.geographic_segments).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any, name: any, props: any) => [`${value}`, `${props.payload.name}`]} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="top-list">
                  <strong>Top areas</strong>
                  <ol>
                    {topSegments(analysisData.geographic_segments).map(s => (
                      <li key={s.name}>{s.name} — {s.count} ({s.percentage}%)</li>
                    ))}
                  </ol>
                </div>
              </motion.div>

              <motion.div className="segment-card" layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <h3>Marketing Channel Reach</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={barData(assignColors(analysisData.marketing_channels))} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#00D4FF">
                        {assignColors(analysisData.marketing_channels).map((entry, idx) => (
                          <Cell key={`mc-${idx}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="top-list">
                  <strong>Top channels</strong>
                  <ol>
                    {topSegments(analysisData.marketing_channels).map(s => (
                      <li key={s.name}>{s.name} — {s.count} ({s.percentage}%)</li>
                    ))}
                  </ol>
                </div>
              </motion.div>

              <motion.div className="segment-card" layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <h3>Academic Performance</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={barData(assignColors(analysisData.academic_segments))} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#1E2A78">
                        {assignColors(analysisData.academic_segments).map((entry, idx) => (
                          <Cell key={`acad-${idx}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="top-list">
                  <strong>Top performers</strong>
                  <ol>
                    {topSegments(analysisData.academic_segments).map(s => (
                      <li key={s.name}>{s.name} — {s.count} ({s.percentage}%)</li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            </div>

            <div className="insights-section">
              <h3>Key Marketing Insights</h3>
              <div className="insights-grid">
                {analysisData.insights.map((insight, idx) => (
                  <div key={idx} className="insight-card">
                    <div className="insight-icon">{insight.icon}</div>
                    <h4>{insight.title}</h4>
                    <p>{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Upload New Student Data</h2>
                <button className="modal-close" onClick={() => setShowUploadModal(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="modal-body">
                <p>Upload a CSV file with student admission data to generate new segmentation analysis.</p>
                
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="csv-upload-modal"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="file-input"
                  />
                  <label htmlFor="csv-upload-modal" className="file-label">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Choose CSV File
                  </label>
                </div>

                {csvFile && (
                  <div className="file-selected">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22 4 12 14.01 9 11.01" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {csvFile.name}
                  </div>
                )}

                <button 
                  className="analyze-button"
                  onClick={handleAnalyze}
                  disabled={!csvFile || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="spinner"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Analyze Data
                    </>
                  )}
                </button>

                <div className="info-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#1E2A78" strokeWidth="2"/>
                    <line x1="12" y1="16" x2="12" y2="12" stroke="#1E2A78" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="12" y1="8" x2="12.01" y2="8" stroke="#1E2A78" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div>
                    <strong>Required Columns:</strong>
                    <p>geographic_segment, academic_segment, socioeconomic_segment, marketing_channel_type, accommodation, parents_sentiment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentSegmentation
