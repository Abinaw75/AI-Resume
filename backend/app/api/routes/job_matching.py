
from uuid import UUID
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.job_matching import JobMatching

from app.api.routes.auth import get_current_user
from app.schemas.job_matching import JobMatchingRequest

from app.services.job_matcher import match_resume_with_job
from app.services.skill_recommender import (
    generate_skill_recommendations
)


router = APIRouter(
    prefix="/api/resumes",
    tags=["Job Matching"]
)


@router.post("/{resume_id}/match-job")
def match_job(
    resume_id: UUID,
    request: JobMatchingRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # 1. Verify candidate role
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can use job matching"
        )

    # 2. Find the candidate's resume
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

    if not resume.extracted_text:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Resume text is not available"
        )

    try:
        # 3. Compare resume with job description
        result = match_resume_with_job(
            resume.extracted_text,
            request.job_description
        )

        # 4. Generate skill gap recommendations
        recommendations = generate_skill_recommendations(
            result["missing_skills"]
        )

        # 5. Save matching result
        matching = JobMatching(
            resume_id=resume.id,
            job_description=request.job_description,
            match_percentage=Decimal(
                str(result["match_percentage"])
            ),
            matched_skills=result["matched_skills"],
            missing_skills=result["missing_skills"]
        )

        db.add(matching)
        db.commit()
        db.refresh(matching)

        # 6. Return matching report and recommendations
        return {
            "message": "Job matching completed successfully",
            "matching_id": str(matching.id),
            "resume_id": str(resume.id),
            "filename": resume.original_filename,

            "match_percentage": float(
                matching.match_percentage
            ),

            "total_resume_skills": result["total_resume_skills"],
            "total_required_skills": result["total_required_skills"],

            "matched_skills": matching.matched_skills,
            "missing_skills": matching.missing_skills,

            "skill_recommendations": recommendations,

            "created_at": matching.created_at
        }

    except Exception as error:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Job matching failed. Check backend logs."
        ) from error
