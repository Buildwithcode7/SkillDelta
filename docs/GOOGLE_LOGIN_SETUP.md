# Google login setup (5 minutes)

SkillDelta uses **Clerk** for sign-in. You must add free API keys — the app cannot invent them for you.

## Step 1 — Create a Clerk account

1. Open [https://dashboard.clerk.com/sign-up](https://dashboard.clerk.com/sign-up)
2. Sign up (free tier is enough for development)
3. Click **Create application**
4. Name it `SkillDelta` → Create

## Step 2 — Copy API keys

1. In Clerk Dashboard, open **API Keys** (left sidebar)
2. Copy:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` — click Show)

## Step 3 — Enable Google

1. Clerk Dashboard → **Configure** → **User & authentication**
2. Open **Social connections**
3. Turn **Google** **ON**
4. For local dev, Clerk’s shared Google credentials are enough (no Google Cloud setup required)

## Step 4 — Add keys to your project

**Option A (recommended):** create `frontend/.env.local`

```powershell
cd c:\Desktop\SKILLDELTA\frontend
copy .env.local.example .env.local
notepad .env.local
```

Paste your real keys (replace the `PASTE_YOUR_KEY_HERE` placeholders).

**Option B:** create `c:\Desktop\SKILLDELTA\.env` at the repo root with the same variables.

Example `frontend/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_abc123...
CLERK_SECRET_KEY=sk_test_xyz789...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding
```

## Clerk files in this project

- `frontend/src/proxy.ts` — `clerkMiddleware()` (latest Clerk pattern)
- `frontend/src/middleware.ts` — re-exports proxy for Next.js 15 compatibility
- `frontend/src/app/layout.tsx` — `<ClerkRoot>` (`ClerkProvider`) inside `<body>`
- Auth UI uses `<Show>`, `<SignInButton>`, `<SignUpButton>`, `<UserButton>` (not deprecated `SignedIn`/`SignedOut`)

## Step 5 — Restart the dev server

Stop the terminal (`Ctrl+C`), then:

```powershell
cd c:\Desktop\SKILLDELTA
npm run dev
```

Open [http://localhost:3000/sign-up](http://localhost:3000/sign-up) — you should see **Continue with Google**, not the yellow setup warning.

## Troubleshooting

| Problem | Fix |
|--------|-----|
| Still shows “Authentication is not configured” | Keys missing or wrong file. Use `frontend/.env.local` and restart `npm run dev`. |
| Key starts with wrong prefix | Publishable = `pk_`, Secret = `sk_` (do not swap them). |
| Google button missing | Enable Google in Clerk → Social connections. |
| Redirect error after Google | In Clerk → **Paths**, set Sign-in URL `/sign-in` and Sign-up URL `/sign-up`. |

## Production

Use `pk_live_` / `sk_live_` keys and configure your own Google OAuth client in Clerk for production domains.
