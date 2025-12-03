'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { 
  TelemetryMetrics, 
  DEFAULT_TELEMETRY, 
  TELEMETRY_RANGES,
  QOS_TIERS,
  QoSTier,
} from './schema';
import { updateTelemetry } from './mockData';

// ===== 3D Visualization Types =====

export interface NodeTraffic {
  nodeId: string;
  nodeType: string;
  load: number;       // 0-1, current traffic load
  bandwidth: number;  // 0-1, allocated bandwidth (line thickness)
  priority: number;   // 1-4, QoS priority
}

export interface NodeState {
  id: string;
  tier: QoSTier;
  load: number;      // 0-1, ağ yükü
  active: boolean;
}

export interface SceneState {
  nodes: NodeState[];
  activeTier: QoSTier | null;
  networkLoad: number;  // 0-1, genel ağ yükü
  flowSpeed: number;    // Parçacık hızı çarpanı
  trafficNodes: NodeTraffic[];  // Dynamic traffic per node
}

// ===== Context Types =====

interface ContentContextType {
  // Telemetry
  metrics: TelemetryMetrics;
  isLive: boolean;
  toggleLive: () => void;
  
  // Section visibility
  activeSection: string;
  setActiveSection: (section: string) => void;
  visibleSections: Set<string>;
  registerSection: (id: string) => void;
  unregisterSection: (id: string) => void;
  
  // Demo state
  demoMode: 'before' | 'after' | 'live';
  setDemoMode: (mode: 'before' | 'after' | 'live') => void;
  
  // 3D Scene state (ReflexCycleAgent köprüsü)
  sceneState: SceneState;
  highlightTier: (tierId: string | null) => void;
}

// ===== Context =====

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// ===== Helper: Metriklere göre SceneState hesapla =====

// Traffic simulation data - changes over time
const TRAFFIC_PATTERNS = [
  { nodeType: 'gaming', baseLoad: 0.3, burstChance: 0.3, priority: 1 },
  { nodeType: 'video', baseLoad: 0.5, burstChance: 0.2, priority: 1 },
  { nodeType: 'download', baseLoad: 0.4, burstChance: 0.4, priority: 3 },
  { nodeType: 'iot', baseLoad: 0.1, burstChance: 0.1, priority: 4 },
];

function calculateSceneState(
  metrics: TelemetryMetrics, 
  highlightedTierId: string | null
): SceneState {
  // Ağ yükü: queue depth ve CPU'dan hesapla
  const networkLoad = (metrics.queueDepth / 100 + metrics.cpuUsage / 100) / 2;
  
  // Parçacık hızı: throughput'a bağlı (düşük throughput = yavaş akış)
  const flowSpeed = metrics.throughput / 100;
  
  // Her tier için node oluştur
  const nodes: NodeState[] = QOS_TIERS.map((tier, index) => {
    // Her tier'ın yükü RTT ve jitter'a göre değişir
    const baseLoad = 0.3 + (index * 0.1);
    const jitterFactor = metrics.jitter / 10;
    const load = Math.min(1, baseLoad + jitterFactor * (0.5 - Math.random() * 0.3));
    
    return {
      id: `node-${tier.id}`,
      tier,
      load,
      active: highlightedTierId === null || highlightedTierId === tier.id,
    };
  });
  
  // Vurgulanan tier
  const activeTier = highlightedTierId 
    ? QOS_TIERS.find(t => t.id === highlightedTierId) || null 
    : null;
  
  // Generate dynamic traffic for each device type
  const trafficNodes: NodeTraffic[] = TRAFFIC_PATTERNS.flatMap((pattern) => {
    // Create 2 instances of each device type
    return [0, 1].map((instanceIdx) => {
      const nodeId = `${pattern.nodeType}-${instanceIdx}`;
      // Simulate traffic bursts
      const isBursting = Math.random() < pattern.burstChance;
      const burstMultiplier = isBursting ? 1.5 + Math.random() : 1;
      const load = Math.min(1, pattern.baseLoad * burstMultiplier * (0.8 + Math.random() * 0.4));
      
      // Mycelium algorithm: higher load = more bandwidth allocated (up to a limit)
      // Priority affects how quickly bandwidth is allocated
      const priorityFactor = (5 - pattern.priority) / 4; // 1 = highest priority
      const bandwidth = Math.min(1, load * priorityFactor * 1.2);
      
      return {
        nodeId,
        nodeType: pattern.nodeType,
        load,
        bandwidth,
        priority: pattern.priority,
      };
    });
  });
  
  return {
    nodes,
    activeTier,
    networkLoad,
    flowSpeed,
    trafficNodes,
  };
}

// ===== Provider Props =====

interface ContentProviderProps {
  children: ReactNode;
  updateInterval?: number; // ms, default 1500
}

// ===== Provider Component =====

export function ContentProvider({ 
  children, 
  updateInterval = 1500 
}: ContentProviderProps) {
  // Telemetry state
  const [metrics, setMetrics] = useState<TelemetryMetrics>(DEFAULT_TELEMETRY);
  const [isLive, setIsLive] = useState(true);
  
  // Section state
  const [activeSection, setActiveSection] = useState('hero');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['hero']));
  
  // Demo mode
  const [demoMode, setDemoMode] = useState<'before' | 'after' | 'live'>('live');
  
  // 3D Scene state
  const [highlightedTierId, setHighlightedTierId] = useState<string | null>(null);

  // Toggle live updates
  const toggleLive = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);

  // Register/unregister sections for visibility tracking
  const registerSection = useCallback((id: string) => {
    setVisibleSections(prev => new Set(prev).add(id));
  }, []);

  const unregisterSection = useCallback((id: string) => {
    setVisibleSections(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);
  
  // Highlight a specific QoS tier in 3D scene
  const highlightTier = useCallback((tierId: string | null) => {
    setHighlightedTierId(tierId);
  }, []);
  
  // Calculate scene state from metrics
  const sceneState = useMemo(() => 
    calculateSceneState(metrics, highlightedTierId),
    [metrics, highlightedTierId]
  );

  // Mock telemetry updates
  useEffect(() => {
    if (!isLive || demoMode !== 'live') return;

    const interval = setInterval(() => {
      setMetrics(prev => updateTelemetry(prev, TELEMETRY_RANGES));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [isLive, demoMode, updateInterval]);

  // Context value
  const value: ContentContextType = {
    metrics,
    isLive,
    toggleLive,
    activeSection,
    setActiveSection,
    visibleSections,
    registerSection,
    unregisterSection,
    demoMode,
    setDemoMode,
    sceneState,
    highlightTier,
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

// ===== Hook: useContent =====

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

// ===== Hook: useMockMetrics =====

export function useMockMetrics() {
  const { metrics, isLive, toggleLive, demoMode, setDemoMode } = useContent();
  
  return {
    metrics,
    isLive,
    toggleLive,
    demoMode,
    setDemoMode,
    
    // Formatted values
    formatted: {
      rtt: `${metrics.rtt.toFixed(1)}ms`,
      jitter: `${metrics.jitter.toFixed(1)}ms`,
      packetLoss: `${metrics.packetLoss.toFixed(2)}%`,
      throughput: `${metrics.throughput.toFixed(1)}Mbps`,
      queueDepth: `${metrics.queueDepth.toFixed(0)}%`,
      cpuUsage: `${metrics.cpuUsage.toFixed(0)}%`,
    },
  };
}

// ===== Hook: useSectionVisibility =====

export function useSectionVisibility(sectionId: string) {
  const { 
    activeSection, 
    setActiveSection, 
    visibleSections,
    registerSection,
    unregisterSection,
  } = useContent();

  useEffect(() => {
    registerSection(sectionId);
    return () => unregisterSection(sectionId);
  }, [sectionId, registerSection, unregisterSection]);

  const isVisible = visibleSections.has(sectionId);
  const isActive = activeSection === sectionId;

  return {
    isVisible,
    isActive,
    setActive: () => setActiveSection(sectionId),
  };
}

// ===== Hook: useIntersectionObserver =====

interface UseIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  onIntersect?: (isIntersecting: boolean) => void;
}

export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: UseIntersectionOptions = {}
) {
  const { threshold = 0.3, rootMargin = '0px', onIntersect } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting;
        setIsIntersecting(intersecting);
        onIntersect?.(intersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold, rootMargin, onIntersect]);

  return isIntersecting;
}

// ===== Hook: useSceneState (ReflexCycleAgent köprüsü) =====

export function useSceneState() {
  const { sceneState, highlightTier, metrics } = useContent();
  
  return {
    ...sceneState,
    highlightTier,
    
    // Tier renkleri (Three.js için hex)
    tierColors: {
      realtime: '#ef4444',   // red-500
      interactive: '#f97316', // orange-500
      streaming: '#eab308',   // yellow-500
      bulk: '#22c55e',        // green-500
    },
    
    // Metrik bazlı hesaplamalar
    computed: {
      // Ağ sağlığı skoru (0-100)
      healthScore: Math.round(
        100 - (metrics.packetLoss * 10) - (metrics.jitter * 5) - ((metrics.rtt - 10) * 2)
      ),
      // Congestion seviyesi (0-1)
      congestion: metrics.queueDepth / 100,
      // Throughput yüzdesi
      throughputPercent: metrics.throughput / 100,
    },
  };
}
