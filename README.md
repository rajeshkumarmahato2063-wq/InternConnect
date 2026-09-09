# 🚀 InternConnect AI — Production Full-Stack Internship Platform

**InternConnect AI** is an enterprise-grade AI-powered internship discovery, candidate recruitment, real-time collaboration, and workflow automation platform inspired by LinkedIn Jobs and Internshala.

Built with **React (Vite), Supabase (Auth, PostgreSQL, Storage, Realtime), TailwindCSS, Framer Motion, and Gemini AI**.

---

## 🌟 Key Features Overview

### 1. 🔑 Supabase Authentication & RBAC
- Role-based routing (**Student**, **Company Recruiter**, **Admin**).
- Automated profile creation on first login with session token persistence.

### 2. 🎯 Student Career Hub
- **ATS Resume Upload & Storage**: Upload, replace, and delete resumes stored securely in Supabase Storage (`resumes` bucket, max 5 MB, PDF/DOCX).
- **Dynamic Profile Strength Ring**: Live profile completion meter (+25% Resume, +25% Skills, +15% GitHub, +15% LinkedIn, +20% Portfolio).
- **1-Click Application System**: Apply with cover letter and auto-attached resume.
- **Visual Application Tracker**: Stepper tracking (`Applied` ➔ `Reviewing` ➔ `Shortlisted` ➔ `Interview` ➔ `Selected`).
- **Interview Portal**: Real-time list of scheduled technical interviews with Google Meet/Zoom quick-join links.
- **Offer Letters**: Review, accept, or decline official offer letters with PDF preview and confirmation dialogs.
- **Verified Certificates**: Digital completion credentials with QR code verification and direct LinkedIn share actions.

### 3. 🏢 Employer Hiring Suite
- **Internship Posting & Management**: Post, edit, close, or reopen internship listings with skill tags, stipend, duration, and deadlines.
- **AI Match Ranked Candidate Pipeline**: Rank applicants by AI Resume Match Score (0–100%).
- **Interview Scheduler**: Set interview dates, times, video meeting links, and recruiter notes.
- **Offer Letter Generator**: Upload & send official PDF offer letters to shortlisted candidates.

### 4. 💬 Real-Time Messaging & Notifications
- **Supabase Realtime Chat**: Direct candidate ↔ recruiter messaging channel with typing indicators and conversation search.
- **Notification Drawer**: Unread badge count with real-time alerts for application updates, interview invites, offer letters, and new messages.

### 5. 🤖 Gemini AI Career Suite
- **AI Resume Builder & Score**: Instant feedback on ATS compatibility, missing skills, and formatting.
- **AI Cover Letter Generator**: Custom cover letter creation tailored to target internship descriptions.
- **AI Career Roadmap**: 6-month skill development milestone timelines.
- **AI Interview Coach**: AI mock technical interviews with real-time feedback.

### 6. 🛡️ Admin Control Panel
- Employer verification & badge management.
- User management and platform analytics with PDF/CSV report exports.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite |
| **Styling & UI** | TailwindCSS, Glassmorphism, Framer Motion, Lucide Icons |
| **Database & Auth** | Supabase (PostgreSQL, Row Level Security, Auth) |
| **File Storage** | Supabase Storage (`resumes`, `offer-letters`, `certificates` buckets) |
| **Realtime Engine** | Supabase Realtime Channels |
| **AI Integration** | Google Gemini AI API |
| **Charts & PDF** | Recharts, html2pdf.js |

---

## 🗄️ Database Schema & SQL Setup

Execute the following script in the **Supabase SQL Editor**:

```sql
-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  college VARCHAR(255),
  degree VARCHAR(255),
  graduation_year VARCHAR(50),
  skills TEXT[],
  github TEXT,
  linkedin TEXT,
  portfolio TEXT,
  resume_url TEXT,
  resume_name TEXT,
  resume_uploaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Internships Table
CREATE TABLE IF NOT EXISTS public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  company_logo TEXT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  work_mode VARCHAR(50) NOT NULL,
  stipend VARCHAR(100) NOT NULL,
  stipend_value NUMERIC DEFAULT 0,
  duration VARCHAR(100) NOT NULL,
  skills TEXT[],
  openings INT DEFAULT 1,
  deadline DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_url TEXT,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'Applied',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(internship_id, student_id)
);

-- Interviews Table
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interview_date DATE NOT NULL,
  interview_time VARCHAR(50) NOT NULL,
  meeting_link TEXT NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Offers Table
CREATE TABLE IF NOT EXISTS public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_letter_url TEXT NOT NULL,
  stipend VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Pending',
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
  certificate_url TEXT NOT NULL,
  verification_code VARCHAR(100) UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.offers;
```

---

## ⚡ Quick Start & Local Development

### 1. Clone Repository & Install Dependencies
```bash
cd client
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in `client/`:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### 3. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Production Deployment (Vercel)

1. Connect repository to **Vercel**.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Add Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. Deploy!
