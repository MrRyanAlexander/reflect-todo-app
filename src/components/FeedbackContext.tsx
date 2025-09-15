import React from 'react';
import type { FeedbackContextProps } from '../types/reflection';
import { PinnedReflection } from './PinnedReflection';
import { getDisplayScore } from '../utils';

/**
 * Feedback context component for reflection evaluation display
 * Shows visual indicators, progress tracking, and actionable suggestions
 */
export const FeedbackContext: React.FC<FeedbackContextProps> = ({
  reflection,
  feedback,
  isLoading,
}) => {
  /**
   * Renders a compact feedback item
   */
  const renderFeedbackItem = (title: string, item: any) => {
    const isPassed = item.pass;
    
    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/30">
        {/* Status icon */}
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          isPassed 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-orange-500/20 text-orange-400'
        }`}>
          {isPassed ? '✓' : '!'}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-white">{title}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isPassed 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-orange-500/20 text-orange-300'
            }`}>
              {isPassed ? 'Good' : 'Needs Work'}
            </span>
          </div>
          
          {/* Suggestion */}
          {item.suggestions && item.suggestions.length > 0 && (
            <p className="text-xs text-slate-300">
              <span className="text-pink-400">💡</span> {item.suggestions[0]}
            </p>
          )}
        </div>
      </div>
    );
  };

  /**
   * Renders the compact overall score and status
   */
  const renderOverallScore = () => {
    if (!feedback) return null;

    const score = getDisplayScore(feedback.overallScore);
    const status = feedback.status;
    
    const getScoreColor = () => {
      if (score >= 80) return 'text-green-400';
      if (score >= 60) return 'text-yellow-400';
      return 'text-orange-400';
    };

    const getStatusText = () => {
      switch (status) {
        case 'excellent':
          return 'Pass';
        case 'good':
          return 'Pass';
        case 'needs-work':
        default:
          return 'Needs Work';
      }
    };

    const getStatusColor = () => {
      switch (status) {
        case 'excellent':
        case 'good':
          return 'bg-green-500/20 text-green-300';
        case 'needs-work':
        default:
          return 'bg-orange-500/20 text-orange-300';
      }
    };

    return (
      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            status === 'excellent' || status === 'good' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-orange-500/20 text-orange-400'
          }`}>
            {status === 'excellent' || status === 'good' ? '✓' : '!'}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Overall Score</h3>
            <p className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor()}`}>
            {score}%
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders loading state
   */
  const renderLoading = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Analyzing Your Reflection</h3>
      <p className="text-slate-400 text-sm">
        I'm reading through your reflection and providing feedback...
      </p>
    </div>
  );

  /**
   * Renders empty state when no reflection
   */
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">📊</span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">No Reflection to Review</h3>
      <p className="text-slate-400 text-sm">
        Write a reflection first, then I can provide feedback on it!
      </p>
    </div>
  );

  /**
   * Renders the feedback content
   */
  const renderFeedback = () => {
    if (!feedback) return null;

    return (
      <div className="space-y-4">
        {/* Overall Score */}
        {renderOverallScore()}

        {/* Individual Feedback Items */}
        <div className="space-y-2">
          {renderFeedbackItem(
            'What Happened Today',
            feedback.feedback.happened
          )}
          
          {renderFeedbackItem(
            'How You Felt',
            feedback.feedback.feeling
          )}
          
          {renderFeedbackItem(
            'What You Plan to Do Next',
            feedback.feedback.next
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Pinned Reflection Banner */}
      <PinnedReflection reflection={reflection} showText={false} />

      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">📊</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Reflection Feedback</h2>
          <p className="text-slate-400 text-sm">
            {reflection ? 'Here\'s how you\'re doing' : 'Create a reflection to see feedback'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {isLoading ? (
          renderLoading()
        ) : !reflection ? (
          renderEmptyState()
        ) : (
          renderFeedback()
        )}
      </div>
    </div>
  );
};
