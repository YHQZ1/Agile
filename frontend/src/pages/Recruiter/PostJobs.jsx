import React, { useState } from 'react';
import '../../styles/Recruiter/PostJobs.css';

const PostJobs = () => {
  // Sample company data
  const companies = [
    { id: 1, name: 'TechCorp' },
    { id: 2, name: 'InnovateSoft' },
    { id: 3, name: 'DigitalSolutions' }
  ];

  const positionTypes = ['Internship', 'Full-Time', 'Contract'];
  const statusOptions = ['Open', 'Closed', 'Published'];
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

  const [formData, setFormData] = useState({
    jobTitle: '',
    companyId: '',
    location: '',
    positionType: '',
    expectedHires: '',
    jobFunction: '',
    ctc: '',
    stipend: '',
    jobDescription: '',
    visitDate: '',
    status: 'Open',
    jobDescriptionFile: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.companyId) newErrors.companyId = 'Company is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.positionType) newErrors.positionType = 'Position type is required';
    if (!formData.expectedHires || formData.expectedHires < 0) 
      newErrors.expectedHires = 'Valid expected hires is required';
    if (!formData.jobFunction) newErrors.jobFunction = 'Job function is required';
    if (!formData.jobDescription.trim()) newErrors.jobDescription = 'Job description is required';
    if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
    
    if (formData.positionType === 'Internship' && !formData.stipend) {
      newErrors.stipend = 'Stipend is required for internships';
    } else if (formData.positionType !== 'Internship' && !formData.ctc) {
      newErrors.ctc = 'CTC is required for non-internship positions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate form submission
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setIsSubmitting(false);
        alert('Job profile created successfully!');
        // Reset form after successful submission
        setFormData({
          jobTitle: '',
          companyId: '',
          location: '',
          positionType: '',
          expectedHires: '',
          jobFunction: '',
          ctc: '',
          stipend: '',
          jobDescription: '',
          visitDate: '',
          status: 'Open',
          jobDescriptionFile: null
        });
      }, 1500);
    }
  };

  return (
    <div className="post-jobs-container">
      <div className="post-jobs-card">
        <header className="post-jobs-header">
          <h1>Create Job Profile</h1>
          <p>Fill in the details to post a new job opportunity</p>
        </header>
        
        <form onSubmit={handleSubmit} className="post-jobs-form">
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
                <label htmlFor="companyId">Company*</label>
                <select
                  id="companyId"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  className={errors.companyId ? 'error' : ''}
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
                {errors.companyId && <span className="error-message">{errors.companyId}</span>}
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
                  placeholder="e.g., San Francisco, CA"
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
                  <option value="">Select Position Type</option>
                  {positionTypes.map(type => (
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
                  value={formData.expectedHires}
                  onChange={handleChange}
                  min="0"
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
                  <option value="">Select Job Function</option>
                  {jobFunctions.map(func => (
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
                    value={formData.stipend}
                    onChange={handleChange}
                    min="0"
                    className={errors.stipend ? 'error' : ''}
                    placeholder="e.g., 25000"
                  />
                  {errors.stipend && <span className="error-message">{errors.stipend}</span>}
                </div>
              ) : (
                <div className="form-group">
                  <label htmlFor="ctc">CTC (Annual Salary)</label>
                  <input
                    type="number"
                    id="ctc"
                    name="ctc"
                    value={formData.ctc}
                    onChange={handleChange}
                    min="0"
                    className={errors.ctc ? 'error' : ''}
                    placeholder="e.g., 1500000"
                  />
                  {errors.ctc && <span className="error-message">{errors.ctc}</span>}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="visitDate">Visit Date*</label>
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
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
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
                placeholder="Enter detailed job description including responsibilities, requirements, and benefits..."
              />
              {errors.jobDescription && <span className="error-message">{errors.jobDescription}</span>}
            </div>
            
            <div className="form-group full-width">
              <label>Upload JD (PDF, Optional)</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="jobDescriptionFile"
                  name="jobDescriptionFile"
                  onChange={handleChange}
                  accept=".pdf"
                />
                <label htmlFor="jobDescriptionFile" className="file-upload-label">
                  <span className="file-upload-button">Choose File</span>
                  <span className="file-upload-name">
                    {formData.jobDescriptionFile ? formData.jobDescriptionFile.name : 'No file chosen'}
                  </span>
                </label>
              </div>
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
                  Creating...
                </>
              ) : (
                'Create Job Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJobs;