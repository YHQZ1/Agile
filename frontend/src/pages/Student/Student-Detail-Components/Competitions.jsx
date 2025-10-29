import React, { useState } from 'react';
import { BACKEND_URL } from '../../../config/env';

const BASE_URL = BACKEND_URL;

const Competitions = ({ competitions, handleInputChange, addItem, removeItem, onSave }) => {
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
        competitions.map(async (competition) => {
          if (!competition.name || !competition.date) {
            throw new Error('Each competition requires a name and date.');
          }

          const response = await fetch(`${BASE_URL}/api/competitions-form`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              event_name: competition.name,
              event_date: competition.date,
              role: competition.role || null,
              achievement: competition.achievement || null,
              skills: competition.skills || null
            })
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.error || 'Failed to save competition');
          }

          return responseData;
        })
      );

      setSuccess(`${results.length} competition${results.length > 1 ? 's' : ''} saved successfully`);
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