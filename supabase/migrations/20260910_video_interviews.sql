-- Video Interview Module Migration for InternConnect AI

CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    interview_date DATE NOT NULL,
    interview_time TEXT NOT NULL,
    meeting_link TEXT NOT NULL,
    interview_type TEXT DEFAULT 'Technical Screening',
    notes TEXT,
    status TEXT DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on interviews table
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view their own scheduled interviews
CREATE POLICY "Students can view own interviews" 
ON public.interviews 
FOR SELECT 
USING (auth.uid() = student_id);

-- Policy: Companies can view interviews they scheduled
CREATE POLICY "Companies can view own scheduled interviews" 
ON public.interviews 
FOR SELECT 
USING (auth.uid() = company_id);

-- Policy: Companies can insert new interview schedules
CREATE POLICY "Companies can insert interview schedules" 
ON public.interviews 
FOR INSERT 
WITH CHECK (auth.uid() = company_id);

-- Policy: Companies can update interview status
CREATE POLICY "Companies can update own interviews" 
ON public.interviews 
FOR UPDATE 
USING (auth.uid() = company_id);

-- Index for efficient querying by student or company
CREATE INDEX IF NOT EXISTS idx_interviews_student_id ON public.interviews(student_id);
CREATE INDEX IF NOT EXISTS idx_interviews_company_id ON public.interviews(company_id);
CREATE INDEX IF NOT EXISTS idx_interviews_date ON public.interviews(interview_date);

-- Add to Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.interviews;
