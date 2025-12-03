'use client';

import { useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import MetricsPanel from '@/components/MetricsPanel';
import { useSceneState } from '@/lib/content';

// Hook to detect if we're on the client (hydration-safe)
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

// QoS Tiers for legend
const TIERS = [
  { id: 'realtime', name: 'Real-time', color: 'bg-red-500' },
  { id: 'interactive', name: 'Interactive', color: 'bg-orange-500' },
  { id: 'streaming', name: 'Streaming', color: 'bg-yellow-500' },
  { id: 'bulk', name: 'Bulk', color: 'bg-green-500' },
];

// Dynamically import Three.js visualization with no SSR
const NetworkVisualization = dynamic(
  () => import('@/components/three').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] rounded-2xl bg-surface/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted">Loading 3D visualization...</span>
        </div>
      </div>
    )
  }
);

export default function DemoSection() {
  const { highlightTier, computed, trafficNodes } = useSceneState();
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);
  const isClient = useIsClient();
  
  const handleTierHover = (tierId: string | null) => {
    setHoveredTier(tierId);
    highlightTier(tierId);
  };
  
  // Get top traffic nodes for display (only on client)
  const topTraffic = isClient 
    ? [...trafficNodes].sort((a, b) => b.bandwidth - a.bandwidth).slice(0, 3)
    : [];
  
  return (
    <section id="demo" className="py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Interactive Demo
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            See MycoFlow in Action
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Watch the bio-inspired network adapt in real-time. Each node represents a device, 
            and the flowing particles show traffic being intelligently routed based on priority.
          </p>
        </div>

        {/* Main Demo Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* 3D Visualization */}
          <div className="relative">
            <div className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-bg-dark to-primary/10 border border-border">
              <NetworkVisualization 
                className="w-full h-full"
                nodeCount={12}
                particleCount={40}
              />
            </div>
            
            {/* Interactive Legend */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3 justify-center">
              {TIERS.map(tier => (
                <button
                  key={tier.id}
                  onMouseEnter={() => handleTierHover(tier.id)}
                  onMouseLeave={() => handleTierHover(null)}
                  className={`flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    hoveredTier === tier.id 
                      ? 'ring-2 ring-primary scale-105' 
                      : hoveredTier !== null && hoveredTier !== tier.id
                        ? 'opacity-50'
                        : ''
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${tier.color}`} />
                  <span className="text-xs text-foreground">{tier.name}</span>
                </button>
              ))}
            </div>
            
            {/* Network Health Indicator */}
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  computed.healthScore > 80 ? 'bg-green-500' :
                  computed.healthScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-xs text-foreground">
                  Health: {computed.healthScore}%
                </span>
              </div>
            </div>
            
            {/* Live Traffic Indicator - only render after hydration */}
            {isClient && topTraffic.length > 0 && (
              <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-foreground">Live Traffic</span>
                </div>
                <div className="space-y-1">
                  {topTraffic.map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div 
                        className="h-1.5 rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${Math.round(t.bandwidth * 60)}px` }}
                      />
                      <span className="text-[10px] text-muted capitalize">{t.nodeType}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Metrics Panel */}
          <div className="space-y-6">
            <div className="bg-background rounded-2xl border border-border p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Live Network Telemetry
              </h3>
              <MetricsPanel />
            </div>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-background rounded-xl border border-border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="font-medium text-foreground">Adaptive Routing</span>
                </div>
                <p className="text-sm text-muted">
                  Traffic automatically reroutes based on real-time conditions.
                </p>
              </div>

              <div className="bg-background rounded-xl border border-border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-foreground">Self-Healing</span>
                </div>
                <p className="text-sm text-muted">
                  Network automatically recovers from failures without intervention.
                </p>
              </div>
            </div>

            {/* Interaction hint */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span>Drag to rotate • Auto-rotates when idle</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
