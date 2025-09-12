import React from 'react';
import { UI_TEXT } from '../constants/app';

/**
 * Footer component with app branding
 */
export const Footer: React.FC = () => {
  return (
    <footer className="p-4 text-center text-slate-400 text-sm border-t border-pink-500/20 bg-black/20 backdrop-blur-sm">
      <p>{UI_TEXT.MADE_WITH_LOVE}</p>
    </footer>
  );
};
