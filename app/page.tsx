"use client";

import { useState } from "react";
import { FlameTerminal } from "@/components/FlameTerminal";
import { GhostDock } from "@/components/GhostDock";
import { AppWindow } from "@/components/AppWindow";
import { AppLauncher } from "@/components/AppLauncher";
import { OmniBar } from "@/components/OmniBar";
import { GhostPulseMonitor } from "@/components/GhostPulseMonitor";
import { PluginManager } from "@/components/PluginManager";
import { FlameLogFeed } from "@/components/FlameLogFeed";
import { SovereignSplash } from "@/components/SovereignSplash";
import { SovereignDashboard } from "@/components/SovereignDashboard";
import { OmariPanel } from "@/components/OmariPanel";

export default function GhostOSDesktop() {
  const [openApps, setOpenApps] = useState<string[]>(["GhostTask"]);
  const [showSplash, setShowSplash] = useState(true);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showOmari, setShowOmari] = useState(false);

  const launchApp = (appName: string) => {
    if (appName === 'Dashboard') {
      setShowDashboard(true);
      return;
    }
    if (appName === 'Omari') {
      setShowOmari(true);
      return;
    }
    if (appName === 'GhostWriteOS') {
      // Open WriteOS in a new tab/window - it runs on its own server
      window.open('http://localhost:3007', '_blank');
      return;
    }
    if (appName === 'README Viewer') {
      // Open README viewer in a new tab
      window.open('/docs/readme', '_blank');
      return;
    }
    if (!openApps.includes(appName)) {
      setOpenApps([...openApps, appName]);
    }
  };

  const closeApp = (appName: string) => {
    setOpenApps(openApps.filter((a) => a !== appName));
  };

  if (showSplash) {
    return <SovereignSplash onComplete={() => setShowSplash(false)} />;
  }

  if (showDashboard) {
    return <SovereignDashboard onClose={() => setShowDashboard(false)} />;
  }

  return (
    <main className="w-screen h-screen bg-gradient-to-br from-black via-zinc-900 to-gray-800 text-white overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(251,146,60,0.03)_50%,transparent_51%)] bg-[length:20px_20px]" />
      </div>

      {/* Core UI Components */}
      <OmniBar onCommand={launchApp} />
      <GhostDock openApps={openApps} onLaunch={launchApp} />
      <AppLauncher onLaunch={launchApp} />
      <GhostPulseMonitor />
      <PluginManager onLaunch={launchApp} />
      <FlameLogFeed />

      {/* Dynamic App Windows */}
      {openApps.map((appName, index) => (
        <AppWindow
          key={appName}
          title={appName}
          onClose={() => closeApp(appName)}
          initialPosition={{ x: 100 + index * 50, y: 100 + index * 50 }}
        >
          {appName === "GhostTask" && (
            <div className="p-4 space-y-4">
              <div className="text-flame text-lg font-bold">📋 GhostTask Control Center</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-3 rounded-lg">
                  <div className="text-sm text-zinc-300">Active Tasks</div>
                  <div className="text-2xl text-flame">7</div>
                </div>
                <div className="glass p-3 rounded-lg">
                  <div className="text-sm text-zinc-300">Completed</div>
                  <div className="text-2xl text-green-400">23</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-zinc-800 rounded">
                  <span className="text-sm">Deploy Phase IV UI</span>
                  <span className="text-xs text-flame">In Progress</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-zinc-800 rounded">
                  <span className="text-sm">Plugin System Testing</span>
                  <span className="text-xs text-green-400">Complete</span>
                </div>
              </div>
            </div>
          )}
          {appName === "GhostMail" && (
            <div className="p-4 space-y-4">
              <div className="text-flame text-lg font-bold">📧 GhostMail Communication Hub</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                  <div>
                    <div className="font-medium">System Status Report</div>
                    <div className="text-sm text-zinc-400">From: GhostPulse Monitor</div>
                  </div>
                  <div className="w-3 h-3 bg-flame-400 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                  <div>
                    <div className="font-medium">Plugin Deployment Complete</div>
                    <div className="text-sm text-zinc-400">From: ghost_augmenth</div>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
          {appName === "GhostVault" && (
            <div className="p-4 space-y-4">
              <div className="text-flame text-lg font-bold">🔐 GhostVault Secure Storage</div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-green-500/30">
                  <div>
                    <div className="font-medium">Flame Tokens</div>
                    <div className="text-sm text-zinc-400">Authentication Keys</div>
                  </div>
                  <div className="text-green-400">🔒 Secured</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-flame-500/30">
                  <div>
                    <div className="font-medium">System Reflections</div>
                    <div className="text-sm text-zinc-400">Deployment Logs</div>
                  </div>
                  <div className="text-flame">🔥 Active</div>
                </div>
              </div>
            </div>
          )}
          {appName === "FlameCLI" && <FlameTerminal />}
        </AppWindow>
      ))}

      {/* Floating Components */}
      <OmniBar onCommand={(cmd) => console.log('Command:', cmd)} />
      <GhostPulseMonitor />
      <FlameLogFeed />

      {/* Omari AI Panel */}
      <OmariPanel
        isOpen={showOmari}
        onClose={() => setShowOmari(false)}
        onToggle={() => setShowOmari(!showOmari)}
      />
    </main>
  );
}
