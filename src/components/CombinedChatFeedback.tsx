import React, { useEffect, useRef } from 'react';
import type { ChatContextProps, FeedbackContextProps } from '../types/reflection';
import { MessageRole } from '../types/reflection';
import { SmartInput } from './SmartInput';
import { PinnedReflection } from './PinnedReflection';
import { AppContext } from '../types/reflection';

/**
 * Combined Chat and Feedback component
 * Shows feedback at the top and chat below for a unified experience
 */
export const CombinedChatFeedback: React.FC<ChatContextProps & FeedbackContextProps> = ({
  reflection,
  messages,
  onSendMessage,
  isSending,
  feedback,
  onEdit,
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
   * Formats assistant message content with better styling
   */
  const formatAssistantMessage = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const formattedLines = lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        return (
          <div key={index} className="flex items-start space-x-2 mb-1">
            <span className="text-pink-400 text-lg">✨</span>
            <span className="text-slate-200">{trimmedLine.substring(1).trim()}</span>
          </div>
        );
      }
      
      if (trimmedLine.endsWith('?')) {
        return (
          <div key={index} className="flex items-start space-x-2 mb-2">
            <span className="text-blue-400 text-lg">❓</span>
            <span className="text-blue-300 font-medium">{trimmedLine}</span>
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-2 text-slate-200">
          {trimmedLine}
        </div>
      );
    });
    
    return formattedLines;
  };

  /**
   * Checks if a message indicates the reflection is ready to submit
   */
  const isReadyToSubmit = (content: string) => {
    const readyPhrases = ['ready to submit', 'looks great', 'ready to pass', 'good to go'];
    return readyPhrases.some(phrase => content.toLowerCase().includes(phrase));
  };

  // Unused functions commented out to fix compilation
  /*
  const renderFeedbackItem = (title: string, item: any) => {
    const isPassed = item.pass;
    
    return (
      <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-800/30">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
          isPassed 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-orange-500/20 text-orange-400'
        }`}>
          {isPassed ? '✓' : '!'}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-xs font-medium text-white">{title}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isPassed 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-orange-500/20 text-orange-300'
            }`}>
              {isPassed ? 'Good' : 'Needs Work'}
            </span>
          </div>
        </div>
      </div>
    );
  };
  */

  /*
  const renderOverallScore = () => {
    if (!feedback) return null;

    const score = getDisplayScore(feedback.overallScore);
    const status = feedback.status;
    
    const getScoreColor = () => {
      if (score >= 80) return 'text-green-400';
      if (score >= 60) return 'text-yellow-400';
      return 'text-orange-400';
    };

    const getStatusText = () => {
      switch (status) {
        case 'excellent':
        case 'good':
          return 'Pass';
        case 'needs-work':
        default:
          return 'Needs Work';
      }
    };

    const getStatusColor = () => {
      switch (status) {
        case 'excellent':
        case 'good':
          return 'bg-green-500/20 text-green-300';
        case 'needs-work':
        default:
          return 'bg-orange-500/20 text-orange-300';
      }
    };

    return (
      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            status === 'excellent' || status === 'good' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-orange-500/20 text-orange-400'
          }`}>
            {status === 'excellent' || status === 'good' ? '✓' : '!'}
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Score</h3>
            <p className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusColor()}`}>
              {getStatusText()}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-xl font-bold ${getScoreColor()}`}>
            {score}%
          </div>
        </div>
      </div>
    );
  };
  */

  /**
   * Renders a message bubble
   */
  const renderMessage = (message: any, index: number) => {
    const isUser = message.role === MessageRole.USER;
    const isSystem = message.role === MessageRole.SYSTEM;
    const isReady = !isUser && isReadyToSubmit(message.content);

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
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
      >
        <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
            isUser 
              ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white' 
              : isReady
                ? 'bg-gradient-to-br from-green-400 to-green-500 text-white'
                : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white'
          }`}>
            {isUser ? '👤' : isReady ? '✅' : '🤖'}
          </div>

          <div className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white'
              : isReady
                ? 'bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-200 border border-green-500/30'
                : 'bg-gradient-to-br from-slate-700/80 to-slate-800/80 text-slate-200 border border-blue-500/30'
          }`}>
            <div className="text-sm leading-relaxed">
              {isUser ? message.content : formatAssistantMessage(message.content)}
            </div>
            <div className={`text-xs mt-2 ${
              isUser ? 'text-pink-100' : isReady ? 'text-green-300' : 'text-slate-400'
            }`}>
              {formatTimestamp(message.timestamp)}
            </div>
            
            {isReady && (
              <div className="mt-3 pt-3 border-t border-green-500/20">
                <button
                  onClick={() => {
                    if (window.confirm('Submit this reflection for final evaluation?')) {
                      const event = new CustomEvent('submitReflection');
                      window.dispatchEvent(event);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>🚀</span>
                  <span>Submit Reflection</span>
                </button>
              </div>
            )}
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
        <h3 className="text-lg font-semibold text-white mb-2">How can I help?</h3>
        <p className="text-slate-400 text-sm mb-6">
          I'm here to help you improve your reflection.
        </p>
        <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
          <button
            className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-500/30 rounded-lg p-3 text-left transition-colors"
            onClick={() => handleSendMessage('How do I make it better?')}
          >
            <span className="text-slate-200 hover:text-white">How do I make it better?</span>
          </button>
          <button
            className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-500/30 rounded-lg p-3 text-left transition-colors"
            onClick={() => handleSendMessage('What\'s missing?')}
          >
            <span className="text-slate-200 hover:text-white">What's missing?</span>
          </button>
          <button
            className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-500/30 rounded-lg p-3 text-left transition-colors"
            onClick={() => handleSendMessage('Is this ready to submit?')}
          >
            <span className="text-slate-200 hover:text-white">Is this ready to submit?</span>
          </button>
          <button
            className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-500/30 rounded-lg p-3 text-left transition-colors"
            onClick={() => handleSendMessage('How do I fix the issues?')}
          >
            <span className="text-slate-200 hover:text-white">How do I fix the issues?</span>
          </button>
        </div>
      </div>
    );
  };


  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Pinned Reflection Banner */}
      <PinnedReflection reflection={reflection} showText={true} feedback={feedback} onEdit={onEdit || (() => {})} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto mb-3 space-y-3 min-h-0">
        {messages.length === 0 ? (
          renderWelcomeMessage()
        ) : (
          messages.map((message, index) => renderMessage(message, index))
        )}
        
        {/* Typing indicator */}
        {isSending && (
          <div className="flex justify-start mb-3">
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
      <div className="border-t border-slate-700/50 pt-3">
        <SmartInput
          value=""
          onChange={() => {}}
          onSend={(message) => reflection && handleSendMessage(message)}
          context={AppContext.CHAT}
          disabled={isSending || !reflection}
          placeholder={reflection ? "Ask about your reflection..." : "Create a reflection first to start chatting"}
        />
      </div>
    </div>
  );
};
