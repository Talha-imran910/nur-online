# 🕌 Elaf-ul-Quran Academy

> **Nurturing Hearts. Enlightening Lives.**
> A modern online Quran learning platform by **Ustadha Afshan Imran**, offering Nazra, Tajweed, Tafseer, Daily Duas, and Spiritual Tarbiyat for children and adults — worldwide.

🌐 **Live:** [elaf-ul-quran.vercel.app](https://www.elafulquran.com/)

---

## ✨ Features

- 📚 **Course Catalog** — Browse Tajweed, Tafseer, Duas & seasonal courses
- 🎥 **Secure Video Lessons** — YouTube-nocookie embeds with restricted UI
- 👩‍🎓 **Student Dashboard** — Track enrolled courses, progress & assignments
- 👩‍🏫 **Teacher Admin Panel** — Add/edit courses, units, lessons, students & go live
- 🔴 **Live Classes** — Zoom / YouTube Live banner for active sessions
- 💬 **WhatsApp Integration** — Direct enrollment & support
- 🔐 **Secure Auth** — Role-based access (teacher vs student) via Supabase RLS
- 📱 **Fully Responsive** — Works beautifully on mobile, tablet & desktop
- 🌙 **Islamic Design** — Emerald, gold & navy palette with elegant calligraphy
- 🚀 **SEO Optimized** — Open Graph, Twitter Cards, sitemap & JSON-LD schema

---

## 🛠️ Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Frontend     | React 18 + Vite 5 + TypeScript          |
| Styling      | Tailwind CSS + shadcn/ui                |
| Backend      | Supabase (Postgres, Auth, Realtime, RLS)|
| Hosting      | Vercel                                  |
| Routing      | React Router v6 (BrowserRouter)         |
| SEO          | react-helmet-async                      |

---

## 🚀 Local Setup

```bash
# 1. Clone
git clone https://github.com/<your-username>/elaf-ul-quran.git
cd elaf-ul-quran

# 2. Install
bun install      # or: npm install

# 3. Configure env
cp .env.example .env
# Edit .env and fill in VITE_WHATSAPP_NUMBER, VITE_SITE_URL

# 4. Run
bun dev          # or: npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

---

## 🔑 Environment Variables

| Variable                | Description                                |
| ----------------------- | ------------------------------------------ |
| `VITE_WHATSAPP_NUMBER`  | WhatsApp business number (digits only)     |
| `VITE_SITE_URL`         | Canonical site URL                         |

Never commit `.env`. Use `.env.example` as the template.

---

## 📂 Project Structure

```
src/
 ├── components/        # Reusable UI (Navbar, Footer, WhatsAppButton, …)
 ├── pages/             # Routes (Index, Courses, CourseDetail, Admin, …)
 ├── lib/               # db.ts (Supabase data layer), contact.ts (env)
 ├── integrations/      # Supabase client
 ├── hooks/             # Custom hooks
 └── index.css          # Design tokens + global styles
public/
 ├── og-image.jpg       # Social preview image
 ├── robots.txt
 └── sitemap.xml
supabase/
 ├── schema.sql         # Tables, RLS, roles, triggers
 └── seed-real-courses.sql  # Initial course seed
```

---

## 🧑‍🏫 Roles

- **Teacher** (`afshan@elaf.com`) — Full admin access (`/admin`)
- **Student** — Browse, enroll, watch lessons (`/dashboard`)

Role checks use a dedicated `user_roles` table + Supabase `has_role()` security definer function (no client-side role storage).

---

## 📜 License

© Elaf-ul-Quran Academy. All rights reserved.

---

> *"The best of you are those who learn the Qur'an and teach it."* — Prophet Muhammad ﷺ (Bukhari)
