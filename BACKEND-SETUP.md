# 🌙 Elaf-ul-Quran Academy — Local Backend Setup Guide

This guide helps you set up a local backend for the Elaf-ul-Quran Academy website.

---

## Prerequisites

1. **Node.js** (v18+) — Download from https://nodejs.org
2. **npm** (comes with Node.js)
3. **A code editor** — VS Code recommended: https://code.visualstudio.com

---

## Step 1: Install Dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

---

## Step 2: Run the Development Server

```bash
npm run dev
```

The website will be available at: **http://localhost:8080**

---

## Step 3: Teacher Login

Use these credentials to access the teacher dashboard:

- **Email:** `afshan@elaf.com`
- **Password:** `elaf2024`

---

## Step 4: Adding a Real Backend (Optional — Recommended)

The current website uses **mock data** (fake data for testing). To make it real with a database, authentication, and file storage, you have two options:

### Option A: Supabase (Easiest — Free Tier Available)

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Copy your project URL and anon key
4. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

5. Install the Supabase client:

```bash
npm install @supabase/supabase-js
```

6. Create the database tables by running this SQL in the Supabase SQL Editor:

```sql
-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  thumbnail TEXT,
  instructor TEXT DEFAULT 'Ustadha Afshan Imran',
  duration TEXT,
  lessons_count INTEGER DEFAULT 0,
  students_count INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Beginner',
  is_free BOOLEAN DEFAULT true,
  price DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  unit_title TEXT,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  duration TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Assignments table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  submission_text TEXT,
  file_url TEXT,
  grade INTEGER,
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ
);
```

### Option B: JSON Server (Simplest for Testing)

1. Install JSON Server:

```bash
npm install -g json-server
```

2. Create a `db.json` file in the project root with your data
3. Run:

```bash
json-server --watch db.json --port 3001
```

---

## Step 5: Build for Production

When ready to deploy:

```bash
npm run build
```

This creates a `dist` folder. Upload it to any hosting service:
- **Vercel** (https://vercel.com) — Free, easiest
- **Netlify** (https://netlify.com) — Free
- **GitHub Pages** — Free

---

## Need Help?

If you get stuck, common fixes:

1. **"Module not found" error** → Run `npm install` again
2. **Port already in use** → Change port in `vite.config.ts`
3. **Blank page** → Check browser console (F12) for errors

---

JazakAllahu Khairan! 🤲
