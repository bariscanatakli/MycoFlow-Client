'use client';

import { useRef, useState, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line, Sphere, Html, OrbitControls } from '@react-three/drei';

// ===== Types =====

interface NetworkNode {
  id: string;
  position: THREE.Vector3;
  basePosition: THREE.Vector3;
  type: 'router' | 'gaming' | 'video' | 'bulk';
  label: string;
  stress: number;
  resources: number;
}

interface NetworkEdge {
  from: string;
  to: string;
  strength: number;
  flow: number;
  baseStrength: number;
}

interface AdaptiveNetworkProps {
  onPhaseChange?: (phase: string) => void;
  simulationSpeed?: number;
}

// ===== Constants =====

const NODE_CONFIGS = {
  router: { color: '#3b82f6', size: 0.5, label: 'Router' },
  gaming: { color: '#ef4444', size: 0.3, label: 'Gaming' },
  video: { color: '#f59e0b', size: 0.3, label: 'Video Call' },
  bulk: { color: '#22c55e', size: 0.25, label: 'Downloads' },
};

// ===== Initial Network State =====

function createInitialNetwork(): { nodes: NetworkNode[]; edges: NetworkEdge[] } {
  return {
    nodes: [
      {
        id: 'router',
        position: new THREE.Vector3(0, 0, 0),
        basePosition: new THREE.Vector3(0, 0, 0),
        type: 'router',
        label: 'Router',
        stress: 0,
        resources: 1,
      },
      {
        id: 'gaming',
        position: new THREE.Vector3(0, 2, 0),
        basePosition: new THREE.Vector3(0, 2, 0),
        type: 'gaming',
        label: 'Gaming',
        stress: 0,
        resources: 0.25,
      },
      {
        id: 'video',
        position: new THREE.Vector3(-2, 0, 0),
        basePosition: new THREE.Vector3(-2, 0, 0),
        type: 'video',
        label: 'Video',
        stress: 0,
        resources: 0.25,
      },
      {
        id: 'bulk',
        position: new THREE.Vector3(2, 0, 0),
        basePosition: new THREE.Vector3(2, 0, 0),
        type: 'bulk',
        label: 'Bulk',
        stress: 0,
        resources: 0.25,
      },
    ],
    edges: [
      { from: 'router', to: 'gaming', strength: 0.5, flow: 0.2, baseStrength: 0.5 },
      { from: 'router', to: 'video', strength: 0.5, flow: 0.2, baseStrength: 0.5 },
      { from: 'router', to: 'bulk', strength: 0.5, flow: 0.2, baseStrength: 0.5 },
    ],
  };
}

// ===== Stress Node Component =====

interface StressNodeProps {
  node: NetworkNode;
  onClick?: () => void;
  isActive: boolean;
}

function StressNode({ node, onClick, isActive }: StressNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const config = NODE_CONFIGS[node.type];

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const pulseSpeed = 1 + node.stress * 3;
    const pulseAmount = 0.1 * node.stress;
    meshRef.current.scale.setScalar(1 + Math.sin(t * pulseSpeed) * pulseAmount);

    if (glowRef.current) {
      const glowScale = 1.5 + node.resources * 0.5;
      glowRef.current.scale.setScalar(glowScale);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.1 + node.resources * 0.2;
    }

    // Animate position only for active node, keep others stable
    if (groupRef.current) {
      if (isActive) {
        groupRef.current.position.y = node.basePosition.y + Math.sin(t * 2) * 0.1;
      } else {
        groupRef.current.position.y = node.basePosition.y;
      }
    }
  });

  const stressColor = new THREE.Color(config.color).lerp(new THREE.Color('#ef4444'), node.stress * 0.5);
  const finalColor = stressColor.lerp(new THREE.Color('#3b82f6'), node.resources * 0.3);

  // Memoize label position to prevent jitter
  const labelPosition: [number, number, number] = useMemo(() => [0, config.size + 0.4, 0], [config.size]);

  return (
    <group ref={groupRef} position={[node.basePosition.x, node.basePosition.y, node.basePosition.z]} onClick={onClick}>
      <Sphere ref={glowRef} args={[config.size * 2, 16, 16]}>
        <meshBasicMaterial color={config.color} transparent opacity={0.15} />
      </Sphere>
      <Sphere ref={meshRef} args={[config.size, 32, 32]}>
        <meshStandardMaterial
          color={finalColor}
          emissive={finalColor}
          emissiveIntensity={0.3 + node.stress * 0.3}
          roughness={0.3}
          metalness={0.6}
        />
      </Sphere>
      {/* Label - stable position, no per-frame updates */}
      <Html 
        position={labelPosition} 
        center 
        distanceFactor={8}
        style={{ pointerEvents: 'none' }}
      >
        <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs whitespace-nowrap select-none">
          <span className="font-medium">{node.label}</span>
          {node.stress > 0.1 && (
            <span className="ml-2 text-red-400">Stress: {Math.round(node.stress * 100)}%</span>
          )}
        </div>
      </Html>
      {node.stress > 0.1 && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[config.size * 1.2, config.size * 1.4, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={node.stress * 0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

// ===== Adaptive Edge Component =====

interface AdaptiveEdgeProps {
  edge: NetworkEdge;
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
}

function AdaptiveEdge({ edge, fromPos, toPos }: AdaptiveEdgeProps) {
  const particlesRef = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    const count = Math.floor(edge.flow * 5) + 1;
    return Array.from({ length: count }, (_, i) => i / count);
  }, [edge.flow]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const progress = ((particles[i] || 0) + state.clock.elapsedTime * edge.flow * 0.5) % 1;
      const pos = new THREE.Vector3().lerpVectors(fromPos, toPos, progress);
      pos.y += Math.sin(progress * Math.PI) * 0.2;
      mesh.position.copy(pos);
      mesh.scale.setScalar((Math.sin(progress * Math.PI) * 0.5 + 0.5) * 0.1);
    });
  });

  const lineColor = new THREE.Color('#3b82f6').lerp(new THREE.Color('#666666'), 1 - edge.strength);

  return (
    <group>
      <Line
        points={[fromPos, toPos]}
        color={lineColor}
        lineWidth={edge.strength * 4 + 1}
        transparent
        opacity={0.3 + edge.strength * 0.5}
      />
      <group ref={particlesRef}>
        {particles.map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#60a5fa" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ===== Scene Component =====

function AdaptiveNetworkScene({ onPhaseChange, simulationSpeed = 1 }: AdaptiveNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [network, setNetwork] = useState(createInitialNetwork);
  const [phase, setPhase] = useState<'idle' | 'stress' | 'sensing' | 'adapting' | 'stable'>('idle');
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const phaseTimeRef = useRef(0);

  const nodeMap = useMemo(() => {
    const map = new Map<string, NetworkNode>();
    network.nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [network.nodes]);

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (nodeId === 'router') return;
      setActiveNode(nodeId);
      setPhase('stress');
      phaseTimeRef.current = 0;
      setNetwork((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, stress: 0.8 } : n)),
      }));
      onPhaseChange?.('stress');
    },
    [onPhaseChange]
  );

  useFrame((state, delta) => {
    phaseTimeRef.current += delta * simulationSpeed;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
    }

    if (phase === 'stress' && phaseTimeRef.current > 1) {
      setPhase('sensing');
      phaseTimeRef.current = 0;
      onPhaseChange?.('sensing');
    }

    if (phase === 'sensing' && phaseTimeRef.current > 1.5) {
      setPhase('adapting');
      phaseTimeRef.current = 0;
      onPhaseChange?.('adapting');
      setNetwork((prev) => {
        const stressedNode = prev.nodes.find((n) => n.stress > 0.5);
        if (!stressedNode) return prev;
        return {
          nodes: prev.nodes.map((n) => {
            if (n.id === stressedNode.id) return { ...n, resources: Math.min(n.resources + 0.3, 0.8) };
            if (n.id === 'bulk') return { ...n, resources: Math.max(n.resources - 0.15, 0.1) };
            return n;
          }),
          edges: prev.edges.map((e) => {
            if (e.to === stressedNode.id) return { ...e, strength: Math.min(e.strength + 0.3, 1), flow: Math.min(e.flow + 0.3, 0.8) };
            if (e.to === 'bulk') return { ...e, strength: Math.max(e.strength - 0.2, 0.2), flow: Math.max(e.flow - 0.2, 0.1) };
            return e;
          }),
        };
      });
    }

    if (phase === 'adapting' && phaseTimeRef.current > 2) {
      setPhase('stable');
      phaseTimeRef.current = 0;
      onPhaseChange?.('stable');
      setNetwork((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => ({ ...n, stress: Math.max(n.stress - 0.6, 0) })),
      }));
    }

    if (phase === 'stable' && phaseTimeRef.current > 3) {
      setPhase('idle');
      setActiveNode(null);
      phaseTimeRef.current = 0;
      onPhaseChange?.('idle');
      setNetwork((prev) => ({
        nodes: prev.nodes.map((n) => ({ ...n, stress: 0, resources: n.id === 'router' ? 1 : 0.25 })),
        edges: prev.edges.map((e) => ({ ...e, strength: e.baseStrength, flow: 0.2 })),
      }));
    }
  });

  return (
    <group ref={groupRef}>
      {network.edges.map((edge) => {
        const fromNode = nodeMap.get(edge.from);
        const toNode = nodeMap.get(edge.to);
        if (!fromNode || !toNode) return null;
        return <AdaptiveEdge key={`${edge.from}-${edge.to}`} edge={edge} fromPos={fromNode.position} toPos={toNode.position} />;
      })}
      {network.nodes.map((node) => (
        <StressNode key={node.id} node={node} onClick={() => handleNodeClick(node.id)} isActive={activeNode === node.id} />
      ))}
    </group>
  );
}

// ===== Main Export with Canvas =====

interface AdaptiveNetworkCanvasProps {
  onPhaseChange?: (phase: string) => void;
  simulationSpeed?: number;
  className?: string;
}

export default function AdaptiveNetwork({ onPhaseChange, simulationSpeed = 1, className = '' }: AdaptiveNetworkCanvasProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 1, 6], fov: 50 }} gl={{ antialias: true, alpha: true }} style={{ background: 'transparent' }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#3b82f6" />
          <AdaptiveNetworkScene onPhaseChange={onPhaseChange} simulationSpeed={simulationSpeed} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}
