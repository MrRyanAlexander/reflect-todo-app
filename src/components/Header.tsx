import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { APP_CONFIG } from '../constants/app';

/**
 * Props interface for the Header component
 */
interface HeaderProps {
  /** Callback function to open the sidebar */
  onMenuClick: () => void;
}

/**
 * Header component with app title and menu button
 */
export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  /**
   * Handles the menu button click
   */
  const handleMenuClick = () => {
    onMenuClick();
  };

  return (
    <header className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border-b border-pink-500/20">
      <button
        onClick={handleMenuClick}
        className="p-2 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 transition-colors"
        aria-label="Open menu"
      >
        <FiMenu className="w-6 h-6 text-pink-300" />
      </button>
      
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm" role="img" aria-label="Sparkles">
            ✨
          </span>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
          {APP_CONFIG.NAME}
        </h1>
      </div>

      <div className="w-10" aria-hidden="true" /> {/* Spacer for centering */}
    </header>
  );
};
