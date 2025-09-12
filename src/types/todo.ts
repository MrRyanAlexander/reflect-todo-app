/**
 * Core Todo interface defining the structure of a todo item
 * @interface Todo
 */
export interface Todo {
  /** Unique identifier for the todo item */
  id: string;
  /** The text content of the todo */
  text: string;
  /** Whether the todo is completed or not */
  completed: boolean;
  /** When the todo was created */
  createdAt: Date;
}

/**
 * Props interface for the TodoList component
 * @interface TodoListProps
 */
export interface TodoListProps {
  /** Array of todo items to display */
  todos: Todo[];
  /** Callback function to toggle todo completion status */
  onToggle: (id: string) => void;
  /** Callback function to delete a todo */
  onDelete: (id: string) => void;
  /** Callback function to select a todo for editing */
  onSelect: (todo: Todo) => void;
  /** ID of the currently selected todo */
  selectedTodoId?: string | undefined;
}

/**
 * Props interface for the TodoItem component
 * @interface TodoItemProps
 */
export interface TodoItemProps {
  /** The todo item to display */
  todo: Todo;
  /** Whether this todo is currently selected */
  isSelected: boolean;
  /** Callback function to toggle todo completion status */
  onToggle: (id: string) => void;
  /** Callback function to delete a todo */
  onDelete: (id: string) => void;
  /** Callback function to select a todo for editing */
  onSelect: (todo: Todo) => void;
}

/**
 * Props interface for the TodoInput component
 * @interface TodoInputProps
 */
export interface TodoInputProps {
  /** Current input value */
  value: string;
  /** Callback function when input value changes */
  onChange: (value: string) => void;
  /** Callback function when todo is added */
  onAdd: () => void;
  /** Placeholder text for the input */
  placeholder?: string;
}

/**
 * Props interface for the Sidebar component
 * @interface SidebarProps
 */
export interface SidebarProps {
  /** Whether the sidebar is open */
  isOpen: boolean;
  /** Callback function to close the sidebar */
  onClose: () => void;
  /** Array of todo items to display */
  todos: Todo[];
  /** Callback function to toggle todo completion status */
  onToggle: (id: string) => void;
  /** Callback function to delete a todo */
  onDelete: (id: string) => void;
  /** Callback function to select a todo for editing */
  onSelect: (todo: Todo) => void;
  /** ID of the currently selected todo */
  selectedTodoId?: string | undefined;
}
