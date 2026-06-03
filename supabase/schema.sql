-- ======================================================================
--  Elaf-ul-Quran Academy — FINAL Supabase schema (idempotent, safe to re-run)
--  Paste this WHOLE file into Supabase → SQL Editor → New query → Run.
--  Project: https://yrvtcxeuqygvtfhfnvjf.supabase.co
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

create table if not exists public.students (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz default now()
);

create table if not exists public.subjects (
  id text primary key,
  name text not null,
  created_at timestamptz default now()
);

-- seed a few default subjects (safe re-run)
insert into public.subjects (id, name) values
  ('quran',   'Quran'),
  ('tajweed', 'Tajweed'),
  ('hifz',    'Hifz'),
  ('arabic',  'Arabic'),
  ('islamic', 'Islamic Studies')
on conflict (id) do nothing;

create table if not exists public.courses (
  id text primary key,
  title text not null,
  description text,
  subject_id text references public.subjects(id) on delete set null,
  level text,
  thumbnail_url text,
  duration text,
  price numeric default 0,
  is_free boolean default true,
  is_published boolean default true,
  rating numeric default 0,
  created_at timestamptz default now()
);

create table if not exists public.units (
  id text primary key,
  course_id text references public.courses(id) on delete cascade not null,
  title text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists public.lessons (
  id text primary key,
  unit_id text references public.units(id) on delete cascade not null,
  title text not null,
  youtube_url text,
  pdf_url text,
  duration text,
  has_quiz boolean default false,
  has_assignment boolean default false,
  sort_order int default 0,
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
  id uuid primary key default gen_random_uuid(),
  title text,
  link text,
  start_time timestamptz,
  is_live boolean default false,
  course_id text references public.courses(id) on delete set null
);

-- 3. GRANTS (Data API access — required) -------------------------------
grant select on public.subjects     to anon, authenticated;
grant select on public.courses      to anon, authenticated;
grant select on public.units        to anon, authenticated;
grant select on public.lessons      to anon, authenticated;
grant select on public.live_class   to anon, authenticated;
grant select on public.assignments  to anon, authenticated;

grant select, insert, update, delete on public.profiles    to authenticated;
grant select, insert, update, delete on public.students    to authenticated;
grant select, insert, update, delete on public.enrollments to authenticated;
grant select, insert, update, delete on public.submissions to authenticated;
grant select, insert, update, delete on public.user_roles  to authenticated;

grant insert, update, delete on public.subjects    to authenticated;
grant insert, update, delete on public.courses     to authenticated;
grant insert, update, delete on public.units       to authenticated;
grant insert, update, delete on public.lessons     to authenticated;
grant insert, update, delete on public.live_class  to authenticated;
grant insert, update, delete on public.assignments to authenticated;

grant all on all tables    in schema public to service_role;
grant all on all sequences in schema public to service_role;

-- 4. ENABLE RLS --------------------------------------------------------
alter table public.user_roles   enable row level security;
alter table public.profiles     enable row level security;
alter table public.students     enable row level security;
alter table public.subjects     enable row level security;
alter table public.courses      enable row level security;
alter table public.units        enable row level security;
alter table public.lessons      enable row level security;
alter table public.enrollments  enable row level security;
alter table public.assignments  enable row level security;
alter table public.submissions  enable row level security;
alter table public.live_class   enable row level security;

-- 5. ROLE-CHECK FUNCTION (SECURITY DEFINER avoids RLS recursion) -------
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

-- 6. POLICIES (drop & recreate so the file is safe to re-run) ----------

-- Public-read tables
do $$ declare t text;
begin
  foreach t in array array['subjects','courses','units','lessons','live_class','assignments']
  loop
    execute format('drop policy if exists "%s_public_read" on public.%I', t, t);
    execute format('create policy "%s_public_read" on public.%I for select using (true)', t, t);
  end loop;
end $$;

-- Teacher-only writes on content tables
do $$ declare t text;
begin
  foreach t in array array['subjects','courses','units','lessons','live_class','assignments']
  loop
    execute format('drop policy if exists "%s_teacher_write" on public.%I', t, t);
    execute format($p$create policy "%s_teacher_write" on public.%I for all to authenticated
      using (public.has_role(auth.uid(),'teacher'))
      with check (public.has_role(auth.uid(),'teacher'))$p$, t, t);
  end loop;
end $$;

-- Profiles
drop policy if exists "profile_self_read"    on public.profiles;
drop policy if exists "profile_teacher_read" on public.profiles;
drop policy if exists "profile_self_update"  on public.profiles;
drop policy if exists "profile_self_insert"  on public.profiles;
create policy "profile_self_read"    on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profile_teacher_read" on public.profiles for select to authenticated using (public.has_role(auth.uid(),'teacher'));
create policy "profile_self_update"  on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "profile_self_insert"  on public.profiles for insert to authenticated with check (auth.uid() = id);

-- Students (mirror table for teacher view)
drop policy if exists "students_self_read"    on public.students;
drop policy if exists "students_teacher_read" on public.students;
drop policy if exists "students_self_upsert"  on public.students;
drop policy if exists "students_self_update"  on public.students;
drop policy if exists "students_teacher_all"  on public.students;
create policy "students_self_read"    on public.students for select to authenticated using (auth.uid() = id);
create policy "students_teacher_read" on public.students for select to authenticated using (public.has_role(auth.uid(),'teacher'));
create policy "students_self_upsert"  on public.students for insert to authenticated with check (auth.uid() = id);
create policy "students_self_update"  on public.students for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "students_teacher_all"  on public.students for all    to authenticated using (public.has_role(auth.uid(),'teacher')) with check (public.has_role(auth.uid(),'teacher'));

-- Enrollments
drop policy if exists "enroll_self_read"     on public.enrollments;
drop policy if exists "enroll_teacher_all"   on public.enrollments;
drop policy if exists "enroll_self_insert"   on public.enrollments;
drop policy if exists "enroll_self_delete"   on public.enrollments;
create policy "enroll_self_read"   on public.enrollments for select to authenticated using (auth.uid() = student_id or public.has_role(auth.uid(),'teacher'));
create policy "enroll_teacher_all" on public.enrollments for all    to authenticated using (public.has_role(auth.uid(),'teacher')) with check (public.has_role(auth.uid(),'teacher'));
create policy "enroll_self_insert" on public.enrollments for insert to authenticated with check (auth.uid() = student_id);
create policy "enroll_self_delete" on public.enrollments for delete to authenticated using (auth.uid() = student_id);

-- Submissions
drop policy if exists "sub_self_all"     on public.submissions;
drop policy if exists "sub_teacher_read" on public.submissions;
create policy "sub_self_all"     on public.submissions for all    to authenticated using (auth.uid() = student_id) with check (auth.uid() = student_id);
create policy "sub_teacher_read" on public.submissions for select to authenticated using (public.has_role(auth.uid(),'teacher'));

-- User roles
drop policy if exists "roles_self_read"     on public.user_roles;
drop policy if exists "roles_teacher_all"   on public.user_roles;
create policy "roles_self_read"   on public.user_roles for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(),'teacher'));
create policy "roles_teacher_all" on public.user_roles for all    to authenticated using (public.has_role(auth.uid(),'teacher')) with check (public.has_role(auth.uid(),'teacher'));

-- 7. SIGNUP TRIGGER: profile + students-row + role --------------------
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
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1))
  )
  on conflict (id) do nothing;

  insert into public.students (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1))
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role)
  values (
    new.id,
    case when new.email = 'afshan@elaf.com' then 'teacher'::public.app_role
         else 'student'::public.app_role end
  )
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 8. PROMOTE afshan@elaf.com IF SHE ALREADY EXISTS --------------------
insert into public.user_roles (user_id, role)
select id, 'teacher'::public.app_role from auth.users where email = 'afshan@elaf.com'
on conflict (user_id, role) do nothing;

delete from public.user_roles
 where role = 'student'
   and user_id in (select id from auth.users where email = 'afshan@elaf.com');

delete from public.students
 where id in (select id from auth.users where email = 'afshan@elaf.com');

-- 9. REALTIME PUBLICATION (for live UI updates) ------------------------
do $$ declare t text;
begin
  foreach t in array array['courses','units','lessons','enrollments','live_class','subjects','assignments','students','user_roles']
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null; when others then null;
    end;
  end loop;
end $$;

-- DONE ✅
