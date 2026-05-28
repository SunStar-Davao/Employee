import React from 'react';

const LoadingSpinner = ({ color = '#1f2937', size = 'large', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xl: 'w-10 h-10',
  };
  
  const borderSizes = {
    small: 'border',
    medium: 'border',
    large: 'border-2',
    xl: 'border-2',
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div
        className={`${sizeClasses[size]} ${borderSizes[size]} border-gray-200 rounded-full animate-spin`}
        style={{ borderTopColor: color, borderRightColor: color }}
      ></div>
      {message && (
        <p className="mt-3 text-xs text-gray-400">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;