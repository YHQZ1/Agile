import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, BookOpen, Users, Award } from 'lucide-react';
import '../styles/LandingPage.css'; // Import the new CSS file

// Replace with your actual import when implementing
const bgImage = "../";

const LandingPage = ({ isLoggedIn, userType }) => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
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
        />
        
        {/* Content Split */}
        <div className="content-split">
          {/* Left section - animated content */}
          <div className="left-section">
            <div className="left-content">
              <div className="career-badge">
                <span>Launch Your Career</span>
              </div>
              
              <h1 className="hero-heading">
                Your Path <br/>
                <span className="text-muted">From College</span><br/>
                <span>To Career</span>
              </h1>
              
              <button className="discover-button" onClick={scrollToFeatures}>
                Discover How
                <ChevronDown size={20} />
              </button>
            </div>
          </div>
          
          {/* Right section - gray overlay */}
          <div className="right-section">
            <div className="auth-buttons">
              <button className="auth-button" >
                Recruiter
              </button>
              <button className="auth-button" onClick={handleStudentClick}>
                Student
              </button>
            </div>
            
            <div className="right-content">
              <h2 className="main-heading">
                BRIDGING THE GAP BETWEEN COLLEGE AND CAREER, ONE OPPORTUNITY AT A TIME.
              </h2>
              <p className="subtext">
                YOUR PLACEMENT JOURNEY STARTS HERE!
              </p>
              
              <div className="dot-indicator">
                <div className="animated-dot"></div>
                <div className="line-indicator"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated scroll indicator */}
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll to explore</span>
          <div className="scroll-arrow">
            <ChevronDown size={24} />
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div ref={featuresRef} className="features-section">
        <div className="features-container">
          <div className="features-heading">
            <h2 className="features-title">How It Works</h2>
            <p className="features-subtitle">
              Our platform connects talented students with top recruiters, 
              streamlining the placement process for better opportunities.
            </p>
          </div>
          
          <div className="features-grid">
            {[
              {
                icon: <BookOpen size={40} className="feature-icon" />,
                title: "Showcase Skills",
                description: "Build a comprehensive profile that highlights your academic achievements and skills."
              },
              {
                icon: <Users size={40} className="feature-icon" />,
                title: "Connect Directly",
                description: "Interact with recruiters from leading companies looking for fresh talent."
              },
              {
                icon: <Award size={40} className="feature-icon" />,
                title: "Land Opportunities",
                description: "Get matched with positions that align with your career goals and aspirations."
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                {feature.icon}
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="cta-container">
            <button className="cta-button" onClick={() => navigate('/auth')}>
              Get Started Today
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-branding">
              <h2 className="footer-logo">VerQ</h2>
              <p className="footer-tagline">Connecting talent with opportunity</p>
            </div>
            
            <div className="footer-links">
              <a href="#" className="footer-link">About</a>
              <a href="#" className="footer-link">Contact</a>
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Terms</a>
            </div>
          </div>
          <div className="footer-copyright">
            <p>&copy; {new Date().getFullYear()} VerQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;