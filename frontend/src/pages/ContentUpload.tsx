import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ContentUpload.css'

interface AISuggestions {
  caption: string
  hashtags: string[]
  taggingSuggestions: {
    companies: string[]
    ministries: string[]
    influencers: string[]
  }
  reachTips: string[]
  mediaRecommendations: {
    images: string[]
    videos: string[]
  }
  postingStrategy: string
}

function ContentUpload() {
  const navigate = useNavigate()
  const [uploadMethod, setUploadMethod] = useState<'text' | 'pdf'>('text')
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectPDF, setProjectPDF] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [showAISuggestions, setShowAISuggestions] = useState(false)

  const handleBack = () => {
    navigate('/student')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const generateAISuggestions = async () => {
    if (uploadMethod === 'text') {
      // Text method - require title and description
      if (!projectTitle.trim() || !projectDescription.trim()) {
        alert('Please enter project title and description first')
        return
      }
    } else {
      // PDF method - require PDF file
      if (!projectPDF) {
        alert('Please upload a PDF file first')
        return
      }
    }

    setIsGeneratingAI(true)
    setAiSuggestions(null)

    try {
      let response;
      
      if (uploadMethod === 'text') {
        // Call text-based API
        response = await fetch('http://localhost:8000/api/ai/generate-linkedin-suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_title: projectTitle,
            project_description: projectDescription,
          }),
        })
      } else {
        // Call PDF-based API
        const formData = new FormData()
        if (projectPDF) {
          formData.append('file', projectPDF)
        }
        
        response = await fetch('http://localhost:8000/api/ai/generate-linkedin-suggestions-from-pdf', {
          method: 'POST',
          body: formData,
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to generate AI suggestions')
      }

      const data = await response.json()
      
      // Convert snake_case to camelCase for frontend
      const suggestions: AISuggestions = {
        caption: data.caption,
        hashtags: data.hashtags,
        taggingSuggestions: data.tagging_suggestions,
        reachTips: data.reach_tips,
        mediaRecommendations: data.media_recommendations,
        postingStrategy: data.posting_strategy,
      }

      setAiSuggestions(suggestions)
      setShowAISuggestions(true)
    } catch (error) {
      console.error('AI generation error:', error)
      alert(error instanceof Error ? error.message : 'Failed to generate AI suggestions. Please try again.')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation based on upload method
    if (uploadMethod === 'text') {
      if (!projectTitle.trim()) {
        alert('Please enter a project title')
        return
      }

      if (!projectDescription.trim()) {
        alert('Please provide a project description')
        return
      }
    } else {
      // PDF method
      if (!projectPDF) {
        alert('Please upload a PDF with project details')
        return
      }
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Create FormData for file upload
      const formData = new FormData()
      
      if (uploadMethod === 'text') {
        formData.append('upload_method', 'text')
        formData.append('title', projectTitle)
        formData.append('description', projectDescription)
      } else {
        formData.append('upload_method', 'pdf')
        if (projectPDF) {
          formData.append('project_pdf', projectPDF)
        }
      }

      // TODO: Replace with actual API endpoint
      // await fetch('http://localhost:8000/api/upload-content', {
      //   method: 'POST',
      //   body: formData,
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmitStatus('success')
      
      // Reset form after success
      setTimeout(() => {
        setProjectTitle('')
        setProjectDescription('')
        setProjectPDF(null)
        setAiSuggestions(null)
        setShowAISuggestions(false)
        setSubmitStatus('idle')
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="content-upload-container">
      <header className="upload-header">
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
        <h1>Content Upload</h1>
        <p className="subtitle">Upload your project files and description</p>
      </header>

      <main className="upload-main">
        <form onSubmit={handleSubmit} className="upload-form">
          {/* Upload Method Selection */}
          <div className="form-section method-selection">
            <label className="form-label">Choose Upload Method</label>
            <div className="method-options">
              <button
                type="button"
                className={`method-option ${uploadMethod === 'text' ? 'active' : ''}`}
                onClick={() => setUploadMethod('text')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <h4>Enter as Text</h4>
                  <p>Type project title and description</p>
                </div>
              </button>
              <button
                type="button"
                className={`method-option ${uploadMethod === 'pdf' ? 'active' : ''}`}
                onClick={() => setUploadMethod('pdf')}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <h4>Upload PDF</h4>
                  <p>Upload a PDF with all project details</p>
                </div>
              </button>
            </div>
          </div>

          {/* Conditional Content Based on Upload Method */}
          {uploadMethod === 'text' ? (
            <>
              {/* Project Title */}
              <div className="form-section">
                <label className="form-label">
                  Project Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your project title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  maxLength={100}
                />
                <span className="char-count">{projectTitle.length}/100</span>
              </div>

              {/* Project Description - Text Area */}
              <div className="form-section">
                <label className="form-label">
                  Project Description <span className="required">*</span>
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe your project, technologies used, key features, and accomplishments..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={8}
                  maxLength={2000}
                />
                <span className="char-count">{projectDescription.length}/2000</span>
              </div>
            </>
          ) : (
            <>
              {/* PDF Upload */}
              <div className="form-section">
                <label className="form-label">
                  Project Details PDF <span className="required">*</span>
                </label>
                <div className="file-upload-area">
                  <input
                    type="file"
                    id="pdfFile"
                    className="file-input"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setProjectPDF(e.target.files[0])
                      }
                    }}
                  />
                  <label htmlFor="pdfFile" className="file-upload-label">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 2v6h6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="upload-text">
                      {projectPDF ? projectPDF.name : 'Click to upload PDF'}
                    </p>
                    <p className="upload-hint">
                      {projectPDF
                        ? `Size: ${formatFileSize(projectPDF.size)}`
                        : 'PDF file containing project title, description, and details'}
                    </p>
                  </label>
                </div>
                {projectPDF && (
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => setProjectPDF(null)}
                  >
                    Remove PDF
                  </button>
                )}
              </div>
            </>
          )}

          {/* AI Suggestions Button - Available for both methods */}
          <div className="form-section ai-section">
            <button
              type="button"
              className="ai-generate-button"
              onClick={generateAISuggestions}
              disabled={
                isGeneratingAI || 
                (uploadMethod === 'text' && (!projectTitle.trim() || !projectDescription.trim())) ||
                (uploadMethod === 'pdf' && !projectPDF)
              }
            >
              {isGeneratingAI ? (
                <>
                  <span className="spinner"></span>
                  Generating AI Suggestions...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Generate LinkedIn Posting Suggestions
                </>
              )}
            </button>
            <p className="ai-hint">
              {uploadMethod === 'text' 
                ? 'Get AI-powered suggestions for captions, hashtags, tagging, and reach optimization'
                : 'AI will extract and analyze your PDF to generate LinkedIn posting suggestions'}
            </p>
          </div>

          {/* AI Suggestions Display */}
          {showAISuggestions && aiSuggestions && (
            <div className="ai-suggestions-container">
              <div className="ai-suggestions-header">
                <h3>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  AI-Generated LinkedIn Posting Strategy
                </h3>
                <button
                  type="button"
                  className="close-ai-btn"
                  onClick={() => setShowAISuggestions(false)}
                  title="Close suggestions"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

              {/* Caption */}
              <div className="suggestion-section">
                <h4>📝 Suggested Caption</h4>
                <div className="suggestion-content caption-box">
                  {aiSuggestions.caption}
                </div>
              </div>

              {/* Hashtags */}
              <div className="suggestion-section">
                <h4>🏷️ Recommended Hashtags</h4>
                <div className="suggestion-content hashtags-container">
                  {aiSuggestions.hashtags.map((tag, idx) => (
                    <span key={idx} className="hashtag-chip">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tagging Suggestions */}
              <div className="suggestion-section">
                <h4>👥 Tagging Suggestions</h4>
                <div className="suggestion-content tagging-grid">
                  <div className="tagging-category">
                    <h5>Companies</h5>
                    <ul>
                      {aiSuggestions.taggingSuggestions.companies.map((company, idx) => (
                        <li key={idx}>{company}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="tagging-category">
                    <h5>Ministries/Organizations</h5>
                    <ul>
                      {aiSuggestions.taggingSuggestions.ministries.map((ministry, idx) => (
                        <li key={idx}>{ministry}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="tagging-category">
                    <h5>Influencers/Thought Leaders</h5>
                    <ul>
                      {aiSuggestions.taggingSuggestions.influencers.map((influencer, idx) => (
                        <li key={idx}>{influencer}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reach Tips */}
              <div className="suggestion-section">
                <h4>🚀 Tips to Maximize Reach</h4>
                <div className="suggestion-content">
                  <ul className="tips-list">
                    {aiSuggestions.reachTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Media Recommendations */}
              <div className="suggestion-section">
                <h4>📸 Media Recommendations</h4>
                <div className="suggestion-content media-recommendations">
                  <div className="media-category">
                    <h5>Images/Screenshots</h5>
                    <ul>
                      {aiSuggestions.mediaRecommendations.images.map((img, idx) => (
                        <li key={idx}>{img}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="media-category">
                    <h5>Video Content</h5>
                    <ul>
                      {aiSuggestions.mediaRecommendations.videos.map((video, idx) => (
                        <li key={idx}>{video}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Posting Strategy */}
              <div className="suggestion-section">
                <h4>📅 Posting Strategy</h4>
                <div className="suggestion-content strategy-box">
                  {aiSuggestions.postingStrategy}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="22 4 12 14.01 9 11.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Submit Project
                </>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="status-message success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="22 4 12 14.01 9 11.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Project uploaded successfully! Your submission is pending approval.</span>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="status-message error">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="8"
                  x2="12"
                  y2="12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="12"
                  y1="16"
                  x2="12.01"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Upload failed. Please try again.</span>
            </div>
          )}
        </form>
      </main>
    </div>
  )
}

export default ContentUpload
