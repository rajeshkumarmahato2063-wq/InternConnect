-- Migration: 20260910_ai_applicant_analysis.sql
-- Description: Create table for storing AI candidate applicant evaluations, score breakdowns, interview questions, and rejection feedback.

CREATE TABLE IF NOT EXISTS public.ai_applicant_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    score_breakdown JSONB DEFAULT '{"skill_match": 35, "education": 20, "projects": 18, "resume_quality": 17}'::jsonb,
    matching_skills TEXT[] DEFAULT '{}',
    missing_skills TEXT[] DEFAULT '{}',
    strengths TEXT[] DEFAULT '{}',
    weaknesses TEXT[] DEFAULT '{}',
    interview_questions JSONB DEFAULT '{"technical": [], "hr": [], "behavioral": []}'::jsonb,
    rejection_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_internship_student_analysis UNIQUE (internship_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE public.ai_applicant_analysis ENABLE ROW LEVEL SECURITY;

-- Indexes for ultra-fast queries by internship & student
CREATE INDEX IF NOT EXISTS idx_ai_applicant_analysis_internship ON public.ai_applicant_analysis(internship_id);
CREATE INDEX IF NOT EXISTS idx_ai_applicant_analysis_student ON public.ai_applicant_analysis(student_id);
CREATE INDEX IF NOT EXISTS idx_ai_applicant_analysis_score ON public.ai_applicant_analysis(score DESC);

-- RLS Policy: Company owners can view & manage AI analysis for their posted internships
CREATE POLICY "Company owners can select ai_applicant_analysis"
ON public.ai_applicant_analysis
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.internships i
        WHERE i.id = ai_applicant_analysis.internship_id
        AND i.company_id = auth.uid()
    )
);

CREATE POLICY "Company owners can insert/update ai_applicant_analysis"
ON public.ai_applicant_analysis
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.internships i
        WHERE i.id = ai_applicant_analysis.internship_id
        AND i.company_id = auth.uid()
    )
);

-- RLS Policy: Students can view their own AI analysis & feedback
CREATE POLICY "Students can view own ai_applicant_analysis"
ON public.ai_applicant_analysis
FOR SELECT
USING (
    student_id = auth.uid()
);

-- Add to Supabase Realtime publication if available
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_applicant_analysis;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;
