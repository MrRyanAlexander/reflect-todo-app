/**
 * ESLint configuration for the Todo application
 * 
 * This file configures ESLint with TypeScript, React, and React Hooks rules
 * to ensure code quality, consistency, and best practices throughout the project.
 * 
 * @fileoverview ESLint configuration and linting rules
 */

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

/**
 * ESLint configuration object
 * 
 * @see https://eslint.org/docs/latest/use/configure/
 */
export default tseslint.config([
  // Global ignores
  {
    ignores: ['dist', 'node_modules', '*.config.js', '*.config.ts'],
  },
  // Base configuration
  js.configs.recommended,
  // TypeScript configuration
  ...tseslint.configs.recommended,
  // React and React Hooks configuration
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Additional custom rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
]);
