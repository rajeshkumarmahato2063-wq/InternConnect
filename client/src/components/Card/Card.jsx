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
    glass: 'bg-slate-900/60 backdrop-blur-xl border border-white/10 text-slate-100 shadow-xl shadow-black/20',
    default: 'bg-slate-900 border border-slate-800 text-slate-100 shadow-lg',
    elevated: 'bg-gradient-to-b from-slate-800/80 to-slate-900/90 backdrop-blur-xl border border-indigo-500/20 text-slate-100 shadow-2xl shadow-indigo-950/40',
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
