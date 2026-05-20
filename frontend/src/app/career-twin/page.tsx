import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { CareerTwinPanel, DailyQuestCard, MentorChatPreview } from "@/components/product-widgets";

export default function CareerTwinPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Career Twin AI"
        title="An adaptive AI version of your career trajectory."
        description="Your twin tracks progress, predicts weak areas, adapts the roadmap, detects tutorial addiction, and gives daily guidance."
      />
      <CareerTwinPanel />
      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <DailyQuestCard />
        <MentorChatPreview />
      </div>
    </AppShell>
  );
}
