from app.schemas import CertificateGenerateRequest, CertificateStatsIn, ProfileInput
from app.services.certificate import build_participation_certificate, generate_certificate_payload
from app.services.profile_evidence import build_career_report
from fastapi.testclient import TestClient

from app.main import app


def test_certificate_tier_and_metrics() -> None:
    profile = ProfileInput(
        dream_job_title="AI Full-Stack Engineer",
        resume_text="React TypeScript FastAPI PostgreSQL OpenAI RAG pytest Docker deployment",
        github_username="dev",
    )
    report = build_career_report(profile)
    cert = build_participation_certificate(
        profile=profile,
        report=report,
        github=None,
        recipient_name="Alex Rivera",
        stats=CertificateStatsIn(
            roadmap_completion_percent=45,
            roadmap_tasks_completed=9,
            roadmap_tasks_total=20,
            interview_overall_score=72,
            interview_mode="technical",
            achievements=["Roadmap Sprinter"],
        ),
    )
    assert cert.recipient_name == "Alex Rivera"
    assert cert.certificate_id.startswith("SD-")
    assert len(cert.verification_code) == 10
    assert cert.overall_score > 0
    assert cert.performance_tier in {"Distinguished", "Proficient", "Achiever", "Participating"}
    assert any(metric.label == "Mock Interview" for metric in cert.metrics)


def test_certificate_api_endpoint() -> None:
    client = TestClient(app)
    response = client.post(
        "/api/certificate/generate",
        json={
            "recipient_name": "Jordan Lee",
            "profile": {
                "dream_job_title": "Backend Engineer",
                "resume_text": "Python FastAPI PostgreSQL pytest system design",
            },
            "stats": {
                "roadmap_completion_percent": 25,
                "roadmap_tasks_completed": 5,
                "roadmap_tasks_total": 20,
            },
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["recipient_name"] == "Jordan Lee"
    assert payload["summary"]
    assert payload["highlights"]
