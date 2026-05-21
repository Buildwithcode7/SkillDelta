"use client";

import { ThemeProvider } from "next-themes";
import { SpotlightRuntime } from "@/components/spotlight";
import { LiveCareerProvider } from "@/lib/live-career";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <LiveCareerProvider>{children}</LiveCareerProvider>
      <SpotlightRuntime />
    </ThemeProvider>
  );
}
