# InternConnect AI 🚀

An AI-powered recruitment, internship matching, skill verification, and applicant management platform built with **React**, **Vite**, **Tailwind CSS**, **Node.js/Express**, **Supabase** (Auth, Postgres DB, Row Level Security, Edge Functions), and **Google Gemini 1.5 Flash AI**.

---

## 🌟 Key Features & Capabilities

### 1. 🤖 Site-Wide AI Copilot
- **Floating AI Assistant:** Available on every page in the bottom-right corner.
- **Context-Aware Memory:** Loads candidate name, skills, college, saved jobs, and recent applications.
- **Role-Based Quick Actions:** Tailored workflows for students (Find Internships, Resume Review, Cover Letter, Interview Prep, Career Roadmap) and recruiters (Rank Applicants, Write Job Descriptions, Interview Questions, Hiring Tips).
- **Secure Gemini Gateway:** API keys stored safely in Supabase Secrets / Server environment variables.

### 2. 🏆 AI Recruiter Dashboard & Applicant Ranking
- **Automated Candidate Scoring:** Evaluates applicants out of 100 with category breakdowns (Skill Match 40/40, Education 20/20, Projects 20/20, Resume Quality 20/20).
- **Ordinal Rank Badges:** Awards **Gold Medal (#1)**, **Silver Medal (#2)**, and **Bronze Medal (#3)** badges for top candidates.
- **AI Interview Question Kits:** Automatically generates role-specific Technical, HR, and STAR Behavioral questions.
- **Constructive Rejection Feedback:** Generates personalized growth feedback for rejected candidates.

### 3. 🎯 Skill Verification & Coding Challenge Hub (`/skill-hub`)
- **Timed Coding Challenges:** Practice MCQs and coding questions with progress bar timers and auto-submission.
- **Verified Skill Badges:** Earn recruiter-verified skill badges (e.g. 🏅 Java Verified, ⚡ React Verified, 💎 SQL Verified) displayed across Student Dashboards, Public Portfolios, and Recruiter Applicant Cards.
- **AI Diagnostic Roadmaps:** Analyzes weak topics and generates step-by-step learning roadmaps.
- **Global Leaderboard:** Ranks top talent nationwide.

### 4. 📝 Online Internship Assessment System (`/company/assessments` & `/student/assessments`)
- **Recruiter Test Builder:** Create custom MCQ screening assessments with duration limits, passing score cutoffs, and marks per question.
- **Full-Screen Timed Portal:** Anti-cheating tab switch warning detector, question palette navigation, answer auto-saving, and auto-scored result screens.
- **Recruiter Leaderboard:** Tracks candidate test scores, percentages, and pass/fail statuses.

### 5. 🎨 Student Portfolio Builder & Public Portfolios (`/portfolio/:username`)
- **Public Portfolios:** Showcase verified badges, projects, certificates, GitHub, LinkedIn, and QR codes.
- **Resume Export:** Download formatted candidate PDF resumes and ATS cover letters.

### 6. 🛡️ Company Verification System
- **Admin Review Queue:** Document upload verification workflow (Company Logo, Registration, Website) with Verified Badges.

### 7. 🔔 Realtime Notification System
- **Instant Updates:** Powered by Supabase Realtime for application status changes, shortlisting, interview invitations, offer letters, and assessment reminders.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database & Auth:** Supabase PostgreSQL, Row Level Security (RLS), Supabase Auth
- **Serverless Engine:** Supabase Edge Functions (Deno)
- **AI Engine:** Google Gemini 1.5 Flash API

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase account with configured database credentials

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/rajeshkumarmahato2063-wq/InternConnect.git
cd InternConnect
```

Install frontend dependencies:
```bash
cd client
npm install
```

Install backend dependencies:
```bash
cd ../server
npm install
```

### 3. Environment Setup

Create `.env` in `client/`:
```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Create `.env` in `server/`:
```env
PORT=5000
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

### 4. Database Migrations
Apply SQL files from `supabase/migrations/` to your Supabase SQL Editor:
- `20260910_resume_analysis.sql`
- `20260910_cover_letters.sql`
- `20260910_realtime_notifications.sql`
- `20260910_company_verification.sql`
- `20260910_student_projects.sql`
- `20260910_ai_copilot.sql`
- `20260910_email_workflow.sql`
- `20260910_applicant_management.sql`
- `20260910_ai_applicant_analysis.sql`
- `20260910_internship_assessments.sql`
- `20260910_skill_verification_hub.sql`
- `20260910_ai_copilot_conversations.sql`

---

## 🌐 Running Locally

Start Frontend Dev Server (Port 3000):
```bash
cd client
npm run dev
```

Start Backend Dev Server (Port 5000):
```bash
cd server
npm run dev
```

### Server Links:
- **Frontend App:** [http://localhost:3000/](http://localhost:3000/)
- **Backend API:** [http://localhost:5000/](http://localhost:5000/)

---

## 📜 License
Built for **InternConnect AI**. All rights reserved.
