import React, { useState } from 'react';

const accomplishmentTypes = [
  'Award', 'Certification', 'Competition', 'Workshop', 
  'Patent', 'Publication', 'Scholarship', 'Other'
];

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const Accomplishments = ({ accomplishments, handleInputChange, addItem, removeItem, onSave }) => {
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
      const response = await fetch(`${BASE_URL}/api/accomplishment-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          accomplishments: accomplishments.map(accomplishment => ({
            title: accomplishment.title,
            institution: accomplishment.institution,
            type: accomplishment.type,
            description: accomplishment.description,
            date: accomplishment.date,
            rank: accomplishment.rank || null
          }))
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save accomplishments');
      }

      setSuccess('Accomplishments saved successfully');
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
      <h2>Accomplishments</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {isLoading && <div className="loading-indicator">Loading...</div>}

      <form onSubmit={handleSubmit}>
        {accomplishments.map((accomplishment, index) => (
          <div key={index} className="repeatable-item">
            <h3>Accomplishment {index + 1}</h3>
            <div className="input-group">
              <label>Title:</label>
              <input
                type="text"
                value={accomplishment.title || ''}
                onChange={(e) => handleInputChange('accomplishments', 'title', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Institution:</label>
              <input
                type="text"
                value={accomplishment.institution || ''}
                onChange={(e) => handleInputChange('accomplishments', 'institution', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Type:</label>
              <select
                value={accomplishment.type || ''}
                onChange={(e) => handleInputChange('accomplishments', 'type', e.target.value, index)}
                required
              >
                <option value="">Select type</option>
                {accomplishmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Description:</label>
              <textarea
                value={accomplishment.description || ''}
                onChange={(e) => handleInputChange('accomplishments', 'description', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Date:</label>
              <input
                type="date"
                value={accomplishment.date || ''}
                onChange={(e) => handleInputChange('accomplishments', 'date', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Rank (if applicable):</label>
              <input
                type="text"
                value={accomplishment.rank || ''}
                onChange={(e) => handleInputChange('accomplishments', 'rank', e.target.value, index)}
                placeholder="e.g., 1st, 2nd, Finalist"
              />
            </div>
            {accomplishments.length > 1 && (
              <button 
                type="button" 
                className="remove-button" 
                onClick={() => removeItem('accomplishments', index)}
                disabled={isLoading}
              >
                Remove Accomplishment
              </button>
            )}
          </div>
        ))}
        <div className="button-group">
          <button 
            type="button" 
            className="add-button" 
            onClick={() => addItem('accomplishments')}
            disabled={isLoading}
          >
            Add Another Accomplishment
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Accomplishments'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Accomplishments;