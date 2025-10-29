import React, { useState } from 'react';
import { BACKEND_URL } from '../../../config/env';

const durationOptions = [
  '< 6 months', '6 months', '1 year', '2 years', '3 years', '4+ years'
];

const BASE_URL = BACKEND_URL;

const ExtraCurricular = ({ extraCurricular, handleInputChange, addItem, removeItem, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const results = await Promise.all(
        extraCurricular.map(async (activity) => {
          const payload = {
            activity_name: activity.activity || null,
            role: activity.role || null,
            organization: activity.organization || null,
            duration: activity.duration || null
          };

          if (!payload.activity_name && !payload.role && !payload.organization && !payload.duration) {
            throw new Error('Provide at least one field for each activity.');
          }

          const response = await fetch(`${BASE_URL}/api/extra-curricular-form`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.error || 'Failed to save extracurricular activity');
          }

          return responseData;
        })
      );

      setSuccess(`${results.length} activit${results.length > 1 ? 'ies' : 'y'} saved successfully`);
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