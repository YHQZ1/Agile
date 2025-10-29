import React, { useState } from 'react';
import { BACKEND_URL } from '../../../config/env';

const companySectorOptions = [
  'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
  'Engineering', 'Retail', 'Manufacturing', 'Media', 'Consulting',
  'Non-profit', 'Government', 'Other'
];

const BASE_URL = BACKEND_URL;

const Internships = ({ internships, handleInputChange, addItem, removeItem, onSave }) => {
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
      const validationErrors = internships.map((internship, index) => {
        const errors = [];
        if (!internship.company) errors.push(`Record ${index + 1}: Company is required`);
        if (!internship.position) errors.push(`Record ${index + 1}: Position is required`);
        if (!internship.location) errors.push(`Record ${index + 1}: Location is required`);
        if (!internship.sector) errors.push(`Record ${index + 1}: Sector is required`);
        if (!internship.startDate) errors.push(`Record ${index + 1}: Start date is required`);
        if (!internship.endDate) errors.push(`Record ${index + 1}: End date is required`);
        
        if (internship.startDate && internship.endDate) {
          if (new Date(internship.startDate) >= new Date(internship.endDate)) {
            errors.push(`Record ${index + 1}: End date must be after start date`);
          }
        }
        
  if (internship.stipend && Number(internship.stipend) < 0) {
          errors.push(`Record ${index + 1}: Stipend cannot be negative`);
        }
        return errors;
      }).flat();

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      // Submit each record individually
      const results = await Promise.all(
        internships.map(async (internship) => {
          const stipendValue = internship.stipend === '' || internship.stipend === null || internship.stipend === undefined
            ? null
            : Number(internship.stipend);

          const requestBody = {
            company_name: internship.company,
            job_title: internship.position,
            location: internship.location,
            company_sector: internship.sector,
            start_date: internship.startDate,
            end_date: internship.endDate,
            stipend_salary: Number.isNaN(stipendValue) ? null : stipendValue
          };

          const response = await fetch(`${BASE_URL}/api/internship-details-form`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(requestBody)
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.error || `Failed to save record (Status: ${response.status})`);
          }

          return responseData;
        })
      );

      setSuccess(`${results.length} internship records saved successfully!`);
      if (onSave) {
        onSave();
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-section">
      <h2>Internships</h2>
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
        {internships.map((internship, index) => (
          <div key={index} className="repeatable-item">
            <h3>Internship Experience {index + 1}</h3>
            
            <div className="input-group">
              <label>Company/Organization:</label>
              <input
                type="text"
                value={internship.company || ''}
                onChange={(e) => handleInputChange('internships', 'company', e.target.value, index)}
                required
              />
            </div>

            <div className="input-group">
              <label>Position:</label>
              <input
                type="text"
                value={internship.position || ''}
                onChange={(e) => handleInputChange('internships', 'position', e.target.value, index)}
                required
              />
            </div>

            <div className="input-group">
              <label>Location:</label>
              <input
                type="text"
                value={internship.location || ''}
                onChange={(e) => handleInputChange('internships', 'location', e.target.value, index)}
                required
              />
            </div>

            <div className="input-group">
              <label>Company Sector:</label>
              <select
                value={internship.sector || ''}
                onChange={(e) => handleInputChange('internships', 'sector', e.target.value, index)}
                required
              >
                <option value="">Select sector</option>
                {companySectorOptions.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>Start Date:</label>
              <input
                type="date"
                value={internship.startDate || ''}
                onChange={(e) => handleInputChange('internships', 'startDate', e.target.value, index)}
                required
              />
            </div>

            <div className="input-group">
              <label>End Date:</label>
              <input
                type="date"
                value={internship.endDate || ''}
                onChange={(e) => handleInputChange('internships', 'endDate', e.target.value, index)}
                required
                min={internship.startDate || ''}
              />
            </div>

            <div className="input-group">
              <label>Stipend/Salary:</label>
              <input
                type="number"
                value={internship.stipend || ''}
                onChange={(e) => handleInputChange('internships', 'stipend', e.target.value, index)}
                min="0"
              />
            </div>

            {internships.length > 1 && (
              <button 
                type="button" 
                className="remove-button" 
                onClick={() => removeItem('internships', index)}
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
            onClick={() => addItem('internships')}
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

export default Internships;