import { AppShell } from "@/components/app-shell";
import { GitHubBarChart, ReadinessAreaChart, SkillRadarChart } from "@/components/charts";
import { PageHeading } from "@/components/page-heading";
import { ParticipationCertificatePanel } from "@/components/participation-certificate";
import { AchievementsGrid, DailyQuestCard, DashboardMetricsGrid, LiveSyncButton, ReadinessSummary, SkillHeatmap, TaskBoard } from "@/components/product-widgets";
import { Panel, SectionHeader } from "@/components/ui/panel";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Dashboard"
        title="Your career command center."
        description="A live view of readiness, skill match, resume quality, GitHub evidence, streaks, and the next best task."
      >
        <LiveSyncButton />
      </PageHeading>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardMetricsGrid />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel className="p-5">
          <SectionHeader eyebrow="Evidence" title="Readiness by data source" description="Scores from your resume, GitHub, skill match, and combined readiness at sync time." />
          <div className="relative mt-5">
            <ReadinessAreaChart />
          </div>
        </Panel>
        <Panel className="p-5">
          <SectionHeader eyebrow="Score" title="Job readiness" />
          <ReadinessSummary />
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

      <div className="mt-6">
        <ParticipationCertificatePanel compact />
      </div>
    </AppShell>
  );
}
