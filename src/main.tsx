/**
 * Application entry point
 * 
 * This file initializes the React application and renders the root App component.
 * It sets up the React StrictMode for development warnings and applies global styles.
 * 
 * @fileoverview Main entry point for the Todo application
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App.tsx';

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Ensure the root element exists
if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a div with id="root" in your HTML.');
}

// Create the React root and render the application
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
