from app.services.roadmap_builder import build_roadmap_from_analysis
from app.schemas import RoadmapRequest, SkillGap
from fastapi.testclient import TestClient

from app.main import app


def test_roadmap_tasks_include_youtube_and_leetcode() -> None:
    roadmap = build_roadmap_from_analysis(
        RoadmapRequest(
            dream_job_title="AI Full-Stack Engineer",
            days=7,
            skill_gaps=[
                SkillGap(
                    skill="FastAPI",
                    current_score=35,
                    target_score=82,
                    gap=47,
                    impact="High",
                    reason="Need API depth",
                    resources=[],
                )
            ],
        )
    )
    task = roadmap.tasks[0]
    assert task.youtube_videos
    assert all(video.url.startswith("https://www.youtube.com/") for video in task.youtube_videos)
    assert task.leetcode_problems
    assert task.leetcode_problems[0].number > 0
    assert "leetcode.com/problems/" in task.leetcode_problems[0].url


def test_dashboard_roadmap_has_curriculum_links() -> None:
    client = TestClient(app)
    response = client.post(
        "/api/dashboard",
        json={
            "dream_job_title": "AI Full-Stack Engineer",
            "resume_text": "React TypeScript FastAPI PostgreSQL OpenAI RAG testing",
        },
    )
    assert response.status_code == 200
    task = response.json()["roadmap"]["tasks"][0]
    assert task.get("youtube_videos")
    assert task.get("leetcode_problems")
