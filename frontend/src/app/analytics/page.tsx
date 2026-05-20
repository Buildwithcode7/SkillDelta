import { Activity, BadgeDollarSign, GitBranch, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GitHubBarChart, ReadinessAreaChart, SalaryProjectionChart, SkillRadarChart } from "@/components/charts";
import { MetricCard } from "@/components/metric-card";
import { PageHeading } from "@/components/page-heading";
import { ProgressRing } from "@/components/progress-ring";
import { Panel, SectionHeader } from "@/components/ui/panel";

export default function AnalyticsPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Analytics"
        title="Track growth, salary potential, readiness improvement, and GitHub consistency."
        description="Use long-range career intelligence to understand where momentum is real and where the roadmap needs adjustment."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Career Growth" value={41} suffix="%" icon={Activity} tone="green" />
        <MetricCard label="Salary Potential" value={33} suffix="L" icon={BadgeDollarSign} tone="amber" />
        <MetricCard label="Interview Probability" value={68} suffix="%" icon={Target} tone="blue" />
        <MetricCard label="GitHub Consistency" value={74} suffix="%" icon={GitBranch} tone="violet" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel className="p-5">
          <SectionHeader eyebrow="Readiness" title="Growth over time" />
          <div className="relative mt-5">
            <ReadinessAreaChart />
          </div>
        </Panel>
        <Panel className="p-5">
          <SectionHeader eyebrow="Salary" title="Potential projection" />
          <div className="relative mt-5">
            <SalaryProjectionChart />
          </div>
        </Panel>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Panel className="p-5">
          <SectionHeader eyebrow="Completion" title="Roadmap completion rate" />
          <div className="relative mt-5 flex justify-center">
            <ProgressRing value={63} label="On track" size={160} />
          </div>
        </Panel>
        <Panel className="p-5">
          <SectionHeader eyebrow="GitHub" title="Consistency and reviews" />
          <div className="relative mt-5">
            <GitHubBarChart />
          </div>
        </Panel>
      </div>
      <div className="mt-6">
        <Panel className="p-5">
          <SectionHeader eyebrow="Skill progression" title="Current vs dream-role readiness" />
          <div className="relative mt-5">
            <SkillRadarChart />
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
