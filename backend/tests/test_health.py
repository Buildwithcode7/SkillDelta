from fastapi.testclient import TestClient

from app.main import app


def test_health() -> None:
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analyze_demo_response() -> None:
    client = TestClient(app)
    response = client.post(
        "/api/analyze",
        json={
            "github_username": "octo-builder",
            "dream_job_title": "AI Full-Stack Engineer",
            "resume_text": "React TypeScript Next.js OpenAI portfolio"
        }
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["readiness_score"] > 0
    assert payload["missing_skills"]
