import React from 'react';

/**
 * Props interface for the Stats component
 */
interface StatsProps {
  /** Total number of reflections */
  total: number;
  /** Number of passed reflections */
  completed: number;
  /** Number of pending reflections */
  pending: number;
  /** Number of in-progress reflections */
  inProgress: number;
}

/**
 * Component that displays reflection statistics
 */
export const Stats: React.FC<StatsProps> = ({ total, completed, pending, inProgress }) => {
  // Don't render if there are no reflections
  if (total === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-pink-500/20 p-3">
      <div className="text-center">
        <h3 className="text-sm font-semibold text-white mb-2">Your Progress</h3>
        <div className="grid grid-cols-4 gap-2">
          {/* Total */}
          <div className="text-center">
            <div className="text-lg font-bold text-pink-300">{total}</div>
            <div className="text-xs text-slate-400">Total</div>
          </div>
          
          {/* Passed */}
          <div className="text-center">
            <div className="text-lg font-bold text-green-300">{completed}</div>
            <div className="text-xs text-slate-400">Passed</div>
          </div>
          
          {/* In Progress */}
          <div className="text-center">
            <div className="text-lg font-bold text-blue-300">{inProgress}</div>
            <div className="text-xs text-slate-400">In Progress</div>
          </div>
          
          {/* Pending */}
          <div className="text-center">
            <div className="text-lg font-bold text-orange-300">{pending}</div>
            <div className="text-xs text-slate-400">Pending</div>
          </div>
        </div>
        
        {/* Progress bar */}
        {total > 0 && (
          <div className="mt-2">
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div 
                className="h-1.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(completed / total) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {Math.round((completed / total) * 100)}% completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
