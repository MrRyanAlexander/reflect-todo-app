import React, { useState, useEffect } from 'react';
import { FiSave, FiSend, FiEdit3, FiCheck, FiAlertCircle } from 'react-icons/fi';
import type { WriteEditContextProps } from '../types/reflection';
import { ReflectionStatus } from '../types/reflection';
import { countSentences, getReflectionValidationError } from '../utils/validation';

/**
 * Write/Edit context component for reflection writing
 * Provides text area, validation, draft saving, and submit functionality
 */
export const WriteEditContext: React.FC<WriteEditContextProps> = ({
  reflectionText,
  onTextChange,
  onSubmit,
  onSaveDraft,
  isSubmitting,
  status,
}) => {
  const [localText, setLocalText] = useState(reflectionText);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Update local text when prop changes
  useEffect(() => {
    setLocalText(reflectionText);
    setHasUnsavedChanges(false);
  }, [reflectionText]);

  /**
   * Handles text changes
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalText(newText);
    setHasUnsavedChanges(newText !== reflectionText);
    
    // Validate text
    const error = getReflectionValidationError(newText);
    setValidationError(error);
    
    // Call parent onChange
    onTextChange(newText);
  };

  /**
   * Handles saving draft
   */
  const handleSaveDraft = () => {
    if (localText.trim()) {
      onSaveDraft();
      setHasUnsavedChanges(false);
    }
  };

  /**
   * Handles submitting reflection
   */
  const handleSubmit = () => {
    if (!validationError && localText.trim()) {
      onSubmit();
      setHasUnsavedChanges(false);
    }
  };

  /**
   * Gets status display information
   */
  const getStatusDisplay = () => {
    switch (status) {
      case ReflectionStatus.PASSED:
        return {
          icon: FiCheck,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          label: 'Passed',
          message: 'Great job! Your reflection meets all requirements.'
        };
      case ReflectionStatus.IN_PROGRESS:
        return {
          icon: FiEdit3,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          label: 'In Progress',
          message: 'Keep working on your reflection!'
        };
      case ReflectionStatus.PENDING:
      default:
        return {
          icon: FiAlertCircle,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/30',
          label: 'Pending',
          message: 'Start writing your reflection below.'
        };
    }
  };

  /**
   * Gets word and sentence count
   */
  const getTextStats = () => {
    const words = localText.trim() ? localText.trim().split(/\s+/).length : 0;
    const sentences = countSentences(localText);
    return { words, sentences };
  };

  /**
   * Checks if text meets requirements
   */
  const meetsRequirements = () => {
    const { sentences } = getTextStats();
    return sentences >= 3 && sentences <= 4 && !validationError;
  };

  const statusDisplay = getStatusDisplay();
  const StatusIcon = statusDisplay.icon;
  const { words, sentences } = getTextStats();
  const canSubmit = meetsRequirements() && !isSubmitting;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Compact Header with Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg">✏️</span>
          <h2 className="text-lg font-semibold text-white">Write Your Reflection</h2>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusDisplay.bgColor} ${statusDisplay.borderColor}`}>
          <StatusIcon className={`w-4 h-4 ${statusDisplay.color}`} />
          <span className={`text-sm font-medium ${statusDisplay.color}`}>
            {statusDisplay.label}
          </span>
        </div>
      </div>

      {/* Writing area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Text area - fills available space */}
        <div className="flex-1 mb-3 min-h-0">
          <textarea
            value={localText}
            onChange={handleTextChange}
            placeholder="Today I went to school and had a test. I felt nervous but I think I did okay. Tomorrow I will study more for the next test."
            className="w-full h-full px-4 py-4 bg-slate-700/50 border border-pink-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all resize-none text-lg leading-relaxed font-medium"
            maxLength={1000}
            aria-label="Reflection text input"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          />
        </div>

        {/* Compact stats and requirements in one row */}
        <div className="space-y-2">
          {/* Stats and requirements in one compact row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4 text-slate-400">
              <span>{words} words</span>
              <span>{sentences} sentences</span>
              <span className={sentences >= 3 && sentences <= 4 ? 'text-green-400' : 'text-orange-400'}>
                {sentences >= 3 && sentences <= 4 ? '✓ Good length' : 'Need 3-4 sentences'}
              </span>
            </div>
            <div className="text-slate-400">
              {localText.length}/1000
            </div>
          </div>

          {/* Compact requirements checklist */}
          <div className="flex items-center space-x-6 text-xs">
            <span className="text-slate-400">Requirements:</span>
            <div className={`flex items-center space-x-1 ${
              localText.toLowerCase().includes('today') || localText.toLowerCase().includes('went') || localText.toLowerCase().includes('did') 
                ? 'text-green-400' : 'text-slate-400'
            }`}>
              <span>{localText.toLowerCase().includes('today') || localText.toLowerCase().includes('went') || localText.toLowerCase().includes('did') ? '✓' : '○'}</span>
              <span>What happened?</span>
            </div>
            <div className={`flex items-center space-x-1 ${
              localText.toLowerCase().includes('felt') || localText.toLowerCase().includes('feel') || localText.toLowerCase().includes('happy') || localText.toLowerCase().includes('sad')
                ? 'text-green-400' : 'text-slate-400'
            }`}>
              <span>{localText.toLowerCase().includes('felt') || localText.toLowerCase().includes('feel') || localText.toLowerCase().includes('happy') || localText.toLowerCase().includes('sad') ? '✓' : '○'}</span>
              <span>How you felt?</span>
            </div>
            <div className={`flex items-center space-x-1 ${
              localText.toLowerCase().includes('tomorrow') || localText.toLowerCase().includes('will') || localText.toLowerCase().includes('plan')
                ? 'text-green-400' : 'text-slate-400'
            }`}>
              <span>{localText.toLowerCase().includes('tomorrow') || localText.toLowerCase().includes('will') || localText.toLowerCase().includes('plan') ? '✓' : '○'}</span>
              <span>What's next?</span>
            </div>
          </div>

          {/* Validation error */}
          {validationError && (
            <div className="flex items-center space-x-2 text-orange-400 text-xs">
              <FiAlertCircle className="w-3 h-3" />
              <span>{validationError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Compact action buttons */}
      <div className="flex space-x-2 pt-3 border-t border-slate-700/50">
        <button
          onClick={handleSaveDraft}
          disabled={!localText.trim() || isSubmitting}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 disabled:bg-slate-800/50 disabled:cursor-not-allowed rounded-lg text-slate-300 hover:text-white transition-all text-sm"
        >
          <FiSave className="w-4 h-4" />
          <span>Save Draft</span>
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-all text-sm"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <FiSend className="w-4 h-4" />
          )}
          <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
        </button>
      </div>

      {/* Unsaved changes indicator */}
      {hasUnsavedChanges && (
        <div className="mt-1 text-xs text-orange-400 flex items-center space-x-1">
          <FiAlertCircle className="w-3 h-3" />
          <span>Unsaved changes</span>
        </div>
      )}
    </div>
  );
};
