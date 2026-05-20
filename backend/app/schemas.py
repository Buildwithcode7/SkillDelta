from __future__ import annotations

from pydantic import BaseModel, Field, HttpUrl


class ProfileInput(BaseModel):
    linkedin_url: HttpUrl | None = None
    github_username: str | None = None
    portfolio_url: HttpUrl | None = None
    dream_job_title: str = Field(min_length=2, examples=["AI Full-Stack Engineer"])
    resume_text: str | None = None


class SkillGap(BaseModel):
    skill: str
    current_score: float
    target_score: float
    gap: float
    impact: str
    reason: str
    resources: list[str]


class RoadmapTaskOut(BaseModel):
    day: int
    topic: str
    difficulty: str
    estimated_hours: float
    recommended_videos: list[str]
    github_resources: list[str]
    documentation: list[str]
    mini_challenge: str


class CareerReport(BaseModel):
    readiness_score: float
    skill_match_percent: float
    reality_check_score: float
    interview_probability: float
    salary_prediction_lpa: float
    missing_skills: list[SkillGap]
    extracted_skills: list[str]
    shadow_learning_risk: float
    burnout_risk: float
    hiring_trend_radar: list[str]
    roadmap_preview: list[RoadmapTaskOut]
    recommendations: list[str]


class RoadmapRequest(BaseModel):
    dream_job_title: str
    missing_skills: list[str] = Field(default_factory=list)
    intensity: str = "balanced"
    days: int = Field(default=30, ge=7, le=90)


class RoadmapResponse(BaseModel):
    title: str
    compression_score: float
    total_hours: float
    tasks: list[RoadmapTaskOut]


class ProjectRequest(BaseModel):
    dream_job_title: str
    level: str = "all"
    missing_skills: list[str] = Field(default_factory=list)


class ProjectOut(BaseModel):
    title: str
    level: str
    description: str
    tech_stack: list[str]
    github_structure: dict[str, list[str]]
    deployment_guide: list[str]
    apis_to_use: list[str]
    resume_impact_score: float


class InterviewRequest(BaseModel):
    dream_job_title: str
    mode: str = "technical"
    weak_skills: list[str] = Field(default_factory=list)


class InterviewSession(BaseModel):
    mode: str
    questions: list[str]
    rubric: dict[str, str]
    communication_score: float
    confidence_score: float
    technical_score: float
    feedback: list[str]


class MentorMessage(BaseModel):
    message: str
    context: dict[str, str] = Field(default_factory=dict)


class MentorReply(BaseModel):
    reply: str
    next_actions: list[str]
    risk_flags: list[str]


class ProgressUpdate(BaseModel):
    task_id: str | None = None
    completed: bool = True
    xp_earned: int = 120
    notes: str | None = None


class ProgressOut(BaseModel):
    xp_earned: int
    streak_days: int
    achievements_unlocked: list[str]
    completion_rate: float


class ResumeAnalysisOut(BaseModel):
    ats_score: float
    resume_strength: float
    missing_keywords: list[str]
    improved_bullets: list[str]
    recommendations: list[str]
