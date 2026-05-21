// "use client";

// import { ClerkProvider } from "@clerk/nextjs";

// const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// export function ClerkRoot({ children }: { children: React.ReactNode }) {
//   if (!publishableKey) {
//     return children;
//   }

//   return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
// }
"use client";
import { ClerkProvider } from "@clerk/nextjs";

export function ClerkRoot({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}