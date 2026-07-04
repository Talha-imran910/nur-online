# Elaf-ul-Quran Academy — Project Docs

Internal reference for the developer. Not deployed. Read this before
touching the codebase after time away.

## Stack

| Layer          | Tool                                | Why                                                                 |
| -------------- | ----------------------------------- | ------------------------------------------------------------------- |
| UI             | React 18 + Vite 5 + TypeScript      | Fast dev loop, small bundles, static-hostable                       |
| Styling        | Tailwind CSS v3 + shadcn/ui         | Design tokens in `src/index.css`, accessible primitives             |
| Routing        | react-router-dom v6                 | Client-side SPA routing                                             |
| Data fetching  | Supabase JS + `@tanstack/react-query` (installed, migration pending) | Realtime + REST client                    |
| Backend        | Supabase (Postgres + Auth + Realtime) | Managed DB, RLS security, auth already wired                      |
| Rich text      | Tiptap + DOMPurify                  | Blog editor + safe HTML rendering                                   |
| SEO            | react-helmet-async + Vercel Edge middleware | Per-route meta client-side, bot-preview server-side         |
| Hosting        | Vercel                              | Static frontend + Edge Functions for middleware & dynamic sitemap   |

## Environment variables

| Var                     | Purpose                                                    |
| ----------------------- | ---------------------------------------------------------- |
| `VITE_WHATSAPP_NUMBER`  | Digits only, no `+`. Used by all "Chat on WhatsApp" links. |
| `VITE_SITE_URL`         | Canonical origin, e.g. `https://www.elafulquran.com`.       |

The Supabase URL and publishable key are hardcoded in
`src/integrations/supabase/client.ts`. The publishable key is safe in
client code because RLS enforces access.

## Routes

| Path                | Access               | Notes                                    |
| ------------------- | -------------------- | ---------------------------------------- |
| `/`                 | Public               | Landing page                             |
| `/courses`          | Public               | Published course list                    |
| `/courses/:id`      | Public               | Course detail, JSON-LD `Course`          |
| `/player/:courseId` | Student (enrolled)   | Video player, watermark, quiz            |
| `/about`            | Public               | About page                               |
| `/blog`             | Public               | Published blog posts                     |
| `/blog/:slug`       | Public               | Article with FAQ/BreadcrumbList JSON-LD  |
| `/privacy-policy`   | Public               | Legal page                               |
| `/login`, `/register` | Guest only         | Supabase Auth email/password             |
| `/dashboard`        | Student              | Enrolled courses + progress              |
| `/admin`            | Teacher only         | Full admin panel                         |
| `/profile`          | Any signed-in user   | Name update                              |

Route guards live in `src/components/RouteGuard.tsx`.

## Supabase tables

All in `public` schema. RLS is on for every table.

| Table          | Purpose                                              | RLS summary                                                                                     |
| -------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `profiles`     | One row per auth user (name, email)                  | User reads/updates own row; teacher reads all                                                    |
| `user_roles`   | Role assignment (`teacher` / `student`)              | User reads own roles; only service role writes                                                    |
| `subjects`     | Course categories (Nazra, Tajweed, etc.)             | Public read                                                                                      |
| `courses`      | Course metadata + `is_published`                     | Public read only when `is_published = true`; teacher reads/writes all                            |
| `units`        | Groups of lessons inside a course                    | Public read only for units of published courses; teacher writes                                  |
| `lessons`      | Individual video lessons                             | Public read only for lessons of published courses; teacher writes                                |
| `enrollments`  | Which student is in which course + progress          | Student reads own; teacher reads all; student inserts own; teacher inserts/deletes any           |
| `live_class`   | Currently-live class link (single row while active)  | Public read; only teacher writes                                                                 |
| `assignments`  | Optional per-course/lesson assignments               | Public read for published courses; teacher writes                                                |
| `blog_posts`   | Teacher's blog articles + optional event Q&A JSON    | Public read for `is_published = true`; teacher writes all                                        |
| `students`     | View / helper table for teacher's Students tab       | Teacher reads all                                                                                |

The `has_role(user_id, role)` security-definer function backs every
teacher-only policy — never query `user_roles` directly inside a policy
(recursion).

## Admin (teacher) panel

`/admin` — tabs, in order:

1. **Overview** — headline stats + recent student list.
2. **Courses** — cards with Edit, Edit Price, Manage Lessons, Delete.
3. **Add Content** — modals to create a course, add a lesson to any
   course, or attach a PDF.
4. **Blog** — full CRUD for blog posts (Tiptap editor, cover image,
   event Q&A pairs, publish toggle).
5. **Go Live** — starts/ends a live class row; students see a top
   banner + auto-play link.
6. **Students** — table of all students with per-course
   enroll/unenroll and progress bars.
7. **Settings** — instructor name / academy / bio (UI only for now).
8. **Help** — click-through guide for common tasks.

## SEO plumbing

1. `index.html` ships baseline `<title>`, meta description, and one
   sitewide `Organization` JSON-LD block.
2. Every page component adds per-route `<Helmet>` for
   title/description/canonical/og:* — client-side, works for JS
   crawlers (Google/Bing).
3. `middleware.ts` (Vercel Edge, matches `/courses/:path*` and
   `/blog/:path*`) sniffs UA for known preview bots
   (WhatsApp/Facebook/Twitter/LinkedIn/Slack/etc.). Bots get a tiny
   static HTML doc with route-specific meta + `<meta refresh>` to the
   real page. Humans are passed through untouched — zero perf cost.
4. `api/sitemap.xml.ts` — Vercel Edge function serving
   `/api/sitemap.xml`. Pulls published courses and blog posts from
   Supabase REST, plus static entries (home, courses, about, register,
   privacy). Cached 1h at the edge.
5. `public/sitemap.xml` is the static fallback for crawlers hitting
   the well-known path; `api/sitemap.xml.ts` is the always-fresh copy.
6. `public/robots.txt` allows everything except admin/dashboard/profile/
   login/player routes.

## Security headers

`vercel.json` sets `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, and a locked-down `Permissions-Policy` on all
routes. No CSP yet — needs per-directive testing against the YouTube
iframe and Tiptap before shipping.

## Content protection

`CoursePlayer.tsx` blocks right-click, `Ctrl+S/P/U`, PrintScreen (best
effort), and pauses playback when the tab loses focus. A translucent
watermark with the student's email is overlaid on the video. The
overlay uses `pointer-events: none` so native mobile controls stay
tappable. This is deterrent, not DRM.
