import React from 'react';
import type { Reflection } from '../types/reflection';
import { getDisplayScore } from '../utils';

/**
 * Props interface for the PinnedReflection component
 */
interface PinnedReflectionProps {
  /** The current reflection to display */
  reflection: Reflection | null;
  /** Whether to show the reflection text */
  showText?: boolean;
  /** Feedback data to display inline */
  feedback?: any;
  /** Optional click handler for editing */
  onEdit?: () => void;
}

/**
 * Pinned reflection banner component
 * Shows the current reflection in a sticky banner format
 */
export const PinnedReflection: React.FC<PinnedReflectionProps> = ({
  reflection,
  showText = true,
  feedback,
  onEdit,
}) => {
  if (!reflection) {
    return null;
  }

  return (
    <div 
      className={`bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg p-3 mb-4 sticky top-0 z-10 backdrop-blur-sm ${onEdit ? 'cursor-pointer hover:from-pink-500/30 hover:to-purple-500/30 transition-all' : ''}`}
      onClick={onEdit}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">📝</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <span className="text-pink-300 text-sm font-medium">Current Reflection</span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-400 text-xs">
                {new Date(reflection.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {/* Inline Score and Feedback */}
            {feedback && (
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className={`w-3 h-3 rounded-full flex items-center justify-center text-xs ${
                    feedback.status === 'excellent' || feedback.status === 'good' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {feedback.status === 'excellent' || feedback.status === 'good' ? '✓' : '!'}
                  </div>
                  <span className="text-white font-medium">{getDisplayScore(feedback.overallScore)}%</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    feedback.status === 'excellent' || feedback.status === 'good' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-orange-500/20 text-orange-300'
                  }`}>
                    {feedback.status === 'excellent' || feedback.status === 'good' ? 'Pass' : 'Needs Work'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`${feedback.feedback.happened.pass ? 'text-green-400' : 'text-orange-400'}`}>
                    {feedback.feedback.happened.pass ? '✓' : '!'} What
                  </span>
                  <span className={`${feedback.feedback.feeling.pass ? 'text-green-400' : 'text-orange-400'}`}>
                    {feedback.feedback.feeling.pass ? '✓' : '!'} Feel
                  </span>
                  <span className={`${feedback.feedback.next.pass ? 'text-green-400' : 'text-orange-400'}`}>
                    {feedback.feedback.next.pass ? '✓' : '!'} Next
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {showText && (
            <div className="text-slate-200 text-sm leading-relaxed">
              {reflection.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
