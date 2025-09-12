import React from 'react';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import type { TodoItemProps } from '../types/todo';

/**
 * Individual todo item component
 * Displays a single todo with toggle, delete, and select functionality
 */
export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isSelected,
  onToggle,
  onDelete,
  onSelect,
}) => {
  /**
   * Handles the toggle action and prevents event bubbling
   */
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(todo.id);
  };

  /**
   * Handles the delete action and prevents event bubbling
   */
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(todo.id);
  };

  /**
   * Handles selecting the todo for editing
   */
  const handleSelect = () => {
    onSelect(todo);
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-colors cursor-pointer ${
        todo.completed
          ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/15'
          : isSelected
          ? 'bg-pink-500/20 border-pink-500/50 hover:bg-pink-500/25'
          : 'bg-slate-800/50 border-pink-500/20 hover:bg-slate-700/50'
      }`}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      aria-label={`Todo: ${todo.text}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
    >
      <div className="flex items-start space-x-3">
        <button
          onClick={handleToggle}
          className={`mt-1 p-1 rounded-full transition-all ${
            todo.completed
              ? 'bg-green-500 text-white'
              : 'bg-slate-700 hover:bg-pink-500/20 text-slate-400'
          }`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <FiCheck className="w-4 h-4" />
        </button>
        
        <div className="flex-1 min-w-0">
          <p 
            className={`text-sm ${
              todo.completed ? 'line-through text-slate-400' : 'text-white'
            }`}
          >
            {todo.text}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {todo.createdAt.toLocaleDateString()}
          </p>
        </div>
        
        <button
          onClick={handleDelete}
          className="p-1 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
          aria-label="Delete todo"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
