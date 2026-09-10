-- SQL Migration for AI Cover Letters
-- Table: cover_letters

CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  internship_id UUID REFERENCES public.internships(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- 1. Students can view their own cover letters
CREATE POLICY "Students can view their own cover letters"
ON public.cover_letters FOR SELECT
USING (auth.uid() = student_id);

-- 2. Students can insert their own cover letters
CREATE POLICY "Students can insert their own cover letters"
ON public.cover_letters FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- 3. Students can delete their own cover letters
CREATE POLICY "Students can delete their own cover letters"
ON public.cover_letters FOR DELETE
USING (auth.uid() = student_id);

-- Enable Supabase Realtime for cover_letters
ALTER PUBLICATION supabase_realtime ADD TABLE public.cover_letters;
