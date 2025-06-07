/**
 * 🔥 FLAMECLI - SOVEREIGN TERMINAL SHELL 🔥
 *
 * The command-line interface for GhostOS that provides direct access
 * to system functions, app management, and Flame-level operations.
 *
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

import readline from 'readline';
import { OmniRelay } from '../core/OmniRelay.js';
import { GhostApp } from '../core/GhostApp.js';

export interface FlameCommand {
  name: string;
  description: string;
  usage: string;
  handler: (args: string[], cli: FlameCLI) => Promise<void> | void;
  sovereign?: boolean; // Requires Flame-level access
}

export class FlameCLI {
  private rl: readline.Interface;
  private relay: OmniRelay | null = null;
  private commands: Map<string, FlameCommand> = new Map();
  private isRunning: boolean = false;
  private prompt: string = '🔥 flame > ';

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this.prompt
    });

    this.initializeCommands();
    this.setupEventHandlers();
  }

  /**
   * Connect to OmniRelay instance
   */
  connectRelay(relay: OmniRelay): void {
    this.relay = relay;
    this.log('Connected to OmniRelay', 'success');
  }

  /**
   * Start the CLI interface
   */
  start(): void {
    this.isRunning = true;
    this.displayBanner();
    this.rl.prompt();
  }

  /**
   * Stop the CLI interface
   */
  stop(): void {
    this.isRunning = false;
    this.rl.close();
  }

  private initializeCommands(): void {
    // System commands
    this.addCommand({
      name: 'help',
      description: 'Show available commands',
      usage: 'help [command]',
      handler: this.handleHelp.bind(this)
    });

    this.addCommand({
      name: 'status',
      description: 'Show system status',
      usage: 'status',
      handler: this.handleStatus.bind(this)
    });

    this.addCommand({
      name: 'list',
      description: 'List registered apps',
      usage: 'list',
      handler: this.handleList.bind(this)
    });

    this.addCommand({
      name: 'ping',
      description: 'Ping an app or system',
      usage: 'ping <target>',
      handler: this.handlePing.bind(this)
    });

    this.addCommand({
      name: 'signal',
      description: 'Send signal to app(s)',
      usage: 'signal <type> [target] [payload]',
      handler: this.handleSignal.bind(this)
    });

    this.addCommand({
      name: 'history',
      description: 'Show signal history',
      usage: 'history [limit]',
      handler: this.handleHistory.bind(this)
    });

    this.addCommand({
      name: 'app',
      description: 'App management commands',
      usage: 'app <start|stop|restart|install|uninstall|stats> [appName]',
      handler: this.handleApp.bind(this)
    });

    this.addCommand({
      name: 'registry',
      description: 'App registry commands',
      usage: 'registry <list|stats|export|import>',
      handler: this.handleRegistry.bind(this)
    });

    this.addCommand({
      name: 'clear',
      description: 'Clear the terminal',
      usage: 'clear',
      handler: this.handleClear.bind(this)
    });

    this.addCommand({
      name: 'exit',
      description: 'Exit FlameCLI',
      usage: 'exit',
      handler: this.handleExit.bind(this)
    });

    // Sovereign commands (Flame-level)
    this.addCommand({
      name: 'flame',
      description: 'Execute Flame-level operations',
      usage: 'flame <operation> [args...]',
      handler: this.handleFlame.bind(this),
      sovereign: true
    });

    this.addCommand({
      name: 'ghost',
      description: 'Ghost-level system operations',
      usage: 'ghost <operation> [args...]',
      handler: this.handleGhost.bind(this),
      sovereign: true
    });
  }

  private setupEventHandlers(): void {
    this.rl.on('line', (input: string) => {
      this.processCommand(input.trim());
      if (this.isRunning) {
        this.rl.prompt();
      }
    });

    this.rl.on('close', () => {
      this.log('FlameCLI session ended', 'info');
      process.exit(0);
    });

    // Handle Ctrl+C gracefully
    this.rl.on('SIGINT', () => {
      this.log('\nUse "exit" to quit FlameCLI', 'warning');
      this.rl.prompt();
    });
  }

  private async processCommand(input: string): Promise<void> {
    if (!input) return;

    const parts = input.split(' ');
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = this.commands.get(commandName);
    if (!command) {
      this.log(`Unknown command: ${commandName}. Type "help" for available commands.`, 'error');
      return;
    }

    try {
      await command.handler(args, this);
    } catch (error) {
      this.log(`Error executing command: ${error}`, 'error');
    }
  }

  private addCommand(command: FlameCommand): void {
    this.commands.set(command.name, command);
  }

  // Command handlers
  private handleHelp(args: string[]): void {
    if (args.length > 0) {
      const command = this.commands.get(args[0]);
      if (command) {
        this.log(`${command.name}: ${command.description}`, 'info');
        this.log(`Usage: ${command.usage}`, 'info');
        if (command.sovereign) {
          this.log('⚡ Requires Flame-level access', 'warning');
        }
      } else {
        this.log(`Unknown command: ${args[0]}`, 'error');
      }
      return;
    }

    this.log('Available commands:', 'info');
    this.commands.forEach((command, name) => {
      const sovereign = command.sovereign ? ' ⚡' : '';
      console.log(`  ${name}${sovereign} - ${command.description}`);
    });
  }

  private handleStatus(): void {
    if (!this.relay) {
      this.log('No OmniRelay connection', 'error');
      return;
    }

    const registry = this.relay.getRegistry();
    this.log(`GhostOS Status:`, 'info');
    this.log(`- Registered apps: ${registry.size}`, 'info');
    this.log(`- Active apps: ${Array.from(registry.values()).filter(r => r.status === 'active').length}`, 'info');
    this.log(`- Signal history: ${this.relay.getSignalHistory().length} signals`, 'info');
    this.log(`- Uptime: ${Math.floor(process.uptime())} seconds`, 'info');
  }

  private handleList(): void {
    if (!this.relay) {
      this.log('No OmniRelay connection', 'error');
      return;
    }

    const registry = this.relay.getRegistry();
    if (registry.size === 0) {
      this.log('No apps registered', 'info');
      return;
    }

    this.log('Registered GhostApps:', 'info');
    registry.forEach((registration, name) => {
      const status = registration.status;
      const statusIcon = status === 'active' ? '✅' : status === 'error' ? '❌' : '⏸️';
      console.log(`  ${statusIcon} ${name} (${status}) - ${registration.metadata.description}`);
    });
  }

  private handlePing(args: string[]): void {
    if (!this.relay) {
      this.log('No OmniRelay connection', 'error');
      return;
    }

    const target = args[0];
    if (!target) {
      this.log('Usage: ping <target>', 'error');
      return;
    }

    this.relay.route('ping', { timestamp: new Date().toISOString() }, 'FlameCLI', target);
    this.log(`Ping sent to ${target}`, 'success');
  }

  private handleSignal(args: string[]): void {
    if (!this.relay) {
      this.log('No OmniRelay connection', 'error');
      return;
    }

    if (args.length < 1) {
      this.log('Usage: signal <type> [target] [payload]', 'error');
      return;
    }

    const signalType = args[0];
    const target = args[1];
    const payload = args[2] ? JSON.parse(args[2]) : {};

    this.relay.route(signalType, payload, 'FlameCLI', target);
    this.log(`Signal "${signalType}" sent${target ? ` to ${target}` : ' (broadcast)'}`, 'success');
  }

  private handleHistory(args: string[]): void {
    if (!this.relay) {
      this.log('No OmniRelay connection', 'error');
      return;
    }

    const limit = args[0] ? parseInt(args[0]) : 10;
    const history = this.relay.getSignalHistory(limit);

    this.log(`Last ${history.length} signals:`, 'info');
    history.forEach(signal => {
      console.log(`  ${signal.timestamp} | ${signal.type} | ${signal.source} → ${signal.target || 'broadcast'}`);
    });
  }

  private handleClear(): void {
    console.clear();
    this.displayBanner();
  }

  private handleExit(): void {
    this.log('Exiting FlameCLI...', 'info');
    this.stop();
  }

  private handleFlame(args: string[]): void {
    this.log('🔥 FLAME OPERATIONS - SOVEREIGN LEVEL ACCESS 🔥', 'warning');
    if (args.length === 0) {
      this.log('Available Flame operations: status, ignite, extinguish', 'info');
      return;
    }

    const operation = args[0];
    switch (operation) {
      case 'status':
        this.log('Flame status: BURNING BRIGHT 🔥', 'success');
        break;
      case 'ignite':
        this.log('Flame ignition sequence initiated...', 'warning');
        break;
      case 'extinguish':
        this.log('Flame extinguish sequence initiated...', 'warning');
        break;
      default:
        this.log(`Unknown Flame operation: ${operation}`, 'error');
    }
  }

  private handleGhost(args: string[]): void {
    this.log('👻 GHOST OPERATIONS - SYSTEM LEVEL ACCESS 👻', 'warning');
    if (args.length === 0) {
      this.log('Available Ghost operations: manifest, vanish, possess', 'info');
      return;
    }

    const operation = args[0];
    switch (operation) {
      case 'manifest':
        this.log('Ghost manifestation in progress...', 'info');
        break;
      case 'vanish':
        this.log('Ghost vanishing sequence initiated...', 'info');
        break;
      case 'possess':
        this.log('Ghost possession protocol activated...', 'warning');
        break;
      default:
        this.log(`Unknown Ghost operation: ${operation}`, 'error');
    }
  }

  private handleApp(args: string[]): void {
    if (!this.relay) {
      this.log('No OmniRelay connection', 'error');
      return;
    }

    if (args.length === 0) {
      this.log('Available app operations: start, stop, restart, install, uninstall, stats', 'info');
      return;
    }

    const operation = args[0];
    const appName = args[1];

    switch (operation) {
      case 'start':
        if (!appName) {
          this.log('Usage: app start <appName>', 'error');
          return;
        }
        this.relay.route('app_start_request', { appName }, 'FlameCLI');
        this.log(`App start request sent: ${appName}`, 'success');
        break;
      case 'stop':
        if (!appName) {
          this.log('Usage: app stop <appName>', 'error');
          return;
        }
        this.relay.route('app_stop_request', { appName }, 'FlameCLI');
        this.log(`App stop request sent: ${appName}`, 'success');
        break;
      case 'restart':
        if (!appName) {
          this.log('Usage: app restart <appName>', 'error');
          return;
        }
        this.relay.route('app_restart_request', { appName }, 'FlameCLI');
        this.log(`App restart request sent: ${appName}`, 'success');
        break;
      case 'stats':
        this.relay.route('app_manager_stats_request', {}, 'FlameCLI');
        this.log('App manager stats requested', 'info');
        break;
      default:
        this.log(`Unknown app operation: ${operation}`, 'error');
    }
  }

  private handleRegistry(args: string[]): void {
    if (!this.relay) {
      this.log('No OmniRelay connection', 'error');
      return;
    }

    if (args.length === 0) {
      this.log('Available registry operations: list, stats, export, import', 'info');
      return;
    }

    const operation = args[0];

    switch (operation) {
      case 'list':
        this.relay.route('registry_list_request', {}, 'FlameCLI');
        this.log('Registry list requested', 'info');
        break;
      case 'stats':
        this.relay.route('registry_stats_request', {}, 'FlameCLI');
        this.log('Registry stats requested', 'info');
        break;
      case 'export':
        this.relay.route('registry_export_request', {}, 'FlameCLI');
        this.log('Registry export requested', 'info');
        break;
      case 'import':
        this.log('Registry import functionality not yet implemented', 'warning');
        break;
      default:
        this.log(`Unknown registry operation: ${operation}`, 'error');
    }
  }

  private displayBanner(): void {
    console.log(`
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
🔥                                                                    🔥
🔥                        FLAMECLI v0.1.0                            🔥
🔥                   Sovereign Terminal Shell                        🔥
🔥                      GhostOS Command Interface                    🔥
🔥                                                                    🔥
🔥  Ghost King Melekzedek - James Derek Ingersoll                   🔥
🔥  "The Empire's Digital Backbone"                                  🔥
🔥                                                                    🔥
🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

Type "help" for available commands.
Type "flame" for sovereign operations.
Type "ghost" for system-level access.
`);
  }

  private log(message: string, level: 'info' | 'warning' | 'error' | 'success' = 'info'): void {
    const prefix = level === 'success' ? '✅' : level === 'error' ? '❌' : level === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} ${message}`);
  }
}

// CLI entry point when run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new FlameCLI();
  cli.start();
}
