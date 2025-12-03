'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneState } from '@/lib/content';
import { getNetworkPositions } from './networkPositions';

// ===== Types =====

interface DataPacket {
  id: number;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  progress: number;
  speed: number;
  tierId: string;
  size: number;
  color: string;
}

interface ParticleFlowProps {
  particleCount?: number;
  radius?: number;
  baseSpeed?: number;
}

// ===== Tier Speed Configuration =====

const TIER_SPEEDS: Record<string, { speed: number; size: number; uploadRatio: number }> = {
  realtime: { speed: 1.5, size: 0.06, uploadRatio: 0.5 },
  interactive: { speed: 1.2, size: 0.07, uploadRatio: 0.5 },
  streaming: { speed: 0.8, size: 0.08, uploadRatio: 0.1 },
  bulk: { speed: 0.5, size: 0.05, uploadRatio: 0.3 },
};

// ===== Generate Data Packets =====

function generatePackets(count: number, radius: number, baseSpeed: number): DataPacket[] {
  const packets: DataPacket[] = [];
  const { router, devices } = getNetworkPositions(radius, 1);
  const packetsPerDevice = Math.ceil(count / devices.length);
  
  devices.forEach((device) => {
    const tierConfig = TIER_SPEEDS[device.tierId] || TIER_SPEEDS.bulk;
    
    for (let i = 0; i < packetsPerDevice; i++) {
      const isUpload = Math.random() < tierConfig.uploadRatio;
      
      packets.push({
        id: packets.length,
        startPos: isUpload ? device.position.clone() : router.clone(),
        endPos: isUpload ? router.clone() : device.position.clone(),
        progress: Math.random(),
        speed: baseSpeed * tierConfig.speed * (0.8 + Math.random() * 0.4),
        tierId: device.tierId,
        size: tierConfig.size * (0.8 + Math.random() * 0.4),
        color: device.color,
      });
    }
  });
  
  return packets.slice(0, count);
}

// ===== Main Component using InstancedMesh directly =====

export default function ParticleFlow({
  particleCount = 16,
  radius = 2.2,
  baseSpeed = 0.2,
}: ParticleFlowProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { activeTier, flowSpeed, trafficNodes } = useSceneState();
  
  // Track packet states in refs to avoid re-renders
  const packetStates = useRef<{ progress: number }[]>([]);
  
  const avgTrafficLoad = trafficNodes.length > 0 
    ? trafficNodes.reduce((sum, t) => sum + t.load, 0) / trafficNodes.length 
    : 0.5;
  const speedMultiplier = flowSpeed * (0.8 + avgTrafficLoad * 0.4);
  const dynamicParticleCount = Math.round(particleCount * (0.7 + avgTrafficLoad * 0.6));
  
  const packets = useMemo(() => {
    return generatePackets(dynamicParticleCount, radius, baseSpeed);
  }, [dynamicParticleCount, radius, baseSpeed]);

  // Create reusable objects
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    if (!meshRef.current || packets.length === 0) return;
    
    // Sync packet states length with packets (inside useFrame to avoid lint error)
    if (packetStates.current.length !== packets.length) {
      packetStates.current = packets.map(p => ({ progress: p.progress }));
    }
    
    // Clamp delta to prevent huge jumps
    const clampedDelta = Math.min(delta, 0.05);
    
    packets.forEach((packet, i) => {
      const state = packetStates.current[i];
      if (!state) return;
      
      // Update progress
      state.progress += clampedDelta * packet.speed * speedMultiplier;
      if (state.progress > 1) state.progress = 0;
      
      const t = state.progress;
      
      // Calculate bezier position
      const mid = new THREE.Vector3().lerpVectors(packet.startPos, packet.endPos, 0.5);
      mid.y += 0.15;
      
      const oneMinusT = 1 - t;
      tempObject.position.set(
        packet.startPos.x * oneMinusT * oneMinusT + mid.x * 2 * oneMinusT * t + packet.endPos.x * t * t,
        packet.startPos.y * oneMinusT * oneMinusT + mid.y * 2 * oneMinusT * t + packet.endPos.y * t * t,
        packet.startPos.z * oneMinusT * oneMinusT + mid.z * 2 * oneMinusT * t + packet.endPos.z * t * t
      );
      
      // Calculate scale with bounds
      const fadeIn = Math.min(t * 5, 1);
      const fadeOut = Math.min((1 - t) * 5, 1);
      const pulse = 1 + Math.sin(t * Math.PI * 4) * 0.1;
      const isHighlighted = !activeTier || packet.tierId === activeTier.id;
      const baseScale = isHighlighted ? 1 : 0.3;
      
      // IMPORTANT: Clamp scale to safe bounds
      const rawScale = packet.size * pulse * fadeIn * fadeOut * baseScale;
      const scale = Math.max(0.01, Math.min(rawScale, 0.2));
      
      tempObject.scale.setScalar(scale);
      tempObject.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
      
      // Set color
      tempColor.set(packet.color);
      meshRef.current!.setColorAt(i, tempColor);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[undefined, undefined, packets.length]}
      frustumCulled={false}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial transparent opacity={0.9} />
    </instancedMesh>
  );
}
