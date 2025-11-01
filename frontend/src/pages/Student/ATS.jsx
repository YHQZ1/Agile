import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/Student/ATS.css';
import axios from 'axios';

const ATS = () => {
  const { darkMode } = useContext(ThemeContext);
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit');
        return;
      }
      setResumeFile(file);
      setError(null);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    if (!resumeFile) {
      setError('Please upload your resume');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('job_description', jobDescription);
      formData.append('resume', resumeFile);

      const response = await axios.post(`${API_BASE_URL}/api/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysisResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 80) return { color: '#10b981', bg: '#ecfdf5', status: 'Excellent Match' };
    if (numScore >= 60) return { color: '#f59e0b', bg: '#fffbeb', status: 'Good Match' };
    return { color: '#ef4444', bg: '#fef2f2', status: 'Needs Improvement' };
  };

  return (
    <div className={`ats-container ${darkMode ? 'dark-theme' : ''}`}>
      <div className="ats-header">
        <h1>ATS Resume Analyzer</h1>
        <p>Intelligent ATS Scanner · Match Analysis · Career Insights</p>
      </div>

      {!analysisResult && (
        <div className="input-section">
          <div className="input-row">
            <div className="input-column">
              <label className="input-label">
                <span className="label-icon">📋</span>
                Job Description
              </label>
              <textarea
                className="input-textarea"
                placeholder="Paste the complete job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={12}
              />
            </div>

            <div className="input-column">
              <label className="input-label">
                <span className="label-icon">📄</span>
                Resume Upload (PDF)
              </label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  id="resume-upload"
                  className="file-input"
                />
                <label htmlFor="resume-upload" className="file-upload-label">
                  {resumeFile ? (
                    <div className="file-selected">
                      <span className="file-icon">✓</span>
                      <span className="file-name">{resumeFile.name}</span>
                    </div>
                  ) : (
                    <div className="file-placeholder">
                      <span className="upload-icon">📤</span>
                      <span>Click to upload or drag and drop</span>
                      <span className="file-hint">PDF (Max 10MB)</span>
                    </div>
                  )}
                </label>
              </div>

              {!resumeFile && (
                <div className="upload-tips">
                  <h4>💡 Resume Best Practices</h4>
                  <ul>
                    <li>Use a clean, ATS-friendly format</li>
                    <li>Include relevant keywords naturally</li>
                    <li>Quantify your achievements</li>
                    <li>Keep file size under 10MB</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-container">
            <button
              className="analyze-button"
              onClick={handleAnalyze}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="results-section">
          <div className="score-card">
            {(() => {
              const scoreInfo = getScoreColor(analysisResult.jd_match);
              return (
                <>
                  <div className="score-badge" style={{ background: scoreInfo.bg, color: scoreInfo.color }}>
                    {scoreInfo.status}
                  </div>
                  <div className="score-circle" style={{ background: `linear-gradient(135deg, ${scoreInfo.color} 0%, ${scoreInfo.color}dd 100%)` }}>
                    {analysisResult.jd_match}
                  </div>
                  <h2 className="score-label">ATS Match Score</h2>
                  <p className="score-description">Based on skills, keywords, and experience alignment</p>
                </>
              );
            })()}
          </div>

          <div className="tabs-container">
            <div className="tabs-header">
              <button
                className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                Skills Analysis
              </button>
              <button
                className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
                onClick={() => setActiveTab('recommendations')}
              >
                Recommendations
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === 'overview' && (
                <div className="tab-panel">
                  <div className="info-card">
                    <h3>👤 Profile Summary</h3>
                    <p>{analysisResult.profile_summary}</p>
                  </div>

                  <div className="info-grid">
                    <div className="info-card">
                      <h3>🎓 Education</h3>
                      <p>{analysisResult.education}</p>
                    </div>
                    <div className="info-card">
                      <h3>💼 Experience</h3>
                      <p>{analysisResult.experience}</p>
                    </div>
                  </div>

                  {(analysisResult.projects.length > 0 || analysisResult.achievements.length > 0) && (
                    <div className="info-grid">
                      {analysisResult.projects.length > 0 && (
                        <div className="info-card">
                          <h3>🚀 Notable Projects</h3>
                          <ul>
                            {analysisResult.projects.map((project, idx) => (
                              <li key={idx}>{project}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysisResult.achievements.length > 0 && (
                        <div className="info-card">
                          <h3>🏆 Key Achievements</h3>
                          <ul>
                            {analysisResult.achievements.map((achievement, idx) => (
                              <li key={idx}>{achievement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="tab-panel">
                  <div className="info-card">
                    <h3>📊 Category-wise Skills Match</h3>
                    {Object.entries(analysisResult.category_matches).map(([category, score]) => (
                      <div key={category} className="skill-category">
                        <div className="skill-header">
                          <span className="skill-name">{category}</span>
                          <span className="skill-score" style={{
                            background: score >= 80 ? '#ecfdf5' : score >= 60 ? '#fffbeb' : '#fef2f2',
                            color: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
                          }}>
                            {score}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${score}%`,
                              background: score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
                            }}
                          />
                        </div>
                        {analysisResult.skill_gaps[category] && (
                          <div className="missing-skills">
                            <small>Missing: {analysisResult.skill_gaps[category].slice(0, 5).join(', ')}</small>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="info-grid">
                    <div className="info-card success-card">
                      <h3>✓ Your Strengths</h3>
                      <div className="skill-badges">
                        {analysisResult.key_strengths.map((strength, idx) => (
                          <span key={idx} className="skill-badge matched">{strength}</span>
                        ))}
                      </div>
                    </div>
                    <div className="info-card warning-card">
                      <h3>+ Skills to Add</h3>
                      <div className="skill-badges">
                        {analysisResult.missing_keywords.map((keyword, idx) => (
                          <span key={idx} className="skill-badge missing">{keyword}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div className="tab-panel">
                  <div className="info-card">
                    <h3>🎯 Personalized Recommendations</h3>
                    <ul className="recommendations-list">
                      {analysisResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="recommendation-item">
                          <strong>#{idx + 1}</strong> {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            className="reset-button"
            onClick={() => {
              setAnalysisResult(null);
              setJobDescription('');
              setResumeFile(null);
              setError(null);
            }}
          >
            Analyze Another Resume
          </button>
        </div>
      )}
    </div>
  );
};

export default ATS;
