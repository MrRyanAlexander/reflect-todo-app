import { useState, useEffect, useCallback } from 'react';
import { AppContext } from '../types/reflection';
import { 
  loadActiveContextFromStorage, 
  saveActiveContextToStorage 
} from '../utils/storage';
import { isValidContextSwitch } from '../utils/validation';

/**
 * Custom hook for managing app context state and operations
 * @returns {object} Context management functions and state
 */
export const useAppContext = () => {
  const [activeContext, setActiveContext] = useState<AppContext>(AppContext.WRITE_EDIT);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load active context from localStorage on mount
  useEffect(() => {
    const savedContext = loadActiveContextFromStorage();
    setActiveContext(savedContext);
    setIsLoaded(true);
  }, []);

  // Save active context to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveActiveContextToStorage(activeContext);
    }
  }, [activeContext, isLoaded]);

  /**
   * Switches to a new context with validation and transition handling
   * @param {AppContext} newContext - The new context to switch to
   * @returns {boolean} True if context switch was successful
   */
  const switchContext = useCallback(async (newContext: AppContext): Promise<boolean> => {
    // Validate context switch
    if (!isValidContextSwitch(activeContext, newContext)) {
      console.warn('Invalid context switch attempted');
      return false;
    }

    // Don't switch if already in the target context
    if (activeContext === newContext) {
      return true;
    }

    // Handle transition
    setIsTransitioning(true);
    
    try {
      // Add a small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 150));
      
      setActiveContext(newContext);
      return true;
    } catch (error) {
      console.error('Error switching context:', error);
      return false;
    } finally {
      setIsTransitioning(false);
    }
  }, [activeContext]);

  /**
   * Switches to chat context
   * @returns {boolean} True if switch was successful
   */
  const switchToChat = useCallback((): Promise<boolean> => {
    return switchContext(AppContext.CHAT);
  }, [switchContext]);

  /**
   * Switches to feedback context
   * @returns {boolean} True if switch was successful
   */
  const switchToFeedback = useCallback((): Promise<boolean> => {
    return switchContext(AppContext.FEEDBACK);
  }, [switchContext]);

  /**
   * Switches to write/edit context
   * @returns {boolean} True if switch was successful
   */
  const switchToWriteEdit = useCallback((): Promise<boolean> => {
    return switchContext(AppContext.WRITE_EDIT);
  }, [switchContext]);

  /**
   * Gets the display name for a context
   * @param {AppContext} context - The context to get display name for
   * @returns {string} Display name for the context
   */
  const getContextDisplayName = useCallback((context: AppContext): string => {
    switch (context) {
      case AppContext.CHAT:
        return 'Chat';
      case AppContext.FEEDBACK:
        return 'Feedback';
      case AppContext.WRITE_EDIT:
        return 'Write/Edit';
      default:
        return 'Unknown';
    }
  }, []);

  /**
   * Gets the description for a context
   * @param {AppContext} context - The context to get description for
   * @returns {string} Description for the context
   */
  const getContextDescription = useCallback((context: AppContext): string => {
    switch (context) {
      case AppContext.CHAT:
        return 'Get help and ask questions about your reflection';
      case AppContext.FEEDBACK:
        return 'View feedback and suggestions for your reflection';
      case AppContext.WRITE_EDIT:
        return 'Write and edit your daily reflection';
      default:
        return 'Unknown context';
    }
  }, []);

  /**
   * Gets the icon for a context
   * @param {AppContext} context - The context to get icon for
   * @returns {string} Icon name or emoji for the context
   */
  const getContextIcon = useCallback((context: AppContext): string => {
    switch (context) {
      case AppContext.CHAT:
        return '💬';
      case AppContext.FEEDBACK:
        return '📊';
      case AppContext.WRITE_EDIT:
        return '✏️';
      default:
        return '❓';
    }
  }, []);

  /**
   * Checks if a context is available (has required data)
   * @param {AppContext} context - The context to check
   * @param {boolean} hasReflection - Whether there is a current reflection
   * @returns {boolean} True if context is available
   */
  const isContextAvailable = useCallback((context: AppContext, hasReflection: boolean): boolean => {
    switch (context) {
      case AppContext.CHAT:
        return hasReflection; // Chat requires a reflection to discuss
      case AppContext.FEEDBACK:
        return hasReflection; // Feedback requires a reflection to evaluate
      case AppContext.WRITE_EDIT:
        return true; // Write/Edit is always available
      default:
        return false;
    }
  }, []);

  /**
   * Gets the next logical context in the workflow
   * @param {AppContext} currentContext - The current context
   * @param {boolean} hasReflection - Whether there is a current reflection
   * @returns {AppContext | null} The next context or null if none
   */
  const getNextContext = useCallback((currentContext: AppContext, hasReflection: boolean): AppContext | null => {
    switch (currentContext) {
      case AppContext.WRITE_EDIT:
        return hasReflection ? AppContext.FEEDBACK : null;
      case AppContext.FEEDBACK:
        return AppContext.CHAT;
      case AppContext.CHAT:
        return AppContext.WRITE_EDIT;
      default:
        return null;
    }
  }, []);

  /**
   * Gets the previous logical context in the workflow
   * @param {AppContext} currentContext - The current context
   * @param {boolean} hasReflection - Whether there is a current reflection
   * @returns {AppContext | null} The previous context or null if none
   */
  const getPreviousContext = useCallback((currentContext: AppContext, hasReflection: boolean): AppContext | null => {
    switch (currentContext) {
      case AppContext.WRITE_EDIT:
        return AppContext.CHAT;
      case AppContext.FEEDBACK:
        return AppContext.WRITE_EDIT;
      case AppContext.CHAT:
        return hasReflection ? AppContext.FEEDBACK : null;
      default:
        return null;
    }
  }, []);

  /**
   * Resets context to default
   */
  const resetContext = useCallback(() => {
    setActiveContext(AppContext.WRITE_EDIT);
  }, []);

  return {
    activeContext,
    isLoaded,
    isTransitioning,
    switchContext,
    switchToChat,
    switchToFeedback,
    switchToWriteEdit,
    getContextDisplayName,
    getContextDescription,
    getContextIcon,
    isContextAvailable,
    getNextContext,
    getPreviousContext,
    resetContext,
  };
};
