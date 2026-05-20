from __future__ import annotations

from fastapi import APIRouter, File, Form, UploadFile

from app.schemas import (
    CareerReport,
    InterviewRequest,
    InterviewSession,
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

router = APIRouter(prefix="/api")


@router.post("/analyze", response_model=CareerReport)
async def analyze_profile(payload: ProfileInput) -> CareerReport:
    return await ai_service.career_report(payload)


@router.post("/roadmap/generate", response_model=RoadmapResponse)
async def generate_roadmap(payload: RoadmapRequest) -> RoadmapResponse:
    return await ai_service.roadmap(payload)


@router.post("/projects/generate", response_model=list[ProjectOut])
async def generate_projects(payload: ProjectRequest) -> list[ProjectOut]:
    return await ai_service.projects(payload)


@router.post("/mock-interview/session", response_model=InterviewSession)
async def start_mock_interview(payload: InterviewRequest) -> InterviewSession:
    return await ai_service.interview(payload)


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
        text = content[:12000].decode("utf-8", errors="ignore")
    return await ai_service.resume_analysis(text=text, filename=filename)


@router.post("/progress", response_model=ProgressOut)
async def update_progress(payload: ProgressUpdate) -> ProgressOut:
    achievements = ["Roadmap Sprinter"] if payload.completed else []
    return ProgressOut(
        xp_earned=payload.xp_earned,
        streak_days=15 if payload.completed else 14,
        achievements_unlocked=achievements,
        completion_rate=64.0 if payload.completed else 61.0
    )


@router.get("/notifications")
async def notifications() -> list[dict[str, str]]:
    return [
        {
            "title": "Skill decay alert",
            "body": "Testing evidence is behind the target role benchmark.",
            "type": "warning"
        },
        {
            "title": "Roadmap compression",
            "body": "You can save 4 days by replacing two tutorials with one deployed RAG project.",
            "type": "insight"
        }
    ]
