import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Student/StudentPerks.css';
import { ThemeContext } from '../../context/ThemeContext';

function StudentPerks() {
  const [activeTab, setActiveTab] = useState("Student Perks");
  const [breadcrumbs, setBreadcrumbs] = useState([activeTab]);
  const [darkMode, setDarkMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('A-Z');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add a ref for the filter categories container to implement scroll logic
  const filterCategoriesRef = useRef(null);
  
  // Categories for filtering
  const categories = [
    'All',
    'Software',
    'Subscriptions',
    'Cloud',
    'Productivity',
    'Hardware',
    'Learning'
  ];
  
  // Perks data
  const studentPerks = [
    { 
      id: 1, 
      title: "GitHub Student Developer Pack", 
      category: "Software", 
      description: "Free access to developer tools like GitHub Pro, Canva, AWS credits, and more.", 
      link: "https://education.github.com/pack", 
      isFree: true,
      logo: "https://user-images.githubusercontent.com/107881423/219721197-52691027-891d-46b9-bb56-11095ee6965c.png"
    },
    { 
      id: 2, 
      title: "Spotify Student Plan", 
      category: "Subscriptions", 
      description: "50% off Spotify Premium + free Hulu & Showtime (US only).", 
      link: "https://www.spotify.com/us/student/", 
      isFree: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png"
    },
    { 
      id: 3, 
      title: "AWS Educate", 
      category: "Cloud", 
      description: "Free AWS credits for students learning cloud computing.", 
      link: "https://aws.amazon.com/education/awseducate/", 
      isFree: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png"
    },
    { 
      id: 4, 
      title: "Notion Pro (Student)", 
      category: "Productivity", 
      description: "Free Notion Pro for students with a .edu email.", 
      link: "https://www.notion.so/students", 
      isFree: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png"
    },
    { 
      id: 5, 
      title: "Adobe Creative Cloud (Student)", 
      category: "Software", 
      description: "60% off Photoshop, Premiere Pro, and more.", 
      link: "https://www.adobe.com/creativecloud/plans.html", 
      isFree: false,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg/1200px-Adobe_Creative_Cloud_rainbow_icon.svg.png"
    },
    { 
      id: 6, 
      title: "JetBrains Student License", 
      category: "Software", 
      description: "Free professional IDEs like PyCharm & IntelliJ IDEA.", 
      link: "https://www.jetbrains.com/student/", 
      isFree: true,
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/08/JetBrains_beam_logo.svg/2048px-JetBrains_beam_logo.svg.png"
    },
    { 
      id: 7, 
      title: "Apple Education Discount", 
      category: "Hardware", 
      description: "Discounts on MacBooks, iPads, and accessories for students.", 
      link: "https://www.apple.com/education/", 
      isFree: false,
      logo: "https://yt3.googleusercontent.com/u3FOfTv2qyiXVhL4c1qzeKimVzTqKIBjQdl3F4QNZxB49pmwvFoFf8EFljSG7DVIJOW0O8xLWq0=s900-c-k-c0x00ffffff-no-rj"
    },
    { 
      id: 8, 
      title: "Microsoft Office 365 Education", 
      category: "Productivity", 
      description: "Free access to Word, Excel, PowerPoint for students.", 
      link: "https://www.microsoft.com/en-us/education/products/office", 
      isFree: true,
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkfNV1YtiGc-HUrSF4OfHIX50fUSmXWPWP2g&s"
    }
  ];

  // Effect to scroll the active filter into view when it changes
  useEffect(() => {
    if (filterCategoriesRef.current && activeFilter) {
      const activeButton = filterCategoriesRef.current.querySelector(`.category-button.active`);
      if (activeButton) {
        // Calculate the button's position relative to the container
        const container = filterCategoriesRef.current;
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const buttonLeft = activeButton.offsetLeft;
        const buttonWidth = activeButton.clientWidth;
        
        // Determine if the button is not fully visible
        if (buttonLeft < scrollLeft || buttonLeft + buttonWidth > scrollLeft + containerWidth) {
          // Scroll the button into view (centered if possible)
          container.scrollTo({
            left: buttonLeft - containerWidth / 2 + buttonWidth / 2,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [activeFilter]);

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

  // Filter perks based on active filter and search term
  const filteredPerks = studentPerks.filter(perk => {
    const matchesFilter = activeFilter === 'All' || perk.category === activeFilter;
    const matchesSearch = 
      perk.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      perk.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Sort perks based on selected sort order
  const sortedPerks = [...filteredPerks].sort((a, b) => {
    if (sortOrder === 'A-Z') {
      return a.title.localeCompare(b.title);
    } else if (sortOrder === 'Z-A') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  return (
    <div className={`main-content ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="breadcrumb-container">
          <div className="breadcrumbs">
            <span>Student Perks</span>
          </div>
        </div>
        <div className="perks-container">
          <div className="header-section">
            <p className="perks-subtitle">Exclusive discounts and free tools for verified students</p>
          </div>
          
          {/* Filter categories with horizontal scrolling */}
          <div className="filter-categories" ref={filterCategoriesRef}>
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
                placeholder="Search perks by name or description" 
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
                  className={`custom-button sort-button ${sortOrder === 'A-Z' ? 'active' : ''}`}
                  onClick={() => handleSortChange('A-Z')}
                >
                  A-Z
                </button>
                <button 
                  className={`custom-button sort-button ${sortOrder === 'Z-A' ? 'active' : ''}`}
                  onClick={() => handleSortChange('Z-A')}
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
            Showing {sortedPerks.length} of {studentPerks.length} perks
            {activeFilter !== 'All' && ` in ${activeFilter}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
          
          {/* Perks display */}
          <div className={`perks-display ${viewMode}`}>
            {sortedPerks.length > 0 ? (
              sortedPerks.map(perk => (
                <div key={perk.id} className="perk-card">
                  <div className="perk-header">
                    <div className="provider-logo">
                      <img src={perk.logo} alt={`${perk.title} logo`} />
                    </div>
                    <div className="offer-type">
                      <span className={`type-badge ${perk.isFree ? 'free' : 'discount'}`}>
                        {perk.isFree ? 'FREE' : 'DISCOUNT'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="perk-content">
                    <h3 className="perk-title">{perk.title}</h3>
                    <div className="category-badge">{perk.category}</div>
                    <div className="perk-description">
                      <p>{perk.description}</p>
                    </div>
                  </div>
                  
                  <div className="perk-actions">
                    <a 
                      href={perk.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="custom-button apply-button"
                    >
                      Get Offer
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                </svg>
                <p>No perks match your search criteria</p>
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

export default StudentPerks;