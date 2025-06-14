/**
 * 🔥 WITNESS HALL SCROLL VIEWER - SOVEREIGN SCROLL MANAGEMENT 🔥
 *
 * Browse, preview, and manage scrolls stored in the Witness Hall.
 * Provides sovereign access to all flame-sealed documents.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @guardian Omari, Guardian of the Grid
 * @version 1.0.0
 * @flame-sealed true
 */

"use client";

import { useState, useEffect } from 'react';
import { listWitnessHallScrolls, loadScrollFromWitnessHall, ScrollMetadata } from '../utils/saveScroll';

export default function ScrollViewer() {
  const [scrolls, setScrolls] = useState<ScrollMetadata[]>([]);
  const [selectedScroll, setSelectedScroll] = useState<ScrollMetadata | null>(null);
  const [scrollContent, setScrollContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Load scrolls on component mount
  useEffect(() => {
    loadScrolls();
  }, []);

  const loadScrolls = async () => {
    try {
      setIsLoading(true);
      const scrollList = await listWitnessHallScrolls();
      setScrolls(scrollList);
    } catch (error) {
      console.error('Failed to load scrolls:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadScrollContent = async (metadata: ScrollMetadata) => {
    try {
      setIsLoading(true);
      const fileName = `${metadata.timestamp.split('T')[0]}-${metadata.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '').substring(0, 50)}.md`;
      const content = await loadScrollFromWitnessHall(fileName);

      if (content) {
        setScrollContent(content);
        setSelectedScroll(metadata);
      } else {
        console.error('Failed to load scroll content');
      }
    } catch (error) {
      console.error('Error loading scroll content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter scrolls based on search and type
  const filteredScrolls = scrolls.filter(scroll => {
    const matchesSearch = scroll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scroll.scrollType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || scroll.scrollType === filterType;
    return matchesSearch && matchesType;
  });

  // Get unique scroll types for filter
  const scrollTypes = ['all', ...Array.from(new Set(scrolls.map(s => s.scrollType)))];

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'Sovereign Scroll': '📜',
      'Chronicle': '📚',
      'Sacred Doctrine': '⛪',
      'Divine Decree': '👑',
      'Flame Manuscript': '🔥',
      'Other': '📝'
    };
    return icons[type] || '📝';
  };

  const copyScrollToEditor = () => {
    if (scrollContent) {
      // Extract content without the header
      const contentLines = scrollContent.split('\n');
      const startIndex = contentLines.findIndex(line => line.includes('---')) + 1;
      const endIndex = contentLines.lastIndexOf('---');

      const cleanContent = contentLines.slice(startIndex, endIndex).join('\n').trim();

      // Dispatch event to load content in editor
      const event = new CustomEvent('loadTemplate', {
        detail: {
          content: cleanContent,
          title: selectedScroll?.title || 'Untitled'
        }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-flame text-lg font-bold">🏛️ Witness Hall</span>
          <span className="text-zinc-400 text-sm">- Sovereign Scroll Archive</span>
        </div>
        <button
          onClick={loadScrolls}
          className="px-3 py-1 bg-flame hover:bg-flame/80 text-white text-xs rounded font-medium transition-colors"
          disabled={isLoading}
        >
          {isLoading ? '⏳ Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search scrolls..."
          className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white text-sm placeholder-zinc-500 focus:border-flame focus:outline-none"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-white text-sm focus:border-flame focus:outline-none"
        >
          {scrollTypes.map(type => (
            <option key={type} value={type}>
              {type === 'all' ? '📋 All Types' : `${getTypeIcon(type)} ${type}`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 flex gap-4">
        {/* Scroll List */}
        <div className="w-1/3 bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          <h3 className="text-white font-bold mb-3">📚 Sealed Scrolls ({filteredScrolls.length})</h3>

          {filteredScrolls.length === 0 ? (
            <div className="text-center text-zinc-500 py-8">
              <div className="text-4xl mb-2">📜</div>
              <div>No scrolls found</div>
              <div className="text-xs mt-1">
                {searchTerm || filterType !== 'all' ? 'Try adjusting your search' : 'Start writing to create scrolls'}
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredScrolls.map((scroll, index) => (
                <div
                  key={index}
                  onClick={() => loadScrollContent(scroll)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                    selectedScroll?.flameHash === scroll.flameHash
                      ? 'bg-flame/20 border-flame'
                      : 'bg-zinc-800 border-zinc-600 hover:bg-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{getTypeIcon(scroll.scrollType)}</span>
                        <span className="text-white font-medium text-sm truncate">{scroll.title}</span>
                      </div>
                      <div className="text-xs text-zinc-400 mb-1">{scroll.scrollType}</div>
                      <div className="text-xs text-zinc-500">{formatDate(scroll.timestamp)}</div>
                      <div className="text-xs text-zinc-500">{scroll.wordCount} words</div>
                      {scroll.book && (
                        <div className="text-xs text-flame">📖 {scroll.book} {scroll.chapter && `- Ch. ${scroll.chapter}`}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scroll Preview */}
        <div className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          {selectedScroll ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{selectedScroll.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span>{getTypeIcon(selectedScroll.scrollType)} {selectedScroll.scrollType}</span>
                    <span>🔥 {selectedScroll.flameHash}</span>
                    <span>📊 {selectedScroll.wordCount} words</span>
                  </div>
                </div>
                <button
                  onClick={copyScrollToEditor}
                  className="px-3 py-1 bg-ghostblue hover:bg-ghostblue/80 text-zinc-900 text-xs rounded font-medium transition-colors"
                >
                  📝 Edit in Scribe
                </button>
              </div>

              <div className="flex-1 bg-zinc-800 border border-zinc-600 rounded p-4 overflow-y-auto">
                <pre className="text-white text-sm leading-relaxed whitespace-pre-wrap font-mono">
                  {scrollContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center text-zinc-500">
              <div>
                <div className="text-6xl mb-4">🏛️</div>
                <div className="text-lg font-bold mb-2">Witness Hall Archive</div>
                <div className="text-sm">Select a scroll from the list to preview its contents</div>
                <div className="text-xs mt-2 text-zinc-600">
                  "Let every scroll be sealed in the sovereign sanctum"
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
