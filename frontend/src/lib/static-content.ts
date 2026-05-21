import {
  Activity,
  Award,
  BadgeCheck,
  BarChart3,
  Brain,
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  Cpu,
  FileSearch,
  LineChart,
  Map,
  MessageSquareText,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
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
  { href: "/certificate", label: "Certificate", icon: Award },
  { href: "/pricing", label: "Pricing", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: ShieldCheck }
];

export const landingFeatures = [
  {
    title: "Live profile intelligence",
    description: "Pull public GitHub activity, parse resume text, and combine it with role targets through the FastAPI backend.",
    icon: Cpu
  },
  {
    title: "Reality Check Score",
    description: "Score competitiveness from current evidence instead of pre-filled numbers.",
    icon: Target
  },
  {
    title: "Roadmap compression",
    description: "Generate a focused path from current gaps, not a generic lesson list.",
    icon: Zap
  },
  {
    title: "Career Twin AI",
    description: "Ask an AI mentor for next actions using your latest sync context.",
    icon: Brain
  },
  {
    title: "Evidence-first analysis",
    description: "Separate actual shipped proof from skills that only appear as claims.",
    icon: Activity
  },
  {
    title: "ATS and resume lift",
    description: "Upload a resume PDF or paste text and receive keyword, bullet, and proof-strength analysis.",
    icon: FileSearch
  }
];

export const dataSources = [
  "GitHub API",
  "OpenAI API",
  "Resume PDF",
  "Portfolio URL",
  "LinkedIn URL",
  "FastAPI",
  "PostgreSQL",
  "Vercel",
  "Render",
  "Clerk"
];

export const integrationStats = [
  { label: "Live API endpoints", value: 9, suffix: "" },
  { label: "Signal sources", value: 4, suffix: "" },
  { label: "Static metric arrays", value: 0, suffix: "" },
  { label: "Frontend API state", value: 1, suffix: "x" }
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

export const onboardingSteps = [
  { title: "Connect signals", icon: BriefcaseBusiness },
  { title: "Upload evidence", icon: FileSearch },
  { title: "Pick dream role", icon: Target },
  { title: "Launch roadmap", icon: CalendarDays }
];

export const trustItems = [
  { title: "Backend synced", icon: BadgeCheck },
  { title: "GitHub live", icon: Code2 },
  { title: "AI-ready", icon: Sparkles }
];
