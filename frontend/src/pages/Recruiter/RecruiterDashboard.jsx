import React, { useState } from 'react';

// Candidate Pipeline Card Component
const CandidatePipelineCard = () => {
  const [pipeline, setPipeline] = useState([
    { id: 1, name: "Application Review", count: 24, color: "#3b82f6" },
    { id: 2, name: "Phone Screening", count: 12, color: "#10b981" },
    { id: 3, name: "Technical Interview", count: 8, color: "#f59e0b" },
    { id: 4, name: "Final Interview", count: 5, color: "#8b5cf6" },
    { id: 5, name: "Offer Stage", count: 3, color: "#ef4444" }
  ]);
  
  return (
    <div className="card pipeline-card">
      <h2>Candidate Pipeline</h2>
      <div className="pipeline-stats">
        {pipeline.map(stage => (
          <div key={stage.id} className="pipeline-stage">
            <div className="stage-header">
              <span className="stage-name">{stage.name}</span>
              <span className="stage-count">{stage.count}</span>
            </div>
            <div className="stage-bar">
              <div 
                className="stage-fill" 
                style={{ 
                  width: `${(stage.count / Math.max(...pipeline.map(s => s.count))) * 100}%`,
                  backgroundColor: stage.color 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-action">View All Candidates</button>
    </div>
  );
};

// Recent Applications Card Component
const RecentApplicationsCard = () => {
  const [applications, setApplications] = useState([
    { id: 1, name: "Sarah Johnson", role: "Senior Frontend Developer", date: "Mar 29", status: "New" },
    { id: 2, name: "Michael Chen", role: "DevOps Engineer", date: "Mar 28", status: "Reviewed" },
    { id: 3, name: "Priya Patel", role: "UX Designer", date: "Mar 27", status: "Phone Screen" },
    { id: 4, name: "David Wilson", role: "Backend Developer", date: "Mar 26", status: "Technical" }
  ]);
  
  const getStatusClass = (status) => {
    switch(status) {
      case "New": return "status-new";
      case "Reviewed": return "status-reviewed";
      case "Phone Screen": return "status-phone";
      case "Technical": return "status-technical";
      case "Final": return "status-final";
      case "Offer": return "status-offer";
      default: return "";
    }
  };
  
  return (
    <div className="card applications-card">
      <h2>Recent Applications</h2>
      <div className="applications-list">
        {applications.map(app => (
          <div key={app.id} className="application-item">
            <div className="application-main">
              <h3>{app.name}</h3>
              <p className="application-role">{app.role}</p>
            </div>
            <div className="application-meta">
              <span className="application-date">{app.date}</span>
              <span className={`application-status ${getStatusClass(app.status)}`}>
                {app.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-action">Process Applications</button>
    </div>
  );
};

// Open Positions Card Component
const OpenPositionsCard = () => {
  const [positions, setPositions] = useState([
    { id: 1, title: "Frontend Developer", department: "Engineering", applications: 18, deadline: "Apr 15" },
    { id: 2, title: "Product Manager", department: "Product", applications: 12, deadline: "Apr 20" },
    { id: 3, title: "UX Designer", department: "Design", applications: 8, deadline: "Apr 10" }
  ]);
  
  return (
    <div className="card positions-card">
      <h2>Open Positions</h2>
      <div className="positions-list">
        {positions.map(position => (
          <div key={position.id} className="position-item">
            <div className="position-header">
              <h3>{position.title}</h3>
              <span className="position-department">{position.department}</span>
            </div>
            <div className="position-details">
              <div className="position-applications">
                <span className="detail-label">Applications</span>
                <span className="detail-value">{position.applications}</span>
              </div>
              <div className="position-deadline">
                <span className="detail-label">Deadline</span>
                <span className="detail-value">{position.deadline}</span>
              </div>
            </div>
            <div className="position-actions">
              <button className="btn-view-applications">View Applications</button>
              <button className="btn-edit-position">Edit</button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn-action">Post New Position</button>
    </div>
  );
};

// Profile Card Component
const ProfileCard = () => {
  return (
    <div className="card profile-card">
      <h2>Profile</h2>
      <div className="profile-content">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            <span>JD</span>
          </div>
        </div>
        <div className="profile-info">
          <h3>Jessica Davis</h3>
          <p className="profile-title">Senior Technical Recruiter</p>
          <p className="profile-stats">
            <span>24 active requisitions</span>
            <span>18 hires this quarter</span>
          </p>
        </div>
      </div>
      <button className="btn-action">Edit Profile</button>
    </div>
  );
};

// Navbar Component
const Navbar = ({ activeTab, onTabChange, toggleTheme, darkMode }) => {
  return (
    <div className="navbar">
      <div className="navbar-logo">
        <h1>TalentHub</h1>
      </div>
      <div className="navbar-tabs">
        <button 
          className={`navbar-tab ${activeTab === "Dashboard" ? "active" : ""}`}
          onClick={() => onTabChange("Dashboard")}
        >
          Dashboard
        </button>
        <button 
          className={`navbar-tab ${activeTab === "Candidates" ? "active" : ""}`}
          onClick={() => onTabChange("Candidates")}
        >
          Candidates
        </button>
        <button 
          className={`navbar-tab ${activeTab === "Jobs" ? "active" : ""}`}
          onClick={() => onTabChange("Jobs")}
        >
          Jobs
        </button>
        <button 
          className={`navbar-tab ${activeTab === "Calendar" ? "active" : ""}`}
          onClick={() => onTabChange("Calendar")}
        >
          Calendar
        </button>
        <button 
          className={`navbar-tab ${activeTab === "Reports" ? "active" : ""}`}
          onClick={() => onTabChange("Reports")}
        >
          Reports
        </button>
      </div>
      <div className="navbar-actions">
        <button className="navbar-action" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button className="navbar-action" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <button className="navbar-action" onClick={toggleTheme} aria-label="Toggle Theme">
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
        <div className="user-profile">
          <div className="user-avatar">JD</div>
        </div>
      </div>
    </div>
  );
};

const RDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [breadcrumbs, setBreadcrumbs] = useState([activeTab]);
  const [darkMode, setDarkMode] = useState(false);

  // Function to get the greeting based on the current time
  const getGreeting = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setBreadcrumbs([tab]);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-theme');
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <Navbar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        toggleTheme={toggleTheme}
        darkMode={darkMode}
      />
      
      <div className="main-content">
        <div className="header">
          <div className="breadcrumbs">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <span>{crumb}</span>
                {index < breadcrumbs.length - 1 && <span>›</span>}
              </React.Fragment>
            ))}
          </div>
          <div className="actions">
            <button className="btn-manage" aria-label="Export Data">
              Export
            </button>
            <button className="btn-share" aria-label="Share">
              Share
            </button>
            <button className="btn-more" aria-label="More Options">
              More
            </button>
          </div>
        </div>
        
        <div>
          <h1 className="greeting">{getGreeting()}, Jessica</h1>
        </div>
        
        {/* Cards Grid Container */}
        <div className="cards-grid">
          <ProfileCard />
          <CandidatePipelineCard />
          <RecentApplicationsCard />
          <OpenPositionsCard />
        </div>
      </div>
    </div>
  );
};

export default RDashboard;