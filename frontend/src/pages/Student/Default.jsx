import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/Student/Default.css';

const Default = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const featureCardsRef = useRef([]);
  const statsRef = useRef(null);
  const processRef = useRef(null);
  const testimonialsRef = useRef(null);
  const companiesRef = useRef(null);
  const ctaRef = useRef(null);
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('dp-animate-in');
            
            // Animate stats counting
            if (entry.target.classList.contains('dp-stats-section')) {
              const statNumbers = document.querySelectorAll('.dp-stat-number');
              statNumbers.forEach((stat) => {
                const target = +stat.getAttribute('data-count');
                const duration = 2000;
                const start = 0;
                const increment = target / (duration / 16);
                let current = start;
                
                const timer = setInterval(() => {
                  current += increment;
                  if (current >= target) {
                    clearInterval(timer);
                    current = target;
                  }
                  stat.textContent = Math.floor(current);
                }, 16);
              });
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (processRef.current) observer.observe(processRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (companiesRef.current) observer.observe(companiesRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  // Function to handle button click
  const handleGetStarted = () => {
    navigate('/student-dashboard');
  };

  // Feature icons - using simpler, more reliable SVG paths
  const featureIcons = [
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z",
    "M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm8-3h2v10h-2zm-4 6h2v4h-2z",
    "M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z",
    "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z",
    "M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM5 10h9v2H5zm0-3h9v2H5z",
    "M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1.5-1L8 9V4zm9 16H6V4h1v9l3-3 3 3V4h5v16z"
  ];

  return (
    <div className="dp-landing-page" data-theme={darkMode ? "dark" : "light"}>
      {/* Hero Section */}
      <section ref={heroRef} className="dp-hero-section">
        <div className="dp-hero-content">
          <h1 className="dp-hero-title">
            <span className="dp-title-line">Transform Your</span>
            <span className="dp-title-line dp-highlight">Placement Journey</span>
          </h1>
          <p className="dp-hero-subtitle">
            Streamlining the placement process for students, recruiters, and administrators with our automated platform.
          </p>
          <div className="dp-hero-buttons">
            <button className="dp-btn dp-btn-primary" onClick={handleGetStarted}>Get Started</button>
          </div>
        </div>
        
        {/* Enhanced Hero Illustration with new visual elements */}
        <div className="dp-hero-illustration">
          <div className="dp-floating-elements">
            <div className="dp-floating-circle dp-circle-1"></div>
            <div className="dp-floating-circle dp-circle-2"></div>
            <div className="dp-floating-circle dp-circle-3"></div>
            <div className="dp-floating-square"></div>
            
            {/* New animated elements */}
            <div className="dp-animated-dots">
              <div className="dp-dot dp-dot-1"></div>
              <div className="dp-dot dp-dot-2"></div>
              <div className="dp-dot dp-dot-3"></div>
              <div className="dp-dot dp-dot-4"></div>
              <div className="dp-dot dp-dot-5"></div>
            </div>
            
            {/* New decorative line elements */}
            <div className="dp-decorative-lines">
              <div className="dp-line dp-line-1"></div>
              <div className="dp-line dp-line-2"></div>
              <div className="dp-line dp-line-3"></div>
            </div>
            
            {/* Interactive 3D placement cube */}
            <div className="dp-placement-cube">
              <div className="dp-cube-face dp-face-front"></div>
              <div className="dp-cube-face dp-face-back"></div>
              <div className="dp-cube-face dp-face-right"></div>
              <div className="dp-cube-face dp-face-left"></div>
              <div className="dp-cube-face dp-face-top"></div>
              <div className="dp-cube-face dp-face-bottom"></div>
            </div>
            
            {/* Career path visual */}
            <div className="dp-career-path">
              <div className="dp-path-node dp-node-education">
                <div className="dp-node-icon dp-education-icon"></div>
              </div>
              <div className="dp-path-line"></div>
              <div className="dp-path-node dp-node-skills">
                <div className="dp-node-icon dp-skills-icon"></div>
              </div>
              <div className="dp-path-line"></div>
              <div className="dp-path-node dp-node-interview">
                <div className="dp-node-icon dp-interview-icon"></div>
              </div>
              <div className="dp-path-line"></div>
              <div className="dp-path-node dp-node-job">
                <div className="dp-node-icon dp-job-icon"></div>
              </div>
            </div>
            
            <div className="dp-dashboard-mockup">
              <div className="dp-mockup-header">
                <div className="dp-mockup-search">
                  <div className="dp-search-bar"></div>
                </div>
                <div className="dp-mockup-user"></div>
              </div>
              <div className="dp-mockup-sidebar"></div>
              <div className="dp-mockup-content">
                <div className="dp-stats-row">
                  <div className="dp-stat-box"></div>
                  <div className="dp-stat-box"></div>
                  <div className="dp-stat-box"></div>
                  <div className="dp-stat-box"></div>
                </div>
                <div className="dp-chart-area">
                  <div className="dp-line-chart"></div>
                </div>
                <div className="dp-jobs-list">
                  <div className="dp-job-item"></div>
                  <div className="dp-job-item"></div>
                  <div className="dp-job-item"></div>
                </div>
              </div>
            </div>
            
            {/* Floating company logos */}
            <div className="dp-floating-companies">
              <div className="dp-company-logo dp-logo-1"></div>
              <div className="dp-company-logo dp-logo-2"></div>
              <div className="dp-company-logo dp-logo-3"></div>
              <div className="dp-company-logo dp-logo-4"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="dp-stats-section">
        <div className="dp-stats-container">
          <div className="dp-stat-card">
            <h3 className="dp-stat-number" data-count="150">0</h3>
            <p className="dp-stat-label">Top Companies</p>
          </div>
          <div className="dp-stat-card">
            <h3 className="dp-stat-number" data-count="1200">0</h3>
            <p className="dp-stat-label">Students Placed</p>
          </div>
          <div className="dp-stat-card">
            <h3 className="dp-stat-number" data-count="96">0</h3>
            <p className="dp-stat-label">% Placement Rate</p>
          </div>
          <div className="dp-stat-card">
            <h3 className="dp-stat-number" data-count="500">0</h3>
            <p className="dp-stat-label">Job Offers</p>
          </div>
        </div>
      </section>

      {/* The rest of your component remains the same... */}
      {/* Features Section */}
      <section ref={featuresRef} className="dp-features-section">
        <h2 className="dp-section-title">Key Features</h2>
        <p className="dp-section-subtitle">Everything you need for a seamless placement experience</p>
        
        <div className="dp-features-grid">
          {[
            {
              title: 'Automated Notifications',
              description: 'Get instant alerts about new job postings, interview schedules, and important announcements.'
            },
            {
              title: 'Analytics Dashboard',
              description: 'Track placement statistics, student performance, and company engagement metrics in real-time.'
            },
            {
              title: 'Resume Builder',
              description: 'Create professional resumes with our easy-to-use templates tailored for different job profiles.'
            },
            {
              title: 'Interview Scheduler',
              description: 'Coordinate interviews between companies and students with our integrated scheduling system.'
            },
            {
              title: 'Skill Assessment',
              description: 'Evaluate your skills with our comprehensive tests and get personalized improvement suggestions.'
            },
            {
              title: 'Company Portal',
              description: 'Dedicated space for recruiters to post jobs, review applications, and manage campus drives.'
            }
          ].map((feature, index) => (
            <div 
              key={index}
              ref={(el) => (featureCardsRef.current[index] = el)} 
              className="dp-feature-card"
            >
              <div className="dp-feature-icon">
                <svg viewBox="0 0 24 24">
                  <path d={featureIcons[index]} />
                </svg>
              </div>
              <h3 className="dp-feature-title">{feature.title}</h3>
              <p className="dp-feature-description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Placement Process Section */}
      <section ref={processRef} className="dp-process-section">
        <h2 className="dp-section-title">Our Placement Process</h2>
        <p className="dp-section-subtitle">Simple steps to your dream job</p>
        
        <div className="dp-process-steps">
          {[
            { number: '1', title: 'Profile Creation', description: 'Complete your profile with academic and skill details' },
            { number: '2', title: 'Resume Building', description: 'Create a professional resume using our templates' },
            { number: '3', title: 'Skill Assessment', description: 'Take our tests to evaluate your competencies' },
            { number: '4', title: 'Job Matching', description: 'Get matched with suitable companies based on your profile' },
            { number: '5', title: 'Interview Preparation', description: 'Access resources to prepare for interviews' },
            { number: '6', title: 'Placement', description: 'Attend interviews and secure your dream job' }
          ].map((step, index) => (
            <div key={index} className="dp-process-step">
              <div className="dp-step-number">{step.number}</div>
              <div className="dp-step-content">
                <h3 className="dp-step-title">{step.title}</h3>
                <p className="dp-step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="dp-testimonials-section">
        <h2 className="dp-section-title">Success Stories</h2>
        <p className="dp-section-subtitle">Hear from our students and recruiters</p>
        
        <div className="dp-testimonials-grid">
          {[
            {
              text: "The placement portal made it so easy to apply to multiple companies and track my applications. I landed my dream job within weeks!",
              name: "Rahul Sharma",
              role: "Placed at Microsoft"
            },
            {
              text: "As a recruiter, this platform has streamlined our campus hiring process significantly. The student profiles are comprehensive and easy to evaluate.",
              name: "Priya Patel",
              role: "HR Manager, Amazon"
            },
            {
              text: "The resume builder helped me create a professional CV that got me noticed by top companies. I received 5 interview calls within a week!",
              name: "Anjali Mehta",
              role: "Placed at Google"
            }
          ].map((testimonial, index) => (
            <div 
              key={index}
              className="dp-testimonial-card"
            >
              <div className="dp-testimonial-content">
                <p className="dp-testimonial-text">"{testimonial.text}"</p>
                <div className="dp-testimonial-author">
                  <div className="dp-author-avatar"></div>
                  <div className="dp-author-info">
                    <h4 className="dp-author-name">{testimonial.name}</h4>
                    <p className="dp-author-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Default;