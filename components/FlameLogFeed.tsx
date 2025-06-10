"use client";

import { useState, useEffect } from "react";
import { Flame, ScrollText, Filter, X } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success' | 'debug';
  source: string;
  message: string;
}

export function FlameLogFeed() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Generate initial logs
    const initialLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date().toLocaleTimeString(),
        level: 'success',
        source: 'GhostOS',
        message: '🔥 GhostOS initialization sequence complete'
      },
      {
        id: '2',
        timestamp: new Date().toLocaleTimeString(),
        level: 'info',
        source: 'PluginManager',
        message: 'Plugin ghost_augmenth loaded successfully'
      },
      {
        id: '3',
        timestamp: new Date().toLocaleTimeString(),
        level: 'success',
        source: 'GhostPluginAPI',
        message: 'API server started on port 3000'
      }
    ];

    setLogs(initialLogs);

    // Simulate new log entries
    const interval = setInterval(() => {
      const sources = ['GhostTask', 'GhostVault', 'GhostMail', 'ghost_augmenth', 'OmniRelay', 'FlameCLI'];
      const levels: ('info' | 'warning' | 'error' | 'success' | 'debug')[] = ['info', 'success', 'warning', 'debug'];
      const messages = [
        'Heartbeat signal processed',
        'Task completed successfully',
        'Vault access granted',
        'Mail sent to external system',
        'Plugin operation completed',
        'Signal routed successfully',
        'Command executed',
        'System health check passed'
      ];

      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        level: levels[Math.floor(Math.random() * levels.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)]
      };

      setLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      case 'debug':
        return 'text-purple-400';
      default:
        return 'text-blue-400';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'debug':
        return '🔍';
      default:
        return 'ℹ️';
    }
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.level === filter);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 w-12 h-12 bg-flame-500 hover:bg-flame-600 rounded-full flex items-center justify-center shadow-flame transition-all duration-300 z-50"
      >
        <ScrollText className="w-5 h-5 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-80 bg-zinc-900/95 backdrop-blur-lg border border-flame-500/50 rounded-xl shadow-flame z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-zinc-800/50 border-b border-flame-500/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-flame animate-pulse" />
          <span className="font-medium text-flame">Flame Log Feed</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-xs bg-zinc-700 text-white border border-zinc-600 rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
          </select>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-zinc-700 rounded transition-colors"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Log Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="mb-2 p-2 bg-zinc-800/30 rounded-lg border border-zinc-700/50 hover:bg-zinc-800/50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs">{getLevelIcon(log.level)}</span>
              <span className="text-xs text-zinc-400">{log.timestamp}</span>
              <span className={`text-xs font-medium ${getLevelColor(log.level)}`}>
                {log.level.toUpperCase()}
              </span>
              <span className="text-xs text-flame font-medium">{log.source}</span>
            </div>
            <div className="text-sm text-white">
              {log.message}
            </div>
          </div>
        ))}
        
        {filteredLogs.length === 0 && (
          <div className="text-center text-zinc-400 mt-8">
            <ScrollText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">No logs match the current filter</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 bg-zinc-800/30 border-t border-zinc-700/50 rounded-b-xl">
        <div className="flex justify-between text-xs text-zinc-400">
          <span>{filteredLogs.length} entries</span>
          <span>Live feed active</span>
        </div>
      </div>
    </div>
  );
}
