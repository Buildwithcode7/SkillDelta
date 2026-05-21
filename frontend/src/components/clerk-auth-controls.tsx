"use client";

import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

type ClerkAuthControlsProps = {
  variant?: "marketing" | "app";
};

export function ClerkAuthControls({ variant = "marketing" }: ClerkAuthControlsProps) {
  if (!clerkEnabled) {
    return (
      <>
        <Button asChild variant="outline" className={variant === "marketing" ? "hidden sm:inline-flex" : undefined} size={variant === "app" ? "sm" : "default"}>
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild variant="premium" size={variant === "app" ? "sm" : "default"}>
          <Link href={variant === "marketing" ? "/sign-up" : "/sign-up"}>Get Started</Link>
        </Button>
      </>
    );
  }

  if (variant === "app") {
    return (
      <>
        <Show when="signed-out">
          <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-9 w-9 border border-white/15"
              }
            }}
          />
        </Show>
      </>
    );
  }

  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="redirect" forceRedirectUrl="/dashboard">
          <Button variant="outline" className="hidden sm:inline-flex">
            Sign in
          </Button>
        </SignInButton>
        <SignUpButton mode="redirect" forceRedirectUrl="/onboarding">
          <Button variant="premium">Get Started</Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Button asChild variant="outline" className="hidden sm:inline-flex">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-9 w-9 border border-white/15"
            }
          }}
        />
      </Show>
    </>
  );
}
