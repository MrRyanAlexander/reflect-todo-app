import React from 'react';
import type { ContextTabsProps } from '../types/reflection';
import { AppContext } from '../types/reflection';

/**
 * Context tabs component for navigation between different app contexts
 * Provides visual indicators and smooth transitions
 */
export const ContextTabs: React.FC<ContextTabsProps> = ({
  activeContext,
  onContextChange,
  hasReflection,
}) => {
  /**
   * Gets the display information for a context
   */
  const getContextInfo = (context: AppContext) => {
    switch (context) {
      case AppContext.CHAT:
        return {
          label: 'Chat',
          icon: '💬',
          description: 'Get help and ask questions',
          available: hasReflection
        };
      case AppContext.FEEDBACK:
        return {
          label: 'Feedback',
          icon: '📊',
          description: 'View feedback and suggestions',
          available: hasReflection
        };
      case AppContext.WRITE_EDIT:
        return {
          label: 'Write/Edit',
          icon: '✏️',
          description: 'Write and edit your reflection',
          available: true
        };
      default:
        return {
          label: 'Unknown',
          icon: '❓',
          description: 'Unknown context',
          available: false
        };
    }
  };

  /**
   * Handles tab click
   */
  const handleTabClick = (context: AppContext) => {
    const contextInfo = getContextInfo(context);
    if (contextInfo.available) {
      onContextChange(context);
    }
  };

  /**
   * Gets the tab styling based on state
   */
  const getTabStyling = (context: AppContext) => {
    const contextInfo = getContextInfo(context);
    const isActive = activeContext === context;
    const isDisabled = !contextInfo.available;

    if (isDisabled) {
      return 'opacity-50 cursor-not-allowed';
    }

    if (isActive) {
      return 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg transform scale-105';
    }

    return 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all transform hover:scale-105';
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-pink-500/20 p-2">
      <div className="flex space-x-1">
        {Object.values(AppContext).map((context) => {
          const contextInfo = getContextInfo(context);
          const isActive = activeContext === context;
          const isDisabled = !contextInfo.available;

          return (
            <button
              key={context}
              onClick={() => handleTabClick(context)}
              disabled={isDisabled}
              className={`
                flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-all duration-200
                ${getTabStyling(context)}
                ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              aria-label={`Switch to ${contextInfo.label} context`}
              title={isDisabled ? 'Requires a reflection to be available' : contextInfo.description}
            >
              {/* Icon */}
              <span className="text-sm" role="img" aria-label={contextInfo.label}>
                {contextInfo.icon}
              </span>
              
              {/* Label */}
              <span className="text-sm font-medium">
                {contextInfo.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
