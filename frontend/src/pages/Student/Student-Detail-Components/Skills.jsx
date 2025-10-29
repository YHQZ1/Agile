import React, { useState } from 'react';
import { BACKEND_URL } from '../../../config/env';

const BASE_URL = BACKEND_URL;

const Skills = ({ skills, handleInputChange, addItem, removeItem, onSave }) => {
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
        skills.map(async (skill) => {
          if (!skill.name) {
            throw new Error('Skill name is required');
          }

          const response = await fetch(`${BASE_URL}/api/skills-form`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              skill_name: skill.name,
              skill_proficiency: skill.proficiency || null
            })
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.error || 'Failed to save skill');
          }

          return responseData;
        })
      );

      setSuccess(`${results.length} skill${results.length > 1 ? 's' : ''} saved successfully`);
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
      <h2>Skills</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {isLoading && <div className="loading-indicator">Loading...</div>}

      <form onSubmit={handleSubmit}>
        {skills.map((skill, index) => (
          <div key={index} className="repeatable-item">
            <h3>Skill {index + 1}</h3>
            <div className="input-group">
              <label>Skill Name:</label>
              <input
                type="text"
                value={skill.name || ''}
                onChange={(e) => handleInputChange('skills', 'name', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Proficiency:</label>
              <select
                value={skill.proficiency || ''}
                onChange={(e) => handleInputChange('skills', 'proficiency', e.target.value, index)}
                required
              >
                <option value="">Select proficiency level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            {skills.length > 1 && (
              <button 
                type="button" 
                className="remove-button" 
                onClick={() => removeItem('skills', index)}
                disabled={isLoading}
              >
                Remove Skill
              </button>
            )}
          </div>
        ))}
        <div className="button-group">
          <button 
            type="button" 
            className="add-button" 
            onClick={() => addItem('skills')}
            disabled={isLoading}
          >
            Add Another Skill
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Skills'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Skills;