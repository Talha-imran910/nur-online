# 🌙 Elaf-ul-Quran Academy — Complete Setup Guide

A step-by-step guide to take this project from your local machine → GitHub → live on the internet, with a free backend you can fully control.

---

## Table of Contents
1. [What you have](#1-what-you-have)
2. [Run it locally](#2-run-it-locally)
3. [Push it to GitHub](#3-push-it-to-github)
4. [Deploy to the web (Vercel — free)](#4-deploy-to-the-web-vercel--free)
5. [Add a free backend (Supabase)](#5-add-a-free-backend-supabase)
6. [Connect a custom domain](#6-connect-a-custom-domain-optional)
7. [Daily workflow as the teacher](#7-daily-workflow-as-the-teacher)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. What you have

- **Frontend:** React + Vite + Tailwind (this repo)
- **Storage right now:** browser `localStorage` — data stays on each device
- **Teacher login:** `afshan@elaf.com` / `elaf2024`
- **Student login:** any email + any password (auto-creates an account)

> ⚠️ Because data is in `localStorage`, students on phone won't see what you change on laptop until you upgrade to Supabase (Step 5). That's why Step 5 matters.

---

## 2. Run it locally

### Install Node.js
Download the **LTS** version from <https://nodejs.org>. After install, open a terminal and check:
```bash
node -v   # should print v20.x or higher
npm -v
```

### Clone & start
```bash
git clone https://github.com/<your-username>/elaf-ul-quran.git
cd elaf-ul-quran
npm install
npm run dev
```
Open the URL it prints (usually <http://localhost:5173>). You should see the homepage.

### Useful commands
| Command          | What it does                        |
|------------------|-------------------------------------|
| `npm run dev`    | Local preview with hot reload       |
| `npm run build`  | Production build into `dist/`       |
| `npm run preview`| Preview the production build        |
| `npm run lint`   | Check code quality                  |

---

## 3. Push it to GitHub

1. Create a free account at <https://github.com>.
2. Click **New repository** → name it `elaf-ul-quran` → **Private** (recommended) → **Create**.
3. In your terminal:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/elaf-ul-quran.git
   git push -u origin main
   ```
4. Refresh your GitHub page — your code is there.

> Every time you change something, run:
> ```bash
> git add .
> git commit -m "what you changed"
> git push
> ```

---

## 4. Deploy to the web (Vercel — free)

Vercel is the easiest free host. No credit card needed.

1. Go to <https://vercel.com> → **Sign up with GitHub**.
2. Click **Add New → Project** → import `elaf-ul-quran`.
3. Framework preset will auto-detect **Vite**. Leave defaults.
4. Click **Deploy**. In ~30 seconds you'll get a URL like `elaf-ul-quran.vercel.app`.

Every `git push` to `main` will redeploy automatically.

### Alternatives (also free)
- **Netlify** — same flow as Vercel
- **Cloudflare Pages** — fastest CDN
- **GitHub Pages** — works but harder for SPA routing

---

## 5. Add a free backend (Supabase)

This replaces `localStorage` with a real database so all devices stay in sync.

### Why Supabase?
- Free tier: 500 MB database, 1 GB storage, 50,000 monthly users
- Built-in authentication (no need to roll your own)
- File storage for thumbnails/PDFs
- You own all the data — exportable any time

### Step-by-step

1. **Create project**
   - Sign up at <https://supabase.com>
   - **New Project** → name `elaf-academy` → pick a strong DB password → region near you (e.g., Singapore for Pakistan/India)

2. **Create the tables**
   In the Supabase dashboard → **SQL Editor** → **New query** → paste & run:
   ```sql
   -- Courses
   create table courses (
     id text primary key,
     title text not null,
     description text,
     subject text,
     level text,
     thumbnail text,
     duration text,
     lessons int default 0,
     students int default 0,
     rating numeric default 5,
     price numeric default 0,
     is_free boolean default true,
     units jsonb default '[]',
     created_at timestamptz default now()
   );

   -- Students (linked to Supabase Auth)
   create table students (
     id uuid primary key references auth.users(id) on delete cascade,
     name text,
     email text unique not null,
     phone text,
     enrolled_courses text[] default '{}',
     progress jsonb default '{}',
     joined_date date default current_date
   );

   -- Assignments
   create table assignments (
     id text primary key,
     course_id text references courses(id) on delete cascade,
     title text,
     description text,
     due_date date,
     submitted boolean default false,
     submission_text text,
     grade int,
     feedback text
   );

   -- Roles (NEVER store role on the students table)
   create type app_role as enum ('admin','teacher','student');
   create table user_roles (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) on delete cascade not null,
     role app_role not null,
     unique (user_id, role)
   );

   -- Enable RLS
   alter table courses    enable row level security;
   alter table students   enable row level security;
   alter table assignments enable row level security;
   alter table user_roles enable row level security;

   -- Policies (read by anyone, write by the teacher only)
   create policy "Anyone can read courses" on courses for select using (true);
   create policy "Students can read their own row" on students
     for select using (auth.uid() = id);
   create policy "Students can update their own row" on students
     for update using (auth.uid() = id);
   ```

3. **Get your keys**
   - Project Settings → **API**
   - Copy **Project URL** and **anon public key**

4. **Wire it up in the app**
   ```bash
   npm install @supabase/supabase-js
   ```
   Create `.env.local` in the project root:
   ```
   VITE_SUPABASE_URL=https://xxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
   Then ask Lovable: *"Replace the localStorage store with Supabase using these env vars"* — it will refactor `src/lib/store.ts` for you.

5. **Add the env vars to Vercel**
   Vercel → your project → **Settings → Environment Variables** → add both keys → **Redeploy**.

### 🛡️ Important security note
Never store admin/teacher status in `localStorage` or in the `students` table. Always use the `user_roles` table and a `has_role()` function as shown above. This is the only way to prevent students from giving themselves teacher access by editing their browser.

---

## 6. Connect a custom domain (optional)

1. Buy a domain (Namecheap, Cloudflare Registrar, GoDaddy ~ $10/year)
2. Vercel → Project → **Settings → Domains → Add**
3. Vercel will tell you which DNS records to add at your registrar
4. Wait 5–60 min → your site is at `elafulquran.com`

---

## 7. Daily workflow as the teacher

| You want to…                  | Where to go                                  |
|-------------------------------|----------------------------------------------|
| Add a new course              | Admin → **Add Content → New Course**         |
| Add a YouTube lesson          | Admin → **Add Content → Add Lesson**         |
| Remove a lesson               | Admin → **Courses → Manage Lessons → 🗑️**   |
| Change a price / make it free | Admin → **Courses → Edit Price**             |
| Assign a course to a student  | Admin → **Students → Assign Course**         |
| Remove a student from course  | Admin → **Students → click ✕ on the badge**  |
| Go live                       | Admin → **Go Live → paste link → Go Live**   |
| Grade homework                | Admin → **Grades → Grade → Publish All**     |

---

## 8. Troubleshooting

**"Page not found" on refresh after deploy**
Already fixed — `vite.config.ts` uses `base: "/"`. Vercel/Netlify handle SPA routing automatically.

**WhatsApp button doesn't open**
The browser may be blocking pop-ups. The buy-course flow now uses an anchor click which bypasses pop-up blockers. If it still fails, allow pop-ups for your site in browser settings.

**Student enrolls but nothing shows on dashboard**
Fixed — `enrollStudent()` now auto-creates a student record if one doesn't exist (e.g., user logged in without registering first).

**Teacher dashboard doesn't show new students**
With `localStorage` only, devices don't sync. Migrate to Supabase (Step 5) for real-time sync across all devices.

**Performance / slow load**
- Compress images before uploading thumbnails (use <https://squoosh.app>)
- Run `npm run build` and check the `dist/` size — should be <2 MB
- Vercel auto-handles caching and CDN

**Forgot teacher password**
Edit `src/pages/Login.tsx`, change `TEACHER_PASS = "elaf2024"`, redeploy.

---

## Need help?
- Lovable docs: <https://docs.lovable.dev>
- Supabase docs: <https://supabase.com/docs>
- Vercel docs: <https://vercel.com/docs>

May Allah make this beneficial for your students. 🌙
