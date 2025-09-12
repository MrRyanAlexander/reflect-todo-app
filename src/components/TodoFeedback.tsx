import React from 'react';
import { FiX } from 'react-icons/fi';
import type { Todo } from '../types/todo';
import { UI_TEXT } from '../constants/app';

/**
 * Props interface for the TodoFeedback component
 */
interface TodoFeedbackProps {
  /** The selected todo to display */
  selectedTodo: Todo;
  /** Whether this is the latest todo */
  isLatest: boolean;
  /** Callback function to clear the selection */
  onClear: () => void;
}

/**
 * Component that displays feedback for the selected or latest todo
 */
export const TodoFeedback: React.FC<TodoFeedbackProps> = ({
  selectedTodo,
  isLatest,
  onClear,
}) => {
  /**
   * Handles clearing the selection
   */
  const handleClear = () => {
    onClear();
  };

  return (
    <div className="mt-6">
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-pink-500/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm" role="img" aria-label="Sparkles">
                ✨
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white">
              {isLatest ? UI_TEXT.LATEST_TODO : UI_TEXT.SELECTED_TODO}
            </h3>
          </div>
          <button
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={UI_TEXT.CLEAR_SELECTION}
            aria-label={UI_TEXT.CLEAR_SELECTION}
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
        <div className={`p-3 rounded-lg border ${
          selectedTodo.completed
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-slate-700/50 border-pink-500/20'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              selectedTodo.completed
                ? 'bg-green-500 text-white'
                : 'bg-slate-600 text-slate-400'
            }`}>
              {selectedTodo.completed && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${
                selectedTodo.completed ? 'line-through text-slate-400' : 'text-white'
              }`}>
                {selectedTodo.text}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {selectedTodo.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
