/**
 * Vite configuration for the Todo application
 * 
 * This file configures the Vite build tool with React and Tailwind CSS plugins.
 * Vite provides fast development server and optimized production builds.
 * 
 * @fileoverview Vite build configuration
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Vite configuration object
 * 
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [
    react(), // React plugin for JSX support and HMR
    tailwindcss(), // Tailwind CSS plugin for utility-first styling
  ],
  // Development server configuration
  server: {
    port: 5173,
    open: true, // Automatically open browser on dev server start
  },
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true, // Generate source maps for debugging
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['react-icons'],
        },
      },
    },
  },
});
