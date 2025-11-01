import { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import {
  FaUser, FaGraduationCap, FaBriefcase, FaUsers, FaTrophy,
  FaCode, FaCalendar, FaMapMarkerAlt, FaMedal, FaLightbulb,
  FaEdit, FaSync, FaArrowRight, FaStar, FaClock, FaCheckCircle
} from 'react-icons/fa';
import "../../styles/Student/StudentDashboardNew.css";
import { BACKEND_URL } from '../../config/env';

const isTestStudentAuthenticated = localStorage.getItem('isTestStudentAuthenticated') === 'true';
const BASE_URL = BACKEND_URL;

export default function StudentDashboard() {
  const { darkMode } = useContext(ThemeContext);
  const initialPersonalDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    instituteRollNo: '',
    profilePicture: ''
  };

  const [personalDetails, setPersonalDetails] = useState(initialPersonalDetails);
  const [internshipDetails, setInternshipDetails] = useState([]);
  const [volunteeringDetails, setVolunteeringDetails] = useState([]);
  const [skillsDetails, setSkillsDetails] = useState([]);
  const [accomplishmentDetails, setAccomplishmentDetails] = useState([]);
  const [extraCurricularDetails, setExtraCurricularDetails] = useState([]);
  const [competitionDetails, setCompetitionDetails] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getProficiencyColor = (proficiency) => {
    switch(proficiency) {
      case 'Beginner': return 'bg-blue-100 text-blue-800';
      case 'Intermediate': return 'bg-green-100 text-green-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchPersonalDetails = useCallback(async () => {
    if (isTestStudentAuthenticated) {
      setPersonalDetails({
        firstName: 'Test',
        lastName: 'Student',
        email: 'testuser@sitpune.edu.in',
        phone: '1234567890',
        dob: '2000-01-01',
        gender: 'Other',
        instituteRollNo: 'SIT123456',
        profilePicture: ''
      });
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/api/personal-information`, {
        withCredentials: true
      });

      const data = response.data?.data;

      if (!data) {
        setPersonalDetails(initialPersonalDetails);
        return;
      }

      setPersonalDetails({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        email: data.personal_email || '',
        phone: data.phone_number || '',
        dob: data.dob || '',
        gender: data.gender || '',
        instituteRollNo: data.institute_roll_no || '',
        profilePicture: data.profile_picture || ''
      });
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/auth');
        return;
      }

      if (err.response?.status === 404) {
        setPersonalDetails(initialPersonalDetails);
        return;
      }

      throw err;
    }
  }, [navigate]);

  const fetchInternshipDetails = useCallback(async () => {
    if (isTestStudentAuthenticated) {
      setInternshipDetails([
        {
          position: 'Software Developer Intern',
          company: 'Example Labs',
          location: 'Remote',
          sector: 'Technology',
          startDate: '2024-05-01',
          endDate: '2024-07-31',
          stipend: 'INR 15000 / month'
        }
      ]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/internship-information`, {
        withCredentials: true
      });

      const items = Array.isArray(response.data?.data) ? response.data.data : [];
      const normalized = items.map((item) => ({
        id: item.internship_id ?? item.id ?? null,
        position: item.job_title || item.position || '',
        company: item.company_name || item.company || '',
        location: item.location || '',
        sector: item.company_sector || item.sector || '',
        startDate: item.start_date || item.startDate || '',
        endDate: item.end_date || item.endDate || '',
        stipend: item.stipend_salary || item.stipend || ''
      }));

      setInternshipDetails(normalized);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/auth');
        return;
      }

      if (err.response?.status === 404) {
        setInternshipDetails([]);
        return;
      }

      console.error('Failed to load internships', err);
      throw err;
    }
  }, [navigate]);

  const fetchVolunteerDetails = useCallback(async () => {
    if (isTestStudentAuthenticated) {
      setVolunteeringDetails([
        {
          organization: 'Community Care',
          location: 'Pune',
          sector: 'Education',
          task: 'Mentored first-year students in coding fundamentals',
          startDate: '2024-01-15',
          endDate: '2024-03-15'
        }
      ]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/volunteer-information`, {
        withCredentials: true
      });

      const items = Array.isArray(response.data?.data) ? response.data.data : [];
      const normalized = items.map((item) => ({
        id: item.volunteering_id ?? item.id ?? null,
        organization: item.organization || item.company_sector || '',
        location: item.location || '',
        sector: item.company_sector || item.sector || '',
        task: item.task || item.impact || '',
        startDate: item.start_date || item.startDate || '',
        endDate: item.end_date || item.endDate || ''
      }));

      setVolunteeringDetails(normalized);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/auth');
        return;
      }

      if (err.response?.status === 404) {
        setVolunteeringDetails([]);
        return;
      }

      console.error('Failed to load volunteering details', err);
      throw err;
    }
  }, [navigate]);

  const fetchSkillsDetails = useCallback(async () => {
    if (isTestStudentAuthenticated) {
      setSkillsDetails([
        { skill_name: 'React', skill_proficiency: 'Advanced' },
        { skill_name: 'Node.js', skill_proficiency: 'Intermediate' }
      ]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/skills-information`, {
        withCredentials: true
      });

      const items = Array.isArray(response.data?.data) ? response.data.data : [];
      setSkillsDetails(items);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/auth');
        return;
      }

      if (err.response?.status === 404) {
        setSkillsDetails([]);
        return;
      }

      console.error('Failed to load skills', err);
      throw err;
    }
  }, [navigate]);

  const fetchCompetitionDetails = useCallback(async () => {
    if (isTestStudentAuthenticated) {
      setCompetitionDetails([
        {
          event_name: 'Hackathon 2024',
          event_date: '2024-08-20',
          role: 'Team Lead',
          achievement: '2nd Place',
          skills: ['React', 'Teamwork']
        }
      ]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/competition-information`, {
        withCredentials: true
      });

      const items = Array.isArray(response.data?.data) ? response.data.data : [];
      const normalized = items.map((item) => ({
        id: item.event_id ?? item.id ?? null,
        event_name: item.event_name || item.name || '',
        event_date: item.event_date || item.eventDate || '',
        role: item.role || '',
        achievement: item.achievement || '',
        skills: Array.isArray(item.skills)
          ? item.skills
          : typeof item.skills === 'string'
            ? item.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
            : []
      }));

      setCompetitionDetails(normalized);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/auth');
        return;
      }

      if (err.response?.status === 404) {
        setCompetitionDetails([]);
        return;
      }

      console.error('Failed to load competition details', err);
      throw err;
    }
  }, [navigate]);

  const fetchAccomplishmentDetails = useCallback(async () => {
    if (isTestStudentAuthenticated) {
      setAccomplishmentDetails([
        {
          title: 'Dean\'s List',
          institution: 'Symbiosis Institute of Technology',
          type: 'Academic',
          description: 'Awarded for exceptional academic performance',
          accomplishment_date: '2024-05-10',
          rank: 'Top 5%'
        }
      ]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/accomplishment-information`, {
        withCredentials: true
      });

      const items = Array.isArray(response.data?.data) ? response.data.data : [];
      const normalized = items.map((item) => ({
        id: item.accomplishment_id ?? item.id ?? null,
        title: item.title || '',
        institution: item.institution || '',
        type: item.type || '',
        description: item.description || '',
        accomplishment_date: item.accomplishment_date || item.accomplishmentDate || '',
        rank: item.rank || ''
      }));

      setAccomplishmentDetails(normalized);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/auth');
        return;
      }

      if (err.response?.status === 404) {
        setAccomplishmentDetails([]);
        return;
      }

      console.error('Failed to load accomplishments', err);
      throw err;
    }
  }, [navigate]);

  const fetchExtraCurricularDetails = useCallback(async () => {
    if (isTestStudentAuthenticated) {
      setExtraCurricularDetails([
        {
          activity_name: 'Coding Club',
          role: 'Coordinator',
          organization: 'SIT Tech Club',
          duration: 'Aug 2023 - Present'
        }
      ]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/extra-curricular-information`, {
        withCredentials: true
      });

      const items = Array.isArray(response.data?.data) ? response.data.data : [];
      const normalized = items.map((item) => ({
        id: item.activity_id ?? item.id ?? null,
        activity_name: item.activity_name || item.activity || '',
        role: item.role || '',
        organization: item.organization || '',
        duration: item.duration || ''
      }));

      setExtraCurricularDetails(normalized);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/auth');
        return;
      }

      if (err.response?.status === 404) {
        setExtraCurricularDetails([]);
        return;
      }

      console.error('Failed to load extra curricular details', err);
      throw err;
    }
  }, [navigate]);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        fetchPersonalDetails(),
        fetchVolunteerDetails(),
        fetchInternshipDetails(),
        fetchCompetitionDetails(),
        fetchSkillsDetails(),
        fetchAccomplishmentDetails(),
        fetchExtraCurricularDetails()
      ]);

      const failures = results.filter((result) => result.status === 'rejected');
      if (failures.length === results.length && failures.length > 0) {
        const err = failures[0].reason;
        console.error('Error loading dashboard data:', err);
        setError(err?.response?.data?.error || err?.message || 'Failed to load dashboard');
      } else if (failures.length > 0) {
        failures.forEach((failure) => {
          console.warn('Partial dashboard load failure:', failure.reason);
        });
      }
    } finally {
      setLoading(false);
    }
  }, [
    fetchPersonalDetails,
    fetchVolunteerDetails,
    fetchInternshipDetails,
    fetchCompetitionDetails,
    fetchSkillsDetails,
    fetchAccomplishmentDetails,
    fetchExtraCurricularDetails
  ]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDuration = (duration) => {
    if (!duration) return 'Not specified';
    if (typeof duration === 'string') return duration;
    if (typeof duration === 'object') {
      if (duration.years) return `${duration.years} year${duration.years !== 1 ? 's' : ''}`;
      if (duration.months) return `${duration.months} month${duration.months !== 1 ? 's' : ''}`;
    }
    return 'Duration not specified';
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (loading) {
    return (
      <div className={`dashboard-loading-container ${darkMode ? 'dark' : ''}`}>
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`dashboard-error-container ${darkMode ? 'dark' : ''}`}>
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Profile</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
              aria-label="Retry loading dashboard"
            >
              <FaSync /> Try Again
            </button>
            <button 
              onClick={() => navigate('/student-form')} 
              className="secondary-button"
            >
              <FaEdit /> Update Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!personalDetails.firstName && !personalDetails.lastName) {
    return (
      <div className={`no-details-container ${darkMode ? 'dark' : ''}`}>
        <div className="empty-state">
          <FaUser className="empty-icon" />
          <h2>Complete Your Profile</h2>
          <p>Let's get you started! Add your personal details to build your complete profile.</p>
          <button 
            onClick={() => navigate('/student-form')} 
            className="primary-button large"
          >
            <FaEdit /> Add Details <FaArrowRight />
          </button>
        </div>
      </div>
    );
  }

  const academicData = [];
  const experienceData = [];
  const skillsData = [];
  const projectsData = [];

  return (
    <div className={`dashboard-wrapper ${darkMode ? 'dark' : 'light'}`}>
      {/* Header Card */}
      <div className="dashboard-header-card">
        <div className="header-background"></div>
        <div className="header-content">
          <div className="profile-avatar">
            {personalDetails.profilePicture ? (
              <img src={personalDetails.profilePicture} alt={`${personalDetails.firstName} ${personalDetails.lastName}`} />
            ) : (
              <FaUser className="avatar-icon" />
            )}
          </div>
          <div className="profile-header-info">
            <h1>{personalDetails.firstName} {personalDetails.lastName}</h1>
            <p className="roll-number"><FaGraduationCap /> {personalDetails.instituteRollNo}</p>
            <div className="contact-links">
              <a href={`mailto:${personalDetails.email}`} title="Send email">{personalDetails.email}</a>
              <a href={`tel:${personalDetails.phone}`} title="Call">{personalDetails.phone}</a>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="icon-button"
              onClick={() => navigate('/settings')}
              title="Edit profile"
              aria-label="Edit profile"
            >
              <FaEdit />
            </button>
            <button 
              className="icon-button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh data"
              aria-label="Refresh data"
            >
              <FaSync className={isRefreshing ? 'spinning' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon"><FaBriefcase /></div>
          <div className="stat-value">{internshipDetails.length}</div>
          <div className="stat-label">Internships</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaCode /></div>
          <div className="stat-value">{skillsDetails.length}</div>
          <div className="stat-label">Skills</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaTrophy /></div>
          <div className="stat-value">{accomplishmentDetails.length}</div>
          <div className="stat-label">Achievements</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-value">{volunteeringDetails.length}</div>
          <div className="stat-label">Volunteering</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav-new">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <FaUser /> Overview
          </button>
          <button 
            className={`nav-tab ${activeSection === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveSection('experience')}
          >
            <FaBriefcase /> Experience
          </button>
          <button 
            className={`nav-tab ${activeSection === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveSection('skills')}
          >
            <FaCode /> Skills
          </button>
          <button 
            className={`nav-tab ${activeSection === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveSection('activities')}
          >
            <FaMedal /> Activities
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <main className="dashboard-main">
        {/* OVERVIEW SECTION */}
        {activeSection === 'overview' && (
          <section className="content-section overview-section">
            <h2>Personal Information</h2>
            <div className="details-grid">
              <div className="detail-card">
                <span className="detail-icon"><FaUser /></span>
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{personalDetails.firstName} {personalDetails.lastName}</span>
              </div>
              <div className="detail-card">
                <span className="detail-icon"><FaGraduationCap /></span>
                <span className="detail-label">Roll Number</span>
                <span className="detail-value">{personalDetails.instituteRollNo}</span>
              </div>
              <div className="detail-card">
                <span className="detail-icon">📧</span>
                <span className="detail-label">Email</span>
                <span className="detail-value">{personalDetails.email}</span>
              </div>
              <div className="detail-card">
                <span className="detail-icon">📞</span>
                <span className="detail-label">Phone</span>
                <span className="detail-value">{personalDetails.phone}</span>
              </div>
              <div className="detail-card">
                <span className="detail-icon"><FaCalendar /></span>
                <span className="detail-label">Date of Birth</span>
                <span className="detail-value">{formatDate(personalDetails.dob)}</span>
              </div>
              <div className="detail-card">
                <span className="detail-icon">👤</span>
                <span className="detail-label">Gender</span>
                <span className="detail-value">{personalDetails.gender || 'Not specified'}</span>
              </div>
            </div>
          </section>
        )}

        {/* EXPERIENCE SECTION */}
        {activeSection === 'experience' && (
          <section className="content-section experience-section">
            {/* Internships */}
            <div className="section-block">
              <h2><FaBriefcase /> Internships</h2>
              {internshipDetails.length > 0 ? (
                <div className="cards-grid">
                  {internshipDetails.map((internship, idx) => (
                    <div key={idx} className="experience-card">
                      <div className="card-header">
                        <h3>{internship.position}</h3>
                        <span className="company-badge">{internship.company}</span>
                      </div>
                      <div className="card-body">
                        <div className="info-row">
                          <FaMapMarkerAlt /> {internship.location}
                        </div>
                        <div className="info-row">
                          <FaCalendar /> {formatDate(internship.startDate)} - {internship.endDate ? formatDate(internship.endDate) : 'Present'}
                        </div>
                        {internship.sector && (
                          <div className="info-row">
                            <span className="sector-tag">{internship.sector}</span>
                          </div>
                        )}
                        {internship.stipend && (
                          <div className="info-row stipend">
                            💰 {internship.stipend}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-message">
                  <p>No internships added yet. <a href="#settings">Add your first internship</a></p>
                </div>
              )}
            </div>

            {/* Volunteering */}
            <div className="section-block">
              <h2><FaUsers /> Volunteering</h2>
              {volunteeringDetails.length > 0 ? (
                <div className="cards-grid">
                  {volunteeringDetails.map((volunteer, idx) => (
                    <div key={idx} className="experience-card volunteer-card">
                      <div className="card-header">
                        <h3>{volunteer.organization}</h3>
                        <span className="org-badge">{volunteer.sector}</span>
                      </div>
                      <div className="card-body">
                        <div className="info-row">
                          <FaMapMarkerAlt /> {volunteer.location}
                        </div>
                        <div className="info-row">
                          <FaCalendar /> {formatDate(volunteer.startDate)} - {volunteer.endDate ? formatDate(volunteer.endDate) : 'Present'}
                        </div>
                        {volunteer.task && (
                          <div className="task-description">
                            <p>{volunteer.task}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-message">
                  <p>No volunteering experience added yet.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SKILLS SECTION */}
        {activeSection === 'skills' && (
          <section className="content-section skills-section">
            <h2><FaCode /> Technical & Soft Skills</h2>
            {skillsDetails.length > 0 ? (
              <div className="skills-showcase">
                {skillsDetails.map((skill, idx) => {
                  const proficiency = skill.skill_proficiency || 'Intermediate';
                  const profWidth = 
                    proficiency === 'Beginner' ? 33 : 
                    proficiency === 'Intermediate' ? 66 : 
                    proficiency === 'Expert' ? 100 : 80;
                  
                  return (
                    <div key={idx} className="skill-showcase-card">
                      <div className="skill-header">
                        <span className="skill-title">{skill.skill_name}</span>
                        <span className={`proficiency-badge ${proficiency.toLowerCase()}`}>
                          {proficiency}
                        </span>
                      </div>
                      <div className="skill-bar">
                        <div 
                          className="skill-bar-fill" 
                          style={{ width: `${profWidth}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-message">
                <p>No skills added yet. <a href="#settings">Add your skills</a></p>
              </div>
            )}
          </section>
        )}

        {/* ACTIVITIES SECTION */}
        {activeSection === 'activities' && (
          <section className="content-section activities-section">
            {/* Competitions */}
            {competitionDetails.length > 0 && (
              <div className="section-block">
                <h2><FaMedal /> Competitions & Events</h2>
                <div className="cards-grid">
                  {competitionDetails.map((comp, idx) => (
                    <div key={idx} className="achievement-card competition-card">
                      <div className="achievement-badge">
                        <FaMedal />
                      </div>
                      <h3>{comp.event_name}</h3>
                      {comp.role && <p className="role">{comp.role}</p>}
                      {comp.achievement && <p className="achievement">{comp.achievement}</p>}
                      <p className="date"><FaCalendar /> {formatDate(comp.event_date)}</p>
                      {comp.skills && comp.skills.length > 0 && (
                        <div className="skills-tags">
                          {comp.skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="tag">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accomplishments */}
            {accomplishmentDetails.length > 0 && (
              <div className="section-block">
                <h2><FaTrophy /> Accomplishments</h2>
                <div className="cards-grid">
                  {accomplishmentDetails.map((acc, idx) => (
                    <div key={idx} className="achievement-card accomplishment-card">
                      <div className="achievement-badge trophy">
                        <FaStar />
                      </div>
                      <h3>{acc.title}</h3>
                      <p className="institution">{acc.institution}</p>
                      {acc.description && <p className="description">{acc.description}</p>}
                      <div className="meta">
                        <span className="type">{acc.type}</span>
                        {acc.rank && <span className="rank">Rank: {acc.rank}</span>}
                      </div>
                      {acc.accomplishment_date && (
                        <p className="date"><FaCalendar /> {formatDate(acc.accomplishment_date)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Curricular */}
            {extraCurricularDetails.length > 0 && (
              <div className="section-block">
                <h2><FaUsers /> Extra-Curricular Activities</h2>
                <div className="activity-timeline">
                  {extraCurricularDetails.map((activity, idx) => (
                    <div key={idx} className="timeline-entry">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content-card">
                        <h3>{activity.activity_name}</h3>
                        <p className="org">{activity.organization}</p>
                        <p className="role">{activity.role}</p>
                        <p className="duration"><FaClock /> {activity.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {competitionDetails.length === 0 && accomplishmentDetails.length === 0 && extraCurricularDetails.length === 0 && (
              <div className="empty-message">
                <p>No activities added yet. <a href="#settings">Add competitions, achievements, or activities</a></p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
