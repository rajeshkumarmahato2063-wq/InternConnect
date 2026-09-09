import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../Button/Button';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { internshipService } from '../../services/internshipService';

const ApplyModal = ({ job, isOpen, onClose }) => {
  const { user, addApplication, applications } = useAuth();
  const [coverLetter, setCoverLetter] = useState(
    `Dear Hiring Manager at ${job?.companyName || 'the company'},\n\nI am extremely excited to apply for the ${job?.title || 'internship'} position. My technical skills in ${job?.skills?.slice(0, 3).join(', ')} align strongly with your requirements.`
  );
  const [selectedResume, setSelectedResume] = useState(user?.resume?.fileName || 'Aarav_Sharma_Resume_2025.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !job) return null;

  const hasAlreadyApplied = applications.some((a) => a.jobId === job.id && (a.studentId === user?.id || a.student_id === user?.id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const newApp = await internshipService.applyForJob({
        jobId: job.id,
        internshipId: job.id,
        studentId: user?.id,
        coverLetter,
        resumeName: selectedResume,
        student: user,
      });

      addApplication(newApp);
      setIsSubmitting(false);
      setSubmittedSuccess(true);

      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to submit application');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl z-10"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {submittedSuccess ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
              <p className="text-slate-300 text-sm max-w-xs">
                Your resume and application details have been sent to <strong>{job.companyName}</strong>.
              </p>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="w-12 h-12 rounded-xl object-contain bg-white p-1"
                />
                <div>
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                    {job.companyName}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">{job.title}</h3>
                </div>
              </div>

              {hasAlreadyApplied ? (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-start gap-3 my-4">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Already Applied</p>
                    <p className="text-xs text-amber-200/80 mt-1">
                      You submitted an application for this role. Check your status in the Application Tracker.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  {/* Resume Picker */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Selected Resume
                    </label>
                    <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-200 font-medium">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span>{selectedResume}</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md font-semibold">
                        Primary ATS
                      </span>
                    </div>
                  </div>

                  {/* Cover Letter Text Area */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                        Cover Letter / Note to Recruiter
                      </label>
                      <span className={`text-[11px] font-mono ${coverLetter.length > 1000 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                        {coverLetter.length} / 1000 chars
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      maxLength={1000}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Share why you are a great candidate..."
                      className="w-full rounded-xl bg-slate-800/80 border border-slate-700 p-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <Button variant="secondary" size="md" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={isSubmitting}
                      icon={Send}
                    >
                      {isSubmitting ? 'Submitting...' : 'Confirm & Send Application'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ApplyModal;
