// AI Engine Service for InternConnect AI

export const aiService = {
  // 1. AI Resume Score Analyzer
  analyzeResume: async (skillsList = [], expCount = 1) => {
    // Simulate AI processing delay
    await new Promise((res) => setTimeout(res, 800));

    const totalSkills = skillsList.length;
    let score = Math.min(95, 60 + totalSkills * 4 + expCount * 5);
    if (score < 70) score = 75;

    return {
      score,
      strengths: [
        'Strong technical stack alignment for Modern Web Engineering.',
        'Clear educational metrics from a recognized institution.',
        'Proper formatting of GitHub and LinkedIn project proof links.',
      ],
      weaknesses: [
        'Limited quantitative impact metrics (e.g., % performance improvement).',
        'Could include 1-2 cloud deployment certifications (AWS/GCP).',
      ],
      suggestions: [
        'Add metric-driven bullet points (e.g., "Optimized React app load time by 35%").',
        'Incorporate DevOps skills like Docker containerization and CI/CD pipelines.',
        'Highlight open-source GitHub contributions in your top project descriptions.',
      ],
    };
  },

  // 2. AI Career Roadmap Generator
  generateRoadmap: async (careerGoal = 'Full Stack Developer') => {
    await new Promise((res) => setTimeout(res, 600));

    return {
      goal: careerGoal,
      durationMonths: 6,
      timeline: [
        {
          month: 'Month 1',
          title: 'Advanced JavaScript & Modern React Architecture',
          skills: ['ES6+ Async/Await', 'React Hooks', 'State Management (Zustand/Redux)', 'Tailwind CSS'],
          project: 'Build a complex SaaS Dashboard with dark mode and filterable tables.',
          certification: 'Meta Front-End Developer Specialization',
        },
        {
          month: 'Month 2',
          title: 'Backend Systems & API Design',
          skills: ['Node.js', 'Express.js', 'REST API Architecture', 'JWT Authentication', 'PostgreSQL / MongoDB'],
          project: 'Develop a RESTful API service with role-based middleware & rate limiting.',
          certification: 'Node.js Application Development (LF)',
        },
        {
          month: 'Month 3',
          title: 'Cloud Deployment & Microservices',
          skills: ['Docker Containerization', 'AWS S3 & EC2', 'GitHub Actions CI/CD', 'Serverless Functions'],
          project: 'Containerize web apps and deploy to AWS with automated GitHub testing.',
          certification: 'AWS Certified Cloud Practitioner',
        },
        {
          month: 'Month 4',
          title: 'AI Integration & Performance Tuning',
          skills: ['OpenAI API / LLM Prompting', 'Redis Caching', 'Webpack/Vite Optimization', 'Web Vitals'],
          project: 'Integrate AI resume recommendation algorithms into a full-stack job platform.',
          certification: 'DeepLearning.AI Generative AI Fundamentals',
        },
        {
          month: 'Month 5 & 6',
          title: 'Mock Interviews & Campus Placement Sprints',
          skills: ['Data Structures & Algorithms', 'System Design Fundamentals', 'Behavioral STAR Method'],
          project: 'Complete 30 LeetCode Medium challenges & 5 simulated technical interviews.',
          certification: 'InternConnect AI Verified Candidate Certification',
        },
      ],
    };
  },

  // 3. AI Match Engine Recommendation
  calculateJobMatch: async (userSkills = [], jobSkills = []) => {
    const matching = userSkills.filter((s) =>
      jobSkills.some((js) => js.toLowerCase() === s.toLowerCase())
    );
    const missing = jobSkills.filter(
      (js) => !userSkills.some((s) => s.toLowerCase() === js.toLowerCase())
    );

    const matchScore = Math.round((matching.length / Math.max(jobSkills.length, 1)) * 100);

    return {
      matchPercentage: Math.max(matchScore, 75),
      matchingSkills: matching.length > 0 ? matching : ['JavaScript', 'HTML/CSS'],
      missingSkills: missing,
      recommendedCourses: missing.map(
        (sk) => `Mastering ${sk} for Enterprise Production (Coursera / Udemy)`
      ),
    };
  },

  // 4. AI Interview Coach Response Feedback
  generateInterviewQuestion: async (category = 'Technical') => {
    await new Promise((res) => setTimeout(res, 400));

    const questions = {
      Technical: {
        question: 'Explain how React’s Virtual DOM reconciliation process works and how `useMemo` optimizes performance.',
        hint: 'Mention diffing algorithm, Fiber tree, render phase vs commit phase, and memoization dependencies.',
      },
      HR: {
        question: 'Tell me about a time you faced a difficult conflict in a team project and how you resolved it.',
        hint: 'Use the STAR method (Situation, Task, Action, Result) with quantitative outcomes.',
      },
      Coding: {
        question: 'Write a function to detect if a linked list contains a cycle using Floyd’s Fast and Slow pointers.',
        hint: 'Initialize slow and fast pointers at head; move slow by 1 step and fast by 2 steps until they meet.',
      },
    };

    return questions[category] || questions.Technical;
  },

  evaluateInterviewAnswer: async (answer) => {
    await new Promise((res) => setTimeout(res, 700));

    if (answer.length < 30) {
      return {
        score: 60,
        feedback: 'Your response is too brief. Try elaborating on technical trade-offs and providing concrete examples.',
      };
    }

    return {
      score: 92,
      feedback: 'Excellent response! You clearly demonstrated technical depth, accurate architectural terms, and structured logic.',
      suggestedRefinement: 'Consider highlighting how you test this solution with unit test assertions.',
    };
  },

  // 5. AI Career Chatbot Response
  askChatbot: async (userMessage) => {
    await new Promise((res) => setTimeout(res, 500));

    const msg = userMessage.toLowerCase();

    if (msg.includes('resume')) {
      return 'To optimize your resume for ATS screening, ensure you use clean single-column layouts, include explicit tech stack keywords (e.g. React, Node.js, AWS), and quantify your results with percentages!';
    }
    if (msg.includes('interview')) {
      return 'When preparing for technical interviews, focus on 3 pillars: Data Structures (Arrays, Trees, Graphs), System Design basics (REST, Caching, Databases), and the STAR behavioral technique.';
    }
    if (msg.includes('stipend') || msg.includes('salary')) {
      return 'Top tech companies offer competitive stipends ranging from ₹40,000 to ₹95,000/month for software engineering interns. High performers often receive Full-Time PPOs (Pre-Placement Offers)!';
    }

    return 'I am your InternConnect AI Career Assistant! Ask me anything about resume building, interview preparation, career roadmaps, or landing top internships.';
  },
};
