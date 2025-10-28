import React, { useEffect, useState } from 'react';
import "../../styles/Recruiter/CompanyProfile.css";

// Constants that could be moved to a separate config file
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Education', 'Other'];
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Other'];
const COMPANY_SIZES = ['Small', 'Medium', 'Large', 'Enterprise'];
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const mapProfileToFormState = (profile) => ({
  companyName: profile?.company_name || '',
  industry: profile?.industry || '',
  companyEmail: profile?.company_email || '',
  companyPhone: profile?.company_phone || '',
  addressLine1: profile?.address_line1 || '',
  addressLine2: profile?.address_line2 || '',
  city: profile?.city || '',
  stateProvince: profile?.state_province || '',
  country: profile?.country || '',
  zipPostalCode: profile?.postal_code || '',
  companyWebsite: profile?.website || '',
  logoUrl: profile?.logo_url || '',
  companyDescription: profile?.description || '',
  foundedYear: profile?.founded_year ? String(profile.founded_year) : '',
  companySize: profile?.company_size || '',
});

const mapFormToPayload = (formData) => ({
  company_name: formData.companyName.trim(),
  industry: formData.industry || null,
  company_size: formData.companySize || null,
  company_email: formData.companyEmail || null,
  company_phone: formData.companyPhone || null,
  address_line1: formData.addressLine1 || null,
  address_line2: formData.addressLine2 || null,
  city: formData.city || null,
  state_province: formData.stateProvince || null,
  country: formData.country || null,
  postal_code: formData.zipPostalCode || null,
  website: formData.companyWebsite || null,
  description: formData.companyDescription || null,
  founded_year: formData.foundedYear ? Number(formData.foundedYear) : null,
  logo_url: formData.logoUrl || null,
});

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
        <label>Logo URL</label>
        <input
          type="url"
          name="logoUrl"
          value={formData.logoUrl}
          onChange={handleChange}
          placeholder="https://example.com/logo.png"
        />
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
        {errors.foundedYear && <span className="error-message">{errors.foundedYear}</span>}
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
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

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
    logoUrl: '',
    companyDescription: '',
    foundedYear: '',
    companySize: ''
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/recruiter/profile`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.status === 404) {
          if (isMounted) {
            setIsLoading(false);
          }
          return;
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load recruiter profile');
        }

        if (isMounted && data?.data) {
          setFormData(mapProfileToFormState(data.data));
        }
      } catch (error) {
        if (isMounted) {
          setFeedback({ type: 'error', message: error.message || 'Failed to load recruiter profile' });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

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
      if (formData.foundedYear && Number.isNaN(Number(formData.foundedYear))) {
        newErrors.foundedYear = 'Founded year must be numeric';
      }
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
    setFeedback({ type: '', message: '' });
    try {
      const payload = mapFormToPayload(formData);
      const response = await fetch(`${API_BASE}/api/recruiter/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to save recruiter profile');
      }

      setFeedback({ type: 'success', message: data?.message || 'Company profile saved successfully' });

      if (data?.data) {
        setFormData(mapProfileToFormState(data.data));
      }
    } catch (error) {
      console.error('Submission error:', error);
      setFeedback({ type: 'error', message: error.message || 'Failed to save recruiter profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="form-container">
        <h1>Company Profile</h1>
        <p>Loading company details...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1>Company Profile</h1>
      
      {feedback.message && (
        <div className={`banner ${feedback.type === 'error' ? 'banner-error' : 'banner-success'}`}>
          {feedback.message}
        </div>
      )}

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