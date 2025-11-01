import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import '../styles/Auth.css';
import { BACKEND_URL } from '../config/env';
import { TEST_EMAIL, TEST_PASSWORD, createTestUser } from '../api/Auth';

const BASE_URL = BACKEND_URL;

const Auth = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState('student');
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '', remember: false });
  const [signupData, setSignupData] = useState({ email: '', password: '', confirmPassword: '', terms: false });
  const [errors, setErrors] = useState({ password: false, confirmPassword: false, email: false, form: null });
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState(null);

  const COLLEGE_EMAIL_DOMAIN = '@sitpune.edu.in';

  useEffect(() => {
    if (location.state?.userType) {
      setUserType(location.state.userType);
    }
    setErrors({ password: false, confirmPassword: false, email: false, form: null });
  }, [location, isLogin]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotStatus(null);
    if (!forgotEmail) {
      setForgotStatus('Please enter your email address.');
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setForgotStatus('Password reset instructions sent to your email.');
      } else {
        setForgotStatus(data.message || 'Failed to send reset instructions.');
      }
    } catch (error) {
      setForgotStatus('Server error. Please try again later.');
    }
  };

  const handleTestLogin = async () => {
    setLoginData({ email: TEST_EMAIL, password: TEST_PASSWORD, remember: false });
    setUserType('student');
    setIsLoading(true);
    try {
      await createTestUser();
    } catch (e) {
      console.error('Test user creation failed:', e);
    }
    setIsLoading(false);
  };

  const validateEmail = (email, type) => {
    return type !== 'student' || email.endsWith(COLLEGE_EMAIL_DOMAIN);
  };

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors.form) setErrors(prev => ({ ...prev, form: null }));
    if (name === 'email') setErrors(prev => ({ ...prev, email: false }));
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors.form || errors.password || errors.confirmPassword || errors.email) {
      setErrors({ password: false, confirmPassword: false, email: false, form: null });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ ...errors, form: null, email: false });

    if (userType === 'student' && !validateEmail(loginData.email, userType)) {
      setErrors({ ...errors, email: true, form: `Please use your college email (${COLLEGE_EMAIL_DOMAIN})` });
      setIsLoading(false);
      return;
    }

    if (loginData.email === TEST_EMAIL && loginData.password === TEST_PASSWORD) {
      localStorage.setItem('isTestStudentAuthenticated', 'true');
      setTimeout(() => {
        setIsLoading(false);
        navigate('/default');
      }, 500);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          userType,
          remember: loginData.remember,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.isFirstTime && userType === 'student') {
          navigate('/student-form');
        } else {
          navigate('/default');
        }
      } else {
        setErrors(prev => ({ ...prev, form: data.message || 'Login failed' }));
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors(prev => ({ ...prev, form: 'Server error. Please try again later.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const passwordValid =
      signupData.password.length >= 8 &&
      /[A-Z]/.test(signupData.password) &&
      /[a-z]/.test(signupData.password) &&
      /[0-9]/.test(signupData.password) &&
      /[^A-Za-z0-9]/.test(signupData.password);
    const passwordsMatch = signupData.password === signupData.confirmPassword;
    const termsAccepted = signupData.terms;
    const emailValid = validateEmail(signupData.email, userType);

    const newErrors = {
      password: !passwordValid,
      confirmPassword: !passwordsMatch,
      email: !emailValid,
      form: !termsAccepted
        ? 'You must accept the terms and conditions'
        : (!emailValid && userType === 'student')
        ? `Students must use college email (${COLLEGE_EMAIL_DOMAIN})`
        : null,
    };

    setErrors(newErrors);

    if (!passwordValid || !passwordsMatch || !termsAccepted || !emailValid) {
      setIsLoading(false);
      return;
    }
    
    if (signupData.email === TEST_EMAIL && signupData.password === TEST_PASSWORD) {
      localStorage.setItem('isTestStudentAuthenticated', 'true');
      setTimeout(() => {
        setIsLoading(false);
        if (userType === 'student') {
          navigate('/student-form');
        }
      }, 500);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (userType === 'student') {
          navigate('/student-form');
        }
      } else {
        setErrors(prev => ({ ...prev, form: data.message || 'Registration failed' }));
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors(prev => ({ ...prev, form: 'Server error. Please try again later.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setShowLoginPassword(false);
    setShowSignupPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="user-type-tabs">
          <button 
            className={`tab ${userType === 'student' ? 'active' : ''}`} 
            onClick={() => setUserType('student')}
          >
            Student
          </button>
          <button 
            className={`tab ${userType === 'recruiter' ? 'active' : ''}`} 
            onClick={() => setUserType('recruiter')}
          >
            Recruiter
          </button>
        </div>

        {errors.form && (
          <div className="form-error-message">
            {errors.form}
          </div>
        )}

        {isLogin ? (
          <>
            <div className="auth-header">
              <div className="auth-logo">VerQ</div>
              <h1 className="auth-title">Welcome back {userType}</h1>
              <p className="auth-subtitle">Enter your credentials to access your account</p>
              {userType === 'student' && (
                <p className="auth-note">Students must use their college email address</p>
              )}
              <button type="button" className="btn-test" onClick={handleTestLogin} disabled={isLoading}>
                Use Test Credentials
              </button>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  value={loginData.email} 
                  onChange={handleLoginChange} 
                  className={errors.email ? 'input-error' : ''}
                  placeholder={userType === 'student' ? `example${COLLEGE_EMAIL_DOMAIN}` : 'example@email.com'}
                />
                {errors.email && (
                  <div className="form-error">Please use your college email address</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                  <span className="password-toggle" onClick={() => setShowLoginPassword(!showLoginPassword)}>
                    {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="form-footer">
                <div className="remember-me">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    name="remember" 
                    checked={loginData.remember} 
                    onChange={handleLoginChange} 
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot password?
                </button>
              </div>

              <button 
                type="submit" 
                className="btn-auth" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-header">
              <div className="auth-logo">VerQ</div>
              <h1 className="auth-title">Create {userType} account</h1>
              <p className="auth-subtitle">Start your journey with us today</p>
              {userType === 'student' && (
                <p className="auth-note">Students must register with their college email address</p>
              )}
            </div>

            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input 
                  type="email" 
                  id="signup-email" 
                  name="email" 
                  required 
                  value={signupData.email} 
                  onChange={handleSignupChange}
                  className={errors.email ? 'input-error' : ''}
                  placeholder={userType === 'student' ? `example${COLLEGE_EMAIL_DOMAIN}` : 'example@email.com'}
                />
                {errors.email && (
                  <div className="form-error">Please use your college email address</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    id="signup-password"
                    name="password"
                    required
                    value={signupData.password}
                    onChange={handleSignupChange}
                  />
                  <span className="password-toggle" onClick={() => setShowSignupPassword(!showSignupPassword)}>
                    {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && (
                  <div className="form-error">
                    Password must be at least 8 characters and include uppercase, lowercase, number, and special character
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                  />
                  <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.confirmPassword && <div className="form-error">Passwords don't match</div>}
              </div>

              <div className="remember-me">
                <input 
                  type="checkbox" 
                  id="terms" 
                  name="terms" 
                  required 
                  checked={signupData.terms} 
                  onChange={handleSignupChange} 
                />
                <label htmlFor="terms">I agree to the Terms and Privacy Policy</label>
              </div>

              <button 
                type="submit" 
                className="btn-auth" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </>
        )}

        <div className="auth-divider">
          <div className="divider-line"></div>
          <span className="divider-text">Or continue with</span>
          <div className="divider-line"></div>
        </div>

        <div className="social-buttons">
          <button
            className="btn-social"
            onClick={() => alert('This feature is under development. Please use email and password instead.')}
          >
            <FcGoogle className="social-icon" /> Google
          </button>
          <button
            className="btn-social"
            onClick={() => alert('This feature is under development. Please use email and password instead.')}
          >
            <FaGithub className="social-icon" /> GitHub
          </button>
        </div>

        <div className="auth-redirect">
          {isLogin ? (
            <>Don't have an account? <button onClick={toggleAuthMode}>Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={toggleAuthMode}>Sign in</button></>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => { setShowForgotModal(false); setForgotStatus(null); setForgotEmail(''); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label htmlFor="forgot-email">Email Address</label>
                <input
                  type="email"
                  id="forgot-email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <button type="submit" className="btn-auth">Send Reset Link</button>
            </form>
            {forgotStatus && (
              <div className={`modal-status ${forgotStatus.includes('sent') ? 'success' : 'error'}`}>
                {forgotStatus}
              </div>
            )}
            <button
              type="button"
              className="btn-close-modal"
              onClick={() => { setShowForgotModal(false); setForgotStatus(null); setForgotEmail(''); }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
