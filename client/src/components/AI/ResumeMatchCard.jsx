import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Lightbulb,
  RefreshCw,
  Award,
  Zap,
  ArrowRight,
} from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { resumeAnalysisService } from '../../services/resumeAnalysisService';
import { useAuth } from '../../context/AuthContext';

const ScoreCircle = ({ score, loading }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = loading
    ? circumference * 0.7
    : circumference - (score / 100) * circumference;

  // Determine dynamic gradient color based on score threshold
  const getScoreColor = (s) => {
    if (s >= 85) return 'from-emerald-400 to-teal-500';
    if (s >= 70) return 'from-indigo-400 to-purple-500';
    return 'from-amber-400 to-orange-500';
  };

  return (
    <div className="relative flex items-center justify-center w-32 h-32 shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background Track Circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          className="stroke-slate-800"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Animated Progress Ring */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>

      {/* Score Text Overlay */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        {loading ? (
          <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
        ) : (
          <>
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={score}
              className={`text-2xl font-black bg-gradient-to-r ${getScoreColor(
                score
              )} bg-clip-text text-transparent`}
            >
              {score}%
            </motion.span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mt-0.5">
              Match
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const ResumeMatchCard = ({ internship, studentProfile }) => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const studentId = user?.id || 'demo_student_id';
  const internshipId = internship?.id || 'demo_internship_id';

  // Load previously saved analysis on mount
  useEffect(() => {
    let isMounted = true;
    const fetchExisting = async () => {
      const saved = await resumeAnalysisService.getAnalysis(studentId, internshipId);
      if (isMounted && saved) {
        setAnalysis(saved);
        setHasRun(true);
      }
    };
    fetchExisting();
    return () => {
      isMounted = false;
    };
  }, [studentId, internshipId]);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const studentSkills =
        studentProfile?.skills || user?.skills || ['React', 'JavaScript', 'Git', 'HTML', 'CSS'];
      const requiredSkills = internship?.skills || [
        'React',
        'JavaScript',
        'Git',
        'Node.js',
        'MongoDB',
      ];
      const resumeText =
        studentProfile?.resume_summary ||
        `Experienced student developer proficient in ${studentSkills.join(
          ', '
        )}. Built responsive web applications and APIs.`;

      const result = await resumeAnalysisService.runAnalysis({
        studentId,
        internshipId,
        studentSkills,
        resumeText,
        internshipTitle: internship?.title || 'Software Engineering Intern',
        internshipDescription: internship?.description || 'Full stack developer role',
        requiredSkills,
      });

      setAnalysis(result);
      setHasRun(true);
    } catch (err) {
      console.error('Failed to run resume match analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  // Default display state when analysis hasn't been triggered yet
  const displayScore = analysis ? analysis.matchScore : 92;
  const matchingSkills = analysis
    ? analysis.matchingSkills
    : ['React', 'JavaScript', 'Git'];
  const missingSkills = analysis
    ? analysis.missingSkills
    : ['Node.js', 'MongoDB'];
  const strengths = analysis
    ? analysis.strengths
    : [
        'Strong technical stack alignment for Modern Front-End Web Engineering.',
        'Proven version control workflow using Git and GitHub project repositories.',
        'Solid background with responsive user interface development.',
      ];
  const suggestions = analysis
    ? analysis.suggestions
    : [
        'Build a full-stack project incorporating Node.js & Express API endpoints.',
        'Incorporate MongoDB database modeling into your upcoming open-source project.',
        'Highlight quantitative performance optimizations in your project descriptions.',
      ];

  return (
    <Card
      variant="glass"
      className="p-6 md:p-8 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 backdrop-blur-xl"
    >
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>AI Resume Match Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Resume Match Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time candidate compatibility powered by Gemini AI API & Supabase
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleAnalyze}
          disabled={loading}
          icon={loading ? RefreshCw : Zap}
          className="shrink-0 font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25"
        >
          {loading ? 'Analyzing with Gemini...' : hasRun ? 'Re-Analyze Resume' : 'Analyze Resume'}
        </Button>
      </div>

      {/* Main Analysis Body */}
      <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Score Circle & Quick Summary */}
        <div className="md:col-span-4 flex flex-col items-center text-center p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md">
          <ScoreCircle score={displayScore} loading={loading} />

          <div className="mt-4">
            <h3 className="text-base font-bold text-white">
              {displayScore >= 85
                ? 'High Match Candidate 🚀'
                : displayScore >= 70
                ? 'Good Compatibility 👍'
                : 'Potential Skill Gap 💡'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Your profile aligns with{' '}
              <span className="font-bold text-indigo-300">{displayScore}%</span> of this position's key requirements.
            </p>
          </div>

          <div className="w-full mt-5 pt-4 border-t border-slate-700/50 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Matched Skills</span>
              <span className="font-bold text-emerald-400">{matchingSkills.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Missing Skills</span>
              <span className="font-bold text-amber-400">{missingSkills.length}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Skills Breakdown, Strengths & Suggestions */}
        <div className="md:col-span-8 space-y-6">
          {/* Loading Skeleton during Analysis */}
          {loading ? (
            <div className="space-y-4 py-4 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-10 bg-slate-800/60 rounded-xl" />
              <div className="h-4 bg-slate-800 rounded w-1/2" />
              <div className="h-10 bg-slate-800/60 rounded-xl" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={displayScore}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Matching Skills */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Matching Skills ({matchingSkills.length})
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matchingSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/30"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Missing Skills ({missingSkills.length})
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.length > 0 ? (
                      missingSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/30"
                        >
                          <AlertCircle className="w-3 h-3 text-amber-400" />
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No critical skills missing for this position!
                      </span>
                    )}
                  </div>
                </div>

                {/* Resume Strengths */}
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                      Resume Strengths
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggestions */}
                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                      AI Recommendations to Boost Match
                    </h4>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {suggestions.map((sug, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ResumeMatchCard;
