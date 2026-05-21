"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Command, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { ClerkAuthControls } from "@/components/clerk-auth-controls";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useLiveCareer } from "@/lib/live-career";
import { navItems } from "@/lib/static-content";
import { cn } from "@/lib/utils";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-gradient-to-br from-blue-500 via-violet-500 to-cyan-400 text-sm font-bold text-white shadow-glow">
        SD
      </span>
      {!compact ? (
        <span>
          <span className="block text-sm font-semibold leading-4">SkillDelta</span>
          <span className="block text-xs text-muted-foreground">Career intelligence</span>
        </span>
      ) : null}
    </Link>
  );
}

export function MarketingNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/10 bg-background/55 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ClerkAuthControls variant="marketing" />
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dashboard, profile } = useLiveCareer();
  const firstNotification = dashboard?.notifications[0];
  const syncedAt = dashboard?.synced_at ? new Date(dashboard.synced_at) : null;

  const sidebar = (
    <aside className="flex h-full flex-col gap-6">
      <BrandMark />
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition",
                active
                  ? "bg-white/12 text-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          Pro trial
        </div>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Unlock FAANG mode, deep reports, and unlimited roadmap compression.
        </p>
        <Button asChild size="sm" variant="premium" className="mt-4 w-full">
          <Link href="/pricing">Upgrade</Link>
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10 grid-surface opacity-60" />
      <div className="hidden border-r border-white/10 bg-background/50 p-5 backdrop-blur-xl lg:fixed lg:inset-y-0 lg:left-0 lg:block lg:w-72">
        {sidebar}
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="h-full w-[min(320px,85vw)] border-r border-white/10 bg-background p-5" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex justify-end">
              <Button size="icon" variant="ghost" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            {sidebar}
          </div>
        </div>
      ) : null}
      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-background/55 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-sm font-medium">Dream role: {profile.dream_job_title || "Not selected"}</p>
                <p className="text-xs text-muted-foreground">
                  {syncedAt ? `Readiness engine synced ${syncedAt.toLocaleTimeString()}` : "Run a live sync to load career intelligence"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="hidden md:inline-flex">
                <Command className="h-4 w-4" />
                <span>Cmd</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs">K</span>
              </Button>
              <Button size="icon" variant="outline" title={firstNotification?.body ?? "No live notifications yet"} aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <ClerkAuthControls variant="app" />
            </div>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
