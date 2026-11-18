
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Upload,
  FileText,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

import api from "../service/api";
import "./ResumeUpload.css";

function ResumeUpload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    setMessage("");
    setError("");

    if (!selectedFile) return;

    const extension = selectedFile.name
      .split(".")
      .pop()
      .toLowerCase();

    const allowedExtensions = ["pdf", "docx"];

    if (!allowedExtensions.includes(extension)) {
      setError("Please select a valid PDF or DOCX file.");
      setFile(null);
      e.target.value = "";
      return;
    }

    // Maximum file size: 5 MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must not exceed 5 MB.");
      setFile(null);
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  // Upload resume and navigate to analysis page
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(
        "/resumes/upload",
        formData
      );

      const resumeId = response.data.resume_id;

      if (!resumeId) {
        throw new Error(
          "Resume uploaded, but resume ID was not returned."
        );
      }

      setMessage(
        "Resume uploaded successfully! Starting analysis..."
      );

      // Navigate to the analysis page
      navigate(`/resume-analysis/${resumeId}`);

    } catch (err) {
      console.error(
        "Resume upload error:",
        err.response?.data || err
      );

      const detail = err.response?.data?.detail;

      let errorMessage =
        err.message ||
        "Unable to upload resume. Please try again.";

      if (typeof detail === "string") {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail
          .map((item) => item.msg || "Invalid upload data")
          .join(", ");
      }

      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-page">

      {/* Back to dashboard */}
      <button
        className="back-button"
        onClick={() => navigate("/candidate/dashboard")}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="resume-upload-card">

        {/* Page heading */}
        <div className="resume-heading">

          <div className="resume-icon">
            <FileText size={30} />
          </div>

          <h1>Upload Your Resume</h1>

          <p>
            Upload your resume to begin your AI-powered
            career analysis.
          </p>

        </div>

        {/* File selection */}
        <label
          htmlFor="resume-file"
          className="upload-dropzone"
        >
          <Upload size={42} />

          <h3>
            {file ? file.name : "Choose your resume"}
          </h3>

          <p>Click here to browse your files</p>

          <span>PDF or DOCX · Maximum 5 MB</span>

          <input
            id="resume-file"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            hidden
          />
        </label>

        {/* Selected file information */}
        {file && (
          <div className="selected-file">

            <FileText size={20} />

            <div>
              <strong>{file.name}</strong>

              <p>
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <CheckCircle color="#22c55e" />

          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="upload-error">
            {error}
          </div>
        )}

        {/* Success message */}
        {message && (
          <div className="upload-success">
            <CheckCircle size={20} />
            {message}
          </div>
        )}

        {/* Upload button */}
        <button
          className="upload-submit"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? "Uploading..." : "Upload & Analyse Resume"}
        </button>

      </div>
    </div>
  );
}

export default ResumeUpload;
