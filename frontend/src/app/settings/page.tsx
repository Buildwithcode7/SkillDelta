import { AppShell } from "@/components/app-shell";
import { PageHeading } from "@/components/page-heading";
import { SettingsPanel } from "@/components/product-widgets";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="Settings"
        title="Control profile signals, AI behavior, notifications, and privacy."
        description="Tune SkillDelta around your career target and keep your intelligence layer under your control."
      />
      <SettingsPanel />
    </AppShell>
  );
}
