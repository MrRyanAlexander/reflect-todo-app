import React from 'react';
import { FiPlus } from 'react-icons/fi';
import type { TodoInputProps } from '../types/todo';
import { UI_TEXT, THEME } from '../constants/app';

/**
 * Input component for adding new todos
 * Includes input field and add button with keyboard support
 */
export const TodoInput: React.FC<TodoInputProps> = ({
  value,
  onChange,
  onAdd,
  placeholder = UI_TEXT.PLACEHOLDER,
}) => {
  /**
   * Handles keyboard events for the input
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
  };

  /**
   * Handles input value changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  /**
   * Handles the add button click
   */
  const handleAddClick = () => {
    onAdd();
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-pink-500/20 p-6 shadow-2xl">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg" role="img" aria-label="Heart emoji">
            💖
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-white">{UI_TEXT.ADD_NEW_TODO}</h2>
      </div>
      
      <div className="flex space-x-3">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 bg-slate-700/50 border border-pink-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
          aria-label="Todo input"
          maxLength={500}
        />
        <button
          onClick={handleAddClick}
          className={`px-6 py-3 bg-gradient-to-r ${THEME.PRIMARY_GRADIENT} hover:${THEME.PRIMARY_HOVER_GRADIENT} rounded-xl text-white font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg`}
          aria-label="Add todo"
        >
          <FiPlus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
