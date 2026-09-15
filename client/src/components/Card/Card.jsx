import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  variant = 'glass',
  hoverable = true,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'rounded-2xl p-6 transition-all duration-300 relative overflow-hidden';

  const variantStyles = {
    glass: 'bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-slate-100 shadow-xl shadow-slate-200/50 dark:shadow-black/20',
    default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-lg shadow-slate-200/50 dark:shadow-none',
    elevated: 'bg-gradient-to-b from-white to-slate-50 dark:from-slate-800/80 dark:to-slate-900/90 backdrop-blur-xl border border-indigo-500/20 text-slate-900 dark:text-slate-100 shadow-2xl shadow-indigo-500/10 dark:shadow-indigo-950/40',
  };

  const hoverStyles = hoverable
    ? 'hover:border-indigo-500/50 hover:shadow-indigo-500/10 hover:-translate-y-1.5 cursor-pointer'
    : '';

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${hoverStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
