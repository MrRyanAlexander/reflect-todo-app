import { useState, useEffect, useCallback } from 'react';
import type { Todo } from '../types/todo';
import { loadTodosFromStorage, saveTodosToStorage } from '../utils/storage';
import { generateTodoId, isValidTodoText, sanitizeTodoText } from '../utils/validation';

/**
 * Custom hook for managing todo state and operations
 * @returns {object} Todo management functions and state
 */
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = loadTodosFromStorage();
    setTodos(savedTodos);
    setIsLoaded(true);
  }, []);

  // Save todos to localStorage whenever todos change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveTodosToStorage(todos);
    }
  }, [todos, isLoaded]);

  /**
   * Adds a new todo to the list
   * @param {string} text - The text content of the todo
   * @returns {Todo | null} The created todo or null if invalid
   */
  const addTodo = useCallback((text: string): Todo | null => {
    const sanitizedText = sanitizeTodoText(text);
    
    if (!isValidTodoText(sanitizedText)) {
      return null;
    }

    const newTodo: Todo = {
      id: generateTodoId(),
      text: sanitizedText,
      completed: false,
      createdAt: new Date(),
    };

    setTodos(prevTodos => [newTodo, ...prevTodos]);
    return newTodo;
  }, []);

  /**
   * Toggles the completion status of a todo
   * @param {string} id - The ID of the todo to toggle
   */
  const toggleTodo = useCallback((id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  /**
   * Deletes a todo from the list
   * @param {string} id - The ID of the todo to delete
   */
  const deleteTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  /**
   * Updates the text of an existing todo
   * @param {string} id - The ID of the todo to update
   * @param {string} newText - The new text content
   * @returns {boolean} True if update was successful, false otherwise
   */
  const updateTodo = useCallback((id: string, newText: string): boolean => {
    const sanitizedText = sanitizeTodoText(newText);
    
    if (!isValidTodoText(sanitizedText)) {
      return false;
    }

    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, text: sanitizedText } : todo
      )
    );
    return true;
  }, []);

  /**
   * Clears all completed todos
   */
  const clearCompleted = useCallback(() => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  }, []);

  /**
   * Gets statistics about the todos
   */
  const getStats = useCallback(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    
    return { total, completed, pending };
  }, [todos]);

  return {
    todos,
    isLoaded,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    getStats,
  };
};
