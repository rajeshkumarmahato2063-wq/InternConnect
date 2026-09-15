import { supabase } from './supabaseClient';

/**
 * Calculate dynamic profile completion percentage (0-100%)
 */
export const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;

  let score = 0;
  if (profile.full_name) score += 15;
  if (profile.phone) score += 10;
  if (profile.college) score += 15;
  if (profile.degree) score += 15;
  if (profile.graduation_year) score += 10;
  if (profile.skills && profile.skills.length > 0) score += 15;
  if (profile.github) score += 10;
  if (profile.linkedin) score += 10;
  if (profile.portfolio) score += 0;

  return Math.min(100, score);
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

      // Clean initial profile using user metadata or empty values
      const initialProfile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || user.name || '',
        phone: user.phone || '',
        college: user.user_metadata?.college || '',
        degree: user.user_metadata?.degree || '',
        graduation_year: user.user_metadata?.graduation_year || 2026,
        skills: user.user_metadata?.skills || [],
        github: '',
        linkedin: '',
        portfolio: '',
        avatar_url: user.user_metadata?.avatar_url || '',
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
