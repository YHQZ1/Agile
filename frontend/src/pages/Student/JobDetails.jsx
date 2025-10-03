import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import "../../styles/Student/JobDetails.css";

const JobPostingPage = () => {
  const [activeTab, setActiveTab] = useState('description');
  const { darkMode } = useContext(ThemeContext);
  
  // Function to handle back button click - would use actual navigation in your app
  const handleBackClick = () => {
    // This would typically use your routing mechanism, like:
    // navigate('/ongoing-drives') or history.push('/ongoing-drives') or window.location.href = '/ongoing-drives'
    console.log("Navigating back to ongoing drives");
    // For demo purposes - replace with your actual navigation code
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback if there's no history
      window.location.href = '/ongoing-drives';
    }
  };
  
  return (
    <div className={`job-posting-container ${darkMode ? 'dark-theme' : ''}`}>
      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={handleBackClick}>
          <svg className="back-icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
          </svg>
          Back
        </button>
      </div>
      
      {/* Header Section */}
      <div className="header-section">
        <div className="logo-container">
          <div className="logo">
            <div className="logo-inner">
              <span className="logo-accent"></span>
            </div>
          </div>
        </div>
        
        <div className="job-title-info">
          <h1>SDR Intern (Sales Development Representative, Banglore)</h1>
          <p>Leadsquared | Banglore | Full Time</p>
        </div>
        
        <div className="eligibility-badge">
          <span>
            <svg className="icon-circle-x" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
            Not eligible
          </span>
        </div>
      </div>
      
      {/* Notice Banner */}
      <div className="notice-banner">
        <svg className="icon-info" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
        </svg>
        <span>Applications are now closed. You were not eligible to apply for this Job Profile</span>
      </div>
      
      {/* Tabs Section */}
      <div className="tabs-section">
        <ul>
          <li 
            className={activeTab === 'description' ? 'active' : ''}
            onClick={() => setActiveTab('description')}
          >
            Job Description
          </li>
          <li 
            className={activeTab === 'workflow' ? 'active' : ''}
            onClick={() => setActiveTab('workflow')}
          >
            Hiring Workflow
          </li>
          <li 
            className={activeTab === 'criteria' ? 'active' : ''}
            onClick={() => setActiveTab('criteria')}
          >
            Eligibility Criteria
            <svg className="icon-circle-x" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
            </svg>
          </li>
        </ul>
      </div>
      
      {/* Content Section */}
      <div className="content-section">
        {activeTab === 'description' && (
          <div className="job-description">
            <div className="opening-overview">
              <h2>Opening Overview</h2>
              <div className="overview-grid">
                <div className="field-row">
                  <span className="field-label">Category:</span>
                  <span className="field-value">Base</span>
                </div>
                <div className="field-row">
                  <span className="field-label">Job Functions:</span>
                  <span className="field-value">Sales</span>
                </div>
                <div className="field-row">
                  <span className="field-label">Job Profile CTC:</span>
                  <span className="field-value">₹ 750000 per Annum</span>
                </div>
                <div className="field-row">
                  <span className="field-label">Other Info:</span>
                  <span className="field-value"></span>
                </div>
              </div>
            </div>
            
            <div className="job-details">
              <h2>Job Description</h2>
              <p>
                LeadSquared is a Sales Automation SaaS platform, helping 2000+ organizations globally to drive sales efficiency at scale. 
                LeadSquared has built a global, best-in-class CRM platform that takes away the guesswork from sales execution and makes 
                efficiency the focus of every customer interaction, no matter how complex the customer journey. We are India's 103rd Unicorn 
                Startup and scaling up at a rapid pace.
              </p>
              <p>
                SDR Intern(Sales Development Representative): 6 months Internship followed by FTE 
                opportunity (conversion only after graduation). Stipend: Rs. 27,000 per month. CTC after Full time conversion: 5.5 lpa fixed + 1.65 lpa 
                var (7.15 lpa). Location: Bengaluru (WFO 5-day work week). Qualification: BTech grads. Skills required: Good communication with 
                objectional handling skills. Hiring Process: GD + Video Assignment (depends on the amount of application) + First round + Second 
                Round. Expected onboarding: Mar 25
              </p>
            </div>
            
            <div className="skills-section">
              <h2>Required Skills</h2>
              <p>No skills added for this job profile</p>
            </div>
            
            <div className="additional-info">
              <h2>Additional Information</h2>
              <p>No Additional Information added for this job profile</p>
            </div>
            
            <div className="attached-documents">
              <h2>Attached Documents</h2>
              <div className="show-desktop">
                <button>Show desktop</button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'workflow' && (
          <div className="hiring-workflow-hwf">
            <h2>Hiring Workflow</h2>
            <div className="workflow-steps-hwf">
              <div className="step-hwf">
                <div className="step-number-hwf">1</div>
                <div className="step-info-hwf">
                  <h3>Group Discussion</h3>
                  <p>Initial screening through interactive group discussion</p>
                </div>
              </div>
              <div className="step-hwf">
                <div className="step-number-hwf">2</div>
                <div className="step-info-hwf">
                  <h3>Video Assignment</h3>
                  <p>Complete a video assignment to showcase your skills</p>
                </div>
              </div>
              <div className="step-hwf">
                <div className="step-number-hwf">3</div>
                <div className="step-info-hwf">
                  <h3>First Round Interview</h3>
                  <p>Technical and communication skills assessment</p>
                </div>
              </div>
              <div className="step-hwf">
                <div className="step-number-hwf">4</div>
                <div className="step-info-hwf">
                  <h3>Second Round Interview</h3>
                  <p>Final interview with team leads</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'criteria' && (
          <div className="eligibility-criteria">
            <h2>Eligibility Criteria</h2>
            <div className="criteria-list">
              <div className="criterion">
                <h3>Education</h3>
                <p>Must be a BTech graduate or in final year</p>
              </div>
              <div className="criterion">
                <h3>Communication Skills</h3>
                <p>Good communication with objection handling skills required</p>
              </div>
              <div className="criterion">
                <h3>Availability</h3>
                <p>Must be available for WFO 5-day work week in Bengaluru</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPostingPage;