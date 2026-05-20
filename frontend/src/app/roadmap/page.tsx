import { CalendarDays, Clock, Sparkles, Zap } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { ProgressRing } from "@/components/progress-ring";
import { RoadmapTimeline } from "@/components/product-widgets";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";

export default function RoadmapPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Learning Roadmap"
        title="A compressed 30-day path to job readiness."
        description="Expandable tasks include topic, difficulty, estimated learning time, curated resources, GitHub references, documentation, and mini challenges."
      >
        <Button variant="premium">
          <Sparkles className="h-4 w-4" />
          Compress Roadmap
        </Button>
      </PageHeading>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="space-y-5">
          <Panel className="p-5">
            <SectionHeader eyebrow="Progress" title="30-day plan" />
            <div className="relative mt-5 flex justify-center">
              <ProgressRing value={27} label="Completed" size={150} />
            </div>
          </Panel>
          <Panel className="p-5">
            <h3 className="relative font-semibold">Smart Milestones</h3>
            <div className="relative mt-4 grid gap-3 text-sm">
              <div className="flex items-center gap-3 rounded-md bg-white/5 px-3 py-3">
                <Zap className="h-4 w-4 text-cyan-300" />
                RAG project shipped by Day 10
              </div>
              <div className="flex items-center gap-3 rounded-md bg-white/5 px-3 py-3">
                <Clock className="h-4 w-4 text-violet-300" />
                51 learning hours planned
              </div>
              <div className="flex items-center gap-3 rounded-md bg-white/5 px-3 py-3">
                <CalendarDays className="h-4 w-4 text-emerald-300" />
                Mock interview every Friday
              </div>
            </div>
          </Panel>
        </div>
        <RoadmapTimeline />
      </div>
    </AppShell>
  );
}
