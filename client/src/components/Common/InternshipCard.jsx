import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, DollarSign, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import Card from '../Card/Card';
import Button from '../Button/Button';
import SaveButton from './SaveButton';
import SkillChip from './SkillChip';

const InternshipCard = ({ job, isSaved, isApplied, isSelected, onClick, onToggleSave, onApply }) => {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full cursor-pointer" onClick={() => onClick?.(job)}>
      <Card 
        variant="glass" 
        hoverable={false} 
        className={`p-5 sm:p-6 space-y-4 flex flex-col justify-between h-full transition-all ${
          isSelected 
            ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] bg-slate-800/80' 
            : 'border-slate-800 hover:border-indigo-500/40 bg-slate-900/60'
        }`}
      >
        <div className="space-y-4">
          {/* Top Row: Logo, Company & Match Score Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <img
                src={job.companyLogo || job.company_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80'}
                alt={job.companyName || job.company_name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-contain bg-white p-1.5 shadow-md shrink-0 border border-slate-700"
              />
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                  {job.companyName || job.company_name || 'Tech Company'}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white leading-snug hover:text-indigo-300 transition-colors line-clamp-1">
                  {job.title}
                </h3>
              </div>
            </div>

            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 shrink-0">
              <Award className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">{job.matchScore || 92}% Match</span>
              <span className="sm:hidden">{job.matchScore || 92}%</span>
            </span>
          </div>

          {/* Key Details Pills */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] sm:text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              {job.location}
            </span>
            <span className="flex items-center gap-1 font-semibold text-emerald-400">
              <DollarSign className="w-3.5 h-3.5 shrink-0" />
              {job.stipend}
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] sm:text-[11px] font-medium border border-slate-700">
              {job.workMode || job.work_mode}
            </span>
            <span className="flex items-center gap-1 text-slate-400 text-[10px] sm:text-[11px]">
              <Clock className="w-3 h-3 text-slate-400" />
              {job.duration}
            </span>
          </div>

          {/* Skills Chips */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {job.skills.slice(0, 3).map((sk) => (
                <SkillChip key={sk} skill={sk} size="xs" />
              ))}
              {job.skills.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-xl bg-slate-800 text-slate-400 text-[10px]">
                  +{job.skills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer: Deadline, Save Button, Apply Button */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
          <div className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-indigo-400" />
            <span className="truncate max-w-[100px] sm:max-w-none">Ends: {job.deadline || 'Soon'}</span>
          </div>

          <div className="flex items-center gap-2">
            <div onClick={(e) => e.stopPropagation()}>
              <SaveButton isSaved={isSaved} onToggle={onToggleSave} size="sm" showText={false} />
            </div>
            
            <div onClick={(e) => e.stopPropagation()}>
              {isApplied ? (
                <button
                  disabled
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold cursor-not-allowed"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Applied
                </button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onApply?.(job)}
                  icon={ArrowRight}
                  className="px-3 py-1.5 text-[11px]"
                >
                  Apply
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default InternshipCard;
