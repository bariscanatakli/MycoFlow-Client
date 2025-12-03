'use client';

import dynamic from 'next/dynamic';

// Dynamically import Three.js components with no SSR
const SceneCanvas = dynamic(() => import('./SceneCanvas'), { ssr: false });
const NetworkGraph = dynamic(() => import('./NetworkGraph'), { ssr: false });
const ParticleFlow = dynamic(() => import('./ParticleFlow'), { ssr: false });

// ===== Combined Network Visualization =====

interface NetworkVisualizationProps {
  className?: string;
  nodeCount?: number;
  particleCount?: number;
}

export default function NetworkVisualization({
  className = '',
  nodeCount = 9,
  particleCount = 20,
}: NetworkVisualizationProps) {
  return (
    <div className={`relative ${className}`}>
      <SceneCanvas
        className="rounded-2xl"
        cameraPosition={[0, 1.5, 6]}
        enableOrbit={true}
        enableZoom={false}
      >
        <NetworkGraph nodeCount={nodeCount} radius={2.2} animated={true} />
        <ParticleFlow particleCount={particleCount} radius={2.2} baseSpeed={0.12} />
      </SceneCanvas>
      
      {/* Overlay gradient for better text contrast */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-surface/60 via-transparent to-transparent rounded-2xl" />
    </div>
  );
}

// Re-export components
export { SceneCanvas, NetworkGraph, ParticleFlow };
