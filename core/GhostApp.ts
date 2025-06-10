/**
 * 🔥 GHOSTAPP - THE MODULAR APP BASE INTERFACE 🔥
 * 
 * The foundational interface that all GhostApps must implement to be
 * compatible with the GhostOS ecosystem and OmniRelay routing system.
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import { GhostSignal } from './OmniRelay.js';

export interface GhostAppConfig {
  name: string;
  version: string;
  description: string;
  dependencies?: string[];
  permissions?: string[];
  autoStart?: boolean;
  sovereign?: boolean; // Flame-compatible apps have sovereign status
}

export interface GhostAppStatus {
  name: string;
  status: 'initializing' | 'active' | 'inactive' | 'error' | 'maintenance';
  uptime: number;
  lastActivity: string;
  memoryUsage?: number;
  signalsProcessed: number;
}

export abstract class GhostApp {
  protected config: GhostAppConfig;
  protected status: GhostAppStatus;
  protected startTime: number;
  protected signalCount: number = 0;

  constructor(config: GhostAppConfig) {
    this.config = config;
    this.startTime = Date.now();
    this.status = {
      name: config.name,
      status: 'initializing',
      uptime: 0,
      lastActivity: new Date().toISOString(),
      signalsProcessed: 0
    };

    this.log(`GhostApp ${config.name} constructed`, 'info');
  }

  /**
   * Initialize the GhostApp - called by OmniRelay during registration
   */
  async init(): Promise<void> {
    try {
      this.log(`Initializing ${this.config.name}...`, 'info');
      this.status.status = 'initializing';
      
      await this.onInit();
      
      this.status.status = 'active';
      this.log(`${this.config.name} initialized successfully`, 'success');
    } catch (error) {
      this.status.status = 'error';
      this.log(`Failed to initialize ${this.config.name}: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Shutdown the GhostApp gracefully
   */
  async shutdown(): Promise<void> {
    try {
      this.log(`Shutting down ${this.config.name}...`, 'info');
      this.status.status = 'inactive';
      
      await this.onShutdown();
      
      this.log(`${this.config.name} shutdown complete`, 'info');
    } catch (error) {
      this.log(`Error during shutdown of ${this.config.name}: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * Handle incoming signals from OmniRelay
   */
  onSignal(signalType: string, payload: any, signal?: GhostSignal): void {
    try {
      this.signalCount++;
      this.status.signalsProcessed = this.signalCount;
      this.status.lastActivity = new Date().toISOString();
      this.status.uptime = Date.now() - this.startTime;

      // Handle core system signals
      switch (signalType) {
        case 'heartbeat':
          this.handleHeartbeat(payload, signal);
          break;
        case 'status_request':
          this.handleStatusRequest(payload, signal);
          break;
        case 'shutdown':
          this.shutdown();
          break;
        case 'restart':
          this.restart();
          break;
        default:
          // Route to app-specific signal handler
          this.handleSignal(signalType, payload, signal);
      }
    } catch (error) {
      this.log(`Error handling signal ${signalType}: ${error}`, 'error');
      this.status.status = 'error';
    }
  }

  /**
   * Get current app status
   */
  getStatus(): GhostAppStatus {
    this.status.uptime = Date.now() - this.startTime;
    return { ...this.status };
  }

  /**
   * Get app configuration
   */
  getConfig(): GhostAppConfig {
    return { ...this.config };
  }

  /**
   * Restart the app
   */
  async restart(): Promise<void> {
    this.log(`Restarting ${this.config.name}...`, 'info');
    await this.shutdown();
    await this.init();
  }

  /**
   * Check if app is sovereign (Flame-compatible)
   */
  isSovereign(): boolean {
    return this.config.sovereign || false;
  }

  // Abstract methods that must be implemented by concrete GhostApps
  protected abstract onInit(): Promise<void>;
  protected abstract onShutdown(): Promise<void>;
  protected abstract handleSignal(signalType: string, payload: any, signal?: GhostSignal): void;

  // Core signal handlers
  private handleHeartbeat(payload: any, signal?: GhostSignal): void {
    // Respond to heartbeat with status
    this.log(`Heartbeat received - ${this.config.name} is alive`, 'debug');
  }

  private handleStatusRequest(payload: any, signal?: GhostSignal): void {
    // Return current status
    const status = this.getStatus();
    this.log(`Status requested: ${JSON.stringify(status)}`, 'debug');
  }

  protected log(message: string, level: 'info' | 'warning' | 'error' | 'success' | 'debug' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = level === 'success' ? '✅' : level === 'error' ? '❌' : level === 'warning' ? '⚠️' : level === 'debug' ? '🔍' : 'ℹ️';
    console.log(`${prefix} [${this.config.name} ${timestamp}]: ${message}`);
  }
}

/**
 * Simple GhostApp implementation for basic apps
 */
export class SimpleGhostApp extends GhostApp {
  private handlers: Map<string, Function> = new Map();

  constructor(config: GhostAppConfig) {
    super(config);
  }

  protected async onInit(): Promise<void> {
    // Default initialization - can be overridden
    this.log(`Simple GhostApp ${this.config.name} ready`, 'success');
  }

  protected async onShutdown(): Promise<void> {
    // Default shutdown - can be overridden
    this.handlers.clear();
  }

  protected handleSignal(signalType: string, payload: any, signal?: GhostSignal): void {
    const handler = this.handlers.get(signalType);
    if (handler) {
      handler(payload, signal);
    } else {
      this.log(`No handler for signal: ${signalType}`, 'debug');
    }
  }

  /**
   * Add a signal handler
   */
  addSignalHandler(signalType: string, handler: Function): void {
    this.handlers.set(signalType, handler);
    this.log(`Signal handler added for: ${signalType}`, 'debug');
  }

  /**
   * Remove a signal handler
   */
  removeSignalHandler(signalType: string): void {
    this.handlers.delete(signalType);
    this.log(`Signal handler removed for: ${signalType}`, 'debug');
  }
}
