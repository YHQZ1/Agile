import React from 'react';

const Navigation = ({ menuOpen, toggleMenu, sections, activeSection, setActiveSection, setMenuOpen }) => {
  return (
    <>
      <div className="mobile-header">
        <h2>Student Profile</h2>
        <button 
          className="menu-toggle-btn" 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
      
      <div className={`sidebar ${!menuOpen ? 'hidden' : ''}`}>
        <div className="sidebar-header">
          <h3>Profile Sections</h3>
        </div>
        <nav className="sidebar-nav">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(section.id);
                setMenuOpen(false);
              }}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Navigation;