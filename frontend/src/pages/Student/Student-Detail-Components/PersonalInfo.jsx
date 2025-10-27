import React, { useState } from 'react';

const genderOptions = ['Male', 'Female', 'Other'];

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const PersonalInfo = ({ formData, handleInputChange, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${BASE_URL}/api/personal-details-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          dob: formData.dob,
          gender: formData.gender,
          institute_roll_no: formData.instituteRollNo,
          personal_email: formData.email,
          phone_number: formData.phone
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save personal information');
      }

      setSuccess('Personal information saved successfully');
      if (onSave) {
        onSave(); // Call without arguments since your parent just needs to mark as saved
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="form-section">
      <h2>Personal Information</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {isLoading && <div className="loading-indicator">Loading...</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>First Name:</label>
          <input
            type="text"
            value={formData.firstName || ''}
            onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={formData.lastName || ''}
            onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Phone:</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            value={formData.dob || ''}
            onChange={(e) => handleInputChange('personal', 'dob', e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Gender:</label>
          <select
            value={formData.gender || ''}
            onChange={(e) => handleInputChange('personal', 'gender', e.target.value)}
            required
          >
            <option value="">Select gender</option>
            {genderOptions.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Institute Roll No:</label>
          <input
            type="text"
            value={formData.instituteRollNo || ''}
            onChange={(e) => handleInputChange('personal', 'instituteRollNo', e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Information'}
        </button>
      </form>
    </div>
  );
};

export default PersonalInfo;