import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Student/OngoingDrives.css';

function OngoingDrives() {
  const [activeTab, setActiveTab] = useState("Ongoing Drives");
  const [breadcrumbs, setBreadcrumbs] = useState([activeTab]);
  const [darkMode, setDarkMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Deadline');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Categories for filtering
  const categories = [
    'All',
    'Software Engineering',
    'Data Science',
    'Design',
    'Product Management',
    'Machine Learning',
    'Cloud',
    'Web Development',
    'Mobile Development'
  ];
  
  // Roles for categorization
  const roleCategories = {
    'Software Engineer': 'Software Engineering',
    'Data Scientist': 'Data Science',
    'Web Developer': 'Web Development',
    'iOS Developer': 'Mobile Development',
    'Frontend Engineer': 'Web Development',
    'Machine Learning Engineer': 'Machine Learning',
    'Embedded Systems Engineer': 'Software Engineering',
    'UI/UX Designer': 'Design',
    'Backend Developer': 'Software Engineering',
    'Cloud Engineer': 'Cloud',
    'Database Administrator': 'Software Engineering',
    'CRM Developer': 'Software Engineering'
  };

  // Ongoing Drives Data
  const ongoingDrives = [
    { id: 1, company: "Google", role: "Software Engineer", location: "Remote", deadline: "March 10, 2025", applyLink: "https://careers.google.com/", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" },
    { id: 2, company: "Microsoft", role: "Data Scientist", location: "Hyderabad, India", deadline: "March 15, 2025", applyLink: "https://careers.microsoft.com/", logo: "https://yt3.googleusercontent.com/qgSeLfJk2OKnQicVDvc_VSlSISmAmWVHYtmSTckcC_iUn7hVfpURctMAqoSz0u4xfER6rlKDBA=s900-c-k-c0x00ffffff-no-rj" },
    { id: 3, company: "Amazon", role: "Web Developer", location: "Bangalore, India", deadline: "March 18, 2025", applyLink: "https://www.amazon.jobs/", logo: "https://m.media-amazon.com/images/I/51HCHFclmmL.jpg" },
    { id: 4, company: "Apple", role: "iOS Developer", location: "San Francisco, USA", deadline: "March 22, 2025", applyLink: "https://jobs.apple.com/", logo: "https://yt3.googleusercontent.com/u3FOfTv2qyiXVhL4c1qzeKimVzTqKIBjQdl3F4QNZxB49pmwvFoFf8EFljSG7DVIJOW0O8xLWq0=s900-c-k-c0x00ffffff-no-rj" },
    { id: 5, company: "Netflix", role: "Frontend Engineer", location: "Los Angeles, USA", deadline: "March 25, 2025", applyLink: "https://jobs.netflix.com/", logo: "https://images.ctfassets.net/4cd45et68cgf/Rx83JoRDMkYNlMC9MKzcB/2b14d5a59fc3937afd3f03191e19502d/Netflix-Symbol.png?w=700&h=456" },
    { id: 6, company: "Meta", role: "Machine Learning Engineer", location: "Menlo Park, USA", deadline: "March 30, 2025", applyLink: "https://www.metacareers.com/", logo: "https://cdn.pixabay.com/photo/2021/12/14/22/29/meta-6871457_1280.png" },
    { id: 7, company: "Tesla", role: "Embedded Systems Engineer", location: "Palo Alto, USA", deadline: "April 2, 2025", applyLink: "https://www.tesla.com/careers", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/640px-Tesla_logo.png" },
    { id: 8, company: "Adobe", role: "UI/UX Designer", location: "Noida, India", deadline: "April 5, 2025", applyLink: "https://www.adobe.com/careers", logo: "https://i.pinimg.com/736x/56/3a/a2/563aa2189ef92dc242a7db5b91078804.jpg" },
    { id: 9, company: "Facebook", role: "Backend Developer", location: "Menlo Park, USA", deadline: "April 10, 2025", applyLink: "https://www.metacareers.com/", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1200px-Facebook_f_logo_%282019%29.svg.png" },
    { id: 10, company: "IBM", role: "Cloud Engineer", location: "Bangalore, India", deadline: "April 12, 2025", applyLink: "https://www.ibm.com/employment", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/1200px-IBM_logo.svg.png" },
    { id: 11, company: "Oracle", role: "Database Administrator", location: "Austin, USA", deadline: "April 15, 2025", applyLink: "https://www.oracle.com/careers", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVer_wMBRrUuTJfkLE_pq1nZRrlaHrWVkNUA&s" },
    { id: 12, company: "Salesforce", role: "CRM Developer", location: "San Francisco, USA", deadline: "April 18, 2025", applyLink: "https://www.salesforce.com/company/careers/", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaAx4OMNKDO78w1GtSY9IKw8zy3RPjRMbWyg&s" },
  ];

  // Function to get days remaining to deadline
  const getDaysRemaining = (deadline) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const differenceInTime = deadlineDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  // Status badge based on days remaining
  const getStatusBadge = (deadline) => {
    const days = getDaysRemaining(deadline);
    if (days <= 3) return <span className="status-badge urgent">Urgent</span>;
    if (days <= 7) return <span className="status-badge closing-soon">Closing Soon</span>;
    return <span className="status-badge open">Open</span>;
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

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setBreadcrumbs([tab]);
  };

  // Filter drives based on active filter and search term
  const filteredDrives = ongoingDrives.filter(drive => {
    const matchesFilter = activeFilter === 'All' || roleCategories[drive.role] === activeFilter;
    const matchesSearch = 
      drive.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
      drive.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drive.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Sort drives based on selected sort order
  const sortedDrives = [...filteredDrives].sort((a, b) => {
    if (sortOrder === 'Company A-Z') {
      return a.company.localeCompare(b.company);
    } else if (sortOrder === 'Company Z-A') {
      return b.company.localeCompare(a.company);
    } else if (sortOrder === 'Deadline') {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    return 0;
  });

  return (
    <div className={`main-content ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="breadcrumb-container">
          <div className="breadcrumbs">
            <span>Ongoing Drives</span>
          </div>
        </div>
        <div className="drives-container">
          <div className="header-section">
            <p className="drives-subtitle">Explore opportunities from top companies hiring on campus</p>
          </div>
          
          {/* Filter categories */}
          <div className="filter-categories">
            {categories.map(category => (
              <button 
                key={category}
                className={`custom-button category-button ${activeFilter === category ? 'active' : ''}`}
                onClick={() => handleFilterClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Search bar and controls */}
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
                  className={`custom-button sort-button ${sortOrder === 'Deadline' ? 'active' : ''}`}
                  onClick={() => handleSortChange('Deadline')}
                >
                  Deadline
                </button>
                <button 
                  className={`custom-button sort-button ${sortOrder === 'Company A-Z' ? 'active' : ''}`}
                  onClick={() => handleSortChange('Company A-Z')}
                >
                  A-Z
                </button>
                <button 
                  className={`custom-button sort-button ${sortOrder === 'Company Z-A' ? 'active' : ''}`}
                  onClick={() => handleSortChange('Company Z-A')}
                >
                  Z-A
                </button>
              </div>
              
              <div className="view-options">
                <button 
                  className={`custom-button view-button ${viewMode === 'grid' ? 'active' : ''}`}
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
                  className={`custom-button view-button ${viewMode === 'list' ? 'active' : ''}`}
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
            Showing {sortedDrives.length} of {ongoingDrives.length} drives
            {activeFilter !== 'All' && ` in ${activeFilter}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
          
          {/* Drives display */}
          <div className={`drives-display ${viewMode}`}>
            {sortedDrives.length > 0 ? (
              sortedDrives.map(drive => (
                <div key={drive.id} className="drive-card">
                  <div className="drive-header">
                    <div className="company-logo">
                      <img src={drive.logo} alt={`${drive.company} logo`} />
                    </div>
                    <div className="deadline-info">
                      {getStatusBadge(drive.deadline)}
                      <div className="days-remaining">
                        {getDaysRemaining(drive.deadline)} days left
                      </div>
                    </div>
                  </div>
                  
                  <div className="drive-content">
                    <h3 className="company-name">{drive.company}</h3>
                    <div className="role-badge">{drive.role}</div>
                    <div className="drive-details">
                      <div className="location-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{drive.location}</span>
                      </div>
                      <div className="deadline-detail">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>Apply by {drive.deadline}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="drive-actions">
                    <Link 
                    to={{
                        pathname: `/apply/${drive.id}`,
                        state: { 
                        jobData: drive,
                        from: 'ongoing-drives' 
                          }
                      }}
                    className="custom-button apply-button">
                    Apply Now
                    </Link>
                    <Link to={`/job-details/${drive.id}`} className="custom-button details-button">
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
                <p>No drives match your search criteria</p>
                <button 
                  onClick={() => {setActiveFilter('All'); setSearchTerm('')}} 
                  className="custom-button reset-button"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}

export default OngoingDrives;