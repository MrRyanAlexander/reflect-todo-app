/**
 * Core Reflection interface defining the structure of a reflection item
 * @interface Reflection
 */
export interface Reflection {
  /** Unique identifier for the reflection item */
  id: string;
  /** The text content of the reflection */
  text: string;
  /** Current status of the reflection */
  status: ReflectionStatus;
  /** When the reflection was created */
  createdAt: Date;
  /** When the reflection was last updated */
  updatedAt: Date;
  /** ID of the associated chat session */
  chatSessionId: string;
  /** Current version number for tracking edits */
  currentVersion: number;
}

/**
 * Chat message interface for conversation history
 * @interface ChatMessage
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;
  /** Role of the message sender */
  role: MessageRole;
  /** Content of the message */
  content: string;
  /** When the message was sent */
  timestamp: Date;
  /** Context of the message */
  context: 'general' | 'reflection-help' | 'feedback-discussion';
  /** Optional metadata for the message */
  metadata?: {
    reflectionId?: string;
    isEditable?: boolean;
  };
}

/**
 * Chat session interface linking reflection to chat
 * @interface ChatSession
 */
export interface ChatSession {
  /** Unique identifier for the chat session */
  id: string;
  /** ID of the associated reflection */
  reflectionId: string;
  /** Array of messages in the chat */
  messages: ChatMessage[];
  /** Whether the chat session is currently active */
  isActive: boolean;
  /** When the chat session was created */
  createdAt: Date;
}

/**
 * Reflection status constants
 */
export const ReflectionStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  PASSED: 'passed'
} as const;

export type ReflectionStatus = typeof ReflectionStatus[keyof typeof ReflectionStatus];

/**
 * Message role constants
 */
export const MessageRole = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system'
} as const;

export type MessageRole = typeof MessageRole[keyof typeof MessageRole];

/**
 * Structured response interface for LLM feedback
 * @interface StructuredResponse
 */
export interface StructuredResponse {
  /** Feedback for each reflection requirement */
  feedback: {
    happened: FeedbackItem;
    feeling: FeedbackItem;
    next: FeedbackItem;
  };
  /** Array of suggestions for improvement */
  suggestions: string[];
  /** Overall score for the reflection */
  overallScore: number;
  /** Current status of the reflection */
  status: 'needs-work' | 'good' | 'excellent';
}

/**
 * Feedback item interface for individual requirements
 * @interface FeedbackItem
 */
export interface FeedbackItem {
  /** Whether the requirement passes */
  pass: boolean;
  /** Remarks about the requirement */
  remarks: string;
  /** Optional suggestions for improvement */
  suggestions?: string[];
}

/**
 * App context constants for tabbed interface
 */
export const AppContext = {
  CHAT: 'chat',
  FEEDBACK: 'feedback',
  WRITE_EDIT: 'write-edit'
} as const;

export type AppContext = typeof AppContext[keyof typeof AppContext];

/**
 * Props interface for the ReflectionList component
 * @interface ReflectionListProps
 */
export interface ReflectionListProps {
  /** Array of reflection items to display */
  reflections: Reflection[];
  /** Callback function to select a reflection */
  onSelect: (reflection: Reflection) => void;
  /** Callback function to delete a reflection */
  onDelete: (id: string) => void;
  /** ID of the currently selected reflection */
  selectedReflectionId?: string | undefined;
}

/**
 * Props interface for the ReflectionItem component
 * @interface ReflectionItemProps
 */
export interface ReflectionItemProps {
  /** The reflection item to display */
  reflection: Reflection;
  /** Whether this reflection is currently selected */
  isSelected: boolean;
  /** Callback function to select the reflection */
  onSelect: (reflection: Reflection) => void;
  /** Callback function to delete the reflection */
  onDelete: (id: string) => void;
}

/**
 * Props interface for the ContextTabs component
 * @interface ContextTabsProps
 */
export interface ContextTabsProps {
  /** Current active context */
  activeContext: AppContext;
  /** Callback function when context changes */
  onContextChange: (context: AppContext) => void;
  /** Whether reflection is available for context switching */
  hasReflection: boolean;
}

/**
 * Props interface for the ChatContext component
 * @interface ChatContextProps
 */
export interface ChatContextProps {
  /** Current reflection being discussed */
  reflection: Reflection | null;
  /** Array of chat messages */
  messages: ChatMessage[];
  /** Callback function to send a message */
  onSendMessage: (content: string) => void;
  /** Whether a message is being sent */
  isSending: boolean;
  /** Optional callback to switch to edit mode */
  onEdit?: () => void;
}

/**
 * Props interface for the FeedbackContext component
 * @interface FeedbackContextProps
 */
export interface FeedbackContextProps {
  /** Current reflection being evaluated */
  reflection: Reflection | null;
  /** Structured feedback response */
  feedback: StructuredResponse | null;
  /** Whether feedback is being loaded */
  isLoading: boolean;
}

/**
 * Props interface for the WriteEditContext component
 * @interface WriteEditContextProps
 */
export interface WriteEditContextProps {
  /** Current reflection text */
  reflectionText: string;
  /** Callback function when text changes */
  onTextChange: (text: string) => void;
  /** Callback function to submit reflection */
  onSubmit: () => void;
  /** Callback function to save draft */
  onSaveDraft: () => void;
  /** Whether reflection is being submitted */
  isSubmitting: boolean;
  /** Current reflection status */
  status: ReflectionStatus;
  /** Feedback data for showing similarity warnings */
  feedback?: any;
}

/**
 * Props interface for the SmartInput component
 * @interface SmartInputProps
 */
export interface SmartInputProps {
  /** Current input value */
  value: string;
  /** Callback function when input value changes */
  onChange: (value: string) => void;
  /** Callback function to send message */
  onSend: (message: string) => void;
  /** Current context for placeholder text */
  context: AppContext;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Placeholder text override */
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
  /** Array of reflection items to display */
  reflections: Reflection[];
  /** Callback function to select a reflection */
  onSelect: (reflection: Reflection) => void;
  /** Callback function to delete a reflection */
  onDelete: (id: string) => void;
  /** ID of the currently selected reflection */
  selectedReflectionId?: string | undefined;
  /** Callback function to create a new reflection */
  onCreateNew?: () => void;
  /** Stats data for compact display */
  stats?: {
    total: number;
    completed: number;
    passed: number;
    pending: number;
    inProgress: number;
  };
}
