-- SQL Migration for Student Projects & Portfolio Builder
-- Table: student_projects

CREATE TABLE IF NOT EXISTS public.student_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.student_projects ENABLE ROW LEVEL SECURITY;

-- 1. Public can view all student projects for public portfolio pages
CREATE POLICY "Public can view student projects"
ON public.student_projects FOR SELECT
USING (true);

-- 2. Students can insert their own projects
CREATE POLICY "Students can insert their own projects"
ON public.student_projects FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- 3. Students can update their own projects
CREATE POLICY "Students can update their own projects"
ON public.student_projects FOR UPDATE
USING (auth.uid() = student_id);

-- 4. Students can delete their own projects
CREATE POLICY "Students can delete their own projects"
ON public.student_projects FOR DELETE
USING (auth.uid() = student_id);

-- Enable Supabase Realtime for student_projects
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_projects;
