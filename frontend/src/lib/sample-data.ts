import {
  Activity,
  BadgeCheck,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  Cpu,
  FileSearch,
  Flame,
  GitBranch,
  GraduationCap,
  LineChart,
  Map,
  MessageSquareText,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/analysis", label: "Skill Analysis", icon: Radar },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/mock-interview", label: "Mock Interview", icon: MessageSquareText },
  { href: "/resume-analyzer", label: "Resume Analyzer", icon: FileSearch },
  { href: "/project-generator", label: "Project Generator", icon: Rocket },
  { href: "/career-twin", label: "Career Twin", icon: Brain },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/pricing", label: "Pricing", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: ShieldCheck }
];

export const landingFeatures = [
  {
    title: "Multi-source profile intelligence",
    description: "Blend LinkedIn, resume, GitHub, and portfolio signals into one skill graph.",
    icon: Cpu
  },
  {
    title: "Reality Check Score",
    description: "See your actual competitiveness against real job expectations and hiring patterns.",
    icon: Target
  },
  {
    title: "Roadmap compression",
    description: "Generate the shortest high-impact path from current ability to interview-ready.",
    icon: Zap
  },
  {
    title: "Career Twin AI",
    description: "A persistent AI mentor that adapts guidance as your learning and projects evolve.",
    icon: Brain
  },
  {
    title: "Shadow learning detection",
    description: "Catch tutorial addiction early and rebalance toward portfolio-grade proof.",
    icon: Activity
  },
  {
    title: "ATS and resume lift",
    description: "Improve bullets, keyword coverage, role framing, and quantified career evidence.",
    icon: FileSearch
  }
];

export const companyLogos = [
  "Linear",
  "Vercel",
  "Stripe",
  "Perplexity",
  "Notion",
  "GitHub",
  "OpenAI",
  "Supabase",
  "Railway",
  "Clerk"
];

export const stats = [
  { label: "Readiness lift", value: 38, suffix: "%" },
  { label: "Roadmaps generated", value: 12400, suffix: "+" },
  { label: "Skills mapped", value: 740, suffix: "+" },
  { label: "Interview focus gain", value: 4.7, suffix: "x" }
];

export const readinessHistory = [
  { week: "W1", readiness: 42, github: 28, resume: 52 },
  { week: "W2", readiness: 48, github: 36, resume: 58 },
  { week: "W3", readiness: 57, github: 49, resume: 62 },
  { week: "W4", readiness: 63, github: 55, resume: 68 },
  { week: "W5", readiness: 71, github: 64, resume: 74 },
  { week: "W6", readiness: 78, github: 72, resume: 81 }
];

export const skillRadar = [
  { skill: "React", current: 82, target: 90 },
  { skill: "System Design", current: 44, target: 78 },
  { skill: "TypeScript", current: 70, target: 86 },
  { skill: "AI APIs", current: 58, target: 82 },
  { skill: "PostgreSQL", current: 51, target: 76 },
  { skill: "Testing", current: 39, target: 72 }
];

export const heatmapSkills = [
  { name: "React", score: 86, status: "Strong" },
  { name: "TypeScript", score: 74, status: "Growing" },
  { name: "FastAPI", score: 52, status: "Gap" },
  { name: "PostgreSQL", score: 48, status: "Gap" },
  { name: "RAG", score: 44, status: "Gap" },
  { name: "CI/CD", score: 39, status: "Risk" },
  { name: "Testing", score: 36, status: "Risk" },
  { name: "Design Systems", score: 61, status: "Growing" },
  { name: "Docker", score: 42, status: "Gap" },
  { name: "Security", score: 31, status: "Risk" },
  { name: "Data Modeling", score: 57, status: "Growing" },
  { name: "Leadership", score: 66, status: "Growing" }
];

export const dashboardMetrics = [
  { label: "Job Readiness", value: 78, suffix: "%", tone: "blue", icon: Target },
  { label: "Skill Match", value: 72, suffix: "%", tone: "violet", icon: BadgeCheck },
  { label: "Missing Skills", value: 9, suffix: "", tone: "amber", icon: Brain },
  { label: "Learning Streak", value: 14, suffix: "d", tone: "green", icon: Flame },
  { label: "Resume Strength", value: 81, suffix: "%", tone: "cyan", icon: FileSearch },
  { label: "ATS Compatibility", value: 88, suffix: "%", tone: "rose", icon: ShieldCheck }
] as const;

export const githubActivity = [
  { day: "Mon", commits: 8, reviews: 2 },
  { day: "Tue", commits: 11, reviews: 4 },
  { day: "Wed", commits: 6, reviews: 3 },
  { day: "Thu", commits: 14, reviews: 5 },
  { day: "Fri", commits: 9, reviews: 6 },
  { day: "Sat", commits: 4, reviews: 1 },
  { day: "Sun", commits: 7, reviews: 2 }
];

export const upcomingTasks = [
  "Ship FastAPI auth guard",
  "Convert resume bullets into impact stories",
  "Build one RAG mini-project",
  "Practice system design: feed ranking",
  "Record 3-minute project walkthrough"
];

export const gapAnalysis = [
  {
    skill: "Production RAG",
    gap: 41,
    impact: "High",
    reason: "Target roles expect chunking, retrieval evaluation, and source-grounded UX."
  },
  {
    skill: "System Design",
    gap: 34,
    impact: "High",
    reason: "Interview loops require scalable tradeoff reasoning beyond feature building."
  },
  {
    skill: "Testing Strategy",
    gap: 29,
    impact: "Medium",
    reason: "Portfolio projects show velocity, but lack regression confidence signals."
  },
  {
    skill: "PostgreSQL Modeling",
    gap: 24,
    impact: "Medium",
    reason: "Backend evidence is strongest when schema choices match product workflows."
  }
];

export const roadmapDays = Array.from({ length: 30 }, (_, index) => {
  const day = index + 1;
  const tracks = ["AI Systems", "Portfolio Proof", "Interview Skill", "Resume Signal"];
  const difficulties = ["Core", "Stretch", "Advanced"];
  return {
    day,
    title:
      day % 5 === 0
        ? "Milestone demo and review"
        : day % 3 === 0
          ? "Build a portfolio proof artifact"
          : "Close one target-role skill gap",
    track: tracks[index % tracks.length],
    difficulty: difficulties[index % difficulties.length],
    hours: 1.5 + (index % 4) * 0.5,
    completed: day < 9,
    resources: [
      "Official documentation deep dive",
      "NPTEL lecture segment",
      "GitHub reference implementation",
      "YouTube architecture walkthrough"
    ],
    challenge:
      day % 4 === 0
        ? "Explain your implementation tradeoff in a two-minute voice note."
        : "Ship a small, reviewable commit that proves this skill."
  };
});

export const interviewQuestions = [
  {
    type: "Technical",
    question: "Design a skill gap analysis pipeline that uses resume parsing and embeddings.",
    focus: "RAG, data modeling, API boundaries"
  },
  {
    type: "Coding",
    question: "Implement a function that ranks missing skills by target-role impact and current proficiency.",
    focus: "Algorithms, TypeScript clarity"
  },
  {
    type: "Behavioral",
    question: "Tell me about a time you converted ambiguous feedback into a measurable product improvement.",
    focus: "Communication, ownership"
  },
  {
    type: "System Design",
    question: "How would you scale roadmap generation for 100K users while keeping recommendations fresh?",
    focus: "Caching, queues, model cost"
  }
];

export const projects = [
  {
    level: "Beginner",
    name: "ATS Resume Lens",
    description: "Upload a resume and compare it with a target job post to surface missing keywords and weak bullets.",
    stack: ["Next.js", "FastAPI", "OpenAI", "PostgreSQL"],
    impact: 72
  },
  {
    level: "Intermediate",
    name: "GitHub Skill Miner",
    description: "Analyze repositories, languages, commits, and README depth to infer developer strengths.",
    stack: ["Python", "GitHub API", "Embeddings", "Recharts"],
    impact: 84
  },
  {
    level: "Advanced",
    name: "Career Twin Agent",
    description: "A persistent mentor agent that adjusts weekly quests from progress, skill decay, and interview signals.",
    stack: ["Agents", "RAG", "Queues", "PostgreSQL", "Clerk"],
    impact: 93
  }
];

export const achievements = [
  { title: "Roadmap Sprinter", description: "Completed 7 roadmap days", icon: Trophy },
  { title: "Project Evidence", description: "Published a portfolio artifact", icon: GitBranch },
  { title: "Interview Pulse", description: "Practiced 5 focused questions", icon: MessageSquareText },
  { title: "Skill Delta Closed", description: "Raised readiness by 20%", icon: GraduationCap }
];

export const salaryProjection = [
  { month: "Jan", low: 12, median: 18, high: 26 },
  { month: "Feb", low: 13, median: 20, high: 29 },
  { month: "Mar", low: 15, median: 23, high: 32 },
  { month: "Apr", low: 17, median: 26, high: 36 },
  { month: "May", low: 19, median: 29, high: 40 },
  { month: "Jun", low: 22, median: 33, high: 46 }
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    description: "For exploring your career delta.",
    features: ["1 profile analysis", "7-day roadmap", "Basic resume score", "Community resources"]
  },
  {
    name: "Pro",
    price: "$19",
    description: "For focused job readiness.",
    highlighted: true,
    features: ["Unlimited roadmaps", "Advanced AI mentor", "Deep resume analysis", "Mock interviews", "Company mode"]
  },
  {
    name: "Elite",
    price: "$79",
    description: "For premium interview preparation.",
    features: ["FAANG prep mode", "Salary strategy", "Portfolio review", "Weekly AI reports", "Priority roadmap compression"]
  }
];

export const notifications = [
  "System design score rose 9% after mock interview.",
  "React skill is strong, but testing evidence is decaying.",
  "Your roadmap can be compressed by 4 days if you ship the RAG project first.",
  "Resume impact score improved after adding quantified outcomes."
];

export const careerTwinTimeline = [
  { label: "Today", event: "Prioritize FastAPI auth and database modeling proof.", score: 78 },
  { label: "Tomorrow", event: "Practice behavioral answer tied to SkillDelta project impact.", score: 80 },
  { label: "Day 7", event: "Publish GitHub Skill Miner and record walkthrough.", score: 84 },
  { label: "Day 30", event: "Ready for AI full-stack screening loop.", score: 91 }
];

export const onboardingSteps = [
  { title: "Connect signals", icon: BriefcaseBusiness },
  { title: "Upload evidence", icon: FileSearch },
  { title: "Pick dream role", icon: Target },
  { title: "Launch roadmap", icon: CalendarDays }
];
