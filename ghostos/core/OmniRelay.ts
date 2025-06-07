/**
 * 🔥 OMNIRELAY - THE INTELLIGENT ROUTING AND REGISTRATION HUB 🔥
 * 
 * The central nervous system of GhostOS that orchestrates all communication
 * between GhostApps, plugins, and system components.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

export interface GhostSignal {
  type: string;
  payload: any;
  source: string;
  target?: string;
  timestamp: string;
  id: string;
}

export interface GhostAppRegistration {
  instance: any;
  status: 'active' | 'inactive' | 'error' | 'initializing';
  timestamp: string;
  metadata: {
    version?: string;
    description?: string;
    dependencies?: string[];
  };
}

export class OmniRelay {
  private registry: Map<string, GhostAppRegistration> = new Map();
  private signalHistory: GhostSignal[] = [];
  private listeners: Map<string, Function[]> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.log("🔥 OmniRelay initializing...", 'system');
    this.initializeCore();
  }

  private initializeCore(): void {
    // Initialize core signal types
    this.addListener('heartbeat', this.handleHeartbeat.bind(this));
    this.addListener('app_register', this.handleAppRegister.bind(this));
    this.addListener('app_unregister', this.handleAppUnregister.bind(this));
    this.addListener('system_status', this.handleSystemStatus.bind(this));
    
    this.isInitialized = true;
    this.log("OmniRelay core initialized and ready", 'system');
    
    // Send initialization complete signal
    this.broadcast('system_ready', { relay: 'OmniRelay', timestamp: new Date().toISOString() });
  }

  /**
   * Register a GhostApp with the relay
   */
  registerApp(name: string, instance: any, metadata: any = {}): boolean {
    try {
      if (this.registry.has(name)) {
        this.log(`App ${name} already registered, updating...`, 'warning');
      }

      const registration: GhostAppRegistration = {
        instance,
        status: 'initializing',
        timestamp: new Date().toISOString(),
        metadata: {
          version: metadata.version || '0.1.0',
          description: metadata.description || `GhostApp: ${name}`,
          dependencies: metadata.dependencies || []
        }
      };

      this.registry.set(name, registration);
      
      // Initialize the app if it has an init method
      if (typeof instance.init === 'function') {
        instance.init();
      }

      registration.status = 'active';
      this.log(`App registered: ${name}`, 'success');
      
      // Broadcast registration event
      this.broadcast('app_registered', { name, metadata });
      
      return true;
    } catch (error) {
      this.log(`Failed to register app ${name}: ${error}`, 'error');
      return false;
    }
  }

  /**
   * Route signals to registered apps and listeners
   */
  route(signalType: string, payload: any, source: string = 'OmniRelay', target?: string): void {
    const signal: GhostSignal = {
      type: signalType,
      payload,
      source,
      target,
      timestamp: new Date().toISOString(),
      id: this.generateSignalId()
    };

    // Store in history
    this.signalHistory.push(signal);
    if (this.signalHistory.length > 1000) {
      this.signalHistory.shift(); // Keep only last 1000 signals
    }

    // Route to specific target if specified
    if (target && this.registry.has(target)) {
      this.routeToApp(target, signal);
      return;
    }

    // Broadcast to all registered apps
    this.registry.forEach((registration, appName) => {
      if (registration.status === 'active') {
        this.routeToApp(appName, signal);
      }
    });

    // Route to listeners
    this.routeToListeners(signalType, signal);
  }

  /**
   * Broadcast signal to all active apps
   */
  broadcast(signalType: string, payload: any): void {
    this.route(signalType, payload, 'OmniRelay');
  }

  /**
   * Add signal listener
   */
  addListener(signalType: string, callback: Function): void {
    if (!this.listeners.has(signalType)) {
      this.listeners.set(signalType, []);
    }
    this.listeners.get(signalType)!.push(callback);
  }

  /**
   * Get registry status
   */
  getRegistry(): Map<string, GhostAppRegistration> {
    return new Map(this.registry);
  }

  /**
   * Get signal history
   */
  getSignalHistory(limit: number = 100): GhostSignal[] {
    return this.signalHistory.slice(-limit);
  }

  /**
   * Get app status
   */
  getAppStatus(name: string): GhostAppRegistration | null {
    return this.registry.get(name) || null;
  }

  private routeToApp(appName: string, signal: GhostSignal): void {
    const registration = this.registry.get(appName);
    if (!registration) return;

    try {
      if (typeof registration.instance.onSignal === 'function') {
        registration.instance.onSignal(signal.type, signal.payload, signal);
      }
    } catch (error) {
      this.log(`Error routing signal to ${appName}: ${error}`, 'error');
      registration.status = 'error';
    }
  }

  private routeToListeners(signalType: string, signal: GhostSignal): void {
    const listeners = this.listeners.get(signalType);
    if (!listeners) return;

    listeners.forEach(callback => {
      try {
        callback(signal);
      } catch (error) {
        this.log(`Error in signal listener for ${signalType}: ${error}`, 'error');
      }
    });
  }

  private handleHeartbeat(signal: GhostSignal): void {
    // Respond to heartbeat signals
    this.log(`Heartbeat received from ${signal.source}`, 'debug');
  }

  private handleAppRegister(signal: GhostSignal): void {
    this.log(`App registration signal: ${JSON.stringify(signal.payload)}`, 'info');
  }

  private handleAppUnregister(signal: GhostSignal): void {
    const { name } = signal.payload;
    if (this.registry.has(name)) {
      this.registry.delete(name);
      this.log(`App unregistered: ${name}`, 'info');
    }
  }

  private handleSystemStatus(signal: GhostSignal): void {
    const status = {
      relay: 'OmniRelay',
      apps: Array.from(this.registry.keys()),
      activeApps: Array.from(this.registry.entries())
        .filter(([_, reg]) => reg.status === 'active')
        .map(([name, _]) => name),
      signalCount: this.signalHistory.length,
      uptime: process.uptime()
    };
    
    this.broadcast('system_status_response', status);
  }

  private generateSignalId(): string {
    return `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private log(message: string, level: 'info' | 'warning' | 'error' | 'success' | 'debug' | 'system' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = level === 'system' ? '🔥' : level === 'success' ? '✅' : level === 'error' ? '❌' : level === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} [OmniRelay ${timestamp}]: ${message}`);
  }
}
