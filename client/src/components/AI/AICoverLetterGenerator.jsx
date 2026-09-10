import React, { useState } from 'react';
import { Sparkles, Copy, CheckCircle2, Download, FileText, RefreshCw, Zap } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import AICoverLetterModal from './AICoverLetterModal';
import { coverLetterService } from '../../services/coverLetterService';
import { useAuth } from '../../context/AuthContext';

const AICoverLetterGenerator = () => {
  const { user, profile } = useAuth();
  const [jobTitle, setJobTitle] = useState('Full Stack Engineering Intern');
  const [companyName, setCompanyName] = useState('Google');
  const [keySkills, setKeySkills] = useState('React.js, Node.js, TypeScript, Cloud Deployment');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const parsedSkills = keySkills.split(',').map((s) => s.trim()).filter(Boolean);
      const letter = await coverLetterService.generate({
        studentId: user?.id,
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
      setIsGenerating(false);
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
    coverLetterService.downloadPDF(generatedLetter, `${companyName}_Cover_Letter`);
  };

  const charCount = generatedLetter.length;
  const wordCount = generatedLetter.trim() ? generatedLetter.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6">
      <Card variant="glass" className="p-6 sm:p-8 space-y-6 border border-indigo-500/20 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Cover Letter Generator</h3>
              <p className="text-xs text-slate-400">
                Generate personalized, ATS-optimized cover letters powered by Gemini API & Supabase
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowModal(true)}
            icon={Zap}
            className="hidden sm:inline-flex border-indigo-500/30 text-indigo-300"
          >
            Open Fullscreen Modal
          </Button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase text-slate-300 mb-1">Target Job Title</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Backend Software Engineer Intern"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Microsoft, Google..."
                className="w-full rounded-xl bg-slate-900 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold uppercase text-slate-300 mb-1">Key Tech Skills & Highlights</label>
            <input
              type="text"
              required
              value={keySkills}
              onChange={(e) => setKeySkills(e.target.value)}
              placeholder="e.g. React.js, Node.js, Python, PostgreSQL"
              className="w-full rounded-xl bg-slate-900 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setShowModal(true)}
              icon={Zap}
              className="sm:hidden"
            >
              Modal View
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isGenerating}
              icon={isGenerating ? RefreshCw : Sparkles}
              className="ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold"
            >
              {isGenerating ? 'Generating with Gemini...' : generatedLetter ? 'Regenerate Cover Letter' : 'Generate Cover Letter'}
            </Button>
          </div>
        </form>

        {generatedLetter && (
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" /> Tailored Cover Letter
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  {charCount} Chars | {wordCount} Words
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            <textarea
              rows={12}
              value={generatedLetter}
              onChange={(e) => setGeneratedLetter(e.target.value)}
              className="w-full rounded-2xl bg-slate-950/90 border border-slate-800 p-4 text-xs sm:text-sm text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </Card>

      {/* Fullscreen Glassmorphism Modal */}
      <AICoverLetterModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        defaultJobTitle={jobTitle}
        defaultCompanyName={companyName}
        defaultSkills={keySkills.split(',').map((s) => s.trim()).filter(Boolean)}
      />
    </div>
  );
};

export default AICoverLetterGenerator;
