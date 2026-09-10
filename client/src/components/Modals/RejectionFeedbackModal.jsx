import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertTriangle, Send, RefreshCw, CheckCircle2 } from 'lucide-react';
import Button from '../Button/Button';
import { aiRecruiterService } from '../../services/aiRecruiterService';

const RejectionFeedbackModal = ({ isOpen, onClose, candidate, onConfirmReject }) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendFeedbackToStudent, setSendFeedbackToStudent] = useState(true);

  const studentName = candidate?.studentName || candidate?.student?.full_name || 'Candidate';
  const jobTitle = candidate?.jobTitle || candidate?.internship?.title || 'Internship';
  const matchScore = candidate?.matchScore || 72;
  const missingSkills = candidate?.missingSkills || ['Node.js', 'MongoDB'];

  const generateFeedback = async () => {
    setLoading(true);
    try {
      const result = await aiRecruiterService.generateAndSaveRejectionFeedback({
        internshipId: candidate?.jobId || candidate?.internship_id,
        studentId: candidate?.studentId || candidate?.student_id,
        studentName,
        internshipTitle: jobTitle,
        matchScore,
        missingSkills,
      });
      setFeedback(result || `You matched ${matchScore}%. Learning ${missingSkills.join(' & ')} could improve future applications.`);
    } catch (err) {
      console.error('Failed to generate AI rejection feedback:', err);
      setFeedback(`You matched ${matchScore}%. Learning ${missingSkills.join(' & ')} could improve future applications.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && candidate) {
      generateFeedback();
    }
  }, [isOpen, candidate]);

  if (!isOpen || !candidate) return null;

  const handleSubmit = () => {
    onConfirmReject(candidate, sendFeedbackToStudent ? feedback : null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Application Rejection & AI Feedback</h3>
                <p className="text-xs text-slate-400">
                  Update candidate status to <span className="text-rose-400 font-semibold">Rejected</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold">{studentName}</span>
                <span className="text-slate-500">{jobTitle}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Match Score:</span>
                <span className="font-bold text-indigo-400">{matchScore}%</span>
              </div>
            </div>

            {/* AI Feedback Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> Optional AI Growth Feedback
                </label>
                <button
                  type="button"
                  onClick={generateFeedback}
                  disabled={loading}
                  className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Regenerate
                </button>
              </div>

              {loading ? (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center py-8">
                  <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Synthesizing personalized AI rejection feedback...</p>
                </div>
              ) : (
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="AI constructive candidate feedback..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              )}
            </div>

            {/* Checkbox Toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendFeedbackToStudent}
                onChange={(e) => setSendFeedbackToStudent(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-slate-300 font-medium">
                Deliver constructive feedback notification to student's dashboard & email.
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <Button
              variant="danger"
              size="sm"
              onClick={handleSubmit}
              icon={Send}
              disabled={loading}
            >
              Confirm Rejection
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RejectionFeedbackModal;
