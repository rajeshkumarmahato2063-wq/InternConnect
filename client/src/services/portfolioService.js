import { supabase } from './supabaseClient';
import { MOCK_USERS } from './mockData';

export const portfolioService = {
  // Fetch all projects for a specific student
  getProjects: async (studentId) => {
    if (!studentId) return [];

    try {
      const { data, error } = await supabase
        .from('student_projects')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          technologies: p.technologies || [],
          githubUrl: p.github_url,
          liveUrl: p.live_url,
          imageUrl: p.image_url,
          createdAt: p.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch projects fallback:', err.message);
    }

    // Local Storage Fallback Cache
    const cacheKey = `ic_projects_${studentId}`;
    const cached = localStorage.getItem(cacheKey);
    return cached
      ? JSON.parse(cached)
      : [
          {
            id: 'proj_1',
            title: 'InternConnect AI Career Platform',
            description:
              'Full-stack AI-powered recruitment engine featuring real-time candidate ranking, Gemini resume scoring, and live notifications.',
            technologies: ['React', 'Node.js', 'Supabase', 'Tailwind CSS', 'Gemini API'],
            githubUrl: 'https://github.com/aarav-sharma/internconnect-ai',
            liveUrl: 'https://internconnect-ai.vercel.app',
            imageUrl:
              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
          },
          {
            id: 'proj_2',
            title: 'Cloud Metrics Microservices Dashboard',
            description:
              'Distributed system performance monitor tracking API latency, Docker container CPU usage, and automated alert dispatching.',
            technologies: ['React', 'TypeScript', 'Docker', 'Express', 'Redis'],
            githubUrl: 'https://github.com/aarav-sharma/cloud-metrics',
            liveUrl: 'https://metrics-demo.dev',
            imageUrl:
              'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          },
        ];
  },

  // Add a new project
  addProject: async (studentId, projectData) => {
    const payload = {
      student_id: studentId,
      title: projectData.title,
      description: projectData.description,
      technologies: projectData.technologies || [],
      github_url: projectData.githubUrl,
      live_url: projectData.liveUrl,
      image_url:
        projectData.imageUrl ||
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    };

    try {
      const { data, error } = await supabase
        .from('student_projects')
        .insert([payload])
        .select('*')
        .single();

      if (!error && data) {
        return {
          id: data.id,
          title: data.title,
          description: data.description,
          technologies: data.technologies || [],
          githubUrl: data.github_url,
          liveUrl: data.live_url,
          imageUrl: data.image_url,
        };
      }
    } catch (err) {
      console.warn('Supabase add project fallback:', err.message);
    }

    const newProj = { id: `proj_${Date.now()}`, ...projectData };
    const cacheKey = `ic_projects_${studentId}`;
    const existing = JSON.parse(localStorage.getItem(cacheKey) || '[]');
    existing.unshift(newProj);
    localStorage.setItem(cacheKey, JSON.stringify(existing));
    return newProj;
  },

  // Delete project
  deleteProject: async (studentId, projectId) => {
    try {
      await supabase.from('student_projects').delete().eq('id', projectId);
    } catch (err) {
      console.warn('Supabase delete project exception:', err.message);
    }

    const cacheKey = `ic_projects_${studentId}`;
    const existing = JSON.parse(localStorage.getItem(cacheKey) || '[]');
    const updated = existing.filter((p) => p.id !== projectId);
    localStorage.setItem(cacheKey, JSON.stringify(updated));
    return true;
  },

  // Fetch full portfolio profile data for public viewing
  getPublicPortfolio: async (username) => {
    const defaultStudent = MOCK_USERS[0];
    const projects = await portfolioService.getProjects(defaultStudent.id);

    return {
      username: username || 'aarav-sharma',
      fullName: defaultStudent.name,
      degree: defaultStudent.degree,
      college: defaultStudent.college,
      graduationYear: defaultStudent.graduationYear,
      avatar: defaultStudent.avatar,
      bio: 'Full Stack Software Engineer specializing in modern Web Architecture, AI Integrations, and Scalable Cloud Systems. Passionate about open-source code and product engineering.',
      skills: defaultStudent.skills || ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Git', 'Tailwind CSS', 'Supabase', 'Python'],
      github: defaultStudent.github || 'https://github.com/aarav-sharma',
      linkedin: defaultStudent.linkedin || 'https://linkedin.com/in/aarav-sharma',
      portfolio: defaultStudent.portfolio || 'https://aaravsharma.dev',
      email: defaultStudent.email || 'aarav.sharma@example.com',
      projects,
      certificates: [
        {
          id: 'cert_1',
          title: 'Meta Full-End Developer Specialization',
          issuer: 'Coursera / Meta',
          issueDate: 'August 2025',
          credentialId: 'META-FE-98402',
        },
        {
          id: 'cert_2',
          title: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          issueDate: 'January 2026',
          credentialId: 'AWS-CP-771029',
        },
      ],
    };
  },
};
