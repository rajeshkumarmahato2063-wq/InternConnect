import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://tcnrbgaomnqiqveeljfb.supabase.co';
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbnJiZ2FvbW5xaXF2ZWVsamZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5NjIxNTMsImV4cCI6MjEwNDUzODE1M30.U7tLhrrwBYbEgbtdHYWENQqhmFTRdsz2gAV17FfMxPU';

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);
