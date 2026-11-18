
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  BriefcaseBusiness,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./auth.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const successMessage = location.state?.message;

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

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email address and password.");
      return;
    }

    try {
      setLoading(true);

      const user = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (user.role === "recruiter") {
        navigate("/recruiter/dashboard", { replace: true });
      } else {
        navigate("/candidate/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to sign in. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
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
            YOUR CAREER, WITH CLARITY
          </span>

          <h1>
            Make your next
            <br />
            career move
            <br />
            <span>count.</span>
          </h1>

          <p>
            Get meaningful insights from your resume, understand your skills,
            and prepare for your next opportunity.
          </p>

          <div className="auth-benefit">
            <span><ShieldCheck size={19} /></span>
            <div>
              <strong>Your account, your journey</strong>
              <small>Secure sign-in to your personal workspace.</small>
            </div>
          </div>
        </div>

        <p className="auth-aside-footer">
          Smarter resume insights. Better career decisions.
        </p>
      </section>

      <section className="auth-main">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <span className="auth-logo-icon">
              <BriefcaseBusiness size={21} />
            </span>
            <strong>HireSense <span>AI</span></strong>
          </div>

          <div className="auth-heading">
            <span className="auth-step-label">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p>Enter your details to continue to HireSense AI.</p>
          </div>

          {successMessage && (
            <div className="auth-success" role="status">
              <ShieldCheck size={18} />
              {successMessage}
            </div>
          )}

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  id="login-email"
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
              <label htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
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
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Signing you in..." : "Sign in"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-divider">
            <span>NEW TO HIRESENSE AI?</span>
          </div>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create an account</Link>
          </p>

          <p className="auth-privacy">
            <ShieldCheck size={14} />
            Your account information is handled securely.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
