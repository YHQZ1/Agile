import React, { useState } from 'react';

const companySectorOptions = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
  'Engineering', 'Retail', 'Manufacturing', 'Media', 'Consulting',
  'Non-profit', 'Government', 'Other'
];

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const Volunteering = ({ volunteering, handleInputChange, addItem, removeItem, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate all records before submission
      const validationErrors = volunteering.map((volunteer, index) => {
        const errors = [];
        if (!volunteer.location) errors.push(`Record ${index + 1}: Location is required`);
        if (!volunteer.sector) errors.push(`Record ${index + 1}: Sector is required`);
        if (!volunteer.task) errors.push(`Record ${index + 1}: Task is required`);
        if (!volunteer.startDate) errors.push(`Record ${index + 1}: Start date is required`);
        if (!volunteer.endDate) errors.push(`Record ${index + 1}: End date is required`);
        
        // Date validation
        if (volunteer.startDate && volunteer.endDate) {
          if (new Date(volunteer.startDate) >= new Date(volunteer.endDate)) {
            errors.push(`Record ${index + 1}: End date must be after start date`);
          }
        }
        return errors;
      }).flat();

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      // Submit each record individually
      const results = await Promise.all(
        volunteering.map(async (volunteer) => {
          const response = await fetch(`${BASE_URL}/api/volunteer-details-form`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              location: volunteer.location,
              company_sector: volunteer.sector,
              task: volunteer.task,
              start_date: volunteer.startDate,
              end_date: volunteer.endDate
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save record');
          }

          return response.json();
        })
      );

      setSuccess(`${results.length} volunteering records saved successfully!`);
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
      <h2>Volunteering</h2>
      {error && (
        <div className="error-message">
          {error.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
      {success && <div className="success-message">{success}</div>}
      {isLoading && <div className="loading-indicator">Loading...</div>}

      <form onSubmit={handleSubmit}>
        {volunteering.map((volunteer, index) => (
          <div key={index} className="repeatable-item">
            <h3>Volunteering Experience {index + 1}</h3>
            
            <div className="input-group">
              <label>Location:</label>
              <input
                type="text"
                value={volunteer.location || ''}
                  onChange={(e) => handleInputChange('volunteering', 'location', e.target.value, index)}
                required
              />
            </div>

            <div className="input-group">
              <label>Company Sector:</label>
              <select
                  value={volunteer.sector || ''}
                  onChange={(e) => handleInputChange('volunteering', 'sector', e.target.value, index)}
                required
              >
                <option value="">Select sector</option>
                {companySectorOptions.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Task/Description:</label>
              <textarea
                value={volunteer.task || ''}
                onChange={(e) => handleInputChange('volunteering', 'task', e.target.value, index)}
                required
              />
            </div>

            <div className="input-group">
              <label>Start Date:</label>
              <input
                type="date"
                value={volunteer.startDate || ''}
                onChange={(e) => handleInputChange('volunteering', 'startDate', e.target.value, index)}
                required
              />
            </div>

            <div className="input-group">
              <label>End Date:</label>
              <input
                type="date"
                value={volunteer.endDate || ''}
                onChange={(e) => handleInputChange('volunteering', 'endDate', e.target.value, index)}
                required
                min={volunteer.startDate || ''}
              />
            </div>

            {volunteering.length > 1 && (
              <button 
                type="button" 
                className="remove-button" 
                onClick={() => removeItem('volunteering', index)}
                disabled={isLoading}
              >
                Remove Experience
              </button>
            )}
          </div>
        ))}

        <div className="button-group">
          <button 
            type="button" 
            className="add-button" 
            onClick={() => addItem('volunteering')}
            disabled={isLoading}
          >
            Add Another Experience
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save All Records'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Volunteering;