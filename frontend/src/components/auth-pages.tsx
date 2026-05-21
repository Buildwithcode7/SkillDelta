"use client";

import Link from "next/link";
import { SignIn, SignUp } from "@clerk/nextjs";
import { LockKeyhole, Sparkles, UserPlus } from "lucide-react";
import { BrandMark } from "@/components/app-shell";
import { OnboardingFlow } from "@/components/product-widgets";
import { Button } from "@/components/ui/button";
import { Panel, SectionHeader } from "@/components/ui/panel";
import { clerkAppearance } from "@/lib/clerk-appearance";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

function AuthSetupNotice() {
  return (
    <Panel className="border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-100">
      <p className="font-medium">Authentication is not configured yet</p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 leading-6 text-amber-100/90">
        <li>
          Create a free app at{" "}
          <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer" className="text-cyan-200 underline">
            dashboard.clerk.com
          </a>
        </li>
        <li>Copy API keys (Publishable + Secret) from Clerk → API Keys</li>
        <li>
          Create <code className="rounded bg-black/30 px-1">frontend/.env.local</code> (copy from{" "}
          <code className="rounded bg-black/30 px-1">frontend/.env.local.example</code>) and paste your keys
        </li>
        <li>Enable Google: Clerk → Configure → Social connections → Google ON</li>
        <li>
          Restart: <code className="rounded bg-black/30 px-1">npm run dev</code>
        </li>
      </ol>
      <p className="mt-3 text-xs text-amber-100/70">
        Full guide: <code className="rounded bg-black/30 px-1">docs/GOOGLE_LOGIN_SETUP.md</code>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <a href="https://dashboard.clerk.com" target="_blank" rel="noreferrer">
            Open Clerk Dashboard
          </a>
        </Button>
        <Button asChild variant="premium">
          <a href="https://dashboard.clerk.com/sign-up" target="_blank" rel="noreferrer">
            Create free account
          </a>
        </Button>
      </div>
    </Panel>
  );
}

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
                ? "Sign up with Google or email — same flow as modern SaaS apps."
                : "Sign in with Google or email to continue your career intelligence workspace."}
            </p>

            <div className="mt-6">
              {clerkEnabled ? (
                signUp ? (
                  <SignUp
                    appearance={clerkAppearance}
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    forceRedirectUrl="/onboarding"
                    fallbackRedirectUrl="/onboarding"
                  />
                ) : (
                  <SignIn
                    appearance={clerkAppearance}
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    forceRedirectUrl="/dashboard"
                    fallbackRedirectUrl="/dashboard"
                  />
                )
              ) : (
                <AuthSetupNotice />
              )}
            </div>

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
            description="The app now sends your profile signals to the FastAPI backend for live analysis."
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
