import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { MockInterviewPanel } from "@/components/product-widgets";

export default function MockInterviewPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Mock Interview"
        title="Practice questions generated from your weakest skills."
        description="Switch between voice, coding, behavioral, and system design modes with instant AI feedback on communication, confidence, and technical depth."
      />
      <MockInterviewPanel />
    </AppShell>
  );
}
