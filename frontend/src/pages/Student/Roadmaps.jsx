import React, { useState, useContext } from 'react';
import "../../styles/Student/Roadmaps.css";
import { ThemeContext } from '../../context/ThemeContext';
import { 
  FaSearch, 
  FaExternalLinkAlt, 
  FaCode, 
  FaBriefcase, 
  FaRocket,
  FaFilter,
  FaStar,
  FaTimes
} from 'react-icons/fa';

const RoadmapFeature = () => {
  const { darkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Enhanced roadmap data with metadata
  const roleBasedRoadmaps = [
    { 
      name: "Frontend Developer", 
      url: "https://roadmap.sh/frontend",
      difficulty: "intermediate",
      popular: true,
      description: "Master HTML, CSS, JavaScript, and modern frameworks"
    },
    { 
      name: "Backend Developer", 
      url: "https://roadmap.sh/backend",
      difficulty: "intermediate",
      popular: true,
      description: "Learn server-side programming and databases"
    },
    { 
      name: "DevOps Engineer", 
      url: "https://roadmap.sh/devops",
      difficulty: "advanced",
      popular: true,
      description: "Infrastructure, CI/CD, and automation"
    },
    { 
      name: "Full Stack Developer", 
      url: "https://roadmap.sh/full-stack",
      difficulty: "advanced",
      popular: true,
      description: "Complete frontend and backend development"
    },
    { 
      name: "AI Engineer", 
      url: "https://roadmap.sh/ai-engineer",
      difficulty: "advanced",
      popular: true,
      description: "Build intelligent systems and ML models"
    },
    { 
      name: "Data Analyst", 
      url: "https://roadmap.sh/data-analyst",
      difficulty: "intermediate",
      popular: false,
      description: "Analyze data and create insights"
    },
    { 
      name: "AI and Data Scientist", 
      url: "https://roadmap.sh/ai-data-scientist",
      difficulty: "advanced",
      popular: true,
      description: "Advanced data science and AI techniques"
    },
    { 
      name: "Android Developer", 
      url: "https://roadmap.sh/android",
      difficulty: "intermediate",
      popular: false,
      description: "Build native Android applications"
    },
    { 
      name: "iOS Developer", 
      url: "https://roadmap.sh/ios",
      difficulty: "intermediate",
      popular: false,
      description: "Create apps for iPhone and iPad"
    },
    { 
      name: "PostgreSQL Developer", 
      url: "https://roadmap.sh/postgresql",
      difficulty: "intermediate",
      popular: false,
      description: "Master PostgreSQL database"
    },
    { 
      name: "Blockchain Developer", 
      url: "https://roadmap.sh/blockchain",
      difficulty: "advanced",
      popular: false,
      description: "Develop decentralized applications"
    },
    { 
      name: "QA Engineer", 
      url: "https://roadmap.sh/qa",
      difficulty: "beginner",
      popular: false,
      description: "Software testing and quality assurance"
    },
    { 
      name: "Software Architect", 
      url: "https://roadmap.sh/software-architect",
      difficulty: "advanced",
      popular: false,
      description: "Design scalable software systems"
    },
    { 
      name: "Cyber Security Specialist", 
      url: "https://roadmap.sh/cyber-security",
      difficulty: "advanced",
      popular: true,
      description: "Protect systems and data"
    },
    { 
      name: "UX Designer", 
      url: "https://roadmap.sh/ux",
      difficulty: "intermediate",
      popular: false,
      description: "Create user-centered designs"
    },
    { 
      name: "Game Developer", 
      url: "https://roadmap.sh/game",
      difficulty: "advanced",
      popular: false,
      description: "Develop video games and engines"
    },
    { 
      name: "Technical Writer", 
      url: "https://roadmap.sh/technical-writing",
      difficulty: "beginner",
      popular: false,
      description: "Create technical documentation"
    },
    { 
      name: "MLOps Engineer", 
      url: "https://roadmap.sh/mlops",
      difficulty: "advanced",
      popular: false,
      description: "Deploy and maintain ML systems"
    },
    { 
      name: "Product Manager", 
      url: "https://roadmap.sh/product-manager",
      difficulty: "intermediate",
      popular: false,
      description: "Lead product development"
    },
    { 
      name: "Engineering Manager", 
      url: "https://roadmap.sh/engineering-manager",
      difficulty: "advanced",
      popular: false,
      description: "Manage engineering teams"
    },
    { 
      name: "Developer Relations", 
      url: "https://roadmap.sh/devrel",
      difficulty: "intermediate",
      popular: false,
      description: "Bridge developers and products"
    }
  ];

  const skillBasedRoadmaps = [
    { 
      name: "Computer Science", 
      url: "https://roadmap.sh/computer-science",
      difficulty: "intermediate",
      popular: true,
      description: "Core CS fundamentals"
    },
    { 
      name: "React", 
      url: "https://roadmap.sh/react",
      difficulty: "intermediate",
      popular: true,
      description: "Build modern web apps with React"
    },
    { 
      name: "Vue", 
      url: "https://roadmap.sh/vue",
      difficulty: "intermediate",
      popular: false,
      description: "Progressive JavaScript framework"
    },
    { 
      name: "Angular", 
      url: "https://roadmap.sh/angular",
      difficulty: "intermediate",
      popular: false,
      description: "Enterprise web applications"
    },
    { 
      name: "JavaScript", 
      url: "https://roadmap.sh/javascript",
      difficulty: "beginner",
      popular: true,
      description: "Master JavaScript programming"
    },
    { 
      name: "Node.js", 
      url: "https://roadmap.sh/nodejs",
      difficulty: "intermediate",
      popular: true,
      description: "Server-side JavaScript runtime"
    },
    { 
      name: "TypeScript", 
      url: "https://roadmap.sh/typescript",
      difficulty: "intermediate",
      popular: true,
      description: "Typed JavaScript for scale"
    },
    { 
      name: "Python", 
      url: "https://roadmap.sh/python",
      difficulty: "beginner",
      popular: true,
      description: "Versatile programming language"
    },
    { 
      name: "SQL", 
      url: "https://roadmap.sh/sql",
      difficulty: "beginner",
      popular: true,
      description: "Database query language"
    },
    { 
      name: "System Design", 
      url: "https://roadmap.sh/system-design",
      difficulty: "advanced",
      popular: true,
      description: "Design scalable systems"
    },
    { 
      name: "API Design", 
      url: "https://roadmap.sh/api-design",
      difficulty: "intermediate",
      popular: false,
      description: "Build robust APIs"
    },
    { 
      name: "ASP.NET Core", 
      url: "https://roadmap.sh/aspnet-core",
      difficulty: "intermediate",
      popular: false,
      description: "Modern .NET framework"
    },
    { 
      name: "Java", 
      url: "https://roadmap.sh/java",
      difficulty: "intermediate",
      popular: true,
      description: "Enterprise programming language"
    },
    { 
      name: "C++", 
      url: "https://roadmap.sh/cpp",
      difficulty: "advanced",
      popular: false,
      description: "High-performance programming"
    },
    { 
      name: "Flutter", 
      url: "https://roadmap.sh/flutter",
      difficulty: "intermediate",
      popular: false,
      description: "Cross-platform mobile dev"
    },
    { 
      name: "Spring Boot", 
      url: "https://roadmap.sh/spring-boot",
      difficulty: "intermediate",
      popular: false,
      description: "Java application framework"
    },
    { 
      name: "Go", 
      url: "https://roadmap.sh/go",
      difficulty: "intermediate",
      popular: true,
      description: "Fast, simple, reliable"
    },
    { 
      name: "Rust", 
      url: "https://roadmap.sh/rust",
      difficulty: "advanced",
      popular: false,
      description: "Memory-safe systems programming"
    },
    { 
      name: "GraphQL", 
      url: "https://roadmap.sh/graphql",
      difficulty: "intermediate",
      popular: false,
      description: "Modern API query language"
    },
    { 
      name: "Design and Architecture", 
      url: "https://roadmap.sh/design-architecture",
      difficulty: "advanced",
      popular: false,
      description: "Software design patterns"
    },
    { 
      name: "Design Systems", 
      url: "https://roadmap.sh/design-systems",
      difficulty: "intermediate",
      popular: false,
      description: "Scalable design patterns"
    },
    { 
      name: "React Native", 
      url: "https://roadmap.sh/react-native",
      difficulty: "intermediate",
      popular: true,
      description: "Build native mobile apps"
    },
    { 
      name: "AWS", 
      url: "https://roadmap.sh/aws",
      difficulty: "intermediate",
      popular: true,
      description: "Amazon Web Services"
    },
    { 
      name: "Code Review", 
      url: "https://roadmap.sh/code-review",
      difficulty: "intermediate",
      popular: false,
      description: "Best practices for reviews"
    },
    { 
      name: "Docker", 
      url: "https://roadmap.sh/docker",
      difficulty: "intermediate",
      popular: true,
      description: "Containerization platform"
    },
    { 
      name: "Kubernetes", 
      url: "https://roadmap.sh/kubernetes",
      difficulty: "advanced",
      popular: true,
      description: "Container orchestration"
    },
    { 
      name: "Linux", 
      url: "https://roadmap.sh/linux",
      difficulty: "intermediate",
      popular: true,
      description: "Open-source operating system"
    },
    { 
      name: "MongoDB", 
      url: "https://roadmap.sh/mongodb",
      difficulty: "intermediate",
      popular: false,
      description: "NoSQL database"
    },
    { 
      name: "Prompt Engineering", 
      url: "https://roadmap.sh/prompt-engineering",
      difficulty: "beginner",
      popular: true,
      description: "Master AI prompts"
    },
    { 
      name: "Terraform", 
      url: "https://roadmap.sh/terraform",
      difficulty: "advanced",
      popular: false,
      description: "Infrastructure as Code"
    },
    { 
      name: "Data Structures & Algorithms", 
      url: "https://roadmap.sh/dsa",
      difficulty: "intermediate",
      popular: true,
      description: "Core programming concepts"
    },
    { 
      name: "Git and GitHub", 
      url: "https://roadmap.sh/git",
      difficulty: "beginner",
      popular: true,
      description: "Version control system"
    },
    { 
      name: "Redis", 
      url: "https://roadmap.sh/redis",
      difficulty: "intermediate",
      popular: false,
      description: "In-memory data store"
    },
    { 
      name: "PHP", 
      url: "https://roadmap.sh/php",
      difficulty: "beginner",
      popular: false,
      description: "Server-side scripting"
    },
    { 
      name: "Cloudflare", 
      url: "https://roadmap.sh/cloudflare",
      difficulty: "intermediate",
      popular: false,
      description: "Content delivery network"
    }
  ];

  // Filter roadmaps
  const filterRoadmaps = (roadmaps) => {
    return roadmaps.filter(roadmap => {
      const matchesSearch = roadmap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           roadmap.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'all' || roadmap.difficulty === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    });
  };

  const filteredRoleRoadmaps = filterRoadmaps(roleBasedRoadmaps);
  const filteredSkillRoadmaps = filterRoadmaps(skillBasedRoadmaps);

  const stats = {
    total: roleBasedRoadmaps.length + skillBasedRoadmaps.length,
    roles: roleBasedRoadmaps.length,
    skills: skillBasedRoadmaps.length
  };

  return (
    <div className={`main-content ${darkMode ? 'dark-theme' : ''}`}>
      {/* Header Section */}
      <div className="roadmaps-hero">
        <div className="breadcrumb-container">
          <div className="breadcrumbs">
            <span>Home</span>
            <span className="separator">›</span>
            <span>Developer Roadmaps</span>
          </div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            <FaRocket className="title-icon" />
            Developer Roadmaps
          </h1>
          <p className="hero-subtitle">
            Step-by-step guides and paths to help you learn and master different technologies
          </p>
          
          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-number">{stats.total}+</div>
              <div className="stat-label">Total Roadmaps</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.roles}</div>
              <div className="stat-label">Career Paths</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.skills}</div>
              <div className="stat-label">Skills & Tools</div>
            </div>
          </div>
        </div>
      </div>

      <div className="roadmaps-container">
        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search roadmaps by name or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>
                <FaTimes />
              </button>
            )}
          </div>

          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select 
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="difficulty-filter"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="category-tabs">
            <button 
              className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Roadmaps
            </button>
            <button 
              className={`category-tab ${activeCategory === 'roles' ? 'active' : ''}`}
              onClick={() => setActiveCategory('roles')}
            >
              <FaBriefcase /> Career Roles
            </button>
            <button 
              className={`category-tab ${activeCategory === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveCategory('skills')}
            >
              <FaCode /> Skills & Tools
            </button>
          </div>
        </div>

        {/* Role-based Roadmaps */}
        {(activeCategory === 'all' || activeCategory === 'roles') && filteredRoleRoadmaps.length > 0 && (
          <section className="roadmap-section">
            <div className="section-header">
              <h2 className="section-title">
                <FaBriefcase className="section-icon" />
                Career Role Roadmaps
              </h2>
              <span className="roadmap-count">{filteredRoleRoadmaps.length} roadmaps</span>
            </div>
            <div className="grid-container">
              {filteredRoleRoadmaps.map((roadmap, index) => (
                <RoadmapCard 
                  key={roadmap.name} 
                  {...roadmap}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </section>
        )}

        {/* Skill-based Roadmaps */}
        {(activeCategory === 'all' || activeCategory === 'skills') && filteredSkillRoadmaps.length > 0 && (
          <section className="roadmap-section">
            <div className="section-header">
              <h2 className="section-title">
                <FaCode className="section-icon" />
                Skill & Technology Roadmaps
              </h2>
              <span className="roadmap-count">{filteredSkillRoadmaps.length} roadmaps</span>
            </div>
            <div className="grid-container">
              {filteredSkillRoadmaps.map((roadmap, index) => (
                <RoadmapCard 
                  key={roadmap.name} 
                  {...roadmap}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredRoleRoadmaps.length === 0 && filteredSkillRoadmaps.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No roadmaps found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="reset-btn" onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('all');
            }}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced RoadmapCard component
const RoadmapCard = ({ name, url, difficulty, popular, description, delay }) => {
  const getDifficultyColor = (level) => {
    switch(level) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="grid-card" 
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="card-header">
        {popular && (
          <span className="popular-badge">
            <FaStar /> Popular
          </span>
        )}
        <span 
          className="difficulty-badge" 
          style={{ backgroundColor: getDifficultyColor(difficulty) }}
        >
          {difficulty}
        </span>
      </div>
      
      <h3 className="card-title">{name}</h3>
      <p className="card-description">{description}</p>
      
      <div className="card-footer">
        <span className="explore-link">
          Explore Roadmap
          <FaExternalLinkAlt className="link-icon" />
        </span>
      </div>
    </a>
  );
};

export default RoadmapFeature;


