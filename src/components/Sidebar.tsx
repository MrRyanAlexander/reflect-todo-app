import React from 'react';
import { FiX } from 'react-icons/fi';
import type { SidebarProps } from '../types/todo';
import { TodoList } from './TodoList';
import { UI_TEXT, CSS_CLASSES } from '../constants/app';

/**
 * Sidebar component for displaying the todo list
 * Includes overlay and close functionality
 */
export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  todos,
  onToggle,
  onDelete,
  onSelect,
  selectedTodoId,
}) => {
  // Don't render if sidebar is closed
  if (!isOpen) {
    return null;
  }

  /**
   * Handles clicking on the overlay to close the sidebar
   */
  const handleOverlayClick = () => {
    onClose();
  };

  /**
   * Handles clicking on the close button
   */
  const handleCloseClick = () => {
    onClose();
  };

  /**
   * Prevents event bubbling when clicking inside the sidebar
   */
  const handleSidebarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <div 
        className={`absolute left-0 top-0 h-full ${CSS_CLASSES.SIDEBAR_WIDTH} bg-slate-900/95 backdrop-blur-sm border-r border-pink-500/20 p-6`}
        onClick={handleSidebarClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 id="sidebar-title" className="text-xl font-semibold text-white">
            {UI_TEXT.YOUR_TODOS}
          </h3>
          <button
            onClick={handleCloseClick}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <FiX className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        
        <TodoList 
          todos={todos} 
          onToggle={onToggle} 
          onDelete={onDelete}
          onSelect={onSelect}
          selectedTodoId={selectedTodoId}
        />
      </div>
    </div>
  );
};
