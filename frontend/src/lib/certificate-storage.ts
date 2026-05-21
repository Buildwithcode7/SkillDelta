import type {
  CertificateStats,
  InterviewSessionReport,
  ParticipationCertificate,
  ProfileInput,
  ResumeAnalysisOut,
  RoadmapResponse
} from "@/lib/api";
import { loadCompletedRoadmapDays, roadmapStorageKey } from "@/lib/roadmap-progress";

const INTERVIEW_REPORT_KEY = "skilldelta.interview.lastReport";
const CERTIFICATE_KEY = "skilldelta.certificate.last";

export function saveParticipationCertificate(certificate: ParticipationCertificate) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(CERTIFICATE_KEY, JSON.stringify(certificate));
  } catch {
    // ignore
  }
}

export function loadParticipationCertificate(): ParticipationCertificate | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(CERTIFICATE_KEY);
    return raw ? (JSON.parse(raw) as ParticipationCertificate) : null;
  } catch {
    return null;
  }
}

export function saveInterviewSessionReport(report: InterviewSessionReport) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(INTERVIEW_REPORT_KEY, JSON.stringify(report));
  } catch {
    // ignore
  }
}

export function loadInterviewSessionReport(): InterviewSessionReport | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = localStorage.getItem(INTERVIEW_REPORT_KEY);
    return raw ? (JSON.parse(raw) as InterviewSessionReport) : null;
  } catch {
    return null;
  }
}

export function collectCertificateStats(input: {
  profile: ProfileInput;
  roadmap: RoadmapResponse | null;
  resumeAnalysis: ResumeAnalysisOut | null;
  achievements?: string[];
  xpEarned?: number;
}): CertificateStats {
  const tasks = input.roadmap?.tasks ?? [];
  const storageKey = input.roadmap
    ? roadmapStorageKey(input.roadmap.title, input.profile.dream_job_title)
    : "";
  const completed = storageKey ? loadCompletedRoadmapDays(storageKey) : new Set<number>();
  const interview = loadInterviewSessionReport();

  const roadmapTasksTotal = tasks.length;
  const roadmapTasksCompleted = completed.size;
  const roadmapCompletionPercent = roadmapTasksTotal
    ? Math.round((roadmapTasksCompleted / roadmapTasksTotal) * 100)
    : 0;

  return {
    roadmap_completion_percent: roadmapCompletionPercent,
    roadmap_tasks_completed: roadmapTasksCompleted,
    roadmap_tasks_total: roadmapTasksTotal,
    interview_overall_score: interview?.overall_score ?? null,
    interview_mode: interview?.mode ?? null,
    resume_ats_score: input.resumeAnalysis?.ats_score ?? null,
    resume_strength: input.resumeAnalysis?.resume_strength ?? null,
    achievements: input.achievements ?? [],
    xp_earned: input.xpEarned ?? 0
  };
}
