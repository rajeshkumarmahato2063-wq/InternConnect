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
  RotateCcw,
  Check,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { assessmentService } from '../../services/assessmentService';

const TakeAssessmentPortal = () => {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);

  // Question navigation
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: 'option_a' }

  // Timer state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const timerRef = useRef(null);

  // Anti-cheating warnings
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Submission / Review states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch assessment data
  useEffect(() => {
    const fetchAssessment = async () => {
      setLoading(true);
      try {
        const list = await assessmentService.getStudentAssessments(user?.id);
        const match = list.find((a) => a.id === assessmentId);
        if (match) {
          setAssessment(match);
          if (match.attempt && match.attempt.status !== 'Started') {
            setTestSubmitted(true);
            // Calculate existing attempt result
            const total = match.totalMarks || 100;
            const score = match.attempt.score || 0;
            const pct = Math.round((score / total) * 100);
            setResultData({
              score,
              totalPossibleMarks: total,
              percentage: pct,
              status: match.attempt.status,
              submittedAt: match.attempt.submittedAt,
              answers: match.attempt.answers || {},
            });
          }
        }
      } catch (err) {
        console.error('Error fetching test assessment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId, user]);

  // Anti-cheating Tab Switch Detector
  useEffect(() => {
    if (!testStarted || testSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarnings((prev) => {
          const next = prev + 1;
          setShowWarningModal(true);
          return next;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [testStarted, testSubmitted]);

  // Timer Countdown Logic
  useEffect(() => {
    if (!testStarted || testSubmitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleFinalSubmit(true); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testStarted, testSubmitted]);

  const handleStartTest = async () => {
    if (!assessment) return;
    try {
      await assessmentService.startAttempt(assessment.id, user?.id);
      setTimeLeftSeconds((assessment.durationMinutes || 30) * 60);
      setTestStarted(true);
    } catch (err) {
      console.error('Start test error:', err);
    }
  };

  const handleOptionSelect = (qId, optionKey) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: optionKey,
    }));
  };

  const handleFinalSubmit = async (isAutoSubmit = false) => {
    if (submitting) return;
    setSubmitting(true);
    setShowReviewModal(false);

    try {
      const res = await assessmentService.submitAttempt({
        assessmentId: assessment.id,
        studentId: user?.id,
        userAnswers,
        questions: assessment.questions || [],
        passingMarks: assessment.passingMarks || 60,
      });

      setResultData(res);
      setTestSubmitted(true);
      setTestStarted(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } catch (err) {
      console.error('Failed to submit test:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-xs text-indigo-400 font-semibold">Loading Assessment Environment...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center space-y-4 text-white">
        <AlertTriangle className="w-12 h-12 text-rose-500" />
        <h3 className="text-lg font-bold">Assessment Not Found</h3>
        <Button variant="secondary" size="sm" onClick={() => navigate('/student/assessments')}>
          Back to Assessments Hub
        </Button>
      </div>
    );
  }

  const questions = assessment.questions || [];
  const currentQuestion = questions[currentIdx];
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col font-sans select-none">
      {/* Top Header Bar */}
      <header className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/assessments')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {assessment.title}
            </h2>
            <p className="text-xs text-slate-400">
              {assessment.companyName} • {assessment.jobTitle}
            </p>
          </div>
        </div>

        {/* Timer Bar */}
        {testStarted && !testSubmitted && (
          <div className="flex items-center gap-4">
            <div
              className={`px-4 py-2 rounded-2xl border font-mono font-black text-sm flex items-center gap-2 ${
                timeLeftSeconds < 300
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={Send}
              onClick={() => setShowReviewModal(true)}
            >
              Submit Test
            </Button>
          </div>
        )}
      </header>

      {/* VIEW 1: PRE-TEST INSTRUCTIONS MODAL */}
      {!testStarted && !testSubmitted && (
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <Card variant="glass" className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{assessment.title}</h3>
                  <p className="text-xs text-indigo-300">
                    Online Candidate Screening • {assessment.companyName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Duration</span>
                  <span className="font-bold text-white text-sm">{assessment.durationMinutes} Minutes</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Questions</span>
                  <span className="font-bold text-white text-sm">{questions.length} MCQs</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Passing Cutoff</span>
                  <span className="font-bold text-emerald-400 text-sm">{assessment.passingMarks}% Score</span>
                </div>
              </div>

              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
                <h4 className="font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <ShieldAlert className="w-4 h-4 text-amber-400" /> Assessment Rules & Anti-Cheating Guidelines
                </h4>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  <li>Do not switch browser tabs or minimize the test window during the session.</li>
                  <li>Tab switches are detected automatically and logged into anti-cheating warnings.</li>
                  <li>When the countdown timer reaches 00:00, your test will auto-submit.</li>
                  <li>Click 'Submit Test' anytime to complete your submission early.</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  icon={Check}
                  onClick={handleStartTest}
                >
                  Start Timed Test Now
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* VIEW 2: ACTIVE TEST PORTAL */}
      {testStarted && !testSubmitted && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Main Question Panel */}
          <main className="flex-1 p-6 overflow-y-auto space-y-6">
            {currentQuestion && (
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Question Box */}
                <Card variant="glass" className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Question {currentIdx + 1} of {questions.length}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {currentQuestion.marks || 10} Marks
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-relaxed">
                    {currentQuestion.question}
                  </h3>
                </Card>

                {/* MCQ Options */}
                <div className="space-y-3">
                  {[
                    { key: 'option_a', label: 'A', text: currentQuestion.optionA },
                    { key: 'option_b', label: 'B', text: currentQuestion.optionB },
                    { key: 'option_c', label: 'C', text: currentQuestion.optionC },
                    { key: 'option_d', label: 'D', text: currentQuestion.optionD },
                  ].map((opt) => {
                    const isSelected = userAnswers[currentQuestion.id] === opt.key;

                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleOptionSelect(currentQuestion.id, opt.key)}
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {opt.label}
                          </span>
                          <span className="text-sm font-medium">{opt.text}</span>
                        </div>

                        {isSelected && <Check className="w-5 h-5 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Navigation Buttons */}
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
          </main>

          {/* Question Palette Sidebar */}
          <aside className="w-full md:w-72 bg-slate-950/80 border-t md:border-t-0 md:border-l border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Question Palette
              </h4>
              <span className="text-xs text-slate-400 font-semibold">
                {answeredCount}/{questions.length} Answered
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = Boolean(userAnswers[q.id]);
                const isCurrent = currentIdx === idx;

                return (
                  <button
                    key={q.id || idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'ring-2 ring-indigo-500 bg-indigo-600 text-white font-black'
                        : isAnswered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] space-y-2 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500" /> Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-indigo-600 text-white" /> Current Question
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800" /> Unanswered
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* VIEW 3: RESULT SCREEN */}
      {testSubmitted && resultData && (
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl"
          >
            <Card variant="glass" className="p-8 space-y-6 text-center">
              {resultData.status === 'Passed' ? (
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-10 h-10 animate-pulse" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
                  <XCircle className="w-10 h-10" />
                </div>
              )}

              <div className="space-y-1">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    resultData.status === 'Passed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  Assessment {resultData.status}
                </span>
                <h3 className="text-2xl font-black text-white pt-2">
                  {resultData.percentage}% Score
                </h3>
                <p className="text-xs text-slate-400">
                  Achieved {resultData.score} out of {resultData.totalPossibleMarks} total marks.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Correct</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {resultData.correctCount || 0} MCQs
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Wrong</span>
                  <span className="font-bold text-rose-400 text-sm">
                    {resultData.wrongCount || 0} MCQs
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Passing Cutoff</span>
                  <span className="font-bold text-indigo-400 text-sm">
                    {assessment.passingMarks}%
                  </span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/student/assessments')}
              >
                Return to Assessment Hub
              </Button>
            </Card>
          </motion.div>
        </div>
      )}

      {/* CONFIRMATION REVIEW MODAL */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-indigo-400" /> Confirm Test Submission
              </h3>

              <p className="text-xs text-slate-300">
                You have answered <span className="font-bold text-emerald-400">{answeredCount}</span> out of{' '}
                <span className="font-bold text-white">{questions.length}</span> questions.
              </p>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={() => setShowReviewModal(false)}>
                  Return to Test
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleFinalSubmit(false)} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Answers'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ANTI-CHEATING WARNING MODAL */}
      <AnimatePresence>
        {showWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-3xl p-6 text-center space-y-4"
            >
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-white">Anti-Cheating Warning!</h4>
              <p className="text-xs text-slate-300">
                Tab switch or window defocus detected ({tabSwitchWarnings} warning logged). Please stay focused on the assessment portal.
              </p>
              <Button variant="danger" size="sm" onClick={() => setShowWarningModal(false)}>
                I Understand
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TakeAssessmentPortal;
