import { useState } from 'react';
import './App.css';

// Import components
import {
  Header,
  Footer,
  TodoInput,
  TodoFeedback,
  Sidebar,
  Stats,
} from './components';

// Import hooks and types
import { useTodos } from './hooks';
import type { Todo } from './types';
import { CSS_CLASSES, THEME } from './constants';

/**
 * Main App component
 * 
 * This is the root component of the Todo application. It manages the overall
 * application state, coordinates between different components, and handles
 * the main user interactions.
 * 
 * Features:
 * - Todo management through custom hooks
 * - Responsive sidebar navigation
 * - Real-time statistics display
 * - Local storage persistence
 * - Keyboard accessibility
 * 
 * @component
 * @returns {JSX.Element} The main application component
 */
function App() {
  // Custom hook for todo management
  const {
    todos,
    isLoaded,
    addTodo: addTodoToState,
    toggleTodo,
    deleteTodo: deleteTodoFromState,
    getStats,
  } = useTodos();

  // Local state for UI interactions
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  /**
   * Handles adding a new todo
   */
  const handleAddTodo = () => {
    const newTodo = addTodoToState(inputValue);
    if (newTodo) {
      setSelectedTodo(newTodo); // Set the new todo as selected for feedback
      setInputValue('');
    }
  };

  /**
   * Handles deleting a todo and clears selection if needed
   */
  const handleDeleteTodo = (id: string) => {
    deleteTodoFromState(id);
    // Clear selected todo if it was deleted
    if (selectedTodo?.id === id) {
      setSelectedTodo(null);
    }
  };

  /**
   * Handles selecting a todo for editing
   */
  const handleSelectTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setInputValue(todo.text);
    setIsSidebarOpen(false); // Close sidebar after selecting todo
  };

  /**
   * Handles clearing the selected todo
   */
  const handleClearSelection = () => {
    setSelectedTodo(null);
    setInputValue('');
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
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${THEME.BACKGROUND_GRADIENT}`}>
      {/* Header */}
      <Header onMenuClick={handleOpenSidebar} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className={`w-full ${CSS_CLASSES.MAX_CONTENT_WIDTH}`}>
          {/* Todo Input */}
          <TodoInput
            value={inputValue}
            onChange={setInputValue}
            onAdd={handleAddTodo}
          />

          {/* Feedback View - Show selected/most recent todo */}
          {selectedTodo && (
            <TodoFeedback
              selectedTodo={selectedTodo}
              isLatest={selectedTodo.id === todos[0]?.id}
              onClear={handleClearSelection}
            />
          )}

          {/* Stats */}
          <Stats total={stats.total} completed={stats.completed} />
        </div>
      </main>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        todos={todos}
        onToggle={toggleTodo}
        onDelete={handleDeleteTodo}
        onSelect={handleSelectTodo}
        selectedTodoId={selectedTodo?.id}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;