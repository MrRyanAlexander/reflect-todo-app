/**
 * Utility exports for cleaner imports
 */

export * from './storage';
export * from './validation';

/**
 * Transforms the actual score for display to encourage ELL students
 * Shows 100%+ when they achieve 75%+ to build confidence
 */
export const getDisplayScore = (actualScore: number): number => {
  if (actualScore >= 75) {
    return Math.min(100, actualScore + 15); // Boost by 15 points, cap at 100
  }
  return actualScore;
};

/**
 * Calculates similarity between two texts using simple word overlap
 * Returns a similarity score between 0 and 1
 */
export const calculateTextSimilarity = (text1: string, text2: string): number => {
  if (!text1 || !text2) return 0;
  
  // Normalize texts: lowercase, remove punctuation, split into words
  const normalize = (text: string) => 
    text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2); // Filter out short words
  
  const words1 = normalize(text1);
  const words2 = normalize(text2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  // Calculate Jaccard similarity (intersection / union)
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(word => set2.has(word)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

/**
 * Checks if a reflection is too similar to past passing reflections
 * Returns similarity info if found, null if unique
 */
export const checkReflectionSimilarity = (
  currentText: string, 
  pastPassingReflections: Array<{ text: string; createdAt: string }>
): { similarReflection: string; similarity: number; date: string } | null => {
  const SIMILARITY_THRESHOLD = 0.6; // 60% similarity threshold
  
  for (const pastReflection of pastPassingReflections) {
    const similarity = calculateTextSimilarity(currentText, pastReflection.text);
    
    if (similarity >= SIMILARITY_THRESHOLD) {
      return {
        similarReflection: pastReflection.text,
        similarity: Math.round(similarity * 100),
        date: pastReflection.createdAt
      };
    }
  }
  
  return null;
};
