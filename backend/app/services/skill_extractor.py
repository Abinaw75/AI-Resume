
import re


SKILL_CATEGORIES = {
    "programming_languages": [
        "Python",
        "JavaScript",
        "Java",
        "C",
        "C++",
        "C#",
        "PHP",
        "Kotlin",
        "Dart",
        "Go",
        "R"
    ],

    "frontend": [
        "HTML",
        "CSS",
        "React",
        "React.js",
        "Angular",
        "Vue.js",
        "Next.js",
        "Bootstrap",
        "Tailwind CSS"
    ],

    "backend": [
        "Node.js",
        "Express.js",
        "FastAPI",
        "Flask",
        "Django",
        "Spring Boot",
        "REST API"
    ],

    "databases": [
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "Firebase",
        "Supabase",
        "SQLite",
        "Oracle",
        "Redis"
    ],

    "data_science": [
        "Pandas",
        "NumPy",
        "Matplotlib",
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing",
        "NLP",
        "Power BI",
        "Tableau",
        "Scikit-learn"
    ],

    "cloud_devops": [
        "AWS",
        "Azure",
        "Google Cloud",
        "Docker",
        "Kubernetes",
        "Git",
        "GitHub",
        "Linux",
        "CI/CD"
    ],

    "mobile_development": [
        "Flutter",
        "Android Studio",
        "React Native"
    ]
}


def contains_skill(text: str, skill: str) -> bool:
    """
    Check whether a skill appears as a separate term
    in the resume text.
    """

    pattern = (
        r"(?<![a-z0-9])"
        + re.escape(skill.lower())
        + r"(?![a-z0-9])"
    )

    return re.search(pattern, text.lower()) is not None


def extract_skills(resume_text: str) -> dict:
    """
    Extract recognized technical skills from resume text.
    """

    if not isinstance(resume_text, str) or not resume_text.strip():
        return {
            category: []
            for category in SKILL_CATEGORIES
        }

    extracted_skills = {}

    for category, skills in SKILL_CATEGORIES.items():

        matched_skills = []

        for skill in skills:

            if contains_skill(resume_text, skill):
                matched_skills.append(skill)

        extracted_skills[category] = matched_skills

    return extracted_skills


def get_all_skills(extracted_skills: dict) -> list:
    """
    Return all extracted skills as a single list.
    """

    all_skills = []

    for skills in extracted_skills.values():
        all_skills.extend(skills)

    return all_skills
