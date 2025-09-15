import { useState, useEffect } from 'react';
import './App.css';

// Import components
import {
  Header,
  Footer,
  Sidebar,
  ContextTabs,
  CombinedChatFeedback,
  WriteEditContext,
} from './components';

// Import hooks and types
import { useReflections, useChat, useAppContext } from './hooks';
import type { Reflection, StructuredResponse } from './types/reflection';
import { AppContext, ReflectionStatus } from './types/reflection';
import { CSS_CLASSES, THEME } from './constants';

/**
 * Main App component
 * 
 * This is the root component of the Reflection Learning application. It manages the overall
 * application state, coordinates between different components, and handles
 * the main user interactions for reflection learning.
 * 
 * Features:
 * - Reflection management through custom hooks
 * - Tabbed context interface (Chat/Feedback/Write-Edit)
 * - Responsive sidebar navigation
 * - Real-time statistics display
 * - Local storage persistence
 * - Educational feedback system
 * 
 * @component
 * @returns {JSX.Element} The main application component
 */
function App() {
  // Custom hooks for state management
  const {
    reflections,
    isLoaded: reflectionsLoaded,
    selectedReflectionId,
    addReflection,
    updateReflection,
    updateReflectionStatus,
    deleteReflection,
    selectReflection,
    clearSelection,
    getSelectedReflection,
    getStats,
  } = useReflections();

  const {
    isSending,
    sendMessage,
    getMessagesForReflection,
  } = useChat();

  const {
    activeContext,
    isLoaded: contextLoaded,
    switchContext,
  } = useAppContext();

  // Local state for UI interactions
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentReflectionText, setCurrentReflectionText] = useState('');
  const [feedback, setFeedback] = useState<StructuredResponse | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Get current reflection and messages
  const selectedReflection = getSelectedReflection();
  const currentMessages = selectedReflection ? getMessagesForReflection(selectedReflection.id) : [];

  // Update current reflection text when selection changes
  useEffect(() => {
    if (selectedReflection) {
      setCurrentReflectionText(selectedReflection.text);
    } else {
      setCurrentReflectionText('');
    }
  }, [selectedReflection]);

  // Listen for submit reflection events from chat
  useEffect(() => {
    const handleChatSubmitReflection = () => {
      handleSubmitReflection();
    };

    window.addEventListener('submitReflection', handleChatSubmitReflection);
    return () => {
      window.removeEventListener('submitReflection', handleChatSubmitReflection);
    };
  }, []);

  /**
   * Handles creating a new reflection
   */
  const handleCreateReflection = () => {
    // Clear current selection and text
    clearSelection();
    setCurrentReflectionText('');
    setFeedback(null);
    
    // Switch to Write/Edit context
    switchContext(AppContext.WRITE_EDIT);
  };

  /**
   * Handles updating reflection text
   */
  const handleUpdateReflectionText = (text: string) => {
    setCurrentReflectionText(text);
    if (selectedReflection) {
      updateReflection(selectedReflection.id, text);
    }
  };

  /**
   * Handles saving draft
   */
  const handleSaveDraft = () => {
    if (currentReflectionText.trim()) {
      if (selectedReflection) {
        updateReflection(selectedReflection.id, currentReflectionText);
        updateReflectionStatus(selectedReflection.id, ReflectionStatus.IN_PROGRESS);
      } else {
        const newReflection = addReflection(currentReflectionText);
        if (newReflection) {
          updateReflectionStatus(newReflection.id, ReflectionStatus.IN_PROGRESS);
        }
      }
    }
  };

  /**
   * Handles submitting reflection for evaluation
   */
  const handleSubmitReflection = async () => {
    if (!currentReflectionText.trim()) return;

    setIsEvaluating(true);
    
    try {
      // Create or update reflection
      let reflection = selectedReflection;
      if (!reflection) {
        reflection = addReflection(currentReflectionText);
      } else {
        updateReflection(reflection.id, currentReflectionText);
      }

      if (reflection) {
        // Get past passing reflections for similarity check
        const pastPassingReflections = reflections
          .filter(r => r.status === 'passed')
          .map(r => ({ text: r.text, createdAt: r.createdAt }));

        // Call evaluation API
        const response = await fetch('/api/evaluate-reflection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reflectionText: currentReflectionText,
            pastPassingReflections: pastPassingReflections,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setFeedback(data.data);
            
            // Update reflection status based on evaluation
            const status = data.data.status === 'excellent' ? ReflectionStatus.PASSED : ReflectionStatus.IN_PROGRESS;
            updateReflectionStatus(reflection.id, status);
            
            // Switch to chat context to show feedback and allow chat
            switchContext(AppContext.CHAT);
          }
        }
      }
    } catch (error) {
      console.error('Error evaluating reflection:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  /**
   * Handles sending chat message
   */
  const handleSendChatMessage = async (content: string) => {
    if (selectedReflection) {
      await sendMessage(selectedReflection.id, content, selectedReflection, feedback);
    }
  };

  /**
   * Handles selecting a reflection
   */
  const handleSelectReflection = (reflection: Reflection) => {
    selectReflection(reflection.id);
    setIsSidebarOpen(false);
  };

  /**
   * Handles deleting a reflection
   */
  const handleDeleteReflection = (id: string) => {
    deleteReflection(id);
    if (selectedReflection?.id === id) {
      clearSelection();
      setCurrentReflectionText('');
      setFeedback(null);
    }
  };

  /**
   * Handles opening the sidebar
   */
  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  /**
   * Handles closing the sidebar
   */
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Get statistics
  const stats = getStats();

  // Don't render until data is loaded
  if (!reflectionsLoaded || !contextLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br ${THEME.BACKGROUND_GRADIENT}`}>
      {/* Header */}
      <Header onMenuClick={handleOpenSidebar} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-4 py-6 min-h-0 overflow-hidden">
        <div className={`w-full ${CSS_CLASSES.MAX_CONTENT_WIDTH} mx-auto flex flex-col h-full`}>
          {/* Context Tabs */}
          <div className="mb-4 flex-shrink-0">
            <ContextTabs
              activeContext={activeContext}
              onContextChange={switchContext}
              hasReflection={!!selectedReflection}
            />
          </div>

          {/* Context Content */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-pink-500/20 p-4 flex-1 flex flex-col min-h-0 overflow-hidden">
            {activeContext === AppContext.CHAT && (
              <CombinedChatFeedback
                reflection={selectedReflection}
                messages={currentMessages}
                onSendMessage={handleSendChatMessage}
                isSending={isSending}
                feedback={feedback}
                isLoading={isEvaluating}
                onEdit={() => switchContext(AppContext.WRITE_EDIT)}
              />
            )}

            {activeContext === AppContext.WRITE_EDIT && (
              <WriteEditContext
                reflectionText={currentReflectionText}
                onTextChange={handleUpdateReflectionText}
                onSubmit={handleSubmitReflection}
                onSaveDraft={handleSaveDraft}
                isSubmitting={isEvaluating}
                status={selectedReflection?.status || ReflectionStatus.PENDING}
                feedback={feedback}
              />
            )}
          </div>

        </div>
      </main>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        reflections={reflections}
        onSelect={handleSelectReflection}
        onDelete={handleDeleteReflection}
        selectedReflectionId={selectedReflectionId || undefined}
        onCreateNew={handleCreateReflection}
        stats={stats}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;