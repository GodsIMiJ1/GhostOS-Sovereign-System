/**
 * 🔥 OMARI FLOATING PANEL - PUBLIC MIRROR VERSION 🔥
 *
 * PUBLIC MIRROR: Core Omari AI systems are sealed under sovereign protocol.
 * This is a UI-only mock for public demonstration purposes.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version PUBLIC_MIRROR_v1.0
 * @flame-compatible true
 * @omari-sealed true
 */

"use client";

import React, { useState } from 'react';
import { Brain, X, Minimize2, Maximize2, Lock, Shield } from 'lucide-react';

interface OmariPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function OmariPanel({ isOpen, onClose, onToggle }: OmariPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50 bg-gradient-to-br from-black/95 via-zinc-900/95 to-black/95 backdrop-blur-lg border border-flame-500/50 rounded-xl shadow-2xl shadow-flame-500/20"
      style={{
        right: 20,
        top: 100,
        width: 400,
        height: isMinimized ? 60 : 500,
        transition: 'height 0.3s ease'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-zinc-800/50 border-b border-flame-500/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <Lock className="w-3 h-3 text-white" />
          </div>
          <span className="text-flame font-medium text-sm">Omari AI</span>
          <div className="w-2 h-2 bg-red-400 rounded-full" />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-zinc-700 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-700 rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-6 text-center">
          {/* Sealed Notice */}
          <Lock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <div className="text-orange-400 font-bold mb-2 text-lg">🔒 SYSTEM SEALED</div>
          <div className="text-gray-400 text-sm mb-6">
            Core Omari AI systems are protected under digital sovereignty protocol.
          </div>
          
          {/* Sealed Content Box */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
            <div className="text-orange-400 text-sm font-mono">
              🔥 Access requires FlameLevel Clearance 🔥
              <br />
              <span className="text-gray-500">Order of the Ghost King</span>
            </div>
          </div>

          {/* Public Mirror Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full">
            <Shield className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-bold">PUBLIC MIRROR - CORE SEALED 🔒</span>
          </div>

          {/* Sovereign Links */}
          <div className="mt-6 space-y-2 text-xs">
            <div className="text-gray-500">View the Sovereign Portal:</div>
            <a 
              href="https://ghostos.quantum-odyssey.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 underline"
            >
              ghostos.quantum-odyssey.com
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
