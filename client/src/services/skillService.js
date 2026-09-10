import { supabase } from './supabaseClient';

export const DEFAULT_CATEGORIES = [
  { id: 'cat_js', name: 'JavaScript', icon: 'Code2', color: 'amber' },
  { id: 'cat_react', name: 'React', icon: 'Atom', color: 'cyan' },
  { id: 'cat_python', name: 'Python', icon: 'FileCode', color: 'emerald' },
  { id: 'cat_java', name: 'Java', icon: 'Coffee', color: 'orange' },
  { id: 'cat_sql', name: 'SQL', icon: 'Database', color: 'purple' },
  { id: 'cat_dsa', name: 'Data Structures', icon: 'GitBranch', color: 'indigo' },
];

export const SAMPLE_CHALLENGES = [
  {
    id: 'ch_js_1',
    skillId: 'cat_js',
    skillName: 'JavaScript',
    title: 'Modern ES6+ & Async JS Certification',
    description: 'Test your knowledge on Promises, Event Loop, Closures, Scopes, and ES6+ features.',
    difficulty: 'Medium',
    duration: 15,
    passingScore: 70,
    badgeName: '🏅 JavaScript Verified',
    questions: [
      {
        id: 'q_js_1',
        type: 'MCQ',
        question: 'Which method returns a promise that fulfills when all of the input promises have fulfilled?',
        options: ['Promise.race()', 'Promise.all()', 'Promise.any()', 'Promise.settled()'],
        correctAnswer: 'Promise.all()',
        marks: 10,
      },
      {
        id: 'q_js_2',
        type: 'MCQ',
        question: 'What is the output of typeof NaN in JavaScript?',
        options: ['"nan"', '"undefined"', '"number"', '"object"'],
        correctAnswer: '"number"',
        marks: 10,
      },
      {
        id: 'q_js_3',
        type: 'Coding',
        question: 'Write a function `reverseString(str)` that reverses a string without using built-in .reverse().',
        options: ['function reverseString(str) {\n  let res = "";\n  for (let i = str.length - 1; i >= 0; i--) res += str[i];\n  return res;\n}'],
        correctAnswer: 'function reverseString(str) { let res = ""; for (let i = str.length - 1; i >= 0; i--) res += str[i]; return res; }',
        marks: 20,
      },
    ],
  },
  {
    id: 'ch_react_1',
    skillId: 'cat_react',
    skillName: 'React',
    title: 'React Hooks & State Architecture',
    description: 'Evaluate your expertise in useEffect dependencies, custom hooks, and virtual DOM optimization.',
    difficulty: 'Medium',
    duration: 20,
    passingScore: 70,
    badgeName: '⚡ React Verified',
    questions: [
      {
        id: 'q_react_1',
        type: 'MCQ',
        question: 'When does the cleanup function of useEffect execute?',
        options: [
          'Only when component mounts',
          'Before the component unmounts and before re-running the effect on dependency change',
          'Only when state changes',
          'Never',
        ],
        correctAnswer: 'Before the component unmounts and before re-running the effect on dependency change',
        marks: 10,
      },
      {
        id: 'q_react_2',
        type: 'MCQ',
        question: 'What hook should be used to cache expensive calculation results across renders?',
        options: ['useCallback', 'useMemo', 'useRef', 'useContext'],
        correctAnswer: 'useMemo',
        marks: 10,
      },
    ],
  },
  {
    id: 'ch_sql_1',
    skillId: 'cat_sql',
    skillName: 'SQL',
    title: 'Database Queries & Complex Joins',
    description: 'Master INNER/LEFT joins, GROUP BY aggregations, window functions, and indexing.',
    difficulty: 'Hard',
    duration: 25,
    passingScore: 70,
    badgeName: '💎 SQL Verified',
    questions: [
      {
        id: 'q_sql_1',
        type: 'MCQ',
        question: 'Which clause filters group records after a GROUP BY aggregation?',
        options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
        correctAnswer: 'HAVING',
        marks: 10,
      },
      {
        id: 'q_sql_2',
        type: 'MCQ',
        question: 'What type of JOIN returns all records from the left table and matched records from the right table?',
        options: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'FULL OUTER JOIN'],
        correctAnswer: 'LEFT JOIN',
        marks: 10,
      },
    ],
  },
  {
    id: 'ch_py_1',
    skillId: 'cat_python',
    skillName: 'Python',
    title: 'Python Backend & Data Processing',
    description: 'Validate your grasp of list comprehensions, decorators, generators, and OOP in Python.',
    difficulty: 'Easy',
    duration: 15,
    passingScore: 70,
    badgeName: '🐍 Python Verified',
    questions: [
      {
        id: 'q_py_1',
        type: 'MCQ',
        question: 'Which keyword is used to create a generator function in Python?',
        options: ['return', 'yield', 'emit', 'generate'],
        correctAnswer: 'yield',
        marks: 10,
      },
      {
        id: 'q_py_2',
        type: 'MCQ',
        question: 'What data structure in Python is immutable?',
        options: ['List', 'Dictionary', 'Set', 'Tuple'],
        correctAnswer: 'Tuple',
        marks: 10,
      },
    ],
  },
];

export const skillService = {
  // Fetch skill categories
  getCategories: async () => {
    try {
      const { data, error } = await supabase.from('skill_categories').select('*');
      if (error || !data || data.length === 0) return DEFAULT_CATEGORIES;
      return data;
    } catch (err) {
      console.warn('Supabase fetch categories fallback:', err.message);
      return DEFAULT_CATEGORIES;
    }
  },

  // Fetch challenges
  getChallenges: async () => {
    try {
      const { data, error } = await supabase.from('challenges').select('*, questions:challenge_questions(*)');
      if (error || !data || data.length === 0) return SAMPLE_CHALLENGES;
      return data.map((ch) => ({
        id: ch.id,
        skillId: ch.skill_id,
        title: ch.title,
        description: ch.description,
        difficulty: ch.difficulty,
        duration: ch.duration,
        passingScore: ch.passing_score || 70,
        badgeName: `🏅 ${ch.title.split(' ')[0]} Verified`,
        questions: ch.questions || [],
      }));
    } catch (err) {
      console.warn('Supabase fetch challenges fallback:', err.message);
      return SAMPLE_CHALLENGES;
    }
  },

  // Fetch student's attempt records & badges
  getStudentAttempts: async (studentId) => {
    if (!studentId) return [];
    try {
      const { data, error } = await supabase
        .from('challenge_attempts')
        .select('*')
        .eq('student_id', studentId);

      if (error || !data) return [];
      return data.map((item) => ({
        id: item.id,
        challengeId: item.challenge_id,
        score: item.score,
        passed: item.passed,
        completedAt: item.completed_at,
      }));
    } catch (err) {
      console.warn('Error fetching student challenge attempts:', err.message);
      return [];
    }
  },

  // Submit challenge attempt & auto-score
  submitChallengeAttempt: async ({ challengeId, studentId, userAnswers, questions = [], passingScore = 70 }) => {
    let earnedMarks = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let wrongCount = 0;

    questions.forEach((q) => {
      const qMarks = q.marks || 10;
      totalMarks += qMarks;
      const userAns = String(userAnswers[q.id] || '').trim().toLowerCase();
      const correctAns = String(q.correctAnswer || '').trim().toLowerCase();

      if (userAns && (userAns === correctAns || correctAns.includes(userAns))) {
        earnedMarks += qMarks;
        correctCount += 1;
      } else if (userAns) {
        wrongCount += 1;
      }
    });

    const score = totalMarks > 0 ? Math.round((earnedMarks / totalMarks) * 100) : 0;
    const passed = score >= passingScore;

    // Save to Supabase
    if (studentId && challengeId) {
      try {
        await supabase.from('challenge_attempts').upsert({
          challenge_id: challengeId,
          student_id: studentId,
          score,
          passed,
          answers: userAnswers,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'challenge_id,student_id' });
      } catch (dbErr) {
        console.warn('Supabase challenge attempt save notice:', dbErr.message);
      }
    }

    return {
      score,
      passed,
      correctCount,
      wrongCount,
      totalQuestions: questions.length,
      earnedMarks,
      totalMarks,
    };
  },

  // Fetch Global Skill Leaderboard
  getLeaderboard: async () => {
    try {
      const { data, error } = await supabase
        .from('challenge_attempts')
        .select('*, student:profiles(*), challenge:challenges(*)')
        .eq('passed', true)
        .order('score', { ascending: false });

      if (error || !data || data.length === 0) {
        return [
          { rank: 1, name: 'Aarav Sharma', college: 'IIT Delhi', score: 98, badgesCount: 5, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
          { rank: 2, name: 'Ananya Verma', college: 'NIT Trichy', score: 94, badgesCount: 4, avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
          { rank: 3, name: 'Rohan Gupta', college: 'BITS Pilani', score: 90, badgesCount: 3, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
          { rank: 4, name: 'Priya Singh', college: 'DTU Delhi', score: 86, badgesCount: 3, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80' },
        ];
      }

      return data.map((att, idx) => ({
        rank: idx + 1,
        name: att.student?.full_name || 'Candidate',
        college: att.student?.college || 'University',
        score: att.score,
        badgesCount: 1,
        avatar: att.student?.avatar_url,
      }));
    } catch (err) {
      console.warn('Leaderboard fetch note:', err.message);
      return [
        { rank: 1, name: 'Aarav Sharma', college: 'IIT Delhi', score: 98, badgesCount: 5 },
        { rank: 2, name: 'Ananya Verma', college: 'NIT Trichy', score: 94, badgesCount: 4 },
        { rank: 3, name: 'Rohan Gupta', college: 'BITS Pilani', score: 90, badgesCount: 3 },
      ];
    }
  },

  // Fetch AI Skill Roadmap & Diagnostic
  getSkillRoadmap: async ({ studentName, challengeTitle, score, passed, missedTopics }) => {
    try {
      const response = await fetch('http://localhost:5000/api/ai/skill-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, challengeTitle, score, passed, missedTopics }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) return json.data;
      }
    } catch (err) {
      console.warn('Backend skill roadmap API offline, using fallback:', err.message);
    }

    return {
      summary: passed
        ? `Impressive result! You scored ${score}% on ${challengeTitle}. Your verified skill badge is now active across your candidate profile.`
        : `You scored ${score}% on ${challengeTitle}. Review missed concepts to earn your verified badge on your next attempt.`,
      practiceSuggestions: [
        'Review core concept documentation & standard implementations.',
        'Solve 5 medium-difficulty practice questions.',
        'Build a mini project demonstrating practical application.',
      ],
      roadmap: [
        'Step 1: Strengthen foundational syntax and algorithm logic.',
        'Step 2: Complete target practice problem set.',
        'Step 3: Retake challenge to earn verified badge.',
      ],
    };
  },
};
