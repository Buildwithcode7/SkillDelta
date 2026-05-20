import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { ProjectGeneratorPanel } from "@/components/product-widgets";
import { Button } from "@/components/ui/button";

export default function ProjectGeneratorPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Project Generator"
        title="Generate projects that close skill gaps and improve resume signal."
        description="Each project includes description, tech stack, GitHub structure, deployment guide, APIs to use, and resume impact score."
      >
        <Button variant="premium">
          <Sparkles className="h-4 w-4" />
          Generate AI Project
        </Button>
      </PageHeading>
      <ProjectGeneratorPanel />
    </AppShell>
  );
}
