import React, { useState } from 'react';

const durationOptions = [
  '< 6 months', '6 months', '1 year', '2 years', '3 years', '4+ years'
];

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const ExtraCurricular = ({ extraCurricular, handleInputChange, addItem, removeItem, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${BASE_URL}/api/extra-curricular-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          extracurricular: extraCurricular.map(activity => ({
            activity_name: activity.activity,
            role: activity.role,
            organization: activity.organization,
            duration: activity.duration
          }))
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save extracurricular activities');
      }

      setSuccess('Extracurricular activities saved successfully');
      if (onSave) {
        onSave();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-section">
      <h2>Extra-Curricular Activities</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {isLoading && <div className="loading-indicator">Loading...</div>}

      <form onSubmit={handleSubmit}>
        {extraCurricular.map((activity, index) => (
          <div key={index} className="repeatable-item">
            <h3>Activity {index + 1}</h3>
            <div className="input-group">
              <label>Activity Name:</label>
              <input
                type="text"
                value={activity.activity || ''}
                onChange={(e) => handleInputChange('extraCurricular', 'activity', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Role/Position:</label>
              <input
                type="text"
                value={activity.role || ''}
                onChange={(e) => handleInputChange('extraCurricular', 'role', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Club/Organization:</label>
              <input
                type="text"
                value={activity.organization || ''}
                onChange={(e) => handleInputChange('extraCurricular', 'organization', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Duration:</label>
              <select
                value={activity.duration || ''}
                onChange={(e) => handleInputChange('extraCurricular', 'duration', e.target.value, index)}
                required
              >
                <option value="">Select duration</option>
                {durationOptions.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
            {extraCurricular.length > 1 && (
              <button 
                type="button" 
                className="remove-button" 
                onClick={() => removeItem('extraCurricular', index)}
                disabled={isLoading}
              >
                Remove Activity
              </button>
            )}
          </div>
        ))}
        <div className="button-group">
          <button 
            type="button" 
            className="add-button" 
            onClick={() => addItem('extraCurricular')}
            disabled={isLoading}
          >
            Add Another Activity
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Activities'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExtraCurricular;