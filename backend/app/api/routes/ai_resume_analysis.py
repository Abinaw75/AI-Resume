
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.resume import Resume
from app.api.routes.auth import get_current_user

from app.services.ai_resume_detector import analyze_ai_writing


router = APIRouter(
    prefix="/api/resumes",
    tags=["AI Resume Detection"]
)


@router.post("/{resume_id}/ai-writing-analysis")
def analyze_resume_writing(
    resume_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Candidate access check
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can analyse their resumes"
        )

    # 2. Retrieve the candidate's own resume
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

    # 3. Analyse writing patterns
    result = analyze_ai_writing(resume.extracted_text)

    # 4. Return analysis
    return {
        "message": "Resume writing analysis completed",
        "resume_id": str(resume.id),
        "filename": resume.original_filename,
        "analysis": result
    }
