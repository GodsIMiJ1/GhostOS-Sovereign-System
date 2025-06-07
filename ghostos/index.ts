/**
 * 🔥 GHOSTOS - SOVEREIGN IGNITION RUNTIME 🔥
 *
 * The central runtime that initializes and orchestrates the entire GhostOS ecosystem.
 * This is the heart of the Empire's digital backbone.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import { OmniRelay } from './core/OmniRelay.js';
import { GhostApp, SimpleGhostApp } from './core/GhostApp.js';
import { AppManager } from './core/AppManager.js';
import { FlameCLI } from './cli/FlameCLI.js';
import { GhostTask } from './apps/GhostTask.js';
import { GhostVault } from './apps/GhostVault.js';
import { GhostMail } from './apps/GhostMail.js';

export class GhostOS {
  private relay: OmniRelay;
  private cli: FlameCLI;
  private appManager: AppManager;
  private apps: Map<string, GhostApp> = new Map();
  private isInitialized: boolean = false;
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
    this.log('🔥 GhostOS initialization sequence beginning...', 'system');

    // Initialize core components
    this.relay = new OmniRelay();
    this.appManager = new AppManager(this.relay);
    this.cli = new FlameCLI();

    // Connect CLI to relay
    this.cli.connectRelay(this.relay);

    this.log('Core components initialized', 'success');
  }

  /**
   * Initialize GhostOS and start all systems
   */
  async init(): Promise<void> {
    try {
      this.log('🔥 GHOSTOS IGNITION SEQUENCE INITIATED 🔥', 'system');

      // Register system signal handlers
      this.setupSystemSignals();

      // Load and register enhanced legacy GhostApps
      await this.loadEnhancedLegacyApps();

      // Initialize plugins system
      await this.initializePlugins();

      // Start CLI interface
      this.startCLI();

      this.isInitialized = true;
      this.log('🔥 GHOSTOS FULLY OPERATIONAL - THE EMPIRE RISES 🔥', 'system');

      // Send system ready signal
      this.relay.broadcast('ghostos_ready', {
        version: '0.1.0',
        uptime: this.getUptime(),
        apps: Array.from(this.apps.keys())
      });

    } catch (error) {
      this.log(`Failed to initialize GhostOS: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Shutdown GhostOS gracefully
   */
  async shutdown(): Promise<void> {
    this.log('🔥 GhostOS shutdown sequence initiated...', 'system');

    try {
      // Shutdown all apps
      for (const [name, app] of this.apps) {
        this.log(`Shutting down ${name}...`, 'info');
        await app.shutdown();
      }

      // Stop CLI
      this.cli.stop();

      this.log('🔥 GhostOS shutdown complete', 'system');
    } catch (error) {
      this.log(`Error during shutdown: ${error}`, 'error');
    }
  }

  /**
   * Register a GhostApp with the system (legacy compatibility)
   */
  registerApp(app: GhostApp): boolean {
    const config = app.getConfig();

    if (this.apps.has(config.name)) {
      this.log(`App ${config.name} already registered`, 'warning');
      return false;
    }

    this.apps.set(config.name, app);

    // Register with OmniRelay for legacy compatibility
    const success = this.relay.registerApp(config.name, app, config);

    if (success) {
      this.log(`GhostApp registered: ${config.name}`, 'success');
    }

    return success;
  }

  /**
   * Create a simple app for legacy compatibility
   */
  private createSimpleApp(name: string, description: string): SimpleGhostApp {
    const app = new SimpleGhostApp({
      name,
      version: '0.1.0',
      description,
      autoStart: true,
      sovereign: true
    });

    // Add basic signal handlers for legacy apps
    this.addLegacyAppHandlers(app);

    return app;
  }

  /**
   * Get system status
   */
  getStatus(): any {
    const appManagerStats = this.appManager.getStats();

    return {
      version: '0.1.0',
      uptime: this.getUptime(),
      initialized: this.isInitialized,
      apps: {
        total: appManagerStats.totalApps,
        running: appManagerStats.runningApps,
        failed: appManagerStats.failedApps,
        pending: appManagerStats.pendingApps,
        list: Array.from(this.apps.keys())
      },
      relay: {
        registered: this.relay.getRegistry().size,
        signals: this.relay.getSignalHistory().length
      },
      appManager: appManagerStats
    };
  }

  /**
   * Get uptime in seconds
   */
  getUptime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  private async loadEnhancedLegacyApps(): Promise<void> {
    this.log('Loading enhanced legacy GhostApps...', 'info');

    // Create sophisticated app instances
    const enhancedApps = [
      {
        name: 'GhostTask',
        factory: () => new GhostTask(),
        description: 'Advanced task management and automation system'
      },
      {
        name: 'GhostVault',
        factory: () => new GhostVault(),
        description: 'Secure encrypted data storage and retrieval system'
      },
      {
        name: 'GhostMail',
        factory: () => new GhostMail(),
        description: 'Email processing and communication hub'
      },
      {
        name: 'GhostComm',
        factory: () => this.createSimpleApp('GhostComm', 'Inter-system communication protocol'),
        description: 'Inter-system communication protocol'
      },
      {
        name: 'GhostPulse',
        factory: () => this.createSimpleApp('GhostPulse', 'System monitoring and health checks'),
        description: 'System monitoring and health checks'
      },
      {
        name: 'GhostGate',
        factory: () => this.createSimpleApp('GhostGate', 'Access control and security gateway'),
        description: 'Access control and security gateway'
      }
    ];

    for (const appConfig of enhancedApps) {
      const appInstance = appConfig.factory();

      // Install app using AppManager
      await this.appManager.installApp(appConfig.name, appInstance, {
        autoStart: true,
        overwrite: true
      });

      // Keep reference for legacy compatibility
      this.apps.set(appConfig.name, appInstance);
    }

    // Start all auto-start apps
    await this.appManager.startAutoStartApps();

    this.log(`Loaded ${enhancedApps.length} enhanced legacy GhostApps`, 'success');
  }

  private addLegacyAppHandlers(app: SimpleGhostApp): void {
    const appName = app.getConfig().name;

    // Add ping handler
    app.addSignalHandler('ping', (payload: any) => {
      app['log'](`Ping received from ${payload.source || 'unknown'}`, 'info');
    });

    // Add status handler
    app.addSignalHandler('status_request', (payload: any) => {
      const status = app.getStatus();
      app['log'](`Status: ${JSON.stringify(status)}`, 'info');
    });

    // Add app-specific handlers based on name
    switch (appName) {
      case 'GhostTask':
        app.addSignalHandler('task_create', (payload: any) => {
          app['log'](`Task creation request: ${JSON.stringify(payload)}`, 'info');
        });
        break;
      case 'GhostVault':
        app.addSignalHandler('vault_store', (payload: any) => {
          app['log'](`Vault storage request: ${payload.key}`, 'info');
        });
        break;
      case 'GhostMail':
        app.addSignalHandler('mail_send', (payload: any) => {
          app['log'](`Mail send request: ${payload.to}`, 'info');
        });
        break;
      case 'GhostPulse':
        app.addSignalHandler('health_check', (payload: any) => {
          app['log'](`Health check initiated`, 'info');
        });
        break;
    }
  }

  private async initializePlugins(): Promise<void> {
    this.log('Initializing plugin system...', 'info');
    // Plugin system will be implemented in Phase III
    this.log('Plugin system ready (placeholder)', 'success');
  }

  private startCLI(): void {
    this.log('Starting FlameCLI interface...', 'info');

    // Start CLI in background
    setTimeout(() => {
      this.cli.start();
    }, 1000);
  }

  private setupSystemSignals(): void {
    // Handle process signals
    process.on('SIGINT', async () => {
      this.log('Received SIGINT, initiating graceful shutdown...', 'warning');
      await this.shutdown();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      this.log('Received SIGTERM, initiating graceful shutdown...', 'warning');
      await this.shutdown();
      process.exit(0);
    });

    // Add OmniRelay system signal handlers
    this.relay.addListener('system_shutdown', async () => {
      await this.shutdown();
    });

    this.relay.addListener('system_restart', async () => {
      this.log('System restart requested...', 'warning');
      await this.shutdown();
      await this.init();
    });
  }

  private log(message: string, level: 'info' | 'warning' | 'error' | 'success' | 'system' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = level === 'system' ? '🔥' : level === 'success' ? '✅' : level === 'error' ? '❌' : level === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} [GhostOS ${timestamp}]: ${message}`);
  }
}

// Main entry point
async function main() {
  const ghostOS = new GhostOS();

  try {
    await ghostOS.init();
  } catch (error) {
    console.error('🔥 CRITICAL: GhostOS failed to initialize:', error);
    process.exit(1);
  }
}

// Auto-start if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export * from './core/index.js';
