from __future__ import annotations

from datetime import datetime

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


class YouTubeResourceOut(BaseModel):
    title: str
    url: str
    channel: str = ""


class LeetCodeResourceOut(BaseModel):
    number: int
    title: str
    difficulty: str = "Medium"
    url: str = ""


class RoadmapTaskOut(BaseModel):
    day: int
    topic: str
    difficulty: str
    estimated_hours: float
    recommended_videos: list[str]
    github_resources: list[str]
    documentation: list[str]
    mini_challenge: str
    skill: str = ""
    gap_score: float = 0.0
    phase: str = ""
    study_focus: str = ""
    youtube_videos: list[YouTubeResourceOut] = Field(default_factory=list)
    leetcode_problems: list[LeetCodeResourceOut] = Field(default_factory=list)


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
    skill_gaps: list[SkillGap] = Field(default_factory=list)
    readiness_score: float | None = None
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


class VoiceMetricsIn(BaseModel):
    words_per_minute: float = 0.0
    speaking_seconds: float = 0.0
    filler_count: int = 0
    long_pause_count: int = 0
    average_volume: float = 0.0
    volume_stability: float = 0.0
    energy_score: float = 0.0
    clarity_score: float = 0.0


class FaceMetricsIn(BaseModel):
    samples: int = 0
    face_visible_percent: float = 0.0
    eye_contact_score: float = 0.0
    posture_stability: float = 0.0
    lighting_score: float = 0.0
    expression_engagement: float = 0.0
    head_movement_variance: float = 0.0


class InterviewAnswerAnalysisRequest(BaseModel):
    question: str = Field(min_length=3)
    transcript: str = ""
    dream_job_title: str = Field(min_length=2)
    mode: str = "technical"
    voice_metrics: VoiceMetricsIn = Field(default_factory=VoiceMetricsIn)
    face_metrics: FaceMetricsIn = Field(default_factory=FaceMetricsIn)


class InterviewAnswerAnalysisOut(BaseModel):
    question: str
    transcript: str
    communication_score: float
    confidence_score: float
    technical_score: float
    overall_score: float
    voice_summary: str
    face_summary: str
    strengths: list[str]
    improvements: list[str]
    feedback: list[str]
    filler_words_detected: int = 0
    words_spoken: int = 0
    speaking_pace_label: str = "No speech"


class InterviewSessionReportRequest(BaseModel):
    dream_job_title: str
    mode: str = "technical"
    answers: list[InterviewAnswerAnalysisOut] = Field(default_factory=list)


class InterviewSessionReportOut(BaseModel):
    mode: str
    dream_job_title: str
    questions_answered: int
    communication_score: float
    confidence_score: float
    technical_score: float
    presence_score: float
    overall_score: float
    summary: str
    highlights: list[str]
    focus_areas: list[str]
    next_steps: list[str]
    per_question: list[InterviewAnswerAnalysisOut] = Field(default_factory=list)


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


class GitHubActivityPoint(BaseModel):
    day: str
    commits: int = 0
    reviews: int = 0


class GitHubSnapshotOut(BaseModel):
    username: str
    profile_url: str
    public_repos: int = 0
    followers: int = 0
    repositories_analyzed: int = 0
    top_languages: list[str] = Field(default_factory=list)
    activity_score: float = 0.0
    project_depth_score: float = 0.0
    findings: list[str] = Field(default_factory=list)
    activity: list[GitHubActivityPoint] = Field(default_factory=list)
    fetched_at: datetime


class DashboardMetricOut(BaseModel):
    label: str
    value: float
    suffix: str = ""
    tone: str = "blue"


class ReadinessHistoryPoint(BaseModel):
    week: str
    readiness: float
    github: float
    resume: float


class SkillRadarPoint(BaseModel):
    skill: str
    current: float
    target: float


class HeatmapSkillOut(BaseModel):
    name: str
    score: float
    status: str


class SalaryProjectionPoint(BaseModel):
    month: str
    low: float
    median: float
    high: float


class NotificationOut(BaseModel):
    title: str
    body: str
    type: str = "info"


class DashboardOut(BaseModel):
    profile: ProfileInput
    synced_at: datetime
    report: CareerReport
    metrics: list[DashboardMetricOut]
    readiness_history: list[ReadinessHistoryPoint]
    skill_radar: list[SkillRadarPoint]
    github_activity: list[GitHubActivityPoint]
    heatmap_skills: list[HeatmapSkillOut]
    gap_analysis: list[SkillGap]
    roadmap: RoadmapResponse
    roadmap_preview: list[RoadmapTaskOut]
    upcoming_tasks: list[str]
    notifications: list[NotificationOut]
    salary_projection: list[SalaryProjectionPoint]
    github: GitHubSnapshotOut | None = None


class CertificateStatsIn(BaseModel):
    roadmap_completion_percent: float = Field(default=0.0, ge=0, le=100)
    roadmap_tasks_completed: int = Field(default=0, ge=0)
    roadmap_tasks_total: int = Field(default=0, ge=0)
    interview_overall_score: float | None = Field(default=None, ge=0, le=100)
    interview_mode: str | None = None
    resume_ats_score: float | None = Field(default=None, ge=0, le=100)
    resume_strength: float | None = Field(default=None, ge=0, le=100)
    achievements: list[str] = Field(default_factory=list)
    xp_earned: int = Field(default=0, ge=0)


class CertificateGenerateRequest(BaseModel):
    recipient_name: str | None = Field(default=None, max_length=120)
    profile: ProfileInput
    stats: CertificateStatsIn = Field(default_factory=CertificateStatsIn)


class CertificateMetricOut(BaseModel):
    label: str
    value: float
    suffix: str = "%"


class ParticipationCertificateOut(BaseModel):
    certificate_id: str
    verification_code: str
    recipient_name: str
    dream_job_title: str
    program_name: str
    issued_at: datetime
    performance_tier: str
    overall_score: float
    readiness_score: float
    skill_match_percent: float
    reality_check_score: float
    evidence_coverage: float
    github_activity_score: float
    roadmap_completion_percent: float
    interview_score: float | None
    metrics: list[CertificateMetricOut]
    highlights: list[str]
    summary: str
