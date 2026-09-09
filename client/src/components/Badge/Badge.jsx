import React from 'react';

const Badge = ({
  children,
  variant = 'gradient',
  icon: Icon = null,
  className = '',
}) => {
  const variantStyles = {
    gradient: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10',
    purple: 'bg-purple-500/10 text-purple-300 border border-purple-500/30',
    green: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
    glass: 'bg-slate-800/60 backdrop-blur-md text-slate-300 border border-white/10',
    accent: 'bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 text-indigo-200 border border-indigo-400/30',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full tracking-wide uppercase
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
};

export default Badge;
