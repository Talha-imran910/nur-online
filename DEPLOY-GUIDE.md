# 🌙 Elaf-ul-Quran Academy — Deployment & Supabase Guide

**One guide. Free forever. No tests, no grades, no fluff.**

You will end up with:
- The website live at `your-site.vercel.app` (free)
- A real backend (Supabase) holding accounts, profiles, courses, enrollments
- Code on GitHub, auto-redeploying on every push
- Total cost: **$0 / month**

Total time: ~30 minutes.

---

## Stack

| Service | Purpose | Free tier |
|---|---|---|
| **GitHub** | Stores the code | Unlimited private repos |
| **Vercel** | Hosts the frontend | 100 GB bandwidth/mo |
| **Supabase** | Database + Auth | 500 MB DB, 50 000 users |

Your Supabase project (already created):
- **URL:** `https://ygacoyszusqoyasifyjh.supabase.co`
- **Publishable key:** `sb_publishable_v0mPP0ft_N7Vj24GvfzOuA_DRgElroq`

---

## PART A — Push the code to GitHub (10 min)

1. Sign up at <https://github.com>.
2. **New repository** → name `elaf-academy` → Private → **Create**.
3. Install [Node.js LTS](https://nodejs.org).
4. In a terminal, in the project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial version"
   git branch -M main
   git remote add origin https://github.com/<your-username>/elaf-academy.git
   git push -u origin main
   ```

---

## PART B — Set up Supabase (the part that was failing) (10 min)

### B-1. Run the SQL
1. Go to <https://supabase.com/dashboard/project/ygacoyszusqoyasifyjh/sql/new>.
2. Open the file **`supabase/schema.sql`** in this repo.
3. Copy **all** of it, paste into the SQL editor, click **Run**.

The SQL is **idempotent** — safe to run again if it fails halfway. It creates:
roles enum, `profiles`, `courses`, `enrollments`, `assignments`, `submissions`,
`live_class`, all RLS policies, the `has_role()` helper, and the auto-profile
trigger on signup.

> If you saw errors before like `type "app_role" already exists` or
> `policy already exists` — that's why this version uses `if not exists` /
> `drop policy if exists`. It will now run cleanly.

### B-2. Create the teacher account
1. Supabase → **Authentication → Users → Add user → Create new user**.
2. Email: `afshan@elaf.com`, set a strong password, **Auto Confirm User: ON**.
3. Copy the new **User UID** (shown right after creation).
4. SQL Editor → New query → run:
   ```sql
   insert into public.user_roles (user_id, role)
   values ('PASTE-TEACHER-UID-HERE', 'teacher');
   ```

### B-3. (Optional) Disable email confirmation for students
Authentication → **Providers → Email** → turn **Confirm email** OFF if you want
students to log in instantly without checking their inbox.

---

## PART C — Deploy the frontend to Vercel (5 min)

1. <https://vercel.com> → **Sign up with GitHub**.
2. **Add New → Project** → import `elaf-academy`.
3. Framework: **Vite** (auto-detected). Click **Deploy**.
4. Wait ~30 s — you get a live URL like `elaf-academy.vercel.app`.

> The Supabase URL and key are already hard-coded in
> `src/integrations/supabase/client.ts` (publishable keys are safe in client
> code — Row Level Security protects the data). No env vars needed.

Every `git push` to `main` redeploys automatically. ✅

---

## PART D — Connect a custom domain (optional, free)

1. Vercel → your project → **Settings → Domains** → add `elaf-ul-quran.com`.
2. Vercel shows you the DNS records to set at your registrar.
3. Done — HTTPS is auto.

---

## What's in the code right now

| Page | Status | Backend |
|---|---|---|
| `/` Home, `/courses`, `/about` | Live | Local mock data |
| `/login`, `/register` | Live | **Supabase Auth** (real accounts) |
| `/dashboard` Student | Live | Local store (mirrors signup) |
| `/admin` Teacher | Live | Local store |
| `/profile` | Live | Local store |

**Auth is on Supabase already.** The course / enrollment data still uses
local storage — when you're ready to go fully cloud, ask: *"migrate the store
to Supabase"*. The DB schema for it is already in place.

---

## Removed / Cleaned up

- ❌ All grade UI and grading logic (no more grades shown anywhere)
- ❌ All test files (`vitest`, `@testing-library`, `@playwright/test`, `src/test/`, `playwright.config.ts`)
- ❌ Old GitHub Pages workflow (`.github/workflows/deploy.yml`) — Vercel handles deploys now

---

## WhatsApp button "ERR_BLOCKED_BY_RESPONSE" fix

`api.whatsapp.com` sends `X-Frame-Options: DENY`, so it can't load inside the
Lovable preview iframe. Fixed in `WhatsAppButton.tsx` and `CourseDetail.tsx`
by using `window.open(url, "_blank", "noopener,noreferrer")` with a fallback
to `window.top.location` — this breaks out of the iframe and opens WhatsApp
in a real new tab. Works in preview **and** production.

---

## Quick checklist

- [ ] Pushed code to GitHub
- [ ] Ran `supabase/schema.sql` in Supabase SQL editor (no errors)
- [ ] Created `afshan@elaf.com` teacher account & inserted into `user_roles`
- [ ] Imported repo to Vercel and deployed
- [ ] Visited the live URL → registered a test student → logged in ✅
- [ ] Logged in as teacher → reached `/admin` ✅

You're live. 🌙
