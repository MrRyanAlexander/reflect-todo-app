/**
 * Validation utility functions
 */

/**
 * Validates if a string is a valid todo text
 * @param {string} text - The text to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidTodoText = (text: string): boolean => {
  return text.trim().length > 0 && text.trim().length <= 500;
};

/**
 * Sanitizes todo text by trimming whitespace
 * @param {string} text - The text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeTodoText = (text: string): string => {
  return text.trim();
};

/**
 * Generates a unique ID for a todo item
 * @returns {string} Unique ID
 */
export const generateTodoId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
