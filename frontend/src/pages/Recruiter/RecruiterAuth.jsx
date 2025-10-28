import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../../api/Auth";
import "../../styles/Auth.css";

const RecruiterAuth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [formErrors, setFormErrors] = useState({ password: false, confirmPassword: false });
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setFormMessage("");
    setFormErrors({ password: false, confirmPassword: false });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setFormMessage("");
    setIsSubmitting(true);

    try {
      await login({ email: loginData.email, password: loginData.password });
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("userType", "recruiter");
      navigate("/recruiter-dashboard", { replace: true });
    } catch (error) {
      setFormMessage(error.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setFormMessage("");

    const errors = { password: false, confirmPassword: false };
    let hasError = false;

    if (signupData.password.length < 8) {
      errors.password = true;
      hasError = true;
    }

    if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = true;
      hasError = true;
    }

    if (!signupData.terms) {
      setFormMessage("Please accept the terms of service to continue");
      hasError = true;
    }

    setFormErrors(errors);
    if (hasError) {
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        email: signupData.email,
        password: signupData.password,
        role: "recruiter",
      });

      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("userType", "recruiter");
      navigate("/company-profile", { replace: true });
    } catch (error) {
      setFormMessage(error.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {formMessage && <div className="form-error" role="alert">{formMessage}</div>}

        {isLogin ? (
          <>
            <div className="auth-header">
              <div className="auth-logo">VerQ</div>
              <h1 className="auth-title">Recruiter sign in</h1>
              <p className="auth-subtitle">Access your hiring dashboard and job postings</p>
            </div>

            <form id="login-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="login-email" className="form-label">Email</label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  className="form-input"
                  autoComplete="email"
                  required
                  value={loginData.email}
                  onChange={handleLoginChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password" className="form-label">Password</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  className="form-input"
                  autoComplete="current-password"
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
              </div>

              <button type="submit" className="btn-auth" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-header">
              <div className="auth-logo">VerQ</div>
              <h1 className="auth-title">Recruiter sign up</h1>
              <p className="auth-subtitle">Create an account to start posting jobs</p>
            </div>

            <form id="signup-form" onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label htmlFor="signup-email" className="form-label">Work Email</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  className="form-input"
                  autoComplete="email"
                  required
                  value={signupData.email}
                  onChange={handleSignupChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password" className="form-label">Password</label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  className={`form-input ${formErrors.password ? "input-error" : ""}`}
                  autoComplete="new-password"
                  required
                  value={signupData.password}
                  onChange={handleSignupChange}
                />
                {formErrors.password && (
                  <div className="form-error">Password must be at least 8 characters</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="signup-confirmPassword"
                  name="confirmPassword"
                  className={`form-input ${formErrors.confirmPassword ? "input-error" : ""}`}
                  autoComplete="new-password"
                  required
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                />
                {formErrors.confirmPassword && (
                  <div className="form-error">Passwords do not match</div>
                )}
              </div>

              <div className="remember-me" style={{ marginBottom: "20px" }}>
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  className="checkbox-input"
                  checked={signupData.terms}
                  onChange={handleSignupChange}
                  required
                />
                <label htmlFor="terms" className="checkbox-label">
                  I agree to the <span className="forgot-password">Terms of Service</span> and <span className="forgot-password">Privacy Policy</span>
                </label>
              </div>

              <button type="submit" className="btn-auth" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </>
        )}

        <div className="auth-redirect">
          {isLogin ? (
            <>
              Need an account?{' '}
              <a
                href="#switch-to-signup"
                onClick={(event) => {
                  event.preventDefault();
                  toggleAuthMode();
                }}
              >
                Sign up
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a
                href="#switch-to-login"
                onClick={(event) => {
                  event.preventDefault();
                  toggleAuthMode();
                }}
              >
                Sign in
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterAuth;


