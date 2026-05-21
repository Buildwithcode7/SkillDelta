from __future__ import annotations

from dataclasses import dataclass

from app.schemas import LeetCodeResourceOut, YouTubeResourceOut


@dataclass(frozen=True)
class YouTubeEntry:
    title: str
    url: str
    channel: str = ""


@dataclass(frozen=True)
class LeetCodeEntry:
    number: int
    title: str
    slug: str
    difficulty: str = "Medium"


def _lc(number: int, title: str, slug: str, difficulty: str = "Medium") -> LeetCodeEntry:
    return LeetCodeEntry(number=number, title=title, slug=slug, difficulty=difficulty)


def _yt(title: str, video_id: str, channel: str = "") -> YouTubeEntry:
    return YouTubeEntry(title=title, url=f"https://www.youtube.com/watch?v={video_id}", channel=channel)


GENERAL_YOUTUBE = [
    _yt("Complete Data Structures & Algorithms — freeCodeCamp", "8hlyHIJYUV0", "freeCodeCamp"),
    _yt("System Design Interview — Hussein Nasser", "bU6gA8-a1YQ", "Hussein Nasser"),
]

GENERAL_LEETCODE = [
    _lc(1, "Two Sum", "two-sum", "Easy"),
    _lc(49, "Group Anagrams", "group-anagrams", "Medium"),
    _lc(56, "Merge Intervals", "merge-intervals", "Medium"),
]

SKILL_CURRICULUM: dict[str, dict[str, list]] = {
    "React": {
        "youtube": [
            _yt("React JS Full Course 2024 — freeCodeCamp", "SqcY0GlETPk", "freeCodeCamp"),
            _yt("React Hooks Explained — Web Dev Simplified", "TNhaISOUy6Q", "Web Dev Simplified"),
            _yt("React State Management Patterns — Jack Herrington", "u_nMYLrB0Pg", "Jack Herrington"),
        ],
        "leetcode": [
            _lc(1, "Two Sum", "two-sum", "Easy"),
            _lc(88, "Merge Sorted Array", "merge-sorted-array", "Easy"),
            _lc(121, "Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "Easy"),
        ],
    },
    "TypeScript": {
        "youtube": [
            _yt("TypeScript Full Course — freeCodeCamp", "30LWjhPNN48", "freeCodeCamp"),
            _yt("TypeScript Generics Explained — Fireship", "yRhWtyYPc7I", "Fireship"),
            _yt("Advanced TypeScript Patterns — Matt Pocock", "ID56C0oK1FE", "Matt Pocock"),
        ],
        "leetcode": [
            _lc(20, "Valid Parentheses", "valid-parentheses", "Easy"),
            _lc(242, "Valid Anagram", "valid-anagram", "Easy"),
            _lc(49, "Group Anagrams", "group-anagrams", "Medium"),
        ],
    },
    "Next.js": {
        "youtube": [
            _yt("Next.js 14 Full Course — freeCodeCamp", "__mSgovW-H8", "freeCodeCamp"),
            _yt("Next.js App Router Explained — Lee Robinson", "gSSs4rejeB4", "Vercel"),
            _yt("Server Components vs Client — Theo", "r5GkT9wAo4s", "Theo"),
        ],
        "leetcode": [
            _lc(1, "Two Sum", "two-sum", "Easy"),
            _lc(217, "Contains Duplicate", "contains-duplicate", "Easy"),
            _lc(238, "Product of Array Except Self", "product-of-array-except-self", "Medium"),
        ],
    },
    "FastAPI": {
        "youtube": [
            _yt("FastAPI Full Course — freeCodeCamp", "0sOvCWFmrtA", "freeCodeCamp"),
            _yt("FastAPI + SQLAlchemy Tutorial — Bitfumes", "6hTRw_HK3DY", "Bitfumes"),
            _yt("Building REST APIs with FastAPI — ArjanCodes", "7t2xVdpVMN8", "ArjanCodes"),
        ],
        "leetcode": [
            _lc(3, "Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "Medium"),
            _lc(347, "Top K Frequent Elements", "top-k-frequent-elements", "Medium"),
            _lc(238, "Product of Array Except Self", "product-of-array-except-self", "Medium"),
        ],
    },
    "Python": {
        "youtube": [
            _yt("Python Full Course — freeCodeCamp", "eWRfhZUzrAc", "freeCodeCamp"),
            _yt("Python for Beginners — Programming with Mosh", "_uQrJ0TkZlc", "Mosh"),
            _yt("Advanced Python — Corey Schafer", "HGOBQPFzWKo", "Corey Schafer"),
        ],
        "leetcode": [
            _lc(3, "Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "Medium"),
            _lc(49, "Group Anagrams", "group-anagrams", "Medium"),
            _lc(128, "Longest Consecutive Sequence", "longest-consecutive-sequence", "Medium"),
        ],
    },
    "PostgreSQL": {
        "youtube": [
            _yt("PostgreSQL Tutorial Full Course — freeCodeCamp", "SpfIwlS33u4", "freeCodeCamp"),
            _yt("SQL for Beginners — Alex Garcia", "HXV3zeQKqGY", "Alex Garcia"),
            _yt("PostgreSQL Indexing Deep Dive — Hussein Nasser", "clrtOXB1W0g", "Hussein Nasser"),
        ],
        "leetcode": [
            _lc(175, "Combine Two Tables", "combine-two-tables", "Easy"),
            _lc(184, "Department Highest Salary", "department-highest-salary", "Medium"),
            _lc(197, "Rising Temperature", "rising-temperature", "Easy"),
            _lc(602, "Consecutive Available Seats", "consecutive-available-seats", "Medium"),
        ],
    },
    "SQL": {
        "youtube": [
            _yt("SQL Full Course — freeCodeCamp", "HXV3zeQKqGY", "freeCodeCamp"),
            _yt("Advanced SQL — Alex Garcia", "yOGI4u3e6wA", "Alex Garcia"),
        ],
        "leetcode": [
            _lc(175, "Combine Two Tables", "combine-two-tables", "Easy"),
            _lc(184, "Department Highest Salary", "department-highest-salary", "Medium"),
            _lc(550, "Game Play Analysis IV", "game-play-analysis-iv", "Medium"),
        ],
    },
    "RAG": {
        "youtube": [
            _yt("RAG From Scratch — LangChain", "wd7TZ4w1mSw", "LangChain"),
            _yt("Build RAG App with Python — freeCodeCamp", "T-D1OfcDW1M", "freeCodeCamp"),
            _yt("Vector Databases Explained — Fireship", "kl6E-TW77yU", "Fireship"),
        ],
        "leetcode": [
            _lc(743, "Network Delay Time", "network-delay-time", "Medium"),
            _lc(787, "Cheapest Flights Within K Stops", "cheapest-flights-within-k-stops", "Medium"),
            _lc(1268, "Search Suggestions System", "search-suggestions-system", "Medium"),
        ],
    },
    "OpenAI API": {
        "youtube": [
            _yt("OpenAI API Quickstart — OpenAI", "u5yR99K8t0g", "OpenAI"),
            _yt("Build AI Apps with OpenAI — freeCodeCamp", "pSVvN72olaw", "freeCodeCamp"),
            _yt("Function Calling with OpenAI — AI Jason", "w0H1-b044KY", "AI Jason"),
        ],
        "leetcode": [
            _lc(1268, "Search Suggestions System", "search-suggestions-system", "Medium"),
            _lc(692, "Top K Frequent Words", "top-k-frequent-words", "Medium"),
            _lc(347, "Top K Frequent Elements", "top-k-frequent-elements", "Medium"),
        ],
    },
    "Embeddings": {
        "youtube": [
            _yt("Word Embeddings Explained — StatQuest", "viZrOnJclY0", "StatQuest"),
            _yt("Vector Embeddings Tutorial — Pinecone", "5MaWmKVW5CY", "Pinecone"),
            _yt("Semantic Search with Embeddings — Sentence Transformers", "dOXz8zSMMuQ", "Hugging Face"),
        ],
        "leetcode": [
            _lc(349, "Intersection of Two Arrays", "intersection-of-two-arrays", "Easy"),
            _lc(692, "Top K Frequent Words", "top-k-frequent-words", "Medium"),
            _lc(347, "Top K Frequent Elements", "top-k-frequent-elements", "Medium"),
        ],
    },
    "System Design": {
        "youtube": [
            _yt("System Design for Beginners — NeetCode", "bU6gA8-a1YQ", "NeetCode"),
            _yt("System Design Interview — Gaurav Sen", "UzLMhqg3K6w", "Gaurav Sen"),
            _yt("URL Shortener Design — Hussein Nasser", "JdmoDsxtKkU", "Hussein Nasser"),
        ],
        "leetcode": [
            _lc(146, "LRU Cache", "lru-cache", "Medium"),
            _lc(355, "Design Twitter", "design-twitter", "Medium"),
            _lc(460, "LFU Cache", "lfu-cache", "Hard"),
            _lc(981, "Time Based Key-Value Store", "time-based-key-value-store", "Medium"),
        ],
    },
    "Testing": {
        "youtube": [
            _yt("Python Testing with pytest — Corey Schafer", "6a0d7ad1a39", "Corey Schafer"),
            _yt("Playwright Tutorial — Automation Step by Step", "wMkf4wTqb0E", "Automation Step by Step"),
            _yt("Testing FastAPI — ArjanCodes", "7t2xVdpVMN8", "ArjanCodes"),
        ],
        "leetcode": [
            _lc(20, "Valid Parentheses", "valid-parentheses", "Easy"),
            _lc(36, "Valid Sudoku", "valid-sudoku", "Medium"),
            _lc(141, "Linked List Cycle", "linked-list-cycle", "Easy"),
        ],
    },
    "Docker": {
        "youtube": [
            _yt("Docker Tutorial for Beginners — TechWorld with Nana", "3c-iBn73diI", "Nana"),
            _yt("Docker Compose — freeCodeCamp", "HG6yIjZapSA", "freeCodeCamp"),
            _yt("Kubernetes vs Docker — Fireship", "7CqJlxBYj-M", "Fireship"),
        ],
        "leetcode": [
            _lc(146, "LRU Cache", "lru-cache", "Medium"),
            _lc(622, "Design Circular Queue", "design-circular-queue", "Medium"),
            _lc(933, "Number of Recent Calls", "number-of-recent-calls", "Easy"),
        ],
    },
    "CI/CD": {
        "youtube": [
            _yt("CI/CD Explained — TechWorld with Nana", "scEDHNr7NOs", "Nana"),
            _yt("GitHub Actions Tutorial — freeCodeCamp", "R8_veQiYBjI", "freeCodeCamp"),
            _yt("DevOps CI/CD Pipeline — IBM Technology", "42UP1fxi2SY", "IBM"),
        ],
        "leetcode": [
            _lc(933, "Number of Recent Calls", "number-of-recent-calls", "Easy"),
            _lc(621, "Task Scheduler", "task-scheduler", "Medium"),
            _lc(253, "Meeting Rooms II", "meeting-rooms-ii", "Medium"),
        ],
    },
    "GitHub": {
        "youtube": [
            _yt("Git and GitHub for Beginners — freeCodeCamp", "RGOj5yL3_jk", "freeCodeCamp"),
            _yt("GitHub Actions CI/CD — Fireship", "eB0n-lKZoAU", "Fireship"),
            _yt("Open Source Contribution Guide — Eddie Jaoude", "yzeVMecydA4", "Eddie Jaoude"),
        ],
        "leetcode": [
            _lc(1, "Two Sum", "two-sum", "Easy"),
            _lc(206, "Reverse Linked List", "reverse-linked-list", "Easy"),
            _lc(21, "Merge Two Sorted Lists", "merge-two-sorted-lists", "Easy"),
        ],
    },
    "Design Systems": {
        "youtube": [
            _yt("Design Systems 101 — Figma", "wc5eqmKD5QY", "Figma"),
            _yt("Building a Design System — Brad Frost", "wc5eqmKD5QY", "Config"),
            _yt("Tailwind + Component Libraries — Fireship", "TrtLmDe8sSI", "Fireship"),
        ],
        "leetcode": [
            _lc(1, "Two Sum", "two-sum", "Easy"),
            _lc(217, "Contains Duplicate", "contains-duplicate", "Easy"),
        ],
    },
    "Performance": {
        "youtube": [
            _yt("Web Performance Optimization — Google Chrome Developers", "0fONene3O1o", "Chrome Developers"),
            _yt("React Performance — Jack Herrington", "5fLW5wKTg2Q", "Jack Herrington"),
            _yt("Database Query Optimization — Hussein Nasser", "clrtOXB1W0g", "Hussein Nasser"),
        ],
        "leetcode": [
            _lc(238, "Product of Array Except Self", "product-of-array-except-self", "Medium"),
            _lc(287, "Find the Duplicate Number", "find-the-duplicate-number", "Medium"),
            _lc(128, "Longest Consecutive Sequence", "longest-consecutive-sequence", "Medium"),
        ],
    },
    "Security": {
        "youtube": [
            _yt("Web Security Basics — Fireship", "4YOpILiVZ-s", "Fireship"),
            _yt("OWASP Top 10 Explained — IBM", "rWHvp7RA9zQ", "IBM"),
            _yt("JWT Authentication — Net Ninja", "mxtoPbz8TPY", "Net Ninja"),
        ],
        "leetcode": [
            _lc(242, "Valid Anagram", "valid-anagram", "Easy"),
            _lc(49, "Group Anagrams", "group-anagrams", "Medium"),
            _lc(560, "Subarray Sum Equals K", "subarray-sum-equals-k", "Medium"),
        ],
    },
    "Cloud": {
        "youtube": [
            _yt("AWS Explained — freeCodeCamp", "ulprqHHWFNw", "freeCodeCamp"),
            _yt("Cloud Computing Explained — IBM", "2LaAJq1lB1Q", "IBM"),
            _yt("Deploy Full Stack to AWS — Traversy Media", "SG7oLvzRBA0", "Traversy Media"),
        ],
        "leetcode": [
            _lc(146, "LRU Cache", "lru-cache", "Medium"),
            _lc(355, "Design Twitter", "design-twitter", "Medium"),
            _lc(622, "Design Circular Queue", "design-circular-queue", "Medium"),
        ],
    },
    "Data Modeling": {
        "youtube": [
            _yt("Database Design Course — freeCodeCamp", "ztHopE5Wnpc", "freeCodeCamp"),
            _yt("Data Modeling Explained — Alex Garcia", "WqJHeOWhq7w", "Alex Garcia"),
            _yt("Normalization — Hussein Nasser", "GFQpOXMnfak", "Hussein Nasser"),
        ],
        "leetcode": [
            _lc(175, "Combine Two Tables", "combine-two-tables", "Easy"),
            _lc(184, "Department Highest Salary", "department-highest-salary", "Medium"),
            _lc(571, "Find Median Given Frequency of Numbers", "find-median-given-frequency-of-numbers", "Hard"),
        ],
    },
}

SKILL_ALIASES = {
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "openai": "OpenAI API",
    "gpt": "OpenAI API",
    "llm": "RAG",
    "vector": "Embeddings",
    "api": "FastAPI",
    "devops": "CI/CD",
    "system design": "System Design",
    "accessibility": "Design Systems",
    "monitoring": "Performance",
    "pipelines": "Data Modeling",
    "dashboards": "React",
    "statistics": "Python",
}


def resolve_skill(skill: str) -> str:
    if skill in SKILL_CURRICULUM:
        return skill
    lowered = skill.lower()
    if lowered in SKILL_ALIASES:
        return SKILL_ALIASES[lowered]
    for key in SKILL_CURRICULUM:
        if key.lower() in lowered or lowered in key.lower():
            return key
    return skill


def pick_youtube_for_task(skill: str, phase_index: int, day: int, count: int = 2) -> list[YouTubeResourceOut]:
    resolved = resolve_skill(skill)
    entries = SKILL_CURRICULUM.get(resolved, {}).get("youtube", GENERAL_YOUTUBE)
    start = (phase_index + day) % len(entries)
    picked: list[YouTubeResourceOut] = []
    for offset in range(min(count, len(entries))):
        entry = entries[(start + offset) % len(entries)]
        picked.append(YouTubeResourceOut(title=entry.title, url=entry.url, channel=entry.channel))
    return picked


def pick_leetcode_for_task(skill: str, phase_index: int, day: int) -> list[LeetCodeResourceOut]:
    resolved = resolve_skill(skill)
    entries = SKILL_CURRICULUM.get(resolved, {}).get("leetcode", GENERAL_LEETCODE)
    if phase_index == 0:
        count = 1
    elif phase_index == 1:
        count = 2
    elif phase_index == 2:
        count = 2
    else:
        count = 2

    start = (phase_index * 2 + day) % len(entries)
    picked: list[LeetCodeResourceOut] = []
    for offset in range(min(count, len(entries))):
        entry = entries[(start + offset) % len(entries)]
        picked.append(
            LeetCodeResourceOut(
                number=entry.number,
                title=entry.title,
                difficulty=entry.difficulty,
                url=f"https://leetcode.com/problems/{entry.slug}/",
            )
        )
    return picked
