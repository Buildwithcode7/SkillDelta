from app.schemas import ProfileInput
from app.services.profile_evidence import (
    build_career_report,
    compute_skill_evidence,
    evidence_completeness,
    resume_strength_score,
)
from fastapi.testclient import TestClient

from app.main import app


def test_resume_strength_requires_content() -> None:
    assert resume_strength_score("") == 0.0
    strong = resume_strength_score(
        "Experience\nBuilt and shipped a FastAPI service with PostgreSQL. "
        "Improved latency by 35%. Led testing and deployment."
    )
    assert strong > 40


def test_evidence_completeness_rewards_sources() -> None:
    profile = ProfileInput(
        dream_job_title="AI Full-Stack Engineer",
        resume_text="x" * 120,
        github_username="octocat",
    )
    assert evidence_completeness(profile, None) >= 35


def test_skill_scores_use_resume_keywords() -> None:
    profile = ProfileInput(
        dream_job_title="AI Full-Stack Engineer",
        resume_text="Built RAG pipeline with OpenAI API, FastAPI, PostgreSQL, pytest, Docker deployment.",
    )
    evidences = compute_skill_evidence(profile)
    by_skill = {item.skill: item for item in evidences}
    assert by_skill["RAG"].resume_points > by_skill["Embeddings"].resume_points
    assert by_skill["RAG"].current_score > by_skill["Embeddings"].current_score


def test_github_languages_boost_matching_skills() -> None:
    from app.schemas import GitHubSnapshotOut
    from datetime import datetime, timezone

    profile = ProfileInput(dream_job_title="Frontend Engineer", github_username="dev")
    github = GitHubSnapshotOut(
        username="dev",
        profile_url="https://github.com/dev",
        top_languages=["TypeScript", "JavaScript"],
        activity_score=55,
        project_depth_score=48,
        repositories_analyzed=6,
        findings=["Top public GitHub languages: TypeScript, JavaScript."],
        fetched_at=datetime.now(timezone.utc),
    )
    evidences = compute_skill_evidence(profile, github=github)
    ts = next(item for item in evidences if item.skill == "TypeScript")
    plain = compute_skill_evidence(ProfileInput(dream_job_title="Frontend Engineer"))
    plain_ts = next(item for item in plain if item.skill == "TypeScript")
    assert ts.github_points > plain_ts.github_points


def test_career_report_penalizes_missing_evidence_scores() -> None:
    sparse = build_career_report(ProfileInput(dream_job_title="Backend Engineer"))
    rich = build_career_report(
        ProfileInput(
            dream_job_title="Backend Engineer",
            resume_text="Python FastAPI PostgreSQL pytest Docker CI/CD system design shipped APIs",
        )
    )
    assert rich.readiness_score >= sparse.readiness_score


def test_dashboard_uses_evidence_metrics() -> None:
    client = TestClient(app)
    response = client.post(
        "/api/dashboard",
        json={
            "dream_job_title": "AI Full-Stack Engineer",
            "resume_text": "React TypeScript FastAPI PostgreSQL OpenAI RAG testing deployment metrics",
        },
    )
    assert response.status_code == 200
    payload = response.json()
    labels = {metric["label"] for metric in payload["metrics"]}
    assert "Reality Check" in labels
    assert "Evidence Coverage" in labels
    history = payload["readiness_history"]
    assert len(history) == 4
    assert history[0]["week"] == "Resume"
    heatmap = payload["heatmap_skills"]
    assert heatmap
    assert all(0 <= item["score"] <= 100 for item in heatmap)
    assert payload["skill_radar"][0]["current"] <= payload["skill_radar"][0]["target"]
