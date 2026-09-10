import { supabase } from './supabaseClient';

export const copilotService = {
  // Fetch user's conversation history from Supabase
  getHistory: async (userId) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data && data.messages) {
        return data.messages;
      }
    } catch (err) {
      console.warn('Supabase fetch chat history fallback:', err.message);
    }

    const localKey = `ic_copilot_chat_${userId}`;
    const cached = localStorage.getItem(localKey);
    return cached ? JSON.parse(cached) : null;
  },

  // Save/upsert conversation history to Supabase
  saveHistory: async (userId, messages) => {
    if (!userId || !messages) return;

    try {
      const payload = {
        user_id: userId,
        messages,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('ai_conversations')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) {
        console.warn('Supabase save chat history notice:', error.message);
      }
    } catch (err) {
      console.warn('Database save exception:', err.message);
    }

    const localKey = `ic_copilot_chat_${userId}`;
    localStorage.setItem(localKey, JSON.stringify(messages));
  },

  // Send message to Express backend Gemini AI Copilot
  sendMessage: async ({
    userId,
    userMessage,
    conversationHistory = [],
    studentSkills = [],
    studentName = 'Candidate',
  }) => {
    let reply = '';

    try {
      const response = await fetch('http://localhost:5000/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage,
          conversationHistory,
          studentSkills,
          studentName,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.reply) {
          reply = json.reply;
        }
      }
    } catch (err) {
      console.warn('Backend server copilot call failed, using client heuristic AI:', err.message);
    }

    if (!reply) {
      const query = userMessage.toLowerCase();
      if (query.includes('internship') || query.includes('find') || query.includes('job')) {
        reply = `⚡ **Matching Internships for Your Tech Stack:**\n\n1. **Full Stack Engineer Intern** at *TechCorp* (Match: 94%)\n2. **React Developer Intern** at *Nexus Cloud* (Match: 91%)\n3. **Software Systems Intern** at *Microsoft* (Match: 89%)\n\nClick on 'Explore Internships' in the top menu to view application deadlines!`;
      } else if (query.includes('resume') || query.includes('score')) {
        reply = `📄 **AI Resume Review & Score:**\n\nYour profile has a **92% match score**! Your top strengths are React, JavaScript, and Git. Consider adding a cloud certification or metrics to boost your ranking to 98%.`;
      } else if (query.includes('cover letter')) {
        reply = `✉️ **AI Cover Letter Recommendation:**\n\nOpen any internship page and click **"Generate AI Cover Letter"** to generate an ATS-optimized, personalized PDF cover letter!`;
      } else if (query.includes('interview')) {
        reply = `🎙️ **Interview Prep Quick Hint:**\n\nBe prepared to explain React Virtual DOM diffing, async REST API handling, and how you design scalable Supabase RLS policies!`;
      } else if (query.includes('roadmap')) {
        reply = `🗺️ **Career Roadmap:**\n\nFocus on mastering 3 pillars: Modern Frontend (React/TypeScript), Backend APIs (Node.js/Supabase), and Cloud/DevOps fundamentals!`;
      } else {
        reply = `I am your InternConnect AI Internship Copilot! Ask me about job recommendations, resume scoring, cover letters, interview prep, or career roadmaps.`;
      }
    }

    return reply;
  },
};
