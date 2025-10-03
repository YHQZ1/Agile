import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/Student/Application.css';

const Application = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    profilePicture: null,
    collegeName: '',
    rollNumber: '',
    branch: '',
    batch: '',
    currentSemester: '',
    cgpa: '',
    primaryEmail: '',
    personalEmail: '',
    phoneNumber: '',
    linkedinProfile: '',
    githubProfile: '',
    personalWebsite: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    text: '',
    class: 'strength-none-app'
  });

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    document.title = "Apply Now - Student Registration";
  }, []);

  const handleBackButton = () => {
    // Navigate back in browser history
    window.history.back();
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    }
    
    if (currentStep === 2) {
      if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
      if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
      if (!formData.branch.trim()) newErrors.branch = 'Branch is required';
      if (!formData.batch.trim()) newErrors.batch = 'Batch is required';
      if (!formData.currentSemester.trim()) newErrors.currentSemester = 'Current semester is required';
      if (!formData.cgpa) newErrors.cgpa = 'CGPA is required';
      else if (isNaN(formData.cgpa)) newErrors.cgpa = 'CGPA must be a number';
    }
    
    if (currentStep === 3) {
      if (!formData.primaryEmail.trim()) newErrors.primaryEmail = 'Primary email is required';
      else if (!/^\S+@\S+\.\S+$/.test(formData.primaryEmail)) newErrors.primaryEmail = 'Invalid email format';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (currentStep === 4) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        setPasswordMatch(false);
      } else {
        setPasswordMatch(true);
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }

    // Password strength and matching
    if (name === 'password') {
      checkPasswordStrength(value);
      if (formData.confirmPassword) {
        setPasswordMatch(value === formData.confirmPassword);
      }
    }
    if (name === 'confirmPassword') {
      setPasswordMatch(value === formData.password);
    }
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (!password) {
      setPasswordStrength({
        score: 0,
        text: '',
        class: 'strength-none-app'
      });
      return;
    }

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Complexity checks
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let strengthClass = '';
    let strengthText = '';

    if (score < 2) {
      strengthClass = 'strength-weak-app';
      strengthText = 'Weak';
    } else if (score < 4) {
      strengthClass = 'strength-medium-app';
      strengthText = 'Medium';
    } else if (score < 5) {
      strengthClass = 'strength-good-app';
      strengthText = 'Good';
    } else {
      strengthClass = 'strength-strong-app';
      strengthText = 'Strong';
    }

    setPasswordStrength({
      score,
      text: strengthText,
      class: strengthClass
    });
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all steps before submission
    let isValid = true;
    for (let step = 1; step <= totalSteps; step++) {
      setCurrentStep(step);
      isValid = validateCurrentStep() && isValid;
      if (!isValid) break;
    }
    
    if (!isValid) {
      alert('Please fix all errors before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would typically send the data to your backend
      // For demonstration, we'll simulate an API call
      console.log('Submitting form data:', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      alert('Application submitted successfully!');
      
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        profilePicture: null,
        collegeName: '',
        rollNumber: '',
        branch: '',
        batch: '',
        currentSemester: '',
        cgpa: '',
        primaryEmail: '',
        personalEmail: '',
        phoneNumber: '',
        linkedinProfile: '',
        githubProfile: '',
        personalWebsite: '',
        password: '',
        confirmPassword: ''
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form steps
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-section-app">
            <h2 className="section-title-app">Personal Information</h2>
            <div className="form-row-app">
              <div className="form-group-app">
                <label>First Name*</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                  className={errors.firstName ? 'error-app' : ''}
                />
                {errors.firstName && <span className="error-message-app">{errors.firstName}</span>}
              </div>
              <div className="form-group-app">
                <label>Last Name*</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleInputChange} 
                  className={errors.lastName ? 'error-app' : ''}
                />
                {errors.lastName && <span className="error-message-app">{errors.lastName}</span>}
              </div>
            </div>
            <div className="form-row-app">
              <div className="form-group-app">
                <label>Date of Birth*</label>
                <input 
                  type="date" 
                  name="dateOfBirth" 
                  value={formData.dateOfBirth} 
                  onChange={handleInputChange} 
                  className={errors.dateOfBirth ? 'error-app' : ''}
                />
                {errors.dateOfBirth && <span className="error-message-app">{errors.dateOfBirth}</span>}
              </div>
              <div className="form-group-app">
                <label>Gender*</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange} 
                  className={errors.gender ? 'error-app' : ''}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <span className="error-message-app">{errors.gender}</span>}
              </div>
            </div>
            <div className="form-group-app">
              <label>Profile Picture</label>
              <input 
                type="file" 
                name="profilePicture" 
                onChange={handleInputChange}
                className="file-input-app"
                accept="image/*"
              />
            </div>
            <div className="button-group-app">
              <button type="button" onClick={handleNextStep} className="btn-app btn-next-app">Next</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-section-app">
            <h2 className="section-title-app">Academic Information</h2>
            <div className="form-group-app">
              <label>College Name*</label>
              <input 
                type="text" 
                name="collegeName" 
                value={formData.collegeName} 
                onChange={handleInputChange} 
                className={errors.collegeName ? 'error-app' : ''}
              />
              {errors.collegeName && <span className="error-message-app">{errors.collegeName}</span>}
            </div>
            <div className="form-row-app">
              <div className="form-group-app">
                <label>Roll Number*</label>
                <input 
                  type="text" 
                  name="rollNumber" 
                  value={formData.rollNumber} 
                  onChange={handleInputChange} 
                  className={errors.rollNumber ? 'error-app' : ''}
                />
                {errors.rollNumber && <span className="error-message-app">{errors.rollNumber}</span>}
              </div>
              <div className="form-group-app">
                <label>Branch*</label>
                <input 
                  type="text" 
                  name="branch" 
                  value={formData.branch} 
                  onChange={handleInputChange} 
                  className={errors.branch ? 'error-app' : ''}
                />
                {errors.branch && <span className="error-message-app">{errors.branch}</span>}
              </div>
            </div>
            <div className="form-row-app">
              <div className="form-group-app">
                <label>Batch*</label>
                <input 
                  type="text" 
                  name="batch" 
                  value={formData.batch} 
                  onChange={handleInputChange} 
                  className={errors.batch ? 'error-app' : ''}
                />
                {errors.batch && <span className="error-message-app">{errors.batch}</span>}
              </div>
              <div className="form-group-app">
                <label>Current Semester*</label>
                <input 
                  type="text" 
                  name="currentSemester" 
                  value={formData.currentSemester} 
                  onChange={handleInputChange} 
                  className={errors.currentSemester ? 'error-app' : ''}
                />
                {errors.currentSemester && <span className="error-message-app">{errors.currentSemester}</span>}
              </div>
            </div>
            <div className="form-group-app">
              <label>CGPA*</label>
              <input 
                type="number" 
                name="cgpa" 
                value={formData.cgpa} 
                onChange={handleInputChange} 
                step="0.01"
                min="0"
                max="10"
                className={errors.cgpa ? 'error-app' : ''}
              />
              {errors.cgpa && <span className="error-message-app">{errors.cgpa}</span>}
            </div>
            <div className="button-group-app">
              <button type="button" onClick={handlePrevStep} className="btn-app btn-prev-app">Previous</button>
              <button type="button" onClick={handleNextStep} className="btn-app btn-next-app">Next</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-section-app">
            <h2 className="section-title-app">Contact Information</h2>
            <div className="form-row-app">
              <div className="form-group-app">
                <label>Primary Email*</label>
                <input 
                  type="email" 
                  name="primaryEmail" 
                  value={formData.primaryEmail} 
                  onChange={handleInputChange} 
                  className={errors.primaryEmail ? 'error-app' : ''}
                />
                {errors.primaryEmail && <span className="error-message-app">{errors.primaryEmail}</span>}
              </div>
              <div className="form-group-app">
                <label>Personal Email</label>
                <input 
                  type="email" 
                  name="personalEmail" 
                  value={formData.personalEmail} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="form-group-app">
              <label>Phone Number*</label>
              <input 
                type="tel" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleInputChange} 
                className={errors.phoneNumber ? 'error-app' : ''}
              />
              {errors.phoneNumber && <span className="error-message-app">{errors.phoneNumber}</span>}
            </div>
            <div className="form-row-app">
              <div className="form-group-app">
                <label>LinkedIn Profile</label>
                <input 
                  type="url" 
                  name="linkedinProfile" 
                  value={formData.linkedinProfile} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="form-group-app">
                <label>GitHub Profile</label>
                <input 
                  type="url" 
                  name="githubProfile" 
                  value={formData.githubProfile} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <div className="form-group-app">
              <label>Personal Website</label>
              <input 
                type="url" 
                name="personalWebsite" 
                value={formData.personalWebsite} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="button-group-app">
              <button type="button" onClick={handlePrevStep} className="btn-app btn-prev-app">Previous</button>
              <button type="button" onClick={handleNextStep} className="btn-app btn-next-app">Next</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-section-app">
            <h2 className="section-title-app">Login Credentials</h2>
            <div className="form-group-app">
              <label>Password*</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                className={errors.password ? 'error-app' : ''}
              />
              <div className="password-strength-app">
                <div className="strength-bar-app">
                  <div 
                    className={`strength-indicator-app ${passwordStrength.class}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
                {passwordStrength.text && (
                  <div className="strength-text-app">
                    Password Strength: {passwordStrength.text}
                  </div>
                )}
              </div>
              {errors.password && <span className="error-message-app">{errors.password}</span>}
            </div>
            <div className="form-group-app">
              <label>Confirm Password*</label>
              <input 
                type="password" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                className={errors.confirmPassword ? 'error-app' : ''}
              />
              {errors.confirmPassword && <span className="error-message-app">{errors.confirmPassword}</span>}
              {!passwordMatch && (
                <div className="password-mismatch-app">Passwords do not match!</div>
              )}
            </div>
            <div className="button-group-app">
              <button type="button" onClick={handlePrevStep} className="btn-app btn-prev-app">Previous</button>
              <button 
                type="submit" 
                className="btn-app btn-submit-app" 
                disabled={isSubmitting || !passwordMatch || !formData.password || !formData.confirmPassword}
              >
                {isSubmitting ? 'Submitting...' : 'Apply Now'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Calculate progress bar width
  const progressWidth = ((currentStep - 1) / (totalSteps - 1)) * 100;

  if (submitSuccess) {
    return (
      <div className="registration-container-app">
        <button className="back-button-app" onClick={handleBackButton}>← Back</button>
        <h1 className="registration-title-app">Application Submitted!</h1>
        <div className="success-message-app">
          <p>Thank you for your application. We'll review your information and get back to you soon.</p>
          <button 
            className="btn-app btn-submit-app"
            onClick={() => setSubmitSuccess(false)}
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`registration-container-app ${darkMode ? 'dark-theme-app' : ''}`}>
      <button className="back-button-app" onClick={handleBackButton}>← Back</button>
      <h1 className="registration-title-app">Apply Now</h1>
      
      {/* Progress bar */}
      <div className="progress-container-app">
        <div className="step-indicators-app">
          {[...Array(totalSteps)].map((_, i) => (
            <div 
              key={i} 
              className={`step-circle-app ${currentStep > i + 1 ? 'completed-app' : ''} ${currentStep === i + 1 ? 'active-app' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="progress-bar-container-app">
          <div className="progress-bar-background-app"></div>
          <div 
            className="progress-bar-fill-app" 
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
        <div className="step-labels-app">
          <span className={currentStep === 1 ? 'active-app' : ''}>Personal Info</span>
          <span className={currentStep === 2 ? 'active-app' : ''}>Academic Info</span>
          <span className={currentStep === 3 ? 'active-app' : ''}>Contact Info</span>
          <span className={currentStep === 4 ? 'active-app' : ''}>Credentials</span>
        </div>
      </div>
      
      <form className="registration-form-app" onSubmit={handleSubmit}>
        {renderStep()}
      </form>
    </div>
  );
};

export default Application;