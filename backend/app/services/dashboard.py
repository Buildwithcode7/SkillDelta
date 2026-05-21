from __future__ import annotations

from datetime import datetime, timezone

from app.schemas import (
    CareerReport,
    DashboardMetricOut,
    DashboardOut,
    GitHubActivityPoint,
    GitHubSnapshotOut,
    HeatmapSkillOut,
    NotificationOut,
    ProfileInput,
    ReadinessHistoryPoint,
    RoadmapResponse,
    SalaryProjectionPoint,
    SkillRadarPoint,
)
from app.services.profile_evidence import compute_skill_evidence, evidence_completeness, resume_strength_score


def build_dashboard(
    profile: ProfileInput,
    report: CareerReport,
    roadmap: RoadmapResponse,
    github: GitHubSnapshotOut | None,
) -> DashboardOut:
    github_score = github.activity_score if github else 0.0
    github_depth = github.project_depth_score if github else 0.0
    resume_score = resume_strength_score(profile.resume_text)
    completeness = evidence_completeness(profile, github)

    metrics = [
        DashboardMetricOut(label="Job Readiness", value=report.readiness_score, suffix="%", tone="blue"),
        DashboardMetricOut(label="Skill Match", value=report.skill_match_percent, suffix="%", tone="violet"),
        DashboardMetricOut(label="Reality Check", value=report.reality_check_score, suffix="%", tone="amber"),
        DashboardMetricOut(label="Evidence Coverage", value=completeness, suffix="%", tone="cyan"),
        DashboardMetricOut(label="GitHub Activity", value=github_score, suffix="%", tone="green"),
        DashboardMetricOut(label="Resume Strength", value=resume_score, suffix="%", tone="rose"),
    ]

    heatmap = _build_heatmap(profile, github)
    skill_radar = _build_skill_radar(report, profile, github)
    synced_at = datetime.now(timezone.utc)
    history = _evidence_history(report, resume_score, github_score, github_depth)
    salary_projection = _salary_projection(synced_at, report.salary_prediction_lpa, report.readiness_score)
    notifications = _notifications(report, github, resume_score, completeness)
    upcoming = [task.topic for task in roadmap.tasks[:5]]

    return DashboardOut(
        profile=profile,
        synced_at=synced_at,
        report=report,
        metrics=metrics,
        readiness_history=history,
        skill_radar=skill_radar,
        github_activity=github.activity if github else _empty_activity(synced_at),
        heatmap_skills=heatmap[:12],
        gap_analysis=report.missing_skills,
        roadmap=roadmap,
        roadmap_preview=roadmap.tasks[:7],
        upcoming_tasks=upcoming,
        notifications=notifications,
        salary_projection=salary_projection,
        github=github,
    )


def _heatmap_status(current: float, target: float) -> str:
    ratio = current / max(target, 1.0)
    if ratio >= 0.85:
        return "Strong"
    if ratio >= 0.65:
        return "Growing"
    if ratio >= 0.4:
        return "Gap"
    return "Risk"


def _build_heatmap(profile: ProfileInput, github: GitHubSnapshotOut | None) -> list[HeatmapSkillOut]:
    evidences = compute_skill_evidence(profile, github=github)
    ordered = sorted(evidences, key=lambda item: item.gap, reverse=True)
    return [
        HeatmapSkillOut(
            name=evidence.skill,
            score=evidence.current_score,
            status=_heatmap_status(evidence.current_score, evidence.target_score),
        )
        for evidence in ordered
    ]


def _build_skill_radar(
    report: CareerReport,
    profile: ProfileInput,
    github: GitHubSnapshotOut | None,
) -> list[SkillRadarPoint]:
    evidences = compute_skill_evidence(profile, github=github)
    by_gap = sorted(evidences, key=lambda item: item.gap, reverse=True)
    return [
        SkillRadarPoint(skill=evidence.skill, current=evidence.current_score, target=evidence.target_score)
        for evidence in by_gap[:8]
    ] or [
        SkillRadarPoint(skill=gap.skill, current=gap.current_score, target=gap.target_score)
        for gap in report.missing_skills[:6]
    ]


def _evidence_history(
    report: CareerReport,
    resume_score: float,
    github_score: float,
    github_depth: float,
) -> list[ReadinessHistoryPoint]:
    github_blend = round((github_score * 0.55 + github_depth * 0.45), 1) if github_score or github_depth else 0.0
    return [
        ReadinessHistoryPoint(week="Resume", readiness=resume_score, github=0, resume=resume_score),
        ReadinessHistoryPoint(week="GitHub", readiness=github_blend, github=github_blend, resume=0),
        ReadinessHistoryPoint(week="Skills", readiness=report.skill_match_percent, github=0, resume=0),
        ReadinessHistoryPoint(week="Overall", readiness=report.readiness_score, github=github_blend, resume=resume_score),
    ]


def _salary_projection(synced_at: datetime, salary_lpa: float, readiness: float) -> list[SalaryProjectionPoint]:
    from datetime import timedelta

    base = max(4.0, salary_lpa)
    growth = 0.028 + readiness * 0.00035
    points: list[SalaryProjectionPoint] = []
    for offset in range(6):
        month = (synced_at + timedelta(days=offset * 30)).strftime("%b")
        median = base * (1 + offset * growth)
        spread = 0.14 + max(0.0, (70 - readiness)) * 0.002
        points.append(
            SalaryProjectionPoint(
                month=month,
                low=round(median * (1 - spread), 1),
                median=round(median, 1),
                high=round(median * (1 + spread + 0.08), 1),
            )
        )
    return points


def _notifications(
    report: CareerReport,
    github: GitHubSnapshotOut | None,
    resume_score: float,
    completeness: float,
) -> list[NotificationOut]:
    notifications = [
        NotificationOut(
            title="Evidence-based analysis",
            body=(
                f"Readiness {round(report.readiness_score)}% · reality check {round(report.reality_check_score)}% "
                f"· {round(completeness)}% profile evidence."
            ),
            type="insight",
        )
    ]
    if github:
        notifications.append(
            NotificationOut(
                title="GitHub signal updated",
                body=(
                    f"{github.repositories_analyzed} repos · languages {', '.join(github.top_languages[:3]) or 'n/a'} · "
                    f"activity {round(github.activity_score)}%."
                ),
                type="success",
            )
        )
        if github.findings:
            notifications.append(
                NotificationOut(title="GitHub insight", body=github.findings[0], type="info")
            )
    else:
        notifications.append(
            NotificationOut(
                title="GitHub not connected",
                body="Add a GitHub username to score skills from real repository languages and activity.",
                type="warning",
            )
        )
    if resume_score <= 0:
        notifications.append(
            NotificationOut(
                title="Resume evidence missing",
                body="Paste resume text or upload a PDF so skills can be scored from projects and bullets.",
                type="warning",
            )
        )
    elif resume_score < 40:
        notifications.append(
            NotificationOut(
                title="Resume needs stronger proof",
                body="Add quantified bullets, project outcomes, and role keywords tied to shipped work.",
                type="warning",
            )
        )
    if report.missing_skills:
        gap = report.missing_skills[0]
        notifications.append(
            NotificationOut(
                title=f"Top gap: {gap.skill}",
                body=gap.reason,
                type="warning" if gap.gap >= 35 else "info",
            )
        )
    return notifications


def _empty_activity(synced_at: datetime) -> list[GitHubActivityPoint]:
    from datetime import timedelta

    today = synced_at.date()
    return [
        GitHubActivityPoint(day=(today - timedelta(days=offset)).strftime("%a"))
        for offset in range(6, -1, -1)
    ]
