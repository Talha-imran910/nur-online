-- ======================================================================
--  Elaf-ul-Quran Academy — Supabase schema (idempotent, safe to re-run)
--  Paste this WHOLE file into Supabase → SQL Editor → New query → Run.
-- ======================================================================

-- 1. ROLE ENUM ---------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('admin','teacher','student');
exception when duplicate_object then null; end $$;

-- 2. TABLES ------------------------------------------------------------
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  phone text,
  bio text,
  avatar_url text,
  joined_date date default current_date
);

create table if not exists public.courses (
  id text primary key,
  title text not null,
  description text,
  subject text,
  level text,
  thumbnail text,
  duration text,
  price numeric default 0,
  is_free boolean default true,
  units jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references auth.users(id) on delete cascade not null,
  course_id text references public.courses(id) on delete cascade not null,
  progress int default 0,
  enrolled_at timestamptz default now(),
  unique (student_id, course_id)
);

create table if not exists public.assignments (
  id text primary key,
  course_id text references public.courses(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  created_at timestamptz default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id text references public.assignments(id) on delete cascade,
  student_id uuid references auth.users(id) on delete cascade,
  text text,
  submitted_at timestamptz default now()
);

create table if not exists public.live_class (
  id int primary key default 1,
  title text,
  link text,
  start_time timestamptz,
  is_live boolean default false,
  course_id text
);
insert into public.live_class (id) values (1) on conflict (id) do nothing;

-- 3. ENABLE RLS --------------------------------------------------------
alter table public.user_roles  enable row level security;
alter table public.profiles    enable row level security;
alter table public.courses     enable row level security;
alter table public.enrollments enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;
alter table public.live_class  enable row level security;

-- 4. ROLE-CHECK FUNCTION (security definer to avoid RLS recursion) -----
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- 5. POLICIES (drop & recreate so the file is safe to re-run) ----------

-- Courses, live_class, assignments → public read
drop policy if exists "courses_public_read"     on public.courses;
drop policy if exists "live_public_read"        on public.live_class;
drop policy if exists "assign_public_read"      on public.assignments;
create policy "courses_public_read" on public.courses     for select using (true);
create policy "live_public_read"    on public.live_class  for select using (true);
create policy "assign_public_read"  on public.assignments for select using (true);

-- Profiles
drop policy if exists "profile_self_read"   on public.profiles;
drop policy if exists "profile_self_update" on public.profiles;
drop policy if exists "profile_self_insert" on public.profiles;
create policy "profile_self_read"
  on public.profiles for select to authenticated
  using (auth.uid() = id or public.has_role(auth.uid(), 'teacher'));
create policy "profile_self_update"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "profile_self_insert"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

-- Enrollments
drop policy if exists "enroll_self_read"     on public.enrollments;
drop policy if exists "enroll_teacher_all"   on public.enrollments;
drop policy if exists "enroll_self_insert"   on public.enrollments;
create policy "enroll_self_read"
  on public.enrollments for select to authenticated
  using (auth.uid() = student_id or public.has_role(auth.uid(), 'teacher'));
create policy "enroll_teacher_all"
  on public.enrollments for all to authenticated
  using (public.has_role(auth.uid(), 'teacher'))
  with check (public.has_role(auth.uid(), 'teacher'));
create policy "enroll_self_insert"
  on public.enrollments for insert to authenticated
  with check (auth.uid() = student_id);

-- Submissions
drop policy if exists "sub_self_all"     on public.submissions;
drop policy if exists "sub_teacher_read" on public.submissions;
create policy "sub_self_all"
  on public.submissions for all to authenticated
  using (auth.uid() = student_id) with check (auth.uid() = student_id);
create policy "sub_teacher_read"
  on public.submissions for select to authenticated
  using (public.has_role(auth.uid(), 'teacher'));

-- Teacher-only writes on courses / live / assignments
drop policy if exists "courses_teacher_write" on public.courses;
drop policy if exists "live_teacher_write"    on public.live_class;
drop policy if exists "assign_teacher_write"  on public.assignments;
create policy "courses_teacher_write"
  on public.courses for all to authenticated
  using (public.has_role(auth.uid(), 'teacher'))
  with check (public.has_role(auth.uid(), 'teacher'));
create policy "live_teacher_write"
  on public.live_class for all to authenticated
  using (public.has_role(auth.uid(), 'teacher'))
  with check (public.has_role(auth.uid(), 'teacher'));
create policy "assign_teacher_write"
  on public.assignments for all to authenticated
  using (public.has_role(auth.uid(), 'teacher'))
  with check (public.has_role(auth.uid(), 'teacher'));

-- User roles
drop policy if exists "roles_self_read"     on public.user_roles;
drop policy if exists "roles_teacher_all"   on public.user_roles;
create policy "roles_self_read"
  on public.user_roles for select to authenticated
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'teacher'));
create policy "roles_teacher_all"
  on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'teacher'))
  with check (public.has_role(auth.uid(), 'teacher'));

-- 6. AUTO-CREATE PROFILE + STUDENT ROLE ON SIGNUP ---------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'student')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- DONE ✅  Now create the teacher account in Auth → Users, then run:
--   insert into public.user_roles (user_id, role)
--   values ('PASTE-TEACHER-UID-HERE', 'teacher');
