import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Save,
  HelpCircle,
  Users,
  Trophy,
  Sparkles,
  ChevronRight,
  Briefcase,
  AlertCircle,
  FileText
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { assessmentService } from '../../services/assessmentService';

const CompanyAssessments = () => {
  const { user } = useAuth();
  const [jobAssessments, setJobAssessments] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' | 'leaderboard'

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingMarks, setPassingMarks] = useState(60);
  const [totalMarks, setTotalMarks] = useState(100);
  const [instructions, setInstructions] = useState('Answer all questions carefully within the time limit. Tab switches and exiting fullscreen mode will trigger anti-cheating alerts.');
  
  // MCQ List state
  const [questions, setQuestions] = useState([]);
  const [editingQuestionIdx, setEditingQuestionIdx] = useState(null);
  const [currentQ, setCurrentQ] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'option_a',
    marks: 10,
  });

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await assessmentService.getCompanyAssessments(user?.id);
      setJobAssessments(data || []);
      if (data && data.length > 0 && !selectedJob) {
        setSelectedJob(data[0]);
      }
    } catch (err) {
      console.error('Failed to load company assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  useEffect(() => {
    if (selectedJob?.assessment?.id) {
      assessmentService.getAssessmentLeaderboard(selectedJob.assessment.id).then((list) => {
        setLeaderboard(list || []);
      });
    } else {
      setLeaderboard([]);
    }
  }, [selectedJob]);

  const openCreateModal = (jobItem) => {
    const existing = jobItem.assessment;
    setTitle(existing?.title || `${jobItem.jobTitle} Technical Screening`);
    setDurationMinutes(existing?.durationMinutes || 30);
    setPassingMarks(existing?.passingMarks || 60);
    setTotalMarks(existing?.totalMarks || 100);
    setInstructions(existing?.instructions || 'Answer all questions carefully within the time limit.');
    setQuestions(existing?.questions || [
      {
        question: 'What is the primary purpose of React Virtual DOM?',
        optionA: 'Direct DOM manipulation speedup',
        optionB: 'Efficient in-memory diffing and batch UI updates',
        optionC: 'Replacing CSS stylesheet loading',
        optionD: 'Bypassing browser Javascript engines',
        correctAnswer: 'option_b',
        marks: 10,
      },
    ]);
    setShowModal(true);
  };

  const handleAddQuestion = () => {
    if (!currentQ.question || !currentQ.optionA || !currentQ.optionB) {
      showToast('Please fill out question text and at least Options A & B.');
      return;
    }

    if (editingQuestionIdx !== null) {
      const updated = [...questions];
      updated[editingQuestionIdx] = { ...currentQ };
      setQuestions(updated);
      setEditingQuestionIdx(null);
    } else {
      setQuestions([...questions, { ...currentQ }]);
    }

    setCurrentQ({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'option_a',
      marks: 10,
    });
  };

  const handleEditQuestion = (idx) => {
    setCurrentQ({ ...questions[idx] });
    setEditingQuestionIdx(idx);
  };

  const handleDeleteQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSaveAssessment = async () => {
    if (!selectedJob) return;
    if (questions.length === 0) {
      showToast('Please add at least 1 MCQ question to publish assessment.');
      return;
    }

    setSaving(true);
    try {
      const calcTotalMarks = questions.reduce((acc, q) => acc + parseInt(q.marks || 10, 10), 0);

      await assessmentService.saveAssessment({
        id: selectedJob.assessment?.id || null,
        internshipId: selectedJob.jobId,
        title,
        durationMinutes,
        totalMarks: calcTotalMarks || totalMarks,
        passingMarks,
        instructions,
        questions,
        userId: user?.id,
      });

      showToast('Assessment published successfully!');
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error('Save assessment error:', err);
      showToast('Failed to save assessment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      title="Online Internship Assessment Builder"
      subtitle="Design MCQ online screening assessments for your internships, set duration & passing criteria, and evaluate candidate leaderboards."
    >
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-indigo-600 border border-indigo-400 text-white shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-semibold"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header Tabs for Job Selection */}
        {jobAssessments.length > 0 ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {jobAssessments.map((jobItem) => {
              const isSelected = selectedJob?.jobId === jobItem.jobId;
              const hasAssessment = Boolean(jobItem.assessment);

              return (
                <button
                  key={jobItem.jobId}
                  onClick={() => setSelectedJob(jobItem)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 border border-indigo-400/30'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>{jobItem.jobTitle}</span>
                  {hasAssessment ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      Active Test ({jobItem.assessment.questions.length} MCQs)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400 font-bold border border-slate-700">
                      No Test
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : null}

        {/* Selected Internship Workspace Panel */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
            <p className="text-xs">Fetching company internship assessments...</p>
          </div>
        ) : !selectedJob ? (
          <Card variant="glass" className="p-12 text-center space-y-3">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Internships Found</h3>
            <p className="text-xs text-slate-400">Post an internship listing first to create screening assessments.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Action Bar & Stats Overview */}
            <Card variant="glass" className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Target Role</span>
                  <h3 className="text-xl font-black text-white">{selectedJob.jobTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedJob.assessment
                      ? `Active screening test: "${selectedJob.assessment.title}" (${selectedJob.assessment.durationMinutes} mins • ${selectedJob.assessment.totalMarks} Total Marks)`
                      : 'No assessment created for this role yet.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('manage')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'manage'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    Manage Assessment
                  </button>
                  <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === 'leaderboard'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> Leaderboard ({leaderboard.length})
                  </button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={selectedJob.assessment ? Edit2 : Plus}
                    onClick={() => openCreateModal(selectedJob)}
                  >
                    {selectedJob.assessment ? 'Edit Test & MCQs' : 'Create Assessment'}
                  </Button>
                </div>
              </div>
            </Card>

            {/* TAB 1: MANAGE ASSESSMENT & QUESTIONS LIST */}
            {activeTab === 'manage' && (
              <div>
                {!selectedJob.assessment ? (
                  <Card variant="glass" className="p-12 text-center space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white">Create Screening Assessment for {selectedJob.jobTitle}</h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Automate candidate filtering before scheduling technical interviews. Add custom MCQ questions, set timed test duration, and pass thresholds.
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="md"
                      icon={Plus}
                      onClick={() => openCreateModal(selectedJob)}
                    >
                      Build Assessment Now
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {/* Assessment Meta Card */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Test Duration</span>
                        <p className="text-xl font-black text-indigo-400 mt-1 flex items-center justify-center gap-1">
                          <Clock className="w-4 h-4" /> {selectedJob.assessment.durationMinutes} Mins
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total MCQs</span>
                        <p className="text-xl font-black text-cyan-400 mt-1">
                          {selectedJob.assessment.questions.length} Questions
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Marks</span>
                        <p className="text-xl font-black text-purple-400 mt-1">
                          {selectedJob.assessment.totalMarks} Marks
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Passing Mark</span>
                        <p className="text-xl font-black text-emerald-400 mt-1">
                          {selectedJob.assessment.passingMarks}% Score
                        </p>
                      </div>
                    </div>

                    {/* Questions Preview List */}
                    <Card variant="glass" className="p-6 space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <HelpCircle className="w-5 h-5 text-indigo-400" /> Assessment Questions Palette ({selectedJob.assessment.questions.length})
                        </h4>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Edit2}
                          onClick={() => openCreateModal(selectedJob)}
                        >
                          Modify MCQs
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {selectedJob.assessment.questions.map((q, idx) => (
                          <div
                            key={q.id || idx}
                            className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <span className="text-xs font-bold text-white flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-black text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">
                                  {idx + 1}
                                </span>
                                {q.question}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                                {q.marks} Marks
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div className={`p-2.5 rounded-xl border ${q.correctAnswer === 'option_a' || q.correctAnswer === 'A' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                                A. {q.optionA}
                              </div>
                              <div className={`p-2.5 rounded-xl border ${q.correctAnswer === 'option_b' || q.correctAnswer === 'B' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                                B. {q.optionB}
                              </div>
                              <div className={`p-2.5 rounded-xl border ${q.correctAnswer === 'option_c' || q.correctAnswer === 'C' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                                C. {q.optionC}
                              </div>
                              <div className={`p-2.5 rounded-xl border ${q.correctAnswer === 'option_d' || q.correctAnswer === 'D' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-semibold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                                D. {q.optionD}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: LEADERBOARD & CANDIDATE SCORES */}
            {activeTab === 'leaderboard' && (
              <Card variant="glass" className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" /> Candidate Assessment Leaderboard ({leaderboard.length})
                  </h4>
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                    Auto-Scored Results
                  </span>
                </div>

                {leaderboard.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 space-y-2">
                    <Users className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-slate-300">No test attempts submitted yet.</p>
                    <p className="text-xs text-slate-500">Candidate test submissions will rank automatically here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((item, idx) => {
                      const totalPossible = selectedJob.assessment?.totalMarks || 100;
                      const percentage = Math.round((item.score / totalPossible) * 100);

                      return (
                        <div
                          key={item.id || idx}
                          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${idx === 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : idx === 1 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' : idx === 2 ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'bg-slate-800 text-slate-400'}`}>
                              #{idx + 1}
                            </span>
                            <div>
                              <h5 className="text-white font-bold text-sm">{item.studentName}</h5>
                              <p className="text-xs text-slate-400">{item.studentCollege}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <span className="text-xs font-bold text-slate-400">Score</span>
                              <p className="text-base font-black text-white">{item.score} / {totalPossible}</p>
                            </div>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                item.status === 'Passed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {item.status} ({percentage}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </div>

      {/* ASSESSMENT CREATOR & MCQ BUILDER MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Assessment & MCQ Builder</h3>
                    <p className="text-xs text-slate-400">{selectedJob?.jobTitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
                {/* Form Meta Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Assessment Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Technical MCQ Test"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Passing Mark (%)</label>
                    <input
                      type="number"
                      value={passingMarks}
                      onChange={(e) => setPassingMarks(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Student Instructions</label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* MCQ Builder Input Box */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> {editingQuestionIdx !== null ? 'Edit MCQ Question' : 'Add New MCQ Question'}
                  </h4>

                  <div>
                    <input
                      type="text"
                      placeholder="Enter question text..."
                      value={currentQ.question}
                      onChange={(e) => setCurrentQ({ ...currentQ, question: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Option A"
                      value={currentQ.optionA}
                      onChange={(e) => setCurrentQ({ ...currentQ, optionA: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Option B"
                      value={currentQ.optionB}
                      onChange={(e) => setCurrentQ({ ...currentQ, optionB: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Option C"
                      value={currentQ.optionC}
                      onChange={(e) => setCurrentQ({ ...currentQ, optionC: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Option D"
                      value={currentQ.optionD}
                      onChange={(e) => setCurrentQ({ ...currentQ, optionD: e.target.value })}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-slate-400">Correct Answer:</label>
                      <select
                        value={currentQ.correctAnswer}
                        onChange={(e) => setCurrentQ({ ...currentQ, correctAnswer: e.target.value })}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none"
                      >
                        <option value="option_a">Option A</option>
                        <option value="option_b">Option B</option>
                        <option value="option_c">Option C</option>
                        <option value="option_d">Option D</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-slate-400">Marks:</label>
                      <input
                        type="number"
                        value={currentQ.marks}
                        onChange={(e) => setCurrentQ({ ...currentQ, marks: parseInt(e.target.value, 10) })}
                        className="w-16 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-xs text-white focus:outline-none"
                      />
                      <Button variant="secondary" size="sm" onClick={handleAddQuestion}>
                        {editingQuestionIdx !== null ? 'Update Question' : 'Add MCQ'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Staged Questions List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Staged Questions ({questions.length})
                  </h4>

                  {questions.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <p className="font-bold text-white">
                          {idx + 1}. {q.question}
                        </p>
                        <p className="text-[11px] text-emerald-400 font-semibold">
                          Correct: {q.correctAnswer.toUpperCase().replace('OPTION_', 'Option ')} ({q.marks} Marks)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditQuestion(idx)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(idx)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Save}
                  onClick={handleSaveAssessment}
                  disabled={saving}
                >
                  {saving ? 'Publishing...' : 'Publish Assessment'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default CompanyAssessments;
