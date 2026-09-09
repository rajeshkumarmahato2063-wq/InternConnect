import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, CheckCircle2, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';
import Button from '../Button/Button';
import Card from '../Card/Card';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';

const AIResumeScore = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const runAnalysis = async () => {
    setLoading(true);
    const result = await aiService.analyzeResume(user?.skills || [], user?.experience?.length || 1);
    setAnalysis(result);
    setLoading(false);
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  return (
    <Card variant="glass" className="p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" /> AI Resume Score & ATS Audit
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Automated keyword matching, formatting evaluation, and skill gap report.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={runAnalysis}
          disabled={loading}
          icon={RefreshCw}
        >
          {loading ? 'Analyzing...' : 'Re-Scan Resume'}
        </Button>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-slate-300 text-sm font-semibold">AI is analyzing ATS compatibility & keywords...</p>
        </div>
      ) : analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Score Gauge Circle */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  initial={{ strokeDasharray: '0, 100' }}
                  animate={{ strokeDasharray: `${analysis.score}, 100` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="text-indigo-500"
                  strokeWidth="3.5"
                  strokeDasharray={`${analysis.score}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold text-white">{analysis.score}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">/ 100 ATS</span>
              </div>
            </div>
            <span className="mt-4 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              Excellent Candidate Match
            </span>
          </div>

          {/* Breakdown Reports */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4" /> Top Resume Strengths
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {analysis.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" /> Areas for Improvement
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {analysis.weaknesses.map((wk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
              <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-4 h-4" /> AI Recommendations
              </h4>
              <ul className="space-y-1 text-xs text-slate-300">
                {analysis.suggestions.map((sug, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      ) : null}
    </Card>
  );
};

export default AIResumeScore;
