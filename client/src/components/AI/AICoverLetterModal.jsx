import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Copy,
  CheckCircle2,
  Download,
  RefreshCw,
  FileText,
  Building,
  Briefcase,
  User,
  Zap,
} from 'lucide-react';
import Button from '../Button/Button';
import { coverLetterService } from '../../services/coverLetterService';
import { useAuth } from '../../context/AuthContext';

const AICoverLetterModal = ({
  isOpen,
  onClose,
  defaultJobTitle = '',
  defaultCompanyName = '',
  defaultSkills = [],
  internshipId = null,
}) => {
  const { user, profile } = useAuth();

  const [jobTitle, setJobTitle] = useState(defaultJobTitle || 'Software Engineering Intern');
  const [companyName, setCompanyName] = useState(defaultCompanyName || 'TechCorp');
  const [skills, setSkills] = useState(
    Array.isArray(defaultSkills) && defaultSkills.length > 0
      ? defaultSkills.join(', ')
      : (user?.skills || profile?.skills || ['React', 'Node.js', 'JavaScript', 'Git']).join(', ')
  );
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (defaultJobTitle) setJobTitle(defaultJobTitle);
    if (defaultCompanyName) setCompanyName(defaultCompanyName);
  }, [defaultJobTitle, defaultCompanyName]);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const letter = await coverLetterService.generate({
        studentId: user?.id,
        internshipId,
        studentName: user?.name || profile?.full_name || 'Aarav Sharma',
        studentCollege: user?.college || profile?.college || 'Indian Institute of Technology',
        studentDegree: user?.degree || profile?.degree || 'Computer Science & Engineering',
        studentSkills: parsedSkills,
        internshipTitle: jobTitle,
        companyName,
      });

      setGeneratedLetter(letter);
    } catch (err) {
      console.error('Failed to generate cover letter:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!generatedLetter) return;
    const cleanFileName = `${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_Cover_Letter`;
    coverLetterService.downloadPDF(generatedLetter, cleanFileName);
  };

  const charCount = generatedLetter.length;
  const wordCount = generatedLetter.trim() ? generatedLetter.trim().split(/\s+/).length : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
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
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl backdrop-blur-2xl overflow-hidden z-10"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white">AI Cover Letter Generator</h2>
                <p className="text-xs text-slate-400">
                  Instant ATS-optimized cover letter powered by Gemini API & Supabase
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

          {/* Scrollable Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Input Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Internship Role
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer Intern"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-purple-400" /> Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google, Microsoft"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" /> Key Skills
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, Git, Python"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Action Bar Above Preview */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleGenerate}
                  disabled={loading}
                  icon={loading ? RefreshCw : Sparkles}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold"
                >
                  {loading ? 'Generating with Gemini...' : generatedLetter ? 'Regenerate Letter' : 'Generate Cover Letter'}
                </Button>
              </div>

              {generatedLetter && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                    icon={copied ? CheckCircle2 : Copy}
                  >
                    {copied ? 'Copied!' : 'Copy Text'}
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleDownloadPDF}
                    icon={Download}
                    className="border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                  >
                    Download PDF
                  </Button>
                </div>
              )}
            </div>

            {/* Live Preview Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" /> Live Letter Preview
                </span>
                {generatedLetter && (
                  <span className="font-mono text-slate-400">
                    {charCount} chars | {wordCount} words
                  </span>
                )}
              </div>

              {loading ? (
                <div className="h-64 rounded-2xl bg-slate-950/80 border border-slate-800 p-8 flex flex-col items-center justify-center text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                  <p className="text-xs text-indigo-300 font-semibold animate-pulse">
                    Crafting personalized cover letter with Gemini AI Engine...
                  </p>
                </div>
              ) : (
                <textarea
                  rows={14}
                  value={
                    generatedLetter ||
                    'Click "Generate Cover Letter" above to craft a personalized, ATS-friendly cover letter powered by Gemini API and your student profile.'
                  }
                  onChange={(e) => setGeneratedLetter(e.target.value)}
                  className="w-full rounded-2xl bg-slate-950/90 border border-slate-800 p-5 text-xs sm:text-sm text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500/80 transition-colors shadow-inner"
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AICoverLetterModal;
