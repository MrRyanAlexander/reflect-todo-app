import React from 'react';
import { FiTrash2, FiCheck, FiClock, FiEdit3 } from 'react-icons/fi';
import type { ReflectionItemProps } from '../types/reflection';
import { ReflectionStatus } from '../types/reflection';

/**
 * Individual reflection item component
 * Displays reflection with status indicators and actions
 */
export const ReflectionItem: React.FC<ReflectionItemProps> = ({
  reflection,
  isSelected,
  onSelect,
  onDelete,
}) => {
  /**
   * Handles selecting the reflection
   */
  const handleSelect = () => {
    onSelect(reflection);
  };

  /**
   * Handles deleting the reflection
   */
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(reflection.id);
  };

  /**
   * Gets the status icon and color
   */
  const getStatusDisplay = () => {
    switch (reflection.status) {
      case ReflectionStatus.PASSED:
        return {
          icon: FiCheck,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          label: 'Passed'
        };
      case ReflectionStatus.IN_PROGRESS:
        return {
          icon: FiEdit3,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          label: 'In Progress'
        };
      case ReflectionStatus.PENDING:
      default:
        return {
          icon: FiClock,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/30',
          label: 'Pending'
        };
    }
  };

  /**
   * Gets the first sentence of the reflection for preview
   */
  const getPreview = () => {
    const firstSentence = reflection.text.split('.')[0];
    return firstSentence.length > 60 
      ? firstSentence.substring(0, 60) + '...'
      : firstSentence;
  };

  /**
   * Formats the date for display
   */
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const statusDisplay = getStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  return (
    <div
      className={`p-4 rounded-xl border cursor-pointer transition-all transform hover:scale-105 active:scale-95 ${
        isSelected
          ? `${statusDisplay.bgColor} ${statusDisplay.borderColor} border-2`
          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50'
      }`}
      onClick={handleSelect}
      role="button"
      tabIndex={0}
      aria-label={`Select reflection from ${formatDate(reflection.createdAt)}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      }}
    >
      {/* Header with status and date */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded-full ${statusDisplay.bgColor}`}>
            <StatusIcon className={`w-3 h-3 ${statusDisplay.color}`} />
          </div>
          <span className={`text-xs font-medium ${statusDisplay.color}`}>
            {statusDisplay.label}
          </span>
        </div>
        <span className="text-xs text-slate-500">
          {formatDate(reflection.createdAt)}
        </span>
      </div>

      {/* Reflection preview */}
      <div className="mb-3">
        <p className="text-sm text-slate-300 leading-relaxed">
          {getPreview()}
        </p>
      </div>

      {/* Footer with version and delete button */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">
          v{reflection.currentVersion}
        </span>
        <button
          onClick={handleDelete}
          className="p-1 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
          aria-label={`Delete reflection from ${formatDate(reflection.createdAt)}`}
          title="Delete reflection"
        >
          <FiTrash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
