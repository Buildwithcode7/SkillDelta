import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { ResumeAnalyzerPanel } from "@/components/product-widgets";

export default function ResumeAnalyzerPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Resume Analyzer"
        title="Turn your resume into role-specific proof."
        description="Upload a resume PDF and receive ATS compatibility, missing keywords, role alignment, and AI-improved bullets."
      />
      <ResumeAnalyzerPanel />
    </AppShell>
  );
}
