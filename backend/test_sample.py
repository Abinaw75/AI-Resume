
from app.services.job_matcher import match_resume_with_job

resume_text = """
Technical Skills:
Python, JavaScript, React, HTML, CSS,
Node.js, MySQL, MongoDB, Git
"""

job_description = """
We are looking for a Full Stack Developer.

Required skills:
Python, JavaScript, React, Node.js,
MongoDB, AWS, Docker, Git
"""

result = match_resume_with_job(
    resume_text,
    job_description
)

print("\nHIRE SENSE AI - JOB MATCHING")
print("=" * 40)

print("Match Percentage:", result["match_percentage"], "%")

print("\nMatched Skills:")
for skill in result["matched_skills"]:
    print("-", skill)

print("\nMissing Skills:")
for skill in result["missing_skills"]:
    print("-", skill)

print("\nTotal Resume Skills:", result["total_resume_skills"])
print("Required Skills:", result["total_required_skills"])
