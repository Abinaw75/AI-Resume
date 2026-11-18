
from pydantic import BaseModel, Field


class JobMatchingRequest(BaseModel):
    job_description: str = Field(
        min_length=20,
        max_length=20000,
        description="Paste the job description here"
    )
