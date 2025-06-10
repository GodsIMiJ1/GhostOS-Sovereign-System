/**
 * 🔥 APP MANAGER - ENHANCED APP LIFECYCLE MANAGEMENT 🔥
 *
 * The sovereign app management system that handles installation,
 * updates, dependencies, and lifecycle for all GhostApps.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import { AppRegistry, AppRegistryEntry } from '../config/AppRegistry.js';
import { OmniRelay } from './OmniRelay.js';
import { GhostApp } from './GhostApp.js';

export interface AppInstallOptions {
  autoStart?: boolean;
  overwrite?: boolean;
  skipDependencies?: boolean;
}

export interface AppManagerStats {
  totalApps: number;
  runningApps: number;
  failedApps: number;
  pendingApps: number;
  memoryUsage: number;
  uptime: number;
}

export class AppManager {
  private registry: AppRegistry;
  private relay: OmniRelay;
  private runningApps: Map<string, GhostApp> = new Map();
  private appFactories: Map<string, () => GhostApp> = new Map();
  private startTime: number;

  constructor(relay: OmniRelay, registryPath?: string) {
    this.relay = relay;
    this.registry = new AppRegistry(registryPath);
    this.startTime = Date.now();

    this.setupSignalHandlers();
    this.log('AppManager initialized', 'success');
  }

  /**
   * Register an app factory for dynamic loading
   */
  registerAppFactory(appName: string, factory: () => GhostApp): void {
    this.appFactories.set(appName, factory);
    this.log(`App factory registered: ${appName}`, 'info');
  }

  /**
   * Install an app into the registry
   */
  async installApp(
    appName: string,
    appInstance: GhostApp,
    options: AppInstallOptions = {}
  ): Promise<boolean> {
    try {
      const config = appInstance.getConfig();

      // Check if app already exists
      const existing = this.registry.getApp(appName);
      if (existing && !options.overwrite) {
        throw new Error(`App ${appName} already installed. Use overwrite option to replace.`);
      }

      // Create registry entry
      const registryEntry: Omit<AppRegistryEntry, 'installDate' | 'lastUpdate'> = {
        name: config.name,
        version: config.version,
        description: config.description,
        author: 'Ghost King Melekzedek',
        category: 'legacy',
        status: 'installed',
        autoStart: options.autoStart ?? config.autoStart ?? false,
        sovereign: config.sovereign ?? false,
        dependencies: config.dependencies ?? [],
        permissions: config.permissions ?? [],
        config: {},
        dataPath: `./ghostos/data/apps/${appName}`,
        entryPoint: `./ghostos/apps/${appName}.js`
      };

      // Register in registry
      if (!this.registry.registerApp(registryEntry)) {
        throw new Error(`Failed to register app in registry`);
      }

      // Register factory for future loading
      this.registerAppFactory(appName, () => appInstance);

      // Auto-start if requested
      if (registryEntry.autoStart) {
        await this.startApp(appName);
      }

      this.log(`App installed: ${appName} v${config.version}`, 'success');
      this.relay.broadcast('app_installed', { name: appName, version: config.version });

      return true;
    } catch (error) {
      this.log(`Failed to install app ${appName}: ${error}`, 'error');
      return false;
    }
  }

  /**
   * Start an app
   */
  async startApp(appName: string): Promise<boolean> {
    try {
      // Check if already running
      if (this.runningApps.has(appName)) {
        this.log(`App ${appName} is already running`, 'warning');
        return true;
      }

      // Get registry entry
      const registryEntry = this.registry.getApp(appName);
      if (!registryEntry) {
        throw new Error(`App ${appName} not found in registry`);
      }

      if (registryEntry.status !== 'installed') {
        throw new Error(`App ${appName} is not in installed state`);
      }

      // Start dependencies first
      for (const dep of registryEntry.dependencies) {
        if (!this.runningApps.has(dep)) {
          this.log(`Starting dependency: ${dep}`, 'info');
          await this.startApp(dep);
        }
      }

      // Create app instance
      const factory = this.appFactories.get(appName);
      if (!factory) {
        throw new Error(`No factory registered for app ${appName}`);
      }

      const appInstance = factory();

      // Initialize the app
      await appInstance.init();

      // Register with OmniRelay
      this.relay.registerApp(appName, appInstance, registryEntry);

      // Track running app
      this.runningApps.set(appName, appInstance);

      this.log(`App started: ${appName}`, 'success');
      this.relay.broadcast('app_started', { name: appName });

      return true;
    } catch (error) {
      this.log(`Failed to start app ${appName}: ${error}`, 'error');
      this.registry.updateApp(appName, { status: 'error' });
      return false;
    }
  }

  /**
   * Stop an app
   */
  async stopApp(appName: string): Promise<boolean> {
    try {
      const appInstance = this.runningApps.get(appName);
      if (!appInstance) {
        this.log(`App ${appName} is not running`, 'warning');
        return true;
      }

      // Check for dependents
      const dependents = this.getDependents(appName);
      if (dependents.length > 0) {
        this.log(`Stopping dependents first: ${dependents.join(', ')}`, 'info');
        for (const dependent of dependents) {
          await this.stopApp(dependent);
        }
      }

      // Shutdown the app
      await appInstance.shutdown();

      // Remove from tracking
      this.runningApps.delete(appName);

      this.log(`App stopped: ${appName}`, 'success');
      this.relay.broadcast('app_stopped', { name: appName });

      return true;
    } catch (error) {
      this.log(`Failed to stop app ${appName}: ${error}`, 'error');
      return false;
    }
  }

  /**
   * Restart an app
   */
  async restartApp(appName: string): Promise<boolean> {
    this.log(`Restarting app: ${appName}`, 'info');

    const wasRunning = this.runningApps.has(appName);

    if (wasRunning) {
      await this.stopApp(appName);
    }

    return await this.startApp(appName);
  }

  /**
   * Uninstall an app
   */
  async uninstallApp(appName: string): Promise<boolean> {
    try {
      // Stop if running
      if (this.runningApps.has(appName)) {
        await this.stopApp(appName);
      }

      // Remove from registry
      if (!this.registry.unregisterApp(appName)) {
        throw new Error(`Failed to unregister app from registry`);
      }

      // Remove factory
      this.appFactories.delete(appName);

      this.log(`App uninstalled: ${appName}`, 'success');
      this.relay.broadcast('app_uninstalled', { name: appName });

      return true;
    } catch (error) {
      this.log(`Failed to uninstall app ${appName}: ${error}`, 'error');
      return false;
    }
  }

  /**
   * Start all auto-start apps
   */
  async startAutoStartApps(): Promise<void> {
    const autoStartApps = this.registry.getAutoStartApps();
    const loadOrder = this.registry.getLoadOrder(autoStartApps.map(app => app.name));

    this.log(`Starting ${autoStartApps.length} auto-start apps in dependency order`, 'info');

    for (const appName of loadOrder) {
      await this.startApp(appName);
    }
  }

  /**
   * Get running app instance
   */
  getRunningApp(appName: string): GhostApp | null {
    return this.runningApps.get(appName) || null;
  }

  /**
   * Get all running apps
   */
  getRunningApps(): Map<string, GhostApp> {
    return new Map(this.runningApps);
  }

  /**
   * Get app manager statistics
   */
  getStats(): AppManagerStats {
    const registryStats = this.registry.getStats();

    return {
      totalApps: registryStats.total,
      runningApps: this.runningApps.size,
      failedApps: registryStats.byStatus.error || 0,
      pendingApps: registryStats.byStatus.pending || 0,
      memoryUsage: process.memoryUsage().heapUsed,
      uptime: Date.now() - this.startTime
    };
  }

  /**
   * Get apps that depend on the given app
   */
  private getDependents(appName: string): string[] {
    const dependents: string[] = [];

    for (const [name, app] of this.runningApps) {
      const config = app.getConfig();
      if (config.dependencies?.includes(appName)) {
        dependents.push(name);
      }
    }

    return dependents;
  }

  /**
   * Setup signal handlers for app management
   */
  private setupSignalHandlers(): void {
    this.relay.addListener('app_start_request', async (signal: any) => {
      const { appName } = signal.payload;
      await this.startApp(appName);
    });

    this.relay.addListener('app_stop_request', async (signal: any) => {
      const { appName } = signal.payload;
      await this.stopApp(appName);
    });

    this.relay.addListener('app_restart_request', async (signal: any) => {
      const { appName } = signal.payload;
      await this.restartApp(appName);
    });

    this.relay.addListener('app_manager_stats_request', (signal: any) => {
      const stats = this.getStats();
      this.relay.broadcast('app_manager_stats_response', stats);
    });
  }

  private log(message: string, level: 'info' | 'warning' | 'error' | 'success' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = level === 'success' ? '✅' : level === 'error' ? '❌' : level === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} [AppManager ${timestamp}]: ${message}`);
  }
}
