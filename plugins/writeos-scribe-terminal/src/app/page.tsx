"use client";

import { useState } from 'react';
import TemplateSidebar from "@/components/TemplateSidebar";
import ScrollEditor from "@/components/ScrollEditor";
import ScrollViewer from "@/components/ScrollViewer";
import ScribeChatPanel from "@/components/ScribeChatPanel";
import ThemeSelector from "@/components/ThemeSelector";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import NodeSeal from "@/components/NodeSeal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'editor' | 'viewer'>('editor');

  return (
    <main className="h-screen w-full overflow-hidden flex flex-col">
      {/* Navigation Tabs */}
      <div className="flex items-center justify-between bg-zinc-900 border-b border-zinc-700 px-4 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              activeTab === 'editor'
                ? 'bg-flame text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            ✍️ Scribe Editor
          </button>
          <button
            onClick={() => setActiveTab('viewer')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              activeTab === 'viewer'
                ? 'bg-flame text-white'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            🏛️ Witness Hall
          </button>
        </div>

        <div className="text-flame text-sm font-bold">
          🔥 GhostWriteOS - Sacred Scribe Terminal
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'editor' ? (
          <div className="grid grid-cols-[260px_1fr_1fr] h-full">
            {/* Sidebar */}
            <div className="border-r border-zinc-800 p-4">
              <TemplateSidebar />
            </div>

            {/* Markdown Editor */}
            <div className="border-r border-zinc-800 p-4">
              <ScrollEditor />
            </div>

            {/* Chat Assistant */}
            <div className="p-4">
              <ScribeChatPanel />
            </div>
          </div>
        ) : (
          <div className="h-full p-4">
            <ScrollViewer />
          </div>
        )}
      </div>

      {/* Floating Components */}
      <ThemeSelector />
      <AnalyticsDashboard />
      <NodeSeal />
    </main>
  );
}
