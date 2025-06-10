/**
 * 🔥 PLUGIN MANAGER - MODULAR DOMINION ORCHESTRATOR 🔥
 * 
 * The sovereign plugin management system that handles dynamic loading,
 * lifecycle management, and orchestration of all GhostOS plugins.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { OmniRelay } from '../core/OmniRelay.js';
import { GhostApp } from '../core/GhostApp.js';

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  category: 'enhancement' | 'integration' | 'utility' | 'system';
  main: string;
  dependencies: string[];
  permissions: string[];
  autoStart: boolean;
  sovereign: boolean;
  api?: {
    endpoints?: string[];
    webhooks?: string[];
  };
  ui?: {
    dashboard?: boolean;
    settings?: boolean;
  };
  flame?: {
    rituals?: string[];
    scrolls?: string[];
  };
}

export interface PluginRegistration {
  manifest: PluginManifest;
  instance: GhostPlugin | null;
  status: 'installed' | 'loaded' | 'active' | 'inactive' | 'error';
  installDate: string;
  lastUpdate: string;
  dataPath: string;
}

export abstract class GhostPlugin extends GhostApp {
  protected manifest: PluginManifest;
  protected dataPath: string;

  constructor(manifest: PluginManifest) {
    super({
      name: manifest.name,
      version: manifest.version,
      description: manifest.description,
      dependencies: manifest.dependencies,
      permissions: manifest.permissions,
      autoStart: manifest.autoStart,
      sovereign: manifest.sovereign
    });
    
    this.manifest = manifest;
    this.dataPath = `./ghostos/data/plugins/${manifest.name}`;
  }

  /**
   * Get plugin manifest
   */
  getManifest(): PluginManifest {
    return { ...this.manifest };
  }

  /**
   * Get plugin data path
   */
  getDataPath(): string {
    return this.dataPath;
  }

  // Abstract methods for plugin lifecycle
  protected abstract onPluginInit(): Promise<void>;
  protected abstract onPluginShutdown(): Promise<void>;
  protected abstract onPluginActivate(): Promise<void>;
  protected abstract onPluginDeactivate(): Promise<void>;

  // Override GhostApp methods to include plugin-specific behavior
  protected async onInit(): Promise<void> {
    await this.onPluginInit();
  }

  protected async onShutdown(): Promise<void> {
    await this.onPluginShutdown();
  }

  /**
   * Activate plugin (start services, register endpoints, etc.)
   */
  async activate(): Promise<void> {
    try {
      await this.onPluginActivate();
      this.log(`Plugin ${this.manifest.name} activated`, 'success');
    } catch (error) {
      this.log(`Failed to activate plugin ${this.manifest.name}: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Deactivate plugin (stop services, unregister endpoints, etc.)
   */
  async deactivate(): Promise<void> {
    try {
      await this.onPluginDeactivate();
      this.log(`Plugin ${this.manifest.name} deactivated`, 'info');
    } catch (error) {
      this.log(`Failed to deactivate plugin ${this.manifest.name}: ${error}`, 'error');
      throw error;
    }
  }
}

export class PluginManager {
  private relay: OmniRelay;
  private pluginsPath: string;
  private plugins: Map<string, PluginRegistration> = new Map();
  private pluginFactories: Map<string, () => GhostPlugin> = new Map();

  constructor(relay: OmniRelay, pluginsPath: string = './ghostos/plugins') {
    this.relay = relay;
    this.pluginsPath = pluginsPath;
    
    this.setupSignalHandlers();
    this.log('PluginManager initialized', 'success');
  }

  /**
   * Discover and load all plugins from the plugins directory
   */
  async discoverPlugins(): Promise<void> {
    this.log('Discovering plugins...', 'info');
    
    if (!existsSync(this.pluginsPath)) {
      this.log('Plugins directory not found, creating...', 'warning');
      return;
    }

    const pluginDirs = readdirSync(this.pluginsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const pluginDir of pluginDirs) {
      await this.loadPlugin(pluginDir);
    }

    this.log(`Discovered ${this.plugins.size} plugins`, 'success');
  }

  /**
   * Load a specific plugin
   */
  async loadPlugin(pluginName: string): Promise<boolean> {
    try {
      const pluginPath = join(this.pluginsPath, pluginName);
      const manifestPath = join(pluginPath, 'plugin.config.json');

      if (!existsSync(manifestPath)) {
        this.log(`Plugin manifest not found: ${manifestPath}`, 'error');
        return false;
      }

      // Load and parse manifest
      const manifestData = readFileSync(manifestPath, 'utf-8');
      const manifest: PluginManifest = JSON.parse(manifestData);

      // Validate manifest
      if (!this.validateManifest(manifest)) {
        this.log(`Invalid plugin manifest: ${pluginName}`, 'error');
        return false;
      }

      // Create plugin registration
      const registration: PluginRegistration = {
        manifest,
        instance: null,
        status: 'installed',
        installDate: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
        dataPath: `./ghostos/data/plugins/${pluginName}`
      };

      this.plugins.set(pluginName, registration);
      this.log(`Plugin loaded: ${pluginName} v${manifest.version}`, 'success');

      return true;
    } catch (error) {
      this.log(`Failed to load plugin ${pluginName}: ${error}`, 'error');
      return false;
    }
  }

  /**
   * Register a plugin factory for dynamic instantiation
   */
  registerPluginFactory(pluginName: string, factory: () => GhostPlugin): void {
    this.pluginFactories.set(pluginName, factory);
    this.log(`Plugin factory registered: ${pluginName}`, 'info');
  }

  /**
   * Start a plugin
   */
  async startPlugin(pluginName: string): Promise<boolean> {
    try {
      const registration = this.plugins.get(pluginName);
      if (!registration) {
        throw new Error(`Plugin ${pluginName} not found`);
      }

      if (registration.instance) {
        this.log(`Plugin ${pluginName} is already running`, 'warning');
        return true;
      }

      // Get plugin factory
      const factory = this.pluginFactories.get(pluginName);
      if (!factory) {
        throw new Error(`No factory registered for plugin ${pluginName}`);
      }

      // Create plugin instance
      const pluginInstance = factory();
      
      // Initialize plugin
      await pluginInstance.init();
      
      // Activate plugin
      await pluginInstance.activate();
      
      // Register with OmniRelay
      this.relay.registerApp(pluginName, pluginInstance, registration.manifest);
      
      // Update registration
      registration.instance = pluginInstance;
      registration.status = 'active';
      
      this.log(`Plugin started: ${pluginName}`, 'success');
      this.relay.broadcast('plugin_started', { name: pluginName, manifest: registration.manifest });
      
      return true;
    } catch (error) {
      this.log(`Failed to start plugin ${pluginName}: ${error}`, 'error');
      const registration = this.plugins.get(pluginName);
      if (registration) {
        registration.status = 'error';
      }
      return false;
    }
  }

  /**
   * Stop a plugin
   */
  async stopPlugin(pluginName: string): Promise<boolean> {
    try {
      const registration = this.plugins.get(pluginName);
      if (!registration || !registration.instance) {
        this.log(`Plugin ${pluginName} is not running`, 'warning');
        return true;
      }

      // Deactivate plugin
      await registration.instance.deactivate();
      
      // Shutdown plugin
      await registration.instance.shutdown();
      
      // Update registration
      registration.instance = null;
      registration.status = 'installed';
      
      this.log(`Plugin stopped: ${pluginName}`, 'success');
      this.relay.broadcast('plugin_stopped', { name: pluginName });
      
      return true;
    } catch (error) {
      this.log(`Failed to stop plugin ${pluginName}: ${error}`, 'error');
      return false;
    }
  }

  /**
   * Get all plugins
   */
  getAllPlugins(): PluginRegistration[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugin by name
   */
  getPlugin(name: string): PluginRegistration | null {
    return this.plugins.get(name) || null;
  }

  /**
   * Get running plugins
   */
  getRunningPlugins(): PluginRegistration[] {
    return this.getAllPlugins().filter(plugin => plugin.status === 'active');
  }

  private validateManifest(manifest: PluginManifest): boolean {
    const required = ['name', 'version', 'description', 'author', 'main'];
    for (const field of required) {
      if (!manifest[field as keyof PluginManifest]) {
        this.log(`Missing required field in manifest: ${field}`, 'error');
        return false;
      }
    }
    return true;
  }

  private setupSignalHandlers(): void {
    this.relay.addListener('plugin_start_request', async (signal: any) => {
      const { pluginName } = signal.payload;
      await this.startPlugin(pluginName);
    });

    this.relay.addListener('plugin_stop_request', async (signal: any) => {
      const { pluginName } = signal.payload;
      await this.stopPlugin(pluginName);
    });

    this.relay.addListener('plugin_list_request', (signal: any) => {
      const plugins = this.getAllPlugins();
      this.relay.broadcast('plugin_list_response', { plugins });
    });
  }

  private log(message: string, level: 'info' | 'warning' | 'error' | 'success' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = level === 'success' ? '✅' : level === 'error' ? '❌' : level === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} [PluginManager ${timestamp}]: ${message}`);
  }
}
