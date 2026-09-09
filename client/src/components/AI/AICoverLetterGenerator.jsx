import React, { useState } from 'react';
import { Sparkles, Copy, CheckCircle2, Download, FileText, Send } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { useAuth } from '../../context/AuthContext';

const AICoverLetterGenerator = () => {
  const { user } = useAuth();
  const [jobTitle, setJobTitle] = useState('Full Stack Engineering Intern');
  const [companyName, setCompanyName] = useState('Google');
  const [keySkills, setKeySkills] = useState('React.js, Node.js, TypeScript, Cloud Deployment');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate AI generation with custom inputs
    setTimeout(() => {
      const letter = `Dear Hiring Manager at ${companyName},

I am writing to express my strong enthusiasm for the ${jobTitle} position. As a dedicated student from ${user?.college || 'University'} specializing in ${user?.degree || 'Computer Science'}, my technical background in ${keySkills} aligns directly with ${companyName}'s innovation standards.

During my academic coursework and personal software projects, I built high-performance web applications using modern full-stack architectures. Applying automated testing, REST API design, and responsive user interface engineering allowed me to develop a disciplined engineering workflow.

${companyName}'s leadership in scalable technology inspires me, and I am eager to contribute my technical skills, problem-solving mindset, and dedication to your engineering team.

Thank you for your time and consideration. I look forward to discussing how my background aligns with your upcoming internship goals.

Sincerely,
${user?.name || 'Aarav Sharma'}
${user?.email || 'student@university.edu'}`;

      setGeneratedLetter(letter);
      setIsGenerating(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card variant="glass" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Cover Letter Generator</h3>
            <p className="text-xs text-slate-400">Instantly generate personalized, ATS-optimized cover letters for any job role</p>
          </div>
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
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
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
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
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
              className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" disabled={isGenerating} icon={Sparkles}>
              {isGenerating ? 'Generating Letter...' : 'Generate AI Cover Letter'}
            </Button>
          </div>
        </form>

        {generatedLetter && (
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> Tailored Cover Letter Output
              </h4>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Cover Letter'}</span>
              </button>
            </div>

            <textarea
              rows={12}
              value={generatedLetter}
              onChange={(e) => setGeneratedLetter(e.target.value)}
              className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default AICoverLetterGenerator;
