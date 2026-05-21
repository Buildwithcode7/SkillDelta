const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export type ProfileInput = {
  linkedin_url?: string | null;
  github_username?: string | null;
  portfolio_url?: string | null;
  dream_job_title: string;
  resume_text?: string | null;
};

export type SkillGap = {
  skill: string;
  current_score: number;
  target_score: number;
  gap: number;
  impact: string;
  reason: string;
  resources: string[];
};

export type YouTubeResource = {
  title: string;
  url: string;
  channel?: string;
};

export type LeetCodeResource = {
  number: number;
  title: string;
  difficulty: string;
  url: string;
};

export type RoadmapTask = {
  day: number;
  topic: string;
  difficulty: string;
  estimated_hours: number;
  recommended_videos: string[];
  github_resources: string[];
  documentation: string[];
  mini_challenge: string;
  skill?: string;
  gap_score?: number;
  phase?: string;
  study_focus?: string;
  youtube_videos?: YouTubeResource[];
  leetcode_problems?: LeetCodeResource[];
};

export type CareerReport = {
  readiness_score: number;
  skill_match_percent: number;
  reality_check_score: number;
  interview_probability: number;
  salary_prediction_lpa: number;
  missing_skills: SkillGap[];
  extracted_skills: string[];
  shadow_learning_risk: number;
  burnout_risk: number;
  hiring_trend_radar: string[];
  roadmap_preview: RoadmapTask[];
  recommendations: string[];
};

export type GitHubActivityPoint = {
  day: string;
  commits: number;
  reviews: number;
};

export type GitHubSnapshot = {
  username: string;
  profile_url: string;
  public_repos: number;
  followers: number;
  repositories_analyzed: number;
  top_languages: string[];
  activity_score: number;
  project_depth_score: number;
  findings: string[];
  activity: GitHubActivityPoint[];
  fetched_at: string;
};

export type DashboardMetric = {
  label: string;
  value: number;
  suffix: string;
  tone: "blue" | "violet" | "amber" | "green" | "cyan" | "rose";
};

export type ReadinessHistoryPoint = {
  week: string;
  readiness: number;
  github: number;
  resume: number;
};

export type SkillRadarPoint = {
  skill: string;
  current: number;
  target: number;
};

export type HeatmapSkill = {
  name: string;
  score: number;
  status: string;
};

export type SalaryProjectionPoint = {
  month: string;
  low: number;
  median: number;
  high: number;
};

export type NotificationItem = {
  title: string;
  body: string;
  type: string;
};

export type Dashboard = {
  profile: ProfileInput;
  synced_at: string;
  report: CareerReport;
  metrics: DashboardMetric[];
  readiness_history: ReadinessHistoryPoint[];
  skill_radar: SkillRadarPoint[];
  github_activity: GitHubActivityPoint[];
  heatmap_skills: HeatmapSkill[];
  gap_analysis: SkillGap[];
  roadmap: RoadmapResponse;
  roadmap_preview: RoadmapTask[];
  upcoming_tasks: string[];
  notifications: NotificationItem[];
  salary_projection: SalaryProjectionPoint[];
  github: GitHubSnapshot | null;
};

export type RoadmapResponse = {
  title: string;
  compression_score: number;
  total_hours: number;
  tasks: RoadmapTask[];
};

export type ProjectOut = {
  title: string;
  level: string;
  description: string;
  tech_stack: string[];
  github_structure: Record<string, string[]>;
  deployment_guide: string[];
  apis_to_use: string[];
  resume_impact_score: number;
};

export type InterviewSession = {
  mode: string;
  questions: string[];
  rubric: Record<string, string>;
  communication_score: number;
  confidence_score: number;
  technical_score: number;
  feedback: string[];
};

export type VoiceMetricsPayload = {
  words_per_minute: number;
  speaking_seconds: number;
  filler_count: number;
  long_pause_count: number;
  average_volume: number;
  volume_stability: number;
  energy_score: number;
  clarity_score: number;
};

export type FaceMetricsPayload = {
  samples: number;
  face_visible_percent: number;
  eye_contact_score: number;
  posture_stability: number;
  lighting_score: number;
  expression_engagement: number;
  head_movement_variance: number;
};

export type InterviewAnswerAnalysis = {
  question: string;
  transcript: string;
  communication_score: number;
  confidence_score: number;
  technical_score: number;
  overall_score: number;
  voice_summary: string;
  face_summary: string;
  strengths: string[];
  improvements: string[];
  feedback: string[];
  filler_words_detected: number;
  words_spoken: number;
  speaking_pace_label: string;
};

export type InterviewSessionReport = {
  mode: string;
  dream_job_title: string;
  questions_answered: number;
  communication_score: number;
  confidence_score: number;
  technical_score: number;
  presence_score: number;
  overall_score: number;
  summary: string;
  highlights: string[];
  focus_areas: string[];
  next_steps: string[];
  per_question: InterviewAnswerAnalysis[];
};

export type MentorReply = {
  reply: string;
  next_actions: string[];
  risk_flags: string[];
};

export type ProgressOut = {
  xp_earned: number;
  streak_days: number;
  achievements_unlocked: string[];
  completion_rate: number;
};

export type ResumeAnalysisOut = {
  ats_score: number;
  resume_strength: number;
  missing_keywords: string[];
  improved_bullets: string[];
  recommendations: string[];
};

export type CertificateStats = {
  roadmap_completion_percent: number;
  roadmap_tasks_completed: number;
  roadmap_tasks_total: number;
  interview_overall_score?: number | null;
  interview_mode?: string | null;
  resume_ats_score?: number | null;
  resume_strength?: number | null;
  achievements: string[];
  xp_earned: number;
};

export type CertificateMetric = {
  label: string;
  value: number;
  suffix: string;
};

export type ParticipationCertificate = {
  certificate_id: string;
  verification_code: string;
  recipient_name: string;
  dream_job_title: string;
  program_name: string;
  issued_at: string;
  performance_tier: string;
  overall_score: number;
  readiness_score: number;
  skill_match_percent: number;
  reality_check_score: number;
  evidence_coverage: number;
  github_activity_score: number;
  roadmap_completion_percent: number;
  interview_score: number | null;
  metrics: CertificateMetric[];
  highlights: string[];
  summary: string;
};

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: init?.body instanceof FormData
      ? init.headers
      : {
          "Content-Type": "application/json",
          ...init?.headers
        }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function cleanProfile(profile: ProfileInput): ProfileInput {
  return {
    dream_job_title: profile.dream_job_title.trim(),
    linkedin_url: profile.linkedin_url?.trim() || null,
    github_username: profile.github_username?.trim().replace(/^@/, "") || null,
    portfolio_url: profile.portfolio_url?.trim() || null,
    resume_text: profile.resume_text?.trim() || null
  };
}
