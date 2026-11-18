
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Code2,
  Target,
  Brain,
  RefreshCw,
  CheckCircle2,
  Layers3,
  Lightbulb,
  AlertCircle,
} from "lucide-react";

import api from "../service/api";
import "./ResumeAnalysis.css";

function ResumeAnalysis() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeResume = async () => {
    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const response = await api.post(`/resumes/${resumeId}/analyze`);
      setAnalysis(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to analyse resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const extractedSkills = analysis?.extracted_skills || {};
  const categories = Object.entries(extractedSkills);
  const totalSkills = analysis?.total_skills ?? 0;

  const categoryIcons = [Code2, Layers3, Target, Lightbulb];

  return (
    <main className="analysis-page">
      <div className="analysis-shell">
        <button
          className="analysis-back"
          onClick={() => navigate("/candidate/dashboard")}
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <header className="analysis-hero">
          <div className="analysis-hero-icon">
            <Sparkles size={25} />
          </div>
          <div>
            <span className="analysis-eyebrow">HIRESENSE AI · RESUME TOOLS</span>
            <h1>AI Resume Analysis</h1>
            <p>
              Discover your technical skills and understand the strengths
              already present in your resume.
            </p>
          </div>
        </header>

        {!analysis && (
          <section className="analysis-start-card">
            <div className="analysis-start-icon">
              <FileText size={28} />
            </div>
            <div className="analysis-start-copy">
              <span className="analysis-card-label">SKILL EXTRACTION</span>
              <h2>Ready to analyse your resume?</h2>
              <p>
                Your resume will be checked for technical skills and
                organized into categories, making your skill set easier
                to review.
              </p>
            </div>
            <button
              className="analysis-primary-button"
              onClick={analyzeResume}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={17} className="analysis-spin" />
                  Analysing...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Analyse My Resume
                </>
              )}
            </button>

            {error && (
              <div className="analysis-alert" role="alert">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
          </section>
        )}

        {analysis && (
          <>
            <section className="analysis-summary-grid">
              <article className="analysis-summary-card analysis-total-card">
                <div className="analysis-summary-icon">
                  <Code2 size={22} />
                </div>
                <span>Total skills detected</span>
                <strong>{totalSkills}</strong>
                <small>Skills identified in your resume</small>
              </article>

              <article className="analysis-summary-card">
                <div className="analysis-summary-icon">
                  <Layers3 size={22} />
                </div>
                <span>Skill categories</span>
                <strong>{categories.length}</strong>
                <small>Different skill groups found</small>
              </article>

              <article className="analysis-summary-card analysis-file-card">
                <div className="analysis-summary-icon">
                  <FileText size={22} />
                </div>
                <span>Analysed resume</span>
                <strong className="analysis-filename">
                  {analysis.filename || "Uploaded resume"}
                </strong>
                <small>Source document</small>
              </article>
            </section>

            <section className="analysis-skills-section">
              <div className="analysis-section-heading">
                <div>
                  <span className="analysis-card-label">YOUR SKILL PROFILE</span>
                  <h2>Extracted Skills</h2>
                  <p>
                    Review the technical skills detected in each category.
                  </p>
                </div>
                <span className="analysis-count-badge">
                  {totalSkills} skills
                </span>
              </div>

              {categories.length > 0 ? (
                <div className="analysis-skills-grid">
                  {categories.map(([category, skills], index) => {
                    const CategoryIcon =
                      categoryIcons[index % categoryIcons.length];

                    return (
                      <article className="analysis-skill-card" key={category}>
                        <div className="analysis-skill-heading">
                          <div className="analysis-skill-icon">
                            <CategoryIcon size={20} />
                          </div>
                          <div>
                            <h3>
                              {category.replaceAll("_", " ")}
                            </h3>
                            <span>
                              {skills.length}{" "}
                              {skills.length === 1 ? "skill" : "skills"}
                            </span>
                          </div>
                        </div>

                        {skills.length > 0 ? (
                          <div className="analysis-skill-tags">
                            {skills.map((skill) => (
                              <span key={skill}>{skill}</span>
                            ))}
                          </div>
                        ) : (
                          <p className="analysis-empty">
                            No skills detected in this category.
                          </p>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="analysis-empty-state">
                  <FileText size={26} />
                  <h3>No skill categories found</h3>
                  <p>
                    Try analysing another resume with more detailed skills
                    and project information.
                  </p>
                </div>
              )}
            </section>

            <section className="analysis-next-step">
              <div className="analysis-next-icon">
                <Lightbulb size={22} />
              </div>
              <div>
                <h3>Continue improving your resume</h3>
                <p>
                  Compare your skills with a job description or review
                  your writing patterns.
                </p>
              </div>
            </section>

            <section className="analysis-actions">
              <button
                className="analysis-action-button analysis-job-button"
                onClick={() => navigate(`/job-matcher/${resumeId}`)}
              >
                <Target size={18} />
                Check Job Match
              </button>

              <button
                className="analysis-action-button analysis-ai-button"
                onClick={() =>
                  navigate(`/ai-resume-analysis/${resumeId}`)
                }
              >
                <Brain size={18} />
                Analyse Writing Patterns
              </button>

              <button
                className="analysis-action-button analysis-retry-button"
                onClick={analyzeResume}
                disabled={loading}
              >
                <RefreshCw
                  size={17}
                  className={loading ? "analysis-spin" : ""}
                />
                {loading ? "Analysing..." : "Analyse Again"}
              </button>
            </section>

            {error && (
              <div className="analysis-alert" role="alert">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default ResumeAnalysis;
