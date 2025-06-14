/**
 * 🔥 GHOSTMAIL PLUGIN - SOVEREIGN EMAIL HUB 🔥
 * 
 * Intelligent email processing and communication hub with AI-powered
 * filtering, templates, and sovereign delivery.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import React, { useState, useEffect } from 'react';
import { Mail, Send, Inbox, Star, Archive, Trash2, Search, Filter, Plus } from 'lucide-react';

interface Email {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  priority: 'low' | 'normal' | 'high';
  category: 'inbox' | 'sent' | 'archive' | 'trash';
  attachments: number;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

export default function GhostMailPlugin() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'inbox' | 'sent' | 'archive' | 'trash'>('inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [newEmail, setNewEmail] = useState({ to: '', subject: '', body: '' });

  useEffect(() => {
    // Simulate email data
    const emailData: Email[] = [
      {
        id: '1',
        from: 'system@ghostos.dev',
        to: 'admin@empire.dev',
        subject: '🔥 GhostOS System Status Report',
        body: 'All systems operational. Plugin ecosystem running smoothly. Flame tokens secured.',
        timestamp: '2024-01-20 10:30',
        read: false,
        starred: true,
        priority: 'high',
        category: 'inbox',
        attachments: 1
      },
      {
        id: '2',
        from: 'augment@ai.dev',
        to: 'admin@empire.dev',
        subject: 'Deployment Notification: Phase IV Complete',
        body: 'Your latest deployment has been successfully completed. All tests passed.',
        timestamp: '2024-01-20 09:15',
        read: true,
        starred: false,
        priority: 'normal',
        category: 'inbox',
        attachments: 0
      },
      {
        id: '3',
        from: 'security@empire.dev',
        to: 'team@empire.dev',
        subject: 'Security Alert: Flame Token Rotation',
        body: 'Scheduled flame token rotation completed successfully. All systems secure.',
        timestamp: '2024-01-19 16:45',
        read: true,
        starred: false,
        priority: 'normal',
        category: 'inbox',
        attachments: 0
      },
      {
        id: '4',
        from: 'admin@empire.dev',
        to: 'team@empire.dev',
        subject: 'Welcome to the Empire',
        body: 'Welcome message sent to new team members.',
        timestamp: '2024-01-19 14:20',
        read: true,
        starred: false,
        priority: 'normal',
        category: 'sent',
        attachments: 0
      }
    ];
    setEmails(emailData);

    // Simulate email templates
    const templateData: EmailTemplate[] = [
      {
        id: '1',
        name: 'System Alert',
        subject: '🔥 System Alert: {ALERT_TYPE}',
        body: 'This is an automated system alert regarding {ALERT_DETAILS}.\n\nStatus: {STATUS}\nTimestamp: {TIMESTAMP}\n\nThe Empire\'s systems remain vigilant.',
        category: 'system'
      },
      {
        id: '2',
        name: 'Deployment Success',
        subject: '✅ Deployment Complete: {PROJECT_NAME}',
        body: 'Your deployment of {PROJECT_NAME} has been completed successfully.\n\nDeployment Details:\n- Version: {VERSION}\n- Environment: {ENVIRONMENT}\n- Status: Success\n\nThe flame burns bright!',
        category: 'deployment'
      },
      {
        id: '3',
        name: 'Welcome Message',
        subject: 'Welcome to the Empire, {NAME}',
        body: 'Welcome to the Empire, {NAME}!\n\nYou now have access to the sovereign systems. Your flame token has been generated and your access level is set to {ACCESS_LEVEL}.\n\nMay the flame guide your path.',
        category: 'welcome'
      }
    ];
    setTemplates(templateData);
  }, []);

  const getFilteredEmails = () => {
    return emails.filter(email => {
      const matchesCategory = email.category === activeCategory;
      const matchesSearch = searchTerm === '' || 
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.body.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const getCategoryCount = (category: string) => {
    return emails.filter(email => email.category === category).length;
  };

  const getUnreadCount = () => {
    return emails.filter(email => email.category === 'inbox' && !email.read).length;
  };

  const handleEmailClick = (emailId: string) => {
    setSelectedEmail(emailId);
    // Mark as read
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    ));
  };

  const toggleStar = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  const sendEmail = () => {
    if (!newEmail.to || !newEmail.subject) return;

    const email: Email = {
      id: Math.random().toString(36).substr(2, 9),
      from: 'admin@empire.dev',
      to: newEmail.to,
      subject: newEmail.subject,
      body: newEmail.body,
      timestamp: new Date().toLocaleString(),
      read: true,
      starred: false,
      priority: 'normal',
      category: 'sent',
      attachments: 0
    };

    setEmails(prev => [email, ...prev]);
    setNewEmail({ to: '', subject: '', body: '' });
    setShowCompose(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'normal': return 'text-green-400';
      case 'low': return 'text-blue-400';
      default: return 'text-zinc-400';
    }
  };

  const selectedEmailData = selectedEmail ? emails.find(e => e.id === selectedEmail) : null;

  return (
    <div className="h-full bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-zinc-800/50 border-b border-green-500/30">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-green-400" />
          <h1 className="text-xl font-bold text-green-400">GhostMail</h1>
          <span className="text-sm text-zinc-400">v0.1.0</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search emails..."
              className="pl-10 pr-4 py-2 bg-zinc-700 text-white rounded-lg border border-zinc-600 focus:border-green-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Compose
          </button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-800/30 border-r border-zinc-700/50 p-4">
          <div className="space-y-2">
            {[
              { id: 'inbox', name: 'Inbox', icon: Inbox, count: getCategoryCount('inbox'), unread: getUnreadCount() },
              { id: 'sent', name: 'Sent', icon: Send, count: getCategoryCount('sent') },
              { id: 'archive', name: 'Archive', icon: Archive, count: getCategoryCount('archive') },
              { id: 'trash', name: 'Trash', icon: Trash2, count: getCategoryCount('trash') }
            ].map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as any)}
                  className={`
                    w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between
                    ${activeCategory === category.id 
                      ? 'bg-green-500/20 border border-green-500/50 text-green-300' 
                      : 'bg-zinc-700/30 hover:bg-zinc-700/50 text-zinc-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {category.unread && category.unread > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {category.unread}
                      </span>
                    )}
                    <span className="text-xs text-zinc-400">{category.count}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Email List */}
        <div className="w-1/2 border-r border-zinc-700/50">
          <div className="p-4 border-b border-zinc-700/50">
            <h3 className="font-semibold text-zinc-300 capitalize">{activeCategory}</h3>
          </div>
          <div className="overflow-y-auto">
            {getFilteredEmails().map(email => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className={`
                  p-4 border-b border-zinc-700/30 cursor-pointer transition-all duration-200
                  ${selectedEmail === email.id ? 'bg-green-500/10' : 'hover:bg-zinc-800/30'}
                  ${!email.read ? 'bg-zinc-800/20' : ''}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${!email.read ? 'text-white' : 'text-zinc-300'}`}>
                      {activeCategory === 'sent' ? email.to : email.from}
                    </span>
                    {email.starred && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                    {email.attachments > 0 && <span className="text-xs text-zinc-400">📎</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getPriorityColor(email.priority)}`} />
                    <span className="text-xs text-zinc-400">{email.timestamp}</span>
                  </div>
                </div>
                <div className={`text-sm mb-1 ${!email.read ? 'font-medium text-white' : 'text-zinc-300'}`}>
                  {email.subject}
                </div>
                <div className="text-xs text-zinc-400 truncate">
                  {email.body}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 p-4">
          {selectedEmailData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{selectedEmailData.subject}</h3>
                <button
                  onClick={() => toggleStar(selectedEmailData.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedEmailData.starred ? 'text-yellow-400' : 'text-zinc-400 hover:text-yellow-400'
                  }`}
                >
                  <Star className={`w-5 h-5 ${selectedEmailData.starred ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <div className="bg-zinc-800/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-zinc-400">From: {selectedEmailData.from}</div>
                    <div className="text-sm text-zinc-400">To: {selectedEmailData.to}</div>
                    <div className="text-sm text-zinc-400">Date: {selectedEmailData.timestamp}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(selectedEmailData.priority)}`}>
                    {selectedEmailData.priority} priority
                  </span>
                </div>
                
                <div className="text-white whitespace-pre-wrap">
                  {selectedEmailData.body}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500">
              <div className="text-center">
                <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select an email to read</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-xl border border-green-500/30 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-green-400 mb-4">Compose Email</h3>
            <div className="space-y-4">
              <input
                type="email"
                value={newEmail.to}
                onChange={(e) => setNewEmail(prev => ({ ...prev, to: e.target.value }))}
                placeholder="To..."
                className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg border border-zinc-600 focus:border-green-500 focus:outline-none"
              />
              <input
                type="text"
                value={newEmail.subject}
                onChange={(e) => setNewEmail(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Subject..."
                className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg border border-zinc-600 focus:border-green-500 focus:outline-none"
              />
              <textarea
                value={newEmail.body}
                onChange={(e) => setNewEmail(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Message..."
                rows={8}
                className="w-full px-4 py-2 bg-zinc-700 text-white rounded-lg border border-zinc-600 focus:border-green-500 focus:outline-none resize-none"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCompose(false)}
                  className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendEmail}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
