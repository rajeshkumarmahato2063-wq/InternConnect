import { supabase } from './supabaseClient';

/**
 * Calculate dynamic profile completion percentage (0-100%)
 */
export const calculateProfileCompletion = (profile) => {
  if (!profile) return 30;

  let score = 0;
  if (profile.full_name) score += 10;
  if (profile.phone) score += 10;
  if (profile.college) score += 15;
  if (profile.degree) score += 15;
  if (profile.graduation_year) score += 10;
  if (profile.skills && profile.skills.length > 0) score += 15;
  if (profile.github) score += 10;
  if (profile.linkedin) score += 10;
  if (profile.portfolio) score += 5;

  return Math.min(100, Math.max(20, score));
};

export const profileService = {
  /**
   * Fetch user profile from Supabase 'profiles' table
   */
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Supabase fetch profile warning:', error.message);
      }

      return data || null;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  },

  /**
   * Ensure a profile row exists for the user in Supabase
   */
  ensureProfileExists: async (user) => {
    if (!user || !user.id) return null;

    try {
      const existing = await profileService.getProfile(user.id);
      if (existing) return existing;

      const initialProfile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.name || 'Aarav Sharma',
        phone: user.phone || '+91 98765 43210',
        college: 'IIT Delhi',
        degree: 'B.Tech in Computer Science',
        graduation_year: 2025,
        skills: ['React.js', 'Node.js', 'Python', 'TypeScript', 'Tailwind CSS'],
        github: 'https://github.com/aarav-sharma',
        linkedin: 'https://linkedin.com/in/aarav-sharma',
        portfolio: 'https://aaravsharma.dev',
        avatar_url:
          user.user_metadata?.avatar_url ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([initialProfile])
        .select()
        .single();

      if (error) {
        console.warn('Supabase profile auto-insert fallback:', error.message);
        return initialProfile;
      }

      return data;
    } catch (err) {
      console.error('Error ensuring profile exists:', err);
      return null;
    }
  },

  /**
   * Update profile fields in Supabase
   */
  updateProfile: async (userId, profileData) => {
    try {
      const updatedFields = {
        ...profileData,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...updatedFields })
        .select()
        .single();

      if (error) {
        console.warn('Supabase update profile fallback:', error.message);
        return updatedFields;
      }

      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      return profileData;
    }
  },
};
