/**
 * 🔥 GHOSTOS PLUGIN REGISTRY - SOVEREIGN PLUGIN SYSTEM 🔥
 *
 * Central registry for all GhostOS plugins with monetization support,
 * status tracking, and dynamic loading capabilities.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

export interface GhostPlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  category: 'communication' | 'security' | 'productivity' | 'ai' | 'system' | 'entertainment';
  status: 'free' | 'locked' | 'tiered' | 'premium';
  price?: number;
  tier?: 'basic' | 'pro' | 'enterprise';
  icon: string;
  color: string;
  installed: boolean;
  enabled: boolean;
  featured: boolean;
  permissions: string[];
  dependencies: string[];
  screenshots: string[];
  changelog: string[];
  downloadCount: number;
  rating: number;
  reviews: number;
  lastUpdated: string;
  minVersion: string;
  maxVersion?: string;
  tags: string[];
  website?: string;
  github?: string;
  support?: string;
}

export const GHOST_PLUGINS: GhostPlugin[] = [
  {
    id: 'ghostcomm',
    name: 'GhostComm',
    description: 'Advanced inter-system communication protocol with real-time messaging, signal routing, and sovereign network capabilities.',
    version: '0.1.0',
    author: 'Ghost King Melekzedek',
    category: 'communication',
    status: 'free',
    icon: '📡',
    color: '#00d4ff',
    installed: true,
    enabled: true,
    featured: true,
    permissions: ['network', 'signals', 'broadcast'],
    dependencies: [],
    screenshots: ['/screenshots/ghostcomm-1.png', '/screenshots/ghostcomm-2.png'],
    changelog: ['Initial release with OmniRelay integration'],
    downloadCount: 1247,
    rating: 4.8,
    reviews: 23,
    lastUpdated: '2024-01-15',
    minVersion: '0.1.0',
    tags: ['communication', 'networking', 'real-time'],
    github: 'https://github.com/GhostOS/GhostComm'
  },
  {
    id: 'ghostvault',
    name: 'GhostVault',
    description: 'Military-grade encrypted data storage and retrieval system with sovereign access control and flame-blessed security.',
    version: '0.1.0',
    author: 'Ghost King Melekzedek',
    category: 'security',
    status: 'free',
    icon: '🔐',
    color: '#9333ea',
    installed: true,
    enabled: true,
    featured: true,
    permissions: ['storage', 'encryption', 'access-control'],
    dependencies: [],
    screenshots: ['/screenshots/ghostvault-1.png', '/screenshots/ghostvault-2.png'],
    changelog: ['Initial release with AES-256 encryption'],
    downloadCount: 892,
    rating: 4.9,
    reviews: 18,
    lastUpdated: '2024-01-15',
    minVersion: '0.1.0',
    tags: ['security', 'encryption', 'storage'],
    github: 'https://github.com/GhostOS/GhostVault'
  },
  {
    id: 'ghostmail',
    name: 'GhostMail',
    description: 'Intelligent email processing and communication hub with AI-powered filtering, templates, and sovereign delivery.',
    version: '0.1.0',
    author: 'Ghost King Melekzedek',
    category: 'communication',
    status: 'free',
    icon: '📧',
    color: '#10b981',
    installed: true,
    enabled: true,
    featured: false,
    permissions: ['email', 'templates', 'ai-processing'],
    dependencies: [],
    screenshots: ['/screenshots/ghostmail-1.png'],
    changelog: ['Initial release with template system'],
    downloadCount: 634,
    rating: 4.6,
    reviews: 12,
    lastUpdated: '2024-01-15',
    minVersion: '0.1.0',
    tags: ['email', 'communication', 'ai'],
    github: 'https://github.com/GhostOS/GhostMail'
  },
  {
    id: 'ghost-augmenth',
    name: 'Ghost Augmenth',
    description: 'Advanced AI integration plugin with Augment compatibility, deployment automation, and sovereign reflection logging.',
    version: '0.1.0',
    author: 'Ghost King Melekzedek',
    category: 'ai',
    status: 'tiered',
    price: 29.99,
    tier: 'pro',
    icon: '🤖',
    color: '#f59e0b',
    installed: true,
    enabled: true,
    featured: true,
    permissions: ['ai', 'deployment', 'reflection', 'augment-api'],
    dependencies: [],
    screenshots: ['/screenshots/augmenth-1.png', '/screenshots/augmenth-2.png'],
    changelog: ['Pro tier with advanced AI features', 'Deployment automation'],
    downloadCount: 2156,
    rating: 4.9,
    reviews: 47,
    lastUpdated: '2024-01-15',
    minVersion: '0.1.0',
    tags: ['ai', 'augment', 'automation', 'deployment'],
    website: 'https://augment.dev',
    github: 'https://github.com/GhostOS/GhostAugmenth'
  },
  {
    id: 'omari-ai',
    name: 'Omari AI Assistant',
    description: 'Local AI assistant powered by Ollama with sovereign intelligence, contextual awareness, and flame-blessed responses.',
    version: '0.2.0',
    author: 'Empire AI Division',
    category: 'ai',
    status: 'free',
    icon: '🧠',
    color: '#ef4444',
    installed: true,
    enabled: true,
    featured: true,
    permissions: ['ai', 'ollama', 'context', 'learning'],
    dependencies: ['ollama'],
    screenshots: ['/screenshots/omari-1.png', '/screenshots/omari-2.png'],
    changelog: ['Ollama integration', 'Context awareness', 'Local model support', 'Streaming responses', 'Model switching'],
    downloadCount: 3421,
    rating: 4.7,
    reviews: 89,
    lastUpdated: '2024-01-20',
    minVersion: '0.1.0',
    tags: ['ai', 'assistant', 'ollama', 'local'],
    website: 'https://omari.ai'
  },
  {
    id: 'flame-guard',
    name: 'Flame Guard',
    description: 'Advanced security suite with intrusion detection, flame token management, and sovereign access control.',
    version: '1.0.0',
    author: 'Security Division',
    category: 'security',
    status: 'locked',
    price: 19.99,
    icon: '🛡️',
    color: '#dc2626',
    installed: false,
    enabled: false,
    featured: false,
    permissions: ['security', 'tokens', 'monitoring', 'access-control'],
    dependencies: [],
    screenshots: ['/screenshots/flameguard-1.png'],
    changelog: ['Initial security suite release'],
    downloadCount: 567,
    rating: 4.5,
    reviews: 8,
    lastUpdated: '2024-01-10',
    minVersion: '0.1.0',
    tags: ['security', 'protection', 'monitoring']
  },
  {
    id: 'writeos-scribe-terminal',
    name: 'GhostWriteOS',
    description: 'Sovereign scroll writing terminal powered by the Sacred Scribe AI with flame-blessed document creation and NODE seal authentication.',
    version: '1.0.0',
    author: 'Ghost King Melekzedek',
    category: 'productivity',
    status: 'free',
    icon: '📝',
    color: '#10b981',
    installed: true,
    enabled: true,
    featured: true,
    permissions: ['writing', 'ai', 'export', 'templates'],
    dependencies: [],
    screenshots: ['/screenshots/writeos-1.png', '/screenshots/writeos-2.png'],
    changelog: ['Sacred Scribe AI integration', 'NODE seal authentication', 'Template system', 'PDF export with watermarks'],
    downloadCount: 1847,
    rating: 4.9,
    reviews: 34,
    lastUpdated: '2024-01-20',
    minVersion: '0.1.0',
    tags: ['writing', 'sovereign', 'scribe', 'flame', 'documents', 'ai'],
    website: 'https://writeos.dev',
    github: 'https://github.com/GhostOS/WriteOS'
  }
];

export const getPluginById = (id: string): GhostPlugin | undefined => {
  return GHOST_PLUGINS.find(plugin => plugin.id === id);
};

export const getInstalledPlugins = (): GhostPlugin[] => {
  return GHOST_PLUGINS.filter(plugin => plugin.installed);
};

export const getEnabledPlugins = (): GhostPlugin[] => {
  return GHOST_PLUGINS.filter(plugin => plugin.installed && plugin.enabled);
};

export const getFeaturedPlugins = (): GhostPlugin[] => {
  return GHOST_PLUGINS.filter(plugin => plugin.featured);
};

export const getPluginsByCategory = (category: GhostPlugin['category']): GhostPlugin[] => {
  return GHOST_PLUGINS.filter(plugin => plugin.category === category);
};

export const getAvailablePlugins = (): GhostPlugin[] => {
  return GHOST_PLUGINS.filter(plugin => !plugin.installed);
};

export const PLUGIN_CATEGORIES = [
  { id: 'all', name: 'All Plugins', icon: '🔥' },
  { id: 'communication', name: 'Communication', icon: '📡' },
  { id: 'security', name: 'Security', icon: '🔐' },
  { id: 'productivity', name: 'Productivity', icon: '⚡' },
  { id: 'ai', name: 'AI & Intelligence', icon: '🧠' },
  { id: 'system', name: 'System', icon: '⚙️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮' }
] as const;
