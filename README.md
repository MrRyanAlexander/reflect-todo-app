# Todo App

A beautiful, modern, and fully-featured todo list application built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Modern UI/UX**: Beautiful gradient design with glassmorphism effects
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Local Storage**: Todos are automatically saved and persist between sessions
- **Real-time Stats**: Track your progress with completion statistics
- **Keyboard Support**: Full keyboard navigation and shortcuts
- **Accessibility**: ARIA labels and semantic HTML for screen readers
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Component Architecture**: Modular, reusable components
- **Custom Hooks**: Clean separation of business logic
- **Performance Optimized**: Memoized components and efficient state management

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Application header
│   ├── Footer.tsx      # Application footer
│   ├── TodoInput.tsx   # Todo input form
│   ├── TodoList.tsx    # Todo list container
│   ├── TodoItem.tsx    # Individual todo item
│   ├── TodoFeedback.tsx # Selected todo feedback
│   ├── Sidebar.tsx     # Sidebar with todo list
│   ├── Stats.tsx       # Statistics display
│   └── index.ts        # Component exports
├── hooks/              # Custom React hooks
│   ├── useTodos.ts     # Todo management logic
│   └── index.ts        # Hook exports
├── types/              # TypeScript type definitions
│   ├── todo.ts         # Todo-related types
│   └── index.ts        # Type exports
├── utils/              # Utility functions
│   ├── storage.ts      # Local storage operations
│   ├── validation.ts   # Input validation
│   └── index.ts        # Utility exports
├── constants/          # Application constants
│   ├── app.ts          # App configuration
│   └── index.ts        # Constant exports
├── App.tsx             # Main application component
├── App.css             # Custom styles and animations
├── index.css           # Global styles
└── main.tsx            # Application entry point
```

## 🏗️ Architecture

### Component Hierarchy

```
App
├── Header
├── Main
│   ├── TodoInput
│   ├── TodoFeedback (conditional)
│   └── Stats (conditional)
├── Sidebar (conditional)
│   └── TodoList
│       └── TodoItem (multiple)
└── Footer
```

### State Management

The application uses React hooks for state management:

- **useTodos**: Custom hook managing all todo-related state and operations
- **Local State**: UI-specific state (sidebar open/closed, selected todo, input value)
- **Local Storage**: Automatic persistence of todos

### Key Features

#### Custom Hook: `useTodos`
- Manages todo CRUD operations
- Handles localStorage persistence
- Provides statistics calculation
- Includes input validation

#### Component Design
- **Single Responsibility**: Each component has a clear, focused purpose
- **Props Interface**: Well-defined TypeScript interfaces for all props
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Performance**: Optimized with proper event handling and memoization

#### Utility Functions
- **Storage**: Safe localStorage operations with error handling
- **Validation**: Input sanitization and validation
- **Constants**: Centralized configuration and text constants

## 🎨 Styling

The application uses Tailwind CSS with custom CSS for advanced animations:

- **Design System**: Consistent color palette and spacing
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth transitions and hover effects
- **Glassmorphism**: Modern backdrop blur effects
- **Gradients**: Beautiful color gradients throughout

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🧪 Testing

The application is built with testing in mind:

- **Type Safety**: Full TypeScript coverage
- **Component Isolation**: Each component can be tested independently
- **Custom Hooks**: Business logic separated for easy unit testing
- **Error Handling**: Comprehensive error handling throughout

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- React Icons for the beautiful icon set
- Vite for the fast build tooling