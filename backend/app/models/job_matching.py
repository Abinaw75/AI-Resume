
import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import Text, DateTime, ForeignKey, Numeric, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class JobMatching(Base):
    __tablename__ = "job_matchings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    resume_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("resumes.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    job_description: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    match_percentage: Mapped[Decimal] = mapped_column(
        Numeric(5, 2),
        nullable=False,
        default=0
    )

    matched_skills: Mapped[list] = mapped_column(
        JSONB,
        nullable=False,
        default=list
    )

    missing_skills: Mapped[list] = mapped_column(
        JSONB,
        nullable=False,
        default=list
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
