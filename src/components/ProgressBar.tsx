import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red';
}

export function ProgressBar({ progress, className = '', showLabel = false, color = 'blue' }: ProgressBarProps) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}