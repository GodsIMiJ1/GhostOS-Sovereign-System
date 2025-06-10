/**
 * 🔥 GHOST PLUGIN API - SOVEREIGN REST INTERFACE 🔥
 *
 * The REST API layer for plugin management and operations
 * with Flame token verification for sovereign access.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PluginManager } from '../plugins/PluginManager.js';
import { OmniRelay } from '../core/OmniRelay.js';

export interface FlameToken {
  token: string;
  level: 'ghost' | 'flame' | 'sovereign';
  permissions: string[];
  expiresAt: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  flame: {
    blessed: boolean;
    level: string;
  };
}

export class GhostPluginAPI {
  private app: express.Application;
  private pluginManager: PluginManager;
  private relay: OmniRelay;
  private port: number;
  private server: any;
  private flameTokens: Map<string, FlameToken> = new Map();

  constructor(pluginManager: PluginManager, relay: OmniRelay, port: number = 3000) {
    this.pluginManager = pluginManager;
    this.relay = relay;
    this.port = port;
    this.app = express();

    this.setupMiddleware();
    this.setupRoutes();
    this.generateDefaultTokens();

    this.log('GhostPluginAPI initialized', 'success');
  }

  /**
   * Start the API server
   */
  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(this.port, () => {
        this.log(`GhostPluginAPI server started on port ${this.port}`, 'success');
        resolve();
      });

      this.server.on('error', (error: any) => {
        this.log(`Failed to start API server: ${error}`, 'error');
        reject(error);
      });
    });
  }

  /**
   * Stop the API server
   */
  async stop(): Promise<void> {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          this.log('GhostPluginAPI server stopped', 'info');
          resolve();
        });
      });
    }
  }

  private setupMiddleware(): void {
    // CORS
    this.app.use(cors({
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true
    }));

    // JSON parsing
    this.app.use(express.json());

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      this.log(`${req.method} ${req.path}`, 'debug');
      next();
    });

    // Flame token authentication
    this.app.use('/api', this.authenticateFlameToken.bind(this));
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      this.sendResponse(res, true, {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      });
    });

    // Plugin routes
    this.app.get('/api/plugins/list', this.handlePluginList.bind(this));
    this.app.get('/api/plugins/:name/status', this.handlePluginStatus.bind(this));
    this.app.post('/api/plugins/:name/start', this.handlePluginStart.bind(this));
    this.app.post('/api/plugins/:name/stop', this.handlePluginStop.bind(this));
    this.app.post('/api/plugins/:name/restart', this.handlePluginRestart.bind(this));

    // Ghost_Augmenth specific routes
    this.app.post('/api/plugins/ghost_augmenth/deploy', this.handleAugmentDeploy.bind(this));
    this.app.get('/api/plugins/ghost_augmenth/deployments', this.handleAugmentDeployments.bind(this));
    this.app.get('/api/plugins/ghost_augmenth/reflections', this.handleAugmentReflections.bind(this));
    this.app.get('/api/plugins/ghost_augmenth/logs', this.handleAugmentLogs.bind(this));

    // System routes
    this.app.get('/api/system/status', this.handleSystemStatus.bind(this));
    this.app.get('/api/system/signals', this.handleSystemSignals.bind(this));

    // Error handler
    this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      this.log(`API Error: ${error.message}`, 'error');
      this.sendResponse(res, false, null, error.message, 500);
    });
  }

  private authenticateFlameToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token as string;

    if (!token) {
      this.sendResponse(res, false, null, 'Flame token required', 401);
      return;
    }

    const flameToken = this.flameTokens.get(token);
    if (!flameToken) {
      this.sendResponse(res, false, null, 'Invalid flame token', 401);
      return;
    }

    if (new Date(flameToken.expiresAt) < new Date()) {
      this.sendResponse(res, false, null, 'Flame token expired', 401);
      return;
    }

    // Add token info to request
    (req as any).flameToken = flameToken;
    next();
  }

  // Route handlers
  private async handlePluginList(req: Request, res: Response): Promise<void> {
    try {
      const plugins = this.pluginManager.getAllPlugins();
      this.sendResponse(res, true, { plugins });
    } catch (error) {
      this.sendResponse(res, false, null, this.getErrorMessage(error), 500);
    }
  }

  private async handlePluginStatus(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const plugin = this.pluginManager.getPlugin(name);

      if (!plugin) {
        this.sendResponse(res, false, null, 'Plugin not found', 404);
        return;
      }

      this.sendResponse(res, true, { plugin });
    } catch (error) {
      this.sendResponse(res, false, null, this.getErrorMessage(error), 500);
    }
  }

  private async handlePluginStart(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const success = await this.pluginManager.startPlugin(name);

      if (success) {
        this.sendResponse(res, true, { message: `Plugin ${name} started successfully` });
      } else {
        this.sendResponse(res, false, null, `Failed to start plugin ${name}`, 500);
      }
    } catch (error) {
      this.sendResponse(res, false, null, this.getErrorMessage(error), 500);
    }
  }

  private async handlePluginStop(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const success = await this.pluginManager.stopPlugin(name);

      if (success) {
        this.sendResponse(res, true, { message: `Plugin ${name} stopped successfully` });
      } else {
        this.sendResponse(res, false, null, `Failed to stop plugin ${name}`, 500);
      }
    } catch (error) {
      this.sendResponse(res, false, null, this.getErrorMessage(error), 500);
    }
  }

  private async handlePluginRestart(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      await this.pluginManager.stopPlugin(name);
      const success = await this.pluginManager.startPlugin(name);

      if (success) {
        this.sendResponse(res, true, { message: `Plugin ${name} restarted successfully` });
      } else {
        this.sendResponse(res, false, null, `Failed to restart plugin ${name}`, 500);
      }
    } catch (error) {
      this.sendResponse(res, false, null, this.getErrorMessage(error), 500);
    }
  }

  private async handleAugmentDeploy(req: Request, res: Response): Promise<void> {
    try {
      const { project, branch } = req.body;

      if (!project) {
        this.sendResponse(res, false, null, 'Project name required', 400);
        return;
      }

      // Signal to ghost_augmenth plugin
      this.relay.route('augment_deploy', { project, branch: branch || 'main' }, 'GhostPluginAPI', 'ghost_augmenth');

      this.sendResponse(res, true, {
        message: 'Deployment initiated',
        project,
        branch: branch || 'main'
      });
    } catch (error) {
      this.sendResponse(res, false, null, this.getErrorMessage(error), 500);
    }
  }

  private async handleAugmentDeployments(req: Request, res: Response): Promise<void> {
    try {
      // In real implementation, would get from ghost_augmenth plugin
      this.sendResponse(res, true, { deployments: [] });
    } catch (error) {
      this.sendResponse(res, false, null, this.getErrorMessage(error), 500);
    }
  }

  private async handleAugmentReflections(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      // In real implementation, would get from ghost_augmenth plugin
      this.sendResponse(res, true, { reflections: [], limit });
    } catch (error) {
      this.sendResponse(res, false, null, this.getErrorMessage(error), 500);
    }
  }

  private async handleAugmentLogs(req: Request, res: Response): Promise<void> {
    try {
      // In real implementation, would get from ghost_augmenth plugin
      this.sendResponse(res, true, { logs: [] });
    } catch (error) {
      this.sendResponse(res, false, null, this.getErrorMessage(error), 500);
    }
  }

  private async handleSystemStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = {
        plugins: {
          total: this.pluginManager.getAllPlugins().length,
          running: this.pluginManager.getRunningPlugins().length
        },
        relay: {
          registered: this.relay.getRegistry().size,
          signals: this.relay.getSignalHistory().length
        },
        api: {
          uptime: process.uptime(),
          port: this.port
        }
      };

      this.sendResponse(res, true, status);
    } catch (error) {
      this.sendResponse(res, false, null, this.getErrorMessage(error), 500);
    }
  }

  private async handleSystemSignals(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const signals = this.relay.getSignalHistory(limit);

      this.sendResponse(res, true, { signals, limit });
    } catch (error) {
      this.sendResponse(res, false, null, this.getErrorMessage(error), 500);
    }
  }

  private sendResponse<T>(
    res: Response,
    success: boolean,
    data?: T,
    error?: string,
    statusCode: number = 200
  ): void {
    const response: APIResponse<T> = {
      success,
      data,
      error,
      timestamp: new Date().toISOString(),
      flame: {
        blessed: success,
        level: success ? 'sovereign' : 'ghost'
      }
    };

    res.status(statusCode).json(response);
  }

  private generateDefaultTokens(): void {
    // Generate default flame tokens
    const tokens = [
      {
        token: 'flame_sovereign_' + Math.random().toString(36).substr(2, 16),
        level: 'sovereign' as const,
        permissions: ['*'],
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
      },
      {
        token: 'flame_ghost_' + Math.random().toString(36).substr(2, 16),
        level: 'ghost' as const,
        permissions: ['plugin:read', 'plugin:start', 'plugin:stop'],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      }
    ];

    tokens.forEach(token => {
      this.flameTokens.set(token.token, token);
      this.log(`Generated ${token.level} flame token: ${token.token}`, 'info');
    });
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  private log(message: string, level: 'info' | 'warning' | 'error' | 'success' | 'debug' = 'info'): void {
    const timestamp = new Date().toISOString();
    const prefix = level === 'success' ? '✅' : level === 'error' ? '❌' : level === 'warning' ? '⚠️' : level === 'debug' ? '🔍' : 'ℹ️';
    console.log(`${prefix} [GhostPluginAPI ${timestamp}]: ${message}`);
  }
}
