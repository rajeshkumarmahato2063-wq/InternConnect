import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  Sparkles,
  Trophy,
  Medal,
  Clock,
  Code2,
  Atom,
  FileCode,
  Coffee,
  Database,
  GitBranch,
  Play,
  CheckCircle2,
  Users,
  ChevronRight,
  TrendingUp,
  Brain,
  ShieldCheck,
  Zap
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { skillService, SAMPLE_CHALLENGES } from '../../services/skillService';

const ICON_MAP = {
  Code2: Code2,
  Atom: Atom,
  FileCode: FileCode,
  Coffee: Coffee,
  Database: Database,
  GitBranch: GitBranch,
};

const SkillHub = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [aiRoadmap, setAiRoadmap] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, chs, atts, lbrd] = await Promise.all([
        skillService.getCategories(),
        skillService.getChallenges(),
        skillService.getStudentAttempts(user?.id),
        skillService.getLeaderboard(),
      ]);

      setCategories(cats || []);
      setChallenges(chs || SAMPLE_CHALLENGES);
      setMyAttempts(atts || []);
      setLeaderboard(lbrd || []);

      // Fetch sample AI roadmap
      const roadmapData = await skillService.getSkillRoadmap({
        studentName: user?.name || 'Candidate',
        challengeTitle: 'SQL Database Architecture',
        score: 68,
        passed: false,
        missedTopics: ['SQL Joins', 'Subqueries', 'Indexing'],
      });
      setAiRoadmap(roadmapData);
    } catch (err) {
      console.error('Failed to load Skill Hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const passedChallengeIds = new Set(myAttempts.filter((a) => a.passed).map((a) => a.challengeId));

  const filteredChallenges = challenges.filter((c) => {
    if (selectedCategory === 'ALL') return true;
    return c.skillId === selectedCategory || c.skillName === selectedCategory;
  });

  return (
    <DashboardLayout
      title="Skill Verification & Coding Challenge Hub"
      subtitle="Complete timed technical challenges, earn recruiter-verified skill badges, view AI learning roadmaps, and rank on global leaderboards."
    >
      <div className="space-y-8">
        {/* Banner Section */}
        <Card variant="glass" className="p-6 relative overflow-hidden bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border-indigo-500/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Verified Recruiter Skill Badges
              </span>
              <h2 className="text-2xl font-black text-white">Prove Your Tech Skills & Get Noticed</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Earn official verified badges displayed across your Student Dashboard, Public Portfolio, and Company Applicant cards.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 shrink-0">
              <div className="text-center px-3 border-r border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Badges Earned</span>
                <p className="text-2xl font-black text-amber-400 mt-0.5">{passedChallengeIds.size}</p>
              </div>
              <div className="text-center px-3">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Challenges</span>
                <p className="text-2xl font-black text-indigo-400 mt-0.5">{challenges.length}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* 1. POPULAR SKILL CATEGORIES */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> Popular Skill Categories
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center gap-2 ${
                selectedCategory === 'ALL'
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Code2 className="w-6 h-6" />
              <span className="text-xs font-bold">All Skills</span>
            </button>

            {categories.map((cat) => {
              const IconComponent = ICON_MAP[cat.icon] || Code2;
              const isSelected = selectedCategory === cat.id || selectedCategory === cat.name;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <IconComponent className="w-6 h-6 text-indigo-400" />
                  <span className="text-xs font-bold">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. RECOMMENDED CHALLENGES & MY BADGES SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Challenges List (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-400" /> Recommended Verification Challenges
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                Showing {filteredChallenges.length} Challenges
              </span>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
                <p className="text-xs">Loading coding challenges...</p>
              </div>
            ) : filteredChallenges.length === 0 ? (
              <Card variant="glass" className="p-8 text-center text-slate-400 space-y-2">
                <Code2 className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No challenges found in this category.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredChallenges.map((ch) => {
                  const isPassed = passedChallengeIds.has(ch.id);

                  return (
                    <motion.div
                      key={ch.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card
                        variant="glass"
                        className={`p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border transition-all ${
                          isPassed
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-slate-800 hover:border-indigo-500/40'
                        }`}
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-white">{ch.title}</h4>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                ch.difficulty === 'Easy'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : ch.difficulty === 'Medium'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {ch.difficulty}
                            </span>
                            {isPassed && (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                                <Award className="w-3 h-3 text-amber-400" /> Verified Badge Earned
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed">{ch.description}</p>

                          <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                            <span className="flex items-center gap-1 text-slate-300 font-medium">
                              <Clock className="w-3.5 h-3.5 text-indigo-400" /> {ch.duration} Mins
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-300 font-medium">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {ch.passingScore}% Pass Score
                            </span>
                          </div>
                        </div>

                        <Button
                          variant={isPassed ? 'secondary' : 'primary'}
                          size="sm"
                          icon={isPassed ? CheckCircle2 : Play}
                          onClick={() => navigate(`/skill-challenge/${ch.id}`)}
                          className="shrink-0 w-full sm:w-auto"
                        >
                          {isPassed ? 'Retake Test' : 'Start Challenge'}
                        </Button>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar Column: My Badges & Leaderboard */}
          <div className="space-y-6">
            {/* MY VERIFIED BADGES */}
            <Card variant="glass" className="p-5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> My Verified Skill Badges
              </h3>

              {passedChallengeIds.size === 0 ? (
                <div className="py-6 text-center text-slate-400 space-y-2">
                  <Award className="w-10 h-10 text-slate-700 mx-auto" />
                  <p className="text-xs text-slate-400">Complete challenges with &ge; 70% score to unlock recruiter-verified skill badges.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {challenges
                    .filter((c) => passedChallengeIds.has(c.id))
                    .map((c) => (
                      <div
                        key={c.id}
                        className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between gap-3 shadow-md"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500/30 to-yellow-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold">
                            🏅
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">{c.badgeName || `${c.title} Verified`}</h5>
                            <span className="text-[10px] text-emerald-400 font-semibold">Recruiter Verified</span>
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    ))}
                </div>
              )}
            </Card>

            {/* AI DIAGNOSTICS & LEARNING ROADMAP */}
            {aiRoadmap && (
              <Card variant="glass" className="p-5 space-y-3 bg-gradient-to-br from-indigo-950/40 to-slate-900 border-indigo-500/30">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-amber-300" /> AI Skill Diagnostic Roadmap
                </h3>
                <p className="text-xs text-slate-300 italic">"{aiRoadmap.summary}"</p>

                <div className="space-y-1.5 pt-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase">Learning Action Steps</h4>
                  {aiRoadmap.roadmap?.map((step, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0 border border-indigo-500/30 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* GLOBAL LEADERBOARD */}
            <Card variant="glass" className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" /> Global Leaderboard
                </h3>
                <span className="text-[10px] font-bold text-indigo-400 uppercase">Top Talent</span>
              </div>

              <div className="space-y-2.5">
                {leaderboard.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center ${
                          idx === 0
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : idx === 1
                            ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                            : idx === 2
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      <div>
                        <h5 className="font-bold text-white">{item.name}</h5>
                        <p className="text-[10px] text-slate-400">{item.college}</p>
                      </div>
                    </div>

                    <span className="font-black text-indigo-300">{item.score}% Score</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SkillHub;
