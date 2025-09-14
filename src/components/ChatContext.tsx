import React, { useEffect, useRef } from 'react';
import type { ChatContextProps } from '../types/reflection';
import { MessageRole } from '../types/reflection';
import { SmartInput } from './SmartInput';
import { AppContext } from '../types/reflection';

/**
 * Chat context component for conversational interface
 * Displays chat messages with bubbles and handles user input
 */
export const ChatContext: React.FC<ChatContextProps> = ({
  reflection,
  messages,
  onSendMessage,
  isSending,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Handles sending a message
   */
  const handleSendMessage = (content: string) => {
    if (content.trim() && !isSending) {
      onSendMessage(content);
    }
  };

  /**
   * Formats message timestamp
   */
  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Renders a message bubble
   */
  const renderMessage = (message: any, index: number) => {
    const isUser = message.role === MessageRole.USER;
    const isSystem = message.role === MessageRole.SYSTEM;

    if (isSystem) {
      return (
        <div key={index} className="flex justify-center my-2">
          <div className="bg-slate-700/50 text-slate-400 text-xs px-3 py-1 rounded-full">
            {message.content}
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
            isUser 
              ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white' 
              : 'bg-gradient-to-br from-slate-600 to-slate-700 text-slate-300'
          }`}>
            {isUser ? '👤' : '🤖'}
          </div>

          {/* Message bubble */}
          <div className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white'
              : 'bg-slate-700/50 text-slate-200 border border-slate-600/50'
          }`}>
            <div className="text-sm leading-relaxed">
              {message.content}
            </div>
            <div className={`text-xs mt-1 ${
              isUser ? 'text-pink-100' : 'text-slate-400'
            }`}>
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders welcome message when no messages exist
   */
  const renderWelcomeMessage = () => {
    if (!reflection) {
      return (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Start a Conversation</h3>
          <p className="text-slate-400 text-sm">
            Create a reflection first, then I can help you improve it!
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🤖</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">How can I help?</h3>
        <p className="text-slate-400 text-sm mb-4">
          I'm here to help you improve your reflection. Ask me anything!
        </p>
        <div className="space-y-2">
          <div className="bg-slate-800/50 rounded-lg p-3 text-left">
            <p className="text-slate-300 text-sm">
              <strong>Try asking:</strong>
            </p>
            <ul className="text-slate-400 text-xs mt-1 space-y-1">
              <li>• "What should I write about my feelings?"</li>
              <li>• "How can I make this better?"</li>
              <li>• "What am I missing?"</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg">💬</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Chat Assistant</h2>
          <p className="text-slate-400 text-sm">
            {reflection ? 'Get help with your reflection' : 'Create a reflection to get started'}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0">
        {messages.length === 0 ? (
          renderWelcomeMessage()
        ) : (
          messages.map((message, index) => renderMessage(message, index))
        )}
        
        {/* Typing indicator */}
        {isSending && (
          <div className="flex justify-start mb-4">
            <div className="flex items-end space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-sm text-slate-300">
                🤖
              </div>
              <div className="bg-slate-700/50 text-slate-200 border border-slate-600/50 px-4 py-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-700/50 pt-4">
        <SmartInput
          value=""
          onChange={() => {}}
          onSend={(message) => reflection && handleSendMessage(message)}
          context={AppContext.CHAT}
          disabled={isSending || !reflection}
          placeholder={reflection ? "Ask me anything about your reflection..." : "Create a reflection first to start chatting"}
        />
      </div>
    </div>
  );
};
