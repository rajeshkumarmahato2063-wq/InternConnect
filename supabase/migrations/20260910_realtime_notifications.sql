-- SQL Migration for Supabase Realtime Notification System
-- Table: notifications & Automated Database Triggers

-- 1. Create notifications table if not exists
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- 'application_submitted', 'shortlisted', 'interview_scheduled', 'offer_received', 'new_internship'
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() = user_id OR true); -- Allow system/trigger insertion

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

-- 3. Enable Supabase Realtime for notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- -------------------------------------------------------------
-- AUTOMATED TRIGGERS & NOTIFICATION FUNCTIONS
-- -------------------------------------------------------------

-- A. Trigger Function for Applications (Submitted, Shortlisted, Selected Offer)
CREATE OR REPLACE FUNCTION public.notify_on_application_change()
RETURNS TRIGGER AS $$
DECLARE
  job_title TEXT;
BEGIN
  -- Fetch job title
  SELECT title INTO job_title FROM public.internships WHERE id = NEW.internship_id;
  IF job_title IS NULL THEN
    job_title := 'Internship Position';
  END IF;

  -- 1. Application Submitted (INSERT)
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.student_id,
      'Application Submitted Successfully 🚀',
      'Your application for ' || job_title || ' has been successfully submitted.',
      'application_submitted'
    );
  
  -- 2. Application Status Updated (UPDATE)
  ELSIF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    IF (NEW.status = 'Shortlisted') THEN
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        NEW.student_id,
        'Congratulations! You were Shortlisted 🎉',
        'You have been shortlisted for the ' || job_title || ' position.',
        'shortlisted'
      );
    ELSIF (NEW.status = 'Selected') THEN
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        NEW.student_id,
        'Official Offer Received! 🏆',
        'Congratulations! You have received an official internship offer for ' || job_title || '.',
        'offer_received'
      );
    ELSIF (NEW.status = 'Interview Scheduled') THEN
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        NEW.student_id,
        'Interview Scheduled 📅',
        'An interview has been scheduled for your application to ' || job_title || '.',
        'interview_scheduled'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to applications table
DROP TRIGGER IF EXISTS trigger_notify_on_application ON public.applications;
CREATE TRIGGER trigger_notify_on_application
AFTER INSERT OR UPDATE ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.notify_on_application_change();

-- B. Trigger Function for Interview Scheduled (INSERT on interviews table)
CREATE OR REPLACE FUNCTION public.notify_on_interview_scheduled()
RETURNS TRIGGER AS $$
DECLARE
  job_title TEXT;
BEGIN
  SELECT title INTO job_title FROM public.internships WHERE id = NEW.internship_id;
  IF job_title IS NULL THEN
    job_title := 'Internship Position';
  END IF;

  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    NEW.student_id,
    'New Interview Invitation 🎙️',
    'Interview scheduled on ' || NEW.interview_date || ' at ' || NEW.interview_time || ' for ' || job_title || '.',
    'interview_scheduled'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to interviews table
DROP TRIGGER IF EXISTS trigger_notify_on_interview ON public.interviews;
CREATE TRIGGER trigger_notify_on_interview
AFTER INSERT ON public.interviews
FOR EACH ROW EXECUTE FUNCTION public.notify_on_interview_scheduled();

-- C. Trigger Function for New Matching Internship (INSERT on internships table)
CREATE OR REPLACE FUNCTION public.notify_students_on_new_internship()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify active students about new internship opportunity
  INSERT INTO public.notifications (user_id, title, message, type)
  SELECT
    p.id,
    'New Internship Opportunity Alert ⚡',
    'A new internship for "' || NEW.title || '" has just been posted!',
    'new_internship'
  FROM public.profiles p
  WHERE p.role = 'student'
  LIMIT 50;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to internships table
DROP TRIGGER IF EXISTS trigger_notify_on_new_internship ON public.internships;
CREATE TRIGGER trigger_notify_on_new_internship
AFTER INSERT ON public.internships
FOR EACH ROW EXECUTE FUNCTION public.notify_students_on_new_internship();
