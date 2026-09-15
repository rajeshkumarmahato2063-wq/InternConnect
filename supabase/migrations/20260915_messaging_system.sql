-- ==============================================================================
-- InternConnect AI - Production Real-Time Messaging System Database Migration
-- ==============================================================================

-- 1. Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recruiter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    internship_id UUID REFERENCES public.internships(id) ON DELETE SET NULL,
    conversation_type TEXT NOT NULL CHECK (conversation_type IN ('student_recruiter', 'student_admin', 'recruiter_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup by role IDs
CREATE INDEX IF NOT EXISTS idx_conversations_student_id ON public.conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_recruiter_id ON public.conversations(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_conversations_admin_id ON public.conversations(admin_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);

-- 2. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('student', 'company', 'admin')),
    message TEXT NOT NULL,
    attachment_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast message retrieval
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at ASC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for conversations
CREATE POLICY "Students can view their own conversations"
    ON public.conversations FOR SELECT
    USING (auth.uid() = student_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Recruiters can view their company conversations"
    ON public.conversations FOR SELECT
    USING (auth.uid() = recruiter_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Users can create conversations they participate in"
    ON public.conversations FOR INSERT
    WITH CHECK (auth.uid() = student_id OR auth.uid() = recruiter_id OR auth.uid() = admin_id);

-- 5. RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations"
    ON public.messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = messages.conversation_id
              AND (c.student_id = auth.uid() OR c.recruiter_id = auth.uid() OR c.admin_id = auth.uid())
        )
        OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );

CREATE POLICY "Users can send messages in their conversations"
    ON public.messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- 6. Enable Supabase Realtime for conversations & messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
