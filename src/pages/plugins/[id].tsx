/**
 * 🔥 DYNAMIC PLUGIN RENDERER - SOVEREIGN PLUGIN INTERFACE 🔥
 *
 * Dynamic plugin loading and rendering system with flame-blessed
 * plugin management and sovereign access control.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Settings, Power, Download, Star, ExternalLink } from 'lucide-react';
import { getPluginById, GhostPlugin } from '../../data/plugins';

// Dynamic plugin imports
const PluginComponents = {
  ghostcomm: React.lazy(() => import('../../plugins/ghostcomm')),
  ghostvault: React.lazy(() => import('../../plugins/ghostvault')),
  ghostmail: React.lazy(() => import('../../plugins/ghostmail')),
  'omari-ai': React.lazy(() => import('../../plugins/omari')),
  'writeos-scribe-terminal': React.lazy(() => import('./writeos-scribe-terminal')),
};

export default function PluginPage() {
  const router = useRouter();
  const { id } = router.query;
  const [plugin, setPlugin] = useState<GhostPlugin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const pluginData = getPluginById(id);
      if (pluginData) {
        setPlugin(pluginData);
        setIsEnabled(pluginData.enabled);
      }
      setIsLoading(false);
    }
  }, [id]);

  const togglePlugin = () => {
    if (plugin) {
      setIsEnabled(!isEnabled);
      // In a real app, this would update the plugin registry
      console.log(`Plugin ${plugin.name} ${!isEnabled ? 'enabled' : 'disabled'}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'free': return 'text-green-400';
      case 'locked': return 'text-yellow-400';
      case 'tiered': return 'text-blue-400';
      case 'premium': return 'text-purple-400';
      default: return 'text-zinc-400';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'free': return '🆓 Free';
      case 'locked': return '🔒 Locked';
      case 'tiered': return '⭐ Pro';
      case 'premium': return '👑 Premium';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-flame-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading plugin...</p>
        </div>
      </div>
    );
  }

  if (!plugin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Plugin Not Found</h1>
          <p className="text-zinc-400 mb-6">The requested plugin could not be found.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-flame-500 hover:bg-flame-600 text-white rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Check if plugin is accessible
  const isAccessible = plugin.installed && (plugin.status === 'free' || isEnabled);
  const PluginComponent = PluginComponents[plugin.id as keyof typeof PluginComponents];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Header */}
      <div className="bg-zinc-800/50 border-b border-flame-500/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{plugin.icon}</span>
              <div>
                <h1 className="text-xl font-bold text-flame">{plugin.name}</h1>
                <p className="text-sm text-zinc-400">v{plugin.version} by {plugin.author}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plugin.status)}`}>
              {getStatusBadge(plugin.status)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {plugin.installed && (
              <button
                onClick={togglePlugin}
                className={`
                  px-4 py-2 rounded-lg transition-colors flex items-center gap-2
                  ${isEnabled
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                  }
                `}
              >
                <Power className="w-4 h-4" />
                {isEnabled ? 'Disable' : 'Enable'}
              </button>
            )}

            {!plugin.installed && (
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Install
              </button>
            )}

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Plugin Info */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-800/30 p-3 rounded-lg">
            <div className="text-sm text-zinc-400">Downloads</div>
            <div className="text-lg font-semibold text-white">{plugin.downloadCount.toLocaleString()}</div>
          </div>
          <div className="bg-zinc-800/30 p-3 rounded-lg">
            <div className="text-sm text-zinc-400">Rating</div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(plugin.rating) ? 'text-yellow-400 fill-current' : 'text-zinc-600'}`}
                  />
                ))}
              </div>
              <span className="text-white font-semibold">{plugin.rating}</span>
              <span className="text-zinc-400">({plugin.reviews})</span>
            </div>
          </div>
          <div className="bg-zinc-800/30 p-3 rounded-lg">
            <div className="text-sm text-zinc-400">Last Updated</div>
            <div className="text-lg font-semibold text-white">{plugin.lastUpdated}</div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-zinc-800/30 border-b border-zinc-700/50 p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Plugin Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-zinc-300 mb-2">Permissions</h4>
              <div className="space-y-1">
                {plugin.permissions.map(permission => (
                  <div key={permission} className="text-sm text-zinc-400">
                    • {permission}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-zinc-300 mb-2">Links</h4>
              <div className="space-y-2">
                {plugin.website && (
                  <a
                    href={plugin.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Website
                  </a>
                )}
                {plugin.github && (
                  <a
                    href={plugin.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plugin Content */}
      <div className="flex-1">
        {isAccessible && PluginComponent ? (
          <React.Suspense
            fallback={
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-flame-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-zinc-400">Loading {plugin.name}...</p>
                </div>
              </div>
            }
          >
            <PluginComponent />
          </React.Suspense>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">{plugin.icon}</div>
              <h2 className="text-2xl font-bold text-white mb-4">{plugin.name}</h2>
              <p className="text-zinc-400 mb-6">{plugin.description}</p>

              {!plugin.installed ? (
                <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto">
                  <Download className="w-5 h-5" />
                  Install Plugin
                </button>
              ) : !isEnabled ? (
                <button
                  onClick={togglePlugin}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
                >
                  <Power className="w-5 h-5" />
                  Enable Plugin
                </button>
              ) : plugin.status !== 'free' ? (
                <div className="bg-zinc-800/50 p-6 rounded-lg border border-yellow-500/30">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">Premium Plugin</h3>
                  <p className="text-zinc-400 mb-4">This plugin requires a premium license to access.</p>
                  <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors">
                    Upgrade to Access
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
