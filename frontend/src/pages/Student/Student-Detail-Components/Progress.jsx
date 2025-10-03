import React from 'react';

const Progress = ({ activeSectionIndex, sections }) => {
  const progressPercentage = ((activeSectionIndex + 1) / sections.length) * 100;

  return (
    <div className="mobile-progress-container">
      <div 
        className="mobile-progress-bar" 
        style={{width: `${progressPercentage}%`}}
      />
      <div className="progress-text">Step {activeSectionIndex + 1} of {sections.length}</div>
    </div>
  );
};

export default Progress;