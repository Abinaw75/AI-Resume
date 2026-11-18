
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Brain,
  CheckCircle,
  AlertCircle,
  FileText,
  RefreshCw,
  Lightbulb,
  Activity,
  Sparkles,
  BarChart3,
} from "lucide-react";

import api from "../service/api";
import "./AIResumeAnalysis.css";

function AIResumeAnalysis() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeResume = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await api.post(
        `/resumes/${resumeId}/ai-writing-analysis`
      );

      setResult(response.data);
    } catch (err) {
      console.error(
        "AI resume analysis error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to analyse resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const analysis = result?.analysis;
  const indicators = analysis?.indicators || {};
  const score = Number(analysis?.ai_like_writing_score ?? 0);

  const getSuggestions = () => {
    const suggestions = [];

    if (indicators.generic_resume_phrases?.count > 0) {
      suggestions.push(
        "Replace generic professional expressions with specific achievements and measurable results."
      );
    }

    if (indicators.repeated_phrases?.count > 0) {
      suggestions.push(
        "Review repeated three-word phrases and avoid unnecessary repetition."
      );
    }

    if (indicators.repeated_sentence_openings?.count > 0) {
      suggestions.push(
        "Vary the beginning of sentences to make descriptions more natural."
      );
    }

    if (
      indicators.sentence_length_analysis?.consistency ===
      "Very consistent"
    ) {
      suggestions.push(
        "Use a natural mix of short and detailed sentences where appropriate."
      );
    }

    if (
      indicators.vocabulary_variation?.unique_word_ratio < 0.35
    ) {
      suggestions.push(
        "Use more precise vocabulary when describing your responsibilities and projects."
      );
    }

    if (suggestions.length === 0) {
      suggestions.push(
        "Keep describing your real contributions, technical decisions and measurable project outcomes."
      );
    }

    return suggestions;
  };

  const summaryCards = [
    {
      title: "Resume Words",
      value: analysis?.word_count ?? 0,
      icon: <FileText size={22} />,
      color: "primary",
    },
    {
      title: "Repeated Phrases",
      value: indicators.repeated_phrases?.count ?? 0,
      icon: <Activity size={22} />,
      color: "warning",
    },
    {
      title: "Generic Expressions",
      value: indicators.generic_resume_phrases?.count ?? 0,
      icon: <AlertCircle size={22} />,
      color: "danger",
    },
    {
      title: "Repeated Openings",
      value: indicators.repeated_sentence_openings?.count ?? 0,
      icon: <CheckCircle size={22} />,
      color: "success",
    },
  ];

  return (
    <div className="ai-resume-page">
      <div className="container py-4 py-lg-5">

        {/* Navigation */}
        <button
          className="btn btn-outline-secondary btn-sm rounded-pill px-3 mb-4"
          onClick={() => navigate(`/resume-analysis/${resumeId}`)}
        >
          <ArrowLeft size={16} className="me-2" />
          Back to Resume Analysis
        </button>

        {/* Header */}
        <div className="ai-dashboard-header text-center mb-5">
          <div className="ai-header-icon mx-auto mb-3">
            <Brain size={32} />
          </div>

          <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
            <span className="badge text-bg-primary rounded-pill">
              <Sparkles size={12} className="me-1" />
              Writing Insights
            </span>
          </div>

          <h1 className="display-6 fw-bold mb-2">
            AI Resume Writing Analysis
          </h1>

          <p className="text-secondary mx-auto mb-0">
            Understand your resume writing patterns and discover
            opportunities to improve clarity, originality and impact.
          </p>
        </div>

        {/* Initial analysis screen */}
        {!result && (
          <div className="card ai-main-card border-0 shadow-sm mx-auto">
            <div className="card-body text-center p-4 p-md-5">
              <div className="ai-start-icon mx-auto mb-3">
                <FileText size={34} />
              </div>

              <h2 className="h4 fw-bold mb-3">
                Analyse Your Resume Writing
              </h2>

              <p className="text-secondary mx-auto mb-4 ai-description">
                Our experimental writing analysis engine checks repeated
                phrases, sentence structures, generic expressions and
                vocabulary variation.
              </p>

              <button
                className="btn btn-primary btn-lg rounded-pill px-4"
                onClick={analyzeResume}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw
                      size={18}
                      className="me-2 ai-spin"
                    />
                    Analysing Resume...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="me-2" />
                    Start AI Writing Analysis
                  </>
                )}
              </button>

              {error && (
                <div className="alert alert-danger mt-4 mb-0">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="ai-results">

            {analysis.status === "insufficient_text" ? (
              <div className="card border-0 shadow-sm ai-main-card">
                <div className="card-body text-center p-4 p-md-5">
                  <div className="ai-warning-icon mx-auto mb-3">
                    <AlertCircle size={32} />
                  </div>

                  <h2 className="h4 fw-bold">
                    Insufficient Resume Text
                  </h2>

                  <p className="text-secondary">
                    {analysis.message}
                  </p>

                  <span className="badge text-bg-warning">
                    Extracted words: {analysis.word_count}
                  </span>
                </div>
              </div>
            ) : (
              <>
                {/* Score section */}
                <div className="card border-0 shadow-sm ai-score-panel mb-4">
                  <div className="card-body p-4 p-md-5">
                    <div className="row align-items-center g-4">

                      <div className="col-md-7 text-center text-md-start">
                        <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-3">
                          <div className="ai-small-icon">
                            <Brain size={21} />
                          </div>

                          <span className="text-secondary fw-semibold">
                            AI-like Writing Score
                          </span>
                        </div>

                        <div className="ai-score-number mb-2">
                          {score}
                          <span>/100</span>
                        </div>

                        <h2 className="h5 fw-bold mb-2">
                          {analysis.interpretation}
                        </h2>

                        <p className="text-secondary mb-0">
                          This score measures writing patterns, not the
                          probability of AI authorship.
                        </p>
                      </div>

                      <div className="col-md-5">
                        <div
                          className="progress ai-score-progress"
                          role="progressbar"
                          aria-label="AI-like writing score"
                          aria-valuenow={Math.min(100, Math.max(0, score))}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            className="progress-bar ai-score-bar"
                            style={{
                              width: `${Math.min(100, Math.max(0, score))}%`,
                            }}
                          />
                        </div>

                        <div className="d-flex justify-content-between small text-secondary mt-2">
                          <span>0</span>
                          <span>50</span>
                          <span>100</span>
                        </div>

                        <div className="alert alert-light border mt-4 mb-0 small">
                          <AlertCircle
                            size={16}
                            className="me-2 text-primary"
                          />
                          Treat this as an experimental writing-pattern
                          indicator, not proof of AI-generated content.
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Summary cards */}
                <div className="row g-3 mb-4">
                  {summaryCards.map((item) => (
                    <div className="col-6 col-lg-3" key={item.title}>
                      <div className="card ai-summary-card h-100 border-0 shadow-sm">
                        <div className="card-body p-3 p-md-4">
                          <div className={`ai-summary-icon ${item.color}`}>
                            {item.icon}
                          </div>

                          <p className="text-secondary small mb-2 mt-3">
                            {item.title}
                          </p>

                          <h3 className="h2 fw-bold mb-0">
                            {item.value}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Writing indicators */}
                <section className="card ai-main-card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <BarChart3 className="text-primary" size={23} />
                      <h2 className="h5 fw-bold mb-0">
                        Writing Pattern Indicators
                      </h2>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <IndicatorCard
                          title="Repeated Phrases"
                          details={indicators.repeated_phrases}
                          label="Repeated phrases found"
                        />
                      </div>

                      <div className="col-md-6">
                        <IndicatorCard
                          title="Repeated Sentence Openings"
                          details={indicators.repeated_sentence_openings}
                          label="Repeated openings found"
                        />
                      </div>

                      <div className="col-md-6">
                        <div className="ai-indicator-card h-100">
                          <h3 className="h6 fw-bold mb-3">
                            Sentence Length Variation
                          </h3>

                          <p className="small text-secondary mb-2">
                            Average sentence length
                          </p>

                          <h4 className="h3 fw-bold">
                            {indicators.sentence_length_analysis?.average ?? "N/A"}
                            <span className="small text-secondary ms-1">
                              words
                            </span>
                          </h4>

                          <p className="small text-secondary mb-2">
                            Variation:{" "}
                            {indicators.sentence_length_analysis?.variation ?? "N/A"}
                          </p>

                          <span className="badge text-bg-light border">
                            {indicators.sentence_length_analysis?.consistency ?? "Unavailable"}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="ai-indicator-card h-100">
                          <h3 className="h6 fw-bold mb-3">
                            Vocabulary Variation
                          </h3>

                          <p className="small text-secondary mb-2">
                            Unique word ratio
                          </p>

                          <h4 className="h3 fw-bold">
                            {indicators.vocabulary_variation?.unique_word_ratio ?? "N/A"}
                          </h4>

                          <p className="small text-secondary mb-0">
                            Total words:{" "}
                            {indicators.vocabulary_variation?.total_words ?? "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Generic phrases */}
                <section className="card ai-main-card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <AlertCircle className="text-warning" size={22} />

                      <h2 className="h5 fw-bold mb-0">
                        Flagged Generic Phrases
                      </h2>
                    </div>

                    {indicators.generic_resume_phrases?.examples?.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {indicators.generic_resume_phrases.examples.map(
                          (phrase) => (
                            <span
                              className="badge ai-phrase-badge"
                              key={phrase}
                            >
                              {phrase}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-secondary small mb-0">
                        No predefined generic phrases were detected.
                      </p>
                    )}

                    <p className="text-secondary small mt-3 mb-0">
                      These expressions are common in resumes and are not
                      evidence of AI authorship.
                    </p>
                  </div>
                </section>

                {/* Suggestions */}
                <section className="card ai-main-card border-0 shadow-sm mb-4">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <Lightbulb className="text-warning" size={23} />

                      <h2 className="h5 fw-bold mb-0">
                        Resume Improvement Suggestions
                      </h2>
                    </div>

                    <div className="d-flex flex-column gap-3">
                      {getSuggestions().map((suggestion, index) => (
                        <div className="ai-suggestion-item" key={index}>
                          <div className="ai-suggestion-icon">
                            <CheckCircle size={19} />
                          </div>

                          <p className="mb-0">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Disclaimer */}
                <div className="alert alert-warning d-flex align-items-start gap-2 mb-4">
                  <AlertCircle size={20} className="flex-shrink-0 mt-1" />

                  <div className="small">
                    <strong>Important note</strong>
                    <p className="mb-0 mt-1">
                      {analysis.disclaimer}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Analyse again */}
            <div className="text-center mb-4">
              <button
                className="btn btn-primary rounded-pill px-4 py-2"
                onClick={analyzeResume}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw size={17} className="me-2 ai-spin" />
                    Analysing...
                  </>
                ) : (
                  <>
                    <RefreshCw size={17} className="me-2" />
                    Analyse Again
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function IndicatorCard({ title, details, label }) {
  return (
    <div className="ai-indicator-card h-100">
      <h3 className="h6 fw-bold mb-3">{title}</h3>

      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="small text-secondary">{label}</span>

        <span className="badge text-bg-primary rounded-pill">
          {details?.count ?? 0}
        </span>
      </div>

      {details?.examples?.length > 0 ? (
        <ul className="ai-example-list mb-0">
          {details.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      ) : (
        <p className="small text-secondary mb-0">
          No repeated examples detected.
        </p>
      )}
    </div>
  );
}

export default AIResumeAnalysis;
