from app.schemas import RoadmapRequest, SkillGap
from app.services.roadmap_builder import build_roadmap_from_analysis
from fastapi.testclient import TestClient

from app.main import app


def test_roadmap_prioritizes_high_gap_skills() -> None:
    payload = RoadmapRequest(
        dream_job_title="AI Full-Stack Engineer",
        days=12,
        skill_gaps=[
            SkillGap(
                skill="RAG",
                current_score=30,
                target_score=88,
                gap=58,
                impact="High",
                reason="Critical gap",
                resources=["RAG guide"],
            ),
            SkillGap(
                skill="Testing",
                current_score=50,
                target_score=78,
                gap=28,
                impact="Medium",
                reason="Moderate gap",
                resources=["pytest docs"],
            ),
        ],
    )
    roadmap = build_roadmap_from_analysis(payload)
    assert len(roadmap.tasks) == 12
    rag_days = sum(1 for task in roadmap.tasks if task.skill == "RAG")
    testing_days = sum(1 for task in roadmap.tasks if task.skill == "Testing")
    assert rag_days > testing_days
    assert roadmap.tasks[0].skill == "RAG"
    assert all(task.study_focus for task in roadmap.tasks)


def test_dashboard_includes_full_roadmap() -> None:
    client = TestClient(app)
    response = client.post(
        "/api/dashboard",
        json={
            "dream_job_title": "AI Full-Stack Engineer",
            "github_username": "octo-builder",
            "resume_text": "React TypeScript FastAPI PostgreSQL OpenAI RAG testing deployment",
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert "roadmap" in payload
    assert len(payload["roadmap"]["tasks"]) == 30
    assert len(payload["roadmap_preview"]) == 7
    assert payload["gap_analysis"]
