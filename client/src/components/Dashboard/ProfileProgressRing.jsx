import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, FileText, Code, Github, Linkedin, Globe } from 'lucide-react';

const ProfileProgressRing = ({ profile, percentage: initialPercentage = 0 }) => {
  // Calculate dynamic completion if profile is provided
  let calculatedPercentage = initialPercentage;

  if (profile) {
    let score = 0;
    if (profile.resume_url) score += 25;
    if (profile.skills && profile.skills.length > 0) score += 25;
    if (profile.github) score += 15;
    if (profile.linkedin) score += 15;
    if (profile.portfolio) score += 20;
    calculatedPercentage = score;
  }

  const strokeWidth = 8;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calculatedPercentage / 100) * circumference;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 flex flex-col lg:flex-row items-center gap-6 shadow-xl">
      {/* SVG Ring */}
      <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="text-slate-800"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            className="text-indigo-500"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black text-white">{calculatedPercentage}%</span>
          <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Complete</span>
        </div>
      </div>

      {/* Message & Status */}
      <div className="flex-1 text-center lg:text-left space-y-2">
        <div className="flex items-center justify-center lg:justify-start gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Profile Score
          </span>
        </div>
        <h3 className="text-lg font-bold text-white">
          {calculatedPercentage >= 90
            ? '🔥 Top 5% Elite Candidate Profile!'
            : calculatedPercentage >= 75
            ? '🚀 Strong Profile! Ready for Recruiter Referrals.'
            : '⚡ Complete your resume & links to boost matches!'}
        </h3>
        
        {/* Breakdown Items */}
        {profile && (
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-[11px]">
            <span className={`flex items-center space-x-1 ${profile.resume_url ? 'text-emerald-400' : 'text-slate-500'}`}>
              <CheckCircle2 className="w-3 h-3" />
              <span>Resume (+25%)</span>
            </span>
            <span className={`flex items-center space-x-1 ${profile.skills?.length > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
              <CheckCircle2 className="w-3 h-3" />
              <span>Skills (+25%)</span>
            </span>
            <span className={`flex items-center space-x-1 ${profile.github ? 'text-emerald-400' : 'text-slate-500'}`}>
              <CheckCircle2 className="w-3 h-3" />
              <span>GitHub (+15%)</span>
            </span>
            <span className={`flex items-center space-x-1 ${profile.linkedin ? 'text-emerald-400' : 'text-slate-500'}`}>
              <CheckCircle2 className="w-3 h-3" />
              <span>LinkedIn (+15%)</span>
            </span>
            <span className={`flex items-center space-x-1 ${profile.portfolio ? 'text-emerald-400' : 'text-slate-500'}`}>
              <CheckCircle2 className="w-3 h-3" />
              <span>Portfolio (+20%)</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileProgressRing;

