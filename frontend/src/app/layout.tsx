import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CommandMenu } from "@/components/command-menu";

export const metadata: Metadata = {
  title: "SkillDelta | AI Career Intelligence",
  description: "AI-powered skill gap analysis, personalized learning paths, and career intelligence for modern developers."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <CommandMenu />
        </Providers>
      </body>
    </html>
  );
}
