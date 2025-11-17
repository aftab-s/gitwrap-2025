
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'w-5 h-5 border-2' : 'w-12 h-12 border-4';
  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses} border-purple-400 border-t-transparent`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
