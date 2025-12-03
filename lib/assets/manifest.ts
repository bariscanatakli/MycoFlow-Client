/**
 * AssetLoaderAgent - Asset Manifest
 * 
 * Yüklenecek 3D modeller, textureler ve diğer varlıkların listesi.
 * Her asset'in tipi, yolu, önceliği ve yükleme durumu tanımlanır.
 */

export type AssetType = 'texture' | 'model' | 'environment' | 'audio';
export type AssetPriority = 'critical' | 'high' | 'normal' | 'lazy';
export type AssetStatus = 'pending' | 'loading' | 'loaded' | 'error';

export interface AssetDefinition {
  id: string;
  type: AssetType;
  path: string;
  priority: AssetPriority;
  fallback?: string;
  description?: string;
}

export interface AssetState extends AssetDefinition {
  status: AssetStatus;
  progress: number;
  error?: string;
}

// ===== Asset Manifest =====

export const ASSETS: AssetDefinition[] = [
  // Critical assets - loaded first
  {
    id: 'node-glow',
    type: 'texture',
    path: '/textures/node-glow.png',
    priority: 'critical',
    fallback: 'procedural',
    description: 'Network node glow effect',
  },
  
  // High priority
  {
    id: 'particle-sprite',
    type: 'texture',
    path: '/textures/particle.png',
    priority: 'high',
    fallback: 'procedural',
    description: 'Particle flow sprite',
  },
  
  // Normal priority
  {
    id: 'connection-gradient',
    type: 'texture',
    path: '/textures/connection-gradient.png',
    priority: 'normal',
    fallback: 'procedural',
    description: 'Connection line gradient',
  },
  
  // Lazy loaded
  {
    id: 'environment-hdri',
    type: 'environment',
    path: '/textures/studio_small_09_1k.hdr',
    priority: 'lazy',
    description: 'Environment lighting HDRI',
  },
];

// ===== Helper Functions =====

/**
 * Get assets by priority
 */
export function getAssetsByPriority(priority: AssetPriority): AssetDefinition[] {
  return ASSETS.filter(asset => asset.priority === priority);
}

/**
 * Get critical assets (must load before scene)
 */
export function getCriticalAssets(): AssetDefinition[] {
  return getAssetsByPriority('critical');
}

/**
 * Get asset by ID
 */
export function getAssetById(id: string): AssetDefinition | undefined {
  return ASSETS.find(asset => asset.id === id);
}

/**
 * Calculate total loading progress
 */
export function calculateProgress(states: AssetState[]): number {
  if (states.length === 0) return 100;
  
  const totalProgress = states.reduce((sum, state) => sum + state.progress, 0);
  return Math.round(totalProgress / states.length);
}

/**
 * Check if all critical assets are loaded
 */
export function areCriticalAssetsLoaded(states: AssetState[]): boolean {
  const criticalIds = getCriticalAssets().map(a => a.id);
  return criticalIds.every(id => {
    const state = states.find(s => s.id === id);
    return state?.status === 'loaded';
  });
}
