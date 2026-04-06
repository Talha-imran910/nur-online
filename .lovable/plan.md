
# 🕌 Noor Academy - Islamic Learning Platform

## Design Vision
- **Islamic geometric patterns** as backgrounds and decorations
- **Rich emerald green, gold, and deep navy** color palette
- **Arabic calligraphy-inspired** headers with elegant serif fonts
- **Warm, welcoming** feel with subtle animations
- Beautiful hero images with Islamic architecture/art

## Pages & Features (V1)

### Public Pages
1. **Landing Page** - Hero, featured courses, testimonials, subjects overview
2. **Course Catalog** - Browse by subject (Quran, Hadith, Fiqh, Arabic, Islamic History, etc.), filter free/paid
3. **Course Detail** - Description, curriculum outline, instructor info, enroll button
4. **About / Instructor** page

### Student Dashboard (after login)
5. **My Courses** - Enrolled courses with progress bars
6. **Course Player** - YouTube video embed + lesson notes + mark complete
7. **Quizzes** - Multiple choice quizzes per lesson
8. **Assignments** - Submit text/file assignments
9. **Progress Tracking** - Visual progress per course

### Teacher/Admin Dashboard
10. **Manage Courses** - Create/edit courses, add YouTube links, organize into units
11. **Manage Quizzes** - Create quiz questions per lesson
12. **Manage Assignments** - Create & grade assignments
13. **Student Overview** - See all students and their progress
14. **Grading Panel** - Grade assignments with feedback

### Backend (Lovable Cloud)
- Auth (email/password sign up & login)
- Database tables: courses, lessons, quizzes, assignments, enrollments, progress, grades
- Storage for assignment submissions
- RLS policies for student/teacher access

## Tech Approach
- React + TypeScript + Tailwind + shadcn/ui
- Lovable Cloud for backend (auth, DB, storage)
- YouTube embed for videos
- Islamic geometric pattern SVGs & generated hero images
- Fully responsive (mobile-first)

## What's deferred
- Payment integration (later)
- Certificates (later)
- Multi-language support
