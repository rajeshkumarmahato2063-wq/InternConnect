import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  Award,
  HelpCircle,
  ArrowLeft,
  Brain,
  Code2,
  Check
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { skillService, SAMPLE_CHALLENGES } from '../../services/skillService';

const TakeChallengePortal = () => {
  const { id: challengeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  // Timer & progress bar
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);
  const timerRef = useRef(null);

  // Result & AI Roadmap state
  const [resultData, setResultData] = useState(null);
  const [aiRoadmap, setAiRoadmap] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      setLoading(true);
      try {
        const list = await skillService.getChallenges();
        const match = list.find((c) => c.id === challengeId) || SAMPLE_CHALLENGES.find((c) => c.id === challengeId);
        if (match) {
          setChallenge(match);
          const durSec = (match.duration || 15) * 60;
          setTimeLeftSeconds(durSec);
          setTotalDurationSeconds(durSec);
        }
      } catch (err) {
        console.error('Fetch challenge error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId]);

  // Timer Countdown Logic
  useEffect(() => {
    if (!testStarted || testSubmitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testStarted, testSubmitted]);

  const handleStartChallenge = () => {
    setTestStarted(true);
  };

  const handleOptionSelect = (qId, optionVal) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionVal,
    }));
  };

  const handleFinalSubmit = async (isAutoSubmit = false) => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const res = await skillService.submitChallengeAttempt({
        challengeId: challenge.id,
        studentId: user?.id,
        userAnswers,
        questions: challenge.questions || [],
        passingScore: challenge.passingScore || 70,
      });

      setResultData(res);
      setTestSubmitted(true);
      setTestStarted(false);
      if (timerRef.current) clearInterval(timerRef.current);

      // Call AI Skill Diagnostic
      const roadmap = await skillService.getSkillRoadmap({
        studentName: user?.name || 'Candidate',
        challengeTitle: challenge.title,
        score: res.score,
        passed: res.passed,
        missedTopics: res.passed ? [] : ['Core syntax & logic', 'Algorithm optimization'],
      });
      setAiRoadmap(roadmap);
    } catch (err) {
      console.error('Failed to submit challenge attempt:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const timerPercentage = totalDurationSeconds > 0
    ? Math.max(0, Math.min(100, Math.round((timeLeftSeconds / totalDurationSeconds) * 100)))
    : 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-indigo-400 font-semibold">Loading Skill Verification Challenge...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center space-y-4 text-white">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <h3 className="text-lg font-bold">Challenge Not Found</h3>
        <Button variant="secondary" size="sm" onClick={() => navigate('/skill-hub')}>
          Back to Skill Hub
        </Button>
      </div>
    );
  }

  const questions = challenge.questions || [];
  const currentQuestion = questions[currentIdx];
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col font-sans select-none">
      {/* Top Header Bar */}
      <header className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/skill-hub')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {challenge.title}
            </h2>
            <p className="text-xs text-slate-400">
              {challenge.difficulty} Difficulty • {questions.length} Questions
            </p>
          </div>
        </div>

        {/* Timer Progress Bar */}
        {testStarted && !testSubmitted && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
              <Clock className="w-4 h-4 text-indigo-400" />
              <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-1000"
                  style={{ width: `${timerPercentage}%` }}
                />
              </div>
              <span className="font-mono font-bold text-xs text-indigo-300">
                {formatTimer(timeLeftSeconds)}
              </span>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Send}
              onClick={() => handleFinalSubmit(false)}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Challenge'}
            </Button>
          </div>
        )}
      </header>

      {/* PRE-CHALLENGE INSTRUCTIONS SCREEN */}
      {!testStarted && !testSubmitted && (
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl"
          >
            <Card variant="glass" className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold">
                  <Award className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{challenge.title}</h3>
                  <p className="text-xs text-indigo-300">
                    Earn verified badge: <span className="font-bold text-amber-300">{challenge.badgeName || '🏅 Verified Skill Badge'}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Duration</span>
                  <span className="font-bold text-white text-sm">{challenge.duration} Mins</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Total Questions</span>
                  <span className="font-bold text-white text-sm">{questions.length} MCQs/Coding</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Pass Cutoff</span>
                  <span className="font-bold text-emerald-400 text-sm">{challenge.passingScore || 70}%</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {challenge.description} Complete this challenge with &ge; {challenge.passingScore || 70}% score to automatically display your official verified badge across your profile.
              </p>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  icon={Check}
                  onClick={handleStartChallenge}
                >
                  Start Verification Challenge
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* ACTIVE CHALLENGE PORTAL */}
      {testStarted && !testSubmitted && currentQuestion && (
        <div className="flex-1 p-6 overflow-y-auto max-w-3xl mx-auto w-full space-y-6">
          <Card variant="glass" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Question {currentIdx + 1} of {questions.length} • {currentQuestion.type}
              </span>
              <span className="text-xs font-bold text-slate-400">{currentQuestion.marks || 10} Marks</span>
            </div>

            <h3 className="text-lg font-bold text-white leading-relaxed">{currentQuestion.question}</h3>
          </Card>

          {/* Question Interface */}
          {currentQuestion.type === 'MCQ' ? (
            <div className="space-y-3">
              {(currentQuestion.options || []).map((optText, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === optText;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleOptionSelect(currentQuestion.id, optText)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-indigo-500 text-white shadow-lg'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{optText}</span>
                    {isSelected && <Check className="w-5 h-5 text-indigo-400" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block">Code Editor / Answer Workspace:</label>
              <textarea
                rows={6}
                value={userAnswers[currentQuestion.id] || (currentQuestion.options?.[0] || '')}
                onChange={(e) => handleOptionSelect(currentQuestion.id, e.target.value)}
                placeholder="// Write your code solution here..."
                className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-2xl p-4 text-emerald-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Navigation Control */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
            >
              Previous
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIdx === questions.length - 1}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* RESULT & AI DIAGNOSTIC SCREEN */}
      {testSubmitted && resultData && (
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl my-auto space-y-6"
          >
            <Card variant="glass" className="p-8 space-y-6 text-center">
              {resultData.passed ? (
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <Award className="w-10 h-10 text-amber-400 animate-bounce" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
                  <XCircle className="w-10 h-10" />
                </div>
              )}

              <div className="space-y-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    resultData.passed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {resultData.passed ? 'Verified Badge Unlocked! 🏅' : 'Verification Attempt Complete'}
                </span>
                <h3 className="text-3xl font-black text-white pt-2">{resultData.score}% Score</h3>
                <p className="text-xs text-slate-400">
                  Correct: {resultData.correctCount} / {resultData.totalQuestions} Questions
                </p>
              </div>

              {/* AI Diagnostic Card */}
              {aiRoadmap && (
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 text-left space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-amber-300" /> AI Skill Diagnostic
                  </h4>
                  <p className="text-xs text-slate-300 italic">"{aiRoadmap.summary}"</p>
                </div>
              )}

              <Button variant="primary" size="md" onClick={() => navigate('/skill-hub')}>
                Return to Skill Hub
              </Button>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TakeChallengePortal;
