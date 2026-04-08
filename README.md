# 🌙 Elaf-ul-Quran Academy

An online Quranic education platform by **Ustadha Afshan Imran** — teaching Tajweed, Tafseer, Nazra Quran, and more.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ — [Download](https://nodejs.org)
- **npm** (comes with Node.js)

### Install & Run

```bash
npm install
npm run dev
```

Open **http://localhost:8080** in your browser.

---

## 🔐 Teacher Login

| Email | Password |
|-------|----------|
| `afshan@elaf.com` | `elaf2024` |

This gives you access to the **Teacher Panel** where you can:
- ✅ Add new courses
- ✅ Add video lessons (paste YouTube links)
- ✅ Start Live Classes (Zoom/YouTube Live)
- ✅ Grade student assignments
- ✅ View all students and their progress

---

## 📺 Live Class Feature

1. Login as teacher
2. Go to **"Go Live"** tab
3. Paste your Zoom/Google Meet/YouTube Live link
4. Click **"Go Live Now"**
5. Students will see a **red banner** at the top of the website with a "Join Now" button
6. Click **"End Live Class"** when done

---

## 🆓 Free Hosting Options

### Option 1: Vercel (Recommended — Easiest)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
3. Click "Import Project" → Select your repo
4. Click "Deploy" — Done! Your site will be live at `yourproject.vercel.app`

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com) → Sign up
2. Drag & drop your `dist` folder (after running `npm run build`)
3. Your site is live!

### Option 3: GitHub Pages (Free)
1. Run `npm run build`
2. Push the `dist` folder to a `gh-pages` branch
3. Enable GitHub Pages in repo settings

### Option 4: Render.com
1. Go to [render.com](https://render.com) → Create a Static Site
2. Connect your GitHub repo
3. Set build command: `npm run build`, publish dir: `dist`

---

## 🛠 Adding a Real Backend (Optional)

The site currently uses mock data. To make it real:

### Supabase (Free Tier Available)

1. Go to [supabase.com](https://supabase.com) → Create account & project
2. Create a `.env` file:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

3. Install: `npm install @supabase/supabase-js`
4. Run the SQL schema from `BACKEND-SETUP.md` in Supabase SQL Editor

---

## 📱 WhatsApp Contact

The website has a floating WhatsApp button. To change the phone number:
- Edit `src/components/WhatsAppButton.tsx` → Update `WHATSAPP_NUMBER`
- Edit `src/components/Footer.tsx` → Update the WhatsApp links

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── landing/         # Landing page sections
│   ├── ui/              # shadcn/ui components
│   ├── Navbar.tsx       # Navigation bar
│   ├── Footer.tsx       # Footer with social links
│   ├── WhatsAppButton.tsx  # Floating WhatsApp contact
│   └── LiveClassBanner.tsx # Live class notification
├── pages/               # Route pages
│   ├── Index.tsx         # Landing page
│   ├── Courses.tsx       # All courses
│   ├── CourseDetail.tsx  # Single course view
│   ├── CoursePlayer.tsx  # Video player
│   ├── AdminDashboard.tsx # Teacher panel
│   ├── StudentDashboard.tsx # Student portal
│   ├── Login.tsx         # Login page
│   └── Register.tsx      # Registration
├── lib/
│   └── mock-data.ts     # Sample data (replace with DB later)
└── hooks/               # Custom React hooks
```

---

## 🏗 Build for Production

```bash
npm run build
```

This creates a `dist` folder ready for deployment.

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Module not found" | Run `npm install` |
| Port already in use | Change port in `vite.config.ts` |
| Blank page | Check browser console (F12) |
| WhatsApp not working | Update phone number in `WhatsAppButton.tsx` |

---

JazakAllahu Khairan! 🤲
