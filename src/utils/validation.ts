/**
 * Validation utilities for reflection and chat operations
 */

import { z } from 'zod';
import { AppContext } from '../types/reflection';

/**
 * Schema for validating reflection text
 */
const ReflectionTextSchema = z.string()
  .min(10, 'Reflection must be at least 10 characters long')
  .max(1000, 'Reflection cannot exceed 1000 characters')
  .trim();

/**
 * Schema for validating chat messages
 */
const ChatMessageSchema = z.string()
  .min(1, 'Message cannot be empty')
  .max(2000, 'Message cannot exceed 2000 characters')
  .trim();

/**
 * Schema for validating LLM structured responses
 */
const StructuredResponseSchema = z.object({
  feedback: z.object({
    happened: z.object({
      pass: z.boolean(),
      remarks: z.string(),
      suggestions: z.array(z.string()).optional()
    }),
    feeling: z.object({
      pass: z.boolean(),
      remarks: z.string(),
      suggestions: z.array(z.string()).optional()
    }),
    next: z.object({
      pass: z.boolean(),
      remarks: z.string(),
      suggestions: z.array(z.string()).optional()
    })
  }),
  suggestions: z.array(z.string()),
  overallScore: z.number().min(0).max(100),
  status: z.enum(['needs-work', 'good', 'excellent'])
});

/**
 * Generates a unique ID for a reflection
 * @returns {string} Unique reflection ID
 */
export const generateReflectionId = (): string => {
  return `reflection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generates a unique ID for a chat message
 * @returns {string} Unique message ID
 */
export const generateMessageId = (): string => {
  return `message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validates reflection text
 * @param {string} text - Text to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidReflectionText = (text: string): boolean => {
  try {
    ReflectionTextSchema.parse(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates chat message text
 * @param {string} text - Text to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidChatMessage = (text: string): boolean => {
  try {
    ChatMessageSchema.parse(text);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates LLM structured response
 * @param {any} response - Response to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidStructuredResponse = (response: any): boolean => {
  try {
    StructuredResponseSchema.parse(response);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitizes reflection text by trimming whitespace
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeReflectionText = (text: string): string => {
  return text.trim();
};

/**
 * Sanitizes chat message text by trimming whitespace
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeChatMessage = (text: string): string => {
  return text.trim();
};

/**
 * Counts sentences in text
 * @param {string} text - Text to analyze
 * @returns {number} Number of sentences
 */
export const countSentences = (text: string): number => {
  // Simple sentence counting - split by periods, exclamation marks, and question marks
  const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
  return sentences.length;
};

/**
 * Validates sentence count for reflections (should be 3-4 sentences)
 * @param {string} text - Text to validate
 * @returns {boolean} True if valid sentence count, false otherwise
 */
export const isValidSentenceCount = (text: string): boolean => {
  const sentenceCount = countSentences(text);
  return sentenceCount >= 3 && sentenceCount <= 4;
};

/**
 * Validates context switching
 * @param {AppContext} currentContext - Current context
 * @param {AppContext} newContext - New context to switch to
 * @returns {boolean} True if valid context switch, false otherwise
 */
export const isValidContextSwitch = (_currentContext: AppContext, newContext: AppContext): boolean => {
  // All context switches are valid for now
  // Could add business logic here if needed
  return Object.values(AppContext).includes(newContext);
};

/**
 * Validates reflection requirements (happened, feeling, next)
 * @param {string} text - Reflection text to analyze
 * @returns {object} Analysis of reflection requirements
 */
export const analyzeReflectionRequirements = (text: string) => {
  const lowerText = text.toLowerCase();
  
  // Check for "what happened" indicators
  const happenedIndicators = ['today', 'yesterday', 'went', 'did', 'happened', 'occurred', 'took place'];
  const hasHappened = happenedIndicators.some(indicator => lowerText.includes(indicator));
  
  // Check for "how you felt" indicators
  const feelingIndicators = ['felt', 'feel', 'feeling', 'emotion', 'happy', 'sad', 'excited', 'nervous', 'worried', 'proud'];
  const hasFeeling = feelingIndicators.some(indicator => lowerText.includes(indicator));
  
  // Check for "what's next" indicators
  const nextIndicators = ['tomorrow', 'next', 'will', 'going to', 'plan', 'future', 'later'];
  const hasNext = nextIndicators.some(indicator => lowerText.includes(indicator));
  
  return {
    hasHappened,
    hasFeeling,
    hasNext,
    completeness: (hasHappened ? 1 : 0) + (hasFeeling ? 1 : 0) + (hasNext ? 1 : 0)
  };
};

/**
 * Gets validation error message for reflection text
 * @param {string} text - Text to validate
 * @returns {string | null} Error message or null if valid
 */
export const getReflectionValidationError = (text: string): string | null => {
  if (!isValidReflectionText(text)) {
    if (text.length < 10) {
      return 'Reflection must be at least 10 characters long';
    }
    if (text.length > 1000) {
      return 'Reflection cannot exceed 1000 characters';
    }
    return 'Invalid reflection text';
  }
  
  if (!isValidSentenceCount(text)) {
    const count = countSentences(text);
    return `Reflection should be 3-4 sentences (currently ${count})`;
  }
  
  return null;
};

/**
 * Gets validation error message for chat message
 * @param {string} text - Text to validate
 * @returns {string | null} Error message or null if valid
 */
export const getChatMessageValidationError = (text: string): string | null => {
  if (!isValidChatMessage(text)) {
    if (text.length < 1) {
      return 'Message cannot be empty';
    }
    if (text.length > 2000) {
      return 'Message cannot exceed 2000 characters';
    }
    return 'Invalid message text';
  }
  
  return null;
};