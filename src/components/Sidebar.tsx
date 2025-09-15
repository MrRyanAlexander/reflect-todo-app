import React from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import type { SidebarProps } from '../types/reflection';
import { ReflectionList } from './ReflectionList';
import { UI_TEXT, CSS_CLASSES } from '../constants/app';

/**
 * Sidebar component for displaying the reflection history
 * Includes overlay and close functionality
 */
export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  reflections,
  onSelect,
  onDelete,
  selectedReflectionId,
  onCreateNew,
  stats,
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

  /**
   * Handles creating a new reflection
   */
  const handleNewReflection = () => {
    if (onCreateNew) {
      onCreateNew();
    }
    onClose();
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
        className={`absolute left-0 top-0 h-full ${CSS_CLASSES.SIDEBAR_WIDTH} bg-slate-900/95 backdrop-blur-sm border-r border-pink-500/20 flex flex-col`}
        onClick={handleSidebarClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h3 id="sidebar-title" className="text-xl font-semibold text-white">
              {UI_TEXT.REFLECTION_HISTORY}
            </h3>
            <button
              onClick={handleCloseClick}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <FiX className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Progress Stats */}
          {stats && stats.total > 0 && (
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <div className="text-xs text-slate-400 mb-2">Progress</div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="text-pink-300 font-medium">{stats.total} total</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-green-300">{stats.passed} passing</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-blue-300">{stats.inProgress} in progress</span>
                </div>
                <div className="text-slate-400">
                  {stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-2 w-full bg-slate-700 rounded-full h-1">
                <div 
                  className="h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.total > 0 ? (stats.passed / stats.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {/* New Reflection Button */}
          <div className="mb-4">
            <button
              onClick={handleNewReflection}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-xl text-white font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              aria-label="Create new reflection"
            >
              <FiPlus className="w-5 h-5" />
              <span>{UI_TEXT.NEW_REFLECTION}</span>
            </button>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <ReflectionList 
            reflections={reflections} 
            onSelect={onSelect}
            onDelete={onDelete}
            selectedReflectionId={selectedReflectionId}
          />
        </div>
      </div>
    </div>
  );
};
