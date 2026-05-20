"use client";

import { ThemeProvider } from "next-themes";
import { SpotlightRuntime } from "@/components/spotlight";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
      <SpotlightRuntime />
    </ThemeProvider>
  );
}
