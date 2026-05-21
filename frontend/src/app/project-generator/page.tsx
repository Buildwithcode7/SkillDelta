import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { GenerateProjectsButton, ProjectGeneratorPanel } from "@/components/product-widgets";

export default function ProjectGeneratorPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Project Generator"
        title="Generate projects that close skill gaps and improve resume signal."
        description="Each project includes description, tech stack, GitHub structure, deployment guide, APIs to use, and resume impact score."
      >
        <GenerateProjectsButton />
      </PageHeading>
      <ProjectGeneratorPanel />
    </AppShell>
  );
}
