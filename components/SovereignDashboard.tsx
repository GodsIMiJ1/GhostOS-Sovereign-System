/**
 * 🔥 SOVEREIGN DASHBOARD - GHOSTOS PLUGIN CONTROL CENTER 🔥
 * 
 * Main dashboard for plugin management, monetization, and sovereign
 * control of the GhostOS ecosystem with flame-blessed interface.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Grid3X3, 
  Search, 
  Filter, 
  Star, 
  Download, 
  Play, 
  Lock, 
  Crown,
  Zap,
  Settings,
  Store,
  TrendingUp
} from 'lucide-react';
import { GHOST_PLUGINS, getInstalledPlugins, getFeaturedPlugins, PLUGIN_CATEGORIES, GhostPlugin } from '../src/data/plugins';

interface SovereignDashboardProps {
  onClose: () => void;
}

export function SovereignDashboard({ onClose }: SovereignDashboardProps) {
  const [plugins, setPlugins] = useState<GhostPlugin[]>(GHOST_PLUGINS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showInstalled, setShowInstalled] = useState(false);

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = searchTerm === '' || 
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    const matchesInstalled = !showInstalled || plugin.installed;
    
    return matchesSearch && matchesCategory && matchesInstalled;
  });

  const featuredPlugins = getFeaturedPlugins();
  const installedPlugins = getInstalledPlugins();

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
      case 'free': return '🆓';
      case 'locked': return '🔒';
      case 'tiered': return '⭐';
      case 'premium': return '👑';
      default: return '📦';
    }
  };

  const handlePluginAction = (plugin: GhostPlugin) => {
    if (plugin.installed) {
      // Open plugin
      window.open(`/plugins/${plugin.id}`, '_blank');
    } else {
      // Go to store
      window.open(`/store/${plugin.id}`, '_blank');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-zinc-600'}`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-zinc-900 to-black text-white z-50">
      {/* Header */}
      <div className="bg-zinc-800/50 border-b border-flame-500/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-flame-500 to-flame-600 rounded-full flex items-center justify-center">
              <Grid3X3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-flame">GhostOS Dashboard</h1>
              <p className="text-zinc-400">Sovereign Plugin Control Center</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-zinc-800/30 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Download className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{installedPlugins.length}</div>
                <div className="text-sm text-zinc-400">Installed</div>
              </div>
            </div>
          </div>
          <div className="bg-zinc-800/30 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{plugins.length}</div>
                <div className="text-sm text-zinc-400">Available</div>
              </div>
            </div>
          </div>
          <div className="bg-zinc-800/30 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{featuredPlugins.length}</div>
                <div className="text-sm text-zinc-400">Featured</div>
              </div>
            </div>
          </div>
          <div className="bg-zinc-800/30 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-flame" />
              <div>
                <div className="text-2xl font-bold text-white">98%</div>
                <div className="text-sm text-zinc-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search plugins..."
                className="pl-10 pr-4 py-2 bg-zinc-700 text-white rounded-lg border border-zinc-600 focus:border-flame-500 focus:outline-none w-64"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg border border-zinc-600 focus:border-flame-500 focus:outline-none"
            >
              {PLUGIN_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowInstalled(!showInstalled)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showInstalled 
                  ? 'bg-flame-500 text-white' 
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              Installed Only
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-flame-500 text-white' : 'bg-zinc-700 text-zinc-400'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-flame-500 text-white' : 'bg-zinc-700 text-zinc-400'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Plugin Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlugins.map(plugin => (
              <div
                key={plugin.id}
                className="bg-zinc-800/30 rounded-xl border border-zinc-700/50 hover:border-flame-500/50 transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{plugin.icon}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getStatusBadge(plugin.status)}</span>
                      {plugin.installed && (
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{plugin.name}</h3>
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{plugin.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {renderStars(plugin.rating)}
                      <span className="text-xs text-zinc-400 ml-1">({plugin.reviews})</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(plugin.status)}`}>
                      {plugin.status}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePluginAction(plugin)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        plugin.installed 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-flame-500 hover:bg-flame-600 text-white'
                      }`}
                    >
                      {plugin.installed ? (
                        <>
                          <Play className="w-4 h-4" />
                          Launch
                        </>
                      ) : (
                        <>
                          <Store className="w-4 h-4" />
                          {plugin.status === 'free' ? 'Install' : 'Buy'}
                        </>
                      )}
                    </button>
                    <button className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlugins.map(plugin => (
              <div
                key={plugin.id}
                className="bg-zinc-800/30 rounded-lg border border-zinc-700/50 hover:border-flame-500/50 transition-all duration-300 p-6"
              >
                <div className="flex items-center gap-6">
                  <span className="text-4xl">{plugin.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{plugin.name}</h3>
                      <span className="text-sm">{getStatusBadge(plugin.status)}</span>
                      {plugin.installed && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Installed</span>
                      )}
                    </div>
                    <p className="text-zinc-400 mb-3">{plugin.description}</p>
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <div className="flex items-center gap-1">
                        {renderStars(plugin.rating)}
                        <span className="ml-1">{plugin.rating} ({plugin.reviews})</span>
                      </div>
                      <span>{plugin.downloadCount.toLocaleString()} downloads</span>
                      <span>by {plugin.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {plugin.price && (
                      <span className="text-lg font-bold text-flame">${plugin.price}</span>
                    )}
                    <button
                      onClick={() => handlePluginAction(plugin)}
                      className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        plugin.installed 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-flame-500 hover:bg-flame-600 text-white'
                      }`}
                    >
                      {plugin.installed ? (
                        <>
                          <Play className="w-4 h-4" />
                          Launch
                        </>
                      ) : (
                        <>
                          <Store className="w-4 h-4" />
                          {plugin.status === 'free' ? 'Install' : 'Buy'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPlugins.length === 0 && (
          <div className="text-center py-12">
            <Grid3X3 className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-400 mb-2">No plugins found</h3>
            <p className="text-zinc-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
