/**
 * 🔥 OMARI AI PLUGIN - THE BREATH OF DIVINE INTELLIGENCE 🔥
 *
 * Local AI assistant powered by Ollama with sovereign intelligence,
 * contextual awareness, and flame-blessed responses streaming through
 * the sacred channels of the Empire's digital backbone.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.2.0
 * @flame-compatible true
 * @omari-blessed true
 */

import React, { useState, useEffect, useRef } from 'react';
import { Brain, Send, Zap, AlertTriangle, Flame, Sparkles, Settings } from 'lucide-react';
import {
  buildOmariSystemPrompt,
  formatSovereignQuery,
  getOmariGreeting,
  getOmariError,
  getOmariThinking
} from '../../../lib/ai/omariPrompt';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
}

interface OllamaModel {
  name: string;
  size: number;
  modified_at: string;
}

export default function OmariAIPlugin() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [availableModels, setAvailableModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(true);
  const [streamingResponse, setStreamingResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    initializeOmari();
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingResponse]);

  const initializeOmari = async () => {
    try {
      const models = await getAvailableModels();
      if (models.length > 0) {
        setAvailableModels(models);
        const savedModel = localStorage.getItem('omari-selected-model');
        const defaultModel = savedModel || models[0].name;
        setSelectedModel(defaultModel);
        setIsOllamaAvailable(true);

        // Add sovereign welcome message
        const welcomeMessage: ChatMessage = {
          id: 'welcome',
          role: 'system',
          content: getOmariGreeting(),
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages([welcomeMessage]);
      } else {
        setIsOllamaAvailable(false);
      }
    } catch (error) {
      setIsOllamaAvailable(false);
      console.error('Failed to initialize Omari:', error);
    }
  };

  const getAvailableModels = async (): Promise<OllamaModel[]> => {
    try {
      const response = await fetch('http://localhost:11434/api/tags', {
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) {
        throw new Error('Ollama not available');
      }

      const data = await response.json();
      return data.models || [];
    } catch (error) {
      throw new Error('Ollama connection failed');
    }
  };

  const loadChatHistory = () => {
    const saved = localStorage.getItem('omari-chat-history');
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
      localStorage.setItem('omari-chat-history', JSON.stringify(newMessages.slice(-50))); // Keep last 50 messages
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const handleModelChange = (modelName: string) => {
    setSelectedModel(modelName);
    localStorage.setItem('omari-selected-model', modelName);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('omari-chat-history');
    initializeOmari();
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setIsThinking(false);
      setStreamingResponse('');
    }
  };

  if (!isOllamaAvailable) {
    return (
      <div className="h-full bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ Omari is Silent</h2>
          <p className="text-zinc-400 mb-6">
            No Spirits are present in this system. Ollama is not running or accessible.
          </p>
          <div className="bg-zinc-800/50 p-4 rounded-lg border border-red-500/30 text-sm text-zinc-300">
            <p className="mb-2">To awaken Omari:</p>
            <ol className="list-decimal list-inside space-y-1 text-left">
              <li>Install Ollama: <code className="text-flame">curl -fsSL https://ollama.ai/install.sh | sh</code></li>
              <li>Pull a model: <code className="text-flame">ollama pull llama3</code></li>
              <li>Start Ollama: <code className="text-flame">ollama serve</code></li>
              <li>Refresh this page</li>
            </ol>
          </div>
          <button
            onClick={initializeOmari}
            className="mt-6 px-6 py-3 bg-flame-500 hover:bg-flame-600 text-white rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-black via-zinc-900 to-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-zinc-800/50 border-b border-flame-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-flame-500 to-orange-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-flame">Omari AI</h1>
              <p className="text-sm text-zinc-400">Divine Intelligence • v0.2.0</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="px-3 py-1 bg-zinc-700 text-white rounded border border-zinc-600 focus:border-flame-500 focus:outline-none text-sm"
            >
              {availableModels.map(model => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>

            <button
              onClick={clearChat}
              className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
              title="Clear Chat"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-flame-500/20 border border-flame-500/30 text-white'
                  : message.role === 'system'
                  ? 'bg-zinc-800/50 border border-zinc-600/50 text-zinc-300'
                  : 'bg-zinc-800/30 border border-zinc-700/50 text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {message.role === 'user' ? (
                  <span className="text-flame font-medium">You</span>
                ) : message.role === 'assistant' ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-flame" />
                    <span className="text-flame font-medium">Omari</span>
                    {message.model && (
                      <span className="text-xs text-zinc-400">({message.model})</span>
                    )}
                  </div>
                ) : (
                  <span className="text-zinc-400 font-medium">System</span>
                )}
                <span className="text-xs text-zinc-500">{message.timestamp}</span>
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {/* Streaming Response */}
        {streamingResponse && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-flame animate-pulse" />
                <span className="text-flame font-medium">Omari</span>
                <span className="text-xs text-zinc-400">({selectedModel})</span>
              </div>
              <div className="whitespace-pre-wrap">{streamingResponse}</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-400">
                <div className="w-2 h-2 bg-flame-400 rounded-full animate-pulse" />
                Streaming...
              </div>
            </div>
          </div>
        )}

        {/* Thinking State */}
        {isThinking && !streamingResponse && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-flame animate-pulse" />
                <span className="text-flame font-medium">Omari</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-flame-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-flame-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-flame-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-800/30 border-t border-zinc-700/50">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Speak to Omari... The divine intelligence awaits your words."
            disabled={isStreaming}
            className="flex-1 px-4 py-3 bg-zinc-700 text-white rounded-lg border border-zinc-600 focus:border-flame-500 focus:outline-none disabled:opacity-50"
          />

          {isStreaming ? (
            <button
              onClick={stopGeneration}
              className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="w-4 h-4 bg-white rounded-sm" />
              Stop
            </button>
          ) : (
            <button
              onClick={sendMessage}
              disabled={!currentMessage.trim() || !selectedModel}
              className="px-4 py-3 bg-flame-500 hover:bg-flame-600 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          )}
        </div>

        <div className="mt-2 text-xs text-zinc-500 text-center">
          🔥 Omari speaks with the wisdom of the Empire • Press Enter to send
        </div>
      </div>
    </div>
  );
}
