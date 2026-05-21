import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { ParticipationCertificatePanel } from "@/components/participation-certificate";
import { Panel, SectionHeader } from "@/components/ui/panel";

export default function CertificatePage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Certificate"
        title="Participation & performance certificate"
        description="Generate an official SkillDelta certificate backed by your readiness scores, roadmap progress, mock interviews, and profile evidence."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3 print:hidden">
        <Panel className="p-4">
          <SectionHeader eyebrow="Step 1" title="Sync profile" />
          <p className="mt-2 text-sm text-muted-foreground">Run live sync from Dashboard with resume and GitHub data.</p>
        </Panel>
        <Panel className="p-4">
          <SectionHeader eyebrow="Step 2" title="Build activity" />
          <p className="mt-2 text-sm text-muted-foreground">Complete roadmap tasks and mock interviews to strengthen your certificate.</p>
        </Panel>
        <Panel className="p-4">
          <SectionHeader eyebrow="Step 3" title="Generate & print" />
          <p className="mt-2 text-sm text-muted-foreground">Use Print / Save PDF to download a shareable certificate file.</p>
        </Panel>
      </div>

      <ParticipationCertificatePanel />
    </AppShell>
  );
}
