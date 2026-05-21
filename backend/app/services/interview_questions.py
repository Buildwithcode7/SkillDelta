from __future__ import annotations

import random
import uuid
from typing import Callable


QuestionBuilder = Callable[[str, list[str]], str]


def _skill_questions(role: str, skills: list[str]) -> list[str]:
    templates = [
        "How would you demonstrate {skill} in production for a {role} position?",
        "What tradeoffs did you consider the last time you used {skill} on a real project?",
        "If we audited your GitHub tomorrow, what evidence would prove your {skill} depth?",
        "Describe a failure you had while learning {skill} and how you recovered.",
        "How do you test and monitor systems that rely on {skill}?",
        "Compare two approaches to solving a {skill} problem and defend your pick.",
        "What would you ship in week one to show {skill} competence for {role}?",
        "How do you keep {skill} current without tutorial-only learning?",
    ]
    pool: list[str] = []
    for skill in skills:
        for template in templates:
            pool.append(template.format(skill=skill, role=role))
    return pool


TECHNICAL_GENERAL: list[QuestionBuilder] = [
    lambda role, _: f"Walk me through the architecture of your strongest project for {role}.",
    lambda role, _: f"What metrics would you track in the first 30 days as a new {role}?",
    lambda role, _: f"How do you decide when to refactor versus ship for a {role} team?",
    lambda role, _: f"Explain a performance bottleneck you fixed and how you validated the improvement.",
    lambda role, _: f"How do you design APIs that stay maintainable as a {role} codebase grows?",
    lambda role, _: f"Describe how you handle auth, validation, and error contracts in backend services.",
    lambda role, _: f"What does 'production ready' mean to you for a {role} feature?",
    lambda role, _: "How do you debug an issue that only appears under load or in staging?",
    lambda role, _: f"Tell me about a technical decision you would make differently today as a {role}.",
    lambda role, _: "How do you balance speed, quality, and scope when the deadline is fixed?",
]

CODING_GENERAL: list[QuestionBuilder] = [
    lambda role, _: "Implement a function that merges two sorted lists of skill scores in O(n) time.",
    lambda role, _: "Write code to detect duplicate entries in a list of interview transcripts.",
    lambda role, _: "Given a log of API latencies, return the p95 without sorting the full array.",
    lambda role, _: "Design a rate limiter for a public API. Explain your data structure choice.",
    lambda role, _: "Parse a resume string and return the top five inferred skills with counts.",
    lambda role, _: "Find the first non-repeating character in a string. Discuss time and space complexity.",
    lambda role, _: f"Sketch a module layout for a {role} take-home with tests included.",
    lambda role, _: "Write pseudocode for a job queue worker with retries and dead-letter handling.",
    lambda role, _: "How would you test a function that calls an external GitHub API?",
    lambda role, _: "Refactor this verbally: nested loops building a skill-gap matrix — improve readability.",
]

BEHAVIORAL_GENERAL: list[QuestionBuilder] = [
    lambda role, _: "Tell me about a time you disagreed with a teammate. What was the outcome?",
    lambda role, _: "Describe a situation where you had incomplete requirements. How did you proceed?",
    lambda role, _: f"Give an example of mentoring or unblocking someone while preparing for {role}.",
    lambda role, _: "Tell me about a mistake you owned publicly. What changed afterward?",
    lambda role, _: "When did you push back on scope, and how did you communicate it?",
    lambda role, _: "Describe a high-pressure deadline and how you prioritized work.",
    lambda role, _: "Tell me about feedback that changed how you write code or communicate.",
    lambda role, _: "Share a time you improved a process for the whole team, not just your tasks.",
    lambda role, _: "How do you handle ambiguity when the stakeholder keeps changing direction?",
    lambda role, _: "Tell me about a project you are proud of and the measurable impact it had.",
]

SYSTEM_DESIGN_GENERAL: list[QuestionBuilder] = [
    lambda role, _: f"Design a real-time career dashboard for {role} candidates. Cover data flow and scaling.",
    lambda role, _: "How would you architect a mock-interview platform with video, speech, and scoring?",
    lambda role, _: "Design a notification system with email, in-app, and digest preferences.",
    lambda role, _: "Sketch a multi-tenant SaaS schema for users, goals, roadmaps, and AI reports.",
    lambda role, _: "How would you store and query skill scores over time for analytics?",
    lambda role, _: "Design rate limiting and caching for an AI-heavy API with variable latency.",
    lambda role, _: "Walk through deploying frontend and backend with zero-downtime releases.",
    lambda role, _: "How would you handle resume uploads, virus scanning, and text extraction at scale?",
    lambda role, _: "Design a GitHub ingestion pipeline that respects API rate limits.",
    lambda role, _: "What failure modes matter most in a career-coaching product and how do you mitigate them?",
]


MODE_POOLS: dict[str, list[QuestionBuilder]] = {
    "technical": TECHNICAL_GENERAL,
    "coding": CODING_GENERAL,
    "behavioral": BEHAVIORAL_GENERAL,
    "system design": SYSTEM_DESIGN_GENERAL,
    "system": SYSTEM_DESIGN_GENERAL,
}


def generate_random_questions(
    *,
    dream_job_title: str,
    mode: str,
    weak_skills: list[str],
    count: int = 5,
) -> list[str]:
    normalized_mode = mode.lower().strip()
    skills = [skill.strip() for skill in weak_skills if skill.strip()]
    if not skills:
        skills = ["core stack", "system design", "testing"]

    pool: list[str] = []
    for key, builders in MODE_POOLS.items():
        if key in normalized_mode:
            pool.extend(builder(dream_job_title, skills) for builder in builders)

    if not pool:
        pool.extend(builder(dream_job_title, skills) for builder in TECHNICAL_GENERAL)

    pool.extend(_skill_questions(dream_job_title, skills))
    random.shuffle(pool)

    seen: set[str] = set()
    selected: list[str] = []
    for question in pool:
        if question in seen:
            continue
        seen.add(question)
        selected.append(question)
        if len(selected) >= count:
            break

    while len(selected) < count:
        extra_skill = random.choice(skills)
        filler = (
            f"Random follow-up: how would you prove {extra_skill} with code, tests, "
            f"and metrics for {dream_job_title}? (variant {uuid.uuid4().hex[:6]})"
        )
        if filler not in seen:
            seen.add(filler)
            selected.append(filler)

    return selected[:count]


def variety_seed() -> str:
    return uuid.uuid4().hex
