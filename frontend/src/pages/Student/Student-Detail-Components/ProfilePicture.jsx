import React from 'react';

const ProfilePicture = ({ profilePicture, handleFileChange, handleSkipToDefault }) => {
  return (
    <div className="form-section">
      <h2>Upload Your Profile Picture</h2>
      <div className="input-group">
        <label className="file-upload-label">
          <input
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="file-upload-input"
          />
          <div className="file-upload-button">
            {profilePicture ? 'Change Picture' : 'Upload Picture'}
          </div>
          {profilePicture && ( 
            <div className="file-info-display">
              <span className="file-name">{profilePicture.name}</span>
              <span className="file-size">
                {(profilePicture.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}
          <p className="file-info">Accepted formats: PNG, JPG, JPEG. Maximum size: 5MB</p>
        </label>
      </div>
      
      <div className="skip-section">
        <p>You can complete your profile later.</p>
        <button 
          type="button" 
          className="skip-button" 
          onClick={handleSkipToDefault}
        >
          Skip to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProfilePicture;