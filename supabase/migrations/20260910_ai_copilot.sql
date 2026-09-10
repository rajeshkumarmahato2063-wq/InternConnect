-- SQL Migration for AI Internship Copilot
-- Table: ai_conversations

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_ai_conversation UNIQUE (user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- 1. Users can view their own AI conversation history
CREATE POLICY "Users can view their own AI conversation"
ON public.ai_conversations FOR SELECT
USING (auth.uid() = user_id);

-- 2. Users can insert their own AI conversation
CREATE POLICY "Users can insert their own AI conversation"
ON public.ai_conversations FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own AI conversation
CREATE POLICY "Users can update their own AI conversation"
ON public.ai_conversations FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Users can delete their own AI conversation
CREATE POLICY "Users can delete their own AI conversation"
ON public.ai_conversations FOR DELETE
USING (auth.uid() = user_id);

-- Enable Supabase Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_conversations;
