/**
 * Storage utilities for persisting reflections and chat data to localStorage
 */

import type { Reflection, ChatSession, ChatMessage } from '../types/reflection';
import { AppContext } from '../types/reflection';
import { STORAGE_KEYS } from '../constants/app';

/**
 * Loads reflections from localStorage
 * @returns {Reflection[]} Array of reflections or empty array if none exist
 */
export const loadReflectionsFromStorage = (): Reflection[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    
    // Validate that we have an array
    if (!Array.isArray(parsed)) {
      console.warn('Invalid reflections data in localStorage, resetting to empty array');
      return [];
    }

    // Convert date strings back to Date objects
    return parsed.map(reflection => ({
      ...reflection,
      createdAt: new Date(reflection.createdAt),
      updatedAt: new Date(reflection.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading reflections from localStorage:', error);
    return [];
  }
};

/**
 * Saves reflections to localStorage
 * @param {Reflection[]} reflections - Array of reflections to save
 */
export const saveReflectionsToStorage = (reflections: Reflection[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(reflections));
  } catch (error) {
    console.error('Error saving reflections to localStorage:', error);
  }
};

/**
 * Loads chat sessions from localStorage
 * @returns {ChatSession[]} Array of chat sessions or empty array if none exist
 */
export const loadChatSessionsFromStorage = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    
    // Validate that we have an array
    if (!Array.isArray(parsed)) {
      console.warn('Invalid chat sessions data in localStorage, resetting to empty array');
      return [];
    }

    // Convert date strings back to Date objects
    return parsed.map(session => ({
      ...session,
      createdAt: new Date(session.createdAt),
      messages: session.messages.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Error loading chat sessions from localStorage:', error);
    return [];
  }
};

/**
 * Saves chat sessions to localStorage
 * @param {ChatSession[]} chatSessions - Array of chat sessions to save
 */
export const saveChatSessionsToStorage = (chatSessions: ChatSession[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(chatSessions));
  } catch (error) {
    console.error('Error saving chat sessions to localStorage:', error);
  }
};

/**
 * Loads active context from localStorage
 * @returns {AppContext} Current active context or default
 */
export const loadActiveContextFromStorage = (): AppContext => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_CONTEXT);
    if (!stored) {
      return AppContext.WRITE_EDIT;
    }

    const parsed = JSON.parse(stored);
    
    // Validate that we have a valid context
    if (!Object.values(AppContext).includes(parsed)) {
      console.warn('Invalid active context in localStorage, resetting to default');
      return AppContext.WRITE_EDIT;
    }

    return parsed as AppContext;
  } catch (error) {
    console.error('Error loading active context from localStorage:', error);
    return AppContext.WRITE_EDIT;
  }
};

/**
 * Saves active context to localStorage
 * @param {AppContext} context - Current active context to save
 */
export const saveActiveContextToStorage = (context: AppContext): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CONTEXT, JSON.stringify(context));
  } catch (error) {
    console.error('Error saving active context to localStorage:', error);
  }
};

/**
 * Loads selected reflection ID from localStorage
 * @returns {string | null} Selected reflection ID or null if none
 */
export const loadSelectedReflectionIdFromStorage = (): string | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_REFLECTION_ID);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading selected reflection ID from localStorage:', error);
    return null;
  }
};

/**
 * Saves selected reflection ID to localStorage
 * @param {string | null} reflectionId - Selected reflection ID to save
 */
export const saveSelectedReflectionIdToStorage = (reflectionId: string | null): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_REFLECTION_ID, JSON.stringify(reflectionId));
  } catch (error) {
    console.error('Error saving selected reflection ID to localStorage:', error);
  }
};

/**
 * Creates a new chat session for a reflection
 * @param {string} reflectionId - ID of the reflection
 * @returns {ChatSession} New chat session
 */
export const createChatSession = (reflectionId: string): ChatSession => {
  const sessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: sessionId,
    reflectionId,
    messages: [],
    isActive: true,
    createdAt: new Date()
  };
};

/**
 * Adds a message to a chat session
 * @param {ChatSession} session - Chat session to update
 * @param {ChatMessage} message - Message to add
 * @returns {ChatSession} Updated chat session
 */
export const addMessageToChatSession = (session: ChatSession, message: ChatMessage): ChatSession => {
  return {
    ...session,
    messages: [...session.messages, message]
  };
};

/**
 * Gets chat session for a reflection
 * @param {ChatSession[]} sessions - All chat sessions
 * @param {string} reflectionId - ID of the reflection
 * @returns {ChatSession | null} Chat session or null if not found
 */
export const getChatSessionForReflection = (sessions: ChatSession[], reflectionId: string): ChatSession | null => {
  return sessions.find(session => session.reflectionId === reflectionId) || null;
};

/**
 * Updates chat session in the sessions array
 * @param {ChatSession[]} sessions - All chat sessions
 * @param {ChatSession} updatedSession - Updated chat session
 * @returns {ChatSession[]} Updated sessions array
 */
export const updateChatSession = (sessions: ChatSession[], updatedSession: ChatSession): ChatSession[] => {
  return sessions.map(session => 
    session.id === updatedSession.id ? updatedSession : session
  );
};

/**
 * Clears all stored data (for testing or reset purposes)
 */
export const clearAllStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.REFLECTIONS);
    localStorage.removeItem(STORAGE_KEYS.CHAT_SESSIONS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONTEXT);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_REFLECTION_ID);
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};