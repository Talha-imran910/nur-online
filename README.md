# 🌙 Elaf-ul-Quran Academy

An online Quranic education platform by **Ustadha Afshan Imran** — teaching Tajweed, Tafseer, Nazra Quran, and more.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔐 Teacher Login

- **Email:** `afshan@elaf.com`
- **Password:** `elaf2024`

## 🎓 Features

| Feature | Description |
|---------|-------------|
| **Student Portal** | Browse courses, watch lessons, submit assignments |
| **Teacher Portal** | Add/edit/delete courses, change prices, upload PDFs, grade work, go live |
| **Live Classes** | Paste Zoom/YouTube link → students see "LIVE NOW" banner |
| **Grades** | Grade individually, then publish all grades at once |
| **Remember Me** | Login saves email & password automatically |
| **Enrollment** | Students provide name, phone number, and email |
| **PDF Upload** | Teacher can upload PDF notes/worksheets per course |

---

## 🗄️ Database Schema (3NF — Third Normal Form)

Run this SQL in Supabase SQL Editor, Neon, or any PostgreSQL database:

```sql
-- ============================================
-- ELAF-UL-QURAN ACADEMY — 3NF DATABASE SCHEMA
-- ============================================

-- 1. SUBJECTS (lookup table)
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. COURSES
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  thumbnail_url TEXT,
  duration VARCHAR(50),
  level VARCHAR(20) CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  is_free BOOLEAN DEFAULT true,
  price DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. UNITS
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. LESSONS
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  youtube_url TEXT,
  pdf_url TEXT,
  duration VARCHAR(20),
  has_quiz BOOLEAN DEFAULT false,
  has_assignment BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. STUDENTS
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ENROLLMENTS (many-to-many)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, course_id)
);

-- 7. LESSON PROGRESS
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, lesson_id)
);

-- 8. ASSIGNMENTS
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. SUBMISSIONS
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  submission_text TEXT,
  file_url TEXT,
  grade INT CHECK (grade >= 0 AND grade <= 100),
  feedback TEXT,
  is_published BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  graded_at TIMESTAMPTZ,
  UNIQUE(assignment_id, student_id)
);

-- 10. QUIZZES
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. QUIZ QUESTIONS
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INT NOT NULL,
  sort_order INT DEFAULT 0
);

-- 12. QUIZ ATTEMPTS
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  score INT NOT NULL,
  answers JSONB,
  attempted_at TIMESTAMPTZ DEFAULT now()
);

-- 13. LIVE CLASSES
CREATE TABLE live_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  meeting_link TEXT NOT NULL,
  is_live BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

-- INDEXES
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_lessons_unit ON lessons(unit_id);
CREATE INDEX idx_units_course ON units(course_id);
```

### 3NF Explanation

| Normal Form | Rule | How We Follow It |
|-------------|------|-----------------|
| **1NF** | No repeating groups | Each column holds a single value |
| **2NF** | No partial dependencies | Every non-key depends on full primary key |
| **3NF** | No transitive dependencies | Subject info in `subjects` table, not in `courses` |

### Entity Relationships

```
subjects ──< courses ──< units ──< lessons ──< assignments ──< submissions
                │                    │                              │
                │                    ├──< quizzes ──< quiz_questions│
                │                    │         └──< quiz_attempts   │
                │                    └──< lesson_progress           │
                │                              │                    │
                └──< enrollments >──┘          └────── students ────┘
```

---

## 🌐 Free Hosting

### Frontend (pick one)

| Provider | How |
|----------|-----|
| **[Vercel](https://vercel.com)** (recommended) | Connect GitHub → auto-detects Vite → Deploy |
| **[Netlify](https://netlify.com)** | Build: `npm run build`, Publish: `dist` |
| **[Cloudflare Pages](https://pages.cloudflare.com)** | Same as Netlify, free unlimited bandwidth |
| **GitHub Pages** | `npm i -D gh-pages` → `npm run build && gh-pages -d dist` |

### Database (pick one)

| Provider | Free Tier |
|----------|-----------|
| **[Supabase](https://supabase.com)** (recommended) | 500MB DB, 1GB storage, auth built-in |
| **[Neon](https://neon.tech)** | 512MB PostgreSQL, serverless |
| **[Railway](https://railway.app)** | $5/mo credit |

### Supabase Setup
1. Create account → New project
2. SQL Editor → paste schema above → Run
3. Settings → API → copy URL + anon key
4. Update your app config

---

## 📞 Update Contact Info

- WhatsApp number: `src/components/WhatsAppButton.tsx` line 3
- Social links: `src/components/Footer.tsx`

Built with ❤️ for Elaf-ul-Quran Academy
