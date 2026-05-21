from __future__ import annotations

import asyncio
from collections import Counter
from datetime import datetime, timedelta, timezone
from typing import Any

import httpx

from app.core.config import get_settings
from app.schemas import GitHubActivityPoint, GitHubSnapshotOut


class GitHubAnalyzer:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def snapshot(self, username: str | None) -> GitHubSnapshotOut | None:
        if not username:
            return None

        clean_username = username.strip().removeprefix("@")
        if not clean_username:
            return None

        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "SkillDelta-live-data"
        }
        if self.settings.github_token:
            headers["Authorization"] = f"Bearer {self.settings.github_token}"

        async with httpx.AsyncClient(base_url="https://api.github.com", headers=headers, timeout=10) as client:
            profile_response = await client.get(f"/users/{clean_username}")
            if profile_response.status_code == 404:
                return None
            profile_response.raise_for_status()

            repos_response, events_response = await self._fetch_parallel(
                client,
                f"/users/{clean_username}/repos",
                f"/users/{clean_username}/events/public"
            )

        profile = profile_response.json()
        repos = repos_response.json() if repos_response.status_code < 400 else []
        events = events_response.json() if events_response.status_code < 400 else []
        repos = repos if isinstance(repos, list) else []
        events = events if isinstance(events, list) else []

        language_counts = Counter(
            repo.get("language")
            for repo in repos
            if repo.get("language")
        )
        top_languages = [language for language, _ in language_counts.most_common(8)]
        activity = self._activity_points(events)
        commits = sum(point.commits for point in activity)
        reviews = sum(point.reviews for point in activity)

        recent_cutoff = datetime.now(timezone.utc) - timedelta(days=90)
        recent_repos = 0
        documented_repos = 0
        starred_repos = 0
        for repo in repos:
            pushed_at = self._parse_datetime(repo.get("pushed_at"))
            if pushed_at and pushed_at >= recent_cutoff:
                recent_repos += 1
            if repo.get("description"):
                documented_repos += 1
            if (repo.get("stargazers_count") or 0) > 0:
                starred_repos += 1

        activity_score = min(100.0, commits * 5 + reviews * 8 + recent_repos * 4)
        project_depth_score = min(
            100.0,
            documented_repos * 6 + len(top_languages) * 8 + starred_repos * 5 + min(len(repos), 20)
        )

        findings = self._findings(top_languages, activity_score, project_depth_score, repos)

        return GitHubSnapshotOut(
            username=clean_username,
            profile_url=profile.get("html_url") or f"https://github.com/{clean_username}",
            public_repos=int(profile.get("public_repos") or 0),
            followers=int(profile.get("followers") or 0),
            repositories_analyzed=len(repos),
            top_languages=top_languages,
            activity_score=round(activity_score, 1),
            project_depth_score=round(project_depth_score, 1),
            findings=findings,
            activity=activity,
            fetched_at=datetime.now(timezone.utc)
        )

    async def _fetch_parallel(
        self,
        client: httpx.AsyncClient,
        repos_path: str,
        events_path: str
    ) -> tuple[httpx.Response, httpx.Response]:
        repos_params = {"sort": "pushed", "direction": "desc", "per_page": "30"}
        events_params = {"per_page": "100"}
        repos_response, events_response = await asyncio.gather(
            client.get(repos_path, params=repos_params),
            client.get(events_path, params=events_params)
        )
        return repos_response, events_response

    def _activity_points(self, events: list[dict[str, Any]]) -> list[GitHubActivityPoint]:
        today = datetime.now(timezone.utc).date()
        days = [today - timedelta(days=offset) for offset in range(6, -1, -1)]
        by_day = {
            day: {"commits": 0, "reviews": 0}
            for day in days
        }

        for event in events:
            created = self._parse_datetime(event.get("created_at"))
            if not created:
                continue
            event_day = created.date()
            if event_day not in by_day:
                continue
            event_type = event.get("type")
            payload = event.get("payload") or {}
            if event_type == "PushEvent":
                commits = payload.get("commits")
                by_day[event_day]["commits"] += len(commits) if isinstance(commits, list) else 1
            if event_type in {"PullRequestReviewEvent", "PullRequestEvent"}:
                by_day[event_day]["reviews"] += 1

        return [
            GitHubActivityPoint(day=day.strftime("%a"), commits=values["commits"], reviews=values["reviews"])
            for day, values in by_day.items()
        ]

    def _findings(
        self,
        languages: list[str],
        activity_score: float,
        project_depth_score: float,
        repos: list[dict[str, Any]]
    ) -> list[str]:
        findings: list[str] = []
        if languages:
            findings.append(f"Top public GitHub languages: {', '.join(languages[:4])}.")
        if activity_score >= 70:
            findings.append("Recent public contribution activity is strong.")
        elif activity_score > 0:
            findings.append("Recent contribution activity is present but can be made more consistent.")
        else:
            findings.append("No public GitHub activity was found in the last seven days.")
        if project_depth_score >= 70:
            findings.append("Repository metadata shows portfolio depth through descriptions, language variety, and recent pushes.")
        else:
            findings.append("Repository depth can improve with clearer README descriptions, deployment links, and recent proof commits.")
        if repos:
            latest = repos[0].get("name")
            if latest:
                findings.append(f"Most recently pushed public repository: {latest}.")
        return findings

    def _parse_datetime(self, raw: str | None) -> datetime | None:
        if not raw:
            return None
        try:
            return datetime.fromisoformat(raw.replace("Z", "+00:00"))
        except ValueError:
            return None


github_analyzer = GitHubAnalyzer()
