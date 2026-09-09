import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';
import { MOCK_INTERNSHIPS } from '../../services/mockData';

const AIRecommendationEngine = () => {
  const { user } = useAuth();
  const [selectedJobId, setSelectedJobId] = useState(MOCK_INTERNSHIPS[0].id);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectedJob = MOCK_INTERNSHIPS.find((j) => j.id === selectedJobId) || MOCK_INTERNSHIPS[0];

  const runRecommendation = async () => {
    setLoading(true);
    const res = await aiService.calculateJobMatch(user?.skills || [], selectedJob.skills);
    setMatchData(res);
    setLoading(false);
  };

  useEffect(() => {
    runRecommendation();
  }, [selectedJobId]);

  return (
    <Card variant="glass" className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" /> AI Resume-to-Job Match Engine
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Compare your profile against target internship listings to identify skill gaps.
          </p>
        </div>

        {/* Select Target Job */}
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          {MOCK_INTERNSHIPS.map((j) => (
            <option key={j.id} value={j.id}>
              {j.companyName} - {j.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-300">Evaluating skill vector overlap...</div>
      ) : matchData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Match Score Card */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-purple-950/80 border border-indigo-500/30 flex flex-col items-center justify-center text-center">
            <span className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-2">
              Match Accuracy
            </span>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              {matchData.matchPercentage}%
            </div>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              Target: {selectedJob.title} @ {selectedJob.companyName}
            </p>
          </div>

          {/* Skill Gaps & Matched Skills */}
          <div className="lg:col-span-8 space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                <Check className="w-4 h-4" /> Matching Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchData.matchingSkills.map((sk) => (
                  <span key={sk} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {matchData.missingSkills.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-4 h-4" /> Missing Skill Gaps
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {matchData.missingSkills.map((sk) => (
                    <span key={sk} className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 text-xs font-semibold border border-rose-500/30">
                      ! {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Upskilling Courses */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5 mb-2">
                <BookOpen className="w-4 h-4" /> Recommended AI Upskilling Courses
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {matchData.recommendedCourses.map((c, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span>• {c}</span>
                    <span className="text-indigo-400 font-semibold cursor-pointer hover:underline">
                      Enroll &rarr;
                    </span>
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

export default AIRecommendationEngine;
