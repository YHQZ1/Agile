import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, BookOpen, Users, Award, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';
import '../styles/LandingPage.css';

const bgImage = "../";

const LandingPage = ({ isLoggedIn, userType }) => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const featuresRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          setIsVisible(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStudentClick = () => {
    if (isLoggedIn && userType === 'student') {
      navigate("/student-dashboard");
    } else {
      navigate("/auth", { state: { userType: "student" } });
    }
  };

  const handleRecruiterClick = () => {
    if (isLoggedIn && userType === 'recruiter') {
      navigate("/recruiter-dashboard");
    } else {
      navigate("/auth", { state: { userType: "recruiter" } });
    }
  };
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <BookOpen size={40} className="feature-icon" />,
      title: "Showcase Skills",
      description: "Build a comprehensive profile that highlights your academic achievements, projects, and technical skills with our AI-powered resume builder.",
      stats: "2,500+ profiles created"
    },
    {
      icon: <Users size={40} className="feature-icon" />,
      title: "Connect Directly",
      description: "Interact with recruiters from 200+ leading companies actively looking for fresh talent through our verified platform.",
      stats: "95% response rate"
    },
    {
      icon: <Award size={40} className="feature-icon" />,
      title: "Land Opportunities",
      description: "Get matched with positions that align with your career goals through intelligent algorithms and personalized recommendations.",
      stats: "₹8.5L avg. package"
    }
  ];

  const highlights = [
    { icon: <CheckCircle size={18} />, text: "Verified Companies Only" },
    { icon: <CheckCircle size={18} />, text: "Real-time Updates" },
    { icon: <CheckCircle size={18} />, text: "Free for Students" }
  ];

  const stats = [
    { value: "2,500+", label: "Students Placed" },
    { value: "200+", label: "Companies" },
    { value: "95%", label: "Success Rate" }
  ];

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <div className="hero-section-lp">
        {/* Parallax Background */}
        <div 
          className="parallax-background"
          style={{ 
            backgroundImage: `url(${bgImage})`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        >
          <div className="gradient-overlay"></div>
          <div className="animated-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        {/* Content Split */}
        <div className="content-split">
          {/* Left section - animated content */}
          <div className="left-section">
            <div className="left-content">
              <div className="career-badge">
                <Sparkles size={16} />
                <span>Launch Your Career</span>
              </div>
              
              <h1 className="hero-heading">
                Your Path <br/>
                <span className="text-gradient">From College</span><br/>
                <span>To Career</span>
              </h1>

              <p className="hero-description">
                Join India's premier placement platform connecting ambitious students 
                with top recruiters. Your success story begins here.
              </p>

              {/* Stats Mini Cards */}
              <div className="stats-mini">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-mini-card">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <button className="discover-button" onClick={scrollToFeatures}>
                Discover How
                <ChevronDown size={20} />
              </button>

              {/* Highlights */}
              <div className="highlights-list">
                {highlights.map((highlight, index) => (
                  <div key={index} className="highlight-item">
                    {highlight.icon}
                    <span>{highlight.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right section - gray overlay */}
          <div className="right-section">
            <div className="auth-buttons">
              <button className="auth-button" onClick={handleRecruiterClick}>
                <Users size={18} />
                Recruiter
              </button>
              <button className="auth-button auth-button-primary" onClick={handleStudentClick}>
                <Award size={18} />
                Student
              </button>
            </div>
            
            <div className="right-content">
              <div className="content-badge">
                <TrendingUp size={16} />
                <span>OFFICIAL PLACEMENT PORTAL</span>
              </div>

              <h2 className="main-heading">
                BRIDGING THE GAP BETWEEN COLLEGE AND CAREER, ONE OPPORTUNITY AT A TIME.
              </h2>
              <p className="subtext">
                YOUR PLACEMENT JOURNEY STARTS HERE!
              </p>

              {/* Feature Highlights */}
              <div className="feature-highlights">
                <div className="feature-highlight-item">
                  <div className="highlight-icon">
                    <BookOpen size={20} />
                  </div>
                  <div className="highlight-content">
                    <h4>Smart Matching</h4>
                    <p>AI-powered job recommendations</p>
                  </div>
                </div>
                <div className="feature-highlight-item">
                  <div className="highlight-icon">
                    <TrendingUp size={20} />
                  </div>
                  <div className="highlight-content">
                    <h4>Live Tracking</h4>
                    <p>Real-time application status</p>
                  </div>
                </div>
              </div>
              
              <div className="dot-indicator">
                <div className="animated-dot"></div>
                <div className="line-indicator"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated scroll indicator */}
          <div className="scroll-indicator" onClick={scrollToFeatures} style={{cursor: 'pointer'}}>
            <span className="scroll-text">Scroll to explore</span>
            <div className="scroll-arrow">
              <ChevronDown size={24} />
            </div>
          </div>
      </div>
      
      {/* Features Section */}
      <div ref={featuresRef} className={`features-section ${isVisible ? 'visible' : ''}`}>
        <div className="features-container">
          <div className="features-heading">
            <div className="section-badge">
              <Sparkles size={16} />
              <span>HOW IT WORKS</span>
            </div>
            <h2 className="features-title">Your Journey to Success</h2>
            <p className="features-subtitle">
              Our platform connects talented students with top recruiters, 
              streamlining the placement process for better opportunities and career growth.
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-stats">
                  <TrendingUp size={14} />
                  <span>{feature.stats}</span>
                </div>
                <div className="feature-number">0{index + 1}</div>
              </div>
            ))}
          </div>
          
          <div className="cta-container">
            <button className="cta-button" onClick={() => navigate('/auth')}>
              Get Started Today
              <span className="button-arrow">→</span>
            </button>
            <p className="cta-subtext">
              Join 10,000+ students already on their path to success
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-branding">
              <div className="footer-logo-wrapper">
                <Award size={28} className="footer-icon" />
                <h2 className="footer-logo">VerQ</h2>
              </div>
              <p className="footer-tagline">
                Empowering students to achieve their career dreams through 
                seamless campus recruitment experiences.
              </p>
              <div className="social-links">
                <a href="https://www.linkedin.com/" className="social-link" aria-label="LinkedIn">in</a>
                <a href="https://x.com/" className="social-link" aria-label="Twitter">𝕏</a>
                <a href="https://www.facebook.com/" className="social-link" aria-label="Facebook">f</a>
                <a href="https://www.instagram.com/" className="social-link" aria-label="Instagram">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="footer-links-group">
              <div className="footer-column">
                <h4 className="footer-heading">Platform</h4>
                  <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/auth', { state: { userType: 'student' } }); }}>For Students</a>
                  <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/auth', { state: { userType: 'recruiter' } }); }}>For Recruiters</a>
                  <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); scrollToFeatures(); }}>How It Works</a>
              </div>
              
              <div className="footer-column">
                <h4 className="footer-heading">Get to know us</h4>
                <a href="./About" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/About'); }}>About Us</a>
                <a href="./Contact" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/Contact'); }}>Contact</a>
                <a href="./Careers" className="footer-link" onClick={(e) => { e.preventDefault(); navigate('/Careers'); }}>Careers</a>
              </div>
              
              <div className="footer-column">
                <h4 className="footer-heading">Legal</h4>
                <a href="#" className="footer-link">Privacy Policy</a>
                <a href="#" className="footer-link">Terms of Service</a>
                <a href="#" className="footer-link">Cookie Policy</a>
              </div>
            </div>
          </div>
          
          <div className="footer-copyright">
            <p>&copy; {new Date().getFullYear()} VerQ. All rights reserved.</p>
            <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">Help Center</a>
            <span className="separator">•</span>
            <a href="#" className="footer-bottom-link">Feedback</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
