import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '' : 'http://localhost:5000');
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const copilotService = {
  // Load conversation history for current user from Supabase ai_conversations table
  getHistory: async (userId) => {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(20);

      if (error || !data) return [];

      const formatted = [];
      data.forEach((row) => {
        formatted.push({
          id: `${row.id}_user`,
          sender: 'user',
          text: row.message,
          timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        formatted.push({
          id: `${row.id}_ai`,
          sender: 'ai',
          text: row.reply,
          timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      });

      return formatted;
    } catch (err) {
      console.warn('Supabase fetch history warning:', err.message);
      return [];
    }
  },

  // Load user context memory (skills, college, saved jobs, recent applications)
  getUserContextMemory: async (userId, userRole = 'student') => {
    if (!userId) return { name: '', skills: [], college: '' };
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      let savedJobs = [];
      let applications = [];

      if (userRole === 'student') {
        const [savedRes, appRes] = await Promise.all([
          supabase.from('saved_jobs').select('*, internship:internships(*)').eq('student_id', userId),
          supabase.from('applications').select('*, internship:internships(*)').eq('student_id', userId),
        ]);

        savedJobs = (savedRes.data || []).map((s) => s.internship?.title).filter(Boolean);
        applications = (appRes.data || []).map((a) => a.internship?.title).filter(Boolean);
      }

      return {
        name: profile?.full_name || '',
        college: profile?.college || '',
        degree: profile?.degree || '',
        skills: Array.isArray(profile?.skills) ? profile.skills : [],
        companyName: profile?.company_name || '',
        savedJobs,
        applications,
      };
    } catch (err) {
      console.warn('User context memory fetch warning:', err.message);
      return { name: '', skills: [], college: '' };
    }
  },

  // Send message to Gemini AI Copilot (via Supabase Edge function or backend API) & persist into Supabase
  sendMessage: async ({ userId, userRole = 'student', message, history = [] }) => {
    let reply = '';
    let lastErr = null;

    const userContext = await copilotService.getUserContextMemory(userId, userRole);
    const last10History = (history || []).slice(-10);

    // 1. Primary: Try Supabase Edge Function ai-copilot
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const edgeRes = await fetch(`${SUPABASE_URL}/functions/v1/ai-copilot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'apikey': SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({
            message,
            userMessage: message,
            userRole,
            userContext,
            conversationHistory: last10History,
          }),
        });

        if (edgeRes.ok) {
          const edgeData = await edgeRes.json();
          if (edgeData.reply || edgeData.text) {
            reply = edgeData.reply || edgeData.text;
          }
        } else {
          const errData = await edgeRes.json().catch(() => ({}));
          console.warn('Supabase Edge function ai-copilot warning:', errData.error || edgeRes.statusText);
        }
      } catch (edgeErr) {
        console.warn('Supabase Edge function fetch exception:', edgeErr.message);
        lastErr = edgeErr;
      }
    }

    // 2. Secondary: Call Express Backend /api/ai/copilot or /api/ai/chat
    if (!reply) {
      try {
        const backRes = await fetch(`${API_BASE_URL}/api/ai/copilot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            userMessage: message,
            userRole,
            studentName: userContext?.name || 'Candidate',
            studentSkills: userContext?.skills || [],
            conversationHistory: last10History,
          }),
        });

        if (backRes.ok) {
          const json = await backRes.json();
          if (json.reply || json.text) {
            reply = json.reply || json.text;
          }
        } else {
          const errJson = await backRes.json().catch(() => ({}));
          lastErr = new Error(errJson.error || errJson.message || `Backend status ${backRes.status}`);
        }
      } catch (backErr) {
        console.warn('Backend copilot API exception:', backErr.message);
        lastErr = backErr;
      }
    }

    // 3. Fallback: Direct backend Gemini chat route /api/ai/chat
    if (!reply) {
      try {
        const chatRes = await fetch(`${API_BASE_URL}/api/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });

        if (chatRes.ok) {
          const data = await chatRes.json();
          if (data.reply || data.text) {
            reply = data.reply || data.text;
          }
        } else {
          const errData = await chatRes.json().catch(() => ({}));
          lastErr = new Error(errData.error || errData.message || `HTTP ${chatRes.status}`);
        }
      } catch (apiErr) {
        lastErr = apiErr;
      }
    }

    if (!reply) {
      throw lastErr || new Error('Gemini API is currently unreachable. Please verify your GEMINI_API_KEY environment variable or network connection.');
    }

    // Persist conversation into Supabase ai_conversations table
    if (userId && reply) {
      try {
        await supabase.from('ai_conversations').insert({
          user_id: userId,
          role: userRole,
          message,
          reply,
        });
      } catch (dbErr) {
        console.warn('Could not persist ai_conversations to Supabase:', dbErr.message);
      }
    }

    return reply;
  },

  // Clear chat history for user
  clearHistory: async (userId) => {
    if (!userId) return;
    try {
      await supabase.from('ai_conversations').delete().eq('user_id', userId);
    } catch (err) {
      console.warn('Error clearing ai_conversations:', err.message);
    }
  },
};
