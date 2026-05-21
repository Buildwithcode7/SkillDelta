from fastapi.testclient import TestClient

from app.main import app


def test_analyze_interview_answer() -> None:
    client = TestClient(app)
    response = client.post(
        "/api/mock-interview/analyze-answer",
        json={
            "question": "Explain how you designed a scalable API.",
            "transcript": (
                "I built a FastAPI service with PostgreSQL, added caching, deployed with Docker, "
                "and improved latency by 35% because we measured p95 response time."
            ),
            "dream_job_title": "AI Full-Stack Engineer",
            "mode": "technical",
            "voice_metrics": {
                "words_per_minute": 145,
                "speaking_seconds": 42,
                "filler_count": 1,
                "long_pause_count": 0,
                "average_volume": 0.08,
                "volume_stability": 78,
                "energy_score": 72,
                "clarity_score": 81
            },
            "face_metrics": {
                "samples": 12,
                "face_visible_percent": 92,
                "eye_contact_score": 84,
                "posture_stability": 76,
                "lighting_score": 80,
                "expression_engagement": 79,
                "head_movement_variance": 1.2
            }
        }
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["overall_score"] > 0
    assert payload["communication_score"] > 0
    assert payload["strengths"]


def test_analyze_interview_session_report() -> None:
    client = TestClient(app)
    answer = client.post(
        "/api/mock-interview/analyze-answer",
        json={
            "question": "Tell me about a conflict on your team.",
            "transcript": "Situation: release risk. Task: align QA and backend. Action: added tests. Result: shipped on time.",
            "dream_job_title": "AI Full-Stack Engineer",
            "mode": "behavioral",
            "voice_metrics": {
                "words_per_minute": 130,
                "speaking_seconds": 35,
                "filler_count": 0,
                "long_pause_count": 1,
                "average_volume": 0.07,
                "volume_stability": 70,
                "energy_score": 68,
                "clarity_score": 75
            },
            "face_metrics": {
                "samples": 8,
                "face_visible_percent": 88,
                "eye_contact_score": 70,
                "posture_stability": 65,
                "lighting_score": 72,
                "expression_engagement": 74,
                "head_movement_variance": 2.1
            }
        }
    ).json()

    response = client.post(
        "/api/mock-interview/session-report",
        json={
            "dream_job_title": "AI Full-Stack Engineer",
            "mode": "behavioral",
            "answers": [answer]
        }
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["questions_answered"] == 1
    assert payload["overall_score"] > 0
    assert payload["next_steps"]
