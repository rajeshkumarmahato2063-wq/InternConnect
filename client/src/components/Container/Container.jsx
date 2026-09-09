import React from 'react';

const Container = ({
  children,
  className = '',
  size = 'default',
}) => {
  const sizeStyles = {
    default: 'max-w-7xl',
    narrow: 'max-w-4xl',
    wide: 'max-w-8xl',
  };

  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${sizeStyles[size]} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
