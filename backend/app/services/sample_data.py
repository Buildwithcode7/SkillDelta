from __future__ import annotations

CORE_SKILLS = [
    "React",
    "TypeScript",
    "Next.js",
    "FastAPI",
    "PostgreSQL",
    "OpenAI API",
    "Embeddings",
    "RAG",
    "System Design",
    "Testing",
    "Docker",
    "CI/CD"
]

RESOURCE_BANK = {
    "videos": [
        "YouTube: Production RAG architecture walkthrough",
        "NPTEL: Database design and indexing fundamentals",
        "YouTube: System design for ranking and recommendation systems"
    ],
    "github": [
        "github.com/openai/openai-cookbook",
        "github.com/fastapi/full-stack-fastapi-template",
        "github.com/vercel/ai"
    ],
    "docs": [
        "Next.js App Router documentation",
        "FastAPI security documentation",
        "PostgreSQL indexing documentation",
        "OpenAI API documentation"
    ]
}

PROJECT_BLUEPRINTS = [
    {
        "title": "ATS Resume Lens",
        "level": "beginner",
        "description": "Compare a resume with a target job post, detect missing keywords, and rewrite weak bullets.",
        "tech_stack": ["Next.js", "FastAPI", "OpenAI", "PostgreSQL"],
        "github_structure": {
            "frontend": ["app/resume-analyzer", "components/resume-dropzone.tsx"],
            "backend": ["app/api/resume.py", "app/services/resume_parser.py"]
        },
        "deployment_guide": ["Deploy frontend to Vercel", "Deploy API to Railway", "Store PDFs in Supabase Storage"],
        "apis_to_use": ["OpenAI Responses API", "Supabase Storage"],
        "resume_impact_score": 72
    },
    {
        "title": "GitHub Skill Miner",
        "level": "intermediate",
        "description": "Infer skills from repository languages, README quality, commit behavior, and project structure.",
        "tech_stack": ["Python", "GitHub API", "Embeddings", "Recharts"],
        "github_structure": {
            "backend": ["app/services/github_analyzer.py", "app/api/github.py"],
            "frontend": ["app/analysis", "components/skill-heatmap.tsx"]
        },
        "deployment_guide": ["Create GitHub OAuth app", "Cache repository metadata", "Render activity trends"],
        "apis_to_use": ["GitHub REST API", "OpenAI Embeddings"],
        "resume_impact_score": 84
    },
    {
        "title": "Career Twin Agent",
        "level": "advanced",
        "description": "Build a persistent AI mentor that adapts roadmaps from progress, skill decay, and interview feedback.",
        "tech_stack": ["Agents", "RAG", "Queues", "PostgreSQL", "Clerk"],
        "github_structure": {
            "backend": ["app/services/career_twin.py", "app/workers/roadmap_refresher.py"],
            "frontend": ["app/career-twin", "components/mentor-chat.tsx"]
        },
        "deployment_guide": ["Add background worker", "Persist memory summaries", "Schedule weekly report generation"],
        "apis_to_use": ["OpenAI Responses API", "Clerk", "PostgreSQL"],
        "resume_impact_score": 93
    }
]
