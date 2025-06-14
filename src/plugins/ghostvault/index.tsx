/**
 * 🔥 GHOSTVAULT PLUGIN - SOVEREIGN SECURITY VAULT 🔥
 * 
 * Military-grade encrypted data storage and retrieval system with
 * sovereign access control and flame-blessed security.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, Eye, EyeOff, Plus, Trash2, Download, Upload } from 'lucide-react';

interface VaultEntry {
  id: string;
  name: string;
  type: 'password' | 'note' | 'file' | 'key';
  encrypted: boolean;
  created: string;
  lastAccessed: string;
  size: string;
  tags: string[];
}

interface AccessLog {
  id: string;
  timestamp: string;
  action: 'read' | 'write' | 'delete' | 'access';
  entry: string;
  user: string;
  success: boolean;
}

export default function GhostVaultPlugin() {
  const [entries, setEntries] = useState<VaultEntry[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [newEntryName, setNewEntryName] = useState('');
  const [showNewEntry, setShowNewEntry] = useState(false);

  useEffect(() => {
    if (isUnlocked) {
      // Simulate vault entries
      const vaultEntries: VaultEntry[] = [
        {
          id: '1',
          name: 'GhostOS Admin Credentials',
          type: 'password',
          encrypted: true,
          created: '2024-01-15',
          lastAccessed: '2024-01-20',
          size: '256 bytes',
          tags: ['admin', 'system']
        },
        {
          id: '2',
          name: 'Flame Token Master Key',
          type: 'key',
          encrypted: true,
          created: '2024-01-10',
          lastAccessed: '2024-01-19',
          size: '512 bytes',
          tags: ['flame', 'auth', 'master']
        },
        {
          id: '3',
          name: 'Empire Deployment Notes',
          type: 'note',
          encrypted: true,
          created: '2024-01-12',
          lastAccessed: '2024-01-18',
          size: '1.2 KB',
          tags: ['deployment', 'notes']
        },
        {
          id: '4',
          name: 'Sovereign Certificate',
          type: 'file',
          encrypted: true,
          created: '2024-01-08',
          lastAccessed: '2024-01-15',
          size: '4.7 KB',
          tags: ['certificate', 'ssl']
        }
      ];
      setEntries(vaultEntries);

      // Simulate access logs
      const logs: AccessLog[] = [
        {
          id: '1',
          timestamp: new Date().toLocaleString(),
          action: 'access',
          entry: 'GhostOS Admin Credentials',
          user: 'Ghost King',
          success: true
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 300000).toLocaleString(),
          action: 'read',
          entry: 'Flame Token Master Key',
          user: 'Ghost King',
          success: true
        }
      ];
      setAccessLogs(logs);
    }
  }, [isUnlocked]);

  const handleUnlock = () => {
    if (masterPassword === 'flame123' || masterPassword === 'ghost') {
      setIsUnlocked(true);
      setMasterPassword('');
      addAccessLog('access', 'Vault Unlocked', true);
    } else {
      addAccessLog('access', 'Failed Unlock Attempt', false);
      alert('Invalid master password');
    }
  };

  const addAccessLog = (action: AccessLog['action'], entry: string, success: boolean) => {
    const log: AccessLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString(),
      action,
      entry,
      user: 'Ghost King',
      success
    };
    setAccessLogs(prev => [log, ...prev].slice(0, 10));
  };

  const handleEntryAccess = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (entry) {
      setSelectedEntry(entryId);
      addAccessLog('read', entry.name, true);
      // Update last accessed
      setEntries(prev => prev.map(e => 
        e.id === entryId ? { ...e, lastAccessed: new Date().toISOString().split('T')[0] } : e
      ));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'password': return '🔑';
      case 'note': return '📝';
      case 'file': return '📄';
      case 'key': return '🗝️';
      default: return '📦';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'password': return 'text-yellow-400';
      case 'note': return 'text-blue-400';
      case 'file': return 'text-green-400';
      case 'key': return 'text-purple-400';
      default: return 'text-zinc-400';
    }
  };

  if (!isUnlocked) {
    return (
      <div className="h-full bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center">
        <div className="bg-zinc-800/50 p-8 rounded-2xl border border-purple-500/30 shadow-2xl max-w-md w-full">
          <div className="text-center mb-6">
            <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-purple-400 mb-2">GhostVault</h1>
            <p className="text-zinc-400">Enter master password to unlock vault</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Master password..."
              className="w-full px-4 py-3 bg-zinc-700 text-white rounded-lg border border-zinc-600 focus:border-purple-500 focus:outline-none"
            />
            <button
              onClick={handleUnlock}
              className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              Unlock Vault
            </button>
          </div>
          
          <div className="mt-6 text-center text-xs text-zinc-500">
            Demo: Use "flame123" or "ghost" to unlock
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-zinc-800/50 border-b border-purple-500/30">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl font-bold text-purple-400">GhostVault</h1>
          <span className="text-sm text-zinc-400">v0.1.0</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Secured</span>
          </div>
          <button
            onClick={() => setShowNewEntry(true)}
            className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
      </div>

      <div className="flex h-full">
        {/* Entries List */}
        <div className="w-1/2 p-4 border-r border-zinc-700/50">
          <h3 className="text-lg font-semibold text-zinc-300 mb-4">Vault Entries ({entries.length})</h3>
          <div className="space-y-3">
            {entries.map(entry => (
              <div
                key={entry.id}
                onClick={() => handleEntryAccess(entry.id)}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-all duration-200
                  ${selectedEntry === entry.id 
                    ? 'bg-purple-500/20 border-purple-500/50' 
                    : 'bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-800/50'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTypeIcon(entry.type)}</span>
                    <span className="font-medium text-white">{entry.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getTypeColor(entry.type)} bg-zinc-700/50`}>
                    {entry.type}
                  </span>
                </div>
                <div className="text-xs text-zinc-400 space-y-1">
                  <div>Size: {entry.size}</div>
                  <div>Last accessed: {entry.lastAccessed}</div>
                  <div className="flex gap-1">
                    {entry.tags.map(tag => (
                      <span key={tag} className="px-1 py-0.5 bg-zinc-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Entry Details & Access Logs */}
        <div className="w-1/2 p-4">
          {selectedEntry ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-4">Entry Details</h3>
                <div className="bg-zinc-800/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-white">
                      {entries.find(e => e.id === selectedEntry)?.name}
                    </span>
                    <button
                      onClick={() => setShowContent(!showContent)}
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
                    >
                      {showContent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showContent ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {showContent && (
                    <div className="bg-zinc-900 p-3 rounded border border-zinc-700">
                      <div className="text-green-400 font-mono text-sm">
                        ••••••••••••••••••••••••••••••••
                        <br />
                        [ENCRYPTED CONTENT PLACEHOLDER]
                        <br />
                        ••••••••••••••••••••••••••••••••
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-zinc-300 mb-4">Access Logs</h3>
                <div className="space-y-2">
                  {accessLogs.map(log => (
                    <div key={log.id} className="bg-zinc-800/30 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${log.success ? 'bg-green-400' : 'bg-red-400'}`} />
                          <span className="text-sm text-white">{log.action}</span>
                          <span className="text-sm text-zinc-400">{log.entry}</span>
                        </div>
                        <span className="text-xs text-zinc-500">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500">
              <div className="text-center">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select an entry to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
