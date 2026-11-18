
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Target,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Code2,
  Lightbulb,
  LoaderCircle,
  FileText,
  Layers3,
  TrendingUp,
  Sparkles,
} from "lucide-react";

import api from "../service/api";
import "./JobMatcher.css";

function JobMatcher() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleMatch = async () => {
    if (jobDescription.trim().length < 20) {
      setError("Please enter a job description with at least 20 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await api.post(
        `/resumes/${resumeId}/match-job`,
        { job_description: jobDescription }
      );

      setResult(response.data);
    } catch (err) {
      console.error("Job matching error:", err.response?.data || err);

      setError(
        err.response?.data?.detail ||
          "Unable to calculate job match. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const score = Number(result?.match_percentage || 0);
  const safeScore = Math.min(100, Math.max(0, score));

  const matchedSkills = result?.matched_skills || [];
  const missingSkills = result?.missing_skills || [];
  const recommendations = result?.skill_recommendations || [];

  return (
    <main className="matcher-page">
      <div className="matcher-shell">
        <button
          className="matcher-back"
          onClick={() => navigate(`/resume-analysis/${resumeId}`)}
        >
          <ArrowLeft size={17} />
          Back to Resume Analysis
        </button>

        <header className="matcher-hero">
          <div className="matcher-hero-icon">
            <Target size={26} />
          </div>
          <div>
            <span className="matcher-eyebrow">
              HIRESENSE AI · CAREER TOOLS
            </span>
            <h1>Job Description Matcher</h1>
            <p>
              Understand how your current skills compare with the
              requirements of your target role.
            </p>
          </div>
        </header>

        <section className="matcher-input-card">
          <div className="matcher-input-heading">
            <div>
              <span className="matcher-card-label">STEP 1 · JOB DETAILS</span>
              <h2>Enter the job description</h2>
              <p>
                Paste the job description below to compare its required
                skills with your resume.
              </p>
            </div>
            <div className="matcher-heading-icon">
              <FileText size={22} />
            </div>
          </div>

          <label htmlFor="job-description" className="matcher-label">
            Job description
          </label>

          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (error) setError("");
            }}
            placeholder={
              "Paste the complete job description here...\n\nInclude responsibilities, required skills, qualifications and experience."
            }
            rows={9}
            maxLength={15000}
          />

          <div className="matcher-input-footer">
            <span>
              {jobDescription.length.toLocaleString()} / 15,000 characters
            </span>
            <span className="matcher-minimum">
              Minimum 20 characters
            </span>
          </div>

          {error && (
            <div className="matcher-alert" role="alert">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="matcher-submit-row">
            <p>
              <ShieldNote />
              Your resume is compared with the job description you provide.
            </p>

            <button
              className="matcher-primary-button"
              onClick={handleMatch}
              disabled={loading || jobDescription.trim().length < 20}
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="matcher-spin" />
                  Analysing...
                </>
              ) : (
                <>
                  <Target size={18} />
                  Analyse Job Match
                </>
              )}
            </button>
          </div>
        </section>

        {result && (
          <div className="matcher-results">
            <div className="matcher-results-heading">
              <div>
                <span className="matcher-card-label">
                  STEP 2 · YOUR RESULTS
                </span>
                <h2>Job match report</h2>
                <p>
                  Review your skill overlap and identify areas to improve.
                </p>
              </div>
              <span className="matcher-complete-badge">
                <CheckCircle2 size={15} />
                Analysis complete
              </span>
            </div>

            <section className="matcher-score-card">
              <div className="matcher-score-main">
                <div className="matcher-score-icon">
                  <TrendingUp size={22} />
                </div>
                <span>Resume match score</span>
                <strong>{score.toFixed(1)}%</strong>
                <p>
                  {matchedSkills.length} of{" "}
                  {result.total_required_skills ?? 0} required skills matched
                </p>
              </div>

              <div className="matcher-score-visual">
                <div
                  className="matcher-progress"
                  role="progressbar"
                  aria-label="Resume job match score"
                  aria-valuenow={safeScore}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="matcher-progress-fill"
                    style={{ width: `${safeScore}%` }}
                  />
                </div>
                <div className="matcher-progress-labels">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <div className="matcher-score-note">
                  <Sparkles size={17} />
                  <p>
                    This score represents detected skill overlap, not a
                    prediction of hiring success.
                  </p>
                </div>
              </div>
            </section>

            <section className="matcher-stats">
              <article className="matcher-stat-card">
                <div className="matcher-stat-icon">
                  <FileText size={20} />
                </div>
                <span>Resume skills</span>
                <strong>{result.total_resume_skills ?? 0}</strong>
              </article>

              <article className="matcher-stat-card">
                <div className="matcher-stat-icon">
                  <Layers3 size={20} />
                </div>
                <span>Required skills</span>
                <strong>{result.total_required_skills ?? 0}</strong>
              </article>

              <article className="matcher-stat-card">
                <div className="matcher-stat-icon matched">
                  <CheckCircle2 size={20} />
                </div>
                <span>Matched skills</span>
                <strong>{matchedSkills.length}</strong>
              </article>

              <article className="matcher-stat-card">
                <div className="matcher-stat-icon missing">
                  <AlertCircle size={20} />
                </div>
                <span>Missing skills</span>
                <strong>{missingSkills.length}</strong>
              </article>
            </section>

            <section className="matcher-skills-section">
              <div className="matcher-section-heading">
                <h2>Skill comparison</h2>
                <p>See which job requirements appear in your resume.</p>
              </div>

              <div className="matcher-skill-grid">
                <article className="matcher-skill-card">
                  <div className="matcher-skill-card-heading">
                    <div className="matcher-skill-heading-icon matched">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3>Matched skills</h3>
                      <span>{matchedSkills.length} found</span>
                    </div>
                  </div>

                  <div className="matcher-tags">
                    {matchedSkills.length > 0 ? (
                      matchedSkills.map((skill) => (
                        <span className="matched-tag" key={skill}>
                          <CheckCircle2 size={13} />
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="matcher-empty">
                        No matching skills detected.
                      </p>
                    )}
                  </div>
                </article>

                <article className="matcher-skill-card">
                  <div className="matcher-skill-card-heading">
                    <div className="matcher-skill-heading-icon missing">
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <h3>Missing skills</h3>
                      <span>{missingSkills.length} to review</span>
                    </div>
                  </div>

                  <div className="matcher-tags">
                    {missingSkills.length > 0 ? (
                      missingSkills.map((skill) => (
                        <span className="missing-tag" key={skill}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="matcher-empty">
                        No missing skills detected.
                      </p>
                    )}
                  </div>
                </article>
              </div>
            </section>

            <section className="matcher-roadmap">
              <div className="matcher-section-heading">
                <div className="matcher-roadmap-title">
                  <div className="matcher-roadmap-icon">
                    <Lightbulb size={21} />
                  </div>
                  <div>
                    <h2>Skill Improvement Roadmap</h2>
                    <p>
                      Learning suggestions based on your missing skills.
                    </p>
                  </div>
                </div>
              </div>

              {recommendations.length > 0 ? (
                <div className="matcher-recommendations">
                  {recommendations.map((item) => {
                    const priority = String(
                      item.priority || "medium"
                    ).toLowerCase();

                    return (
                      <article
                        className="matcher-recommendation-card"
                        key={item.skill}
                      >
                        <div className="matcher-recommendation-heading">
                          <h3>{item.skill}</h3>
                          <span
                            className={`matcher-priority ${priority}`}
                          >
                            {item.priority || "Medium"} priority
                          </span>
                        </div>

                        <p className="matcher-reason">{item.reason}</p>

                        <div className="matcher-learning-grid">
                          <div>
                            <h4>
                              <BookOpen size={17} />
                              Learning roadmap
                            </h4>
                            <ol>
                              {(item.learning_steps || []).map(
                                (step, index) => (
                                  <li key={index}>{step}</li>
                                )
                              )}
                            </ol>
                          </div>

                          <div className="matcher-project">
                            <h4>
                              <Code2 size={17} />
                              Suggested project
                            </h4>
                            <p>{item.project}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="matcher-success-state">
                  <CheckCircle2 size={27} />
                  <h3>No skill recommendations available</h3>
                  <p>
                    {missingSkills.length === 0
                      ? "No skill gaps were detected for this job description."
                      : "There are no learning recommendations for the detected skill gaps."}
                  </p>
                </div>
              )}
            </section>

            <div className="matcher-disclaimer">
              <AlertCircle size={17} />
              <p>
                This score measures detected skill overlap. Recommendations
                are learning suggestions and do not predict hiring decisions.
              </p>
            </div>

            <button
              className="matcher-again-button"
              onClick={() => {
                setResult(null);
                setError("");
              }}
            >
              <RefreshCw size={16} />
              Compare another job description
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function ShieldNote() {
  return <CheckCircle2 size={15} />;
}

export default JobMatcher;
