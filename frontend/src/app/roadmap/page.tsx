import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import {
  GapAnalysisList,
  GenerateRoadmapButton,
  RoadmapMilestones,
  RoadmapProgressSummary,
  RoadmapTimeline
} from "@/components/product-widgets";
import { Panel, SectionHeader } from "@/components/ui/panel";

export default function RoadmapPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Learning Roadmap"
        title="A 30-day path built from your live skill gap analysis."
        description="Each day targets a prioritized skill gap with YouTube lessons to watch, numbered LeetCode problems to solve, docs, and proof challenges. Sync your profile first, then regenerate when gaps change."
      >
        <GenerateRoadmapButton label="Regenerate from gaps" />
      </PageHeading>

      <Panel className="mb-6 p-5">
        <SectionHeader
          eyebrow="Skill analysis"
          title="Gaps driving this roadmap"
          description="Days and hours are allocated by gap size and impact — larger High-impact gaps get more focus."
        />
        <div className="mt-5">
          <GapAnalysisList />
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="space-y-5">
          <Panel className="p-5">
            <SectionHeader eyebrow="Progress" title="30-day plan" />
            <RoadmapProgressSummary />
          </Panel>
          <Panel className="p-5">
            <h3 className="relative font-semibold">Smart Milestones</h3>
            <RoadmapMilestones />
          </Panel>
        </div>
        <RoadmapTimeline />
      </div>
    </AppShell>
  );
}
