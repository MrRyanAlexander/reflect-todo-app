import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChatMessage, ChatSession, MessageRole, Reflection } from '../types/reflection';
import { MessageRole as MessageRoleConst } from '../types/reflection';
import { 
  loadChatSessionsFromStorage, 
  saveChatSessionsToStorage,
  createChatSession,
  addMessageToChatSession,
  getChatSessionForReflection,
  updateChatSession
} from '../utils/storage';
import { 
  generateMessageId, 
  isValidChatMessage, 
  sanitizeChatMessage 
} from '../utils/validation';

/**
 * Custom hook for managing chat state and operations
 * @returns {object} Chat management functions and state
 */
export const useChat = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const chatSessionsRef = useRef<ChatSession[]>([]);

  // Load chat sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = loadChatSessionsFromStorage();
    setChatSessions(savedSessions);
    chatSessionsRef.current = savedSessions;
    setIsLoaded(true);
  }, []);

  // Update ref whenever sessions change
  useEffect(() => {
    chatSessionsRef.current = chatSessions;
  }, [chatSessions]);

  // Save chat sessions to localStorage whenever sessions change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveChatSessionsToStorage(chatSessions);
    }
  }, [chatSessions, isLoaded]);

  /**
   * Creates a new chat session for a reflection
   * @param {string} reflectionId - ID of the reflection
   * @returns {ChatSession} The created chat session
   */
  const createNewChatSession = useCallback((reflectionId: string): ChatSession => {
    const newSession = createChatSession(reflectionId);
    setChatSessions(prevSessions => [newSession, ...prevSessions]);
    return newSession;
  }, []);

  /**
   * Gets chat session for a reflection
   * @param {string} reflectionId - ID of the reflection
   * @returns {ChatSession | null} The chat session or null if not found
   */
  const getChatSession = useCallback((reflectionId: string): ChatSession | null => {
    return getChatSessionForReflection(chatSessions, reflectionId);
  }, [chatSessions]);

  /**
   * Gets messages for a specific reflection
   * @param {string} reflectionId - ID of the reflection
   * @returns {ChatMessage[]} Array of messages for the reflection
   */
  const getMessagesForReflection = useCallback((reflectionId: string): ChatMessage[] => {
    const session = getChatSessionForReflection(chatSessions, reflectionId);
    return session ? session.messages : [];
  }, [chatSessions]);

  /**
   * Adds a message to a chat session
   * @param {string} reflectionId - ID of the reflection
   * @param {string} content - Message content
   * @param {MessageRole} role - Role of the message sender
   * @param {string} context - Context of the message
   * @returns {boolean} True if message was added successfully
   */
  const addMessage = useCallback((
    reflectionId: string, 
    content: string, 
    role: MessageRole, 
    context: 'general' | 'reflection-help' | 'feedback-discussion' = 'general'
  ): boolean => {
    const sanitizedContent = sanitizeChatMessage(content);
    
    if (!isValidChatMessage(sanitizedContent)) {
      return false;
    }

    const message: ChatMessage = {
      id: generateMessageId(),
      role,
      content: sanitizedContent,
      timestamp: new Date(),
      context,
      metadata: {
        reflectionId
      }
    };

    // Get or create chat session
    let session = getChatSessionForReflection(chatSessions, reflectionId);
    if (!session) {
      session = createChatSession(reflectionId);
    }

    // Add message to session
    const updatedSession = addMessageToChatSession(session, message);
    
    // Update sessions array
    setChatSessions(prevSessions => {
      const existingSessionIndex = prevSessions.findIndex(s => s.id === updatedSession.id);
      if (existingSessionIndex >= 0) {
        // If session exists, update it
        return updateChatSession(prevSessions, updatedSession);
      } else {
        // If this is a new session, add it to the array
        return [...prevSessions, updatedSession];
      }
    });
    
    return true;
  }, [chatSessions]);

  /**
   * Sends a user message and gets AI response
   * @param {string} reflectionId - ID of the reflection
   * @param {string} message - User message
   * @param {Reflection | null} currentReflection - Current reflection for context
   * @param {any} currentFeedback - Current feedback for context
   * @returns {Promise<boolean>} True if message was sent successfully
   */
  const sendMessage = useCallback(async (
    reflectionId: string, 
    message: string, 
    currentReflection: Reflection | null,
    currentFeedback: any = null
  ): Promise<boolean> => {
    if (isSending) return false;

    setIsSending(true);

    try {
      // Add user message
      const userMessageAdded = addMessage(reflectionId, message, MessageRoleConst.USER, 'general');
      if (!userMessageAdded) {
        setIsSending(false);
        return false;
      }

      // Get chat history for context
      const messages = getMessagesForReflection(reflectionId);
      const chatHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          reflectionText: currentReflection?.text || '',
          chatHistory,
          context: 'reflection-help',
          currentFeedback
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Add AI response
        addMessage(reflectionId, data.data.response, MessageRoleConst.ASSISTANT, data.data.context);
        return true;
      } else {
        throw new Error(data.error || 'Failed to get response');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      addMessage(reflectionId, 'Sorry, I had trouble responding. Please try again.', MessageRoleConst.ASSISTANT, 'general');
      return false;
    } finally {
      setIsSending(false);
    }
  }, [addMessage, getMessagesForReflection]);

  /**
   * Clears all messages for a reflection
   * @param {string} reflectionId - ID of the reflection
   */
  const clearMessages = useCallback((reflectionId: string) => {
    setChatSessions(prevSessions =>
      prevSessions.map(session =>
        session.reflectionId === reflectionId
          ? { ...session, messages: [] }
          : session
      )
    );
  }, []);

  /**
   * Deletes a chat session
   * @param {string} reflectionId - ID of the reflection
   */
  const deleteChatSession = useCallback((reflectionId: string) => {
    setChatSessions(prevSessions =>
      prevSessions.filter(session => session.reflectionId !== reflectionId)
    );
  }, []);

  /**
   * Gets the latest message for a reflection
   * @param {string} reflectionId - ID of the reflection
   * @returns {ChatMessage | null} The latest message or null
   */
  const getLatestMessage = useCallback((reflectionId: string): ChatMessage | null => {
    const messages = getMessagesForReflection(reflectionId);
    return messages.length > 0 ? messages[messages.length - 1] || null : null;
  }, [getMessagesForReflection]);

  /**
   * Gets message count for a reflection
   * @param {string} reflectionId - ID of the reflection
   * @returns {number} Number of messages
   */
  const getMessageCount = useCallback((reflectionId: string): number => {
    const messages = getMessagesForReflection(reflectionId);
    return messages.length;
  }, [getMessagesForReflection]);

  /**
   * Checks if there are any messages for a reflection
   * @param {string} reflectionId - ID of the reflection
   * @returns {boolean} True if there are messages
   */
  const hasMessages = useCallback((reflectionId: string): boolean => {
    return getMessageCount(reflectionId) > 0;
  }, [getMessageCount]);

  /**
   * Clears all chat sessions (for testing or reset purposes)
   */
  const clearAllChatSessions = useCallback(() => {
    setChatSessions([]);
  }, []);

  return {
    chatSessions,
    isLoaded,
    isSending,
    createNewChatSession,
    getChatSession,
    getMessagesForReflection,
    addMessage,
    sendMessage,
    clearMessages,
    deleteChatSession,
    getLatestMessage,
    getMessageCount,
    hasMessages,
    clearAllChatSessions,
  };
};
