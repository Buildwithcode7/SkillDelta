import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { PricingCards } from "@/components/product-widgets";

export default function PricingPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Pricing"
        title="Premium AI career intelligence when the stakes are real."
        description="Upgrade for advanced AI mentor guidance, FAANG prep, unlimited roadmap generation, deep resume analysis, company-specific interviews, and advanced analytics."
      />
      <PricingCards />
    </AppShell>
  );
}
