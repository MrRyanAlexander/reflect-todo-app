import React from 'react';
import type { ReflectionListProps } from '../types/reflection';
import { ReflectionItem } from './ReflectionItem';
import { UI_TEXT, CSS_CLASSES } from '../constants/app';

/**
 * List component that displays all reflections
 * Shows empty state when no reflections exist
 */
export const ReflectionList: React.FC<ReflectionListProps> = ({
  reflections,
  onSelect,
  onDelete,
  selectedReflectionId,
}) => {
  // Show empty state if no reflections
  if (reflections.length === 0) {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl" role="img" aria-label="Empty reflection list">
            📝
          </span>
        </div>
        <p className="text-slate-400">{UI_TEXT.NO_REFLECTIONS_MESSAGE}</p>
        <p className="text-slate-500 text-sm mt-1">{UI_TEXT.NO_REFLECTIONS_SUBTITLE}</p>
      </div>
    );
  }

  return (
    <div 
      className={`space-y-3 ${CSS_CLASSES.SIDEBAR_MAX_HEIGHT} overflow-y-auto`}
      role="list"
      aria-label="Reflection list"
    >
      {reflections.map((reflection) => (
        <div key={reflection.id} role="listitem">
          <ReflectionItem
            reflection={reflection}
            isSelected={selectedReflectionId === reflection.id}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};
