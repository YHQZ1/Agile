
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../styles/Student/StudentDashboard.css";
import { BACKEND_URL } from '../../config/env';

const isTestStudentAuthenticated = localStorage.getItem('isTestStudentAuthenticated') === 'true';

const BASE_URL = BACKEND_URL;

export default function StudentDashboard() {
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

  const getProficiencyColor = (proficiency) => {
    switch(proficiency) {
      case 'Beginner': return 'bg-blue-100 text-blue-800';
      case 'Intermediate': return 'bg-green-100 text-green-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const fetchPersonalDetails = async () => {
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
        navigate('/login');
        return;
      }

      if (err.response?.status === 404) {
        setPersonalDetails(initialPersonalDetails);
        return;
      }

      throw err;
    }
  };

  const fetchVolunteerDetails = async () => {
    if (isTestStudentAuthenticated) {
      setVolunteeringDetails([
        {
          volunteering_id: 1,
          organization: 'Test Org',
          location: 'Test City',
          sector: 'Education',
          task: 'Teaching',
          startDate: '2024-01-01',
          endDate: '2024-06-01'
        }
      ]);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/api/volunteer-information`, {
        withCredentials: true
      });

      const data = response.data?.data || [];

      const formattedData = data.map(item => ({
        volunteering_id: item.volunteering_id || null,
        organization: item.organization || item.task || 'Volunteering',
        location: item.location || '',
        sector: item.company_sector || '',
        task: item.task || '',
        startDate: item.start_date || '',
        endDate: item.end_date || ''
      }));

      setVolunteeringDetails(formattedData);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }

      if (err.response?.status === 404) {
        setVolunteeringDetails([]);
        return;
      }

      throw err;
    }
  };

  const fetchInternshipDetails = async () => {
    if (isTestStudentAuthenticated) {
      setInternshipDetails([
        {
          internship_id: 1,
          company: 'Test Company',
          position: 'Intern',
          location: 'Test City',
          sector: 'IT',
          startDate: '2024-02-01',
          endDate: '2024-07-01',
          stipend: '10000'
        }
      ]);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/api/internship-information`, {
        withCredentials: true
      });

      const data = response.data?.data || [];

      const formattedData = data.map(item => ({
        internship_id: item.internship_id || null,
        company: item.company_name || '',
        position: item.job_title || '',
        location: item.location || '',
        sector: item.company_sector || '',
        startDate: item.start_date || '',
        endDate: item.end_date || '',
        stipend: item.stipend_salary || ''
      }));

      setInternshipDetails(formattedData);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }

      if (err.response?.status === 404) {
        setInternshipDetails([]);
        return;
      }

      throw err;
    }
  };

  const fetchCompetitionDetails = async () => {
    if (isTestStudentAuthenticated) {
      setCompetitionDetails([
        {
          event_id: 1,
          event_name: 'Test Hackathon',
          event_date: '2024-03-15',
          role: 'Participant',
          achievement: 'Finalist',
          skills: ['JavaScript', 'React']
        }
      ]);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/api/competition-information`, {
        withCredentials: true
      });

      const data = response.data?.data || [];

      const formattedData = data.map(item => ({
        event_id: item.event_id || null,
        event_name: item.event_name || '',
        event_date: item.event_date || '',
        role: item.role || '',
        achievement: item.achievement || '',
        skills: item.skills
          ? item.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
          : [],
      }));

      setCompetitionDetails(formattedData);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }

      if (err.response?.status === 404) {
        setCompetitionDetails([]);
        return;
      }

      throw err;
    }
  };

  const fetchSkillsDetails = async () => {
    if (isTestStudentAuthenticated) {
      setSkillsDetails([
        {
          skill_id: 1,
          skill_name: 'JavaScript',
          skill_proficiency: 'Advanced'
        },
        {
          skill_id: 2,
          skill_name: 'React',
          skill_proficiency: 'Intermediate'
        }
      ]);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/api/skills-information`, {
        withCredentials: true
      });

      const data = response.data?.data || [];

      const formattedData = data.map(item => ({
        skill_id: item.skill_id || null,
        skill_name: item.skill_name || '',
        skill_proficiency: item.skill_proficiency || 'Beginner'
      }));

      setSkillsDetails(formattedData);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }

      if (err.response?.status === 404) {
        setSkillsDetails([]);
        return;
      }

      throw err;
    }
  };

  const fetchAccomplishmentDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/accomplishment-information`, {
        withCredentials: true
      });

      const data = response.data?.data || [];

      const formattedData = data.map(item => ({
        accomplishment_id: item.accomplishment_id || null,
        title: item.title || '',
        institution: item.institution || '',
        type: item.type || '',
        description: item.description || '',
        accomplishment_date: item.accomplishment_date || '',
        rank: item.rank || ''
      }));

      setAccomplishmentDetails(formattedData);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }

      if (err.response?.status === 404) {
        setAccomplishmentDetails([]);
        return;
      }

      throw err;
    }
  };

  const fetchExtraCurricularDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/extra-curricular-information`, {
        withCredentials: true
      });

      const data = response.data?.data || [];

      const formattedData = data.map(item => ({
        extra_curricular_id: item.extra_curricular_id || null,
        activity_name: item.activity_name || '',
        role: item.role || '',
        organization: item.organization || '',
        duration: item.duration || ''
      }));

      setExtraCurricularDetails(formattedData);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
        return;
      }

      if (err.response?.status === 404) {
        setExtraCurricularDetails([]);
        return;
      }

      throw err;
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);

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
      if (failures.length === results.length) {
        const err = failures[0].reason;
        console.error('Error loading dashboard data:', err);
        setError(err?.response?.data?.error || err?.message || 'Failed to load dashboard');
      } else if (failures.length > 0) {
        failures.forEach((failure) => {
          console.warn('Partial dashboard load failure:', failure.reason);
        });
      }

      setLoading(false);
    };

    loadDashboardData();
  }, [navigate]);

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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon"></div>
        <h3>Error loading dashboard</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  if (!personalDetails.firstName && !personalDetails.lastName) {
    return (
      <div className="no-details-container">
        <h2>No Personal Details Found</h2>
        <button onClick={() => navigate('/personal-details-form')} className="add-details-button">
          Add Personal Details
        </button>
      </div>
    );
  }

  // Placeholder data for other tabs (to be replaced with API calls)
  const academicData = [];
  const experienceData = [];
  const skillsData = [];
  const projectsData = [];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="profile-section">
          <div className="profile-info">
            <h1>{personalDetails.firstName} {personalDetails.lastName}</h1>
            <p className="institute-roll">{personalDetails.instituteRollNo}</p>
            <div className="contact-info">
              <span>{personalDetails.email}</span>
              <span>{personalDetails.phone}</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <ul className="section-tabs">
          <li className={activeSection === 'overview' ? 'active' : ''} 
              onClick={() => setActiveSection('overview')}>Overview</li>
          <li className={activeSection === 'academic' ? 'active' : ''} 
              onClick={() => setActiveSection('academic')}>Academic</li>
          <li className={activeSection === 'experience' ? 'active' : ''} 
              onClick={() => setActiveSection('experience')}>Experience</li>
          <li className={activeSection === 'skills' ? 'active' : ''} 
              onClick={() => setActiveSection('skills')}>Skills</li>
          <li className={activeSection === 'activities' ? 'active' : ''} 
              onClick={() => setActiveSection('activities')}>Activities</li>
        </ul>
      </nav>

      <main className="dashboard-content">
        {activeSection === 'overview' && (
          <section className="overview-section">
            <h2>Personal Information</h2>
            <div className="personal-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{personalDetails.firstName} {personalDetails.lastName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Roll Number</span>
                  <span className="detail-value">{personalDetails.instituteRollNo}</span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{personalDetails.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{personalDetails.phone}</span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-label">Date of Birth</span>
                  <span className="detail-value">{formatDate(personalDetails.dob)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gender</span>
                  <span className="detail-value">{personalDetails.gender || 'Not specified'}</span>
                </div>
              </div>
            </div>

            {/* <h2>Highlights</h2>
            <div className="highlights-grid">
              {skillsData.length > 0 && (
                <div className="highlight-box">
                  <h3>Skills</h3>
                  <div className="highlight-content">
                    {skillsData.slice(0, 3).map((skill, index) => (
                      <span key={index} className={`skill-badge ${getProficiencyColor(skill.proficiency)}`}>
                        {skill.name}
                      </span>
                    ))}
                    {skillsData.length > 3 && (
                      <span className="more-badge">+{skillsData.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}

              {projectsData.length > 0 && (
                <div className="highlight-box">
                  <h3>Projects</h3>
                  <div className="highlight-content">
                    {projectsData.slice(0, 1).map((project, index) => (
                      <div key={index} className="highlight-item">
                        <span className="highlight-title">{project.title}</span>
                        <span className="highlight-subtitle">{project.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {accomplishmentDetails.length > 0 && (
                <div className="highlight-box">
                  <h3>Accomplishments</h3>
                  <div className="highlight-content">
                    {accomplishmentDetails.slice(0, 1).map((accom, index) => (
                      <div key={index} className="highlight-item">
                        <span className="highlight-title">{accom.title}</span>
                        <span className="highlight-subtitle">{accom.institution}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {internshipDetails.length > 0 && (
                <div className="highlight-box">
                  <h3>Experience</h3>
                  <div className="highlight-content">
                    {internshipDetails.slice(0, 1).map((intern, index) => (
                      <div key={index} className="highlight-item">
                        <span className="highlight-title">{intern.position}</span>
                        <span className="highlight-subtitle">{intern.company}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div> */}
          </section>
        )}

        {activeTab === 'academic' && (
          <div className="tab-content">
            <h2>Academic Information</h2>
            {academicData.length > 0 ? (
              <div className="data-grid">
                {/* Academic data will be rendered here */}
              </div>
            ) : (
              <p className="no-data-message">No academic information available</p>
            )}
          </div>
        )}

        {activeSection === 'experience' && (
          <section className="experience-section">
          <h2>Internships</h2>
            <div className="experience-timeline">
              {internshipDetails.length > 0 ? (
                internshipDetails.map((internshipDetails, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="experience-header">
                        <h3>{internshipDetails.position}</h3>
                        <div className="experience-duration">
                          {formatDate(internshipDetails.startDate)} - {internshipDetails.endDate ? formatDate(internshipDetails.endDate) : 'Present'}
                        </div>
                      </div>
                      <div className="experience-company">
                        <span>{internshipDetails.company}</span>
                        <span className="experience-location">{internshipDetails.location}</span>
                      </div>
                      <div className="experience-details">
                        <div className="experience-sector">
                          <span className="detail-label">Sector:</span>
                          <span className="detail-value">{internshipDetails.sector}</span>
                        </div>
                        {internshipDetails.stipend && (
                          <div className="experience-stipend">
                            <span className="detail-label">Stipend:</span>
                            <span className="detail-value">{internshipDetails.stipend}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data-message">No internships added yet.</p>
              )}
            </div>

            <h2>Volunteering</h2>
            <div className="experience-timeline">
              {volunteeringDetails.length > 0 ? (
                volunteeringDetails.map((volunteeringDetails, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker volunteer-marker"></div>
                    <div className="timeline-content">
                      <div className="experience-header">
                        <h3>{volunteeringDetails.organization}</h3>
                        <div className="experience-duration">
                          {formatDate(volunteeringDetails.startDate)} - {volunteeringDetails.endDate ? formatDate(volunteeringDetails.endDate) : 'Present'}
                        </div>
                      </div>
                      <div className="experience-company">
                        <span>{volunteeringDetails.location}</span>
                        <span className="experience-sector">{volunteeringDetails.sector}</span>
                      </div>
                      <p className="volunteer-task">{volunteeringDetails.task}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data-message">No volunteering experience added yet.</p>
              )}
            </div>
          </section>
        )}
        
        {activeSection === 'skills' && (
          <section className="skills-section">
            <h2>Technical & Soft Skills</h2>
              <div className="skills-container">
                {skillsDetails.length > 0 ? (
                  <div className="skills-grid">
                    {skillsDetails.map((skillsDetails, index) => (
                      <div key={index} className="skill-item">
                        <div className="skill-name">{skillsDetails.skill_name}</div>
                        <div className="skill-proficiency-bar">
                          <div 
                            className={`proficiency-level ${skillsDetails.skill_proficiency.toLowerCase()}`} 
                            style={{ 
                              width: skillsDetails.skill_proficiency === 'Beginner' ? '33%' : 
                                    skillsDetails.skill_proficiency === 'Intermediate' ? '66%' : '100%' 
                            }}
                          ></div>
                        </div>
                        <div className="proficiency-label">{skillsDetails.skill_proficiency}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data-message">No skills added yet.</p>
                )}
              </div>
          </section>
        )}

        {activeSection === 'activities' && (
          <section className="activities-section">
            <h2>Competitions & Events</h2>
            <div className="competitions-list">
              {competitionDetails.length > 0 ? (
                competitionDetails.map((competition, index) => (
                  <div key={index} className="competition-item">
                    <div className="competition-header">
                      <h3>{competition.event_name}</h3>
                      <span className="competition-date">{formatDate(competition.event_date)}</span>
                    </div>
                    <div className="competition-role-achievement">
                      {competition.role && <span className="competition-role">{competition.role}</span>}
                      {competition.achievement && <span className="competition-achievement">{competition.achievement}</span>}
                    </div>
                    {competition.skills && competition.skills.length > 0 && (
                      <div className="competition-skills">
                        <span className="detail-label">Skills Demonstrated:</span>
                        <div className="skills-tags">
                          {competition.skills.map((skill, i) => (
                            <span key={i} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-data-message">No competitions added yet.</p>
              )}
            </div>

            <h2>Accomplishments</h2>
            <div className="other-accomplishments">
              {accomplishmentDetails.filter(a => a.type !== 'Academic').length > 0 ? (
                accomplishmentDetails.filter(a => a.type !== 'Academic').map((accomplishmentDetails, index) => (
                  <div key={index} className="accomplishment-item">
                    <div className="accomplishment-header">
                      <h3>{accomplishmentDetails.title}</h3>
                      <span className="accomplishment-date">{formatDate(accomplishmentDetails.accomplishment_date)}</span>
                    </div>
                    <div className="accomplishment-institution">{accomplishmentDetails.institution}</div>
                    <div className="accomplishment-type">{accomplishmentDetails.type}</div>
                    <p className="accomplishment-description">{accomplishmentDetails.description}</p>
                    {accomplishmentDetails.rank && <div className="accomplishment-rank">Rank: {accomplishmentDetails.rank}</div>}
                  </div>
                ))
              ) : (
                <p className="no-data-message">No other accomplishments added yet.</p>
              )}
            </div>

            <h2>Extra Curricular Activities</h2>
            <div className="activities-list">
              {extraCurricularDetails.length > 0 ? (
                extraCurricularDetails.map((extraCurricularDetails, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-header">
                      <h3>{extraCurricularDetails.activity_name}</h3>
                      <span className="activity-duration">{formatDuration(extraCurricularDetails.duration)}</span>
                    </div>
                    <div className="activity-details">
                      <span className="activity-role">{extraCurricularDetails.role}</span>
                      <span className="activity-organization">{extraCurricularDetails.organization}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data-message">No extracurricular activities added yet.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}