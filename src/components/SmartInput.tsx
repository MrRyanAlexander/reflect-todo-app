import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import type { SmartInputProps } from '../types/reflection';
import { AppContext } from '../types/reflection';

/**
 * Smart input component for context-aware chat input
 * Provides dynamic placeholders and context-appropriate actions
 */
export const SmartInput: React.FC<SmartInputProps> = ({
  value,
  onChange,
  onSend,
  context,
  disabled = false,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState(value);

  /**
   * Gets context-appropriate placeholder text
   */
  const getContextPlaceholder = (): string => {
    if (placeholder) return placeholder;

    switch (context) {
      case AppContext.CHAT:
        return 'Ask me anything about your reflection...';
      case AppContext.FEEDBACK:
        return 'Ask about the feedback...';
      case AppContext.WRITE_EDIT:
        return 'Type your reflection here...';
      default:
        return 'Type your message...';
    }
  };

  /**
   * Gets context-appropriate button text
   */
  const getButtonText = (): string => {
    switch (context) {
      case AppContext.CHAT:
        return 'Send';
      case AppContext.FEEDBACK:
        return 'Ask';
      case AppContext.WRITE_EDIT:
        return 'Submit';
      default:
        return 'Send';
    }
  };

  /**
   * Handles input value changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  /**
   * Handles keyboard events
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Handles sending the message
   */
  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSend();
      setInputValue('');
    }
  };

  /**
   * Handles button click
   */
  const handleButtonClick = () => {
    handleSend();
  };

  /**
   * Determines if input should be multiline based on context
   */
  const isMultiline = context === AppContext.WRITE_EDIT;

  return (
    <div className="flex space-x-3">
      {/* Input field */}
      {isMultiline ? (
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={getContextPlaceholder()}
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-slate-700/50 border border-pink-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all resize-none"
          rows={4}
          maxLength={1000}
          aria-label="Reflection input"
        />
      ) : (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={getContextPlaceholder()}
          disabled={disabled}
          className="flex-1 px-4 py-3 bg-slate-700/50 border border-pink-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
          maxLength={2000}
          aria-label="Message input"
        />
      )}

      {/* Send button */}
      <button
        onClick={handleButtonClick}
        disabled={disabled || !inputValue.trim()}
        className={`px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center space-x-2`}
        aria-label={getButtonText()}
      >
        <FiSend className="w-5 h-5" />
        <span className="hidden sm:inline">{getButtonText()}</span>
      </button>
    </div>
  );
};
