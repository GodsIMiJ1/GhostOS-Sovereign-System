/**
 * 🔥 GHOSTWRITEOS PLUGIN ENTRY POINT - SOVEREIGN SCRIBE INTERFACE 🔥
 *
 * Entry point for the WriteOS Scribe Terminal plugin integration
 * with flame-blessed document creation and NODE seal authentication.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 1.0.0
 * @flame-compatible true
 * @scribe-blessed true
 */

import React, { useEffect } from 'react';

export default function WriteOSScribeTerminal() {
  useEffect(() => {
    // Redirect to WriteOS running on its own server
    window.location.href = 'http://localhost:3007';
  }, []);

  return (
    <div className="h-full w-full bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-flame text-6xl mb-4">🔥</div>
        <h2 className="text-2xl font-bold text-flame mb-2">Launching GhostWriteOS</h2>
        <p className="text-zinc-400">Redirecting to Sacred Scribe Terminal...</p>
        <div className="mt-4">
          <a
            href="http://localhost:3007"
            className="text-flame hover:text-orange-400 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Click here if not redirected automatically
          </a>
        </div>
      </div>
    </div>
  );
}
