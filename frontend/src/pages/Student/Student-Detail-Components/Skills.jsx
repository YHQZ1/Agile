import React, { useState } from 'react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const Skills = ({ skills, handleInputChange, addItem, removeItem, onSave }) => {
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
      const response = await fetch(`${BASE_URL}/api/skills-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          skills: skills.map(skill => ({
            name: skill.name,
            proficiency: skill.proficiency
          }))
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save skills');
      }

      setSuccess('Skills saved successfully');
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
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
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