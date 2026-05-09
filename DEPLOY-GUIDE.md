# 🌙 Elaf-ul-Quran Academy — Free-Forever Deployment Guide

**One guide. Zero monthly cost. Real backend. Real security.**

This is the ONLY guide you need. Follow it top to bottom and your site will be:
- Live on the internet at a real URL
- Connected to a real database (data shared across phone + laptop, in real-time)
- Using encrypted passwords and secure authentication
- Costing you **$0/month forever** (within the free tiers, which are very generous)

Total time: ~45 minutes.

---

## What you'll use (all free)

| Service | What it does | Free tier |
|---|---|---|
| **GitHub** | Stores your code | Unlimited private repos |
| **Vercel** | Hosts the website (frontend) | 100 GB bandwidth/month |
| **Supabase** | Database, login, file storage (backend) | 500 MB DB, 50,000 users, 1 GB files |

You will not enter a credit card anywhere.

---

## PART A — Get the code into GitHub (10 min)

1. Sign up at <https://github.com> (free).
2. Click **New repository** → name it `elaf-academy` → keep **Private** → **Create**.
3. Install Node.js LTS from <https://nodejs.org>.
4. Open Terminal (Mac) or PowerShell (Windows) in the project folder and run:
   ```bash
   git init
   git add .
   git commit -m "Initial version"
   git branch -M main
   git remote add origin https://github.com/<your-username>/elaf-academy.git
   git push -u origin main
   ```
5. Refresh GitHub — your code is there. ✅

---

## PART B — Deploy frontend to Vercel (5 min)

1. Go to <https://vercel.com> → **Sign up with GitHub**.
2. **Add New → Project** → import `elaf-academy`.
3. Framework auto-detects **Vite**. Click **Deploy**.
4. ~30 seconds later you get a live URL like `elaf-academy.vercel.app`.

Every time you push to GitHub, Vercel redeploys automatically. ✅

---

## PART C — Set up Supabase (the real backend) (15 min)

### C-1. Create the project
1. Sign up at <https://supabase.com> with GitHub.
2. **New Project** → name `elaf-academy` → strong DB password (save it!) → region nearest to your students (e.g., **Singapore** for Pakistan/India) → **Create**.
3. Wait ~2 min while it provisions.

### C-2. Create the tables
In Supabase dashboard → **SQL Editor** → **New query** → paste & **Run**:

```sql
-- ROLES (separate table = security best practice)
create type app_role as enum ('admin','teacher','student');

create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

-- PROFILES (everything about a student except auth)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  phone text,
  bio text,
  avatar_url text,
  joined_date date default current_date
);

-- COURSES
create table courses (
  id text primary key,
  title text not null,
  description text,
  subject text,
  level text,
  thumbnail text,
  duration text,
  price numeric default 0,
  is_free boolean default true,
  units jsonb default '[]',
  created_at timestamptz default now()
);

-- ENROLLMENTS (links students to courses)
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users(id) on delete cascade not null,
  course_id text references courses(id) on delete cascade not null,
  progress int default 0,
  enrolled_at timestamptz default now(),
  unique (student_id, course_id)
);

-- ASSIGNMENTS
create table assignments (
  id text primary key,
  course_id text references courses(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  created_at timestamptz default now()
);

-- SUBMISSIONS
create table submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id text references assignments(id) on delete cascade,
  student_id uuid references auth.users(id) on delete cascade,
  text text,
  grade int,
  feedback text,
  submitted_at timestamptz default now()
);

-- LIVE CLASS (single row)
create table live_class (
  id int primary key default 1,
  title text,
  link text,
  start_time timestamptz,
  is_live boolean default false,
  course_id text
);
insert into live_class (id) values (1);

-- ENABLE ROW-LEVEL SECURITY ON EVERYTHING
alter table user_roles  enable row level security;
alter table profiles    enable row level security;
alter table courses     enable row level security;
alter table enrollments enable row level security;
alter table assignments enable row level security;
alter table submissions enable row level security;
alter table live_class  enable row level security;

-- SAFE ROLE-CHECKER (avoids RLS recursion bugs)
create or replace function has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from user_roles where user_id=_user_id and role=_role) $$;

-- POLICIES
-- Anyone (even logged-out) can read courses + live_class
create policy "public read courses"    on courses     for select using (true);
create policy "public read live_class" on live_class  for select using (true);
create policy "public read assignments" on assignments for select using (true);

-- Students see their own profile; teacher sees all
create policy "self read profile"   on profiles for select using (auth.uid()=id or has_role(auth.uid(),'teacher'));
create policy "self update profile" on profiles for update using (auth.uid()=id);
create policy "self insert profile" on profiles for insert with check (auth.uid()=id);

-- Enrollments: student sees own; teacher sees all & can assign
create policy "self read enroll"     on enrollments for select using (auth.uid()=student_id or has_role(auth.uid(),'teacher'));
create policy "teacher manage enroll" on enrollments for all    using (has_role(auth.uid(),'teacher')) with check (has_role(auth.uid(),'teacher'));
create policy "student self enroll"  on enrollments for insert  with check (auth.uid()=student_id);

-- Submissions: student manages own; teacher reads & grades all
create policy "self manage submission" on submissions for all using (auth.uid()=student_id) with check (auth.uid()=student_id);
create policy "teacher read submission" on submissions for select using (has_role(auth.uid(),'teacher'));
create policy "teacher grade submission" on submissions for update using (has_role(auth.uid(),'teacher'));

-- Only teacher can write courses / live class / assignments
create policy "teacher write courses"     on courses     for all using (has_role(auth.uid(),'teacher')) with check (has_role(auth.uid(),'teacher'));
create policy "teacher write live"        on live_class  for all using (has_role(auth.uid(),'teacher')) with check (has_role(auth.uid(),'teacher'));
create policy "teacher write assignments" on assignments for all using (has_role(auth.uid(),'teacher')) with check (has_role(auth.uid(),'teacher'));

-- Roles: only teacher manages
create policy "self read roles"     on user_roles for select using (auth.uid()=user_id or has_role(auth.uid(),'teacher'));
create policy "teacher manage roles" on user_roles for all    using (has_role(auth.uid(),'teacher')) with check (has_role(auth.uid(),'teacher'));

-- AUTO-CREATE PROFILE ON SIGNUP
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)));
  insert into user_roles (user_id, role) values (new.id, 'student');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function handle_new_user();
```

### C-3. Create the teacher account
1. Supabase dashboard → **Authentication → Users → Add user → Create new user**.
2. Email: `afshan@elaf.com`, Password: pick a strong one, **Auto-confirm: ON**.
3. Copy the new user's **UID** (long uuid).
4. SQL Editor → **New query** → run:
   ```sql
   insert into user_roles (user_id, role) values ('PASTE-UID-HERE', 'teacher');
   ```

### C-4. Get your API keys
- Project Settings → **API**
- Copy **Project URL** and **anon public key**

### C-5. Add keys to Vercel
- Vercel → your project → **Settings → Environment Variables**
- Add two:
  - `VITE_SUPABASE_URL` = your project URL
  - `VITE_SUPABASE_ANON_KEY` = the anon key
- Click **Redeploy** on the latest deployment.

### C-6. Tell me you're done
Come back to Lovable chat and say **"Supabase is ready, refactor the store to use it"** — I'll swap `localStorage` for live Supabase calls so all devices stay in sync.

---

## PART D — Custom domain (optional, ~$10/year)

1. Buy a domain at <https://cloudflare.com/products/registrar> (cheapest, no markup).
2. Vercel → Project → **Settings → Domains → Add** → paste your domain.
3. Vercel shows DNS records → paste them at Cloudflare → wait 5–60 min → done.

---

## What's already secure (no action needed)
- ✅ Passwords are bcrypt-hashed by Supabase, never stored in plain text
- ✅ JWT tokens for sessions (signed, can't be forged)
- ✅ HTTPS everywhere (Vercel default)
- ✅ Row-Level Security policies above guarantee students can't read each other's grades
- ✅ Teacher role lives in a separate table — students cannot promote themselves
- ✅ YouTube videos use `youtube-nocookie.com` with no-share embed flags
- ✅ Right-click + DevTools detection on the video player (already in CoursePlayer)

## What students/teacher can do once Supabase is wired

| Action | Who | Where |
|---|---|---|
| Create / edit / delete courses & lessons | Teacher | Admin Dashboard |
| Assign a course to any student | Teacher | Admin → Students → Assign |
| Grade homework | Teacher | Admin → Grades |
| Go live | Teacher | Admin → Go Live |
| Enroll in free courses | Student | Course page → Enroll |
| Buy paid course (WhatsApp manual) | Student | Course page → Buy → opens WhatsApp |
| Edit name, phone, bio, avatar | Student | Navbar → Profile |
| Watch lessons (YouTube link hidden) | Student | Dashboard → Course → Lesson |
| Submit homework | Student | Dashboard → Assignments |

---

## Daily teacher workflow (after deployment)

1. Open `your-site.vercel.app/login`
2. Sign in with `afshan@elaf.com` + password
3. Add a lesson → it appears live on every student's dashboard within seconds
4. Assign a course to a new student → they see it next time they refresh

---

## Troubleshooting

| Problem | Fix |
|---|---|
| 404 on page refresh | Already fixed — Vercel handles SPA routing automatically |
| WhatsApp button doesn't open | Allow popups for your site, or use the floating button (uses anchor click) |
| Student doesn't see assigned course | Email must match exactly (case-insensitive). Refresh the page. After Supabase migration this is instant. |
| Forgot teacher password | Supabase → Authentication → Users → click `afshan@elaf.com` → **Send password recovery** |
| Site is slow on first load | Compress images at <https://squoosh.app> before uploading |

---

## Future ideas worth considering

- 🌍 Arabic language toggle
- 🌙 Dark mode for night study
- 📜 PDF certificate auto-generated on course completion
- 🔔 WhatsApp class reminder bot (Twilio + Supabase Edge Function, ~$0.005 per message)
- 📊 Parent portal — parents see kid's progress with a separate read-only login
- 🕌 Daily Hadith / Ayah of the day on dashboard
- 📝 Quiz auto-grading (saves your mom hours)

JazakAllahu Khairan. May Allah make this benefit every student. 🤲
