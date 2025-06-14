/**
 * 🔥 APP REGISTRY - PERSISTENT APP CONFIGURATION & DISCOVERY 🔥
 *
 * The sovereign registry system that manages app configurations,
 * dependencies, and lifecycle across the GhostOS ecosystem.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface AppRegistryEntry {
  name: string;
  version: string;
  description: string;
  author?: string;
  category: 'legacy' | 'plugin' | 'system' | 'user';
  status: 'installed' | 'disabled' | 'error' | 'pending';
  autoStart: boolean;
  sovereign: boolean;
  dependencies: string[];
  permissions: string[];
  config: Record<string, any>;
  installDate: string;
  lastUpdate: string;
  dataPath?: string;
  entryPoint?: string;
}

export interface AppDependency {
  name: string;
  version: string;
  required: boolean;
  type: 'app' | 'plugin' | 'system';
}

export class AppRegistry {
  private registryPath: string;
  private dataPath: string;
  private registry: Map<string, AppRegistryEntry> = new Map();
  private dependencyGraph: Map<string, string[]> = new Map();

  constructor(basePath: string = './ghostos/data') {
    this.dataPath = basePath;
    this.registryPath = join(basePath, 'app-registry.json');
    this.ensureDataDirectory();
    this.loadRegistry();
  }

  /**
   * Register a new app in the registry
   */
  registerApp(entry: Omit<AppRegistryEntry, 'installDate' | 'lastUpdate'>): boolean {
    try {
      const fullEntry: AppRegistryEntry = {
        ...entry,
        installDate: new Date().toISOString(),
        lastUpdate: new Date().toISOString()
      };

      // Validate dependencies
      if (!this.validateDependencies(entry.dependencies)) {
        throw new Error(`Dependency validation failed for ${entry.name}`);
      }

      this.registry.set(entry.name, fullEntry);
      this.updateDependencyGraph(entry.name, entry.dependencies);
      this.saveRegistry();

      this.log(`App registered: ${entry.name} v${entry.version}`, 'success');
      return true;
    } catch (error) {
      this.log(`Failed to register app ${entry.name}: ${error}`, 'error');
      return false;
    }
  }

  /**
   * Update an existing app registration
   */
  updateApp(name: string, updates: Partial<AppRegistryEntry>): boolean {
    try {
      const existing = this.registry.get(name);
      if (!existing) {
        throw new Error(`App ${name} not found in registry`);
      }

      const updated: AppRegistryEntry = {
        ...existing,
        ...updates,
        lastUpdate: new Date().toISOString()
      };

      this.registry.set(name, updated);
      this.saveRegistry();

      this.log(`App updated: ${name}`, 'success');
      return true;
    } catch (error) {
      this.log(`Failed to update app ${name}: ${error}`, 'error');
      return false;
    }
  }

  /**
   * Unregister an app from the registry
   */
  unregisterApp(name: string): boolean {
    try {
      if (!this.registry.has(name)) {
        throw new Error(`App ${name} not found in registry`);
      }

      // Check for dependents
      const dependents = this.getDependents(name);
      if (dependents.length > 0) {
        throw new Error(`Cannot unregister ${name}: required by ${dependents.join(', ')}`);
      }

      this.registry.delete(name);
      this.dependencyGraph.delete(name);
      this.saveRegistry();

      this.log(`App unregistered: ${name}`, 'success');
      return true;
    } catch (error) {
      this.log(`Failed to unregister app ${name}: ${error}`, 'error');
      return false;
    }
  }

  /**
   * Get app registration entry
   */
  getApp(name: string): AppRegistryEntry | null {
    return this.registry.get(name) || null;
  }

  /**
   * Get all registered apps
   */
  getAllApps(): AppRegistryEntry[] {
    return Array.from(this.registry.values());
  }

  /**
   * Get apps by category
   */
  getAppsByCategory(category: AppRegistryEntry['category']): AppRegistryEntry[] {
    return this.getAllApps().filter(app => app.category === category);
  }

  /**
   * Get apps that should auto-start
   */
  getAutoStartApps(): AppRegistryEntry[] {
    return this.getAllApps().filter(app => app.autoStart && app.status === 'installed');
  }

  /**
   * Get app dependencies in load order
   */
  getLoadOrder(appNames?: string[]): string[] {
    const apps = appNames || Array.from(this.registry.keys());
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const result: string[] = [];

    const visit = (name: string) => {
      if (visited.has(name)) return;
      if (visiting.has(name)) {
        throw new Error(`Circular dependency detected involving ${name}`);
      }

      visiting.add(name);
      const dependencies = this.dependencyGraph.get(name) || [];

      for (const dep of dependencies) {
        if (apps.includes(dep)) {
          visit(dep);
        }
      }

      visiting.delete(name);
      visited.add(name);
      result.push(name);
    };

    for (const app of apps) {
      visit(app);
    }

    return result;
  }

  /**
   * Validate app dependencies
   */
  validateDependencies(dependencies: string[]): boolean {
    for (const dep of dependencies) {
      const depApp = this.registry.get(dep);
      if (!depApp) {
        this.log(`Missing dependency: ${dep}`, 'warning');
        return false;
      }
      if (depApp.status !== 'installed') {
        this.log(`Dependency ${dep} is not installed`, 'warning');
        return false;
      }
    }
    return true;
  }

  /**
   * Get apps that depend on the given app
   */
  getDependents(appName: string): string[] {
    const dependents: string[] = [];

    for (const [name, deps] of this.dependencyGraph) {
      if (deps.includes(appName)) {
        dependents.push(name);
      }
    }

    return dependents;
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    total: number;
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
    autoStart: number;
    sovereign: number;
  } {
    const apps = this.getAllApps();
    const byCategory: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    apps.forEach(app => {
      byCategory[app.category] = (byCategory[app.category] || 0) + 1;
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;
    });

    return {
      total: apps.length,
      byCategory,
      byStatus,
      autoStart: apps.filter(app => app.autoStart).length,
      sovereign: apps.filter(app => app.sovereign).length
    };
  }

  /**
   * Export registry to JSON
   */
  exportRegistry(): string {
    const exportData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      apps: Array.from(this.registry.entries()).map(([name, entry]) => ({
        ...entry,
        name
      }))
    };
    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import registry from JSON
   */
  importRegistry(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (!data.apps || !Array.isArray(data.apps)) {
        throw new Error('Invalid registry format');
      }

      this.registry.clear();
      this.dependencyGraph.clear();

      for (const app of data.apps) {
        this.registry.set(app.name, app);
        this.updateDependencyGraph(app.name, app.dependencies || []);
      }

      this.saveRegistry();
      this.log('Registry imported successfully', 'success');
      return true;
    } catch (error) {
      this.log(`Failed to import registry: ${error}`, 'error');
      return false;
    }
  }

  private ensureDataDirectory(): void {
    if (!existsSync(this.dataPath)) {
      mkdirSync(this.dataPath, { recursive: true });
    }
  }

  private loadRegistry(): void {
    try {
      if (existsSync(this.registryPath)) {
        const data = readFileSync(this.registryPath, 'utf-8');
        const parsed = JSON.parse(data);

        if (parsed.apps && Array.isArray(parsed.apps)) {
          for (const app of parsed.apps) {
            this.registry.set(app.name, app);
            this.updateDependencyGraph(app.name, app.dependencies || []);
          }
        }

        this.log(`Loaded ${this.registry.size} apps from registry`, 'info');
      } else {
        this.log('No existing registry found, starting fresh', 'info');
      }
    } catch (error) {
      this.log(`Failed to load registry: ${error}`, 'error');
    }
  }

  private saveRegistry(): void {
    try {
      const data = this.exportRegistry();
      writeFileSync(this.registryPath, data, 'utf-8');
    } catch (error) {
      this.log(`Failed to save registry: ${error}`, 'error');
    }
  }

  private updateDependencyGraph(appName: string, dependencies: string[]): void {
    this.dependencyGraph.set(appName, dependencies);
  }

  private log(message: string, level: 'info' | 'warning' | 'error' | 'success' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = level === 'success' ? '✅' : level === 'error' ? '❌' : level === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} [AppRegistry ${timestamp}]: ${message}`);
  }
}
