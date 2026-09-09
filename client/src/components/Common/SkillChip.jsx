import React from 'react';

const SkillChip = ({ skill, variant = 'default', size = 'sm' }) => {
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';

  const variantClasses =
    variant === 'indigo'
      ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
      : variant === 'emerald'
      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      : 'bg-slate-800 text-indigo-300 border-slate-700';

  return (
    <span className={`rounded-xl font-semibold border ${sizeClasses} ${variantClasses} inline-block transition-all hover:scale-105`}>
      {skill}
    </span>
  );
};

export default SkillChip;
