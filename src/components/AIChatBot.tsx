/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Sri Velan & Co AI Chat Bot Integration
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  AlertCircle, 
  Loader2, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// Custom simple markdown parser to render headings, lists, bold text and clean paragraphs
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  
  return (
    <div className="space-y-2 text-sm leading-relaxed text-neutral-800">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        
        // Skip empty lines
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Headings (###)
        if (trimmed.startsWith('###')) {
          const text = trimmed.replace(/^###\s*/, '');
          return (
            <h4 key={idx} className="font-display font-semibold text-neutral-900 text-sm mt-3 mb-1 flex items-center gap-1.5 border-b border-neutral-200/50 pb-1">
              {renderBoldText(text)}
            </h4>
          );
        }

        // Bullet Lists (* or -)
        if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
          const text = trimmed.replace(/^[*|-]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-2 my-1">
              <span className="text-brand-gold-500 mt-1 shrink-0">•</span>
              <p className="flex-grow">{renderBoldText(text)}</p>
            </div>
          );
        }

        // Regular line
        return (
          <p key={idx} className="my-1">
            {renderBoldText(line)}
          </p>
        );
      })}
    </div>
  );
};

// Helper to replace **text** with bold tags
const renderBoldText = (text: string) => {
  const parts = text.split(/\*\*([\s\S]*?)\*\*/g);
  if (parts.length === 1) return text;
  
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-semibold text-neutral-900">{part}</strong>;
    }
    return part;
  });
};

export const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "### Welcome to Sri Velan & Co!\n\nI am your interactive virtual engineering assistant. Ask me anything about our civil projects, Water Resource canals, machinery fleet, or custom quotes.\n\nChoose an option below or type your query:",
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest coordinate on update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Flash badge when closed and a trigger event happens
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      setHasNewMessage(true);
    }
  }, [messages.length, isOpen]);

  const handleOpenToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
    }
  };

  const suggestionChips = [
    { label: 'Dewatering Fleet 💧', prompt: 'Tell me about Sri Velan & Co\'s disaster dewatering pumps and relief fleet.' },
    { label: 'Hydraulic Broomer 🧹', prompt: 'Review specs for the Tractor-Mounted Hydraulic Broomer.' },
    { label: 'Chennai & Villupuram Offices 📍', prompt: 'Where are your head offices and Chennai corporate branches located?' },
    { label: 'Contact MD Mr. Selva Kumar 👔', prompt: 'How do I contact Governing Partner Mr. Selva Kumar?' }
  ];

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    setError(null);
    setInputMessage('');
    
    // Append User Message to timeline
    const userMsg: ChatMessage = {
      role: 'user',
      text: trimmed,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Map timeline history to Gemini compatible format JSON
      const historyPayload = updatedMessages.slice(1, -1).map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned error code ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: data.text || "An unexpected return message template returned empty.",
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      console.warn("AI Chat API call had issues: ", err);
      setError(
        "A connection delay occurred. Please try submitting again, or call our duty desk directly at +91 98942 18243."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <div id="ai-chatbot-widget-container" className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      
      {/* Expanded Chat Box Window Frame */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 180 }}
            id="ai-chatbot-panel"
            className="w-[400px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden leading-normal"
          >
            {/* Header Area banner */}
            <div className="bg-brand-blue-900 text-white p-4 flex items-center justify-between shadow-md relative shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold-500/20 border border-brand-gold-500/40 flex items-center justify-center text-brand-gold-400">
                  <Bot className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm tracking-wide flex items-center gap-1.5 leading-none">
                    Sri Velan AI Assistant
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse ml-0.5" title="Online" />
                  </h3>
                  <p className="text-[11px] text-neutral-300 font-medium tracking-tight mt-1">
                    Powered by Google Gemini | Class I Portal Help
                  </p>
                </div>
              </div>
              <button
                onClick={handleOpenToggle}
                className="text-neutral-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all duration-200 cursor-pointer"
                aria-label="Close Chat Window"
                id="ai-chat-btn-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages body stream */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-neutral-50/50 scrollbar-thin">
              
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={index}
                    className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    id={`chat-msg-row-${index}`}
                  >
                    {/* Bot avatar representation */}
                    {!isUser && (
                      <div className="w-7 h-7 rounded-full bg-brand-blue-800 text-brand-gold-400 border border-brand-blue-700 mt-1 flex items-center justify-center shrink-0 shadow-sm text-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl p-3.5 shadow-xs border text-sm ${
                        isUser
                          ? 'bg-brand-blue-800 text-white border-brand-blue-900 rounded-br-none'
                          : 'bg-white text-neutral-800 border-neutral-200/80 rounded-bl-none'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <SimpleMarkdown content={msg.text} />
                      )}
                      
                      <span
                        className={`text-[9.5px] mt-1.5 block text-right font-medium tracking-tight ${
                          isUser ? 'text-blue-200' : 'text-neutral-400'
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* User avatar representation */}
                    {isUser && (
                      <div className="w-7 h-7 rounded-full bg-brand-gold-500 text-brand-blue-950 mt-1 flex items-center justify-center shrink-0 shadow-sm text-xs border border-brand-gold-600/30">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Bot loading thinking state */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start" id="chat-msg-loading-row">
                  <div className="w-7 h-7 rounded-full bg-brand-blue-800 text-brand-gold-400 border border-brand-blue-700 mt-1 flex items-center justify-center shrink-0 shadow-sm text-xs animate-spin">
                    <Loader2 className="w-4 h-4" />
                  </div>
                  <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-neutral-200/80 rounded-bl-none max-w-[82%]">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-brand-blue-800 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-brand-blue-800 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-brand-blue-800 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-neutral-400 italic">Formulating engineering response...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Internal connection error block */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-start gap-2" id="chat-msg-error-row">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <p className="font-semibold">API Sync Delay</p>
                    <p className="mt-0.5 text-neutral-600">{error}</p>
                    <button 
                      onClick={() => {
                        const lastUser = [...messages].reverse().find(m => m.role === 'user');
                        if (lastUser) handleSendMessage(lastUser.text);
                      }}
                      className="mt-2 text-brand-blue-800 hover:text-brand-blue-900 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:underline"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retry Prompt
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips and Quick Actions layout */}
            {messages.length === 1 && !isLoading && (
              <div className="p-3 bg-neutral-100/70 border-t border-neutral-200/90 shrink-0">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 px-1 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-neutral-400" /> Suggested Inquiries
                </p>
                <div className="grid grid-cols-1 gap-1.5">
                  {suggestionChips.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(chip.prompt)}
                      className="text-left text-[12px] font-medium text-neutral-700 bg-white hover:bg-neutral-50 hover:text-brand-blue-900 hover:border-neutral-300 border border-neutral-200/80 rounded-xl px-2.5 py-1.5 cursor-pointer shadow-2xs transition-all flex items-center justify-between group active:scale-99"
                    >
                      <span>{chip.label}</span>
                      <Send className="w-3 h-3 text-neutral-300 group-hover:text-brand-gold-500 transform group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar Form */}
            <form
              onSubmit={handleFormSubmit}
              className="p-3 bg-white border-t border-neutral-200 flex gap-2 shrink-0 items-center justify-between"
              id="ai-chatbot-form"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about civil works, rental pumps..."
                disabled={isLoading}
                className="flex-grow text-sm text-neutral-800 bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white border border-transparent focus:border-brand-blue-800/30 rounded-xl px-3.5 py-2.5 outline-none transition-all disabled:opacity-60"
                id="ai-chatbot-text-input"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-brand-blue-800 text-white hover:bg-brand-blue-900 disabled:bg-neutral-200 disabled:text-neutral-400 p-2.5 rounded-xl transition-all shadow-md hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
                id="ai-chatbot-btn-submit"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Activation Button and Toggle state */}
      <div className="flex items-center gap-3">
        {/* Subtle Welcome Hint Bubble popup */}
        {!isOpen && messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="bg-brand-blue-900 text-white text-[12px] font-medium py-2 px-3.5 rounded-2xl shadow-xl font-display uppercase tracking-wide border border-brand-blue-800/50 relative flex items-center gap-2 pr-4 pl-3"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span>AI Support Desk</span>
            {/* arrow indicator */}
            <div className="absolute right-[-4px] top-[14px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-brand-blue-900" />
          </motion.div>
        )}

        <button
          onClick={handleOpenToggle}
          className={`relative p-4 rounded-full shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-center text-shadow ${
            isOpen 
              ? 'bg-neutral-800 hover:bg-neutral-900 text-white border border-neutral-700 rotate-90 scale-95' 
              : 'bg-brand-gold-500 hover:bg-brand-gold-400 text-brand-blue-950 border border-brand-gold-600/30 hover:scale-110 active:scale-95'
          }`}
          id="ai-chatbot-trigger-btn"
          title={isOpen ? "Minimize Agent Desk" : "Open Sri Velan AI Helpdesk"}
        >
          {isOpen ? (
            <X className="w-5.5 h-5.5" />
          ) : (
            <>
              <Sparkles className="w-5.5 h-5.5 animate-pulse" />
              {hasNewMessage && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4" id="ai-chat-notif-dot">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold text-white text-center justify-center items-center">
                    1
                  </span>
                </span>
              )}
            </>
          )}
        </button>
      </div>

    </div>
  );
};
