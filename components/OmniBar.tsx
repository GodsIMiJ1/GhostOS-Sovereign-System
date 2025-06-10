"use client";

import { useState, useEffect } from "react";
import { Search, Command, Flame, Zap } from "lucide-react";

interface OmniBarProps {
  onCommand: (cmd: string) => void;
}

export function OmniBar({ onCommand }: OmniBarProps) {
  const [value, setValue] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const commands = [
    "GhostTask",
    "GhostMail", 
    "GhostVault",
    "FlameCLI",
    "GhostComm",
    "GhostGate",
    "plugin list",
    "augmenth deploy",
    "flame status",
    "system status"
  ];

  useEffect(() => {
    if (value.trim()) {
      const filtered = commands.filter(cmd => 
        cmd.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [value]);

  const handleSubmit = (command?: string) => {
    const cmd = command || value.trim();
    if (cmd) {
      onCommand(cmd);
      setValue("");
      setSuggestions([]);
      setIsActive(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setValue("");
      setSuggestions([]);
      setIsActive(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      {/* Main Bar */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-black/80 via-zinc-900/80 to-black/80 backdrop-blur-lg border-b border-flame-500/30">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-flame-500 to-flame-600 flex items-center justify-center">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <span className="text-flame font-bold text-lg glow">GhostOS</span>
        </div>

        {/* Search Input */}
        <div className="flex-1 max-w-2xl relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsActive(true)}
              onBlur={() => setTimeout(() => setIsActive(false), 200)}
              placeholder="Type command... e.g. GhostTask, plugin list, flame status"
              className={`
                w-full pl-10 pr-12 py-3 bg-zinc-800/50 text-white rounded-xl border transition-all duration-300
                ${isActive 
                  ? 'border-flame-500 ring-2 ring-flame-500/20 shadow-flame' 
                  : 'border-zinc-600 hover:border-flame-500/50'
                }
                focus:outline-none placeholder-zinc-400
              `}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Command className="w-4 h-4 text-zinc-400" />
              <span className="text-xs text-zinc-400">⏎</span>
            </div>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && isActive && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-lg border border-flame-500/30 rounded-xl shadow-flame overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSubmit(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-flame-500/20 transition-colors border-b border-zinc-700/50 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-flame-400" />
                    <span className="text-white">{suggestion}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg border border-zinc-600">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-zinc-300">Online</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg border border-zinc-600">
            <span className="text-sm text-zinc-300">Apps:</span>
            <span className="text-sm text-flame font-medium">6</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg border border-zinc-600">
            <span className="text-sm text-zinc-300">Plugins:</span>
            <span className="text-sm text-flame font-medium">1</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {isActive && !value && (
        <div className="absolute top-full left-4 right-4 mt-2 p-4 bg-zinc-900/95 backdrop-blur-lg border border-flame-500/30 rounded-xl shadow-flame">
          <div className="text-sm text-zinc-400 mb-3">Quick Actions</div>
          <div className="grid grid-cols-3 gap-2">
            {["GhostTask", "GhostMail", "GhostVault", "FlameCLI", "plugin list", "flame status"].map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleSubmit(cmd)}
                className="px-3 py-2 text-sm text-left bg-zinc-800/50 hover:bg-flame-500/20 rounded-lg transition-colors border border-zinc-700 hover:border-flame-500/50"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
