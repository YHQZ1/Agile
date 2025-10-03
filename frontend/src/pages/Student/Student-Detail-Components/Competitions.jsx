import React, { useState } from 'react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const Competitions = ({ competitions, handleInputChange, addItem, removeItem, onSave }) => {
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
      const response = await fetch(`${BASE_URL}/api/competitions-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          competitions: competitions.map(competition => ({
            event_name: competition.name,
            date: competition.date,
            role: competition.role,
            achievement: competition.achievement,
            skills_demonstrated: competition.skills
          }))
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save competitions');
      }

      setSuccess('Competitions saved successfully');
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
      <h2>Competitions & Events</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {isLoading && <div className="loading-indicator">Loading...</div>}

      <form onSubmit={handleSubmit}>
        {competitions.map((competition, index) => (
          <div key={index} className="repeatable-item">
            <h3>Competition/Event {index + 1}</h3>
            <div className="input-group">
              <label>Event Name:</label>
              <input
                type="text"
                value={competition.name || ''}
                onChange={(e) => handleInputChange('competitions', 'name', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Date:</label>
              <input
                type="date"
                value={competition.date || ''}
                onChange={(e) => handleInputChange('competitions', 'date', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Role/Participation Type:</label>
              <input
                type="text"
                value={competition.role || ''}
                onChange={(e) => handleInputChange('competitions', 'role', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Achievement/Outcome:</label>
              <input
                type="text"
                value={competition.achievement || ''}
                onChange={(e) => handleInputChange('competitions', 'achievement', e.target.value, index)}
              />
            </div>
            <div className="input-group">
              <label>Skills Demonstrated:</label>
              <input
                type="text"
                value={competition.skills || ''}
                onChange={(e) => handleInputChange('competitions', 'skills', e.target.value, index)}
              />
            </div>
            {competitions.length > 1 && (
              <button 
                type="button" 
                className="remove-button" 
                onClick={() => removeItem('competitions', index)}
                disabled={isLoading}
              >
                Remove Competition
              </button>
            )}
          </div>
        ))}
        <div className="button-group">
          <button 
            type="button" 
            className="add-button" 
            onClick={() => addItem('competitions')}
            disabled={isLoading}
          >
            Add Another Competition/Event
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Competitions'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Competitions;