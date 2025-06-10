"use client";

import { useState } from "react";
import { 
  Grid3X3, 
  CheckSquare, 
  Mail, 
  Shield, 
  Terminal, 
  Radio, 
  Lock,
  X,
  Search
} from "lucide-react";

interface AppLauncherProps {
  onLaunch: (app: string) => void;
}

export function AppLauncher({ onLaunch }: AppLauncherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const apps = [
    {
      name: "GhostTask",
      icon: CheckSquare,
      color: "text-blue-400",
      description: "Advanced task management and automation system",
      category: "Productivity"
    },
    {
      name: "GhostMail", 
      icon: Mail,
      color: "text-green-400",
      description: "Email processing and communication hub",
      category: "Communication"
    },
    {
      name: "GhostVault",
      icon: Shield,
      color: "text-purple-400", 
      description: "Secure encrypted data storage and retrieval",
      category: "Security"
    },
    {
      name: "FlameCLI",
      icon: Terminal,
      color: "text-flame",
      description: "Sovereign terminal shell interface",
      category: "System"
    },
    {
      name: "GhostComm",
      icon: Radio,
      color: "text-cyan-400",
      description: "Inter-system communication protocol",
      category: "Communication"
    },
    {
      name: "GhostGate",
      icon: Lock,
      color: "text-red-400",
      description: "Access control and security gateway", 
      category: "Security"
    }
  ];

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(apps.map(app => app.category))];

  const handleLaunch = (appName: string) => {
    onLaunch(appName);
    setIsOpen(false);
    setSearchTerm("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 left-4 transform -translate-y-1/2 w-12 h-12 bg-flame-500 hover:bg-flame-600 rounded-full flex items-center justify-center shadow-flame transition-all duration-300 z-40"
      >
        <Grid3X3 className="w-5 h-5 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-zinc-900/95 backdrop-blur-lg border border-flame-500/50 rounded-2xl shadow-flame w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-zinc-800/50 border-b border-flame-500/30">
          <div className="flex items-center gap-3">
            <Grid3X3 className="w-6 h-6 text-flame" />
            <h2 className="text-xl font-bold text-flame">GhostOS App Launcher</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-zinc-700/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search apps..."
              className="w-full pl-10 pr-4 py-3 bg-zinc-800 text-white rounded-xl border border-zinc-600 focus:border-flame-500 focus:ring-2 focus:ring-flame-500/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* App Grid */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {categories.map(category => {
            const categoryApps = filteredApps.filter(app => app.category === category);
            if (categoryApps.length === 0) return null;

            return (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-semibold text-zinc-300 mb-4">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryApps.map(app => {
                    const Icon = app.icon;
                    return (
                      <button
                        key={app.name}
                        onClick={() => handleLaunch(app.name)}
                        className="p-4 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-flame-500/50 rounded-xl transition-all duration-300 text-left group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-3 rounded-lg bg-zinc-700 group-hover:bg-zinc-600 transition-colors`}>
                            <Icon className={`w-6 h-6 ${app.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white mb-1 group-hover:text-flame transition-colors">
                              {app.name}
                            </h4>
                            <p className="text-sm text-zinc-400 line-clamp-2">
                              {app.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filteredApps.length === 0 && (
            <div className="text-center py-12">
              <Grid3X3 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-400 mb-2">No apps found</h3>
              <p className="text-zinc-500">Try adjusting your search terms</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-800/30 border-t border-zinc-700/50">
          <div className="flex justify-between items-center text-sm text-zinc-400">
            <span>{filteredApps.length} apps available</span>
            <span>Press ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
