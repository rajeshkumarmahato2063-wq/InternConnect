import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles, Layout, FileText, Check, Plus, Trash2 } from 'lucide-react';
import Button from '../Button/Button';
import Card from '../Card/Card';
import { useAuth } from '../../context/AuthContext';

const AIResumeBuilder = () => {
  const { user } = useAuth();
  const [template, setTemplate] = useState('modern'); // modern, classic, minimal
  const [fullName, setFullName] = useState(user?.name || 'Aarav Sharma');
  const [email, setEmail] = useState(user?.email || 'aarav.sharma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [college, setCollege] = useState(user?.college || 'IIT Delhi');
  const [degree, setDegree] = useState(user?.degree || 'B.Tech in Computer Science');
  const [skills, setSkills] = useState(user?.skills || ['React.js', 'Node.js', 'Python', 'TypeScript', 'Tailwind CSS']);
  const [newSkill, setNewSkill] = useState('');
  const [summary, setSummary] = useState(
    'Ambitious Software Engineering student with expertise in React, TypeScript, and full-stack web applications. Demonstrated ability to deliver clean, production-ready code.'
  );

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleDownloadPDF = () => {
    alert('Simulating ATS-optimized PDF generation and download...');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form Controls */}
      <div className="lg:col-span-6 space-y-6">
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" /> AI Resume Builder
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              ATS Compliant
            </span>
          </div>

          {/* Template Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Template
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['modern', 'classic', 'minimal'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTemplate(t)}
                  className={`p-2.5 rounded-xl text-xs font-bold capitalize transition-all border ${
                    template === t
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {t} Layout
                </button>
              ))}
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Degree</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Professional Summary</label>
              <textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Technical Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill (e.g. Docker)"
                  className="flex-1 rounded-xl bg-slate-800 border border-slate-700 p-2 text-sm text-white focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button variant="secondary" size="sm" onClick={addSkill} icon={Plus}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1"
                  >
                    {sk}
                    <button type="button" onClick={() => removeSkill(sk)} className="hover:text-rose-400">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <Button variant="primary" size="md" icon={Download} onClick={handleDownloadPDF}>
              Download ATS Resume PDF
            </Button>
          </div>
        </Card>
      </div>

      {/* Right Column: Live Resume Preview Paper */}
      <div className="lg:col-span-6">
        <div className="sticky top-24">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Live Resume Preview</span>
            <span className="text-indigo-400 font-bold">{template.toUpperCase()} STYLE</span>
          </div>

          <div className="rounded-2xl bg-white text-slate-900 p-8 shadow-2xl min-h-[550px] border border-slate-300 font-sans text-xs space-y-4">
            {/* Header */}
            <div className="border-b pb-3 text-center">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{fullName}</h1>
              <p className="text-slate-600 text-[11px] mt-1">
                {email} • {phone} • {college}
              </p>
            </div>

            {/* Summary */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-200 pb-1 mb-1">
                Professional Summary
              </h2>
              <p className="text-slate-700 leading-relaxed">{summary}</p>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-200 pb-1 mb-1">
                Education
              </h2>
              <div className="flex justify-between font-semibold">
                <span>{college}</span>
                <span className="text-slate-500">2021 - 2025</span>
              </div>
              <p className="text-slate-600">{degree}</p>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-200 pb-1 mb-1">
                Core Technical Skills
              </h2>
              <p className="text-slate-700 leading-relaxed font-medium">
                {skills.join(' • ')}
              </p>
            </div>

            {/* Projects preview */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-200 pb-1 mb-1">
                Key Projects & Experience
              </h2>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between font-semibold">
                    <span>InternConnect AI Platform</span>
                    <span className="text-slate-500">React, Node.js, Tailwind</span>
                  </div>
                  <p className="text-slate-600">
                    Engineered full-stack internship portal with AI resume matching algorithms and interactive candidate dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResumeBuilder;
