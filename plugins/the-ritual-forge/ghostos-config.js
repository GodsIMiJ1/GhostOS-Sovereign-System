// ghostos-config.js
// Unified config for GhostOS design tokens and system branding

const ghostOSConfig = {
  theme: {
    colors: {
      background: '#0a0a0a',
      surface: '#121212',
      glass: 'rgba(255, 255, 255, 0.05)',
      line: 'rgba(255, 255, 255, 0.1)',
      text: '#e5e5e5',
      subtext: '#888888',
      border: 'rgba(255, 255, 255, 0.15)',
      accent: {
        orange: '#ff5e00',
        blue: '#00ffff',
        purple: '#a471ff'
      }
    },
    fonts: {
      body: 'Fira Code, monospace',
      heading: 'Fira Code, monospace'
    },
    radii: {
      base: '14px',
      button: '10px'
    },
    shadows: {
      soft: '0 0 10px rgba(255, 255, 255, 0.05)',
      glow: '0 0 20px #ff5e00',
      neon: '0 0 15px #a471ff, 0 0 30px #ff5e00'
    },
    animations: {
      pulse: 'pulse 2s infinite',
      flicker: 'flicker 1.5s infinite',
      glitch: 'glitch 1s infinite'
    }
  },

  system: {
    name: 'GhostOS',
    version: '1.0.0',
    poweredBy: 'GodsIMiJ Flame Protocols',
    aiHost: 'Omari — Overseer of Intelligence',
    defaultModel: 'ghost-ryan',
    ui: {
      defaultLayout: 'glass-dark',
      enableGlow: true,
      flameVariantEnabled: true
    }
  }
};

export default ghostOSConfig;
