-- SQL Migration for Company Verification System
-- Alter profiles table with verification fields & indexes

-- 1. Add verification fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'Approved', 'Rejected')),
ADD COLUMN IF NOT EXISTS verification_documents JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;

-- 2. Create index for fast status queries
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status 
ON public.profiles (verification_status);

-- 3. Update existing company profiles to default status if null
UPDATE public.profiles 
SET verification_status = 'Pending' 
WHERE verification_status IS NULL AND role = 'company';

-- 4. Enable Supabase Realtime for profiles update notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- 5. Trigger Function to automatically send notification on company verification status update
CREATE OR REPLACE FUNCTION public.notify_company_on_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.verification_status IS DISTINCT FROM NEW.verification_status) THEN
    IF (NEW.verification_status = 'Approved') THEN
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        NEW.id,
        'Employer Verification Approved 🎉',
        'Congratulations! Your company account has been verified. Your job posts now feature the Verified Employer badge.',
        'shortlisted'
      );
    ELSIF (NEW.verification_status = 'Rejected') THEN
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        NEW.id,
        'Verification Request Update ⚠️',
        'Your verification documents require review. Please update your registration documents in Company Profile.',
        'info'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger
DROP TRIGGER IF EXISTS trigger_notify_company_verification ON public.profiles;
CREATE TRIGGER trigger_notify_company_verification
AFTER UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.notify_company_on_verification();
