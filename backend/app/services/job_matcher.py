
from app.services.skill_extractor import (
    extract_skills,
    get_all_skills
)


def match_resume_with_job(
    resume_text: str,
    job_description: str
) -> dict:

    if not resume_text or not resume_text.strip():
        raise ValueError("Resume text cannot be empty.")

    if not job_description or not job_description.strip():
        raise ValueError("Job description cannot be empty.")

    # Extract skills from resume
    resume_skills_by_category = extract_skills(resume_text)

    # Extract skills from job description
    job_skills_by_category = extract_skills(job_description)

    resume_skills = set(get_all_skills(resume_skills_by_category))
    job_skills = set(get_all_skills(job_skills_by_category))

    # Find matching and missing skills
    matched_skills = sorted(resume_skills.intersection(job_skills))
    missing_skills = sorted(job_skills - resume_skills)

    # Calculate matching percentage
    total_required = len(job_skills)

    if total_required == 0:
        match_percentage = 0
    else:
        match_percentage = round(
            (len(matched_skills) / total_required) * 100,
            2
        )

    return {
        "match_percentage": match_percentage,
        "total_resume_skills": len(resume_skills),
        "total_required_skills": total_required,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }
