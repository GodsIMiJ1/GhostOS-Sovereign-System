"use client";

import { useState } from "react";
import {
  CheckSquare,
  Mail,
  Shield,
  Terminal,
  Radio,
  Lock,
  Flame,
  Brain,
  FileText,
  BookOpen
} from "lucide-react";

interface GhostDockProps {
  openApps: string[];
  onLaunch: (app: string) => void;
}

export function GhostDock({ openApps, onLaunch }: GhostDockProps) {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const apps = [
    {
      name: "GhostTask",
      icon: CheckSquare,
      color: "text-blue-400",
      description: "Task Management"
    },
    {
      name: "GhostMail",
      icon: Mail,
      color: "text-green-400",
      description: "Communication Hub"
    },
    {
      name: "GhostVault",
      icon: Shield,
      color: "text-purple-400",
      description: "Secure Storage"
    },
    {
      name: "FlameCLI",
      icon: Terminal,
      color: "text-flame",
      description: "Sovereign Terminal"
    },
    {
      name: "Omari",
      icon: Brain,
      color: "text-red-400",
      description: "Divine AI Assistant"
    },
    {
      name: "GhostWriteOS",
      icon: FileText,
      color: "text-emerald-400",
      description: "Sacred Scribe Terminal"
    },
    {
      name: "README Viewer",
      icon: BookOpen,
      color: "text-flame",
      description: "Sacred Documentation Portal"
    },
    {
      name: "GhostComm",
      icon: Radio,
      color: "text-cyan-400",
      description: "System Communication"
    },
    {
      name: "GhostGate",
      icon: Lock,
      color: "text-red-400",
      description: "Access Control"
    }
  ];

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* Tooltip */}
      {hoveredApp && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-flame-500/50">
          <div className="font-medium">{hoveredApp}</div>
          <div className="text-xs text-zinc-400">
            {apps.find(app => app.name === hoveredApp)?.description}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
        </div>
      )}

      {/* Dock Container */}
      <div className="flex items-center gap-2 p-3 bg-black/40 backdrop-blur-lg rounded-2xl border border-flame-500/30 shadow-flame">
        {/* Flame Logo */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-flame-500 to-flame-600 shadow-flame mr-2">
          <Flame className="w-6 h-6 text-white animate-pulse" />
        </div>

        {/* App Icons */}
        {apps.map((app) => {
          const Icon = app.icon;
          const isOpen = openApps.includes(app.name);

          return (
            <button
              key={app.name}
              onClick={() => onLaunch(app.name)}
              onMouseEnter={() => setHoveredApp(app.name)}
              onMouseLeave={() => setHoveredApp(null)}
              className={`
                relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 flame-button
                ${isOpen
                  ? 'bg-flame-500 shadow-flame scale-110'
                  : 'bg-zinc-800 hover:bg-flame-500/30 hover:scale-105'
                }
                ${isOpen ? 'ring-2 ring-flame-400/50' : ''}
              `}
            >
              <Icon className={`w-5 h-5 ${isOpen ? 'text-white' : app.color} transition-colors`} />

              {/* Active indicator */}
              {isOpen && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-flame-400 rounded-full animate-pulse" />
              )}

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-full bg-flame-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </button>
          );
        })}

        {/* System Status Indicator */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-500/50 ml-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Dock Reflection */}
      <div className="absolute top-full left-0 right-0 h-8 bg-gradient-to-b from-flame-500/10 to-transparent rounded-b-2xl transform scale-y-[-1] opacity-30" />
    </div>
  );
}
