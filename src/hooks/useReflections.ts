import { useState, useEffect, useCallback } from 'react';
import type { Reflection, ReflectionStatus } from '../types/reflection';
import { 
  loadReflectionsFromStorage, 
  saveReflectionsToStorage,
  loadSelectedReflectionIdFromStorage,
  saveSelectedReflectionIdToStorage
} from '../utils/storage';
import { 
  generateReflectionId, 
  isValidReflectionText, 
  sanitizeReflectionText 
} from '../utils/validation';

/**
 * Custom hook for managing reflection state and operations
 * @returns {object} Reflection management functions and state
 */
export const useReflections = () => {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedReflectionId, setSelectedReflectionId] = useState<string | null>(null);

  // Load reflections from localStorage on mount
  useEffect(() => {
    const savedReflections = loadReflectionsFromStorage();
    const savedSelectedId = loadSelectedReflectionIdFromStorage();
    setReflections(savedReflections);
    setSelectedReflectionId(savedSelectedId);
    setIsLoaded(true);
  }, []);

  // Save reflections to localStorage whenever reflections change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveReflectionsToStorage(reflections);
    }
  }, [reflections, isLoaded]);

  // Save selected reflection ID whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveSelectedReflectionIdToStorage(selectedReflectionId);
    }
  }, [selectedReflectionId, isLoaded]);

  /**
   * Adds a new reflection to the list
   * @param {string} text - The text content of the reflection
   * @param {string} chatSessionId - ID of the associated chat session
   * @returns {Reflection | null} The created reflection or null if invalid
   */
  const addReflection = useCallback((text: string, chatSessionId?: string): Reflection | null => {
    const sanitizedText = sanitizeReflectionText(text);
    
    if (!isValidReflectionText(sanitizedText)) {
      return null;
    }

    const newReflection: Reflection = {
      id: generateReflectionId(),
      text: sanitizedText,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      chatSessionId: chatSessionId || `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      currentVersion: 1,
    };

    setReflections(prevReflections => [newReflection, ...prevReflections]);
    setSelectedReflectionId(newReflection.id);
    return newReflection;
  }, []);

  /**
   * Updates the text of an existing reflection
   * @param {string} id - The ID of the reflection to update
   * @param {string} newText - The new text content
   * @returns {boolean} True if update was successful, false otherwise
   */
  const updateReflection = useCallback((id: string, newText: string): boolean => {
    const sanitizedText = sanitizeReflectionText(newText);
    
    if (!isValidReflectionText(sanitizedText)) {
      return false;
    }

    setReflections(prevReflections =>
      prevReflections.map(reflection =>
        reflection.id === id 
          ? { 
              ...reflection, 
              text: sanitizedText,
              updatedAt: new Date(),
              currentVersion: reflection.currentVersion + 1
            } 
          : reflection
      )
    );
    return true;
  }, []);

  /**
   * Updates the status of a reflection
   * @param {string} id - The ID of the reflection to update
   * @param {ReflectionStatus} newStatus - The new status
   * @returns {boolean} True if update was successful, false otherwise
   */
  const updateReflectionStatus = useCallback((id: string, newStatus: ReflectionStatus): boolean => {
    setReflections(prevReflections =>
      prevReflections.map(reflection =>
        reflection.id === id 
          ? { 
              ...reflection, 
              status: newStatus,
              updatedAt: new Date()
            } 
          : reflection
      )
    );
    return true;
  }, []);

  /**
   * Deletes a reflection from the list
   * @param {string} id - The ID of the reflection to delete
   */
  const deleteReflection = useCallback((id: string) => {
    setReflections(prevReflections => prevReflections.filter(reflection => reflection.id !== id));
    
    // Clear selection if the deleted reflection was selected
    if (selectedReflectionId === id) {
      setSelectedReflectionId(null);
    }
  }, [selectedReflectionId]);

  /**
   * Selects a reflection for editing/viewing
   * @param {string} id - The ID of the reflection to select
   */
  const selectReflection = useCallback((id: string) => {
    setSelectedReflectionId(id);
  }, []);

  /**
   * Clears the selected reflection
   */
  const clearSelection = useCallback(() => {
    setSelectedReflectionId(null);
  }, []);

  /**
   * Gets the currently selected reflection
   * @returns {Reflection | null} The selected reflection or null
   */
  const getSelectedReflection = useCallback((): Reflection | null => {
    return reflections.find(reflection => reflection.id === selectedReflectionId) || null;
  }, [reflections, selectedReflectionId]);

  /**
   * Gets statistics about the reflections
   */
  const getStats = useCallback(() => {
    const total = reflections.length;
    const passed = reflections.filter(reflection => reflection.status === 'passed').length;
    const inProgress = reflections.filter(reflection => reflection.status === 'in-progress').length;
    const pending = reflections.filter(reflection => reflection.status === 'pending').length;
    
    return { total, passed, inProgress, pending };
  }, [reflections]);

  /**
   * Gets reflections by status
   * @param {ReflectionStatus} status - The status to filter by
   * @returns {Reflection[]} Array of reflections with the specified status
   */
  const getReflectionsByStatus = useCallback((status: ReflectionStatus): Reflection[] => {
    return reflections.filter(reflection => reflection.status === status);
  }, [reflections]);

  /**
   * Gets the most recent reflection
   * @returns {Reflection | null} The most recent reflection or null
   */
  const getLatestReflection = useCallback((): Reflection | null => {
    return reflections.length > 0 ? reflections[0] : null;
  }, [reflections]);

  /**
   * Clears all reflections (for testing or reset purposes)
   */
  const clearAllReflections = useCallback(() => {
    setReflections([]);
    setSelectedReflectionId(null);
  }, []);

  return {
    reflections,
    isLoaded,
    selectedReflectionId,
    addReflection,
    updateReflection,
    updateReflectionStatus,
    deleteReflection,
    selectReflection,
    clearSelection,
    getSelectedReflection,
    getStats,
    getReflectionsByStatus,
    getLatestReflection,
    clearAllReflections,
  };
};
