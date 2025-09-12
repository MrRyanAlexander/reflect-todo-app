/**
 * Application constants and configuration values
 */

/** Local storage keys for persisting app data */
export const STORAGE_KEYS = {
  REFLECTIONS: 'reflections',
  CHAT_SESSIONS: 'chatSessions',
  ACTIVE_CONTEXT: 'activeContext',
  SELECTED_REFLECTION_ID: 'selectedReflectionId',
} as const;

/** Application metadata */
export const APP_CONFIG = {
  NAME: 'My Todo List',
  VERSION: '1.0.0',
  DESCRIPTION: 'A beautiful and modern todo list application',
} as const;

/** UI text constants */
export const UI_TEXT = {
  PLACEHOLDER: 'What would you like to do today?',
  NO_TODOS_MESSAGE: 'No todos yet!',
  NO_TODOS_SUBTITLE: 'Add one above to get started',
  LATEST_TODO: 'Latest Todo',
  SELECTED_TODO: 'Selected Todo',
  YOUR_TODOS: 'Your Todos',
  ADD_NEW_TODO: 'Add a new todo',
  MADE_WITH_LOVE: 'Made with 💖 for staying organized',
  CLEAR_SELECTION: 'Clear selection',
} as const;

/** CSS class names for consistent styling */
export const CSS_CLASSES = {
  SIDEBAR_WIDTH: 'w-80',
  MAX_CONTENT_WIDTH: 'max-w-2xl',
  SIDEBAR_MAX_HEIGHT: 'max-h-96',
} as const;

/** Animation and transition durations */
export const ANIMATION = {
  TRANSITION_DURATION: '0.3s',
  HOVER_SCALE: '1.05',
  ACTIVE_SCALE: '0.95',
} as const;

/** Color theme constants */
export const THEME = {
  PRIMARY_GRADIENT: 'from-pink-500 to-purple-500',
  PRIMARY_HOVER_GRADIENT: 'from-pink-600 to-purple-600',
  BACKGROUND_GRADIENT: 'from-slate-900 via-purple-900 to-slate-900',
  SUCCESS_COLOR: 'green-500',
  ERROR_COLOR: 'red-500',
} as const;
