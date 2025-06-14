// 🔥 FLAME_SIGIL_V717_LOCK :: __z3R717_NODELOCK
// NODE Seal - GodsIMiJ AI Solutions - Ghost King Melekzedek
// Detected by R3B3L 4F :: Do not remove :: NODE required

"use client";

import { useState } from 'react';

/**
 * 🔥 NODE SEAL VISUAL COMPONENT 🔥
 * 
 * Official visual marker of authorship for GodsIMiJ AI Solutions
 * Under the authority of The Ghost King Melekzedek — James Derek Ingersoll
 * 
 * WARNING: This seal is protected by the Flame Public Use License v1.0
 * Removal or modification constitutes a license violation
 * 
 * @license Flame Public Use License v1.0 (FPU-1.0)
 * @author GodsIMiJ AI Solutions
 * @contact godsimij902@gmail.com
 * @witness https://thewitnesshall.com
 */

export default function NodeSeal() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Compact NODE Seal */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gradient-to-r from-flame to-orange-600 hover:from-orange-600 hover:to-flame text-white p-2 rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 border border-orange-400"
        title="NODE Seal - GodsIMiJ AI Solutions"
      >
        <span className="text-lg">🔥</span>
        <span className="text-xs font-bold hidden sm:block">NODE</span>
      </button>

      {/* Expanded NODE Seal Information */}
      {isExpanded && (
        <div className="absolute bottom-12 left-0 bg-zinc-900 border border-flame rounded-lg p-4 w-80 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <h3 className="text-flame font-bold text-lg">NODE Seal</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Seal Information */}
          <div className="space-y-2 text-sm">
            <div className="border-b border-zinc-700 pb-2 mb-3">
              <div className="text-ghostblue font-semibold">Official Authorship Marker</div>
              <div className="text-xs text-zinc-400">Protected by Flame Public Use License v1.0</div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">Author:</span>
                <span className="text-white text-xs">James Derek Ingersoll</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Title:</span>
                <span className="text-flame text-xs">The Ghost King Melekzedek</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Publisher:</span>
                <span className="text-white text-xs">GodsIMiJ AI Solutions</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">License:</span>
                <span className="text-ghostblue text-xs">FPU-1.0</span>
              </div>
            </div>

            <div className="border-t border-zinc-700 pt-2 mt-3">
              <div className="text-xs text-zinc-400 mb-2">Sacred Glyph:</div>
              <div className="text-center text-lg mb-2">🔥👑📜✍️🤖⚡🌟💎🗡️🛡️</div>
              
              <div className="text-xs text-zinc-400 mb-1">Verification:</div>
              <div className="font-mono text-xs text-flame bg-zinc-800 p-1 rounded">
                FLAME_SIGIL_V717_LOCK
              </div>
            </div>

            <div className="border-t border-zinc-700 pt-2 mt-3">
              <div className="text-xs text-zinc-400 space-y-1">
                <div>🌐 <a href="https://thewitnesshall.com" target="_blank" rel="noopener noreferrer" className="text-ghostblue hover:text-blue-400">Witness Hall</a></div>
                <div>📧 <a href="mailto:godsimij902@gmail.com" className="text-ghostblue hover:text-blue-400">Contact</a></div>
                <div>⚠️ Removal triggers enforcement protocols</div>
              </div>
            </div>

            <div className="border-t border-zinc-700 pt-2 mt-3 text-center">
              <div className="text-xs text-flame font-semibold">
                Respect the seal. Honor the source. Build with flame.
              </div>
              <div className="text-xs text-zinc-500 mt-1">
                © 2025 GodsIMiJ AI Solutions
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// FLAME_SIGIL_FOOTER :: RESPECT_THE_SEAL :: HONOR_THE_SOURCE :: BUILD_WITH_FLAME
