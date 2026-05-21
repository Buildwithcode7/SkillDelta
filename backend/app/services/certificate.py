from __future__ import annotations

import hashlib
import uuid
from datetime import datetime, timezone

from app.schemas import (
    CareerReport,
    CertificateGenerateRequest,
    CertificateMetricOut,
    CertificateStatsIn,
    GitHubSnapshotOut,
    ParticipationCertificateOut,
    ProfileInput,
)
from app.services.profile_evidence import build_career_report, evidence_completeness, resume_strength_score


PROGRAM_NAME = "SkillDelta Career Intelligence Program"


def build_participation_certificate(
    *,
    profile: ProfileInput,
    report: CareerReport,
    github: GitHubSnapshotOut | None,
    recipient_name: str | None,
    stats: CertificateStatsIn,
) -> ParticipationCertificateOut:
    issued_at = datetime.now(timezone.utc)
    completeness = evidence_completeness(profile, github)
    github_activity = github.activity_score if github else 0.0
    resume_strength = stats.resume_strength
    if resume_strength is None:
        resume_strength = resume_strength_score(profile.resume_text)

    resume_ats = stats.resume_ats_score
    overall = _overall_score(
        readiness=report.readiness_score,
        skill_match=report.skill_match_percent,
        reality_check=report.reality_check_score,
        evidence_coverage=completeness,
        roadmap_completion=stats.roadmap_completion_percent,
        interview_score=stats.interview_overall_score,
        resume_strength=resume_strength,
        github_activity=github_activity,
    )
    tier = _performance_tier(overall)
    name = _recipient_name(recipient_name, profile, github)
    certificate_id = f"SD-{issued_at.strftime('%Y%m')}-{uuid.uuid4().hex[:8].upper()}"
    verification_code = hashlib.sha256(f"{certificate_id}:{name}:{overall}".encode()).hexdigest()[:10].upper()

    metrics = [
        CertificateMetricOut(label="Job Readiness", value=report.readiness_score),
        CertificateMetricOut(label="Skill Match", value=report.skill_match_percent),
        CertificateMetricOut(label="Reality Check", value=report.reality_check_score),
        CertificateMetricOut(label="Evidence Coverage", value=completeness),
        CertificateMetricOut(label="Roadmap Progress", value=stats.roadmap_completion_percent),
    ]
    if github_activity > 0:
        metrics.append(CertificateMetricOut(label="GitHub Activity", value=github_activity))
    if resume_strength > 0:
        metrics.append(CertificateMetricOut(label="Resume Strength", value=resume_strength))
    if resume_ats is not None and resume_ats > 0:
        metrics.append(CertificateMetricOut(label="Resume ATS", value=resume_ats))
    if stats.interview_overall_score is not None:
        metrics.append(CertificateMetricOut(label="Mock Interview", value=stats.interview_overall_score))

    highlights = _highlights(report, stats, github, tier, overall)
    summary = _summary(name, profile.dream_job_title, tier, overall, stats)

    return ParticipationCertificateOut(
        certificate_id=certificate_id,
        verification_code=verification_code,
        recipient_name=name,
        dream_job_title=profile.dream_job_title,
        program_name=PROGRAM_NAME,
        issued_at=issued_at,
        performance_tier=tier,
        overall_score=round(overall, 1),
        readiness_score=report.readiness_score,
        skill_match_percent=report.skill_match_percent,
        reality_check_score=report.reality_check_score,
        evidence_coverage=completeness,
        github_activity_score=github_activity,
        roadmap_completion_percent=stats.roadmap_completion_percent,
        interview_score=stats.interview_overall_score,
        metrics=metrics,
        highlights=highlights,
        summary=summary,
    )


def generate_certificate_payload(
    request: CertificateGenerateRequest,
    *,
    github: GitHubSnapshotOut | None,
) -> ParticipationCertificateOut:
    report = build_career_report(request.profile, github=github)
    return build_participation_certificate(
        profile=request.profile,
        report=report,
        github=github,
        recipient_name=request.recipient_name,
        stats=request.stats,
    )


def _overall_score(
    *,
    readiness: float,
    skill_match: float,
    reality_check: float,
    evidence_coverage: float,
    roadmap_completion: float,
    interview_score: float | None,
    resume_strength: float,
    github_activity: float,
) -> float:
    parts = [
        readiness * 0.28,
        skill_match * 0.18,
        reality_check * 0.16,
        evidence_coverage * 0.12,
        roadmap_completion * 0.14,
        resume_strength * 0.06,
        min(github_activity, 90) * 0.06,
    ]
    if interview_score is not None:
        parts.append(interview_score * 0.12)
        total_weight = 1.06
    else:
        total_weight = 0.94
    return min(100.0, sum(parts) / total_weight * (0.98 if evidence_coverage < 40 else 1.0))


def _performance_tier(overall: float) -> str:
    if overall >= 82:
        return "Distinguished"
    if overall >= 68:
        return "Proficient"
    if overall >= 50:
        return "Achiever"
    return "Participating"


def _recipient_name(
    recipient_name: str | None,
    profile: ProfileInput,
    github: GitHubSnapshotOut | None,
) -> str:
    if recipient_name and recipient_name.strip():
        return recipient_name.strip()
    if profile.github_username:
        return profile.github_username.strip().removeprefix("@")
    return "SkillDelta Participant"


def _highlights(
    report: CareerReport,
    stats: CertificateStatsIn,
    github: GitHubSnapshotOut | None,
    tier: str,
    overall: float,
) -> list[str]:
    items: list[str] = [
        f"Earned {tier} standing with an overall platform score of {round(overall)}%.",
        f"Demonstrated {round(report.readiness_score)}% job readiness toward the target role.",
    ]
    if stats.roadmap_tasks_total > 0:
        items.append(
            f"Completed {stats.roadmap_tasks_completed} of {stats.roadmap_tasks_total} roadmap tasks "
            f"({round(stats.roadmap_completion_percent)}% progress)."
        )
    if stats.interview_overall_score is not None:
        mode = stats.interview_mode or "mock interview"
        items.append(f"Scored {round(stats.interview_overall_score)}% on a live {mode} session.")
    if github and github.top_languages:
        items.append(f"Validated GitHub evidence across {', '.join(github.top_languages[:3])}.")
    if report.extracted_skills:
        items.append(f"Profile signals include {', '.join(report.extracted_skills[:4])}.")
    if stats.achievements:
        items.append(f"Achievements unlocked: {', '.join(stats.achievements[:3])}.")
    return items[:6]


def _summary(name: str, role: str, tier: str, overall: float, stats: CertificateStatsIn) -> str:
    roadmap_note = (
        f" with {round(stats.roadmap_completion_percent)}% roadmap completion"
        if stats.roadmap_tasks_total
        else ""
    )
    return (
        f"This certifies that {name} participated in the {PROGRAM_NAME} for {role}, "
        f"achieving {tier} performance ({round(overall)}% overall){roadmap_note}, "
        f"based on live profile evidence, skill analysis, and platform activity recorded at issuance."
    )
