"use client";

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ScribeChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to your AI writing assistant. How can I help you craft your scroll today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Phase III - Real AI Integration
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-5), // Send last 5 messages for context
          context: 'writing-assistant'
        }),
      });

      const result = await response.json();

      if (result.success) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.message,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiResponse]);

        // Update analytics
        updateAnalytics('chatMessage');
      } else {
        // Fallback to local response
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: generateAIResponse(userMessage.content),
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnalytics = (action: string) => {
    try {
      const stored = localStorage.getItem('writeos-analytics');
      if (stored) {
        const analytics = JSON.parse(stored);
        if (action === 'chatMessage') {
          analytics.aiUsageStats.chatMessages += 1;
        }
        localStorage.setItem('writeos-analytics', JSON.stringify(analytics));
      }
    } catch (error) {
      console.error('Error updating analytics:', error);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    // Enhanced AI response logic
    const responses = {
      writing: [
        "I can help you structure your thoughts. What type of document are you working on?",
        "Let's break this down into clear sections. What's your main objective?",
        "Consider starting with an outline. What are the key points you want to cover?"
      ],
      editing: [
        "I can help refine your prose. Share a paragraph and I'll suggest improvements.",
        "Let's focus on clarity and flow. What section needs the most work?",
        "Consider your audience - who are you writing for?"
      ],
      ideas: [
        "Let's brainstorm! What's the core concept you want to explore?",
        "I can help generate creative angles. What's your starting point?",
        "What if we approached this from a different perspective?"
      ],
      default: [
        "I'm here to help with your writing. What would you like to work on?",
        "Let's craft something amazing together. What's on your mind?",
        "I can assist with writing, editing, brainstorming, or structuring. How can I help?"
      ]
    };

    const input = userInput.toLowerCase();
    if (input.includes('write') || input.includes('draft')) {
      return responses.writing[Math.floor(Math.random() * responses.writing.length)];
    } else if (input.includes('edit') || input.includes('improve') || input.includes('fix')) {
      return responses.editing[Math.floor(Math.random() * responses.editing.length)];
    } else if (input.includes('idea') || input.includes('brainstorm') || input.includes('think')) {
      return responses.ideas[Math.floor(Math.random() * responses.ideas.length)];
    } else {
      return responses.default[Math.floor(Math.random() * responses.default.length)];
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-flame text-lg font-bold mb-4">🤖 Scribe Assistant</div>
      <div className="flex-1 bg-scrollbg border border-shadowline rounded-lg p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-flame text-white'
                    : 'bg-zinc-700 text-zinc-100'
                }`}
              >
                <div>{message.content}</div>
                <div className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-700 text-zinc-100 p-3 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-ghostblue rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-ghostblue rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-ghostblue rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-ghostblue"
            placeholder="Ask your scribe assistant..."
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-flame hover:bg-flame/80 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
