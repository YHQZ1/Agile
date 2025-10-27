import React, { useState } from 'react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

const Projects = ({ projects, handleInputChange, addItem, removeItem, onSave }) => {
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
        projects.map(async (project) => {
          if (!project.title || !project.description || !project.techStack) {
            throw new Error('Please complete all required project fields before saving.');
          }

          const response = await fetch(`${BASE_URL}/api/projects-form`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              project_title: project.title,
              description: project.description,
              tech_stack: project.techStack,
              project_link: project.link || null,
              role: project.role || null
            })
          });

          const responseData = await response.json();

          if (!response.ok) {
            throw new Error(responseData.error || 'Failed to save project');
          }

          return responseData;
        })
      );

      setSuccess(`${results.length} project${results.length > 1 ? 's' : ''} saved successfully`);
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
      <h2>Projects</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {isLoading && <div className="loading-indicator">Loading...</div>}

      <form onSubmit={handleSubmit}>
        {projects.map((project, index) => (
          <div key={index} className="repeatable-item">
            <h3>Project {index + 1}</h3>
            <div className="input-group">
              <label>Project Title:</label>
              <input
                type="text"
                value={project.title || ''}
                onChange={(e) => handleInputChange('projects', 'title', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Description:</label>
              <textarea
                value={project.description || ''}
                onChange={(e) => handleInputChange('projects', 'description', e.target.value, index)}
                required
              />
            </div>
            <div className="input-group">
              <label>Tech Stack:</label>
              <input
                type="text"
                value={project.techStack || ''}
                onChange={(e) => handleInputChange('projects', 'techStack', e.target.value, index)}
                placeholder="Technologies used"
                required
              />
            </div>
            <div className="input-group">
              <label>Project Link:</label>
              <input
                type="url"
                value={project.link || ''}
                onChange={(e) => handleInputChange('projects', 'link', e.target.value, index)}
                placeholder="GitHub, Live Demo, etc."
              />
            </div>
            <div className="input-group">
              <label>Your Role:</label>
              <input
                type="text"
                value={project.role || ''}
                onChange={(e) => handleInputChange('projects', 'role', e.target.value, index)}
                required
              />
            </div>
            {projects.length > 1 && (
              <button 
                type="button" 
                className="remove-button" 
                onClick={() => removeItem('projects', index)}
                disabled={isLoading}
              >
                Remove Project
              </button>
            )}
          </div>
        ))}
        <div className="button-group">
          <button 
            type="button" 
            className="add-button" 
            onClick={() => addItem('projects')}
            disabled={isLoading}
          >
            Add Another Project
          </button>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Projects'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Projects;