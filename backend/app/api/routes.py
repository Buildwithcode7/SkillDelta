from __future__ import annotations

from io import BytesIO

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pypdf import PdfReader

from app.schemas import (
    CareerReport,
    CertificateGenerateRequest,
    DashboardOut,
    GitHubSnapshotOut,
    ParticipationCertificateOut,
    InterviewAnswerAnalysisOut,
    InterviewAnswerAnalysisRequest,
    InterviewRequest,
    InterviewSession,
    InterviewSessionReportOut,
    InterviewSessionReportRequest,
    MentorMessage,
    MentorReply,
    ProfileInput,
    ProgressOut,
    ProgressUpdate,
    ProjectOut,
    ProjectRequest,
    ResumeAnalysisOut,
    RoadmapRequest,
    RoadmapResponse,
)
from app.services.ai import ai_service
from app.services.certificate import generate_certificate_payload
from app.services.dashboard import build_dashboard
from app.services.github import github_analyzer
from app.services.interview_analysis import interview_analysis_service

router = APIRouter(prefix="/api")


@router.post("/analyze", response_model=CareerReport)
async def analyze_profile(payload: ProfileInput) -> CareerReport:
    github = await _fetch_github_snapshot(payload.github_username)
    return await ai_service.career_report(payload, github=github)


@router.post("/dashboard", response_model=DashboardOut)
async def dashboard(payload: ProfileInput) -> DashboardOut:
    github = await _fetch_github_snapshot(payload.github_username)
    report = await ai_service.career_report(payload, github=github)
    roadmap = await ai_service.roadmap(
        RoadmapRequest(
            dream_job_title=payload.dream_job_title,
            missing_skills=[gap.skill for gap in report.missing_skills],
            skill_gaps=report.missing_skills,
            readiness_score=report.readiness_score,
            intensity="balanced",
            days=30,
        )
    )
    return build_dashboard(profile=payload, report=report, roadmap=roadmap, github=github)


@router.get("/github/{username}", response_model=GitHubSnapshotOut)
async def github_snapshot(username: str) -> GitHubSnapshotOut:
    try:
        snapshot = await github_analyzer.snapshot(username)
    except Exception as exc:
        raise HTTPException(status_code=503, detail="GitHub API is unavailable") from exc
    if not snapshot:
        raise HTTPException(status_code=404, detail="GitHub user was not found")
    return snapshot


@router.post("/roadmap/generate", response_model=RoadmapResponse)
async def generate_roadmap(payload: RoadmapRequest) -> RoadmapResponse:
    return await ai_service.roadmap(payload)


@router.post("/projects/generate", response_model=list[ProjectOut])
async def generate_projects(payload: ProjectRequest) -> list[ProjectOut]:
    return await ai_service.projects(payload)


@router.post("/mock-interview/session", response_model=InterviewSession)
async def start_mock_interview(payload: InterviewRequest) -> InterviewSession:
    return await ai_service.interview(payload)


@router.post("/mock-interview/analyze-answer", response_model=InterviewAnswerAnalysisOut)
async def analyze_interview_answer(payload: InterviewAnswerAnalysisRequest) -> InterviewAnswerAnalysisOut:
    return await interview_analysis_service.analyze_answer(
        question=payload.question,
        transcript=payload.transcript,
        dream_job_title=payload.dream_job_title,
        mode=payload.mode,
        voice=payload.voice_metrics,
        face=payload.face_metrics,
    )


@router.post("/mock-interview/session-report", response_model=InterviewSessionReportOut)
async def analyze_interview_session(payload: InterviewSessionReportRequest) -> InterviewSessionReportOut:
    return await interview_analysis_service.analyze_session(
        dream_job_title=payload.dream_job_title,
        mode=payload.mode,
        answers=payload.answers,
    )


@router.post("/mentor/chat", response_model=MentorReply)
async def mentor_chat(payload: MentorMessage) -> MentorReply:
    return await ai_service.mentor_reply(payload)


@router.post("/resume/analyze", response_model=ResumeAnalysisOut)
async def analyze_resume(
    file: UploadFile | None = File(default=None),
    resume_text: str | None = Form(default=None),
) -> ResumeAnalysisOut:
    text = resume_text or ""
    filename = file.filename if file else None
    if file:
        content = await file.read()
        if filename and filename.lower().endswith(".pdf"):
            reader = PdfReader(BytesIO(content))
            text = "\n".join(page.extract_text() or "" for page in reader.pages)
        else:
            text = content[:12000].decode("utf-8", errors="ignore")
    return await ai_service.resume_analysis(text=text, filename=filename)


@router.post("/certificate/generate", response_model=ParticipationCertificateOut)
async def generate_certificate(payload: CertificateGenerateRequest) -> ParticipationCertificateOut:
    github = await _fetch_github_snapshot(payload.profile.github_username)
    return generate_certificate_payload(payload, github=github)


@router.post("/progress", response_model=ProgressOut)
async def update_progress(payload: ProgressUpdate) -> ProgressOut:
    achievements = ["Roadmap Sprinter"] if payload.completed else []
    return ProgressOut(
        xp_earned=payload.xp_earned,
        streak_days=1 if payload.completed else 0,
        achievements_unlocked=achievements,
        completion_rate=100.0 if payload.completed else 0.0
    )


@router.get("/notifications")
async def notifications() -> list[dict[str, str]]:
    return []


async def _fetch_github_snapshot(username: str | None) -> GitHubSnapshotOut | None:
    if not username:
        return None
    try:
        return await github_analyzer.snapshot(username)
    except Exception:
        return None
