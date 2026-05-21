import { AppShell } from "@/components/app-shell";
import { GitHubBarChart, ReadinessAreaChart, SalaryProjectionChart, SkillRadarChart } from "@/components/charts";
import { PageHeading } from "@/components/page-heading";
import { AnalyticsMetricCards, RoadmapCompletionSummary } from "@/components/product-widgets";
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
        <AnalyticsMetricCards />
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
          <RoadmapCompletionSummary />
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
