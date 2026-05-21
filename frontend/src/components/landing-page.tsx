"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Brain, CheckCircle2, Shield, Sparkles, Target, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ParticleField } from "@/components/particle-field";
import { ProgressRing } from "@/components/progress-ring";
import { SkillRadarChart } from "@/components/charts";
import { MarketingNav } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { FeaturePill, IntakeAnalyzer, MentorChatPreview, PricingCards, SkillHeatmap } from "@/components/product-widgets";
import { AnimatedCounter } from "@/components/animated-counter";
import { dataSources, integrationStats, landingFeatures } from "@/lib/static-content";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 }
};

const howItWorks: Array<{ title: string; description: string; icon: LucideIcon }> = [
  { title: "Connect evidence", description: "LinkedIn, resume, GitHub, portfolio, and dream role.", icon: Target },
  { title: "Extract skills", description: "AI detects hard skills, soft signals, project depth, and decay.", icon: Brain },
  { title: "Compare market", description: "Role expectations are matched against your actual proof.", icon: Shield },
  { title: "Execute roadmap", description: "Thirty days of tasks, resources, projects, and mock interviews.", icon: Zap }
];

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <MarketingNav />
      <section className="relative overflow-hidden pt-16 sm:pt-24">
        <ParticleField density={76} />
        <div className="absolute inset-0 -z-10 grid-surface opacity-70" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-4 sm:px-6 sm:pt-10 lg:grid-cols-[1fr_460px] lg:px-8 lg:pt-20">
          <motion.div variants={container} initial="hidden" animate="show" className="relative z-10 max-w-4xl">
            <motion.div variants={item} className="scrollbar-thin mb-4 flex gap-2 overflow-x-auto pb-1">
              <FeaturePill>AI skill gap analysis</FeaturePill>
              <FeaturePill>30-day roadmap</FeaturePill>
              <FeaturePill>Career Twin AI</FeaturePill>
            </motion.div>
            <motion.h1
              variants={item}
              className="text-balance text-4xl font-semibold leading-[1.05] tracking-normal text-foreground sm:text-6xl lg:text-7xl"
            >
              Know Exactly What's Missing Between You and Your Dream Job.
            </motion.h1>
            <motion.p variants={item} className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              AI-powered skill gap analysis, personalized learning paths, and career intelligence for modern developers.
            </motion.p>
            <motion.div variants={item} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="premium">
                <Link href="/analysis">
                  Analyze My Skills
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/onboarding">
                  Get Started Free
                  <Sparkles className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div variants={item} className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {integrationStats.map((stat) => (
                <Panel key={stat.label} className="p-4">
                  <div className="relative text-2xl font-semibold">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.value % 1 === 0 ? 0 : 1} />
                  </div>
                  <p className="relative mt-1 text-xs text-muted-foreground">{stat.label}</p>
                </Panel>
              ))}
            </motion.div>
          </motion.div>
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <IntakeAnalyzer />
            </motion.div>
            <motion.div
              className="absolute -left-6 top-10 hidden w-52 animate-float-slow lg:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Panel className="p-4">
                <div className="relative flex items-center gap-3">
                  <ProgressRing value={0} size={92} />
                  <div>
                    <p className="text-xs text-muted-foreground">Job readiness</p>
                    <p className="mt-1 text-sm font-medium">Populates after live sync</p>
                  </div>
                </div>
              </Panel>
            </motion.div>
            <motion.div
              className="absolute -right-8 bottom-8 hidden w-60 animate-float-slow lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <Panel className="p-4">
                <p className="relative text-sm font-medium">Reality Check Score</p>
                <div className="relative mt-3 space-y-2">
                  {[
                    ["Interview probability", 0],
                    ["Portfolio proof", 0],
                    ["Skill decay risk", 0]
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{label as string}</span>
                        <span>{value as number}%</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded bg-white/10">
                        <div className="h-full rounded bg-cyan-300" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </motion.div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="overflow-hidden border-y border-white/10 py-4">
            <div className="flex w-max animate-marquee gap-8">
              {[...dataSources, ...dataSources].map((logo, index) => (
                <span key={`${logo}-${index}`} className="text-sm font-medium text-muted-foreground">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Career intelligence"
          title="Everything you need to move from learning to employability."
          description="SkillDelta turns scattered career evidence into a clear system: skills, gaps, roadmap, projects, interviews, and measurable progress."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {landingFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Panel key={feature.title} className="p-5">
                <div className="relative">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/25 to-cyan-300/15 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </div>
              </Panel>
            );
          })}
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="How it works" title="A career operating system in four moves." />
        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {howItWorks.map(({ title, description, icon: Icon }, index) => (
            <Panel key={title} className="p-5">
              <div className="relative">
                <span className="text-xs text-muted-foreground">0{index + 1}</span>
                <Icon className="mt-4 h-6 w-6 text-cyan-300" />
                <h3 className="mt-5 font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <Panel className="p-5">
          <SectionHeader eyebrow="Skill graph" title="See your career delta as a living graph." />
          <div className="relative mt-6">
            <SkillRadarChart />
          </div>
        </Panel>
        <Panel className="p-5">
          <SectionHeader eyebrow="Competitive heatmap" title="Strength, gap, and risk by skill." />
          <div className="relative mt-6">
            <SkillHeatmap />
          </div>
        </Panel>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <MentorChatPreview />
        <Panel className="p-5">
          <SectionHeader eyebrow="AI mentor preview" title="Daily guidance that adapts to your proof." />
          <div className="relative mt-6 grid gap-3">
            {[
              "Warns when learning becomes tutorial-heavy.",
              "Compresses the roadmap when a project can replace multiple lessons.",
              "Predicts weak interview areas before they cost you opportunities."
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 rounded-md bg-white/5 px-3 py-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                {text}
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Loved by ambitious builders" title="Designed for developers who want honest signal." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[ 
            "GitHub activity is fetched through the live FastAPI integration.",
            "Resume PDFs are parsed on the backend before scoring.",
            "Roadmaps and projects are generated from the latest profile sync."
          ].map((quote, index) => (
            <Panel key={quote} className="p-5">
              <p className="relative text-sm leading-6 text-muted-foreground">{quote}</p>
              <div className="relative mt-5 flex items-center gap-2 text-sm">
                <BadgeCheck className="h-4 w-4 text-cyan-300" />
                Live path {index + 1}
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Pricing" title="Start free, upgrade when you are ready to compete." />
        <div className="mt-10">
          <PricingCards />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="FAQ" title="Questions recruiters, learners, and builders usually ask." />
        <div className="mt-8 grid gap-3">
          {[
            ["Does SkillDelta scrape LinkedIn?", "No. The app uses user-provided URLs and compliant backend adapters."],
            ["Can it use my OpenAI key?", "Yes. Set OPENAI_API_KEY and OPENAI_MODEL for live model generation."],
            ["Is the roadmap generic?", "No. It is generated from your role target, current skills, missing evidence, and progress history."],
            ["Can teams use it?", "The schema supports users, goals, reports, interviews, projects, notifications, and learning progress."]
          ].map(([question, answer]) => (
            <Panel key={question} className="p-5">
              <h3 className="relative font-semibold">{question}</h3>
              <p className="relative mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
            </Panel>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>SkillDelta. AI career intelligence for modern developers.</p>
          <div className="flex gap-4">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/settings" className="hover:text-foreground">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
