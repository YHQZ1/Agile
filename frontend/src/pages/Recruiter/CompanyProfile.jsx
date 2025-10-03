import React, { useState } from 'react';
import "../../styles/Recruiter/CompanyProfile.css";

// Constants that could be moved to a separate config file
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Education', 'Other'];
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Other'];
const COMPANY_SIZES = ['Small', 'Medium', 'Large', 'Enterprise'];

const StepIndicator = ({ step, totalSteps }) => {
  return (
    <>
      <div className="step-indicator">
        {[...Array(totalSteps)].map((_, i) => (
          <div key={i} className={`step ${step >= i + 1 ? 'active' : ''}`}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className="step-labels">
        <span className={step === 1 ? 'active' : ''}>Basic Info</span>
        <span className={step === 2 ? 'active' : ''}>Location Info</span>
        <span className={step === 3 ? 'active' : ''}>Additional Info</span>
      </div>
    </>
  );
};

const BasicInfoStep = ({ formData, errors, handleChange }) => {
  return (
    <div className="form-step">
      <h2>Basic Information</h2>
      <div className="form-group">
        <label>Company Name*</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          className={errors.companyName ? 'error' : ''}
        />
        {errors.companyName && <span className="error-message">{errors.companyName}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Industry*</label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            className={errors.industry ? 'error' : ''}
          >
            <option value="">Select Industry</option>
            {INDUSTRIES.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          {errors.industry && <span className="error-message">{errors.industry}</span>}
        </div>

        <div className="form-group">
          <label>Company Size</label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={handleChange}
          >
            <option value="">Select Size</option>
            {COMPANY_SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Company Logo</label>
        <div className="file-upload">
          <input
            type="file"
            id="companyLogo"
            name="companyLogo"
            onChange={handleChange}
            accept="image/*"
          />
          <label htmlFor="companyLogo">Choose file</label>
          <span>{formData.companyLogo ? formData.companyLogo.name : 'No file chosen'}</span>
        </div>
      </div>
    </div>
  );
};

const LocationInfoStep = ({ formData, errors, handleChange }) => {
  return (
    <div className="form-step">
      <h2>Location Information</h2>
      <div className="form-group">
        <label>Address Line 1*</label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          required
          className={errors.addressLine1 ? 'error' : ''}
        />
        {errors.addressLine1 && <span className="error-message">{errors.addressLine1}</span>}
      </div>

      <div className="form-group">
        <label>Address Line 2</label>
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City*</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className={errors.city ? 'error' : ''}
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label>State/Province*</label>
          <input
            type="text"
            name="stateProvince"
            value={formData.stateProvince}
            onChange={handleChange}
            required
            className={errors.stateProvince ? 'error' : ''}
          />
          {errors.stateProvince && <span className="error-message">{errors.stateProvince}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Country*</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className={errors.country ? 'error' : ''}
          >
            <option value="">Select Country</option>
            {COUNTRIES.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {errors.country && <span className="error-message">{errors.country}</span>}
        </div>

        <div className="form-group">
          <label>ZIP/Postal Code*</label>
          <input
            type="text"
            name="zipPostalCode"
            value={formData.zipPostalCode}
            onChange={handleChange}
            required
            className={errors.zipPostalCode ? 'error' : ''}
          />
          {errors.zipPostalCode && <span className="error-message">{errors.zipPostalCode}</span>}
        </div>
      </div>
    </div>
  );
};

const AdditionalInfoStep = ({ formData, errors, handleChange }) => {
  return (
    <div className="form-step">
      <h2>Additional Information</h2>
      <div className="form-group">
        <label>Company Email*</label>
        <input
          type="email"
          name="companyEmail"
          value={formData.companyEmail}
          onChange={handleChange}
          required
          className={errors.companyEmail ? 'error' : ''}
        />
        {errors.companyEmail && <span className="error-message">{errors.companyEmail}</span>}
      </div>

      <div className="form-group">
        <label>Company Phone*</label>
        <input
          type="tel"
          name="companyPhone"
          value={formData.companyPhone}
          onChange={handleChange}
          required
          className={errors.companyPhone ? 'error' : ''}
        />
        {errors.companyPhone && <span className="error-message">{errors.companyPhone}</span>}
      </div>

      <div className="form-group">
        <label>Company Website</label>
        <input
          type="url"
          name="companyWebsite"
          value={formData.companyWebsite}
          onChange={handleChange}
          placeholder="https://example.com"
        />
      </div>

      <div className="form-group">
        <label>Founded Year</label>
        <input
          type="number"
          name="foundedYear"
          value={formData.foundedYear}
          onChange={handleChange}
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>

      <div className="form-group">
        <label>Company Description</label>
        <textarea
          name="companyDescription"
          value={formData.companyDescription}
          onChange={handleChange}
          rows="4"
        />
      </div>
    </div>
  );
};

const CompanyProfile = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    companyEmail: '',
    companyPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateProvince: '',
    country: '',
    zipPostalCode: '',
    companyWebsite: '',
    companyLogo: null,
    companyDescription: '',
    foundedYear: '',
    companySize: ''
  });

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!formData.industry) newErrors.industry = 'Industry is required';
    }
    
    if (step === 2) {
      if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.stateProvince.trim()) newErrors.stateProvince = 'State/Province is required';
      if (!formData.country) newErrors.country = 'Country is required';
      if (!formData.zipPostalCode.trim()) newErrors.zipPostalCode = 'ZIP/Postal code is required';
    }
    
    if (step === 3) {
      if (!formData.companyEmail.trim()) newErrors.companyEmail = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(formData.companyEmail)) newErrors.companyEmail = 'Email is invalid';
      if (!formData.companyPhone.trim()) newErrors.companyPhone = 'Phone is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    try {
      // Submit logic here
      console.log('Form submitted:', formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="form-container success-message">
        <h2>Registration Successful!</h2>
        <p>Your company profile has been created successfully.</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1>Company Profile</h1>
      
      <StepIndicator step={step} totalSteps={3} />
      
      <hr className="divider" />

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <BasicInfoStep 
            formData={formData} 
            errors={errors}
            handleChange={handleChange} 
          />
        )}

        {step === 2 && (
          <LocationInfoStep 
            formData={formData} 
            errors={errors}
            handleChange={handleChange} 
          />
        )}

        {step === 3 && (
          <AdditionalInfoStep 
            formData={formData} 
            errors={errors}
            handleChange={handleChange} 
          />
        )}

        <div className="form-actions">
          {step > 1 && (
            <button type="button" className="secondary-btn" onClick={prevStep}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button type="button" className="primary-btn" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;