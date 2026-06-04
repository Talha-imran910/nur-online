-- =========================================================
-- Elaf-ul-Quran Academy — Wipe & seed REAL courses
-- Source: youtube.com/@Elafulquran (channel UCvJ4tOgEP_2u1K4E7UlSFVw)
-- Run this in Supabase SQL Editor.
-- =========================================================

-- 1. WIPE everything course-related (cascade handles units/lessons via FK)
delete from public.submissions;
delete from public.assignments;
delete from public.enrollments;
delete from public.lessons;
delete from public.units;
delete from public.courses;
delete from public.live_class;

-- 2. Make sure the 6 subjects exist (idempotent on name)
insert into public.subjects (id, name) values
  (gen_random_uuid(), 'Tajweed'),
  (gen_random_uuid(), 'Quran Recitation'),
  (gen_random_uuid(), 'Tafseer & Surahs'),
  (gen_random_uuid(), 'Duas & Spirituality'),
  (gen_random_uuid(), 'Islamic Months & Fiqh'),
  (gen_random_uuid(), 'Daily Reflections')
on conflict (name) do nothing;

-- 3. Resolve subject IDs into a temp table for inserts
do $$
declare
  teacher uuid;
  s_tajweed uuid; s_recit uuid; s_tafseer uuid; s_duas uuid; s_months uuid; s_daily uuid;
  c1 text := 'course-tajweed-basics';
  c2 text := 'course-surah-recitation';
  c3 text := 'course-tafseer-surahs';
  c4 text := 'course-duas-spirituality';
  c5 text := 'course-islamic-months';
  c6 text := 'course-daily-reflections';
  u1 text; u2 text; u3 text; u4 text; u5 text; u6 text;
begin
  select id into teacher from public.user_roles where role = 'teacher' limit 1;

  select id into s_tajweed from public.subjects where name = 'Tajweed';
  select id into s_recit   from public.subjects where name = 'Quran Recitation';
  select id into s_tafseer from public.subjects where name = 'Tafseer & Surahs';
  select id into s_duas    from public.subjects where name = 'Duas & Spirituality';
  select id into s_months  from public.subjects where name = 'Islamic Months & Fiqh';
  select id into s_daily   from public.subjects where name = 'Daily Reflections';

  -- Courses
  insert into public.courses (id, title, description, subject_id, thumbnail_url, level, is_free, price, duration, is_published, rating, teacher_id) values
    (c1, 'Tajweed Fundamentals — Recite Correctly',
        'Master the foundational rules of Tajweed: hamza wasl, meem sakin, tanween, gunna, and idgham — taught simply by Ustadha Afshan Imran.',
        s_tajweed, 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80',
        'Beginner', true, 0, '4 weeks', true, 5, teacher),

    (c2, 'Beautiful Surah Recitation',
        'Learn the proper recitation of Surah Yaseen, Surah Al-Fajr, Surah Al-Ikhlas, and Aal-e-Imran with the Ustadha.',
        s_recit, 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80',
        'Beginner', true, 0, '6 weeks', true, 5, teacher),

    (c3, 'Tafseer of Selected Surahs',
        'Understand the deeper meaning of key Surahs of the Holy Quran.',
        s_tafseer, 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80',
        'Intermediate', false, 25, '8 weeks', true, 5, teacher),

    (c4, 'Daily Duas & Connecting with Allah',
        'Authentic duas including Darood-e-Ibraheem and reflections on the words of Allah.',
        s_duas, 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80',
        'Beginner', true, 0, '3 weeks', true, 5, teacher),

    (c5, 'Blessed Islamic Months — Hajj & Qurbani',
        'Learn the virtues, rulings, and acts of worship for the blessed days of Dhul-Hijjah, Qurbani, and more.',
        s_months, 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80',
        'Beginner', false, 15, '2 weeks', true, 5, teacher),

    (c6, 'Daily Reflections with Ustadha',
        'Short daily reminders and lessons recorded by Ustadha Afshan Imran.',
        s_daily, 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80',
        'Beginner', true, 0, 'Ongoing', true, 5, teacher);

  -- Units
  u1 := 'unit-' || c1; u2 := 'unit-' || c2; u3 := 'unit-' || c3;
  u4 := 'unit-' || c4; u5 := 'unit-' || c5; u6 := 'unit-' || c6;

  insert into public.units (id, course_id, title, sort_order) values
    (u1, c1, 'Core Tajweed Rules', 0),
    (u2, c2, 'Surah Recitation', 0),
    (u3, c3, 'Tafseer Lessons', 0),
    (u4, c4, 'Daily Duas', 0),
    (u5, c5, 'Hajj & Qurbani', 0),
    (u6, c6, 'Daily Reminders', 0);

  -- Lessons (real YouTube videos)
  -- Tajweed (4)
  insert into public.lessons (id, unit_id, title, youtube_url, duration, sort_order) values
    ('lesson-tj-1', u1, 'Hamza Wasl', 'https://www.youtube.com/watch?v=BDNb-ofq40w', '8 min', 1),
    ('lesson-tj-2', u1, 'Meem Sakin',  'https://www.youtube.com/watch?v=JCsXultx2gQ', '10 min', 2),
    ('lesson-tj-3', u1, 'Tanween & Rule of Gunna — Part 1', 'https://www.youtube.com/watch?v=v7KH4NrN35I', '12 min', 3),
    ('lesson-tj-4', u1, 'Tanween & Idgham — Part 2',        'https://www.youtube.com/watch?v=kU9kLnj6WKE', '12 min', 4);

  -- Recitation (4)
  insert into public.lessons (id, unit_id, title, youtube_url, duration, sort_order) values
    ('lesson-rc-1', u2, 'Surah Yaseen — Mubeen Wird',  'https://www.youtube.com/watch?v=11pnfWk1150', '20 min', 1),
    ('lesson-rc-2', u2, 'Surah Al-Fajr — Part 1',      'https://www.youtube.com/watch?v=WXC-XX8BzHI', '15 min', 2),
    ('lesson-rc-3', u2, 'Surah Al-Ikhlas',             'https://www.youtube.com/watch?v=aN9RBcvQZvE', '8 min',  3),
    ('lesson-rc-4', u2, 'Aal-e-Imran — Ruku 7',        'https://www.youtube.com/watch?v=5YRpl0ANplI', '18 min', 4);

  -- Tafseer (1 for now — uses Aal-e-Imran)
  insert into public.lessons (id, unit_id, title, youtube_url, duration, sort_order) values
    ('lesson-tf-1', u3, 'Surah Aal-e-Imran — Ruku 7 Tafseer', 'https://www.youtube.com/watch?v=5YRpl0ANplI', '18 min', 1);

  -- Duas (2)
  insert into public.lessons (id, unit_id, title, youtube_url, duration, sort_order) values
    ('lesson-du-1', u4, 'Darood-e-Ibraheem',          'https://www.youtube.com/watch?v=n9JqQmqe1MA', '6 min', 1),
    ('lesson-du-2', u4, 'Baat ul Allah — His Words',  'https://www.youtube.com/watch?v=IYIh3qorzDs', '14 min', 2);

  -- Months (2)
  insert into public.lessons (id, unit_id, title, youtube_url, duration, sort_order) values
    ('lesson-mn-1', u5, 'Blessed Days of Dhul-Hijjah','https://www.youtube.com/watch?v=-ohUvpfqsGA', '12 min', 1),
    ('lesson-mn-2', u5, 'Qurbani — What It Is',       'https://www.youtube.com/watch?v=85c3uBKj7jc', '10 min', 2);

  -- Daily reflections (3)
  insert into public.lessons (id, unit_id, title, youtube_url, duration, sort_order) values
    ('lesson-dr-1', u6, 'Reflection — May 12, 2026', 'https://www.youtube.com/watch?v=jG_8KdYW9x4', '5 min', 1),
    ('lesson-dr-2', u6, 'Reflection — May 13, 2026', 'https://www.youtube.com/watch?v=Tm6dF_8vipA', '5 min', 2),
    ('lesson-dr-3', u6, 'Reflection — May 14, 2026', 'https://www.youtube.com/watch?v=_taaqZWVhz8', '5 min', 3);
end $$;

-- 4. Auto-enroll every existing student into all FREE courses
insert into public.enrollments (student_id, course_id, progress)
select s.id, c.id, 0
from public.students s
cross join public.courses c
where c.is_free = true
on conflict (student_id, course_id) do nothing;
