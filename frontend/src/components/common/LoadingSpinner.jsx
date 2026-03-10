import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  const colors = {
    primary: 'border-primary-200 border-t-primary-600',
    white: 'border-white/20 border-t-white',
    gray: 'border-gray-200 border-t-gray-600'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`
        ${sizes[size]}
        border-4
        ${colors[color]}
        rounded-full
        animate-spin
        shadow-xl
      `}></div>
    </div>
  );
};

export default LoadingSpinner;