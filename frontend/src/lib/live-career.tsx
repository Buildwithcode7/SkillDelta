"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  apiFetch,
  cleanProfile,
  type Dashboard,
  type InterviewSession,
  type MentorReply,
  type ProfileInput,
  type ProgressOut,
  type ProjectOut,
  type ResumeAnalysisOut,
  type RoadmapResponse
} from "@/lib/api";

const STORAGE_KEY = "skilldelta.liveProfile";

const defaultProfile: ProfileInput = {
  dream_job_title: "AI Full-Stack Engineer",
  linkedin_url: "",
  github_username: "",
  portfolio_url: "",
  resume_text: ""
};

type LiveCareerContextValue = {
  profile: ProfileInput;
  dashboard: Dashboard | null;
  roadmap: RoadmapResponse | null;
  projects: ProjectOut[];
  interview: InterviewSession | null;
  mentorReply: MentorReply | null;
  progress: ProgressOut | null;
  resumeAnalysis: ResumeAnalysisOut | null;
  loading: boolean;
  error: string | null;
  analyzeProfile: (profile: ProfileInput) => Promise<void>;
  refreshDashboard: () => Promise<void>;
  generateRoadmap: (days?: number) => Promise<void>;
  generateProjects: (level?: string) => Promise<void>;
  startInterview: (mode?: string) => Promise<void>;
  sendMentorMessage: (message: string) => Promise<void>;
  analyzeResume: (file?: File | null, resumeText?: string) => Promise<void>;
  updateProgress: (taskId?: string) => Promise<void>;
};

const LiveCareerContext = createContext<LiveCareerContextValue | null>(null);

export function LiveCareerProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileInput>(defaultProfile);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [projects, setProjects] = useState<ProjectOut[]>([]);
  const [interview, setInterview] = useState<InterviewSession | null>(null);
  const [mentorReply, setMentorReply] = useState<MentorReply | null>(null);
  const [progress, setProgress] = useState<ProgressOut | null>(null);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncDashboard = useCallback(async (nextProfile: ProfileInput) => {
    const cleaned = cleanProfile(nextProfile);
    if (!cleaned.dream_job_title) {
      setError("Add a dream job title before running a live sync.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const liveDashboard = await apiFetch<Dashboard>("/api/dashboard", {
        method: "POST",
        body: JSON.stringify(cleaned)
      });
      setProfile(cleaned);
      setDashboard(liveDashboard);
      setRoadmap(liveDashboard.roadmap);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      localStorage.setItem("skilldelta.roadmap", JSON.stringify(liveDashboard.roadmap));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Live sync failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedRoadmap = localStorage.getItem("skilldelta.roadmap");
    if (storedRoadmap) {
      try {
        setRoadmap(JSON.parse(storedRoadmap) as RoadmapResponse);
      } catch {
        localStorage.removeItem("skilldelta.roadmap");
      }
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return;
    }
    try {
      const parsed = JSON.parse(stored) as ProfileInput;
      setProfile({ ...defaultProfile, ...parsed });
      const hasSignal = Boolean(parsed.github_username || parsed.resume_text || parsed.linkedin_url || parsed.portfolio_url);
      if (hasSignal) {
        void syncDashboard({ ...defaultProfile, ...parsed });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [syncDashboard]);

  const analyzeProfile = useCallback(async (nextProfile: ProfileInput) => {
    await syncDashboard(nextProfile);
  }, [syncDashboard]);

  const refreshDashboard = useCallback(async () => {
    await syncDashboard(profile);
  }, [profile, syncDashboard]);

  const generateRoadmap = useCallback(async (days = 30) => {
    if (!dashboard?.gap_analysis.length) {
      setError("Run a live profile analysis on Dashboard or Analysis first to detect skill gaps.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<RoadmapResponse>("/api/roadmap/generate", {
        method: "POST",
        body: JSON.stringify({
          dream_job_title: profile.dream_job_title,
          missing_skills: dashboard.gap_analysis.map((gap) => gap.skill),
          skill_gaps: dashboard.gap_analysis,
          readiness_score: dashboard.report.readiness_score,
          intensity: "balanced",
          days
        })
      });
      setRoadmap(response);
      localStorage.setItem("skilldelta.roadmap", JSON.stringify(response));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Roadmap generation failed.");
    } finally {
      setLoading(false);
    }
  }, [dashboard, profile.dream_job_title]);

  const generateProjects = useCallback(async (level = "all") => {
    const missingSkills = dashboard?.gap_analysis.map((gap) => gap.skill) ?? [];
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<ProjectOut[]>("/api/projects/generate", {
        method: "POST",
        body: JSON.stringify({
          dream_job_title: profile.dream_job_title,
          level,
          missing_skills: missingSkills
        })
      });
      setProjects(response);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Project generation failed.");
    } finally {
      setLoading(false);
    }
  }, [dashboard, profile.dream_job_title]);

  const startInterview = useCallback(async (mode = "technical") => {
    const weakSkills = dashboard?.gap_analysis.map((gap) => gap.skill) ?? [];
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<InterviewSession>("/api/mock-interview/session", {
        method: "POST",
        body: JSON.stringify({
          dream_job_title: profile.dream_job_title,
          mode,
          weak_skills: weakSkills
        })
      });
      setInterview(response);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Interview session failed.");
    } finally {
      setLoading(false);
    }
  }, [dashboard, profile.dream_job_title]);

  const sendMentorMessage = useCallback(async (message: string) => {
    const missingSkills = dashboard?.gap_analysis.map((gap) => gap.skill).join(", ") ?? "";
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<MentorReply>("/api/mentor/chat", {
        method: "POST",
        body: JSON.stringify({
          message,
          context: {
            dream_job_title: profile.dream_job_title,
            missing_skills: missingSkills
          }
        })
      });
      setMentorReply(response);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Mentor reply failed.");
    } finally {
      setLoading(false);
    }
  }, [dashboard, profile.dream_job_title]);

  const analyzeResume = useCallback(async (file?: File | null, resumeText?: string) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    if (resumeText?.trim()) {
      formData.append("resume_text", resumeText.trim());
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<ResumeAnalysisOut>("/api/resume/analyze", {
        method: "POST",
        body: formData
      });
      setResumeAnalysis(response);
      if (resumeText?.trim()) {
        const nextProfile = { ...profile, resume_text: resumeText };
        setProfile(nextProfile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanProfile(nextProfile)));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Resume analysis failed.");
    } finally {
      setLoading(false);
    }
  }, [profile]);

  const updateProgress = useCallback(async (taskId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch<ProgressOut>("/api/progress", {
        method: "POST",
        body: JSON.stringify({
          task_id: taskId,
          completed: true,
          xp_earned: 120
        })
      });
      setProgress(response);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Progress update failed.");
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<LiveCareerContextValue>(() => ({
    profile,
    dashboard,
    roadmap,
    projects,
    interview,
    mentorReply,
    progress,
    resumeAnalysis,
    loading,
    error,
    analyzeProfile,
    refreshDashboard,
    generateRoadmap,
    generateProjects,
    startInterview,
    sendMentorMessage,
    analyzeResume,
    updateProgress
  }), [
    profile,
    dashboard,
    roadmap,
    projects,
    interview,
    mentorReply,
    progress,
    resumeAnalysis,
    loading,
    error,
    analyzeProfile,
    refreshDashboard,
    generateRoadmap,
    generateProjects,
    startInterview,
    sendMentorMessage,
    analyzeResume,
    updateProgress
  ]);

  return <LiveCareerContext.Provider value={value}>{children}</LiveCareerContext.Provider>;
}

export function useLiveCareer() {
  const context = useContext(LiveCareerContext);
  if (!context) {
    throw new Error("useLiveCareer must be used inside LiveCareerProvider");
  }
  return context;
}
