from __future__ import annotations

import json
import re
from typing import Any

from app.services.interview_questions import generate_random_questions, variety_seed

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
from app.schemas import GitHubSnapshotOut
from app.services.profile_evidence import build_career_report, target_skills_for_role
from app.services.roadmap_builder import build_roadmap_from_analysis
from app.services.skill_curriculum import pick_leetcode_for_task, pick_youtube_for_task
from app.services.static_resources import RESOURCE_BANK


class SkillDeltaAI:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def career_report(
        self,
        payload: ProfileInput,
        *,
        github: GitHubSnapshotOut | None = None,
    ) -> CareerReport:
        baseline = build_career_report(payload, github=github)

        if self.settings.openai_api_key:
            generated = await self._try_openai_json(
                system=(
                    "You are SkillDelta, an expert AI career intelligence analyst. "
                    "Return strict JSON matching the CareerReport schema. "
                    "Scores must reflect supplied evidence only — do not invent skills or inflate readiness "
                    "when resume or GitHub data is missing. Prefer the baseline_analysis numbers when evidence is thin."
                ),
                user={
                    "task": "Analyze profile evidence and produce a job-readiness report grounded in resume and GitHub data.",
                    "profile": payload.model_dump(mode="json"),
                    "github_snapshot": github.model_dump(mode="json") if github else None,
                    "baseline_analysis": baseline.model_dump(mode="json"),
                },
                schema_name="CareerReport",
            )
            if generated:
                try:
                    merged = self._merge_career_report(baseline, CareerReport.model_validate(generated))
                    return merged
                except Exception:
                    pass
        return baseline

    async def roadmap(self, payload: RoadmapRequest) -> RoadmapResponse:
        baseline = build_roadmap_from_analysis(payload)

        if self.settings.openai_api_key:
            generated = await self._try_openai_json(
                system=(
                    "You generate practical career roadmaps as strict JSON matching RoadmapResponse. "
                    "Prioritize skill_gaps by impact and gap size. Allocate more days to larger gaps."
                ),
                user={
                    "task": "Generate a roadmap from skill analysis. Keep the same number of days and prioritize listed gaps.",
                    "request": payload.model_dump(mode="json"),
                    "baseline_tasks": [task.model_dump() for task in baseline.tasks[:10]],
                },
                schema_name="RoadmapResponse",
            )
            if generated:
                try:
                    session = RoadmapResponse.model_validate(generated)
                    if len(session.tasks) >= min(7, payload.days):
                        return session
                except Exception:
                    pass

        return baseline

    async def projects(self, payload: ProjectRequest) -> list[ProjectOut]:
        if self.settings.openai_api_key:
            generated = await self._try_openai_json(
                system="You generate portfolio project plans as strict JSON with a top-level projects array.",
                user={"task": "Generate projects from target role and missing skills.", "request": payload.model_dump(mode="json")},
                schema_name="ProjectList"
            )
            projects = generated.get("projects") if isinstance(generated, dict) else None
            if isinstance(projects, list):
                try:
                    return [ProjectOut.model_validate(project) for project in projects]
                except Exception:
                    pass

        requested = payload.level.lower()
        levels = ["beginner", "intermediate", "advanced"] if requested == "all" else [requested]
        focus = payload.missing_skills or target_skills_for_role(payload.dream_job_title)[:3]
        return [
            self._project_for_skill(skill=focus[index % len(focus)], level=level, target_role=payload.dream_job_title)
            for index, level in enumerate(levels)
        ]

    async def interview(self, payload: InterviewRequest) -> InterviewSession:
        weak = payload.weak_skills or target_skills_for_role(payload.dream_job_title)[:6]
        questions = generate_random_questions(
            dream_job_title=payload.dream_job_title,
            mode=payload.mode,
            weak_skills=weak,
            count=5,
        )

        if self.settings.openai_api_key:
            generated = await self._try_openai_json(
                system=(
                    "You generate targeted mock interview sessions as strict JSON matching InterviewSession. "
                    "Every session must use fresh, non-repetitive questions."
                ),
                user={
                    "task": "Generate a unique mock interview session. Do not reuse generic templates.",
                    "variety_seed": variety_seed(),
                    "request": payload.model_dump(mode="json"),
                    "fallback_questions": questions,
                },
                schema_name="InterviewSession",
            )
            if generated:
                try:
                    session = InterviewSession.model_validate(generated)
                    if len(session.questions) >= 3:
                        return session
                except Exception:
                    pass

        return InterviewSession(
            mode=payload.mode,
            questions=questions,
            rubric={
                "communication": "Use a clear setup, action, result, and tradeoff structure.",
                "confidence": "Answer directly, avoid filler, and handle follow-ups calmly.",
                "technical": "Name architecture choices, failure modes, tests, and measurable outcomes."
            },
            communication_score=0,
            confidence_score=0,
            technical_score=0,
            feedback=["Session generated from your current weak skills. Submit an answer to score it."]
        )

    async def mentor_reply(self, payload: MentorMessage) -> MentorReply:
        if self.settings.openai_api_key:
            generated = await self._try_openai_json(
                system="You are a direct, practical career mentor. Return strict JSON matching MentorReply.",
                user={"task": "Reply to the user's career question using only supplied context.", "message": payload.model_dump(mode="json")},
                schema_name="MentorReply"
            )
            if generated:
                try:
                    return MentorReply.model_validate(generated)
                except Exception:
                    pass

        message = payload.message.strip() or "What should I do next?"
        context_skills = payload.context.get("missing_skills", "")
        next_skill = context_skills.split(",")[0].strip() if context_skills else "your highest-gap skill"
        return MentorReply(
            reply=f"Based on your current sync, answer this by turning {next_skill} into public proof: one shipped feature, one test, one short architecture note.",
            next_actions=[
                f"Ship a small project slice that demonstrates {next_skill}.",
                "Add a quantified resume bullet for the work.",
                "Practice a two-minute explanation of the tradeoff you made."
            ],
            risk_flags=["No scored interview answer is available yet." if "interview" in message.lower() else "Keep learning tied to shipped evidence."]
        )

    async def resume_analysis(self, text: str, filename: str | None = None) -> ResumeAnalysisOut:
        if self.settings.openai_api_key and text.strip():
            generated = await self._try_openai_json(
                system="You analyze resumes and return strict JSON matching ResumeAnalysisOut.",
                user={"task": "Analyze this real resume text for ATS and role evidence.", "filename": filename, "resume_text": text[:16000]},
                schema_name="ResumeAnalysisOut"
            )
            if generated:
                try:
                    return ResumeAnalysisOut.model_validate(generated)
                except Exception:
                    pass
        return self._heuristic_resume_analysis(text=text)

    def _merge_career_report(self, baseline: CareerReport, generated: CareerReport) -> CareerReport:
        """Blend AI narrative with evidence-based scores so outputs stay realistic."""
        data = generated.model_dump()
        for field in (
            "readiness_score",
            "skill_match_percent",
            "reality_check_score",
            "interview_probability",
            "salary_prediction_lpa",
            "shadow_learning_risk",
            "burnout_risk",
        ):
            ai_value = getattr(generated, field)
            base_value = getattr(baseline, field)
            if field in {"shadow_learning_risk", "burnout_risk"}:
                data[field] = round(min(ai_value, base_value * 1.15 + 8), 1)
            else:
                data[field] = round(ai_value * 0.35 + base_value * 0.65, 1)

        if not baseline.extracted_skills:
            data["extracted_skills"] = generated.extracted_skills
        else:
            merged_skills = list(dict.fromkeys(baseline.extracted_skills + generated.extracted_skills))
            data["extracted_skills"] = merged_skills[:12]

        baseline_by_skill = {gap.skill: gap for gap in baseline.missing_skills}
        merged_gaps: list[SkillGap] = []
        for gap in generated.missing_skills:
            base_gap = baseline_by_skill.get(gap.skill)
            if base_gap:
                merged_gaps.append(
                    gap.model_copy(
                        update={
                            "current_score": round(base_gap.current_score * 0.7 + gap.current_score * 0.3, 1),
                            "gap": round(
                                max(
                                    base_gap.gap,
                                    base_gap.target_score
                                    - round(base_gap.current_score * 0.7 + gap.current_score * 0.3, 1),
                                ),
                                1,
                            ),
                            "impact": base_gap.impact,
                            "reason": base_gap.reason,
                        }
                    )
                )
            else:
                merged_gaps.append(gap)
        for gap in baseline.missing_skills:
            if gap.skill not in {item.skill for item in merged_gaps}:
                merged_gaps.append(gap)
        merged_gaps.sort(key=lambda item: item.gap, reverse=True)
        data["missing_skills"] = merged_gaps[:8] or baseline.missing_skills
        data["roadmap_preview"] = baseline.roadmap_preview or generated.roadmap_preview
        if len(data.get("recommendations") or []) < 2:
            data["recommendations"] = baseline.recommendations
        return CareerReport.model_validate(data)

    def _heuristic_resume_analysis(self, text: str) -> ResumeAnalysisOut:
        clean = text.strip()
        if not clean:
            return ResumeAnalysisOut(
                ats_score=0,
                resume_strength=0,
                missing_keywords=["resume text", "projects", "skills", "impact metrics"],
                improved_bullets=[],
                recommendations=["Upload a resume PDF or paste resume text to run a real analysis."]
            )

        lower = clean.lower()
        target_keywords = ["react", "typescript", "api", "database", "testing", "deployment", "metrics", "system design", "ai", "github"]
        missing = [keyword for keyword in target_keywords if keyword not in lower]
        sections = sum(section in lower for section in ["experience", "projects", "skills", "education", "summary"])
        numbers = min(12, sum(char.isdigit() for char in clean))
        action_verbs = sum(verb in lower for verb in ["built", "designed", "shipped", "improved", "reduced", "increased", "led"])
        ats_score = round(min(100.0, 30 + (len(target_keywords) - len(missing)) * 5 + sections * 6 + numbers * 1.8), 1)
        strength = round(min(100.0, 25 + action_verbs * 6 + sections * 7 + numbers * 2), 1)
        bullets = self._candidate_bullets(clean)

        return ResumeAnalysisOut(
            ats_score=ats_score,
            resume_strength=strength,
            missing_keywords=missing[:8],
            improved_bullets=[
                self._rewrite_bullet(bullet)
                for bullet in bullets[:3]
            ],
            recommendations=[
                "Add quantified outcomes to the strongest project bullets.",
                "Place target-role keywords near project evidence, not only in a skills list.",
                "Include deployment links, GitHub links, test coverage, or usage metrics where available."
            ]
        )

    def _roadmap_task(self, day: int, skill: str, intensity: str = "balanced") -> RoadmapTaskOut:
        multiplier = 1.25 if intensity == "intense" else 1.0
        phase_index = (day - 1) % 4
        youtube_videos = pick_youtube_for_task(skill, phase_index, day, count=2)
        leetcode_problems = pick_leetcode_for_task(skill, phase_index, day)
        return RoadmapTaskOut(
            day=day,
            skill=skill,
            phase=["Foundations", "Applied practice", "Proof sprint", "Interview ready"][phase_index],
            topic=f"Day {day}: {skill} proof sprint",
            difficulty=["Core", "Stretch", "Advanced"][day % 3],
            estimated_hours=round((1.25 + (day % 4) * 0.45) * multiplier, 1),
            recommended_videos=[video.title for video in youtube_videos],
            github_resources=RESOURCE_BANK["github"][:2],
            documentation=RESOURCE_BANK["docs"][:2],
            mini_challenge=(
                f"Ship a small commit that demonstrates {skill} and write a concise README tradeoff note."
                if day % 5
                else f"Record a short demo proving {skill} and convert it into a resume bullet."
            ),
            youtube_videos=youtube_videos,
            leetcode_problems=leetcode_problems,
        )

    def _project_for_skill(self, skill: str, level: str, target_role: str) -> ProjectOut:
        level_title = level.title()
        stack = self._stack_for_skill(skill)
        title = f"{skill} Proof Project"
        return ProjectOut(
            title=title,
            level=level,
            description=f"Build a {level} portfolio project for {target_role} that proves {skill} with real code, tests, deployment notes, and measurable output.",
            tech_stack=stack,
            github_structure={
                "frontend": ["app", "components", "lib/api-client.ts"],
                "backend": ["app/api", "app/services", "tests"],
                "docs": ["README.md", "ARCHITECTURE.md"]
            },
            deployment_guide=[
                "Create environment variables for every external API.",
                "Deploy the frontend and backend separately.",
                "Add a README section with screenshots, live URL, and test command."
            ],
            apis_to_use=["GitHub REST API" if skill == "GitHub" else "OpenAI API", "PostgreSQL or SQLite persistence"],
            resume_impact_score=round(62 + ["beginner", "intermediate", "advanced"].index(level.lower()) * 12 + min(len(stack), 5), 1) if level.lower() in {"beginner", "intermediate", "advanced"} else 70
        )

    def _stack_for_skill(self, skill: str) -> list[str]:
        if skill in {"RAG", "Embeddings", "OpenAI API"}:
            return ["Next.js", "FastAPI", "OpenAI", "PostgreSQL"]
        if skill == "PostgreSQL":
            return ["FastAPI", "PostgreSQL", "SQLAlchemy", "pytest"]
        if skill == "Testing":
            return ["Playwright", "pytest", "GitHub Actions", "Next.js"]
        if skill == "System Design":
            return ["Next.js", "FastAPI", "Queues", "PostgreSQL"]
        return ["Next.js", "TypeScript", "FastAPI", "GitHub Actions"]

    def _candidate_bullets(self, text: str) -> list[str]:
        lines = [
            re.sub(r"^[\s\-*•]+", "", line).strip()
            for line in text.splitlines()
        ]
        return [line for line in lines if len(line) >= 28]

    def _rewrite_bullet(self, bullet: str) -> str:
        clipped = bullet.rstrip(".")
        return f"{clipped}; add quantified scope, technical depth, and measured user or business impact."

    async def _try_openai_json(self, system: str, user: dict[str, Any], schema_name: str) -> dict[str, Any]:
        try:
            from openai import AsyncOpenAI

            client = AsyncOpenAI(api_key=self.settings.openai_api_key)
            response = await client.responses.create(
                model=self.settings.openai_model,
                input=[
                    {"role": "system", "content": f"{system} Schema name: {schema_name}."},
                    {"role": "user", "content": json.dumps(user)}
                ],
                text={"format": {"type": "json_object"}},
            )
            return json.loads(response.output_text)
        except Exception:
            return {}


ai_service = SkillDeltaAI()
