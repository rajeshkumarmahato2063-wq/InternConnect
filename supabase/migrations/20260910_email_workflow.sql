-- SQL Migration for Email Verification, Password Reset, Offer Emails & Logs
-- Table: email_logs & Profiles column extension

-- 1. Create email_logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email_type VARCHAR(50) NOT NULL, -- 'verify_email', 'password_reset', 'interview_invite', 'offer_letter', 'welcome', 'status_update'
  recipient VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'Sent' CHECK (status IN ('Sent', 'Failed', 'Pending')),
  metadata JSONB DEFAULT '{}'::jsonb,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add email_preferences to profiles table if not exists
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email_preferences JSONB DEFAULT '{"internship_alerts": true, "interview_reminders": true, "marketing_emails": false, "weekly_recommendations": true}'::jsonb,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email logs"
ON public.email_logs FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert email logs"
ON public.email_logs FOR INSERT
WITH CHECK (true);

-- 4. Enable Supabase Realtime for email_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.email_logs;
