import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/Recruiter/RecruiterDashboard.css';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
const stagePalette = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6'];

const CandidatePipelineCard = ({ pipeline }) => {
  const maxCount = pipeline.length ? Math.max(...pipeline.map((stage) => stage.count)) : 0;

  return (
    <div className="card pipeline-card">
      <h2>Candidate Pipeline</h2>
      {pipeline.length === 0 ? (
        <p className="empty-state">No applications yet. New candidates will appear here.</p>
      ) : (
        <div className="pipeline-stats">
          {pipeline.map((stage, index) => (
            <div key={stage.name} className="pipeline-stage">
              <div className="stage-header">
                <span className="stage-name">{stage.name}</span>
                <span className="stage-count">{stage.count}</span>
              </div>
              <div className="stage-bar">
                <div
                  className="stage-fill"
                  style={{
                    width: maxCount ? `${(stage.count / maxCount) * 100}%` : '0%',
                    backgroundColor: stagePalette[index % stagePalette.length]
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="btn-action" type="button">View All Candidates</button>
    </div>
  );
};

const RecentApplicationsCard = ({ applications }) => {
  const stageClass = (stage) => {
    const normalized = (stage || '').toLowerCase();
    if (normalized.includes('review')) return 'status-new';
    if (normalized.includes('phone')) return 'status-phone';
    if (normalized.includes('technical') || normalized.includes('tech')) return 'status-technical';
    if (normalized.includes('final')) return 'status-final';
    if (normalized.includes('offer')) return 'status-offer';
    if (normalized.includes('reject')) return 'status-rejected';
    return 'status-default';
  };

  return (
    <div className="card applications-card">
      <h2>Recent Applications</h2>
      {applications.length === 0 ? (
        <p className="empty-state">No applications submitted yet.</p>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.application_id} className="application-item">
              <div className="application-main">
                <h3>{app.candidateName}</h3>
                <p className="application-role">{app.jobTitle}</p>
              </div>
              <div className="application-meta">
                <span className="application-date">{app.submittedOn}</span>
                <span className={`application-status ${stageClass(app.current_stage)}`}>
                  {app.current_stage || 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="btn-action" type="button">Process Applications</button>
    </div>
  );
};

const OpenPositionsCard = ({ positions }) => {
  return (
    <div className="card positions-card">
      <h2>Open Positions</h2>
      {positions.length === 0 ? (
        <p className="empty-state">No job postings yet. Post a job to attract candidates.</p>
      ) : (
        <div className="positions-list">
          {positions.map((position) => (
            <div key={position.job_id} className="position-item">
              <div className="position-header">
                <h3>{position.title}</h3>
                <span className="position-department">{position.employment_type || '—'}</span>
              </div>
              <div className="position-details">
                <div className="position-applications">
                  <span className="detail-label">Applications</span>
                  <span className="detail-value">{position.applications_count ?? 0}</span>
                </div>
                <div className="position-deadline">
                  <span className="detail-label">Deadline</span>
                  <span className="detail-value">{position.application_deadline || '—'}</span>
                </div>
              </div>
              <div className="position-actions">
                <button className="btn-view-applications" type="button">View Applications</button>
                <button className="btn-edit-position" type="button">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="btn-action" type="button">Post New Position</button>
    </div>
  );
};

const ProfileCard = ({ profile }) => {
  const initials = profile?.company_name
    ? profile.company_name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'RP';

  return (
    <div className="card profile-card">
      <h2>Profile</h2>
      <div className="profile-content">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            <span>{initials}</span>
          </div>
        </div>
        <div className="profile-info">
          <h3>{profile?.company_name || 'Recruiter Portal'}</h3>
          <p className="profile-title">{profile?.industry || 'Update your industry'}</p>
          <p className="profile-stats">
            <span>{profile ? profile.company_size || 'Size TBD' : 'Add company details'}</span>
            <span>{profile?.company_email || 'No contact email'}</span>
          </p>
        </div>
      </div>
      <button className="btn-action" type="button">Edit Profile</button>
    </div>
  );
};

const Navbar = ({ activeTab, onTabChange, toggleTheme, darkMode, companyName }) => {
  const brand = companyName || 'Recruiter Portal';

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <h1>{brand}</h1>
      </div>
      <div className="navbar-tabs">
        {['Dashboard', 'Candidates', 'Jobs', 'Calendar', 'Reports'].map((tab) => (
          <button
            key={tab}
            className={`navbar-tab ${activeTab === tab ? 'active' : ''}`}
            type="button"
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="navbar-actions">
        <button className="navbar-action" aria-label="Search" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <button className="navbar-action" aria-label="Notifications" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <button className="navbar-action" onClick={toggleTheme} aria-label="Toggle Theme" type="button">
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
          <div className="user-avatar">{brand.substring(0, 2).toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
};

const RDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      setLoading(true);
      setError('');

      try {
        const profileResponse = await fetch(`${API_BASE}/api/recruiter/profile`, {
          credentials: 'include'
        });

        if (profileResponse.status === 404) {
          if (isMounted) {
            setProfile(null);
            setError('Complete your company profile to unlock the recruiter dashboard.');
          }
          setLoading(false);
          return;
        }

        const profileJson = await profileResponse.json().catch(() => ({}));
        if (!profileResponse.ok) {
          throw new Error(profileJson?.message || 'Unable to load recruiter profile');
        }

        const recruiterProfile = profileJson?.data || null;
        if (isMounted) {
          setProfile(recruiterProfile);
        }

        const jobsResponse = await fetch(`${API_BASE}/api/recruiter/jobs`, {
          credentials: 'include'
        });

        if (!jobsResponse.ok) {
          const errJson = await jobsResponse.json().catch(() => ({}));
          throw new Error(errJson?.message || 'Failed to load job postings');
        }

        const jobsJson = await jobsResponse.json();
        const jobList = Array.isArray(jobsJson?.data) ? jobsJson.data : [];
        if (isMounted) {
          setJobs(jobList);
        }

        const applicationPromises = jobList.map(async (job) => {
          const response = await fetch(`${API_BASE}/api/recruiter/jobs/${job.job_id}/applications`, {
            credentials: 'include'
          });

          if (!response.ok) {
            return [];
          }

          const data = await response.json();
          return (data?.data || []).map((app) => ({
            ...app,
            job_id: job.job_id,
            job_title: job.title,
            job_status: job.status
          }));
        });

        const applicationMatrix = await Promise.all(applicationPromises);
        const flattenedApplications = applicationMatrix.flat();

        if (isMounted) {
          setApplications(flattenedApplications);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load recruiter dashboard');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle('dark-theme');
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const pipelineData = useMemo(() => {
    if (!applications.length) {
      return [];
    }

    const stageCounts = new Map();
    applications.forEach((app) => {
      const stage = app.current_stage || 'Application Review';
      stageCounts.set(stage, (stageCounts.get(stage) || 0) + 1);
    });

    return Array.from(stageCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [applications]);

  const recentApplications = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
    return [...applications]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
      .map((app) => ({
        application_id: app.application_id,
        candidateName: app.first_name && app.last_name ? `${app.first_name} ${app.last_name}` : 'Candidate',
        jobTitle: app.job_title || app.job_function || 'Job Opportunity',
        current_stage: app.current_stage,
        submittedOn: app.created_at ? formatter.format(new Date(app.created_at)) : '—'
      }));
  }, [applications]);

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        toggleTheme={toggleTheme}
        darkMode={darkMode}
        companyName={profile?.company_name}
      />

      <div className="main-content">
        <div className="header">
          <div className="breadcrumbs">
            <span>{activeTab}</span>
          </div>
          <div className="actions">
            <button className="btn-manage" aria-label="Export Data" type="button">
              Export
            </button>
            <button className="btn-share" aria-label="Share" type="button">
              Share
            </button>
            <button className="btn-more" aria-label="More Options" type="button">
              More
            </button>
          </div>
        </div>

        <div>
          <h1 className="greeting">
            {greeting}
            {profile?.company_name ? `, ${profile.company_name.split(' ')[0]}` : ''}
          </h1>
        </div>

        {error && <div className="dashboard-banner dashboard-banner-error">{error}</div>}

        {loading ? (
          <p>Loading recruiter dashboard...</p>
        ) : (
          <div className="cards-grid">
            <ProfileCard profile={profile} />
            <CandidatePipelineCard pipeline={pipelineData} />
            <RecentApplicationsCard applications={recentApplications} />
            <OpenPositionsCard positions={jobs} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RDashboard;