"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BadgeDollarSign,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  FileSearch,
  FileUp,
  Flame,
  Github,
  GitBranch,
  ExternalLink,
  GripVertical,
  Lightbulb,
  Link2,
  Loader2,
  Mic,
  Play,
  Plus,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Video,
  WandSparkles,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { MetricCard } from "@/components/metric-card";
import { ProgressRing } from "@/components/progress-ring";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import type { DashboardMetric, RoadmapTask } from "@/lib/api";
import { useLiveCareer } from "@/lib/live-career";
import { onboardingSteps, pricingPlans } from "@/lib/static-content";
import { loadCompletedRoadmapDays, roadmapStorageKey, saveCompletedRoadmapDays } from "@/lib/roadmap-progress";
import { cn } from "@/lib/utils";

const interviewModes: Array<{ label: string; mode: string; icon: LucideIcon }> = [
  { label: "Technical", mode: "technical", icon: Mic },
  { label: "Coding", mode: "coding", icon: Code2 },
  { label: "System Design", mode: "system design", icon: Video }
];

const settingsGroups: Array<{ title: string; icon: LucideIcon; rows: string[] }> = [
  { title: "Profile signals", icon: Link2, rows: ["LinkedIn URL", "GitHub username", "Portfolio URL"] },
  { title: "AI preferences", icon: Brain, rows: ["Balanced roadmap", "Direct mentor tone", "Role-specific analysis"] },
  { title: "Notifications", icon: Zap, rows: ["Daily quest reminders", "Skill decay alerts", "Interview readiness reports"] },
  { title: "Privacy", icon: Target, rows: ["Private reports", "Local profile cache", "Delete profile intelligence"] }
];

const metricIcons: Record<string, LucideIcon> = {
  "Job Readiness": Target,
  "Skill Match": BadgeCheck,
  "Missing Skills": Brain,
  "GitHub Activity": Github,
  "Resume Strength": FileSearch,
  "Interview Odds": ShieldCheck,
  "Career Growth": Activity,
  "Salary Potential": BadgeDollarSign,
  "Interview Probability": Target,
  "GitHub Consistency": GitBranch
};

function EmptyState({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-md border border-dashed border-white/10 bg-white/[0.03] p-5 text-center text-sm text-muted-foreground", className)}>
      {children}
    </div>
  );
}

function LoadingLine({ show }: { show: boolean }) {
  return show ? (
    <div className="mt-3 flex items-center gap-2 text-xs text-cyan-200">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      Syncing live data
    </div>
  ) : null;
}

function taskResources(task: RoadmapTask) {
  return [...task.documentation, ...task.github_resources, ...task.recommended_videos].slice(0, 4);
}

export function IntakeAnalyzer() {
  const { profile, analyzeProfile, loading, error, dashboard } = useLiveCareer();
  const [form, setForm] = useState(profile);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await analyzeProfile(form);
  };

  return (
    <Panel className="p-5">
      <form onSubmit={onSubmit}>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h3 className="font-semibold">Live Profile Intake</h3>
        </div>
        <div className="mt-5 grid gap-3">
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">LinkedIn profile URL</span>
            <input
              className="h-11 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none transition focus:border-blue-400"
              placeholder="https://linkedin.com/in/you"
              value={form.linkedin_url ?? ""}
              onChange={(event) => updateField("linkedin_url", event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">GitHub username</span>
            <input
              className="h-11 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none transition focus:border-blue-400"
              placeholder="octocat"
              value={form.github_username ?? ""}
              onChange={(event) => updateField("github_username", event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Portfolio URL</span>
            <input
              className="h-11 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none transition focus:border-blue-400"
              placeholder="https://yourportfolio.dev"
              value={form.portfolio_url ?? ""}
              onChange={(event) => updateField("portfolio_url", event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Dream job title</span>
            <input
              className="h-11 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none transition focus:border-blue-400"
              placeholder="AI Full-Stack Engineer"
              required
              value={form.dream_job_title}
              onChange={(event) => updateField("dream_job_title", event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Resume text</span>
            <textarea
              className="min-h-24 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none transition focus:border-blue-400"
              placeholder="Paste resume text for live ATS and skill extraction."
              value={form.resume_text ?? ""}
              onChange={(event) => updateField("resume_text", event.target.value)}
            />
          </label>
        </div>
        <Button className="mt-5 w-full" variant="premium" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Analyze Live Signals
        </Button>
        <LoadingLine show={loading} />
        {error ? <p className="mt-3 text-xs text-rose-200">{error}</p> : null}
        {dashboard ? <p className="mt-3 text-xs text-muted-foreground">Last sync: {new Date(dashboard.synced_at).toLocaleString()}</p> : null}
      </form>
    </Panel>
  );
}

export function DashboardMetricsGrid() {
  const { dashboard } = useLiveCareer();
  const metrics = dashboard?.metrics ?? [];
  if (!metrics.length) {
    return <EmptyState className="md:col-span-2 xl:col-span-3">Run a live profile sync to populate dashboard metrics.</EmptyState>;
  }

  return (
    <>
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          {...metric}
          icon={metricIcons[metric.label] ?? Activity}
          tone={metric.tone}
        />
      ))}
    </>
  );
}

export function LiveSyncButton({ label = "Run AI Sync" }: { label?: string }) {
  const { refreshDashboard, loading } = useLiveCareer();
  return (
    <Button variant="premium" disabled={loading} onClick={() => void refreshDashboard()}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      {label}
    </Button>
  );
}

export function GenerateRoadmapButton({ label = "Generate Roadmap" }: { label?: string }) {
  const { generateRoadmap, loading, dashboard } = useLiveCareer();
  return (
    <Button variant="premium" disabled={loading || !dashboard?.gap_analysis.length} onClick={() => void generateRoadmap(30)}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      {label}
    </Button>
  );
}

export function GenerateProjectsButton({ label = "Generate AI Project" }: { label?: string }) {
  const { generateProjects, loading } = useLiveCareer();
  return (
    <Button variant="premium" disabled={loading} onClick={() => void generateProjects("all")}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      {label}
    </Button>
  );
}

export function AnalyticsMetricCards() {
  const { dashboard } = useLiveCareer();
  if (!dashboard) {
    return <EmptyState className="md:col-span-2 xl:col-span-4">Run a live sync to calculate analytics.</EmptyState>;
  }

  const metrics: DashboardMetric[] = [
    { label: "Career Growth", value: dashboard.report.readiness_score, suffix: "%", tone: "green" },
    { label: "Salary Potential", value: dashboard.report.salary_prediction_lpa, suffix: "L", tone: "amber" },
    { label: "Interview Probability", value: dashboard.report.interview_probability, suffix: "%", tone: "blue" },
    { label: "GitHub Consistency", value: dashboard.github?.activity_score ?? 0, suffix: "%", tone: "violet" }
  ];

  return (
    <>
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} icon={metricIcons[metric.label] ?? Activity} tone={metric.tone} />
      ))}
    </>
  );
}

export function ReadinessSummary() {
  const { dashboard } = useLiveCareer();
  const value = dashboard?.report.readiness_score ?? 0;
  const topGap = dashboard?.gap_analysis[0]?.skill ?? "No live gap yet";

  return (
    <div className="relative mt-5 flex flex-col items-center gap-5">
      <ProgressRing value={value} label={dashboard ? "Ready" : "Waiting"} size={154} />
      <div className="grid w-full grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-white/5 p-3">
          <Activity className="mb-2 h-4 w-4 text-cyan-300" />
          <p className="font-medium">{dashboard?.report.skill_match_percent ?? 0}% match</p>
          <p className="text-xs text-muted-foreground">Skill coverage</p>
        </div>
        <div className="rounded-md bg-white/5 p-3">
          <CalendarDays className="mb-2 h-4 w-4 text-violet-300" />
          <p className="font-medium">{topGap}</p>
          <p className="text-xs text-muted-foreground">Top priority</p>
        </div>
      </div>
    </div>
  );
}

export function RoadmapProgressSummary() {
  const { roadmap, dashboard, profile } = useLiveCareer();
  const tasks = roadmap?.tasks ?? dashboard?.roadmap?.tasks ?? dashboard?.roadmap_preview ?? [];
  const storageKey = roadmapStorageKey(roadmap?.title ?? dashboard?.roadmap?.title ?? "roadmap", profile.dream_job_title);
  const [completed, setCompleted] = useState(() => loadCompletedRoadmapDays(storageKey));

  useEffect(() => {
    setCompleted(loadCompletedRoadmapDays(storageKey));
  }, [storageKey]);

  const progress = tasks.length ? Math.round((completed.size / tasks.length) * 100) : 0;

  return (
    <div className="relative mt-5 flex flex-col items-center gap-3">
      <ProgressRing value={progress} label={tasks.length ? `${completed.size}/${tasks.length}` : "Waiting"} size={150} />
      {roadmap?.compression_score ? (
        <p className="text-center text-xs text-muted-foreground">
          Compression score {Math.round(roadmap.compression_score)}% · {roadmap.total_hours.toFixed(1)}h planned
        </p>
      ) : null}
    </div>
  );
}

export function RoadmapMilestones() {
  const { roadmap, dashboard } = useLiveCareer();
  const tasks = roadmap?.tasks ?? dashboard?.roadmap?.tasks ?? dashboard?.roadmap_preview ?? [];
  const totalHours = tasks.reduce((sum, task) => sum + task.estimated_hours, 0);
  const topGap = dashboard?.gap_analysis[0];
  const firstTask = tasks[0]?.topic ?? "Run live sync to generate first milestone";
  const skillFocus = topGap ? `${topGap.skill} (${Math.round(topGap.gap)}% gap)` : "No gap analysis yet";

  return (
    <div className="relative mt-4 grid gap-3 text-sm">
      <div className="flex items-center gap-3 rounded-md bg-white/5 px-3 py-3">
        <Zap className="h-4 w-4 text-cyan-300" />
        <span>
          <span className="block font-medium">Top priority</span>
          <span className="text-muted-foreground">{skillFocus}</span>
        </span>
      </div>
      <div className="flex items-center gap-3 rounded-md bg-white/5 px-3 py-3">
        <Target className="h-4 w-4 text-rose-300" />
        <span className="line-clamp-2">{firstTask}</span>
      </div>
      <div className="flex items-center gap-3 rounded-md bg-white/5 px-3 py-3">
        <Clock className="h-4 w-4 text-violet-300" />
        {totalHours ? `${totalHours.toFixed(1)} learning hours planned` : "No roadmap hours yet"}
      </div>
      <div className="flex items-center gap-3 rounded-md bg-white/5 px-3 py-3">
        <CalendarDays className="h-4 w-4 text-emerald-300" />
        {tasks.length ? `${tasks.length} tasks from skill analysis` : "Sync profile to build roadmap"}
      </div>
    </div>
  );
}

export function RoadmapCompletionSummary() {
  const { progress } = useLiveCareer();
  return (
    <div className="relative mt-5 flex justify-center">
      <ProgressRing value={progress?.completion_rate ?? 0} label={progress ? "Updated" : "Waiting"} size={160} />
    </div>
  );
}

export function SkillHeatmap() {
  const { dashboard } = useLiveCareer();
  const skills = dashboard?.heatmap_skills ?? [];
  if (!skills.length) {
    return <EmptyState>Run a live sync to score skill evidence.</EmptyState>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {skills.map((skill) => (
        <div key={skill.name} className="rounded-md border border-white/10 bg-white/5 p-3 transition hover:-translate-y-0.5 hover:border-blue-400/40">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{skill.name}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                skill.score >= 70 ? "bg-emerald-400/15 text-emerald-200" : skill.score >= 50 ? "bg-cyan-400/15 text-cyan-200" : "bg-amber-400/15 text-amber-200"
              )}
            >
              {skill.status}
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-300" style={{ width: `${skill.score}%` }} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{Math.round(skill.score)}% evidence strength</p>
        </div>
      ))}
    </div>
  );
}

export function GapAnalysisList() {
  const { dashboard } = useLiveCareer();
  const gaps = dashboard?.gap_analysis ?? [];
  if (!gaps.length) {
    return <EmptyState>Run a live sync to rank highest-impact gaps.</EmptyState>;
  }

  return (
    <div className="grid gap-3">
      {gaps.map((item) => (
        <Panel key={item.skill} className="p-4">
          <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold">{item.skill}</h3>
                <span className="rounded-full bg-rose-400/15 px-2 py-0.5 text-xs text-rose-200">{item.impact} impact</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.reason}</p>
            </div>
            <div className="min-w-40">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Gap</span>
                <span>{Math.round(item.gap)}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-amber-300" style={{ width: `${item.gap}%` }} />
              </div>
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}

export function RoadmapTimeline() {
  const { dashboard, roadmap, profile, updateProgress } = useLiveCareer();
  const tasks = roadmap?.tasks ?? dashboard?.roadmap?.tasks ?? dashboard?.roadmap_preview ?? [];
  const storageKey = roadmapStorageKey(roadmap?.title ?? dashboard?.roadmap?.title ?? "roadmap", profile.dream_job_title);
  const [openDay, setOpenDay] = useState(1);
  const [completed, setCompleted] = useState(() => loadCompletedRoadmapDays(storageKey));

  useEffect(() => {
    setCompleted(loadCompletedRoadmapDays(storageKey));
  }, [storageKey]);

  if (!tasks.length) {
    return (
      <EmptyState>
        Run a live profile sync on Dashboard first. Your roadmap is built from detected skill gaps, gap scores, and target role.
      </EmptyState>
    );
  }

  const toggleComplete = async (day: number) => {
    const next = new Set(completed);
    if (next.has(day)) {
      next.delete(day);
    } else {
      next.add(day);
      confetti({ particleCount: 70, spread: 58, origin: { y: 0.78 } });
      await updateProgress(`day-${day}`);
    }
    setCompleted(next);
    saveCompletedRoadmapDays(storageKey, next);
  };

  return (
    <div className="grid gap-4">
      {tasks.map((task) => {
        const isOpen = openDay === task.day;
        const isComplete = completed.has(task.day);
        return (
          <Panel key={task.day} className="p-4">
            <button className="relative flex w-full items-center gap-4 text-left" onClick={() => setOpenDay(isOpen ? 0 : task.day)}>
              <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-md border text-sm font-semibold", isComplete ? "border-emerald-300/50 bg-emerald-400/15 text-emerald-100" : "border-white/10 bg-white/5")}>
                {isComplete ? <CheckCircle2 className="h-5 w-5" /> : task.day}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{task.topic}</span>
                <span className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {task.skill ? <span className="text-cyan-200">{task.skill}</span> : null}
                  {task.phase ? <span>{task.phase}</span> : null}
                  <span>{task.difficulty}</span>
                  <span>{task.estimated_hours}h</span>
                  {task.gap_score ? <span>{Math.round(task.gap_score)}% gap</span> : null}
                </span>
              </span>
              <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-4 grid gap-4 border-t border-white/10 pt-4 md:grid-cols-[1fr_220px]">
                    <div>
                      {task.study_focus ? (
                        <p className="text-sm leading-6 text-muted-foreground">{task.study_focus}</p>
                      ) : null}
                      <p className="mt-2 text-sm font-medium text-foreground">Mini challenge</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{task.mini_challenge}</p>

                      {task.youtube_videos?.length ? (
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">YouTube to watch</p>
                          <div className="mt-2 grid gap-2">
                            {task.youtube_videos.map((video) => (
                              <a
                                key={video.url}
                                href={video.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-start gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:border-rose-400/40"
                              >
                                <Play className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                                <span>
                                  <span className="block font-medium text-foreground">{video.title}</span>
                                  {video.channel ? <span className="text-xs text-muted-foreground">{video.channel}</span> : null}
                                </span>
                                <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {task.leetcode_problems?.length ? (
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">LeetCode to solve</p>
                          <div className="mt-2 grid gap-2">
                            {task.leetcode_problems.map((problem) => (
                              <a
                                key={`${problem.number}-${problem.title}`}
                                href={problem.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:border-amber-400/40"
                              >
                                <Code2 className="h-4 w-4 shrink-0 text-amber-300" />
                                <span className="font-medium text-foreground">
                                  #{problem.number} {problem.title}
                                </span>
                                <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-xs text-amber-200">{problem.difficulty}</span>
                                <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {taskResources(task).map((resource) => (
                          <div key={resource} className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm">
                            <BookOpen className="h-4 w-4 text-cyan-300" />
                            {resource}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => void toggleComplete(task.day)} variant={isComplete ? "secondary" : "premium"}>
                        {isComplete ? "Mark Incomplete" : "Complete Task"}
                      </Button>
                      <Button variant="outline">
                        <Plus className="h-4 w-4" />
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Panel>
        );
      })}
    </div>
  );
}

export function ResumeDropzone({ compact = false, onFileSelect }: { compact?: boolean; onFileSelect?: (file: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  const selectFile = (file: File | undefined) => {
    if (!file) {
      return;
    }
    setFileName(file.name);
    onFileSelect?.(file);
  };

  return (
    <label
      className={cn("flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center transition", dragging ? "border-cyan-300 bg-cyan-300/10" : "border-white/15 bg-white/5 hover:bg-white/10", compact && "p-4")}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        selectFile(event.dataTransfer.files[0]);
      }}
    >
      <FileUp className="h-6 w-6 text-cyan-300" />
      <span className="mt-2 text-sm font-medium">{fileName || "Drop resume PDF"}</span>
      <span className="mt-1 text-xs text-muted-foreground">ATS scan, bullet quality, keyword coverage</span>
      <input type="file" accept="application/pdf,text/plain" className="hidden" onChange={(event) => selectFile(event.target.files?.[0])} />
    </label>
  );
}

export function ResumeAnalyzerPanel() {
  const { analyzeResume, resumeAnalysis, loading, error } = useLiveCareer();
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Panel className="p-5">
        <SectionHeader title="Resume Analyzer" description="Upload a PDF or paste text. The backend extracts the actual content and returns ATS, keyword, and proof-strength analysis." />
        <div className="mt-5">
          <ResumeDropzone onFileSelect={setFile} />
        </div>
        <textarea
          className="mt-4 min-h-36 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-blue-400"
          placeholder="Or paste resume text here."
          value={resumeText}
          onChange={(event) => setResumeText(event.target.value)}
        />
        <Button className="mt-5 w-full" variant="premium" disabled={loading || (!file && !resumeText.trim())} onClick={() => void analyzeResume(file, resumeText)}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSearch className="h-4 w-4" />}
          Analyze Resume
        </Button>
        {error ? <p className="mt-3 text-xs text-rose-200">{error}</p> : null}
      </Panel>
      <Panel className="p-5">
        <h3 className="font-semibold">Live Resume Results</h3>
        {resumeAnalysis ? (
          <div className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard label="ATS Score" value={resumeAnalysis.ats_score} suffix="%" icon={ShieldCheck} tone="cyan" />
              <MetricCard label="Resume Strength" value={resumeAnalysis.resume_strength} suffix="%" icon={FileSearch} tone="blue" />
            </div>
            <ResultList title="Missing keywords" rows={resumeAnalysis.missing_keywords} />
            <ResultList title="Improved bullets" rows={resumeAnalysis.improved_bullets} />
            <ResultList title="Recommendations" rows={resumeAnalysis.recommendations} />
          </div>
        ) : (
          <EmptyState className="mt-4">Upload or paste a resume to see live analysis.</EmptyState>
        )}
      </Panel>
    </div>
  );
}

function ResultList({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">{title}</p>
      <div className="mt-3 grid gap-2">
        {rows.length ? rows.map((row) => <p key={row} className="text-sm leading-6 text-muted-foreground">{row}</p>) : <p className="text-sm text-muted-foreground">No issues found.</p>}
      </div>
    </div>
  );
}

export function ProjectGeneratorPanel() {
  const { projects, generateProjects, loading, error } = useLiveCareer();
  const [level, setLevel] = useState("all");

  useEffect(() => {
    void generateProjects(level);
  }, [generateProjects, level]);

  const visible = useMemo(() => projects.filter((project) => level === "all" || project.level.toLowerCase() === level), [projects, level]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {["all", "beginner", "intermediate", "advanced"].map((item) => (
          <Button key={item} variant={level === item ? "premium" : "outline"} onClick={() => setLevel(item)}>
            {item[0].toUpperCase() + item.slice(1)}
          </Button>
        ))}
      </div>
      <LoadingLine show={loading} />
      {error ? <p className="text-xs text-rose-200">{error}</p> : null}
      {visible.length ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {visible.map((project) => (
            <Panel key={`${project.title}-${project.level}`} className="p-5">
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-blue-400/15 px-2 py-1 text-xs text-blue-200">{project.level}</span>
                  <h3 className="mt-4 text-xl font-semibold">{project.title}</h3>
                </div>
                <Rocket className="h-6 w-6 text-cyan-300" />
              </div>
              <p className="relative mt-4 text-sm leading-6 text-muted-foreground">{project.description}</p>
              <div className="relative mt-4 flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <span key={tech} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-muted-foreground">{tech}</span>
                ))}
              </div>
              <div className="relative mt-5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Resume impact</span>
                  <span>{Math.round(project.resume_impact_score)}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: `${project.resume_impact_score}%` }} />
                </div>
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <EmptyState>Projects will appear after the API returns generated plans.</EmptyState>
      )}
    </div>
  );
}

export function MockInterviewPanel() {
  const { interview, startInterview, loading, error } = useLiveCareer();
  const [mode, setMode] = useState("technical");
  const currentQuestion = interview?.questions[0] ?? "Start a live interview session to generate role-specific questions.";

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <Panel className="p-5">
        <div className="flex flex-wrap gap-2">
          {interviewModes.map(({ label, mode: itemMode }) => (
            <Button key={itemMode} variant={mode === itemMode ? "premium" : "outline"} onClick={() => setMode(itemMode)}>
              {label}
            </Button>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Weak-skill focused question</p>
          <h3 className="mt-3 text-2xl font-semibold leading-tight">{currentQuestion}</h3>
          <p className="mt-4 text-sm text-muted-foreground">{interview ? `Mode: ${interview.mode}` : "Generated from your latest dashboard gaps."}</p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {interviewModes.map(({ label, icon: Icon }) => (
            <Button key={label} variant="outline">
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          ))}
        </div>
      </Panel>
      <Panel className="p-5">
        <h3 className="font-semibold">Session Feedback</h3>
        {interview ? (
          <div className="mt-5 grid gap-4">
            {[
              ["Communication", interview.communication_score, interview.rubric.communication],
              ["Confidence", interview.confidence_score, interview.rubric.confidence],
              ["Technical depth", interview.technical_score, interview.rubric.technical]
            ].map(([label, score, note]) => (
              <div key={label as string}>
                <div className="flex items-center justify-between text-sm">
                  <span>{label as string}</span>
                  <span>{score as number}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300" style={{ width: `${score}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{note as string}</p>
              </div>
            ))}
            <ResultList title="Feedback" rows={interview.feedback} />
          </div>
        ) : (
          <EmptyState className="mt-5">Start a session to receive live questions.</EmptyState>
        )}
        <div className="mt-5 flex gap-2">
          <Button variant="premium" disabled={loading} onClick={() => void startInterview(mode)}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Start Session
          </Button>
          <Button variant="outline">
            <Send className="h-4 w-4" />
            Submit Answer
          </Button>
        </div>
        {error ? <p className="mt-3 text-xs text-rose-200">{error}</p> : null}
      </Panel>
    </div>
  );
}

export function CareerTwinPanel() {
  const { dashboard, mentorReply } = useLiveCareer();
  const timeline = dashboard?.roadmap_preview.slice(0, 4) ?? [];
  const summary = mentorReply?.reply ?? dashboard?.report.recommendations[0] ?? "Run a live sync to create your adaptive career twin.";

  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Panel className="p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-gradient-to-br from-violet-500/25 to-cyan-400/20 p-3">
            <Brain className="h-7 w-7 text-cyan-200" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Your Career Twin AI</h3>
            <p className="text-sm text-muted-foreground">Persistent mentor tuned to your proof, pace, and dream role.</p>
          </div>
        </div>
        <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-sm leading-6 text-muted-foreground">{summary}</p>
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
          <WandSparkles className="h-4 w-4" />
          {dashboard ? `Reality score ${Math.round(dashboard.report.reality_check_score)}% from latest sync` : "Waiting for live sync"}
        </div>
      </Panel>
      <Panel className="p-5">
        <h3 className="font-semibold">Prediction Timeline</h3>
        {timeline.length ? (
          <div className="mt-5 space-y-4">
            {timeline.map((item) => (
              <div key={item.day} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-glow" />
                  <div className="mt-2 h-full w-px bg-white/10" />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium">Day {item.day}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.topic}</p>
                  <span className="mt-2 inline-flex rounded-full bg-white/10 px-2 py-1 text-xs text-muted-foreground">{item.estimated_hours}h planned</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState className="mt-5">Roadmap predictions will appear after sync.</EmptyState>
        )}
      </Panel>
    </div>
  );
}

export function AchievementsGrid() {
  const { progress } = useLiveCareer();
  const achievements = progress?.achievements_unlocked ?? [];
  if (!achievements.length) {
    return <EmptyState>No achievements unlocked yet. Complete a live roadmap task to earn one.</EmptyState>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {achievements.map((achievement) => (
        <Panel key={achievement} className="p-4">
          <div className="relative flex items-start gap-3">
            <div className="rounded-md bg-amber-300/15 p-2 text-amber-100">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{achievement}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Unlocked from live progress update.</p>
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}

export function TaskBoard() {
  const { dashboard } = useLiveCareer();
  const tasks = dashboard?.upcoming_tasks ?? [];

  return (
    <Panel className="p-5">
      <h3 className="font-semibold">Upcoming Tasks</h3>
      <div className="mt-4 grid gap-3">
        {tasks.length ? tasks.map((task, index) => (
          <div key={task} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-3">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="flex h-6 w-6 items-center justify-center rounded bg-white/10 text-xs">{index + 1}</span>
            <span className="text-sm">{task}</span>
          </div>
        )) : <EmptyState>Run a live sync to create upcoming tasks.</EmptyState>}
      </div>
    </Panel>
  );
}

export function PricingCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {pricingPlans.map((plan) => (
        <Panel key={plan.name} className={cn("p-6", plan.highlighted && "border-blue-300/40 shadow-glow")}>
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              {plan.highlighted ? <span className="rounded-full bg-cyan-300/15 px-2 py-1 text-xs text-cyan-100">Popular</span> : null}
            </div>
            <div className="mt-5 flex items-end gap-1">
              <span className="text-4xl font-semibold">{plan.price}</span>
              <span className="pb-1 text-sm text-muted-foreground">/mo</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-6 grid gap-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <BadgeCheck className="h-4 w-4 text-cyan-300" />
                  {feature}
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full" variant={plan.highlighted ? "premium" : "outline"}>Choose {plan.name}</Button>
          </div>
        </Panel>
      ))}
    </div>
  );
}

export function SettingsPanel() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {settingsGroups.map(({ title, icon: Icon, rows }) => (
        <Panel key={title} className="p-5">
          <div className="relative flex items-center gap-3">
            <div className="rounded-md bg-white/10 p-2">
              <Icon className="h-5 w-5 text-cyan-300" />
            </div>
            <h3 className="font-semibold">{title}</h3>
          </div>
          <div className="relative mt-5 grid gap-3">
            {rows.map((row) => (
              <label key={row} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-3 text-sm">
                <span>{row}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-blue-500" />
              </label>
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}

export function OnboardingFlow() {
  return (
    <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-4">
      {onboardingSteps.map((step, index) => {
        const Icon = step.icon;
        return (
          <Panel key={step.title} className="p-5">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/25 to-cyan-400/15">
                <Icon className="h-5 w-5 text-cyan-200" />
              </div>
              <p className="mt-5 text-xs text-muted-foreground">Step {index + 1}</p>
              <h3 className="mt-1 font-semibold">{step.title}</h3>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}

export function DailyQuestCard() {
  const { dashboard } = useLiveCareer();
  const quest = dashboard?.upcoming_tasks[0];

  return (
    <Panel className="p-5">
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Daily Quest</p>
          <h3 className="mt-2 text-xl font-semibold">{quest ?? "Run a live sync"}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {quest ? "Complete this task and update progress from the roadmap." : "Connect profile evidence to generate your next best task."}
          </p>
        </div>
        <div className="hidden rounded-md bg-emerald-300/15 p-3 text-emerald-100 sm:block">
          <Trophy className="h-6 w-6" />
        </div>
      </div>
      <div className="relative mt-5 flex items-center gap-3">
        <Clock className="h-4 w-4 text-cyan-300" />
        <span className="text-sm text-muted-foreground">{dashboard ? "Generated from latest live sync" : "Waiting for live data"}</span>
      </div>
    </Panel>
  );
}

export function MentorChatPreview() {
  const { mentorReply, sendMentorMessage, loading, dashboard } = useLiveCareer();
  const [message, setMessage] = useState("What should I do next?");

  return (
    <Panel className="p-5">
      <div className="relative flex items-center gap-3">
        <div className="rounded-md bg-gradient-to-br from-blue-500 to-violet-500 p-2 text-white">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">AI Mentor</h3>
          <p className="text-xs text-muted-foreground">Adaptive guidance from your Career Twin</p>
        </div>
      </div>
      <div className="relative mt-5 space-y-3">
        <div className="max-w-[86%] rounded-lg bg-white/10 p-3 text-sm text-muted-foreground">
          {dashboard?.report.recommendations[0] ?? "Run a live sync and ask the mentor for next actions."}
        </div>
        {mentorReply ? (
          <div className="ml-auto max-w-[86%] rounded-lg bg-blue-500/20 p-3 text-sm text-blue-100">{mentorReply.reply}</div>
        ) : null}
      </div>
      <div className="relative mt-5 flex gap-2">
        <input
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-blue-400"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button variant="premium" disabled={loading} onClick={() => void sendMentorMessage(message)}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      {mentorReply?.next_actions.length ? <ResultList title="Next actions" rows={mentorReply.next_actions} /> : null}
    </Panel>
  );
}

export function FeaturePill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground">
      <Lightbulb className="h-3.5 w-3.5 text-cyan-300" />
      {children}
    </span>
  );
}
