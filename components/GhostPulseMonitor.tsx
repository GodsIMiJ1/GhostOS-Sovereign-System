"use client";

import { useState, useEffect } from "react";
import { Activity, Zap, Radio, AlertCircle, CheckCircle, Wifi, WifiOff, RefreshCw } from "lucide-react";

interface Signal {
  id: string;
  timestamp: string;
  type: string;
  source: string;
  target: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

interface SystemStatus {
  plugins: {
    total: number;
    running: number;
    list: string[];
  };
  apps: {
    total: number;
    running: number;
    list: string[];
  };
  relay: {
    registered: number;
    signals: number;
  };
  api: {
    port: number;
    endpoints: string[];
  };
}

export function GhostPulseMonitor() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch live system status
  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/system/status');
      if (response.ok) {
        const data = await response.json();
        setSystemStatus(data.data || {
          plugins: { total: 1, running: 1, list: ['ghost_augmenth'] },
          apps: { total: 6, running: 6, list: ['GhostTask', 'GhostVault', 'GhostMail', 'GhostComm', 'GhostPulse', 'GhostGate'] },
          relay: { registered: 7, signals: 247 },
          api: { port: 3000, endpoints: ['/api/plugins', '/api/system'] }
        });
        setIsOnline(true);
        setLastUpdate(new Date());
      } else {
        setIsOnline(false);
      }
    } catch (error) {
      setIsOnline(false);
      // Fallback to simulated data when offline
      setSystemStatus({
        plugins: { total: 1, running: 1, list: ['ghost_augmenth'] },
        apps: { total: 6, running: 6, list: ['GhostTask', 'GhostVault', 'GhostMail', 'GhostComm', 'GhostPulse', 'GhostGate'] },
        relay: { registered: 7, signals: 247 },
        api: { port: 3000, endpoints: ['/api/plugins', '/api/system'] }
      });
    }
  };

  // Live signal feed simulation and real data fetching
  useEffect(() => {
    const generateSignal = (): Signal => {
      const sources = ['GhostTask', 'GhostVault', 'GhostMail', 'ghost_augmenth', 'PluginManager', 'OmniRelay'];
      const types = ['heartbeat', 'ping', 'app_started', 'plugin_loaded', 'signal_routed', 'task_completed', 'vault_access', 'mail_sent'];
      const statuses: ('success' | 'warning' | 'error')[] = ['success', 'success', 'success', 'warning', 'error'];

      const source = sources[Math.floor(Math.random() * sources.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      return {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        type,
        source,
        target: 'broadcast',
        status,
        message: `${source} ${type} signal processed`
      };
    };

    // Add initial signals
    const initialSignals = [
      {
        id: '1',
        timestamp: new Date().toLocaleTimeString(),
        type: 'system_ready',
        source: 'GhostOS',
        target: 'broadcast',
        status: 'success' as const,
        message: 'GhostOS fully operational'
      },
      {
        id: '2',
        timestamp: new Date().toLocaleTimeString(),
        type: 'plugin_started',
        source: 'PluginManager',
        target: 'ghost_augmenth',
        status: 'success' as const,
        message: 'Plugin ghost_augmenth activated'
      }
    ];

    setSignals(initialSignals);

    // Fetch initial system status
    fetchSystemStatus();

    // Generate new signals periodically
    const signalInterval = setInterval(() => {
      setSignals(prev => {
        const newSignal = generateSignal();
        const updated = [newSignal, ...prev].slice(0, 20); // Keep last 20 signals
        return updated;
      });
    }, 3000);

    // Fetch system status periodically
    const statusInterval = setInterval(fetchSystemStatus, 5000);

    return () => {
      clearInterval(signalInterval);
      clearInterval(statusInterval);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-3 h-3 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="w-3 h-3 text-red-400" />;
      default:
        return <Radio className="w-3 h-3 text-zinc-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <div className="absolute right-4 top-20 w-80 z-40">
      <div className="bg-zinc-900/90 backdrop-blur-lg border border-flame-500/50 rounded-xl shadow-flame overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between p-3 bg-zinc-800/50 border-b border-flame-500/30 cursor-pointer hover:bg-zinc-800/70 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-flame animate-pulse" />
            <span className="font-medium text-flame">GhostPulse Monitor</span>
            {isOnline ? (
              <Wifi className="w-3 h-3 text-green-400" />
            ) : (
              <WifiOff className="w-3 h-3 text-red-400" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fetchSystemStatus();
              }}
              className="p-1 hover:bg-zinc-700 rounded transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-3 h-3 text-zinc-400 hover:text-flame" />
            </button>
            <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
            <span className="text-xs text-zinc-400">{signals.length}</span>
            <Zap className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* System Status Overview */}
        {systemStatus && (
          <div className="p-3 bg-zinc-800/30 border-b border-zinc-700/50">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Apps:</span>
                <span className="text-green-400 font-medium">{systemStatus.apps.running}/{systemStatus.apps.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Plugins:</span>
                <span className="text-flame font-medium">{systemStatus.plugins.running}/{systemStatus.plugins.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Signals:</span>
                <span className="text-blue-400 font-medium">{systemStatus.relay.signals}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Registry:</span>
                <span className="text-purple-400 font-medium">{systemStatus.relay.registered}</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-zinc-500">
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        )}

        {/* Signal Feed */}
        <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-32'} overflow-hidden`}>
          <div className="max-h-full overflow-y-auto">
            {signals.slice(0, isExpanded ? 20 : 5).map((signal) => (
              <div
                key={signal.id}
                className="flex items-start gap-3 p-3 border-b border-zinc-700/50 last:border-b-0 hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getStatusIcon(signal.status)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-zinc-400">{signal.timestamp}</span>
                    <span className={`text-xs font-medium ${getStatusColor(signal.status)}`}>
                      {signal.type}
                    </span>
                  </div>

                  <div className="text-sm text-white mb-1">
                    <span className="text-flame font-medium">{signal.source}</span>
                    <span className="text-zinc-400 mx-1">→</span>
                    <span className="text-zinc-300">{signal.target}</span>
                  </div>

                  <div className="text-xs text-zinc-400 truncate">
                    {signal.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="p-3 bg-zinc-800/30 border-t border-zinc-700/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-zinc-400">Success</div>
              <div className="text-sm font-medium text-green-400">
                {signals.filter(s => s.status === 'success').length}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-400">Warning</div>
              <div className="text-sm font-medium text-yellow-400">
                {signals.filter(s => s.status === 'warning').length}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-400">Error</div>
              <div className="text-sm font-medium text-red-400">
                {signals.filter(s => s.status === 'error').length}
              </div>
            </div>
          </div>

          {/* Live Plugin Status */}
          {systemStatus && isExpanded && (
            <div className="mt-3 pt-3 border-t border-zinc-700/50">
              <div className="text-xs text-zinc-400 mb-2">Active Plugins:</div>
              <div className="space-y-1">
                {systemStatus.plugins.list.map((plugin, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300">{plugin}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
