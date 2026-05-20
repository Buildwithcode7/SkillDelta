"use client";

import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code2,
  FileUp,
  Github,
  GripVertical,
  Lightbulb,
  Link2,
  Mic,
  Play,
  Plus,
  Rocket,
  Send,
  Sparkles,
  Target,
  Trophy,
  Video,
  WandSparkles,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import {
  achievements,
  careerTwinTimeline,
  gapAnalysis,
  heatmapSkills,
  interviewQuestions,
  onboardingSteps,
  pricingPlans,
  projects,
  roadmapDays,
  upcomingTasks
} from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const interviewModes: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Voice", icon: Mic },
  { label: "Coding", icon: Code2 },
  { label: "Video", icon: Video }
];

const settingsGroups: Array<{ title: string; icon: LucideIcon; rows: string[] }> = [
  { title: "Profile signals", icon: Link2, rows: ["LinkedIn connected", "GitHub username synced", "Portfolio indexed"] },
  { title: "AI preferences", icon: Brain, rows: ["Roadmap intensity: Balanced", "Mentor tone: Direct", "Dream company mode: Enabled"] },
  { title: "Notifications", icon: Zap, rows: ["Daily quest reminders", "Skill decay alerts", "Interview readiness reports"] },
  { title: "Privacy", icon: Target, rows: ["Private reports", "Resume uploads encrypted", "Delete profile intelligence"] }
];

export function IntakeAnalyzer() {
  return (
    <Panel className="p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-cyan-300" />
        <h3 className="font-semibold">AI Profile Intake</h3>
      </div>
      <div className="mt-5 grid gap-3">
        {[
          ["LinkedIn profile URL", "https://linkedin.com/in/you"],
          ["GitHub username", "octo-builder"],
          ["Portfolio URL", "https://yourportfolio.dev"],
          ["Dream job title", "AI Full-Stack Engineer"]
        ].map(([label, placeholder]) => (
          <label key={label} className="grid gap-2 text-sm">
            <span className="text-muted-foreground">{label}</span>
            <input
              className="h-11 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none transition focus:border-blue-400"
              placeholder={placeholder}
            />
          </label>
        ))}
        <ResumeDropzone compact />
      </div>
      <Button className="mt-5 w-full" variant="premium">
        Analyze My Skills
        <ArrowRight className="h-4 w-4" />
      </Button>
    </Panel>
  );
}

export function SkillHeatmap() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {heatmapSkills.map((skill) => (
        <div
          key={skill.name}
          className="rounded-md border border-white/10 bg-white/5 p-3 transition hover:-translate-y-0.5 hover:border-blue-400/40"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{skill.name}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                skill.score >= 70
                  ? "bg-emerald-400/15 text-emerald-200"
                  : skill.score >= 50
                    ? "bg-cyan-400/15 text-cyan-200"
                    : "bg-amber-400/15 text-amber-200"
              )}
            >
              {skill.status}
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-300"
              style={{ width: `${skill.score}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{skill.score}% evidence strength</p>
        </div>
      ))}
    </div>
  );
}

export function GapAnalysisList() {
  return (
    <div className="grid gap-3">
      {gapAnalysis.map((item) => (
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
                <span>{item.gap}%</span>
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
  const [openDay, setOpenDay] = useState(1);
  const [completed, setCompleted] = useState(() => new Set(roadmapDays.filter((day) => day.completed).map((day) => day.day)));

  const toggleComplete = (day: number) => {
    const next = new Set(completed);
    if (next.has(day)) {
      next.delete(day);
    } else {
      next.add(day);
      confetti({ particleCount: 70, spread: 58, origin: { y: 0.78 } });
    }
    setCompleted(next);
  };

  return (
    <div className="grid gap-4">
      {roadmapDays.map((day) => {
        const isOpen = openDay === day.day;
        const isComplete = completed.has(day.day);
        return (
          <Panel key={day.day} className="p-4">
            <button className="relative flex w-full items-center gap-4 text-left" onClick={() => setOpenDay(isOpen ? 0 : day.day)}>
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border text-sm font-semibold",
                  isComplete ? "border-emerald-300/50 bg-emerald-400/15 text-emerald-100" : "border-white/10 bg-white/5"
                )}
              >
                {isComplete ? <CheckCircle2 className="h-5 w-5" /> : day.day}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{day.title}</span>
                <span className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{day.track}</span>
                  <span>{day.difficulty}</span>
                  <span>{day.hours}h</span>
                </span>
              </span>
              <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 grid gap-4 border-t border-white/10 pt-4 md:grid-cols-[1fr_220px]">
                    <div>
                      <p className="text-sm leading-6 text-muted-foreground">{day.challenge}</p>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        {day.resources.map((resource) => (
                          <div key={resource} className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2 text-sm">
                            <BookOpen className="h-4 w-4 text-cyan-300" />
                            {resource}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button onClick={() => toggleComplete(day.day)} variant={isComplete ? "secondary" : "premium"}>
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

export function ResumeDropzone({ compact = false }: { compact?: boolean }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");

  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-5 text-center transition",
        dragging ? "border-cyan-300 bg-cyan-300/10" : "border-white/15 bg-white/5 hover:bg-white/10",
        compact && "p-4"
      )}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        setFileName(event.dataTransfer.files[0]?.name ?? "");
      }}
    >
      <FileUp className="h-6 w-6 text-cyan-300" />
      <span className="mt-2 text-sm font-medium">{fileName || "Drop resume PDF"}</span>
      <span className="mt-1 text-xs text-muted-foreground">ATS scan, bullet quality, keyword coverage</span>
      <input
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
      />
    </label>
  );
}

export function ResumeAnalyzerPanel() {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Panel className="p-5">
        <SectionHeader
          title="Resume Analyzer"
          description="Drag a PDF and SkillDelta will score ATS compatibility, role alignment, bullet strength, and missing evidence."
        />
        <div className="mt-5">
          <ResumeDropzone />
        </div>
        <div className="mt-5 grid gap-3">
          {["AI parsing", "ATS keyword scan", "Bullet rewrite", "Impact calibration"].map((item, index) => (
            <div key={item} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2 text-sm">
              <span>{item}</span>
              <span className="text-cyan-200">{index < 2 ? "Ready" : "Queued"}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel className="p-5">
        <h3 className="font-semibold">AI Rewrite Preview</h3>
        <div className="mt-4 space-y-3">
          {[
            ["Before", "Built dashboards for an analytics app using React."],
            ["After", "Built 6 production React dashboards that reduced recruiter review time by 32% through role-specific metrics and ATS-aligned summaries."],
            ["Missing proof", "Add deployment link, test coverage, and quantified usage."]
          ].map(([label, text]) => (
            <div key={label} className="rounded-md border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">{label}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function ProjectGeneratorPanel() {
  const [level, setLevel] = useState("All");
  const visible = useMemo(() => projects.filter((project) => level === "All" || project.level === level), [level]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {["All", "Beginner", "Intermediate", "Advanced"].map((item) => (
          <Button key={item} variant={level === item ? "premium" : "outline"} onClick={() => setLevel(item)}>
            {item}
          </Button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {visible.map((project) => (
          <Panel key={project.name} className="p-5">
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-blue-400/15 px-2 py-1 text-xs text-blue-200">{project.level}</span>
                <h3 className="mt-4 text-xl font-semibold">{project.name}</h3>
              </div>
              <Rocket className="h-6 w-6 text-cyan-300" />
            </div>
            <p className="relative mt-4 text-sm leading-6 text-muted-foreground">{project.description}</p>
            <div className="relative mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span key={tech} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-muted-foreground">
                  {tech}
                </span>
              ))}
            </div>
            <div className="relative mt-5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Resume impact</span>
                <span>{project.impact}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" style={{ width: `${project.impact}%` }} />
              </div>
            </div>
            <Button className="relative mt-5 w-full" variant="outline">
              Generate Structure
            </Button>
          </Panel>
        ))}
      </div>
    </div>
  );
}

export function MockInterviewPanel() {
  const [mode, setMode] = useState("Technical");
  const current = interviewQuestions.find((question) => question.type === mode) ?? interviewQuestions[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <Panel className="p-5">
        <div className="flex flex-wrap gap-2">
          {interviewQuestions.map((question) => (
            <Button key={question.type} variant={mode === question.type ? "premium" : "outline"} onClick={() => setMode(question.type)}>
              {question.type}
            </Button>
          ))}
        </div>
        <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Weak-skill focused question</p>
          <h3 className="mt-3 text-2xl font-semibold leading-tight">{current.question}</h3>
          <p className="mt-4 text-sm text-muted-foreground">Focus: {current.focus}</p>
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
        <h3 className="font-semibold">Instant AI Feedback</h3>
        <div className="mt-5 grid gap-4">
          {[
            ["Communication", 82, "Clear structure, add tighter tradeoff language."],
            ["Confidence", 76, "Good pace, fewer filler transitions."],
            ["Technical depth", 69, "Mention retrieval evaluation and fallbacks."]
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
        </div>
        <div className="mt-5 flex gap-2">
          <Button variant="premium">
            <Play className="h-4 w-4" />
            Start Session
          </Button>
          <Button variant="outline">
            <Send className="h-4 w-4" />
            Submit Answer
          </Button>
        </div>
      </Panel>
    </div>
  );
}

export function CareerTwinPanel() {
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
          <p className="text-sm leading-6 text-muted-foreground">
            You are strong in frontend product craft. The shortest employability path is backend proof, RAG evaluation, and one concise walkthrough that explains tradeoffs.
          </p>
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm text-cyan-100">
          <WandSparkles className="h-4 w-4" />
          Roadmap compression available: save 4 days
        </div>
      </Panel>
      <Panel className="p-5">
        <h3 className="font-semibold">Prediction Timeline</h3>
        <div className="mt-5 space-y-4">
          {careerTwinTimeline.map((item) => (
            <div key={item.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-glow" />
                <div className="mt-2 h-full w-px bg-white/10" />
              </div>
              <div className="pb-4">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.event}</p>
                  <span className="mt-2 inline-flex rounded-full bg-white/10 px-2 py-1 text-xs text-muted-foreground">
                  Predicted readiness {item.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function AchievementsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {achievements.map((achievement) => {
        const Icon = achievement.icon;
        return (
          <Panel key={achievement.title} className="p-4">
            <div className="relative flex items-start gap-3">
              <div className="rounded-md bg-amber-300/15 p-2 text-amber-100">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          </Panel>
        );
      })}
    </div>
  );
}

export function TaskBoard() {
  return (
    <Panel className="p-5">
      <h3 className="font-semibold">Upcoming Tasks</h3>
      <div className="mt-4 grid gap-3">
        {upcomingTasks.map((task, index) => (
          <div key={task} className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-3 py-3">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <span className="flex h-6 w-6 items-center justify-center rounded bg-white/10 text-xs">{index + 1}</span>
            <span className="text-sm">{task}</span>
          </div>
        ))}
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
            <Button className="mt-6 w-full" variant={plan.highlighted ? "premium" : "outline"}>
              Choose {plan.name}
            </Button>
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
  return (
    <Panel className="p-5">
      <div className="relative flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Daily Quest</p>
          <h3 className="mt-2 text-xl font-semibold">Ship one backend proof commit</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add one FastAPI endpoint, one model test, and one README note. Reward: 120 XP.
          </p>
        </div>
        <div className="hidden rounded-md bg-emerald-300/15 p-3 text-emerald-100 sm:block">
          <Trophy className="h-6 w-6" />
        </div>
      </div>
      <div className="relative mt-5 flex items-center gap-3">
        <Clock className="h-4 w-4 text-cyan-300" />
        <span className="text-sm text-muted-foreground">4h left to keep 14-day streak alive</span>
      </div>
    </Panel>
  );
}

export function MentorChatPreview() {
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
          Your GitHub shows React strength, but AI full-stack roles need backend confidence. Want the shortest project path?
        </div>
        <div className="ml-auto max-w-[86%] rounded-lg bg-blue-500/20 p-3 text-sm text-blue-100">
          Yes. Compress the roadmap and prioritize proof that recruiters can verify.
        </div>
        <div className="max-w-[86%] rounded-lg bg-white/10 p-3 text-sm text-muted-foreground">
          Start with an ATS Resume Lens, then publish a RAG evaluator. This raises interview probability by an estimated 18%.
        </div>
      </div>
    </Panel>
  );
}

export function FeaturePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground">
      <Lightbulb className="h-3.5 w-3.5 text-cyan-300" />
      {children}
    </span>
  );
}
