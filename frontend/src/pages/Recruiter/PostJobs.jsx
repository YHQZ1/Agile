import React, { useEffect, useState } from 'react';
import '../../styles/Recruiter/PostJobs.css';
import { BACKEND_URL } from '../../config/env';

const API_BASE = BACKEND_URL;

const positionTypes = ['Internship', 'Full-Time', 'Contract', 'Part-Time'];
const jobFunctions = [
  'Software Development',
  'Marketing',
  'Data Science',
  'Product Management',
  'UX/UI Design',
  'Quality Assurance',
  'DevOps',
  'Business Analysis'
];

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'paused', label: 'Paused' },
  { value: 'published', label: 'Published' },
  { value: 'closed', label: 'Closed' }
];

const initialFormState = {
  jobTitle: '',
  location: '',
  positionType: '',
  expectedHires: '',
  jobFunction: '',
  ctc: '',
  stipend: '',
  jobDescription: '',
  visitDate: '',
  status: 'open'
};

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const statusLabelMap = statusOptions.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

const PostJobs = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      let recruiterProfile = null;

      try {
        const profileResponse = await fetch(`${API_BASE}/api/recruiter/profile`, {
          credentials: 'include'
        });

        if (profileResponse.status === 404) {
          if (isMounted) {
            setFeedback({ type: 'warning', message: 'Complete your company profile before posting jobs.' });
          }
        } else {
          const profileJson = await profileResponse.json().catch(() => ({}));
          if (!profileResponse.ok) {
            throw new Error(profileJson?.message || 'Unable to load recruiter profile');
          }
          recruiterProfile = profileJson?.data || null;
          if (isMounted && recruiterProfile) {
            setProfile(recruiterProfile);
          }
        }
      } catch (error) {
        if (isMounted) {
          setFeedback({ type: 'error', message: error.message || 'Failed to load recruiter profile' });
        }
      }

      if (isMounted && recruiterProfile) {
        try {
          const jobsResponse = await fetch(`${API_BASE}/api/recruiter/jobs`, {
            credentials: 'include'
          });

          if (jobsResponse.ok) {
            const jobsJson = await jobsResponse.json();
            const jobList = Array.isArray(jobsJson?.data) ? jobsJson.data : [];
            if (isMounted) {
              setJobs(jobList);
            }
          } else if (jobsResponse.status !== 409) {
            const errJson = await jobsResponse.json().catch(() => ({}));
            throw new Error(errJson?.message || 'Failed to fetch job postings');
          }
        } catch (error) {
          if (isMounted) {
            setFeedback((prev) => prev.type ? prev : { type: 'error', message: error.message || 'Failed to fetch job postings' });
          }
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.jobTitle.trim()) validationErrors.jobTitle = 'Job title is required';
    if (!formData.location.trim()) validationErrors.location = 'Location is required';
    if (!formData.positionType) validationErrors.positionType = 'Position type is required';
    if (!formData.expectedHires || Number(formData.expectedHires) <= 0) {
      validationErrors.expectedHires = 'Expected hires must be at least 1';
    }
    if (!formData.jobFunction) validationErrors.jobFunction = 'Job function is required';
    if (!formData.jobDescription.trim()) validationErrors.jobDescription = 'Job description is required';
    if (!formData.visitDate) validationErrors.visitDate = 'Application deadline is required';

    if (formData.positionType === 'Internship') {
      if (!formData.stipend) {
        validationErrors.stipend = 'Stipend is required for internships';
      }
    } else if (!formData.ctc) {
      validationErrors.ctc = 'CTC is required for non-internship roles';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!profile) {
      setFeedback({ type: 'warning', message: 'Create your company profile before posting jobs.' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const payload = {
        title: formData.jobTitle.trim(),
        employment_type: formData.positionType,
        job_function: formData.jobFunction || null,
        location: formData.location.trim(),
        openings: Number.parseInt(formData.expectedHires, 10) || 1,
        salary_ctc: formData.positionType === 'Internship' ? null : toNumberOrNull(formData.ctc),
        stipend_amount: formData.positionType === 'Internship' ? toNumberOrNull(formData.stipend) : null,
        compensation_notes: null,
        description: formData.jobDescription.trim(),
        application_deadline: formData.visitDate || null,
        status: formData.status,
      };

      const response = await fetch(`${API_BASE}/api/recruiter/jobs`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to create job posting');
      }

      const createdJob = data?.data
        ? { ...data.data, applications_count: data.data.applications_count ?? 0 }
        : null;

      if (createdJob) {
        setJobs((prev) => [createdJob, ...prev]);
      }

      setFeedback({ type: 'success', message: data?.message || 'Job posted successfully' });
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error posting job:', error);
      setFeedback({ type: 'error', message: error.message || 'Failed to create job posting' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-jobs-container">
      <div className="post-jobs-card">
        <header className="post-jobs-header">
          <h1>Create Job Profile</h1>
          <p>Fill in the details to post a new job opportunity for students.</p>

          {profile && (
            <div className="post-jobs-company-chip">
              Posting as <strong>{profile.company_name}</strong>
            </div>
          )}
        </header>

        <form onSubmit={handleSubmit} className="post-jobs-form">
          {feedback.message && (
            <div className={`post-job-banner post-job-banner-${feedback.type}`}>
              {feedback.message}
            </div>
          )}

          {isLoading ? (
            <p>Loading recruiter details...</p>
          ) : !profile ? (
            <p className="post-job-warning">
              You need to complete your <a href="/company-profile">company profile</a> before posting jobs.
            </p>
          ) : (
            <>
              <section className="form-section">
                <h2 className="section-title">Basic Information</h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="jobTitle">Job Title*</label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className={errors.jobTitle ? 'error' : ''}
                      placeholder="e.g., Senior Software Engineer"
                    />
                    {errors.jobTitle && <span className="error-message">{errors.jobTitle}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Location*</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={errors.location ? 'error' : ''}
                      placeholder="e.g., Bengaluru, KA"
                    />
                    {errors.location && <span className="error-message">{errors.location}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="positionType">Position Type*</label>
                    <select
                      id="positionType"
                      name="positionType"
                      value={formData.positionType}
                      onChange={handleChange}
                      className={errors.positionType ? 'error' : ''}
                    >
                      <option value="">Select type</option>
                      {positionTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.positionType && <span className="error-message">{errors.positionType}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="expectedHires">Expected Hires*</label>
                    <input
                      type="number"
                      id="expectedHires"
                      name="expectedHires"
                      min="1"
                      value={formData.expectedHires}
                      onChange={handleChange}
                      className={errors.expectedHires ? 'error' : ''}
                    />
                    {errors.expectedHires && <span className="error-message">{errors.expectedHires}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="jobFunction">Job Function*</label>
                    <select
                      id="jobFunction"
                      name="jobFunction"
                      value={formData.jobFunction}
                      onChange={handleChange}
                      className={errors.jobFunction ? 'error' : ''}
                    >
                      <option value="">Select function</option>
                      {jobFunctions.map((func) => (
                        <option key={func} value={func}>{func}</option>
                      ))}
                    </select>
                    {errors.jobFunction && <span className="error-message">{errors.jobFunction}</span>}
                  </div>

                  {formData.positionType === 'Internship' ? (
                    <div className="form-group">
                      <label htmlFor="stipend">Stipend* (per month)</label>
                      <input
                        type="number"
                        id="stipend"
                        name="stipend"
                        min="0"
                        value={formData.stipend}
                        onChange={handleChange}
                        className={errors.stipend ? 'error' : ''}
                        placeholder="e.g., 25000"
                      />
                      {errors.stipend && <span className="error-message">{errors.stipend}</span>}
                    </div>
                  ) : (
                    <div className="form-group">
                      <label htmlFor="ctc">CTC* (Annual)</label>
                      <input
                        type="number"
                        id="ctc"
                        name="ctc"
                        min="0"
                        value={formData.ctc}
                        onChange={handleChange}
                        className={errors.ctc ? 'error' : ''}
                        placeholder="e.g., 1200000"
                      />
                      {errors.ctc && <span className="error-message">{errors.ctc}</span>}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="visitDate">Application Deadline*</label>
                    <input
                      type="date"
                      id="visitDate"
                      name="visitDate"
                      value={formData.visitDate}
                      onChange={handleChange}
                      className={errors.visitDate ? 'error' : ''}
                    />
                    {errors.visitDate && <span className="error-message">{errors.visitDate}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="form-section">
                <h2 className="section-title">Job Description</h2>

                <div className="form-group full-width">
                  <label htmlFor="jobDescription">Job Description*</label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows="6"
                    className={errors.jobDescription ? 'error' : ''}
                    placeholder="Outline responsibilities, required skills, and benefits"
                  />
                  {errors.jobDescription && <span className="error-message">{errors.jobDescription}</span>}
                </div>
              </section>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Posting...
                    </>
                  ) : (
                    'Create Job Profile'
                  )}
                </button>
              </div>

              {jobs.length > 0 && (
                <section className="jobs-list-section">
                  <h2 className="section-title">Recent Job Posts</h2>
                  <div className="jobs-list">
                    {jobs.map((job) => (
                      <article key={job.job_id} className="job-card">
                        <div className="job-card-header">
                          <h3>{job.title}</h3>
                          <span className={`job-status job-status-${job.status}`}>{statusLabelMap[job.status] || job.status}</span>
                        </div>
                        <p className="job-meta">
                          <span>{job.location}</span>
                          <span>
                            {job.employment_type ?? 'N/A'} · {job.openings} opening{job.openings > 1 ? 's' : ''}
                          </span>
                        </p>
                        <p className="job-meta">
                          Posted on {job.created_at ? new Date(job.created_at).toLocaleDateString() : '—'} · {job.applications_count ?? 0} applications
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJobs;