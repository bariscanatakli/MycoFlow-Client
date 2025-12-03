import * as THREE from 'three';

// ===== Shared Device Configuration =====

export const DEVICE_TYPES = [
  { type: 'gaming' as const, tierId: 'realtime', label: 'Gaming PC', icon: '🎮', color: '#ef4444' },
  { type: 'video' as const, tierId: 'interactive', label: 'Video Call', icon: '📹', color: '#f59e0b' },
  { type: 'download' as const, tierId: 'streaming', label: 'Downloads', icon: '💾', color: '#22c55e' },
  { type: 'iot' as const, tierId: 'bulk', label: 'IoT Device', icon: '📱', color: '#8b5cf6' },
];

// ===== Calculate Device Positions =====
// This function is used by BOTH NetworkGraph and ParticleFlow to ensure consistency

export function getNetworkPositions(radius: number, devicesPerType: number = 1) {
  const router = new THREE.Vector3(0, 0.3, 0);
  
  const devices: Array<{
    type: string;
    tierId: string;
    position: THREE.Vector3;
    label: string;
    icon: string;
    color: string;
  }> = [];
  
  DEVICE_TYPES.forEach((device, typeIndex) => {
    // Calculate base angle for this device type (spread around semi-circle)
    const baseAngle = (typeIndex / DEVICE_TYPES.length) * Math.PI * 1.5 - Math.PI * 0.75;
    
    for (let i = 0; i < devicesPerType; i++) {
      const angleOffset = devicesPerType > 1 ? (i - (devicesPerType - 1) / 2) * 0.3 : 0;
      const angle = baseAngle + angleOffset;
      const dist = radius * (0.7 + i * 0.15);
      
      const x = dist * Math.cos(angle);
      const z = dist * Math.sin(angle);
      const y = -0.2 - i * 0.1;
      
      devices.push({
        type: device.type,
        tierId: device.tierId,
        position: new THREE.Vector3(x, y, z),
        label: `${device.label}${devicesPerType > 1 ? ` ${i + 1}` : ''}`,
        icon: device.icon,
        color: device.color,
      });
    }
  });
  
  return { router, devices };
}
