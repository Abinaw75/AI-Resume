
SKILL_RECOMMENDATIONS = {
    "Docker": {
        "priority": "High",
        "reason": "Docker is used to package applications and their dependencies into containers.",
        "learning_steps": [
            "Understand containers and Docker images.",
            "Learn Docker commands and Dockerfiles.",
            "Build and run your first container.",
            "Learn Docker Compose."
        ],
        "project": "Containerize a Node.js application using Docker."
    },
    "AWS": {
        "priority": "High",
        "reason": "AWS skills are useful for deploying and managing cloud applications.",
        "learning_steps": [
            "Understand cloud computing fundamentals.",
            "Learn AWS IAM and EC2.",
            "Practise using Amazon S3.",
            "Deploy a simple application on AWS."
        ],
        "project": "Deploy a full-stack application using AWS."
    },
    "Kubernetes": {
        "priority": "Medium",
        "reason": "Kubernetes helps manage and scale containerized applications.",
        "learning_steps": [
            "Understand Kubernetes architecture.",
            "Learn Pods and Deployments.",
            "Practise Services and ConfigMaps.",
            "Deploy an application to a local cluster."
        ],
        "project": "Deploy a containerized application using Kubernetes."
    },
    "SQL": {
        "priority": "High",
        "reason": "SQL is important for retrieving and managing relational database information.",
        "learning_steps": [
            "Learn SELECT, INSERT, UPDATE and DELETE.",
            "Practise JOIN operations.",
            "Understand GROUP BY and aggregate functions.",
            "Learn subqueries and database design."
        ],
        "project": "Build a database-backed job application system."
    },
    "Python": {
        "priority": "High",
        "reason": "Python is widely used in backend development, automation and data applications.",
        "learning_steps": [
            "Practise Python fundamentals.",
            "Learn functions and object-oriented programming.",
            "Build REST APIs using FastAPI.",
            "Practise Python testing."
        ],
        "project": "Build a REST API using FastAPI."
    },
    "React": {
        "priority": "High",
        "reason": "React is used to build interactive frontend applications.",
        "learning_steps": [
            "Learn components and JSX.",
            "Practise props and state.",
            "Learn React hooks.",
            "Build applications using React Router and APIs."
        ],
        "project": "Build a responsive job portal using React."
    },
    "Git": {
        "priority": "Medium",
        "reason": "Git helps developers track changes and collaborate on code.",
        "learning_steps": [
            "Learn Git initialization and configuration.",
            "Practise add, commit and push.",
            "Learn branching and merging.",
            "Understand pull requests and collaboration."
        ],
        "project": "Manage a development project using GitHub."
    },
    "MongoDB": {
        "priority": "Medium",
        "reason": "MongoDB is a document database used in many full-stack applications.",
        "learning_steps": [
            "Understand databases and collections.",
            "Learn CRUD operations.",
            "Practise filtering and aggregation.",
            "Connect MongoDB to a Node.js application."
        ],
        "project": "Build a REST API using Node.js and MongoDB."
    }
}


def generate_skill_recommendations(missing_skills: list) -> list:
    recommendations = []

    for skill in missing_skills:
        recommendation = SKILL_RECOMMENDATIONS.get(skill)

        if recommendation:
            recommendations.append({
                "skill": skill,
                **recommendation
            })
        else:
            recommendations.append({
                "skill": skill,
                "priority": "Medium",
                "reason": (
                    f"This skill appears in the job requirements. "
                    f"Consider learning it to improve your skill alignment."
                ),
                "learning_steps": [
                    f"Understand the fundamentals of {skill}.",
                    f"Complete beginner exercises in {skill}.",
                    f"Build a practical project using {skill}."
                ],
                "project": f"Build a small project using {skill}."
            })

    return recommendations
