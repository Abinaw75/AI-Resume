
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Login from "./page/login";
import Register from "./page/register";
import Dashboard from "./page/Dashboard";
import ResumeUpload from "./page/ResumeUpload";
import ResumeAnalysis from "./page/ResumeAnalysis";
import JobMatcher from "./page/JobMatcher";

import ProtectedRoute from "./compounds/ProtectedRoute";
import AIResumeAnalysis from "./page/AIResumeAnalysis";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* Authentication */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Candidate Dashboard */}
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute allowedRole="candidate">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Dashboard */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute allowedRole="recruiter">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Resume Upload */}
          <Route
            path="/resume-analyzer"
            element={
              <ProtectedRoute allowedRole="candidate">
                <ResumeUpload />
              </ProtectedRoute>
            }
          />

          {/* Resume Analysis Results */}
          <Route
            path="/resume-analysis/:resumeId"
            element={
              <ProtectedRoute allowedRole="candidate">
                <ResumeAnalysis />
              </ProtectedRoute>
            }
          />

          {/* Job Matching */}
          <Route
            path="/job-matcher/:resumeId"
            element={
              <ProtectedRoute allowedRole="candidate">
                <JobMatcher />
              </ProtectedRoute>
            }
          />
          {/* AI Resume Writing Analysis */}
          <Route
            path="/ai-resume-analysis/:resumeId"
            element={
              <ProtectedRoute allowedRole="candidate">
                <AIResumeAnalysis />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized */}
          <Route
            path="/unauthorized"
            element={
              <h2>
                You are not authorized to access this page.
              </h2>
            }
          />

          {/* Unknown routes */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
