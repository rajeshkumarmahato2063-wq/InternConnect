import React from 'react';

const UserAvatar = ({ name, email, src, size = 'md', className = '' }) => {
  const getInitials = () => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    if (email && email.trim()) {
      return email.trim()[0].toUpperCase();
    }
    return 'U';
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 text-xl font-bold',
    '2xl': 'w-24 h-24 text-3xl font-extrabold',
  };

  const isCustomImage = src && typeof src === 'string' && src.startsWith('http') && !src.includes('unsplash.com');

  if (isCustomImage) {
    return (
      <img
        src={src}
        alt={name || 'User Avatar'}
        className={`rounded-full object-cover shrink-0 border border-slate-700/80 ${sizeClasses[size] || sizeClasses.md} ${className}`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  const initials = getInitials();

  return (
    <div
      className={`rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold flex items-center justify-center shrink-0 shadow-md border border-indigo-400/30 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
      title={name || email || 'User Profile'}
    >
      <span>{initials}</span>
    </div>
  );
};

export default UserAvatar;
