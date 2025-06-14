"use client";

import { useState, useEffect } from 'react';

interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
  icon: string;
}

const themes: Theme[] = [
  {
    id: 'flame-empire',
    name: 'Flame Empire',
    description: 'The original sovereign theme',
    colors: {
      primary: '#FF6B00',
      secondary: '#2DD4BF',
      background: '#0D0D1A',
      surface: '#1E1B24',
      text: '#FFFFFF',
      accent: '#FF6B00'
    },
    icon: '🔥'
  },
  {
    id: 'midnight-scholar',
    name: 'Midnight Scholar',
    description: 'Deep blues for focused writing',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      accent: '#60A5FA'
    },
    icon: '🌙'
  },
  {
    id: 'forest-sage',
    name: 'Forest Sage',
    description: 'Natural greens for calm creativity',
    colors: {
      primary: '#10B981',
      secondary: '#34D399',
      background: '#064E3B',
      surface: '#065F46',
      text: '#ECFDF5',
      accent: '#6EE7B7'
    },
    icon: '🌲'
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Majestic purples for elegant writing',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      background: '#1E1B4B',
      surface: '#312E81',
      text: '#F3F4F6',
      accent: '#C4B5FD'
    },
    icon: '👑'
  },
  {
    id: 'sunset-writer',
    name: 'Sunset Writer',
    description: 'Warm oranges and pinks',
    colors: {
      primary: '#F59E0B',
      secondary: '#EC4899',
      background: '#451A03',
      surface: '#92400E',
      text: '#FEF3C7',
      accent: '#FBBF24'
    },
    icon: '🌅'
  }
];

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<string>('flame-empire');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('writeos-theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-accent', theme.colors.accent);

    // Update Tailwind classes dynamically
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --flame: ${theme.colors.primary};
        --ghostblue: ${theme.colors.secondary};
        --scrollbg: ${theme.colors.background};
        --shadowline: ${theme.colors.surface};
      }
      
      .bg-flame { background-color: ${theme.colors.primary} !important; }
      .text-flame { color: ${theme.colors.primary} !important; }
      .bg-ghostblue { background-color: ${theme.colors.secondary} !important; }
      .text-ghostblue { color: ${theme.colors.secondary} !important; }
      .bg-scrollbg { background-color: ${theme.colors.background} !important; }
      .border-shadowline { border-color: ${theme.colors.surface} !important; }
    `;
    
    // Remove old theme styles
    const oldStyle = document.getElementById('theme-styles');
    if (oldStyle) {
      oldStyle.remove();
    }
    
    style.id = 'theme-styles';
    document.head.appendChild(style);
  };

  const selectTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem('writeos-theme', themeId);
    setIsOpen(false);
  };

  const currentThemeData = themes.find(t => t.id === currentTheme);

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-white p-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2"
      >
        <span className="text-lg">{currentThemeData?.icon}</span>
        <span className="text-sm font-medium hidden sm:block">{currentThemeData?.name}</span>
      </button>

      {/* Theme Selector Panel */}
      {isOpen && (
        <div className="absolute top-12 left-0 bg-zinc-900 border border-zinc-700 rounded-lg p-4 w-80 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-flame font-bold text-lg">🎨 Theme Selector</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => selectTheme(theme.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  currentTheme === theme.id
                    ? 'border-flame bg-zinc-800'
                    : 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{theme.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">{theme.name}</div>
                    <div className="text-xs text-zinc-400 mb-2">{theme.description}</div>
                    
                    {/* Color Preview */}
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-zinc-600"
                        style={{ backgroundColor: theme.colors.primary }}
                        title="Primary"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-zinc-600"
                        style={{ backgroundColor: theme.colors.secondary }}
                        title="Secondary"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-zinc-600"
                        style={{ backgroundColor: theme.colors.background }}
                        title="Background"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-zinc-600"
                        style={{ backgroundColor: theme.colors.surface }}
                        title="Surface"
                      />
                    </div>
                  </div>
                  
                  {currentTheme === theme.id && (
                    <div className="text-flame text-sm">✓</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-700">
            <div className="text-xs text-zinc-400">
              💡 Themes are automatically saved and will persist across sessions
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
