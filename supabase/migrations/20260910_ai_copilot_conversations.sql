-- Migration: 20260910_ai_copilot_conversations.sql
-- Description: Create ai_conversations table with Row Level Security (RLS) policies for user chat history persistence.

CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'company', 'admin')),
    message TEXT NOT NULL,
    reply TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Indexes for fast query retrieval
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_created_at ON public.ai_conversations(created_at DESC);

-- RLS Policy: Users can only select their own conversation history
CREATE POLICY "Users can view own ai_conversations"
ON public.ai_conversations
FOR SELECT
USING (user_id = auth.uid());

-- RLS Policy: Users can insert into their own conversation history
CREATE POLICY "Users can insert own ai_conversations"
ON public.ai_conversations
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- RLS Policy: Users can delete their own conversation history
CREATE POLICY "Users can delete own ai_conversations"
ON public.ai_conversations
FOR DELETE
USING (user_id = auth.uid());

-- Realtime publication enablement
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_conversations;
    END IF;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
