from __future__ import annotations

import re
from dataclasses import dataclass
from statistics import mean

from app.schemas import CareerReport, GitHubSnapshotOut, ProfileInput, RoadmapTaskOut, SkillGap
from app.services.static_resources import CORE_SKILLS, RESOURCE_BANK

ROLE_SKILLS: dict[str, list[str]] = {
    "ai": ["Python", "FastAPI", "OpenAI API", "Embeddings", "RAG", "PostgreSQL", "Testing", "System Design", "Docker"],
    "full-stack": ["React", "TypeScript", "Next.js", "FastAPI", "PostgreSQL", "Testing", "CI/CD", "System Design"],
    "frontend": ["React", "TypeScript", "Next.js", "Testing", "Design Systems", "Accessibility", "Performance"],
    "backend": ["Python", "FastAPI", "PostgreSQL", "System Design", "Docker", "Testing", "CI/CD"],
    "data": ["Python", "SQL", "PostgreSQL", "Data Modeling", "Dashboards", "Statistics", "Pipelines"],
    "devops": ["Docker", "CI/CD", "Cloud", "Monitoring", "Security", "System Design"],
}

ALIASES: dict[str, list[str]] = {
    "OpenAI API": ["openai", "gpt", "llm", "responses api", "chatgpt"],
    "Embeddings": ["embedding", "vector", "semantic search"],
    "RAG": ["rag", "retrieval", "chunking", "langchain"],
    "PostgreSQL": ["postgres", "postgresql", "sql", "psycopg"],
    "Next.js": ["next.js", "nextjs", "app router"],
    "TypeScript": ["typescript", " ts ", "tsx"],
    "CI/CD": ["ci/cd", "github actions", "deployment", "pipeline", "continuous integration"],
    "System Design": ["system design", "architecture", "scalability", "microservice"],
    "Testing": ["testing", "pytest", "playwright", "jest", "unit test", "integration test", "e2e"],
    "FastAPI": ["fastapi", "fast api"],
    "React": ["react", "reactjs", "react.js"],
    "Python": ["python", "django", "flask"],
    "Docker": ["docker", "container", "kubernetes", "k8s"],
    "Design Systems": ["design system", "storybook", "component library"],
    "Accessibility": ["accessibility", "a11y", "wcag"],
    "Performance": ["performance", "lighthouse", "core web vitals", "web vitals"],
    "SQL": ["sql", "query", "database"],
    "Cloud": ["aws", "gcp", "azure", "cloud"],
    "Monitoring": ["monitoring", "observability", "datadog", "prometheus", "grafana"],
    "Security": ["security", "oauth", "auth", "jwt"],
    "Pipelines": ["pipeline", "etl", "airflow", "spark"],
    "Statistics": ["statistics", "statistical", "probability"],
    "Dashboards": ["dashboard", "visualization", "analytics"],
}

GITHUB_LANGUAGE_BOOSTS: dict[str, dict[str, float]] = {
    "Python": {"Python": 28, "FastAPI": 18, "Testing": 8},
    "JavaScript": {"React": 16, "TypeScript": 12, "Next.js": 10, "Testing": 6},
    "TypeScript": {"TypeScript": 30, "React": 18, "Next.js": 14, "Testing": 8},
    "Go": {"System Design": 12, "Docker": 10},
    "Java": {"System Design": 10, "Testing": 8},
    "Rust": {"System Design": 10, "Performance": 8},
    "HTML": {"React": 6, "Accessibility": 6},
    "CSS": {"Design Systems": 10, "Performance": 6},
    "Shell": {"CI/CD": 12, "Docker": 10},
    "Dockerfile": {"Docker": 22, "CI/CD": 10},
    "Jupyter Notebook": {"Python": 14, "Data Modeling": 10},
}

ROLE_SALARY_BASE_LPA: dict[str, float] = {
    "intern": 3.5,
    "junior": 6.0,
    "entry": 5.5,
    "associate": 8.0,
    "mid": 12.0,
    "senior": 18.0,
    "lead": 24.0,
    "staff": 28.0,
    "principal": 32.0,
}


@dataclass(frozen=True)
class SkillEvidence:
    skill: str
    resume_points: float
    github_points: float
    portfolio_points: float
    mention_points: float
    current_score: float
    target_score: float

    @property
    def gap(self) -> float:
        return round(max(0.0, self.target_score - self.current_score), 1)

    @property
    def primary_source(self) -> str:
        scores = {
            "resume": self.resume_points,
            "github": self.github_points,
            "portfolio": self.portfolio_points,
            "mentions": self.mention_points,
        }
        return max(scores, key=scores.get)


def target_skills_for_role(dream_job_title: str) -> list[str]:
    role = dream_job_title.lower()
    skills: list[str] = []
    for key, values in ROLE_SKILLS.items():
        if key in role:
            skills.extend(values)
    if not skills:
        skills = ["React", "TypeScript", "FastAPI", "PostgreSQL", "Testing", "System Design", "Python"]
    return list(dict.fromkeys(skills))


def target_score_for_skill(skill: str, dream_job_title: str) -> float:
    role = dream_job_title.lower()
    seniority_boost = 6.0 if any(word in role for word in ("senior", "lead", "staff", "principal")) else 0.0
    ai_boost = 8.0 if "ai" in role and skill in {"RAG", "OpenAI API", "Embeddings", "System Design"} else 0.0
    core = 76.0 + seniority_boost + ai_boost
    if skill in {"GitHub", "CI/CD", "Testing"}:
        return min(92.0, core - 4.0)
    return min(94.0, core)


def evidence_completeness(profile: ProfileInput, github: GitHubSnapshotOut | None) -> float:
    score = 0.0
    if profile.dream_job_title.strip():
        score += 15.0
    resume = (profile.resume_text or "").strip()
    if len(resume) >= 80:
        score += 20.0
    if len(resume) >= 400:
        score += 15.0
    if profile.github_username:
        score += 12.0
    if github:
        score += 18.0
    if profile.portfolio_url:
        score += 10.0
    if profile.linkedin_url:
        score += 10.0
    return round(min(100.0, score), 1)


def resume_strength_score(resume_text: str | None) -> float:
    text = (resume_text or "").strip()
    if not text:
        return 0.0
    lower = text.lower()
    sections = sum(keyword in lower for keyword in ["experience", "project", "education", "skills", "summary", "work"])
    quantified = min(12, sum(1 for token in re.findall(r"\d+%?|\$\d+|\d+\+?", text)))
    action_verbs = sum(
        verb in lower
        for verb in ["built", "shipped", "improved", "reduced", "designed", "implemented", "led", "deployed", "optimized"]
    )
    bullets = len([line for line in text.splitlines() if len(line.strip()) >= 24])
    return round(min(100.0, 18 + sections * 7 + quantified * 4 + action_verbs * 4 + min(bullets, 8) * 3), 1)


def compute_skill_evidence(
    profile: ProfileInput,
    *,
    github: GitHubSnapshotOut | None = None,
) -> list[SkillEvidence]:
    target_skills = target_skills_for_role(profile.dream_job_title)
    resume_text = _normalized_text(profile.resume_text)
    profile_text = _profile_text(profile)
    github_text = " ".join(github.findings).lower() if github else ""
    resume_strength = resume_strength_score(profile.resume_text) / 100.0

    results: list[SkillEvidence] = []
    for skill in target_skills:
        aliases = [skill, *ALIASES.get(skill, [])]
        mention_points = _mention_score(aliases, profile_text)
        resume_points = _resume_skill_score(aliases, resume_text, resume_strength)
        github_points = _github_skill_score(skill, aliases, github, github_text)
        portfolio_points = 10.0 if profile.portfolio_url and mention_points > 0 else 0.0

        current = round(
            min(
                96.0,
                mention_points * 0.18
                + resume_points * 0.42
                + github_points * 0.32
                + portfolio_points * 0.08,
            ),
            1,
        )
        if not profile.resume_text and not github:
            current = round(current * 0.55, 1)

        results.append(
            SkillEvidence(
                skill=skill,
                resume_points=round(resume_points, 1),
                github_points=round(github_points, 1),
                portfolio_points=round(portfolio_points, 1),
                mention_points=round(mention_points, 1),
                current_score=current,
                target_score=target_score_for_skill(skill, profile.dream_job_title),
            )
        )
    return results


def build_career_report(
    profile: ProfileInput,
    *,
    github: GitHubSnapshotOut | None = None,
) -> CareerReport:
    evidences = compute_skill_evidence(profile, github=github)
    completeness = evidence_completeness(profile, github)
    resume_score = resume_strength_score(profile.resume_text)
    github_score = github.activity_score if github else 0.0
    github_depth = github.project_depth_score if github else 0.0

    gaps = [_evidence_to_gap(evidence, profile.dream_job_title, index) for index, evidence in enumerate(evidences)]
    gaps.sort(key=lambda gap: gap.gap, reverse=True)
    missing = [gap for gap in gaps if gap.gap >= 8][:8] or gaps[:4]

    readiness = _readiness_score(evidences)
    skill_match = _skill_match_percent(evidences)
    reality = _reality_check_score(readiness, skill_match, resume_score, github_score, github_depth, completeness)
    interview_probability = _interview_probability(readiness, skill_match, resume_score, github_score, completeness)
    salary = _salary_prediction_lpa(profile.dream_job_title, readiness, evidences, resume_score, github_depth)

    extracted = _extracted_skills(profile, evidences, github)
    shadow_risk = _shadow_learning_risk(resume_score, github_score, github_depth, completeness)
    burnout_risk = _burnout_risk(len(missing), completeness, readiness)

    return CareerReport(
        readiness_score=readiness,
        skill_match_percent=skill_match,
        reality_check_score=reality,
        interview_probability=interview_probability,
        salary_prediction_lpa=salary,
        missing_skills=missing,
        extracted_skills=extracted,
        shadow_learning_risk=shadow_risk,
        burnout_risk=burnout_risk,
        hiring_trend_radar=_hiring_trends(profile.dream_job_title, [e.skill for e in evidences]),
        roadmap_preview=[
            _roadmap_preview_task(day=day, skill=missing[(day - 1) % len(missing)].skill)
            for day in range(1, min(8, len(missing) + 1))
        ],
        recommendations=_recommendations(profile, missing, completeness, github),
    )


def _readiness_score(evidences: list[SkillEvidence]) -> float:
    if not evidences:
        return 0.0
    ratios = [min(1.0, evidence.current_score / max(evidence.target_score, 1.0)) for evidence in evidences]
    return round(mean(ratios) * 100, 1)


def _skill_match_percent(evidences: list[SkillEvidence]) -> float:
    if not evidences:
        return 0.0
    matched = sum(1 for evidence in evidences if evidence.current_score >= evidence.target_score * 0.78)
    return round(matched / len(evidences) * 100, 1)


def _reality_check_score(
    readiness: float,
    skill_match: float,
    resume_score: float,
    github_score: float,
    github_depth: float,
    completeness: float,
) -> float:
    github_blend = round((github_score * 0.55 + github_depth * 0.45), 1) if github_score or github_depth else 0.0
    base = readiness * 0.38 + skill_match * 0.22 + resume_score * 0.22 + github_blend * 0.18
    evidence_bonus = completeness * 0.12
    inflation_penalty = max(0.0, readiness - min(resume_score, github_blend or resume_score) - 18) * 0.35
    return round(max(0.0, min(100.0, base + evidence_bonus - inflation_penalty)), 1)


def _interview_probability(
    readiness: float,
    skill_match: float,
    resume_score: float,
    github_score: float,
    completeness: float,
) -> float:
    raw = readiness * 0.42 + skill_match * 0.28 + resume_score * 0.15 + min(github_score, 90) * 0.1 + completeness * 0.05
    if completeness < 35:
        raw *= 0.72
    if resume_score < 25 and github_score < 20:
        raw *= 0.8
    return round(max(5.0, min(92.0, raw)), 1)


def _salary_prediction_lpa(
    dream_job_title: str,
    readiness: float,
    evidences: list[SkillEvidence],
    resume_score: float,
    github_depth: float,
) -> float:
    role = dream_job_title.lower()
    base = 7.0
    for key, value in ROLE_SALARY_BASE_LPA.items():
        if key in role:
            base = value
            break
    proof_bonus = min(6.0, len([e for e in evidences if e.current_score >= e.target_score * 0.7]) * 0.8)
    signal = readiness * 0.045 + resume_score * 0.02 + github_depth * 0.015 + proof_bonus
    return round(max(3.5, min(45.0, base + signal)), 1)


def _shadow_learning_risk(resume_score: float, github_score: float, github_depth: float, completeness: float) -> float:
    github_proof = max(github_score, github_depth)
    gap = max(0.0, 55 - resume_score * 0.45 - github_proof * 0.4)
    if completeness < 40:
        gap += 12
    return round(min(95.0, gap), 1)


def _burnout_risk(missing_count: int, completeness: float, readiness: float) -> float:
    load = 22 + missing_count * 3.5
    if completeness < 50 and readiness < 45:
        load += 10
    if readiness > 75:
        load -= 8
    return round(max(10.0, min(72.0, load)), 1)


def _evidence_to_gap(evidence: SkillEvidence, role: str, index: int) -> SkillGap:
    gap = evidence.gap
    if gap >= 35:
        impact = "High"
    elif gap >= 18:
        impact = "Medium"
    else:
        impact = "Low"

    source = evidence.primary_source
    reason = (
        f"{role} needs stronger {evidence.skill} proof. "
        f"Best signal today is from {source} "
        f"(resume {round(evidence.resume_points)}%, GitHub {round(evidence.github_points)}%)."
    )
    return SkillGap(
        skill=evidence.skill,
        current_score=evidence.current_score,
        target_score=evidence.target_score,
        gap=gap,
        impact=impact,
        reason=reason,
        resources=_resources_for(evidence.skill),
    )


def _mention_score(aliases: list[str], text: str) -> float:
    hits = sum(1 for alias in aliases if alias.lower() in text)
    return min(40.0, 12 + hits * 10)


def _resume_skill_score(aliases: list[str], resume_text: str, resume_strength: float) -> float:
    if not resume_text:
        return 0.0
    hits = sum(resume_text.count(alias.lower()) for alias in aliases)
    if hits == 0:
        return round(resume_strength * 8, 1)
    depth = min(55.0, 18 + hits * 14)
    project_bonus = 12.0 if any(word in resume_text for word in ("project", "built", "shipped", "deployed")) else 0.0
    return round(min(88.0, depth + project_bonus + resume_strength * 20), 1)


def _github_skill_score(
    skill: str,
    aliases: list[str],
    github: GitHubSnapshotOut | None,
    github_text: str,
) -> float:
    if not github:
        return 0.0

    score = 0.0
    for language, boosts in GITHUB_LANGUAGE_BOOSTS.items():
        if language in github.top_languages:
            score += boosts.get(skill, 0.0)

    if any(alias.lower() in github_text for alias in aliases):
        score += 14.0

    activity_factor = min(22.0, github.activity_score * 0.18)
    depth_factor = min(18.0, github.project_depth_score * 0.14)
    if skill == "GitHub":
        score += min(40.0, activity_factor + depth_factor + 10)

    if github.repositories_analyzed >= 3 and score > 0:
        score += 6.0

    return round(min(85.0, score + activity_factor * 0.35 + depth_factor * 0.25), 1)


def _extracted_skills(
    profile: ProfileInput,
    evidences: list[SkillEvidence],
    github: GitHubSnapshotOut | None,
) -> list[str]:
    text = _profile_text(profile)
    skills = {evidence.skill for evidence in evidences if evidence.current_score >= evidence.target_score * 0.72}
    for skill in sorted(set(CORE_SKILLS)):
        aliases = [skill, *ALIASES.get(skill, [])]
        if any(alias.lower() in text for alias in aliases):
            skills.add(skill)
    if github:
        for language in github.top_languages:
            for mapped_skill in GITHUB_LANGUAGE_BOOSTS.get(language, {}):
                if any(e.skill == mapped_skill and e.github_points >= 12 for e in evidences):
                    skills.add(mapped_skill)
    if profile.github_username:
        skills.add("GitHub")
    return sorted(skills)


def _recommendations(
    profile: ProfileInput,
    missing: list[SkillGap],
    completeness: float,
    github: GitHubSnapshotOut | None,
) -> list[str]:
    recs: list[str] = []
    if missing:
        top = missing[0]
        recs.append(
            f"Close the {top.skill} gap ({round(top.gap)} pts) with one shipped artifact and a quantified resume bullet."
        )
    if completeness < 55:
        recs.append("Add resume text and a public GitHub username before treating readiness as application-ready.")
    elif not profile.resume_text:
        recs.append("Resume text is missing — skill scores are inferred mainly from GitHub and role targets.")
    elif not github:
        recs.append("Connect GitHub to validate that your listed skills appear in recent public repositories.")
    if github and github.activity_score < 35:
        recs.append("Increase weekly public commits or PR reviews to strengthen your GitHub activity signal.")
    recs.append("Align each roadmap task with measurable proof: tests, README tradeoffs, and a demo link.")
    return recs[:4]


def _hiring_trends(role: str, skills: list[str]) -> list[str]:
    priority = [skill for skill in skills if skill in {"RAG", "System Design", "Testing", "PostgreSQL", "CI/CD", "TypeScript"}]
    return priority[:4] or [role.strip() or "Target role", "portfolio proof", "testing discipline", "communication"]


def _resources_for(skill: str) -> list[str]:
    docs = RESOURCE_BANK["docs"]
    github = RESOURCE_BANK["github"]
    videos = RESOURCE_BANK["videos"]
    if skill in {"RAG", "OpenAI API", "Embeddings"}:
        return [docs[-1], github[0], videos[0]]
    if skill in {"FastAPI", "Testing"}:
        return [docs[1], github[1], "FastAPI testing guide"]
    if skill == "PostgreSQL":
        return [docs[2], videos[1], "PostgreSQL EXPLAIN and indexing guide"]
    return [docs[0], github[-1], videos[-1]]


def _roadmap_preview_task(day: int, skill: str) -> RoadmapTaskOut:
    from app.services.skill_curriculum import pick_leetcode_for_task, pick_youtube_for_task

    phase_index = (day - 1) % 4
    youtube_videos = pick_youtube_for_task(skill, phase_index, day, count=2)
    leetcode_problems = pick_leetcode_for_task(skill, phase_index, day)
    return RoadmapTaskOut(
        day=day,
        skill=skill,
        phase=["Foundations", "Applied practice", "Proof sprint", "Interview ready"][phase_index],
        topic=f"Day {day}: {skill} evidence sprint",
        difficulty=["Core", "Stretch", "Advanced"][day % 3],
        estimated_hours=round(1.25 + (day % 4) * 0.45, 1),
        recommended_videos=[video.title for video in youtube_videos],
        github_resources=RESOURCE_BANK["github"][:2],
        documentation=_resources_for(skill)[:2],
        mini_challenge=f"Publish proof that demonstrates {skill} with tests or metrics.",
        youtube_videos=youtube_videos,
        leetcode_problems=leetcode_problems,
    )


def _normalized_text(text: str | None) -> str:
    return (text or "").lower()


def _profile_text(profile: ProfileInput) -> str:
    return " ".join(
        value
        for value in [
            str(profile.linkedin_url or ""),
            profile.github_username or "",
            str(profile.portfolio_url or ""),
            profile.dream_job_title,
            profile.resume_text or "",
        ]
        if value
    ).lower()
