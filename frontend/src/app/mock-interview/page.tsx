import { AppShell } from "@/components/app-shell";
import { LiveInterviewStudio } from "@/components/live-interview-studio";
import { PageHeading } from "@/components/page-heading";

export default function MockInterviewPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Live Interview Practice"
        title="Real-time mock interviews with voice, face, and performance analysis."
        description="Enable your camera and microphone, hear live questions, answer on video, and get scored feedback on communication, confidence, technical depth, and presence."
      />
      <LiveInterviewStudio />
    </AppShell>
  );
}
