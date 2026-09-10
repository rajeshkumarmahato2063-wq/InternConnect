-- SQL Migration for Company Applicant Management & Status Workflow

-- 1. Ensure enum / status check constraint on applications table
ALTER TABLE IF EXISTS public.applications
DROP CONSTRAINT IF EXISTS applications_status_check;

ALTER TABLE IF EXISTS public.applications
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('Applied', 'Reviewing', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'));

-- 2. Create interviews table if not exists
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  interview_date DATE NOT NULL,
  interview_time VARCHAR(50) NOT NULL,
  meeting_link TEXT NOT NULL,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create notifications table if not exists
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Supabase Realtime for applications, interviews, and notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 5. Row Level Security (RLS) Policies

-- Applications Policies
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own applications" 
ON public.applications FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Students can submit applications" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Companies can view applications for their internships" 
ON public.applications FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.internships 
    WHERE internships.id = applications.internship_id 
    AND internships.company_id = auth.uid()
  )
);

CREATE POLICY "Companies can update application status for their internships" 
ON public.applications FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.internships 
    WHERE internships.id = applications.internship_id 
    AND internships.company_id = auth.uid()
  )
);

-- Interviews Policies
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view interviews relevant to them" 
ON public.interviews FOR SELECT 
USING (auth.uid() = student_id OR auth.uid() = company_id);

CREATE POLICY "Companies can schedule interviews" 
ON public.interviews FOR INSERT 
WITH CHECK (auth.uid() = company_id);

-- Notifications Policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their notifications" 
ON public.notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" 
ON public.notifications FOR UPDATE 
USING (auth.uid() = user_id);
