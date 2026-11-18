
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Search,
  Briefcase,
  Settings,
  LogOut,
  Bell,
  Sparkles,
  Upload,
  ArrowUpRight,
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const fullName = user?.full_name || "there";
  const firstName = fullName.trim().split(" ")[0];
  const initial = fullName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  const stats = [
    {
      title: "My Resumes",
      value: "0",
      description: "No resumes uploaded yet",
      icon: <FileText size={21} />,
      color: "emerald",
    },
    {
      title: "Resume Analyses",
      value: "0",
      description: "No analyses yet",
      icon: <Search size={21} />,
      color: "violet",
    },
    {
      title: "Applications",
      value: "0",
      description: "No applications yet",
      icon: <Briefcase size={21} />,
      color: "amber",
    },
    {
      title: "Interviews",
      value: "0",
      description: "No interviews scheduled",
      icon: <ArrowUpRight size={21} />,
      color: "rose",
    },
  ];

  return (
    <div className="dashboard-layout" id="overview">

      {/* Mobile backdrop */}
      {menuOpen && (
        <button
          className="sidebar-backdrop"
          onClick={closeMenu}
          aria-label="Close navigation menu"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>

        <div className="dashboard-brand">
          <div className="brand-icon">
            <Briefcase size={22} />
          </div>

          <div>
            <h2>
              HireSense <span>AI</span>
            </h2>
            <small>Career workspace</small>
          </div>

          <button
            className="sidebar-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <p className="sidebar-label">WORKSPACE</p>

        <nav className="sidebar-nav">
          <a
            className="nav-item active"
            href="#overview"
            onClick={closeMenu}
          >
            <LayoutDashboard size={19} />
            <span>Overview</span>
          </a>

          <a
            className="nav-item"
            href="#profile"
            onClick={closeMenu}
          >
            <User size={19} />
            <span>My Profile</span>
          </a>

          <button
            className="nav-item"
            onClick={() => {
              closeMenu();
              navigate("/resume-analyzer");
            }}
          >
            <FileText size={19} />
            <span>My Resume</span>
          </button>

          <button
            className="nav-item nav-disabled"
            type="button"
            disabled
            title="Job discovery is not available yet"
          >
            <Search size={19} />
            <span>Find Jobs</span>
            <small>Soon</small>
          </button>

          <button
            className="nav-item nav-disabled"
            type="button"
            disabled
            title="Application tracking is not available yet"
          >
            <Briefcase size={19} />
            <span>Applications</span>
            <small>Soon</small>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <p className="sidebar-label">ACCOUNT</p>

          <button
            className="nav-item nav-disabled"
            type="button"
            disabled
            title="Settings are not available yet"
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>

          <div className="sidebar-user">
            <div className="sidebar-avatar">{initial}</div>
            <div className="sidebar-user-info">
              <strong>{fullName}</strong>
              <span>{user?.role || "Candidate"}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">

        {/* Top header */}
        <header className="dashboard-header">
          <div className="dashboard-heading">
            <button
              className="mobile-menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <span className="dashboard-eyebrow">
                YOUR WORKSPACE
              </span>
              <h1>Overview</h1>
              <p>Manage your resume and career progress.</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="account-status">
              <span className="status-dot" />
              Account active
            </div>

            <div className="header-avatar" title={fullName}>
              {initial}
            </div>
          </div>
        </header>

        {/* Welcome banner */}
        <section className="welcome-section">
          <div className="welcome-content">
            <span className="welcome-tag">
              <Sparkles size={15} />
              YOUR AI CAREER ASSISTANT
            </span>

            <h2>
              Welcome back, {firstName}!
            </h2>

            <p>
              Build a stronger resume, understand your skills and
              take the next step in your career with HireSense AI.
            </p>

            <button
              className="welcome-button"
              onClick={() => navigate("/resume-analyzer")}
            >
              Analyse My Resume
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="welcome-art" aria-hidden="true">
            <div className="welcome-art-circle">
              <Sparkles size={57} />
            </div>
            <div className="welcome-art-label">
              <ShieldCheck size={15} />
              Smart Resume Insights
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Your activity</h2>
              <p>A quick overview of your workspace.</p>
            </div>
          </div>

          <div className="stats-grid">
            {stats.map((item) => (
              <div className="stat-card" key={item.title}>
                <div className={`stat-icon ${item.color}`}>
                  {item.icon}
                </div>

                <div className="stat-details">
                  <span>{item.title}</span>
                  <h3>{item.value}</h3>
                  <small>{item.description}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main dashboard panels */}
        <section className="dashboard-content">

          {/* Resume analyzer */}
          <div className="content-card resume-card">
            <div className="content-card-heading">
              <div>
                <span className="card-eyebrow">GET STARTED</span>
                <h2>Resume Analyzer</h2>
                <p>
                  Get useful insights to improve your resume.
                </p>
              </div>

              <div className="heading-icon">
                <Sparkles size={22} />
              </div>
            </div>

            <div className="upload-area">
              <div className="upload-icon">
                <Upload size={29} />
              </div>

              <h3>Ready to improve your resume?</h3>

              <p>
                Upload your PDF or DOCX resume and explore your
                skills, writing patterns and improvement suggestions.
              </p>

              <button
                className="primary-button"
                onClick={() => navigate("/resume-analyzer")}
              >
                <Upload size={17} />
                Upload & Analyse Resume
              </button>

              <span className="upload-hint">
                Your resume is processed through your account.
              </span>
            </div>
          </div>

          {/* Account information */}
          <div className="content-card profile-card" id="profile">
            <div className="content-card-heading">
              <div>
                <span className="card-eyebrow">YOUR ACCOUNT</span>
                <h2>Profile Information</h2>
              </div>

              <div className="heading-icon">
                <User size={21} />
              </div>
            </div>

            <div className="profile-details">
              <div className="profile-avatar">
                {initial}
              </div>

              <h3>{fullName}</h3>
              <p className="profile-email">{user?.email}</p>

              <span className="role-badge">
                {user?.role || "Candidate"}
              </span>
            </div>

            <div className="profile-divider" />

            <div className="profile-status">
              <div className="profile-status-icon">
                <CheckCircle size={18} />
              </div>

              <div>
                <strong>Account ready</strong>
                <p>
                  Your account is active. Start by analysing your resume.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Getting started */}
        <section className="getting-started-card">
          <div className="getting-started-icon">
            <Clock size={21} />
          </div>

          <div className="getting-started-content">
            <h2>Make the most of HireSense AI</h2>
            <p>
              Begin with your resume analysis. Review your skills,
              writing patterns and recommendations to improve your profile.
            </p>
          </div>

          <button
            className="text-action-button"
            onClick={() => navigate("/resume-analyzer")}
          >
            Get started
            <ArrowUpRight size={17} />
          </button>
        </section>

        <footer className="dashboard-footer">
          <span>© {new Date().getFullYear()} HireSense AI</span>
          <span>Designed to support your career journey.</span>
        </footer>

      </main>
    </div>
  );
}

export default Dashboard;
