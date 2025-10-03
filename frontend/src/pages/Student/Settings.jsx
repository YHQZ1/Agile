import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { 
  FaLock, 
  FaBell, 
  FaShieldAlt, 
  FaDatabase, 
  FaBriefcase, 
  FaPlug, 
  FaQuestionCircle,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaDownload,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaGithub,
  FaLinkedin,
  FaGoogle,
  FaEnvelope,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/Student/Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('security');
  const [breadcrumbs, setBreadcrumbs] = useState(['Settings', 'Security']);
  
  // Security state
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'New York, US', lastActive: '2 hours ago', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'Chicago, US', lastActive: '5 days ago', current: false }
  ]);

  // Notifications state
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      announcements: true,
      applicationUpdates: true,
      newMessages: true
    },
    inApp: {
      enabled: true,
      doNotDisturb: false,
      schedule: { start: '22:00', end: '08:00' }
    }
  });

  // Privacy state
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [dataRequestStatus, setDataRequestStatus] = useState(null);
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState(false);

  // Preferences state
  const [preferredRoles, setPreferredRoles] = useState(['Frontend Developer', 'Backend Engineer']);
  const [newRoleInput, setNewRoleInput] = useState('');
  const [locationPreferences, setLocationPreferences] = useState({
    remote: true,
    onsite: false,
    hybrid: true
  });
  const [salaryRange, setSalaryRange] = useState([40, 80]);

  // Integrations state
  const [integrations, setIntegrations] = useState({
    github: { connected: false, username: '' },
    linkedin: { connected: false, url: '' },
    google: { connected: false, email: '' }
  });

  const tabs = [
    { id: 'security', icon: <FaLock />, label: 'Security' },
    { id: 'notifications', icon: <FaBell />, label: 'Notifications' },
    { id: 'privacy', icon: <FaShieldAlt />, label: 'Privacy & Data' },
    { id: 'preferences', icon: <FaBriefcase />, label: 'Company Preferences' },
    { id: 'integrations', icon: <FaPlug />, label: 'Integrations' },
    { id: 'help', icon: <FaQuestionCircle />, label: 'Help & Support' }
  ];

  // Update breadcrumbs when active tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const tabLabel = tabs.find(tab => tab.id === tabId)?.label || '';
    setBreadcrumbs(['Settings', tabLabel]);
  };

  // Initialize breadcrumbs on component mount
  useEffect(() => {
    const tabLabel = tabs.find(tab => tab.id === activeTab)?.label || '';
    setBreadcrumbs(['Settings', tabLabel]);
  }, []);

  // Security functions
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const submitPasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    // Here you would typically make an API call
    console.log('Password change submitted', passwordData);
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const revokeSession = (sessionId) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  // Notification functions
  const toggleNotificationSetting = (type, field) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: !prev[type][field]
      }
    }));
  };

  const toggleDoNotDisturb = () => {
    setNotificationSettings(prev => ({
      ...prev,
      inApp: {
        ...prev.inApp,
        doNotDisturb: !prev.inApp.doNotDisturb
      }
    }));
  };

  // Privacy functions
  const requestDataDownload = () => {
    setDataRequestStatus('pending');
    // Simulate API call
    setTimeout(() => {
      setDataRequestStatus('ready');
    }, 2000);
  };

  const confirmDeleteAccount = () => {
    if (deleteAccountConfirm) {
      // Here you would make the actual API call to delete account
      console.log('Account deletion confirmed');
      // Redirect or perform other actions
    } else {
      setDeleteAccountConfirm(true);
    }
  };

  // Preferences functions
  const addPreferredRole = (e) => {
    if (e.key === 'Enter' && newRoleInput.trim()) {
      if (!preferredRoles.includes(newRoleInput)) {
        setPreferredRoles(prev => [...prev, newRoleInput]);
      }
      setNewRoleInput('');
    }
  };

  const removePreferredRole = (roleToRemove) => {
    setPreferredRoles(prev => prev.filter(role => role !== roleToRemove));
  };

  const toggleLocationPreference = (type) => {
    setLocationPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSalaryChange = (e, index) => {
    const newValue = parseInt(e.target.value);
    const newRange = [...salaryRange];
    newRange[index] = newValue;
    
    // Ensure min is less than max
    if (index === 0 && newValue > salaryRange[1]) return;
    if (index === 1 && newValue < salaryRange[0]) return;
    
    setSalaryRange(newRange);
  };

  // Integration functions
  const toggleIntegration = (service) => {
    setIntegrations(prev => ({
      ...prev,
      [service]: {
        ...prev[service],
        connected: !prev[service].connected
      }
    }));
  };

  return (
    <div className={`main-content ${darkMode ? 'dark' : ''}`}>
      <div className="settings-header">
        <div className="breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span>{crumb}</span>
              {index < breadcrumbs.length - 1 && <span>›</span>}
            </React.Fragment>
          ))}
        </div>
        <p>Manage your account preferences and security</p>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <h2><FaLock /> Security Settings</h2>
              
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={twoFactorAuth}
                    onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Change Password</h3>
                  <p>Update your account password</p>
                </div>
                {showChangePassword ? (
                  <form onSubmit={submitPasswordChange} className="password-change-form">
                    <div className="password-input-group">
                      <label>Current Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword.current ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <button 
                          type="button" 
                          className="password-toggle"
                          onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                        >
                          {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="password-input-group">
                      <label>New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword.new ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength="8"
                        />
                        <button 
                          type="button" 
                          className="password-toggle"
                          onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                        >
                          {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="password-input-group">
                      <label>Confirm New Password</label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <button 
                          type="button" 
                          className="password-toggle"
                          onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                        >
                          {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="password-form-actions">
                      <button type="submit" className="action-button">Save Changes</button>
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => setShowChangePassword(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button 
                    className="action-button"
                    onClick={() => setShowChangePassword(true)}
                  >
                    Change Password
                  </button>
                )}
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Active Sessions</h3>
                  <p>View and manage logged-in devices</p>
                </div>
                <div className="sessions-list">
                  {activeSessions.map(session => (
                    <div key={session.id} className={`session-item ${session.current ? 'current' : ''}`}>
                      <div className="session-details">
                        <div className="session-device">{session.device}</div>
                        <div className="session-meta">
                          <span><FaMapMarkerAlt /> {session.location}</span>
                          <span><FaCalendarAlt /> {session.lastActive}</span>
                        </div>
                      </div>
                      {!session.current && (
                        <button 
                          className="revoke-button"
                          onClick={() => revokeSession(session.id)}
                        >
                          Revoke
                        </button>
                      )}
                      {session.current && <span className="current-label">Current</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2><FaBell /> Notification Settings</h2>

              <div className="notification-category">
                <h3>Email Notifications</h3>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Drive Announcements</h4>
                    <p>Get notified about new placement drives</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notificationSettings.email.announcements}
                      onChange={() => toggleNotificationSetting('email', 'announcements')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Application Updates</h4>
                    <p>Receive updates about your applications</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notificationSettings.email.applicationUpdates}
                      onChange={() => toggleNotificationSetting('email', 'applicationUpdates')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>New Messages</h4>
                    <p>Get notified when you receive new messages</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notificationSettings.email.newMessages}
                      onChange={() => toggleNotificationSetting('email', 'newMessages')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>

              <div className="notification-category">
                <h3>In-App Notifications</h3>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Enable Notifications</h4>
                    <p>Show notification badges and popups</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notificationSettings.inApp.enabled}
                      onChange={() => toggleNotificationSetting('inApp', 'enabled')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Do Not Disturb</h4>
                    <p>Mute notifications during specific hours</p>
                  </div>
                  <div className="dnd-settings">
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.inApp.doNotDisturb}
                        onChange={toggleDoNotDisturb}
                      />
                      <span className="slider"></span>
                    </label>
                    {notificationSettings.inApp.doNotDisturb && (
                      <div className="dnd-schedule">
                        <span>From {notificationSettings.inApp.schedule.start} to {notificationSettings.inApp.schedule.end}</span>
                        <button className="edit-button">Edit</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Data Tab */}
          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2><FaShieldAlt /> Privacy & Data</h2>
              
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Profile Visibility</h3>
                  <p>Control who can see your profile and activity</p>
                </div>
                <select 
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  className="dropdown-select"
                >
                  <option value="public">Public (visible to everyone)</option>
                  <option value="connections">Only Connections</option>
                  <option value="private">Private (only visible to you)</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Download Your Data</h3>
                  <p>Get a copy of all your data in our system</p>
                  {dataRequestStatus === 'pending' && (
                    <div className="data-request-status">
                      <span>Preparing your data...</span>
                      <div className="spinner"></div>
                    </div>
                  )}
                  {dataRequestStatus === 'ready' && (
                    <div className="data-request-status ready">
                      <FaCheck /> Your data is ready for download
                    </div>
                  )}
                </div>
                <button 
                  className="action-button"
                  onClick={requestDataDownload}
                  disabled={dataRequestStatus === 'pending'}
                >
                  <FaDownload /> {dataRequestStatus === 'ready' ? 'Download Now' : 'Request Data'}
                </button>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Delete Account</h3>
                  <p>Permanently remove your account and all data</p>
                  {deleteAccountConfirm && (
                    <div className="delete-confirmation">
                      <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                    </div>
                  )}
                </div>
                <button 
                  className={`danger-button ${deleteAccountConfirm ? 'confirm' : ''}`}
                  onClick={confirmDeleteAccount}
                >
                  <FaTrash /> {deleteAccountConfirm ? 'Confirm Deletion' : 'Delete Account'}
                </button>
                {deleteAccountConfirm && (
                  <button 
                    className="cancel-button"
                    onClick={() => setDeleteAccountConfirm(false)}
                  >
                    <FaTimes /> Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Company Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h2><FaBriefcase /> Company Preferences</h2>
              
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Preferred Job Roles</h3>
                  <p>Get recommendations based on your interests</p>
                </div>
                <div className="tags-input">
                  {preferredRoles.map(role => (
                    <span key={role} className="tag">
                      {role}
                      <button 
                        className="tag-remove"
                        onClick={() => removePreferredRole(role)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                  <input 
                    type="text" 
                    placeholder="Add a role..." 
                    value={newRoleInput}
                    onChange={(e) => setNewRoleInput(e.target.value)}
                    onKeyDown={addPreferredRole}
                  />
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Location Preferences</h3>
                  <p>Filter drives by location</p>
                </div>
                <div className="preference-option">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={locationPreferences.remote}
                      onChange={() => toggleLocationPreference('remote')}
                    /> Remote
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={locationPreferences.onsite}
                      onChange={() => toggleLocationPreference('onsite')}
                    /> On-site
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={locationPreferences.hybrid}
                      onChange={() => toggleLocationPreference('hybrid')}
                    /> Hybrid
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <h3>Salary Expectations</h3>
                  <p>Set your expected salary range (optional)</p>
                  <div className="salary-display">
                    ${salaryRange[0]}k - ${salaryRange[1]}k
                  </div>
                </div>
                <div className="range-inputs">
                  <div className="range-input-group">
                    <label>Min:</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={salaryRange[0]}
                      onChange={(e) => handleSalaryChange(e, 0)}
                    />
                  </div>
                  <div className="range-input-group">
                    <label>Max:</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={salaryRange[1]}
                      onChange={(e) => handleSalaryChange(e, 1)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="settings-section">
              <h2><FaPlug /> Integrations</h2>
              
              <div className="integration-item">
                <div className="integration-info">
                  <FaGithub className="integration-icon" />
                  <div>
                    <h3>GitHub</h3>
                    <p>Showcase your projects and contributions</p>
                    {integrations.github.connected && (
                      <div className="integration-detail">
                        <span>Connected as: {integrations.github.username || 'username'}</span>
                      </div>
                    )}
                  </div>
                </div>
                {integrations.github.connected ? (
                  <div className="integration-actions">
                    <button className="connected-button">
                      <FaCheck /> Connected
                    </button>
                    <button 
                      className="disconnect-button"
                      onClick={() => toggleIntegration('github')}
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button 
                    className="connect-button"
                    onClick={() => toggleIntegration('github')}
                  >
                    Connect
                  </button>
                )}
              </div>

              <div className="integration-item">
                <div className="integration-info">
                  <FaLinkedin className="integration-icon" />
                  <div>
                    <h3>LinkedIn</h3>
                    <p>Import your professional experience</p>
                    {integrations.linkedin.connected && (
                      <div className="integration-detail">
                        <span>Profile connected</span>
                      </div>
                    )}
                  </div>
                </div>
                {integrations.linkedin.connected ? (
                  <div className="integration-actions">
                    <button className="connected-button">
                      <FaCheck /> Connected
                    </button>
                    <button 
                      className="disconnect-button"
                      onClick={() => toggleIntegration('linkedin')}
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button 
                    className="connect-button"
                    onClick={() => toggleIntegration('linkedin')}
                  >
                    Connect
                  </button>
                )}
              </div>

              <div className="integration-item">
                <div className="integration-info">
                  <FaGoogle className="integration-icon" />
                  <div>
                    <h3>Google Calendar</h3>
                    <p>Sync your drive schedules</p>
                    {integrations.google.connected && (
                      <div className="integration-detail">
                        <span>Connected to: {integrations.google.email || 'your email'}</span>
                      </div>
                    )}
                  </div>
                </div>
                {integrations.google.connected ? (
                  <div className="integration-actions">
                    <button className="connected-button">
                      <FaCheck /> Connected
                    </button>
                    <button 
                      className="disconnect-button"
                      onClick={() => toggleIntegration('google')}
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button 
                    className="connect-button"
                    onClick={() => toggleIntegration('google')}
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Help & Support Tab */}
          {activeTab === 'help' && (
            <div className="settings-section">
              <h2><FaQuestionCircle /> Help & Support</h2>
              
              <div className="help-item">
                <h3>FAQs</h3>
                <p>Find answers to common questions</p>
                <button className="action-button">Browse FAQs</button>
              </div>

              <div className="help-item">
                <h3>Contact Support</h3>
                <p>Get help from our support team</p>
                <button className="action-button">
                  <FaEnvelope /> Send Message
                </button>
              </div>

              <div className="help-item">
                <h3>Report a Bug</h3>
                <p>Found an issue? Let us know</p>
                <button className="action-button">Report</button>
              </div>

              <div className="help-item">
                <h3>Feedback</h3>
                <p>Share your suggestions with us</p>
                <button className="action-button">Give Feedback</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;