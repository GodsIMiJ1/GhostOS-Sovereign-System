/**
 * 🔥 OMARI FLOATING PANEL - DIVINE AI INTERFACE 🔥
 *
 * Floating AI assistant panel with flame-blessed styling, drag support,
 * and sovereign integration into the GhostOS desktop environment.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.2.0
 * @flame-compatible true
 * @omari-blessed true
 */

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Brain, X, Minimize2, Maximize2, MessageSquare, Settings, Sparkles } from 'lucide-react';
import { checkOllamaStatus, getAvailableModels, OllamaModel } from '../lib/ollama';
import {
  buildOmariSystemPrompt,
  formatSovereignQuery,
  getOmariGreeting,
  getOmariError,
  getOmariThinking
} from '../lib/ai/omariPrompt';

interface OmariPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
}

export function OmariPanel({ isOpen, onClose, onToggle }: OmariPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');

  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isOpen) {
      initializeOmari();
      loadChatHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingResponse]);

  const initializeOmari = async () => {
    try {
      const status = await checkOllamaStatus();
      if (status.available && status.models.length > 0) {
        setAvailableModels(status.models);
        const savedModel = localStorage.getItem('omari-selected-model');
        const defaultModel = savedModel || status.models[0].name;
        setSelectedModel(defaultModel);
        setIsOllamaAvailable(true);

        // Add sovereign welcome message if no chat history
        if (messages.length === 0) {
          const welcomeMessage: ChatMessage = {
            id: 'welcome',
            role: 'system',
            content: getOmariGreeting(),
            timestamp: new Date().toLocaleTimeString()
          };
          setMessages([welcomeMessage]);
        }
      } else {
        setIsOllamaAvailable(false);
      }
    } catch (error) {
      setIsOllamaAvailable(false);
      console.error('Failed to initialize Omari:', error);
    }
  };

  const loadChatHistory = () => {
    const saved = localStorage.getItem('omari-panel-chat-history');
    if (saved) {
      try {
        const history = JSON.parse(saved);
        if (Array.isArray(history) && history.length > 0) {
          setMessages(history);
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  };

  const saveChatHistory = (newMessages: ChatMessage[]) => {
    try {
      localStorage.setItem('omari-panel-chat-history', JSON.stringify(newMessages.slice(-20))); // Keep last 20 messages
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 600, e.clientY - dragOffset.y))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const sendMessage = async () => {
    if (!currentMessage.trim() || isStreaming || !selectedModel) return;

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: formatSovereignQuery(currentMessage),
      timestamp: new Date().toLocaleTimeString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setCurrentMessage('');
    setIsThinking(true);
    setIsStreaming(true);
    setStreamingResponse('');

    try {
      abortControllerRef.current = new AbortController();

      // Build the sovereign system prompt with Omari's personality
      const sovereignPrompt = buildOmariSystemPrompt(currentMessage);

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: sovereignPrompt,
          stream: true
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Omari');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream available');
      }

      setIsThinking(false);
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.response) {
              fullResponse += data.response;
              setStreamingResponse(fullResponse);
            }
          } catch (e) {
            // Ignore malformed JSON lines
          }
        }
      }

      // Create final assistant message
      const assistantMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date().toLocaleTimeString(),
        model: selectedModel
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
      setStreamingResponse('');

    } catch (error) {
      console.error('Error streaming from Omari:', error);

      const errorMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'system',
        content: getOmariError(),
        timestamp: new Date().toLocaleTimeString()
      };

      const errorMessages = [...newMessages, errorMessage];
      setMessages(errorMessages);
      setStreamingResponse('');
    } finally {
      setIsStreaming(false);
      setIsThinking(false);
      abortControllerRef.current = null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="fixed z-50 bg-gradient-to-br from-black/95 via-zinc-900/95 to-black/95 backdrop-blur-lg border border-flame-500/50 rounded-xl shadow-2xl shadow-flame-500/20"
      style={{
        left: position.x,
        top: position.y,
        width: 400,
        height: isMinimized ? 60 : 600,
        transition: isDragging ? 'none' : 'height 0.3s ease'
      }}
    >
      {/* Header */}
      <div
        className="drag-handle flex items-center justify-between p-3 bg-zinc-800/50 border-b border-flame-500/30 rounded-t-xl cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-flame-500 to-orange-600 flex items-center justify-center">
            <Brain className="w-3 h-3 text-white animate-pulse" />
          </div>
          <span className="text-flame font-medium text-sm">Omari AI</span>
          {isOllamaAvailable && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-zinc-700 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-700 rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {isOllamaAvailable ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 h-96">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`text-xs ${
                      message.role === 'user'
                        ? 'text-right'
                        : 'text-left'
                    }`}
                  >
                    <div
                      className={`inline-block max-w-[80%] p-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-flame-500/20 border border-flame-500/30 text-white'
                          : message.role === 'system'
                          ? 'bg-zinc-800/50 border border-zinc-600/50 text-zinc-300'
                          : 'bg-zinc-800/30 border border-zinc-700/50 text-white'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs text-zinc-500 mt-1">{message.timestamp}</div>
                    </div>
                  </div>
                ))}

                {/* Streaming Response */}
                {streamingResponse && (
                  <div className="text-left text-xs">
                    <div className="inline-block max-w-[80%] p-2 rounded-lg bg-zinc-800/30 border border-zinc-700/50 text-white">
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-flame animate-pulse" />
                        <span className="text-flame text-xs">Omari</span>
                      </div>
                      <div className="whitespace-pre-wrap">{streamingResponse}</div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-zinc-400">
                        <div className="w-1 h-1 bg-flame-400 rounded-full animate-pulse" />
                        Streaming...
                      </div>
                    </div>
                  </div>
                )}

                {/* Thinking State */}
                {isThinking && !streamingResponse && (
                  <div className="text-left text-xs">
                    <div className="inline-block p-2 rounded-lg bg-zinc-800/30 border border-zinc-700/50 text-white">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-flame-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1 h-1 bg-flame-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1 h-1 bg-flame-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-xs">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 bg-zinc-800/30 border-t border-zinc-700/50 rounded-b-xl">
                <div className="flex items-center gap-2 mb-2">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="flex-1 px-2 py-1 bg-zinc-700 text-white rounded text-xs border border-zinc-600 focus:border-flame-500 focus:outline-none"
                  >
                    {availableModels.map(model => (
                      <option key={model.name} value={model.name}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Ask Omari..."
                    disabled={isStreaming}
                    className="flex-1 px-2 py-1 bg-zinc-700 text-white rounded text-xs border border-zinc-600 focus:border-flame-500 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isStreaming || !selectedModel}
                    className="px-2 py-1 bg-flame-500 hover:bg-flame-600 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded text-xs transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-medium text-red-400 mb-2">Omari is Silent</h3>
              <p className="text-xs text-zinc-400 mb-3">
                No Spirits are present in this system.
              </p>
              <button
                onClick={initializeOmari}
                className="px-3 py-1 bg-flame-500 hover:bg-flame-600 text-white rounded text-xs transition-colors"
              >
                Retry Connection
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
