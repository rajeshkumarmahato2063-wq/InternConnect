-- Migration: 20260910_skill_verification_hub.sql
-- Description: Create skill_categories, challenges, challenge_questions, and challenge_attempts tables with seed data and RLS.

-- 1. Skill Categories Table
CREATE TABLE IF NOT EXISTS public.skill_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT DEFAULT 'Code',
    color TEXT DEFAULT 'indigo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Challenges Table
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID REFERENCES public.skill_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    duration INTEGER NOT NULL DEFAULT 20, -- in minutes
    passing_score INTEGER NOT NULL DEFAULT 70,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Challenge Questions Table
CREATE TABLE IF NOT EXISTS public.challenge_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('MCQ', 'Coding')),
    question TEXT NOT NULL,
    options JSONB DEFAULT '[]'::jsonb, -- Array of options for MCQ, or starter code template for Coding
    correct_answer TEXT NOT NULL,
    marks INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Challenge Attempts Table
CREATE TABLE IF NOT EXISTS public.challenge_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL DEFAULT 0,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    answers JSONB DEFAULT '{}'::jsonb,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_challenge UNIQUE (challenge_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_challenges_skill ON public.challenges(skill_id);
CREATE INDEX IF NOT EXISTS idx_challenge_questions_challenge ON public.challenge_questions(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_student ON public.challenge_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_challenge_attempts_challenge ON public.challenge_attempts(challenge_id);

-- RLS Policies
CREATE POLICY "Public read skill_categories" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Public read challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Public read challenge_questions" ON public.challenge_questions FOR SELECT USING (true);
CREATE POLICY "Students manage own challenge_attempts" ON public.challenge_attempts FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Public read challenge_attempts for leaderboard" ON public.challenge_attempts FOR SELECT USING (true);

-- Seed Categories
INSERT INTO public.skill_categories (name, icon, color) VALUES
('JavaScript', 'Code2', 'amber'),
('React', 'Atom', 'cyan'),
('Python', 'FileCode', 'emerald'),
('Java', 'Coffee', 'orange'),
('SQL', 'Database', 'purple'),
('Data Structures', 'GitBranch', 'indigo')
ON CONFLICT (name) DO NOTHING;

-- Enable Realtime
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_attempts;
    END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
