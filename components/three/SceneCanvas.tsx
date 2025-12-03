'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

// ===== Loading Fallback =====

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-surface/50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-muted">Loading 3D Scene...</span>
      </div>
    </div>
  );
}

// ===== Scene Props =====

interface SceneCanvasProps {
  children: React.ReactNode;
  className?: string;
  enableOrbit?: boolean;
  enableZoom?: boolean;
  cameraPosition?: [number, number, number];
  backgroundColor?: string;
}

// ===== Main Component =====

export default function SceneCanvas({
  children,
  className = '',
  enableOrbit = true,
  enableZoom = false,
  cameraPosition = [0, 0, 8],
  backgroundColor = 'transparent',
}: SceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={{ minHeight: '300px' }}
    >
      {isVisible ? (
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            gl={{
              antialias: !isMobile,
              alpha: backgroundColor === 'transparent',
              powerPreference: isMobile ? 'low-power' : 'high-performance',
            }}
            dpr={isMobile ? 1 : Math.min(2, window.devicePixelRatio)}
            style={{ background: backgroundColor }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1;
            }}
          >
            <PerspectiveCamera
              makeDefault
              position={cameraPosition}
              fov={isMobile ? 60 : 50}
              near={0.1}
              far={1000}
            />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4C956C" />

            {/* Environment for reflections */}
            <Environment preset="city" />

            {/* Controls */}
            {enableOrbit && (
              <OrbitControls
                enableZoom={enableZoom}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
              />
            )}

            {/* Scene Content */}
            {children}
          </Canvas>
        </Suspense>
      ) : (
        <LoadingFallback />
      )}
    </div>
  );
}
