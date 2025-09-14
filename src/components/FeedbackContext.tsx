import React from 'react';
import { FiCheck, FiAlertCircle, FiTrendingUp, FiTarget } from 'react-icons/fi';
import type { FeedbackContextProps } from '../types/reflection';

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
   * Renders a feedback item with status indicator
   */
  const renderFeedbackItem = (title: string, item: any, icon: React.ReactNode) => {
    const isPassed = item.pass;
    
    return (
      <div className={`p-4 rounded-xl border ${
        isPassed 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-orange-500/10 border-orange-500/30'
      }`}>
        <div className="flex items-start space-x-3">
          {/* Status icon */}
          <div className={`p-2 rounded-full ${
            isPassed 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-orange-500/20 text-orange-400'
          }`}>
            {icon}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-2">{title}</h4>
            <p className={`text-sm mb-2 ${
              isPassed ? 'text-green-300' : 'text-orange-300'
            }`}>
              {item.remarks}
            </p>
            
            {/* Suggestions */}
            {item.suggestions && item.suggestions.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-400 mb-2">Suggestions:</p>
                <ul className="space-y-1">
                  {item.suggestions.map((suggestion: string, index: number) => (
                    <li key={index} className="text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-pink-400 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders the overall score and status
   */
  const renderOverallScore = () => {
    if (!feedback) return null;

    const score = feedback.overallScore;
    const status = feedback.status;
    
    const getScoreColor = () => {
      if (score >= 80) return 'text-green-400';
      if (score >= 60) return 'text-yellow-400';
      return 'text-orange-400';
    };

    const getStatusIcon = () => {
      switch (status) {
        case 'excellent':
          return <FiTrendingUp className="w-5 h-5 text-green-400" />;
        case 'good':
          return <FiCheck className="w-5 h-5 text-blue-400" />;
        case 'needs-work':
        default:
          return <FiTarget className="w-5 h-5 text-orange-400" />;
      }
    };

    const getStatusText = () => {
      switch (status) {
        case 'excellent':
          return 'Excellent work!';
        case 'good':
          return 'Good job!';
        case 'needs-work':
        default:
          return 'Keep working on it!';
      }
    };

    return (
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Overall Score</h3>
          {getStatusIcon()}
        </div>
        
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor()} mb-2`}>
            {score}%
          </div>
          <p className="text-slate-300 font-medium">{getStatusText()}</p>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
              }`}
              style={{ width: `${score}%` }}
            />
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
      <div className="space-y-6">
        {/* Overall Score */}
        {renderOverallScore()}

        {/* Individual Feedback Items */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Detailed Feedback</h3>
          
          {renderFeedbackItem(
            'What Happened Today',
            feedback.feedback.happened,
            <FiCheck className="w-4 h-4" />
          )}
          
          {renderFeedbackItem(
            'How You Felt',
            feedback.feedback.feeling,
            <FiCheck className="w-4 h-4" />
          )}
          
          {renderFeedbackItem(
            'What You Plan to Do Next',
            feedback.feedback.next,
            <FiCheck className="w-4 h-4" />
          )}
        </div>

        {/* General Suggestions */}
        {feedback.suggestions && feedback.suggestions.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <FiAlertCircle className="w-5 h-5 text-blue-400" />
              <span>General Suggestions</span>
            </h3>
            <ul className="space-y-3">
              {feedback.suggestions.map((suggestion: string, index: number) => (
                <li key={index} className="text-slate-300 flex items-start space-x-3">
                  <span className="text-pink-400 mt-1">💡</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
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
