
import logging
from uuid import uuid4
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.models.resume import Resume
from app.api.routes.auth import get_current_user

from app.services.storage import upload_resume, delete_resume
from app.services.resume_parser import extract_resume_text


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/resumes",
    tags=["Resumes"]
)

MAX_FILE_SIZE = 5 * 1024 * 1024

ALLOWED_TYPES = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_candidate_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # 1. Check candidate role
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=403,
            detail="Only candidates can upload resumes"
        )

    # 2. Validate filename and extension
    original_filename = Path(file.filename or "").name
    extension = Path(original_filename).suffix.lower()

    if extension not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed"
        )

    expected_type = ALLOWED_TYPES[extension]

    # 3. Validate MIME type
    if file.content_type != expected_type:
        raise HTTPException(
            status_code=400,
            detail="File content type does not match the file extension"
        )

    # 4. Read file content
    content = await file.read(MAX_FILE_SIZE + 1)

    if not content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty"
        )

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="File size must not exceed 5 MB"
        )

    # 5. Validate file signature
    if extension == ".pdf" and not content.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=400,
            detail="Invalid PDF file"
        )

    if extension == ".docx" and not content.startswith(b"PK"):
        raise HTTPException(
            status_code=400,
            detail="Invalid DOCX file"
        )

    # 6. Extract resume text
    try:
        extracted_text = extract_resume_text(
            content,
            original_filename
        )

    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error)
        ) from error

    # 7. Generate unique Storage path
    file_id = str(uuid4())

    storage_path = (
        f"{current_user.id}/{file_id}{extension}"
    )

    storage_uploaded = False

    try:
        # 8. Upload original file to Supabase Storage
        upload_resume(
            storage_path,
            content,
            expected_type
        )

        storage_uploaded = True

        # 9. Create database record
        resume = Resume(
            user_id=current_user.id,
            original_filename=original_filename,
            file_path=storage_path,
            mime_type=expected_type,
            file_size=len(content),
            extracted_text=extracted_text
        )

        # 10. Save record to PostgreSQL
        db.add(resume)
        db.commit()
        db.refresh(resume)

        logger.info(
            "Resume uploaded and parsed successfully: %s",
            resume.id
        )

        # 11. Return upload response
        return {
            "message": "Resume uploaded and text extracted successfully",
            "resume_id": str(resume.id),
            "filename": resume.original_filename,
            "file_size": resume.file_size,
            "text_extracted": True,
            "extracted_characters": len(extracted_text),
            "uploaded_at": resume.uploaded_at
        }

    except Exception as error:
        db.rollback()

        logger.exception("Resume upload failed")

        # Remove Storage file if database saving fails
        if storage_uploaded:
            try:
                delete_resume(storage_path)
            except Exception:
                logger.exception(
                    "Failed to clean up uploaded resume"
                )

        raise HTTPException(
            status_code=500,
            detail="Resume upload failed. Check backend logs."
        ) from error

    finally:
        await file.close()
