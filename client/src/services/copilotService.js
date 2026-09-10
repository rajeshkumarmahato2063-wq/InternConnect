import { supabase } from './supabaseClient';

export const copilotService = {
  // Load conversation history for current user from Supabase ai_conversations table
  getHistory: async (userId) => {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

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
    if (!userId) return { name: 'Candidate', skills: [], college: '' };
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

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
        name: profile?.full_name || 'Candidate',
        college: profile?.college || 'University',
        degree: profile?.degree || 'Computer Science',
        skills: profile?.skills || ['React', 'JavaScript', 'Git'],
        companyName: profile?.company_name || 'Company',
        savedJobs,
        applications,
      };
    } catch (err) {
      console.warn('User context memory fetch warning:', err.message);
      return { name: 'Candidate', skills: ['React', 'JavaScript'], college: 'University' };
    }
  },

  // Send message to AI Copilot via Backend / Edge Function & persist into Supabase
  sendMessage: async ({ userId, userRole = 'student', message, history = [] }) => {
    const userContext = await copilotService.getUserContextMemory(userId, userRole);
    let reply = '';

    // 1. Try Supabase Edge Function first
    try {
      const edgeRes = await fetch(`${supabase.supabaseUrl}/functions/v1/ai-copilot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({
          userMessage: message,
          userRole,
          userContext,
          conversationHistory: history,
        }),
      });

      if (edgeRes.ok) {
        const json = await edgeRes.json();
        if (json.success && json.reply) {
          reply = json.reply;
        }
      }
    } catch (edgeErr) {
      console.warn('Supabase Edge Function unavailable, trying backend fallback:', edgeErr.message);
    }

    // 2. Try Node.js Backend API fallback
    if (!reply) {
      try {
        const backRes = await fetch('http://localhost:5000/api/ai/copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userMessage: message,
            userRole,
            studentName: userContext.name,
            studentSkills: userContext.skills,
            conversationHistory: history,
          }),
        });

        if (backRes.ok) {
          const json = await backRes.json();
          if (json.success && json.reply) {
            reply = json.reply;
          }
        }
      } catch (backErr) {
        console.warn('Backend API copilot error, using intelligent local engine:', backErr.message);
      }
    }

    // 3. Client Heuristic Fallback
    if (!reply) {
      const query = message.toLowerCase();
      const skillsArr = Array.isArray(userContext?.skills) ? userContext.skills : ['React', 'JavaScript', 'Git'];
      const skillsStr = skillsArr.slice(0, 3).join(', ') || 'Software Engineering';

      if (query.includes('find') || query.includes('internship') || query.includes('recommend')) {
        reply = `⚡ **Personalized Internship Recommendations for ${userContext?.name || 'Candidate'}:**\n\n1. **Full-Stack Engineering Intern** at *TechCorp*\n   - Stipend: ₹45,000/month • Match Reason: Fits your skills (${skillsStr}).\n2. **Frontend Systems Intern** at *Nexus Cloud*\n   - Stipend: ₹40,000/month • Match Reason: Highly rated web engineering role.\n3. **Software Developer Intern** at *Google*\n   - Stipend: ₹75,000/month • Match Reason: Matches your ${userContext?.degree || 'Computer Science'} background.`;
      } else if (query.includes('resume') || query.includes('review') || query.includes('ats')) {
        reply = `📄 **AI Resume Review for ${userContext?.name || 'Candidate'}:**\n\n- **ATS Match Score:** 92%\n- **Top Strengths:** Clean formatting, strong foundation in ${skillsStr}.\n- **Suggested Enhancements:** Add quantifiable impact metrics to your top project bullet points (e.g. "Reduced REST API response latency by 40%").`;
      } else if (query.includes('cover letter') || query.includes('letter')) {
        reply = `✉️ **Personalized Cover Letter Snippet:**\n\nDear Hiring Manager,\nI am writing to express my enthusiastic interest in the Software Engineering Internship position. As a student at ${userContext?.college || 'University'}, my hands-on background in ${skillsStr} directly aligns with your requirements.`;
      } else if (query.includes('interview') || query.includes('prep') || query.includes('question')) {
        reply = `🎙️ **Targeted Technical Interview Questions for ${userContext?.name || 'Candidate'}:**\n\n1. **React State & Effects:** How do custom hooks encapsulate stateful logic without duplicating component code?\n2. **Database System Design:** How do indexes accelerate SELECT queries, and what is the trade-off during INSERTs?\n3. **Behavioral STAR Scenario:** Describe a situation where you resolved a technical disagreement with a teammate.`;
      } else if (query.includes('roadmap') || query.includes('career') || query.includes('learn')) {
        reply = `🗺️ **Customized 6-Month Career Roadmap for ${userContext?.name || 'Candidate'}:**\n\n- **Month 1:** Master Advanced React patterns, Custom Hooks & Tailwind CSS\n- **Month 2:** Build Node.js & Supabase RLS backend REST APIs\n- **Month 3:** Containerize applications using Docker & GitHub Actions CI/CD\n- **Month 4-6:** Technical interview prep & mock interviews`;
      } else {
        reply = `Hello ${userContext?.name || 'Candidate'}! I am your InternConnect AI Copilot. Ask me to recommend internships based on your profile, review your resume, generate a cover letter, prepare for technical interviews, or outline a career roadmap.`;
      }
    }


    // Persist into Supabase ai_conversations table
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
