const STORAGE_KEY = "skilldelta.roadmap.completed";

export function loadCompletedRoadmapDays(roadmapKey: string): Set<number> {
  if (typeof window === "undefined") {
    return new Set();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw) as Record<string, number[]>;
    return new Set(parsed[roadmapKey] ?? []);
  } catch {
    return new Set();
  }
}

export function saveCompletedRoadmapDays(roadmapKey: string, completed: Set<number>) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
    parsed[roadmapKey] = [...completed];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage failures
  }
}

export function roadmapStorageKey(title: string, dreamJob: string) {
  return `${dreamJob}::${title}`;
}
