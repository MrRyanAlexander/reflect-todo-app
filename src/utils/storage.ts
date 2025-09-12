import type { Todo } from '../types/todo';
import { STORAGE_KEYS } from '../constants/app';

/**
 * Utility functions for localStorage operations
 */

/**
 * Loads todos from localStorage
 * @returns {Todo[]} Array of todos or empty array if none found
 */
export const loadTodosFromStorage = (): Todo[] => {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEYS.TODOS);
    if (!savedTodos) {
      return [];
    }

    const parsedTodos = JSON.parse(savedTodos) as Array<{
      id: string;
      text: string;
      completed: boolean;
      createdAt: string;
    }>;
    return parsedTodos.map((todo) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
    }));
  } catch (error) {
    console.error('Error loading todos from storage:', error);
    return [];
  }
};

/**
 * Saves todos to localStorage
 * @param {Todo[]} todos - Array of todos to save
 */
export const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to storage:', error);
  }
};

/**
 * Clears all todos from localStorage
 */
export const clearTodosFromStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TODOS);
  } catch (error) {
    console.error('Error clearing todos from storage:', error);
  }
};
