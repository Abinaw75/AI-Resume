
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# API route imports
from app.api.routes.auth import router as auth_router
from app.api.routes.resumes import router as resumes_router
from app.api.routes.resume_analysis import router as resume_analysis_router
from app.api.routes.job_matching import router as job_matching_router

# AI Resume Detection route
from app.api.routes.ai_resume_analysis import (
    router as ai_resume_analysis_router
)


# Create FastAPI application
app = FastAPI(
    title="HireSense AI",
    description="AI-Powered Resume Analyzer and Job Matching System",
    version="1.0.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routers
app.include_router(auth_router)
app.include_router(resumes_router)
app.include_router(resume_analysis_router)
app.include_router(job_matching_router)

# Register AI Resume Detection
app.include_router(ai_resume_analysis_router)


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to HireSense AI API",
        "status": "Running"
    }


# Health check endpoint
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "application": "HireSense AI"
    }
