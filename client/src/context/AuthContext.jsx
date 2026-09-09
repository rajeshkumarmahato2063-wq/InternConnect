import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { profileService, calculateProfileCompletion } from '../services/profileService';
import { MOCK_USERS, MOCK_APPLICATIONS } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ic_jwt_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ic_user_info');
    return saved ? JSON.parse(saved) : MOCK_USERS[0];
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [savedJobs, setSavedJobs] = useState(['job_1', 'job_5']);
  const [applications, setApplications] = useState(MOCK_APPLICATIONS);

  // Initialize Supabase Auth session listener
  useEffect(() => {
    // 1. Check current active session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      if (activeSession) {
        setToken(activeSession.access_token);
        fetchAndSetProfile(activeSession.user);
      }
      setLoading(false);
    });

    // 2. Listen for Auth State Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      if (currentSession) {
        setToken(currentSession.access_token);
        fetchAndSetProfile(currentSession.user);
      } else {
        // Retain current dev fallback user if no active Supabase session
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAndSetProfile = async (authUser) => {
    const userProfile = await profileService.ensureProfileExists(authUser);
    if (userProfile) {
      setProfile(userProfile);
      const completion = calculateProfileCompletion(userProfile);
      const updatedUser = {
        id: authUser.id,
        name: userProfile.full_name || 'Aarav Sharma',
        email: authUser.email || 'aarav.sharma@example.com',
        role: 'student',
        college: userProfile.college,
        degree: userProfile.degree,
        graduationYear: userProfile.graduation_year,
        skills: userProfile.skills || [],
        github: userProfile.github,
        linkedin: userProfile.linkedin,
        portfolio: userProfile.portfolio,
        avatar: userProfile.avatar_url,
        profileCompletion: completion,
      };
      setUser(updatedUser);
      localStorage.setItem('ic_user_info', JSON.stringify(updatedUser));
    }
  };

  const isAuthenticated = Boolean(token || session || user);
  const currentRole = user?.role || 'student';

  // Login handler
  const login = async ({ email, password, role = 'student' }) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.session) {
        setSession(data.session);
        setToken(data.session.access_token);
        await fetchAndSetProfile(data.user);
        setLoading(false);
        return { token: data.session.access_token, user: data.user };
      }
    } catch (err) {
      console.warn('Supabase login fallback:', err.message);
    }

    // Fallback simulated login
    await new Promise((resolve) => setTimeout(resolve, 500));
    const authenticatedUser = {
      ...MOCK_USERS[0],
      email,
      role,
    };
    const simulatedJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulatedToken`;
    setToken(simulatedJwt);
    setUser(authenticatedUser);
    localStorage.setItem('ic_jwt_token', simulatedJwt);
    localStorage.setItem('ic_user_info', JSON.stringify(authenticatedUser));
    setLoading(false);

    return { token: simulatedJwt, user: authenticatedUser };
  };

  // Register handler
  const register = async (userData, role = 'student') => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password || 'password123',
        options: {
          data: {
            full_name: userData.fullName || userData.name,
          },
        },
      });

      if (!error && data?.user) {
        await fetchAndSetProfile(data.user);
        setLoading(false);
        return { user: data.user };
      }
    } catch (err) {
      console.warn('Supabase register fallback:', err.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    const newUser = {
      id: `usr_${role}_${Date.now()}`,
      role,
      profileCompletion: 75,
      ...userData,
    };
    const simulatedJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulatedToken`;
    setToken(simulatedJwt);
    setUser(newUser);
    localStorage.setItem('ic_jwt_token', simulatedJwt);
    localStorage.setItem('ic_user_info', JSON.stringify(newUser));
    setLoading(false);

    return { token: simulatedJwt, user: newUser };
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setToken(null);
    setUser(null);
    setProfile(null);
    setSession(null);
    localStorage.removeItem('ic_jwt_token');
    localStorage.removeItem('ic_user_info');
  };

  const switchRole = (newRole) => {
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const isJobSaved = (jobId) => savedJobs.includes(jobId);

  const addApplication = (newApp) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const updateProfileData = async (updatedData) => {
    if (user?.id) {
      const result = await profileService.updateProfile(user.id, updatedData);
      const completion = calculateProfileCompletion({ ...profile, ...updatedData });
      const updatedUser = {
        ...user,
        name: updatedData.full_name || user.name,
        college: updatedData.college || user.college,
        degree: updatedData.degree || user.degree,
        graduationYear: updatedData.graduation_year || user.graduationYear,
        skills: updatedData.skills || user.skills,
        github: updatedData.github || user.github,
        linkedin: updatedData.linkedin || user.linkedin,
        portfolio: updatedData.portfolio || user.portfolio,
        avatar: updatedData.avatar_url || user.avatar,
        profileCompletion: completion,
      };
      setUser(updatedUser);
      setProfile(result);
      localStorage.setItem('ic_user_info', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        token,
        user,
        profile,
        role: currentRole,
        currentRole,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        switchRole,
        savedJobs,
        toggleSaveJob,
        isJobSaved,
        applications,
        addApplication,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
