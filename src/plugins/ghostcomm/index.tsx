/**
 * 🔥 GHOSTCOMM PLUGIN - SOVEREIGN COMMUNICATION HUB 🔥
 * 
 * Advanced inter-system communication protocol with real-time messaging,
 * signal routing, and sovereign network capabilities.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import React, { useState, useEffect } from 'react';
import { Radio, Send, Users, Signal, Wifi, MessageSquare, Zap } from 'lucide-react';

interface CommMessage {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  message: string;
  type: 'broadcast' | 'direct' | 'system';
  status: 'sent' | 'delivered' | 'read';
}

interface CommChannel {
  id: string;
  name: string;
  type: 'public' | 'private' | 'system';
  members: number;
  active: boolean;
}

export default function GhostCommPlugin() {
  const [messages, setMessages] = useState<CommMessage[]>([]);
  const [channels, setChannels] = useState<CommChannel[]>([
    { id: 'general', name: 'General', type: 'public', members: 7, active: true },
    { id: 'system', name: 'System Alerts', type: 'system', members: 1, active: true },
    { id: 'secure', name: 'Secure Channel', type: 'private', members: 3, active: false }
  ]);
  const [activeChannel, setActiveChannel] = useState('general');
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Simulate initial messages
    const initialMessages: CommMessage[] = [
      {
        id: '1',
        timestamp: new Date().toLocaleTimeString(),
        from: 'GhostOS',
        to: 'broadcast',
        message: '🔥 GhostComm system initialized - All channels operational',
        type: 'system',
        status: 'delivered'
      },
      {
        id: '2',
        timestamp: new Date().toLocaleTimeString(),
        from: 'GhostTask',
        to: 'general',
        message: 'Task automation system online and ready',
        type: 'broadcast',
        status: 'read'
      },
      {
        id: '3',
        timestamp: new Date().toLocaleTimeString(),
        from: 'GhostVault',
        to: 'secure',
        message: 'Vault security protocols activated',
        type: 'direct',
        status: 'delivered'
      }
    ];
    setMessages(initialMessages);

    // Simulate periodic system messages
    const interval = setInterval(() => {
      const systemMessages = [
        'Heartbeat signal received from all nodes',
        'Network latency: 12ms - Optimal',
        'Signal strength: 98% - Excellent',
        'Encryption keys rotated successfully'
      ];
      
      const newMsg: CommMessage = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        from: 'System',
        to: activeChannel,
        message: systemMessages[Math.floor(Math.random() * systemMessages.length)],
        type: 'system',
        status: 'delivered'
      };
      
      setMessages(prev => [...prev, newMsg].slice(-20)); // Keep last 20 messages
    }, 10000);

    return () => clearInterval(interval);
  }, [activeChannel]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: CommMessage = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      from: 'You',
      to: activeChannel,
      message: newMessage,
      type: 'direct',
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate delivery confirmation
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);
  };

  const getChannelMessages = () => {
    return messages.filter(msg => 
      msg.to === activeChannel || msg.to === 'broadcast' || msg.type === 'system'
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return '📤';
      case 'delivered': return '✅';
      case 'read': return '👁️';
      default: return '📨';
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'system': return 'text-flame';
      case 'broadcast': return 'text-blue-400';
      case 'direct': return 'text-green-400';
      default: return 'text-white';
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-zinc-800/50 border-b border-cyan-500/30">
        <div className="flex items-center gap-3">
          <Radio className="w-6 h-6 text-cyan-400" />
          <h1 className="text-xl font-bold text-cyan-400">GhostComm</h1>
          <span className="text-sm text-zinc-400">v0.1.0</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <Wifi className="w-4 h-4 text-red-400" />
            )}
            <span className="text-sm text-zinc-300">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400">98%</span>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Channels Sidebar */}
        <div className="w-64 bg-zinc-800/30 border-r border-zinc-700/50 p-4">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Channels
          </h3>
          <div className="space-y-2">
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200
                  ${activeChannel === channel.id 
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300' 
                    : 'bg-zinc-700/30 hover:bg-zinc-700/50 text-zinc-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${channel.active ? 'bg-green-400' : 'bg-zinc-500'}`} />
                    <span className="font-medium">#{channel.name}</span>
                  </div>
                  <span className="text-xs text-zinc-400">{channel.members}</span>
                </div>
                <div className="text-xs text-zinc-500 mt-1 capitalize">{channel.type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {getChannelMessages().map(message => (
              <div key={message.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {message.from[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-cyan-300">{message.from}</span>
                    <span className="text-xs text-zinc-500">{message.timestamp}</span>
                    <span className="text-xs">{getStatusIcon(message.status)}</span>
                  </div>
                  <div className={`${getMessageColor(message.type)}`}>
                    {message.message}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 bg-zinc-800/30 border-t border-zinc-700/50">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Message #${channels.find(c => c.id === activeChannel)?.name}...`}
                className="flex-1 px-4 py-2 bg-zinc-700 text-white rounded-lg border border-zinc-600 focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
