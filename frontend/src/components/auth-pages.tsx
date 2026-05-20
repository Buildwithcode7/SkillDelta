"use client";

import Link from "next/link";
import { Github, LockKeyhole, Mail, Sparkles, UserPlus } from "lucide-react";
import { BrandMark } from "@/components/app-shell";
import { OnboardingFlow } from "@/components/product-widgets";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";

export function AuthPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  const signUp = mode === "sign-up";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 grid-surface opacity-70" />
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <BrandMark />
        </div>
        <Panel className="p-6">
          <div className="relative">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-white">
              {signUp ? <UserPlus className="h-6 w-6" /> : <LockKeyhole className="h-6 w-6" />}
            </div>
            <h1 className="text-2xl font-semibold">{signUp ? "Create your SkillDelta account" : "Welcome back"}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {signUp
                ? "Start with a free AI readiness scan and personalized roadmap."
                : "Continue your roadmap, mock interviews, and Career Twin guidance."}
            </p>
            <div className="mt-6 grid gap-3">
              <Button variant="outline">
                <Github className="h-4 w-4" />
                Continue with GitHub
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4" />
                Continue with Google
              </Button>
            </div>
            <div className="my-6 h-px bg-white/10" />
            <div className="grid gap-3">
              {signUp ? (
                <input className="h-11 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-blue-400" placeholder="Full name" />
              ) : null}
              <input className="h-11 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-blue-400" placeholder="Email address" />
              <input className="h-11 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-blue-400" placeholder="Password" type="password" />
            </div>
            <Button className="mt-5 w-full" variant="premium">
              {signUp ? "Create account" : "Sign in"}
            </Button>
            <p className="mt-5 text-center text-sm text-muted-foreground">
              {signUp ? "Already have an account?" : "New to SkillDelta?"}{" "}
              <Link href={signUp ? "/sign-in" : "/sign-up"} className="text-cyan-200 hover:text-cyan-100">
                {signUp ? "Sign in" : "Create account"}
              </Link>
            </p>
          </div>
        </Panel>
      </div>
    </main>
  );
}

export function OnboardingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 grid-surface opacity-70" />
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <BrandMark />
          <Button asChild variant="outline">
            <Link href="/dashboard">Skip</Link>
          </Button>
        </div>
        <div className="mx-auto mt-16 max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-violet-500 text-white">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-4xl font-semibold tracking-normal md:text-5xl">Build your first career intelligence graph.</h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Connect profile evidence, upload your resume, choose a dream role, and launch a personalized roadmap.
          </p>
        </div>
        <div className="mt-12">
          <OnboardingFlow />
        </div>
        <Panel className="mx-auto mt-10 max-w-3xl p-5">
          <SectionHeader
            title="Ready to run your first AI analysis?"
            description="This demo uses sample intelligence until you connect the FastAPI backend and production parsers."
            action={
              <Button asChild variant="premium">
                <Link href="/analysis">Launch Analysis</Link>
              </Button>
            }
          />
        </Panel>
      </div>
    </main>
  );
}
