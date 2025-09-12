import React from 'react';

/**
 * Props interface for the Stats component
 */
interface StatsProps {
  /** Total number of todos */
  total: number;
  /** Number of completed todos */
  completed: number;
}

/**
 * Component that displays todo statistics
 */
export const Stats: React.FC<StatsProps> = ({ total, completed }) => {
  // Don't render if there are no todos
  if (total === 0) {
    return null;
  }

  return (
    <div className="mt-6 text-center">
      <p className="text-slate-300">
        You have <span className="text-pink-300 font-semibold">{total}</span> todos, 
        <span className="text-green-300 font-semibold"> {completed}</span> completed
      </p>
    </div>
  );
};
