from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


def uuid_str() -> str:
    return str(uuid.uuid4())


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    clerk_id: Mapped[str | None] = mapped_column(String(120), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str | None] = mapped_column(String(160))
    linkedin_url: Mapped[str | None] = mapped_column(String(500))
    github_username: Mapped[str | None] = mapped_column(String(120))
    portfolio_url: Mapped[str | None] = mapped_column(String(500))
    xp: Mapped[int] = mapped_column(Integer, default=0)
    streak_days: Mapped[int] = mapped_column(Integer, default=0)
    subscription_tier: Mapped[str] = mapped_column(String(40), default="starter")
    preferences: Mapped[dict] = mapped_column(JSON, default=dict)

    career_goals: Mapped[list[CareerGoal]] = relationship(back_populates="user", cascade="all, delete-orphan")
    reports: Mapped[list[AIReport]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Skill(Base, TimestampMixin):
    __tablename__ = "skills"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    name: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    category: Mapped[str] = mapped_column(String(80))
    market_demand: Mapped[float] = mapped_column(Float, default=0.0)
    decay_risk: Mapped[float] = mapped_column(Float, default=0.0)
    resources: Mapped[dict] = mapped_column(JSON, default=dict)


class SkillScore(Base, TimestampMixin):
    __tablename__ = "skill_scores"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    skill_id: Mapped[str] = mapped_column(ForeignKey("skills.id", ondelete="CASCADE"), index=True)
    current_score: Mapped[float] = mapped_column(Float, default=0.0)
    target_score: Mapped[float] = mapped_column(Float, default=0.0)
    evidence_strength: Mapped[float] = mapped_column(Float, default=0.0)
    gap_score: Mapped[float] = mapped_column(Float, default=0.0)
    source_breakdown: Mapped[dict] = mapped_column(JSON, default=dict)


class CareerGoal(Base, TimestampMixin):
    __tablename__ = "career_goals"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    dream_job_title: Mapped[str] = mapped_column(String(180))
    dream_company: Mapped[str | None] = mapped_column(String(180))
    target_location: Mapped[str | None] = mapped_column(String(120))
    target_salary: Mapped[int | None] = mapped_column(Integer)
    readiness_score: Mapped[float] = mapped_column(Float, default=0.0)
    reality_check_score: Mapped[float] = mapped_column(Float, default=0.0)
    interview_probability: Mapped[float] = mapped_column(Float, default=0.0)

    user: Mapped[User] = relationship(back_populates="career_goals")
    roadmaps: Mapped[list[Roadmap]] = relationship(back_populates="career_goal", cascade="all, delete-orphan")


class Roadmap(Base, TimestampMixin):
    __tablename__ = "roadmaps"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    career_goal_id: Mapped[str] = mapped_column(ForeignKey("career_goals.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(180))
    days: Mapped[int] = mapped_column(Integer, default=30)
    compression_score: Mapped[float] = mapped_column(Float, default=0.0)
    completion_rate: Mapped[float] = mapped_column(Float, default=0.0)
    metadata_json: Mapped[dict] = mapped_column("metadata", JSON, default=dict)

    career_goal: Mapped[CareerGoal] = relationship(back_populates="roadmaps")
    tasks: Mapped[list[Task]] = relationship(back_populates="roadmap", cascade="all, delete-orphan")


class Task(Base, TimestampMixin):
    __tablename__ = "tasks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    roadmap_id: Mapped[str] = mapped_column(ForeignKey("roadmaps.id", ondelete="CASCADE"), index=True)
    day: Mapped[int] = mapped_column(Integer)
    topic: Mapped[str] = mapped_column(String(180))
    difficulty: Mapped[str] = mapped_column(String(60))
    estimated_hours: Mapped[float] = mapped_column(Float, default=1.0)
    resources: Mapped[dict] = mapped_column(JSON, default=dict)
    mini_challenge: Mapped[str | None] = mapped_column(Text)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)

    roadmap: Mapped[Roadmap] = relationship(back_populates="tasks")


class ResumeAnalysis(Base, TimestampMixin):
    __tablename__ = "resume_analyses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    file_name: Mapped[str | None] = mapped_column(String(255))
    ats_score: Mapped[float] = mapped_column(Float, default=0.0)
    resume_strength: Mapped[float] = mapped_column(Float, default=0.0)
    missing_keywords: Mapped[list] = mapped_column(JSON, default=list)
    improved_bullets: Mapped[list] = mapped_column(JSON, default=list)
    raw_text_excerpt: Mapped[str | None] = mapped_column(Text)


class GitHubAnalysis(Base, TimestampMixin):
    __tablename__ = "github_analyses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    username: Mapped[str] = mapped_column(String(120), index=True)
    languages: Mapped[dict] = mapped_column(JSON, default=dict)
    activity_score: Mapped[float] = mapped_column(Float, default=0.0)
    project_depth_score: Mapped[float] = mapped_column(Float, default=0.0)
    shadow_learning_risk: Mapped[float] = mapped_column(Float, default=0.0)
    findings: Mapped[list] = mapped_column(JSON, default=list)


class MockInterview(Base, TimestampMixin):
    __tablename__ = "mock_interviews"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    mode: Mapped[str] = mapped_column(String(80))
    questions: Mapped[list] = mapped_column(JSON, default=list)
    transcript: Mapped[str | None] = mapped_column(Text)
    communication_score: Mapped[float] = mapped_column(Float, default=0.0)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0)
    technical_score: Mapped[float] = mapped_column(Float, default=0.0)
    feedback: Mapped[dict] = mapped_column(JSON, default=dict)


class LearningProgress(Base, TimestampMixin):
    __tablename__ = "learning_progress"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    task_id: Mapped[str | None] = mapped_column(ForeignKey("tasks.id", ondelete="SET NULL"), index=True)
    xp_earned: Mapped[int] = mapped_column(Integer, default=0)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[str | None] = mapped_column(Text)


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(180))
    level: Mapped[str] = mapped_column(String(80))
    description: Mapped[str] = mapped_column(Text)
    tech_stack: Mapped[list] = mapped_column(JSON, default=list)
    github_structure: Mapped[dict] = mapped_column(JSON, default=dict)
    deployment_guide: Mapped[list] = mapped_column(JSON, default=list)
    api_suggestions: Mapped[list] = mapped_column(JSON, default=list)
    resume_impact_score: Mapped[float] = mapped_column(Float, default=0.0)


class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(180))
    body: Mapped[str] = mapped_column(Text)
    type: Mapped[str] = mapped_column(String(80), default="info")
    read: Mapped[bool] = mapped_column(Boolean, default=False)


class AIReport(Base, TimestampMixin):
    __tablename__ = "ai_reports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    report_type: Mapped[str] = mapped_column(String(100))
    summary: Mapped[str] = mapped_column(Text)
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    model: Mapped[str | None] = mapped_column(String(120))

    user: Mapped[User] = relationship(back_populates="reports")
