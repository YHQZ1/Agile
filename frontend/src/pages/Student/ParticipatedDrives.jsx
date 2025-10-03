import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Student/ParticipatedDrives.css';
import { ThemeContext } from '../../context/ThemeContext';

function ParticipatedDrives() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('A-Z');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode } = useContext(ThemeContext);
  
  // Add state for activeTab and breadcrumbs
  const [activeTab, setActiveTab] = useState("Participated Drives");
  const [breadcrumbs, setBreadcrumbs] = useState([activeTab]); // Initialize with the active tab
  
  const categories = [
    'All',
    'Artificial Intelligence',
    'Data Science',
    'Development tools',
    'End user applications',
    'Cloud',
    'Operating systems',
    'Devops',
    'Cyber Security',
    'SDE',
    'Other'
  ];
  
  // Initial companies data
  const allCompanies = [
    {
      id: 1,
      name: "OpenAI",
      description: "Leading research and deployment of artificial intelligence",
      logo: "https://yt3.googleusercontent.com/MopgmVAFV9BqlzOJ-UINtmutvEPcNe5IbKMmP_4vZZo3vnJXcZGtybUBsXaEVxkmxKyGqX9R=s900-c-k-c0x00ffffff-no-rj",
      category: "Artificial Intelligence"
    },
    {
      id: 2,
      name: "Snowflake",
      description: "Cloud-based data warehousing and analytics platform",
      logo: "https://companieslogo.com/img/orig/SNOW-35164165.png?t=1720244494",
      category: "Data Science"
    },
    {
      id: 3,
      name: "HashiCorp",
      description: "Infrastructure automation tools for DevOps",
      logo: "https://hashicorp.gallerycdn.vsassets.io/extensions/hashicorp/hcl/0.6.0/1729689056959/Microsoft.VisualStudio.Services.Icons.Default",
      category: "Devops"
    },
    {
      id: 4,
      name: "JetBrains",
      description: "Creators of intelligent development tools like IntelliJ IDEA",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/08/JetBrains_beam_logo.svg/2048px-JetBrains_beam_logo.svg.png",
      category: "Development tools"
    },
    {
      id: 5,
      name: "CrowdStrike",
      description: "AI-powered cybersecurity solutions for enterprises",
      logo: "https://www.stratodesk.com/wp-content/uploads/2021/08/crowedstrike-and-Stratodesk-NoTouch.png",
      category: "Cyber Security"
    },
    {
      id: 6,
      name: "Red Hat",
      description: "Enterprise open-source solutions for operating systems and cloud computing",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbkBLhs9SXOgt2x4sCuex-Dxn5FswXontBUeE1pq02FqL0lD-2gF4dw_Ro_Xwmt6UcATQ&usqp=CAU",
      category: "Operating systems"
    }
  ];  
  
  // Handle tab change - same as in Dashboard
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setBreadcrumbs([tab]); // Update breadcrumbs to only show the current tab
  };
  
  // Handle filter click
  const handleFilterClick = (category) => {
    setActiveFilter(category);
  };
  
  // Handle sort change
  const handleSortChange = (order) => {
    setSortOrder(order);
  };
  
  // Handle view change
  const handleViewChange = (mode) => {
    setViewMode(mode);
  };
  
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Filter companies based on active filter and search term
  const filteredCompanies = allCompanies.filter(company => {
    const matchesFilter = activeFilter === 'All' || company.category === activeFilter;
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  // Sort companies based on selected sort order
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortOrder === 'A-Z') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'Z-A') {
      return b.name.localeCompare(a.name);
    } else if (sortOrder === 'Random') {
      return 0.5 - Math.random();
    }
    return 0;
  });
  
  return (
    <div className={`main-content ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="breadcrumb-container">
          <div className="breadcrumbs">
            <span>Participated Drives</span>
          </div>
        </div>
        <div className="tech-directory">
          <div className="header-section">
            <p className="subtitle">Explore technology organizations and open source projects</p>
          </div>
          
          {/* Filter categories */}
          <div className="filter-categories">
            {categories.map(category => (
              <button 
                key={category}
                className={`category-button ${activeFilter === category ? 'active' : ''}`}
                onClick={() => handleFilterClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Search bar */}
          <div className="search-container">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search organizations, technology or topics" 
                className="search-input"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            {/* Sort and view options */}
            <div className="sort-view-options">
              <div className="sort-options">
                <span className="sort-label">Sort by</span>
                <button 
                  className={`sort-button ${sortOrder === 'A-Z' ? 'active' : ''}`}
                  onClick={() => handleSortChange('A-Z')}
                >
                  A-Z
                </button>
                <button 
                  className={`sort-button ${sortOrder === 'Z-A' ? 'active' : ''}`}
                  onClick={() => handleSortChange('Z-A')}
                >
                  Z-A
                </button>
                <button 
                  className={`sort-button ${sortOrder === 'Random' ? 'active' : ''}`}
                  onClick={() => handleSortChange('Random')}
                >
                  Random
                </button>
              </div>
              
              <div className="view-options">
                <button 
                  className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => handleViewChange('grid')}
                  aria-label="Grid view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button 
                  className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => handleViewChange('list')}
                  aria-label="List view"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Results summary */}
          <div className="results-summary">
            Showing {sortedCompanies.length} of {allCompanies.length} organizations
            {activeFilter !== 'All' && ` in ${activeFilter}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
          
          {/* Companies grid/list */}
          <div className={`companies-container ${viewMode}`}>
            {sortedCompanies.length > 0 ? (
              sortedCompanies.map(company => (
                <div key={company.id} className="company-card">
                  <div className="company-logo">
                    <img src={company.logo} alt={`${company.name} logo`} />
                  </div>
                  <div className="company-info">
                    <h3 className="company-name">{company.name}</h3>
                    <div className="category-badge">{company.category}</div>
                    <p className="company-description">{company.description}</p>
                  </div>
                  <div className="company-actions">
                    <Link to={`/job-details/${company.id}`} className="custom-button details-button">
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                </svg>
                <p>No organizations match your search criteria</p>
                <button onClick={() => {setActiveFilter('All'); setSearchTerm('')}} className="reset-button">
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}

export default ParticipatedDrives;