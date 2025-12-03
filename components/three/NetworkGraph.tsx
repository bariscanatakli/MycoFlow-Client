'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line, Html, Box, Sphere, Cylinder, Torus } from '@react-three/drei';
import { useSceneState } from '@/lib/content';
import { getNetworkPositions, DEVICE_TYPES } from './networkPositions';

// ===== Types =====

interface NetworkNode {
  id: string;
  position: THREE.Vector3;
  type: 'router' | 'gaming' | 'video' | 'download' | 'iot';
  tierId: string;
  label: string;
  icon: string;
  color: string;
}

interface NetworkGraphProps {
  nodeCount?: number;
  radius?: number;
  animated?: boolean;
}

// ===== Device Shape Configuration =====

const DEVICE_SHAPES: Record<string, { size: number; shape: 'box' | 'sphere' | 'cylinder' }> = {
  router: { size: 0.4, shape: 'box' },
  gaming: { size: 0.25, shape: 'box' },
  video: { size: 0.22, shape: 'sphere' },
  download: { size: 0.2, shape: 'cylinder' },
  iot: { size: 0.15, shape: 'sphere' },
};

// ===== Generate Network Topology =====

function generateNetwork(nodeCount: number, radius: number): NetworkNode[] {
  const nodes: NetworkNode[] = [];
  const devicesPerType = Math.max(1, Math.floor((nodeCount - 1) / DEVICE_TYPES.length));
  
  const { router, devices } = getNetworkPositions(radius, devicesPerType);
  
  // Add router
  nodes.push({
    id: 'router-main',
    position: router,
    type: 'router',
    tierId: 'router',
    label: 'Router',
    icon: '🌐',
    color: '#3b82f6',
  });

  // Add devices
  devices.forEach((device, index) => {
    nodes.push({
      id: `${device.type}-${index}`,
      position: device.position,
      type: device.type as 'gaming' | 'video' | 'download' | 'iot',
      tierId: device.tierId,
      label: device.label,
      icon: device.icon,
      color: device.color,
    });
  });
  
  return nodes.slice(0, nodeCount);
}

// ===== Router Component (Special Shape) =====

function RouterMesh({ node, animated }: { node: NetworkNode; animated: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const shapeConfig = DEVICE_SHAPES.router;
  
  useFrame((state) => {
    if (!animated || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.2;
    const scale = 1 + Math.sin(t * 0.8) * 0.03;
    groupRef.current.scale.setScalar(scale);
  });
  
  return (
    <group position={node.position}>
      <group ref={groupRef}>
        {/* Router base */}
        <Box args={[shapeConfig.size * 1.5, shapeConfig.size * 0.5, shapeConfig.size * 1.2]}>
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.3}
            roughness={0.3}
            metalness={0.7}
          />
        </Box>
        
        {/* Antennas */}
        <Cylinder args={[0.02, 0.02, 0.25]} position={[-0.2, 0.25, 0]}>
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} />
        </Cylinder>
        <Cylinder args={[0.02, 0.02, 0.3]} position={[0, 0.28, 0]}>
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} />
        </Cylinder>
        <Cylinder args={[0.02, 0.02, 0.25]} position={[0.2, 0.25, 0]}>
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={0.5} />
        </Cylinder>
        
        {/* Glow ring - no depth write to prevent z-fighting */}
        <Torus args={[0.5, 0.02, 8, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <meshBasicMaterial color={node.color} transparent opacity={0.4} depthWrite={false} />
        </Torus>
      </group>
      
      {/* Label - higher position to avoid z-fighting */}
      <Html 
        position={[0, 0.8, 0]} 
        center 
        distanceFactor={8}
        zIndexRange={[100, 0]}
        occlude={false}
        sprite
        style={{ pointerEvents: 'none' }}
      >
        <div className="bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs font-bold whitespace-nowrap shadow-lg select-none">
          <span className="mr-1">{node.icon}</span>
          {node.label}
        </div>
      </Html>
    </group>
  );
}

// ===== Device Component =====

interface DeviceMeshProps {
  node: NetworkNode;
  animated: boolean;
  isHighlighted: boolean;
}

function DeviceMesh({ node, animated, isHighlighted }: DeviceMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shapeConfig = DEVICE_SHAPES[node.type] || DEVICE_SHAPES.iot;
  const opacity = isHighlighted ? 1 : 0.4;
  
  // Memoize label position - higher to avoid z-fighting
  const labelPosition = useMemo<[number, number, number]>(
    () => [node.position.x, node.position.y + shapeConfig.size + 0.4, node.position.z],
    [node.position.x, node.position.y, node.position.z, shapeConfig.size]
  );
  
  useFrame((state) => {
    if (!animated || !meshRef.current) return;
    const t = state.clock.elapsedTime;
    
    if (isHighlighted) {
      meshRef.current.position.y = node.position.y + Math.sin(t * 2 + node.position.x) * 0.03;
    }
  });
  
  const renderShape = () => {
    const materialProps = {
      color: node.color,
      emissive: node.color,
      emissiveIntensity: isHighlighted ? 0.4 : 0.1,
      roughness: 0.4,
      metalness: 0.5,
      transparent: true,
      opacity,
    };
    
    switch (shapeConfig.shape) {
      case 'box':
        return (
          <Box ref={meshRef} args={[shapeConfig.size, shapeConfig.size * 0.6, shapeConfig.size * 0.8]} position={node.position}>
            <meshStandardMaterial {...materialProps} />
          </Box>
        );
      case 'cylinder':
        return (
          <Cylinder ref={meshRef} args={[shapeConfig.size * 0.5, shapeConfig.size * 0.5, shapeConfig.size * 0.7, 16]} position={node.position}>
            <meshStandardMaterial {...materialProps} />
          </Cylinder>
        );
      default:
        return (
          <Sphere ref={meshRef} args={[shapeConfig.size, 16, 16]} position={node.position}>
            <meshStandardMaterial {...materialProps} />
          </Sphere>
        );
    }
  };
  
  return (
    <group>
      {/* Glow effect - render behind with no depth write */}
      {isHighlighted && (
        <Sphere args={[shapeConfig.size * 1.8, 12, 12]} position={node.position}>
          <meshBasicMaterial 
            color={node.color} 
            transparent 
            opacity={0.15} 
            depthWrite={false}
            depthTest={true}
          />
        </Sphere>
      )}
      
      {renderShape()}
      
      {/* Label - stable position with proper z-index */}
      <Html 
        position={labelPosition} 
        center
        distanceFactor={8}
        zIndexRange={[100, 0]}
        occlude={false}
        sprite
        style={{ pointerEvents: 'none' }}
      >
        <div className={`backdrop-blur-sm px-2 py-1 rounded text-xs whitespace-nowrap select-none ${
          isHighlighted ? 'bg-foreground/90 text-background' : 'bg-foreground/70 text-background'
        }`}>
          <span className="mr-1">{node.icon}</span>
          {node.label}
        </div>
      </Html>
    </group>
  );
}

// ===== Connection Line Component =====

interface ConnectionLineProps {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  isHighlighted: boolean;
  bandwidth: number;  // 0-1, determines line thickness
  load: number;       // 0-1, determines glow intensity
}

function ConnectionLine({ start, end, color, isHighlighted, bandwidth, load }: ConnectionLineProps) {
  const curve = useMemo(() => {
    const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
    mid.y += 0.15;
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);
  
  const points = useMemo(() => curve.getPoints(20), [curve]);
  
  // Calculate line width based on bandwidth (1-6)
  const lineWidth = isHighlighted ? 2 + bandwidth * 4 : 1 + bandwidth * 3;
  const opacity = isHighlighted ? 0.6 + load * 0.4 : 0.25 + bandwidth * 0.4;
  
  return (
    <group>
      {/* Glow layer for high bandwidth connections */}
      {bandwidth > 0.3 && (
        <Line
          points={points}
          color={color}
          lineWidth={lineWidth + 6}
          transparent
          opacity={bandwidth * 0.15}
        />
      )}
      {/* Main connection line */}
      <Line
        points={points}
        color={color}
        lineWidth={lineWidth}
        transparent
        opacity={opacity}
      />
    </group>
  );
}

// ===== Main Component =====

export default function NetworkGraph({
  nodeCount = 5,
  radius = 2.2,
  animated = true,
}: NetworkGraphProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { activeTier } = useSceneState();
  
  const nodes = useMemo(() => generateNetwork(nodeCount, radius), [nodeCount, radius]);
  
  const routerNode = nodes.find(n => n.type === 'router');
  const deviceNodes = nodes.filter(n => n.type !== 'router');
  
  // Get traffic data from scene state
  const { trafficNodes } = useSceneState();
  
  // Helper to get traffic data for a device
  const getDeviceTraffic = (deviceId: string) => {
    const traffic = trafficNodes.find(t => deviceId.startsWith(t.nodeType));
    return traffic || { load: 0.3, bandwidth: 0.3, priority: 3 };
  };
  
  useFrame((state) => {
    if (!groupRef.current || !animated) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.15;
  });
  
  const isNodeHighlighted = (node: NetworkNode): boolean => {
    if (!activeTier) return true;
    return node.tierId === activeTier.id;
  };
  
  return (
    <group ref={groupRef}>
      {/* Connection lines with dynamic bandwidth */}
      {routerNode && deviceNodes.map((device) => {
        const traffic = getDeviceTraffic(device.id);
        return (
          <ConnectionLine
            key={`conn-${device.id}`}
            start={routerNode.position}
            end={device.position}
            color={device.color}
            isHighlighted={isNodeHighlighted(device)}
            bandwidth={traffic.bandwidth}
            load={traffic.load}
          />
        );
      })}
      
      {/* Router */}
      {routerNode && (
        <RouterMesh node={routerNode} animated={animated} />
      )}
      
      {/* Devices */}
      {deviceNodes.map((node) => (
        <DeviceMesh
          key={node.id}
          node={node}
          animated={animated}
          isHighlighted={isNodeHighlighted(node)}
        />
      ))}
      
      {/* Floor grid */}
      <gridHelper args={[6, 12, '#1e293b', '#1e293b']} position={[0, -0.8, 0]} />
    </group>
  );
}
