-- Migration: 20260910_internship_assessments.sql
-- Description: Create tables for assessments, MCQ questions, and student test attempts with RLS policies.

-- 1. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    total_marks INTEGER NOT NULL DEFAULT 100,
    passing_marks INTEGER NOT NULL DEFAULT 60,
    instructions TEXT DEFAULT 'Answer all questions carefully within the time limit. Tab switches and exiting fullscreen mode will trigger anti-cheating alerts.',
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_internship_assessment UNIQUE (internship_id)
);

-- 2. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_answer TEXT NOT NULL CHECK (correct_answer IN ('option_a', 'option_b', 'option_c', 'option_d', 'A', 'B', 'C', 'D')),
    marks INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Assessment Attempts Table
CREATE TABLE IF NOT EXISTS public.assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Started' CHECK (status IN ('Started', 'Completed', 'Passed', 'Failed', 'Time Expired')),
    answers JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    CONSTRAINT unique_student_assessment_attempt UNIQUE (assessment_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessments_internship ON public.assessments(internship_id);
CREATE INDEX IF NOT EXISTS idx_questions_assessment ON public.questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_attempts_assessment ON public.assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student ON public.assessment_attempts(student_id);

-- RLS Policies for assessments
CREATE POLICY "Company owners can manage their assessments"
ON public.assessments FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.internships i
        WHERE i.id = assessments.internship_id
        AND i.company_id = auth.uid()
    )
);

CREATE POLICY "Students can view published assessments for internships"
ON public.assessments FOR SELECT
USING (true);

-- RLS Policies for questions
CREATE POLICY "Company owners can manage assessment questions"
ON public.questions FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.assessments a
        JOIN public.internships i ON a.internship_id = i.id
        WHERE a.id = questions.assessment_id
        AND i.company_id = auth.uid()
    )
);

CREATE POLICY "Students can view questions for active assessments"
ON public.questions FOR SELECT
USING (true);

-- RLS Policies for assessment_attempts
CREATE POLICY "Students can manage their own attempts"
ON public.assessment_attempts FOR ALL
USING (student_id = auth.uid());

CREATE POLICY "Company owners can view attempts for their assessments"
ON public.assessment_attempts FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.assessments a
        JOIN public.internships i ON a.internship_id = i.id
        WHERE a.id = assessment_attempts.assessment_id
        AND i.company_id = auth.uid()
    )
);

-- Enable Supabase Realtime publication
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.assessments;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.assessment_attempts;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;
