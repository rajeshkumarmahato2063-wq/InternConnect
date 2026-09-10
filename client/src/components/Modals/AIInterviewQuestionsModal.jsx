import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  HelpCircle,
  Code2,
  Users,
  MessageSquare,
  Copy,
  Check,
  Download,
  BookOpen,
  Award
} from 'lucide-react';
import Button from '../Button/Button';

const AIInterviewQuestionsModal = ({ isOpen, onClose, candidate, analysis }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'technical' | 'hr' | 'behavioral'

  if (!isOpen || !candidate) return null;

  const studentName = candidate.studentName || candidate.student?.full_name || 'Candidate';
  const jobTitle = candidate.jobTitle || candidate.internship?.title || 'Internship Role';
  const score = analysis?.score || candidate.matchScore || 92;

  const questions = analysis?.interviewQuestions || {
    technical: [
      `Explain React reconciliation, Virtual DOM diffing, and key props in list rendering.`,
      `How do you handle state management, side effects, and custom hooks in frontend applications?`,
      `Describe how you secure RESTful endpoints using JWT authorization and database RLS.`,
    ],
    hr: [
      `What motivated you to apply for the ${jobTitle} position at our company?`,
      `How do you organize your workflow when balancing academic studies and software projects?`,
    ],
    behavioral: [
      `Describe a technical challenge you encountered in a recent project and how you solved it.`,
      `Give an example of how you resolved a difference in technical opinion with a team member.`,
    ],
  };

  const handleCopyAll = () => {
    const text = `AI INTERVIEW QUESTION GUIDE
Candidate: ${studentName} (${score}% Match)
Role: ${jobTitle}

TECHNICAL QUESTIONS:
${questions.technical?.map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None'}

HR & CULTURAL QUESTIONS:
${questions.hr?.map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None'}

BEHAVIORAL QUESTIONS:
${questions.behavioral?.map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None'}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-0.5 shadow-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  AI Interview Question Kit
                </h3>
                <p className="text-xs text-slate-400">
                  Tailored for <span className="text-indigo-300 font-semibold">{studentName}</span> • {jobTitle}
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

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
            {/* Candidate Match Score Bar */}
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-black text-lg">
                  {score}%
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">AI Candidate Alignment</h4>
                  <p className="text-xs text-indigo-300">
                    Questions generated based on target role requirements and student portfolio.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> High Match
              </span>
            </div>

            {/* Question Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white bg-slate-950/40'
                }`}
              >
                All Questions
              </button>
              <button
                onClick={() => setActiveTab('technical')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'technical'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white bg-slate-950/40'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-400" /> Technical ({questions.technical?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('hr')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'hr'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white bg-slate-950/40'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-amber-400" /> HR & Culture ({questions.hr?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('behavioral')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'behavioral'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white bg-slate-950/40'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Behavioral ({questions.behavioral?.length || 0})
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {/* Technical Questions */}
              {(activeTab === 'all' || activeTab === 'technical') && questions.technical?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" /> Technical Evaluation
                  </h4>
                  <div className="space-y-2">
                    {questions.technical.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0 border border-cyan-500/20">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-200 font-medium leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HR Questions */}
              {(activeTab === 'all' || activeTab === 'hr') && questions.hr?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Users className="w-4 h-4" /> HR & Cultural Fit
                  </h4>
                  <div className="space-y-2">
                    {questions.hr.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/20">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-200 font-medium leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Behavioral Questions */}
              {(activeTab === 'all' || activeTab === 'behavioral') && questions.behavioral?.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" /> STAR Method Behavioral Scenarios
                  </h4>
                  <div className="space-y-2">
                    {questions.behavioral.map((q, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3"
                      >
                        <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/20">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-200 font-medium leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
            <button
              onClick={handleCopyAll}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Questions'}</span>
            </button>

            <Button variant="primary" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AIInterviewQuestionsModal;
