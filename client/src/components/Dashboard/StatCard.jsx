import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'indigo', subtitle }) => {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    const numericVal = typeof value === 'number' ? value : parseInt(value, 10);
    if (isNaN(numericVal)) {
      setDisplayVal(value);
      return;
    }

    let start = 0;
    const steps = 30;
    const increment = Math.max(1, Math.ceil(numericVal / steps));
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericVal) {
        setDisplayVal(numericVal);
        clearInterval(timer);
      } else {
        setDisplayVal(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [value]);

  const colorStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl flex flex-col justify-between hover:border-indigo-500/40 transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-2xl border ${colorStyles[color]} group-hover:scale-110 transition-transform`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
          {typeof displayVal === 'number' ? displayVal.toLocaleString() : displayVal}
        </h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default StatCard;
