import React from 'react';
import type { TodoListProps } from '../types/todo';
import { TodoItem } from './TodoItem';
import { UI_TEXT, CSS_CLASSES } from '../constants/app';

/**
 * List component that displays all todos
 * Shows empty state when no todos exist
 */
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onSelect,
  selectedTodoId,
}) => {
  // Show empty state if no todos
  if (todos.length === 0) {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl" role="img" aria-label="Empty todo list">
            📝
          </span>
        </div>
        <p className="text-slate-400">{UI_TEXT.NO_TODOS_MESSAGE}</p>
        <p className="text-slate-500 text-sm mt-1">{UI_TEXT.NO_TODOS_SUBTITLE}</p>
      </div>
    );
  }

  return (
    <div 
      className={`space-y-3 ${CSS_CLASSES.SIDEBAR_MAX_HEIGHT} overflow-y-auto`}
      role="list"
      aria-label="Todo list"
    >
      {todos.map((todo) => (
        <div key={todo.id} role="listitem">
          <TodoItem
            todo={todo}
            isSelected={selectedTodoId === todo.id}
            onToggle={onToggle}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  );
};
