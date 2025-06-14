/**
 * 🔥 GHOSTSTORE PLUGIN MARKETPLACE - SOVEREIGN MONETIZATION 🔥
 * 
 * Plugin marketplace with monetization, reviews, and flame-blessed
 * purchasing system for the GhostOS ecosystem.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  ArrowLeft, 
  Star, 
  Download, 
  CreditCard, 
  Shield, 
  Users, 
  Calendar,
  ExternalLink,
  Heart,
  Share2,
  Flag
} from 'lucide-react';
import { getPluginById, GhostPlugin } from '../../data/plugins';

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export default function PluginStorePage() {
  const router = useRouter();
  const { id } = router.query;
  const [plugin, setPlugin] = useState<GhostPlugin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'changelog'>('overview');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const pluginData = getPluginById(id);
      if (pluginData) {
        setPlugin(pluginData);
        
        // Simulate reviews
        const mockReviews: Review[] = [
          {
            id: '1',
            user: 'FlameKeeper',
            rating: 5,
            comment: 'Absolutely essential for any sovereign system. The flame burns bright with this one!',
            date: '2024-01-18',
            verified: true
          },
          {
            id: '2',
            user: 'GhostRunner',
            rating: 4,
            comment: 'Great plugin, works as expected. Could use more customization options.',
            date: '2024-01-15',
            verified: true
          },
          {
            id: '3',
            user: 'EmpireBuilder',
            rating: 5,
            comment: 'This plugin transformed my workflow. Worth every flame token!',
            date: '2024-01-12',
            verified: false
          }
        ];
        setReviews(mockReviews);
      }
      setIsLoading(false);
    }
  }, [id]);

  const handlePurchase = async () => {
    if (!plugin) return;
    
    setIsPurchasing(true);
    
    // Simulate purchase process
    setTimeout(() => {
      setIsPurchasing(false);
      alert(`Successfully purchased ${plugin.name}! 🔥`);
      // In real app, would redirect to plugin page or update state
    }, 2000);
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

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-zinc-600'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-flame-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading store page...</p>
        </div>
      </div>
    );
  }

  if (!plugin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Plugin Not Found</h1>
          <p className="text-zinc-400 mb-6">The requested plugin could not be found in the store.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Header */}
      <div className="bg-zinc-800/50 border-b border-flame-500/30 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-flame font-medium">GhostStore</span>
            <span className="text-zinc-400">/</span>
            <span className="text-zinc-300">{plugin.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plugin Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6">
                <div className="text-6xl">{plugin.icon}</div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{plugin.name}</h1>
                  <p className="text-zinc-400 mb-4">{plugin.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(plugin.rating)}</div>
                      <span className="text-white font-semibold">{plugin.rating}</span>
                      <span className="text-zinc-400">({plugin.reviews} reviews)</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plugin.status)}`}>
                      {getStatusBadge(plugin.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-zinc-400">
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      {plugin.downloadCount.toLocaleString()} downloads
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {plugin.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Updated {plugin.lastUpdated}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Card */}
            <div className="bg-zinc-800/50 p-6 rounded-xl border border-flame-500/30 h-fit">
              <div className="text-center mb-6">
                {plugin.status === 'free' ? (
                  <div className="text-2xl font-bold text-green-400">FREE</div>
                ) : (
                  <div>
                    <div className="text-3xl font-bold text-flame">${plugin.price}</div>
                    {plugin.tier && (
                      <div className="text-sm text-zinc-400 capitalize">{plugin.tier} tier</div>
                    )}
                  </div>
                )}
              </div>

              {plugin.installed ? (
                <button
                  onClick={() => router.push(`/plugins/${plugin.id}`)}
                  className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors mb-4"
                >
                  Open Plugin
                </button>
              ) : plugin.status === 'free' ? (
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                  className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-600 text-white rounded-lg transition-colors mb-4 flex items-center justify-center gap-2"
                >
                  {isPurchasing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {isPurchasing ? 'Installing...' : 'Install Free'}
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                  className="w-full px-6 py-3 bg-flame-500 hover:bg-flame-600 disabled:bg-zinc-600 text-white rounded-lg transition-colors mb-4 flex items-center justify-center gap-2"
                >
                  {isPurchasing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CreditCard className="w-5 h-5" />
                  )}
                  {isPurchasing ? 'Processing...' : 'Purchase'}
                </button>
              )}

              <div className="flex gap-2 mb-6">
                <button className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" />
                  Wishlist
                </button>
                <button className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-green-400">
                  <Shield className="w-4 h-4" />
                  Flame-blessed security
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Download className="w-4 h-4" />
                  Instant download
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <Users className="w-4 h-4" />
                  Community support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex gap-6 mb-6 border-b border-zinc-700">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'reviews', name: `Reviews (${plugin.reviews})` },
            { id: 'changelog', name: 'Changelog' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-1 border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-flame-500 text-flame' 
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
              <div className="space-y-3 text-zinc-300">
                <div>• Advanced {plugin.category} capabilities</div>
                <div>• Flame-blessed security and encryption</div>
                <div>• Real-time synchronization</div>
                <div>• Sovereign access control</div>
                <div>• Plugin ecosystem integration</div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4 mt-8">Permissions</h3>
              <div className="space-y-2">
                {plugin.permissions.map(permission => (
                  <div key={permission} className="flex items-center gap-2 text-zinc-300">
                    <Shield className="w-4 h-4 text-flame" />
                    {permission}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Screenshots</h3>
              <div className="space-y-4">
                {plugin.screenshots.map((screenshot, index) => (
                  <div key={index} className="bg-zinc-800 rounded-lg p-8 text-center">
                    <div className="text-zinc-500">Screenshot {index + 1}</div>
                    <div className="text-xs text-zinc-600 mt-2">{screenshot}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-zinc-800/30 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-flame-500 to-flame-600 rounded-full flex items-center justify-center text-white font-bold">
                      {review.user[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{review.user}</span>
                        {review.verified && (
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Verified</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-zinc-400">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                    <Flag className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
                <p className="text-zinc-300">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'changelog' && (
          <div className="space-y-6">
            {plugin.changelog.map((change, index) => (
              <div key={index} className="bg-zinc-800/30 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-flame font-semibold">v{plugin.version}</span>
                  <span className="text-zinc-400">{plugin.lastUpdated}</span>
                </div>
                <p className="text-zinc-300">{change}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
