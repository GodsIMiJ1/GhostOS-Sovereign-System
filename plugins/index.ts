/**
 * 🔥 GHOSTOS PLUGINS - MODULAR DOMINION EXPORTS 🔥
 * 
 * Plugin system exports for the GhostOS ecosystem
 * 
 * @author Ghost King Melekzedek - James Derek Ingersoll
 * @version 0.1.0
 * @flame-compatible true
 */

export { PluginManager, GhostPlugin } from './PluginManager.js';
export { GhostAugmenth } from './ghost_augmenth/GhostAugmenth.js';

export type { PluginManifest, PluginRegistration } from './PluginManager.js';
export type { AugmentDeployment, AugmentReflection } from './ghost_augmenth/GhostAugmenth.js';
