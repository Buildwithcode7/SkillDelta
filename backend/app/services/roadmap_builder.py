from __future__ import annotations

from app.schemas import RoadmapRequest, RoadmapResponse, RoadmapTaskOut, SkillGap
from app.services.skill_curriculum import pick_leetcode_for_task, pick_youtube_for_task
from app.services.static_resources import RESOURCE_BANK


IMPACT_WEIGHT = {"High": 3.0, "Medium": 2.0, "Low": 1.0}

TASK_PHASES = [
    (
        "Foundations",
        "Study core concepts and map what {role} interviews expect for {skill}.",
        "Complete one guided exercise and write five interview-ready bullet notes.",
    ),
    (
        "Applied practice",
        "Build a focused practice slice that uses {skill} in a realistic workflow.",
        "Ship a small feature branch with tests or a reproducible script.",
    ),
    (
        "Proof sprint",
        "Turn {skill} into public evidence: code, README, and measurable outcome.",
        "Publish a README section with tradeoffs, test command, and one metric or screenshot.",
    ),
    (
        "Interview ready",
        "Practice explaining {skill} aloud with architecture, failure modes, and impact.",
        "Record a 2-minute answer and convert it into a quantified resume bullet.",
    ),
]


def build_roadmap_from_analysis(payload: RoadmapRequest) -> RoadmapResponse:
    gaps = _normalize_gaps(payload)
    days = payload.days
    schedule = _allocate_skill_schedule(gaps, days)
    intensity = payload.intensity.lower()
    skill_day_counter: dict[str, int] = {}

    tasks: list[RoadmapTaskOut] = []
    for day, gap in enumerate(schedule, start=1):
        skill_day_counter[gap.skill] = skill_day_counter.get(gap.skill, 0) + 1
        phase_index = min(skill_day_counter[gap.skill] - 1, len(TASK_PHASES) - 1)
        tasks.append(
            _task_for_gap(
                day=day,
                gap=gap,
                role=payload.dream_job_title,
                phase_index=phase_index,
                intensity=intensity,
            )
        )

    total_hours = sum(task.estimated_hours for task in tasks)
    compression = _compression_score(gaps, days, intensity)

    focus_label = gaps[0].skill if gaps else "target role"
    return RoadmapResponse(
        title=f"{days}-day {payload.dream_job_title} roadmap · focus {focus_label}",
        compression_score=compression,
        total_hours=round(total_hours, 1),
        tasks=tasks,
    )


def _normalize_gaps(payload: RoadmapRequest) -> list[SkillGap]:
    if payload.skill_gaps:
        gaps = list(payload.skill_gaps)
    elif payload.missing_skills:
        gaps = [
            SkillGap(
                skill=skill,
                current_score=42.0,
                target_score=78.0,
                gap=36.0,
                impact="Medium",
                reason=f"{payload.dream_job_title} roles need stronger proof of {skill}.",
                resources=[],
            )
            for skill in payload.missing_skills
        ]
    else:
        gaps = [
            SkillGap(
                skill="System Design",
                current_score=40.0,
                target_score=78.0,
                gap=38.0,
                impact="High",
                reason="Run a profile analysis to replace this placeholder gap.",
                resources=[],
            )
        ]

    impact_rank = {"High": 0, "Medium": 1, "Low": 2}
    return sorted(gaps, key=lambda gap: (impact_rank.get(gap.impact, 9), -gap.gap))


def _allocate_skill_schedule(gaps: list[SkillGap], days: int) -> list[SkillGap]:
    if not gaps:
        return []
    if len(gaps) == 1:
        return gaps * days

    weights = [max(10.0, gap.gap) * IMPACT_WEIGHT.get(gap.impact, 1.0) for gap in gaps]
    total_weight = sum(weights)

    allocation: dict[str, int] = {}
    remaining = days
    for index, gap in enumerate(gaps):
        if index == len(gaps) - 1:
            allocation[gap.skill] = max(1, remaining)
            continue
        minimum_reserved = len(gaps) - index - 1
        share = max(1, round(days * weights[index] / total_weight))
        share = min(share, remaining - minimum_reserved)
        allocation[gap.skill] = share
        remaining -= share

    pool: list[SkillGap] = []
    for gap in gaps:
        pool.extend([gap] * allocation.get(gap.skill, 1))

    schedule: list[SkillGap] = []
    pool_index = 0
    while len(schedule) < days:
        schedule.append(pool[pool_index % len(pool)])
        pool_index += 1

    return schedule[:days]


def _task_for_gap(
    *,
    day: int,
    gap: SkillGap,
    role: str,
    phase_index: int,
    intensity: str,
) -> RoadmapTaskOut:
    phase_name, study_focus, mini_challenge = TASK_PHASES[phase_index]
    multiplier = 1.35 if intensity == "intense" else 1.0 if intensity == "balanced" else 0.85
    gap_factor = min(2.2, 1.0 + gap.gap / 55)
    hours = round((1.2 + phase_index * 0.35 + (day % 3) * 0.15) * multiplier * gap_factor, 1)

    resources = gap.resources or _default_resources(gap.skill)
    youtube_videos = pick_youtube_for_task(gap.skill, phase_index, day, count=2)
    leetcode_problems = pick_leetcode_for_task(gap.skill, phase_index, day)
    difficulty = (
        "Advanced"
        if gap.gap >= 35 or phase_index >= 2
        else "Stretch"
        if gap.gap >= 22 or phase_index == 1
        else "Core"
    )

    return RoadmapTaskOut(
        day=day,
        skill=gap.skill,
        gap_score=round(gap.gap, 1),
        phase=phase_name,
        topic=f"Day {day}: {gap.skill} · {phase_name}",
        difficulty=difficulty,
        estimated_hours=hours,
        recommended_videos=[video.title for video in youtube_videos],
        github_resources=RESOURCE_BANK["github"][:2],
        documentation=resources[:3] if resources else _default_resources(gap.skill)[:2],
        mini_challenge=mini_challenge.format(skill=gap.skill, role=role),
        study_focus=study_focus.format(skill=gap.skill, role=role),
        youtube_videos=youtube_videos,
        leetcode_problems=leetcode_problems,
    )


def _default_resources(skill: str) -> list[str]:
    docs = RESOURCE_BANK["docs"]
    github = RESOURCE_BANK["github"]
    videos = RESOURCE_BANK["videos"]
    if skill in {"RAG", "OpenAI API", "Embeddings"}:
        return [docs[-1], github[0], videos[0]]
    if skill in {"FastAPI", "Testing"}:
        return [docs[1], github[1], "FastAPI testing guide"]
    if skill == "PostgreSQL":
        return [docs[2], videos[1], "PostgreSQL indexing guide"]
    return [docs[0], github[-1], videos[-1]]


def _compression_score(gaps: list[SkillGap], days: int, intensity: str) -> float:
    if not gaps:
        return 50.0
    avg_gap = sum(gap.gap for gap in gaps) / len(gaps)
    intensity_bonus = 8 if intensity == "intense" else 0
    skill_penalty = min(28, len(gaps) * 3)
    day_bonus = min(12, max(0, 30 - days) * 0.4)
    return round(max(35.0, min(96.0, 88 - avg_gap * 0.45 - skill_penalty + intensity_bonus + day_bonus)), 1)
