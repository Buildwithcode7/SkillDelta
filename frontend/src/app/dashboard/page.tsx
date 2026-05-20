import { Activity, CalendarDays, Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GitHubBarChart, ReadinessAreaChart, SkillRadarChart } from "@/components/charts";
import { MetricCard } from "@/components/metric-card";
import { PageHeading } from "@/components/page-heading";
import { ProgressRing } from "@/components/progress-ring";
import { AchievementsGrid, DailyQuestCard, SkillHeatmap, TaskBoard } from "@/components/product-widgets";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { dashboardMetrics } from "@/lib/sample-data";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Dashboard"
        title="Your career command center."
        description="A live view of readiness, skill match, resume quality, GitHub evidence, streaks, and the next best task."
      >
        <Button variant="premium">
          <Sparkles className="h-4 w-4" />
          Run AI Sync
        </Button>
      </PageHeading>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel className="p-5">
          <SectionHeader eyebrow="Growth" title="Readiness momentum" description="Resume strength and weekly progress are moving together." />
          <div className="relative mt-5">
            <ReadinessAreaChart />
          </div>
        </Panel>
        <Panel className="p-5">
          <SectionHeader eyebrow="Score" title="Job readiness" />
          <div className="relative mt-5 flex flex-col items-center gap-5">
            <ProgressRing value={78} label="Ready" size={154} />
            <div className="grid w-full grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-white/5 p-3">
                <Activity className="mb-2 h-4 w-4 text-cyan-300" />
                <p className="font-medium">+12% this month</p>
                <p className="text-xs text-muted-foreground">Skill velocity</p>
              </div>
              <div className="rounded-md bg-white/5 p-3">
                <CalendarDays className="mb-2 h-4 w-4 text-violet-300" />
                <p className="font-medium">22 days</p>
                <p className="text-xs text-muted-foreground">To target loop</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel className="p-5">
          <SectionHeader eyebrow="SkillGraph" title="Target-role coverage" />
          <div className="relative mt-5">
            <SkillRadarChart />
          </div>
        </Panel>
        <Panel className="p-5">
          <SectionHeader eyebrow="Heatmap" title="Skill evidence by category" />
          <div className="relative mt-5">
            <SkillHeatmap />
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <Panel className="p-5">
          <SectionHeader eyebrow="GitHub" title="Repository activity" description="Commit consistency and review behavior are scored as career evidence." />
          <div className="relative mt-5">
            <GitHubBarChart />
          </div>
        </Panel>
        <TaskBoard />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <DailyQuestCard />
        <AchievementsGrid />
      </div>
    </AppShell>
  );
}
