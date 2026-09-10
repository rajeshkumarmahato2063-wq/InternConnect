-- SQL Migration for AI Resume Match Score Analysis
-- Table: resume_analysis

CREATE TABLE IF NOT EXISTS public.resume_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  matching_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_student_internship_analysis UNIQUE (student_id, internship_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.resume_analysis ENABLE ROW LEVEL SECURITY;

-- 1. Students can view their own resume analyses
CREATE POLICY "Students can view their own resume analyses"
ON public.resume_analysis FOR SELECT
USING (auth.uid() = student_id);

-- 2. Students can insert their own resume analyses
CREATE POLICY "Students can insert their own resume analyses"
ON public.resume_analysis FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- 3. Students can update their own resume analyses
CREATE POLICY "Students can update their own resume analyses"
ON public.resume_analysis FOR UPDATE
USING (auth.uid() = student_id);

-- 4. Companies can view resume analyses for their internships
CREATE POLICY "Companies can view resume analyses for their internships"
ON public.resume_analysis FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.internships
    WHERE internships.id = resume_analysis.internship_id
    AND internships.company_id = auth.uid()
  )
);

-- Enable Supabase Realtime for resume_analysis
ALTER PUBLICATION supabase_realtime ADD TABLE public.resume_analysis;
