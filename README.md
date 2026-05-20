# SkillDelta

SkillDelta is an AI Career Intelligence Platform that analyzes a user profile, resume, GitHub presence, portfolio, and target role to identify skill gaps and generate a job-readiness roadmap.

## What is included

- Next.js 15 frontend with TypeScript, TailwindCSS, Framer Motion, Recharts, shadcn-style primitives, dark/light mode, command palette, gamified UI, and all requested product pages.
- FastAPI backend with SQLAlchemy models, PostgreSQL-ready configuration, sample AI services, resume parsing hooks, roadmap generation, interview feedback, project generation, progress tracking, and report endpoints.
- Database schema, sample data, environment templates, and deployment notes for Vercel plus Railway/Render.

## Quick start

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

For the backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs at `http://localhost:8000`.

## AI behavior

The backend works without an API key by returning high-quality deterministic demo intelligence. Add `OPENAI_API_KEY` to enable live AI generation through `backend/app/services/ai.py`.

## Production wiring

- Frontend: deploy `frontend` to Vercel and set `NEXT_PUBLIC_API_URL`.
- Backend: deploy `backend` to Railway or Render and set `DATABASE_URL`, `OPENAI_API_KEY`, and `ALLOWED_ORIGINS`.
- Auth: add Clerk keys and connect the existing auth pages to Clerk middleware/components.
- Storage: store resume uploads in Supabase Storage or an S3-compatible bucket and persist analyses in PostgreSQL.
