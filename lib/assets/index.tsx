'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ASSETS, 
  AssetState, 
  AssetDefinition,
  calculateProgress,
  areCriticalAssetsLoaded,
} from './manifest';

// ===== Asset Loader Hook =====

interface UseAssetLoaderReturn {
  states: AssetState[];
  progress: number;
  isReady: boolean;
  isLoading: boolean;
  hasErrors: boolean;
  loadAsset: (id: string) => void;
  retryFailed: () => void;
}

/**
 * Hook for managing asset loading state
 * 
 * Note: Actual loading is handled by Three.js loaders.
 * This hook tracks state and provides progress UI data.
 */
export function useAssetLoader(): UseAssetLoaderReturn {
  // Initialize states from manifest
  const [states, setStates] = useState<AssetState[]>(() => 
    ASSETS.map(asset => ({
      ...asset,
      status: 'pending',
      progress: 0,
    }))
  );
  
  // Calculate derived state
  const progress = calculateProgress(states);
  const isReady = areCriticalAssetsLoaded(states);
  const isLoading = states.some(s => s.status === 'loading');
  const hasErrors = states.some(s => s.status === 'error');
  
  // Update asset state
  const updateAsset = useCallback((id: string, updates: Partial<AssetState>) => {
    setStates(prev => prev.map(state => 
      state.id === id ? { ...state, ...updates } : state
    ));
  }, []);
  
  // Load a specific asset
  const loadAsset = useCallback((id: string) => {
    const asset = states.find(s => s.id === id);
    if (!asset || asset.status === 'loaded' || asset.status === 'loading') {
      return;
    }
    
    updateAsset(id, { status: 'loading', progress: 0 });
    
    // Simulate loading (actual loading done by Three.js)
    // In real scenario, this would be called by Three.js loader callbacks
    setTimeout(() => {
      updateAsset(id, { status: 'loaded', progress: 100 });
    }, 500 + Math.random() * 500);
  }, [states, updateAsset]);
  
  // Retry failed assets
  const retryFailed = useCallback(() => {
    states
      .filter(s => s.status === 'error')
      .forEach(s => loadAsset(s.id));
  }, [states, loadAsset]);
  
  // Auto-load critical assets on mount
  useEffect(() => {
    const criticalAssets = states.filter(s => s.priority === 'critical' && s.status === 'pending');
    criticalAssets.forEach(asset => loadAsset(asset.id));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  return {
    states,
    progress,
    isReady,
    isLoading,
    hasErrors,
    loadAsset,
    retryFailed,
  };
}

// ===== Loading Progress Component =====

interface LoadingProgressProps {
  progress: number;
  isLoading: boolean;
  className?: string;
}

export function LoadingProgress({ progress, isLoading, className = '' }: LoadingProgressProps) {
  if (!isLoading && progress >= 100) return null;
  
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Spinner */}
      <div className="relative w-16 h-16">
        <svg className="w-full h-full animate-spin" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-primary/20"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${progress * 1.26} 126`}
            className="text-primary"
            transform="rotate(-90 25 25)"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-foreground">
          {Math.round(progress)}%
        </span>
      </div>
      
      {/* Text */}
      <span className="text-sm text-muted">
        {isLoading ? 'Loading assets...' : 'Initializing...'}
      </span>
    </div>
  );
}

// ===== Asset Error Component =====

interface AssetErrorProps {
  failedAssets: AssetState[];
  onRetry: () => void;
  className?: string;
}

export function AssetError({ failedAssets, onRetry, className = '' }: AssetErrorProps) {
  if (failedAssets.length === 0) return null;
  
  return (
    <div className={`flex flex-col items-center gap-4 p-6 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <div className="text-center">
        <p className="text-foreground font-medium mb-1">
          Failed to load {failedAssets.length} asset{failedAssets.length > 1 ? 's' : ''}
        </p>
        <p className="text-sm text-muted">
          {failedAssets.map(a => a.description || a.id).join(', ')}
        </p>
      </div>
      
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

// ===== Export all =====

export * from './manifest';
