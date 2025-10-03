import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { Search, Filter, Calendar, Users, Code, Building, ChevronDown, ExternalLink, MapPin, Briefcase } from 'lucide-react';
import '../../styles/Student/Companies.css';

// Mock data for company listings
const MOCK_COMPANIES = [
  {
    id: 1,
    name: 'Google',
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
    industry: 'Technology',
    location: 'Bangalore, India',
    visited: '2024',
    roles: ['Software Engineer', 'Product Manager', 'Data Scientist'],
    package: '₹25-32 LPA',
    eligibility: 'CGPA 8.0+',
    description: 'Google LLC is an American multinational technology company that specializes in Internet-related services and products.',
    website: 'https://careers.google.com'
  },
  {
    id: 2,
    name: 'Microsoft',
    logo: "https://yt3.googleusercontent.com/qgSeLfJk2OKnQicVDvc_VSlSISmAmWVHYtmSTckcC_iUn7hVfpURctMAqoSz0u4xfER6rlKDBA=s900-c-k-c0x00ffffff-no-rj",
    industry: 'Technology',
    location: 'Hyderabad, India',
    visited: '2024',
    roles: ['Software Engineer', 'Cloud Solutions Architect'],
    package: '₹20-28 LPA',
    eligibility: 'CGPA 7.5+',
    description: 'Microsoft Corporation is an American multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, and personal computers.',
    website: 'https://careers.microsoft.com'
  },
  {
    id: 3,
    name: 'Amazon',
    logo: "https://m.media-amazon.com/images/I/51HCHFclmmL.jpg",
    industry: 'E-Commerce, Technology',
    location: 'Pune, India',
    visited: '2023',
    roles: ['SDE', 'Business Analyst', 'Operations Manager'],
    package: '₹22-30 LPA',
    eligibility: 'CGPA 7.5+',
    description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
    website: 'https://amazon.jobs'
  },
  {
    id: 4,
    name: 'Infosys',
    logo: "https://static.vecteezy.com/system/resources/previews/020/336/451/non_2x/infosys-logo-infosys-icon-free-free-vector.jpg",
    industry: 'IT Services',
    location: 'Multiple Locations',
    visited: '2023',
    roles: ['Systems Engineer', 'Digital Specialist Engineer'],
    package: '₹8-12 LPA',
    eligibility: 'CGPA 6.0+',
    description: 'Infosys Limited is an Indian multinational information technology company that provides business consulting, information technology and outsourcing services.',
    website: 'https://www.infosys.com/careers/'
  },
  {
    id: 5,
    name: 'TCS',
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAybzmOvATYuGQoSADTFRPqIVHi_qSOCJW5A&s",
    industry: 'IT Services',
    location: 'Multiple Locations',
    visited: '2023',
    roles: ['Assistant Systems Engineer', 'Digital Developer'],
    package: '₹7-11 LPA',
    eligibility: 'CGPA 6.0+',
    description: 'Tata Consultancy Services Limited is an Indian multinational information technology services and consulting company headquartered in Mumbai.',
    website: 'https://www.tcs.com/careers'
  },
  {
    id: 6,
    name: 'Accenture',
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV2T5wLk-HzBheAPdBs8EyZS6dmeUhyxSGgg&s",
    industry: 'Consulting, Technology',
    location: 'Bangalore, Chennai',
    visited: '2022',
    roles: ['Associate Software Engineer', 'Business Analyst'],
    package: '₹8-14 LPA',
    eligibility: 'CGPA 6.5+',
    description: 'Accenture plc is an Irish-American professional services company that specializes in information technology services and consulting.',
    website: 'https://www.accenture.com/in-en/careers'
  },
  {
    id: 7,
    name: 'Deloitte',
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBB0n8dX3fDwpOjjsNPlTqvz4otaCPEmRJaA&s",
    industry: 'Consulting',
    location: 'Multiple Locations',
    visited: '2022',
    roles: ['Analyst', 'Consultant', 'Advisory Associate'],
    package: '₹9-15 LPA',
    eligibility: 'CGPA 7.0+',
    description: 'Deloitte Touche Tohmatsu Limited is a multinational professional services network with offices in over 150 countries and territories around the world.',
    website: 'https://www2.deloitte.com/in/en/careers/students.html'
  },
  {
    id: 8,
    name: 'Wipro',
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/800px-Wipro_Primary_Logo_Color_RGB.svg.png",
    industry: 'IT Services',
    location: 'Multiple Locations',
    visited: '2022',
    roles: ['Project Engineer', 'Software Developer'],
    package: '₹6.5-10 LPA',
    eligibility: 'CGPA 6.0+',
    description: 'Wipro Limited is an Indian multinational corporation that provides information technology, consulting and business process services.',
    website: 'https://careers.wipro.com/careers-home/'
  }
];

const Companies = () => {
  const { darkMode } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: 'all',
    industry: 'all',
    package: 'all'
  });
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [filteredCompanies, setFilteredCompanies] = useState(MOCK_COMPANIES);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter companies based on search term and filters
  useEffect(() => {
    let results = MOCK_COMPANIES;
    
    // Apply search
    if (searchTerm) {
      results = results.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply filters
    if (filters.year !== 'all') {
      results = results.filter(company => company.visited === filters.year);
    }
    
    if (filters.industry !== 'all') {
      results = results.filter(company => company.industry.includes(filters.industry));
    }
    
    if (filters.package !== 'all') {
      // This is a simplified implementation
      if (filters.package === 'above20') {
        results = results.filter(company => {
          const maxPackage = parseFloat(company.package.split('-')[1].replace('₹', '').replace(' LPA', ''));
          return maxPackage >= 20;
        });
      } else if (filters.package === '10to20') {
        results = results.filter(company => {
          const minPackage = parseFloat(company.package.split('-')[0].replace('₹', '').replace(' LPA', ''));
          const maxPackage = parseFloat(company.package.split('-')[1].replace('₹', '').replace(' LPA', ''));
          return minPackage >= 10 && maxPackage < 20;
        });
      } else if (filters.package === 'below10') {
        results = results.filter(company => {
          const maxPackage = parseFloat(company.package.split('-')[1].replace('₹', '').replace(' LPA', ''));
          return maxPackage < 10;
        });
      }
    }
    
    setFilteredCompanies(results);
  }, [searchTerm, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const toggleExpandCompany = (id) => {
    setExpandedCompany(expandedCompany === id ? null : id);
  };

  return (
    <div className={`main-content ${darkMode ? 'dark-theme-cmp' : ''}`}>
      <div className="breadcrumb-container">
        <div className="breadcrumbs">
          <span className="current">Companies</span>
        </div>
      </div>
      
      <div className="companies-header-cmp">
        <h1>Campus Recruiters</h1>
        <p>Explore companies that have visited our campus for recruitment in previous years</p>
      </div>
      
      <div className="search-filter-container-cmp">
        <div className="search-box-cmp">
          <Search size={18} className="search-icon-cmp" />
          <input 
            type="text" 
            placeholder="Search companies, roles, or industries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search companies"
          />
        </div>
        
        <button 
          className="filter-toggle-button-cmp"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          aria-expanded={isFilterOpen}
          aria-controls="filter-panel"
        >
          <Filter size={18} />
          <span>Filters</span>
          <ChevronDown size={16} className={`chevron-cmp ${isFilterOpen ? 'open-cmp' : ''}`} />
        </button>
      </div>
      
      {isFilterOpen && (
        <div className="filters-panel-cmp" id="filter-panel">
          <div className="filter-group-cmp">
            <label htmlFor="year-filter">Visiting Year</label>
            <select 
              id="year-filter"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
          
          <div className="filter-group-cmp">
            <label htmlFor="industry-filter">Industry</label>
            <select 
              id="industry-filter"
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
            >
              <option value="all">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Consulting">Consulting</option>
              <option value="IT Services">IT Services</option>
              <option value="E-Commerce">E-Commerce</option>
            </select>
          </div>
          
          <div className="filter-group-cmp">
            <label htmlFor="package-filter">Package Range</label>
            <select 
              id="package-filter"
              value={filters.package}
              onChange={(e) => handleFilterChange('package', e.target.value)}
            >
              <option value="all">All Packages</option>
              <option value="above20">Above ₹20 LPA</option>
              <option value="10to20">₹10-20 LPA</option>
              <option value="below10">Below ₹10 LPA</option>
            </select>
          </div>
        </div>
      )}
      
      <div className="companies-stats-cmp">
        <div className="stat-card-cmp">
          <Building size={22} className="stat-icon-cmp" />
          <div className="stat-info-cmp">
            <h3>{MOCK_COMPANIES.length}</h3>
            <p>Companies</p>
          </div>
        </div>
        
        <div className="stat-card-cmp">
          <Calendar size={22} className="stat-icon-cmp" />
          <div className="stat-info-cmp">
            <h3>3</h3>
            <p>Years</p>
          </div>
        </div>
        
        <div className="stat-card-cmp">
          <Briefcase size={22} className="stat-icon-cmp" />
          <div className="stat-info-cmp">
            <h3>20+</h3>
            <p>Job Roles</p>
          </div>
        </div>
        
        <div className="stat-card-cmp">
          <Users size={22} className="stat-icon-cmp" />
          <div className="stat-info-cmp">
            <h3>250+</h3>
            <p>Placements</p>
          </div>
        </div>
      </div>
      
      <div className="companies-list-cmp">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map(company => (
            <div 
              key={company.id} 
              className={`company-card-cmp ${expandedCompany === company.id ? 'expanded-cmp' : ''}`}
              onClick={() => toggleExpandCompany(company.id)}
              tabIndex={0}
              aria-expanded={expandedCompany === company.id}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleExpandCompany(company.id);
                }
              }}
            >
              <div className="company-header-cmp">
                <div className="company-logo-container-cmp">
                  <img src={company.logo} alt={`${company.name} logo`} className="company-logo-cmp" loading="lazy" />
                </div>
                
                <div className="company-basic-info-cmp">
                  <h2 className="company-name-cmp">{company.name}</h2>
                  <div className="company-tags-cmp">
                    <span className="company-industry-cmp">{company.industry}</span>
                    <span className="company-year-cmp">Visited: {company.visited}</span>
                  </div>
                </div>
                
                <div className="company-package-cmp">
                  <span className="package-label-cmp">Package:</span>
                  <span className="package-value-cmp">{company.package}</span>
                </div>
                
                <ChevronDown 
                  size={20} 
                  className={`expand-icon-cmp ${expandedCompany === company.id ? 'rotated-cmp' : ''}`} 
                  aria-hidden="true"
                />
              </div>
              
              {expandedCompany === company.id && (
                <div className="company-details-cmp">
                  <div className="company-description-cmp">
                    <p>{company.description}</p>
                  </div>
                  
                  <div className="company-meta-cmp">
                    <div className="meta-item-cmp">
                      <MapPin size={16} className="meta-icon-cmp" aria-hidden="true" />
                      <span>{company.location}</span>
                    </div>
                    
                    <div className="meta-item-cmp">
                      <Briefcase size={16} className="meta-icon-cmp" aria-hidden="true" />
                      <span>Eligibility: {company.eligibility}</span>
                    </div>
                    
                    <div className="meta-item-cmp website-cmp">
                      <ExternalLink size={16} className="meta-icon-cmp" aria-hidden="true" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        Visit Career Page
                      </a>
                    </div>
                  </div>
                  
                  <div className="roles-section-cmp">
                    <h3>Offered Roles</h3>
                    <div className="roles-list-cmp">
                      {company.roles.map((role, idx) => (
                        <span key={idx} className="role-tag-cmp">{role}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-results-cmp">
            <p>No companies match your search criteria. Try adjusting your filters.</p>
          </div>
        )}
      </div>
      
      <div className="companies-footer-cmp">
        <p>
          These listings are based on historical campus recruitment data. For the latest opportunities, please check with the college placement cell.
        </p>
      </div>
    </div>
  );
};

export default Companies;