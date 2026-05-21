from fastapi.testclient import TestClient

from app.main import app
from app.services.interview_questions import generate_random_questions


def test_generate_random_questions_count_and_uniqueness() -> None:
    questions = generate_random_questions(
        dream_job_title="AI Full-Stack Engineer",
        mode="technical",
        weak_skills=["FastAPI", "React", "PostgreSQL"],
        count=5,
    )
    assert len(questions) == 5
    assert len(set(questions)) == 5


def test_mock_interview_session_varies_between_calls() -> None:
    client = TestClient(app)
    payloads: list[list[str]] = []
    for _ in range(6):
        response = client.post(
            "/api/mock-interview/session",
            json={
                "dream_job_title": "AI Full-Stack Engineer",
                "mode": "technical",
                "weak_skills": ["FastAPI", "React", "RAG"],
            },
        )
        assert response.status_code == 200
        payloads.append(response.json()["questions"])

    unique_sets = {tuple(questions) for questions in payloads}
    assert len(unique_sets) >= 2
