import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, ArrowRight } from 'lucide-react';

const RoleCard = ({ type, title, description, badge, onClick }) => {
  const isStudent = type === 'student';

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        p-8 rounded-3xl cursor-pointer border transition-all duration-300 relative overflow-hidden group
        ${
          isStudent
            ? 'bg-gradient-to-b from-slate-900/90 to-blue-950/80 border-indigo-500/30 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/20'
            : 'bg-gradient-to-b from-slate-900/90 to-purple-950/80 border-purple-500/30 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20'
        }
      `}
    >
      {/* Background Subtle Blur Glow */}
      <div
        className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
          isStudent ? 'bg-blue-600/20' : 'bg-purple-600/20'
        }`}
      />

      <div className="flex items-center justify-between mb-6">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border transition-transform duration-300 group-hover:scale-110 ${
            isStudent
              ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
              : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
          }`}
        >
          {isStudent ? <GraduationCap className="w-9 h-9" /> : <Building2 className="w-9 h-9" />}
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800/80 text-slate-300 border border-white/10">
          {badge}
        </span>
      </div>

      <h3 className="text-2xl font-extrabold text-white mb-2 group-hover:text-indigo-300 transition-colors">
        {title}
      </h3>
      <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
        {description}
      </p>

      <div className="flex items-center gap-2 text-sm font-bold text-indigo-400 group-hover:text-indigo-300">
        <span>Continue as {isStudent ? 'Student' : 'Company'}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
};

export default RoleCard;
