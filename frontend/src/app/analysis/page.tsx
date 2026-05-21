import { AppShell } from "@/components/app-shell";
import { SkillRadarChart } from "@/components/charts";
import { PageHeading } from "@/components/page-heading";
import { GapAnalysisList, IntakeAnalyzer, LiveSyncButton, SkillHeatmap } from "@/components/product-widgets";
import { Panel, SectionHeader } from "@/components/ui/panel";

export default function AnalysisPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Skill Analysis"
        title="Connect your evidence. See the delta."
        description="Skill scores come from resume keywords, GitHub languages and activity, and role targets — gaps are ranked by measured evidence, not generic templates."
      >
        <LiveSyncButton label="Re-analyze" />
      </PageHeading>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <IntakeAnalyzer />
        <Panel className="p-5">
          <SectionHeader eyebrow="SkillGraph" title="Current vs target skill shape" />
          <div className="relative mt-5">
            <SkillRadarChart />
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Panel className="p-5">
          <SectionHeader eyebrow="Competitive heatmap" title="What is strong, growing, missing, or risky" />
          <div className="relative mt-5">
            <SkillHeatmap />
          </div>
        </Panel>
        <div>
          <SectionHeader eyebrow="Gap detector" title="Highest-impact missing skills" />
          <div className="mt-5">
            <GapAnalysisList />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
