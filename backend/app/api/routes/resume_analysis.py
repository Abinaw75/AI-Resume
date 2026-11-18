
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.resume_analysis import ResumeAnalysis

from app.api.routes.auth import get_current_user

from app.services.skill_extractor import (
    extract_skills,
    get_all_skills
)


router = APIRouter(
    prefix="/api/resumes",
    tags=["Resume Analysis"]
)


@router.post("/{resume_id}/analyze")
def analyze_resume(
    resume_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # 1. Check candidate role
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can analyse resumes"
        )

    # 2. Find resume belonging to logged-in candidate
    resume = (
        db.query(Resume)
        .filter(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        )
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    # 3. Check extracted resume text
    if not resume.extracted_text or not resume.extracted_text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No extracted resume text found"
        )

    try:
        # 4. Extract categorized skills
        categorized_skills = extract_skills(
            resume.extracted_text
        )

        # 5. Get all extracted skills
        all_skills = get_all_skills(
            categorized_skills
        )

        # 6. Save analysis to database
        analysis = ResumeAnalysis(
            resume_id=resume.id,
            extracted_skills=categorized_skills,
            total_skills=len(all_skills)
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        # 7. Return analysis results
        return {
            "message": "Resume analysis completed successfully",
            "analysis_id": str(analysis.id),
            "resume_id": str(resume.id),
            "filename": resume.original_filename,
            "total_skills": analysis.total_skills,
            "extracted_skills": categorized_skills,
            "all_skills": all_skills,
            "created_at": analysis.created_at
        }

    except Exception as error:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Resume analysis failed. Check backend logs."
        ) from error
