
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BriefcaseBusiness,
  Sparkles,
  ArrowRight,
  UserRound,
  Building2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./auth.css";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
  });

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.full_name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Your passwords do not match. Please check them.");
      return;
    }

    try {
      setLoading(true);

      const { confirmPassword, ...registrationData } = formData;

      await register({
        ...registrationData,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
      });

      navigate("/login", {
        replace: true,
        state: {
          message: "Your account was created successfully. Please sign in.",
        },
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell auth-register-shell">
      <section className="auth-aside">
        <Link to="/login" className="auth-logo">
          <span className="auth-logo-icon">
            <BriefcaseBusiness size={23} />
          </span>
          <span>
            HireSense <strong>AI</strong>
          </span>
        </Link>

        <div className="auth-aside-content">
          <span className="auth-eyebrow">
            <Sparkles size={15} />
            START YOUR JOURNEY
          </span>

          <h1>
            Your next
            <br />
            opportunity
            <br />
            <span>starts here.</span>
          </h1>

          <p>
            Create your account to explore resume insights, discover your
            strengths, and make your career goals clearer.
          </p>

          <div className="auth-benefit">
            <span><UserRound size={19} /></span>
            <div>
              <strong>A workspace built around you</strong>
              <small>Choose the account type that fits your needs.</small>
            </div>
          </div>
        </div>

        <p className="auth-aside-footer">
          Take the next step in your professional journey.
        </p>
      </section>

      <section className="auth-main">
        <div className="auth-card auth-register-card">
          <div className="auth-mobile-brand">
            <span className="auth-logo-icon">
              <BriefcaseBusiness size={21} />
            </span>
            <strong>HireSense <span>AI</span></strong>
          </div>

          <div className="auth-heading">
            <span className="auth-step-label">GET STARTED</span>
            <h2>Create your account</h2>
            <p>Fill in your details to get started.</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="register-name">Full name</label>
              <div className="auth-input-wrap">
                <User size={18} />
                <input
                  id="register-name"
                  type="text"
                  name="full_name"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={handleChange}
                  autoComplete="name"
                  minLength={2}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <small className="auth-field-help">
                Use at least 8 characters.
              </small>
            </div>

            <div className="auth-field">
              <label htmlFor="register-confirm-password">
                Confirm password
              </label>
              <div className="auth-input-wrap">
                <Lock size={18} />
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Enter your password again"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-role">I want to join as</label>
              <div className="auth-role-options">
                <label
                  className={`auth-role-option ${
                    formData.role === "candidate" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="candidate"
                    checked={formData.role === "candidate"}
                    onChange={handleChange}
                  />
                  <UserRound size={19} />
                  <span>
                    <strong>Job Seeker</strong>
                    <small>Analyse my resume</small>
                  </span>
                </label>

                <label
                  className={`auth-role-option ${
                    formData.role === "recruiter" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={formData.role === "recruiter"}
                    onChange={handleChange}
                  />
                  <Building2 size={19} />
                  <span>
                    <strong>Recruiter</strong>
                    <small>Recruitment workspace</small>
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Creating your account..." : "Create account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <p className="auth-privacy">
            <Lock size={14} />
            Your account information is handled securely.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
