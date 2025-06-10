"use client";

import { useState } from "react";
import { Puzzle, Power, Settings, Download, AlertTriangle, CheckCircle } from "lucide-react";

interface Plugin {
  name: string;
  version: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  autoStart: boolean;
  author: string;
}

interface PluginManagerProps {
  onLaunch: (app: string) => void;
}

export function PluginManager({ onLaunch }: PluginManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      name: 'ghost_augmenth',
      version: '0.1.0',
      description: 'Augment AI integration plugin with deployment and reflection capabilities',
      status: 'active',
      autoStart: true,
      author: 'Ghost King Melekzedek'
    },
    {
      name: 'whisper-sync',
      version: '0.2.1', 
      description: 'Real-time communication synchronization plugin',
      status: 'inactive',
      autoStart: false,
      author: 'Empire Dev Team'
    },
    {
      name: 'flame-guard',
      version: '1.0.0',
      description: 'Advanced security and access control plugin',
      status: 'error',
      autoStart: true,
      author: 'Security Division'
    }
  ]);

  const togglePlugin = (pluginName: string) => {
    setPlugins(prev => prev.map(plugin => {
      if (plugin.name === pluginName) {
        const newStatus = plugin.status === 'active' ? 'inactive' : 'active';
        return { ...plugin, status: newStatus };
      }
      return plugin;
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'inactive':
        return <Power className="w-4 h-4 text-zinc-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Power className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'inactive':
        return 'text-zinc-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-zinc-400';
    }
  };

  const activeCount = plugins.filter(p => p.status === 'active').length;
  const errorCount = plugins.filter(p => p.status === 'error').length;

  return (
    <div className="absolute left-4 top-20 w-80 z-40">
      <div className="bg-zinc-900/90 backdrop-blur-lg border border-flame-500/50 rounded-xl shadow-flame overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 bg-zinc-800/50 border-b border-flame-500/30 cursor-pointer hover:bg-zinc-800/70 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Puzzle className="w-4 h-4 text-flame" />
            <span className="font-medium text-flame">Plugin Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-xs text-green-400">{activeCount}</span>
            </div>
            {errorCount > 0 && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span className="text-xs text-red-400">{errorCount}</span>
              </div>
            )}
            <Settings className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Plugin List */}
        <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-40'} overflow-hidden`}>
          <div className="max-h-full overflow-y-auto">
            {plugins.map((plugin) => (
              <div
                key={plugin.name}
                className="p-3 border-b border-zinc-700/50 last:border-b-0 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(plugin.status)}
                      <span className="font-medium text-white truncate">{plugin.name}</span>
                      <span className="text-xs text-zinc-400">v{plugin.version}</span>
                    </div>
                    
                    <div className="text-xs text-zinc-400 mb-2 line-clamp-2">
                      {plugin.description}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">by {plugin.author}</span>
                      <span className={`text-xs font-medium ${getStatusColor(plugin.status)}`}>
                        {plugin.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => togglePlugin(plugin.name)}
                      className={`
                        w-12 h-6 rounded-full border-2 transition-all duration-300 relative
                        ${plugin.status === 'active' 
                          ? 'bg-flame-500 border-flame-400' 
                          : 'bg-zinc-700 border-zinc-600'
                        }
                      `}
                    >
                      <div className={`
                        w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform duration-300
                        ${plugin.status === 'active' ? 'translate-x-6' : 'translate-x-0.5'}
                      `} />
                    </button>
                    
                    {isExpanded && (
                      <button
                        onClick={() => onLaunch(plugin.name)}
                        className="p-1 text-zinc-400 hover:text-flame transition-colors"
                        title="Configure Plugin"
                      >
                        <Settings className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        {isExpanded && (
          <div className="p-3 bg-zinc-800/30 border-t border-zinc-700/50">
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-flame-500/20 hover:bg-flame-500/30 border border-flame-500/50 rounded-lg transition-colors text-sm">
                <Download className="w-4 h-4" />
                Install Plugin
              </button>
              <button className="px-3 py-2 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
