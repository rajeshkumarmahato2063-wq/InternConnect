import React from 'react';
import { motion } from 'framer-motion';
import Badge from '../Badge/Badge';

const SectionTitle = ({
  badgeText,
  title,
  gradientTitle,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignmentStyles = {
    center: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col mb-12 sm:mb-16 ${alignmentStyles[align]} ${className}`}
    >
      {badgeText && (
        <Badge variant="accent" className="mb-4">
          {badgeText}
        </Badge>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
        {title}{' '}
        {gradientTitle && (
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {gradientTitle}
          </span>
        )}
      </h2>

      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
