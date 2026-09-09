import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Video, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import internshipService from '../../services/internshipService';

export default function InterviewSchedulerModal({ isOpen, onClose, applicant, onInterviewScheduled }) {
  const [formData, setFormData] = useState({
    interview_date: '',
    interview_time: '',
    meeting_link: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !applicant) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.interview_date || !formData.interview_time || !formData.meeting_link) {
      setError("Please fill in Date, Time, and Meeting Link.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        internship_id: applicant.internship_id,
        student_id: applicant.student_id,
        company_id: applicant.company_id || applicant.internship?.company_id,
        interview_date: formData.interview_date,
        interview_time: formData.interview_time,
        meeting_link: formData.meeting_link,
        notes: formData.notes,
        status: 'Scheduled'
      };

      await internshipService.scheduleInterview(payload);
      
      // Optionally update status to 'Interview'
      if (applicant.id) {
        await internshipService.updateApplicationStatus(applicant.id, 'Interview');
      }

      if (onInterviewScheduled) {
        onInterviewScheduled(applicant.id);
      }
      onClose();
    } catch (err) {
      console.error("Failed to schedule interview:", err);
      setError(err.message || "Failed to schedule interview.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white">Schedule Interview</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                For candidate <span className="text-indigo-400 font-semibold">{applicant.student?.full_name || 'Student'}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Interview Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.interview_date}
                  onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Interview Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={formData.interview_time}
                  onChange={(e) => setFormData({ ...formData, interview_time: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Google Meet / Zoom Link
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://meet.google.com/abc-defg-hij"
                  value={formData.meeting_link}
                  onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Notes for Candidate (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Preparation details, technical format, or agenda..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
              >
                {submitting ? (
                  <span>Scheduling...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm & Send Invitation</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
