from __future__ import annotations

import json
from typing import Any

from app.core.config import get_settings
from app.schemas import (
    CareerReport,
    InterviewRequest,
    InterviewSession,
    MentorMessage,
    MentorReply,
    ProfileInput,
    ProjectOut,
    ProjectRequest,
    ResumeAnalysisOut,
    RoadmapRequest,
    RoadmapResponse,
    RoadmapTaskOut,
    SkillGap,
)
from app.services.sample_data import CORE_SKILLS, PROJECT_BLUEPRINTS, RESOURCE_BANK


class SkillDeltaAI:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def career_report(self, payload: ProfileInput) -> CareerReport:
        if self.settings.openai_api_key:
            generated = await self._try_openai_json(
                system="You are SkillDelta, an expert AI career intelligence analyst. Return strict JSON matching the requested schema.",
                user={
                    "task": "Analyze career evidence and produce a job-readiness report.",
                    "profile": payload.model_dump(mode="json")
                },
                schema_name="CareerReport"
            )
            if generated:
                try:
                    return CareerReport.model_validate(generated)
                except Exception:
                    pass
        return self._fallback_career_report(payload)

    async def roadmap(self, payload: RoadmapRequest) -> RoadmapResponse:
        focus = payload.missing_skills or ["FastAPI", "RAG", "Testing", "System Design"]
        tasks = [
            self._roadmap_task(day=day, skill=focus[(day - 1) % len(focus)])
            for day in range(1, payload.days + 1)
        ]
        total_hours = sum(task.estimated_hours for task in tasks)
        return RoadmapResponse(
            title=f"{payload.days}-day roadmap for {payload.dream_job_title}",
            compression_score=86 if payload.intensity == "intense" else 74,
            total_hours=round(total_hours, 1),
            tasks=tasks
        )

    async def projects(self, payload: ProjectRequest) -> list[ProjectOut]:
        requested = payload.level.lower()
        blueprints = [
            blueprint for blueprint in PROJECT_BLUEPRINTS
            if requested == "all" or blueprint["level"] == requested
        ]
        return [ProjectOut(**blueprint) for blueprint in blueprints]

    async def interview(self, payload: InterviewRequest) -> InterviewSession:
        weak = payload.weak_skills or ["RAG", "System Design", "Testing"]
        questions = [
            f"Design a production feature for {payload.dream_job_title} that demonstrates {weak[0]}.",
            f"Explain a tradeoff you made while improving {weak[min(1, len(weak) - 1)]}.",
            "Walk through how you would debug a failing roadmap generation workflow.",
            "Tell me about a time you converted vague feedback into a measurable improvement."
        ]
        return InterviewSession(
            mode=payload.mode,
            questions=questions,
            rubric={
                "communication": "Structure, clarity, specificity, and concise tradeoffs.",
                "confidence": "Pace, directness, and comfort under follow-up questions.",
                "technical": "Correctness, depth, failure handling, and product judgment."
            },
            communication_score=82,
            confidence_score=76,
            technical_score=69,
            feedback=[
                "Lead with architecture before implementation details.",
                "Name retrieval evaluation metrics when discussing RAG.",
                "Use quantified project evidence in behavioral answers."
            ]
        )

    async def mentor_reply(self, payload: MentorMessage) -> MentorReply:
        return MentorReply(
            reply=(
                "Your shortest path is to convert learning into proof. Build one backend-heavy AI project, "
                "write a measurable resume bullet, and practice explaining the system tradeoffs."
            ),
            next_actions=[
                "Ship a FastAPI endpoint with persistence and tests.",
                "Add an architecture note to your portfolio project.",
                "Practice one system design prompt focused on ranking or retrieval."
            ],
            risk_flags=["Shadow learning risk is moderate", "Testing evidence is still thin"]
        )

    async def resume_analysis(self, text: str, filename: str | None = None) -> ResumeAnalysisOut:
        missing = ["RAG evaluation", "PostgreSQL indexing", "test coverage", "deployment metrics"]
        return ResumeAnalysisOut(
            ats_score=88,
            resume_strength=81,
            missing_keywords=missing,
            improved_bullets=[
                "Built a production-grade AI roadmap generator that reduced manual planning time by 64%.",
                "Designed PostgreSQL-backed skill scoring workflows with measurable readiness improvements.",
                "Integrated OpenAI-powered resume analysis with source-grounded recommendations."
            ],
            recommendations=[
                "Add deployment links beside each project.",
                "Quantify user impact, latency, cost savings, or review-time reduction.",
                "Group AI, backend, and data skills near the top for target-role alignment."
            ]
        )

    def _fallback_career_report(self, payload: ProfileInput) -> CareerReport:
        extracted = self._extract_skills(payload)
        missing = [
            SkillGap(
                skill="Production RAG",
                current_score=44,
                target_score=84,
                gap=40,
                impact="High",
                reason="Target roles expect retrieval strategy, evaluation, and source-grounded UX.",
                resources=RESOURCE_BANK["videos"][:1] + RESOURCE_BANK["github"][:1]
            ),
            SkillGap(
                skill="System Design",
                current_score=48,
                target_score=82,
                gap=34,
                impact="High",
                reason="Interview loops require scalable architecture and tradeoff reasoning.",
                resources=[RESOURCE_BANK["videos"][2], RESOURCE_BANK["docs"][2]]
            ),
            SkillGap(
                skill="Testing Strategy",
                current_score=39,
                target_score=72,
                gap=33,
                impact="Medium",
                reason="Portfolio evidence is stronger when APIs and AI flows have regression coverage.",
                resources=["FastAPI testing guide", "Playwright component testing examples"]
            )
        ]
        return CareerReport(
            readiness_score=78,
            skill_match_percent=72,
            reality_check_score=64,
            interview_probability=68,
            salary_prediction_lpa=33,
            missing_skills=missing,
            extracted_skills=extracted,
            shadow_learning_risk=42,
            burnout_risk=26,
            hiring_trend_radar=["AI full-stack", "RAG evaluation", "agentic UX", "PostgreSQL analytics"],
            roadmap_preview=[self._roadmap_task(day=day, skill=missing[(day - 1) % len(missing)].skill) for day in range(1, 8)],
            recommendations=[
                "Build one AI project with persistence, evaluation, and deployment.",
                "Rewrite resume bullets around measurable product outcomes.",
                "Practice system design answers for retrieval, ranking, and async jobs."
            ]
        )

    def _extract_skills(self, payload: ProfileInput) -> list[str]:
        text = f"{payload.github_username or ''} {payload.portfolio_url or ''} {payload.resume_text or ''}".lower()
        found = [skill for skill in CORE_SKILLS if skill.lower().replace(".", "") in text.replace(".", "")]
        return sorted(set(found or ["React", "TypeScript", "Next.js", "GitHub", "Portfolio storytelling"]))

    def _roadmap_task(self, day: int, skill: str) -> RoadmapTaskOut:
        return RoadmapTaskOut(
            day=day,
            topic=f"{skill} proof sprint",
            difficulty=["Core", "Stretch", "Advanced"][day % 3],
            estimated_hours=round(1.5 + (day % 4) * 0.5, 1),
            recommended_videos=RESOURCE_BANK["videos"],
            github_resources=RESOURCE_BANK["github"],
            documentation=RESOURCE_BANK["docs"],
            mini_challenge=(
                "Ship a small commit and write a 5-line explanation of the tradeoff you made."
                if day % 5
                else "Record a short demo and update your resume bullet with a measurable result."
            )
        )

    async def _try_openai_json(self, system: str, user: dict[str, Any], schema_name: str) -> dict[str, Any] | None:
        try:
            from openai import AsyncOpenAI

            client = AsyncOpenAI(api_key=self.settings.openai_api_key)
            response = await client.responses.create(
                model=self.settings.openai_model,
                input=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": json.dumps(user)}
                ],
                text={"format": {"type": "json_object"}},
            )
            return json.loads(response.output_text)
        except Exception:
            return None


ai_service = SkillDeltaAI()
