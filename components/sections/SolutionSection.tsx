'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { siteContent } from '@/lib/content/mockData';
import { useNotification } from '@/components/ui/GlobalNotification';

// ===== Feature Item Component =====

interface FeatureItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function FeatureItem({ title, description, icon }: FeatureItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted">{description}</p>
      </div>
    </div>
  );
}

// ===== Interactive Mycelium Visualization =====

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  type: 'hub' | 'endpoint';
  label: string;
  activity: number;
  hovered: boolean;
}

interface NetworkEdge {
  from: string;
  to: string;
  bandwidth: number; // Current bandwidth (0-1)
  targetBandwidth: number; // Target bandwidth for smooth animation
  baseBandwidth: number; // Resting bandwidth
  pulsePhase: number; // For pulse animation
}

interface Particle {
  x: number;
  y: number;
  fromNode: string;
  toNode: string;
  progress: number;
  speed: number;
  size: number;
}

interface BranchPath {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  life: number; // 0-1, fades out
  maxLife: number;
}

function MyceliumVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<NetworkNode[]>([]);
  const edgesRef = useRef<NetworkEdge[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const branchesRef = useRef<BranchPath[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const { notify } = useNotification();

  // Get CSS color helper
  const getCssColor = useCallback((varName: string, alpha = 1): string => {
    if (typeof window === 'undefined') return `rgba(59, 130, 246, ${alpha})`;
    const root = document.documentElement;
    const color = getComputedStyle(root).getPropertyValue(varName).trim();
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    if (color.startsWith('rgb(')) {
      return color.replace(')', `, ${alpha})`).replace('rgb(', 'rgba(');
    }
    return `rgba(59, 130, 246, ${alpha})`;
  }, []);

  // Initialize network
  const initNetwork = useCallback((width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.35;

    nodesRef.current = [
      { id: 'hub', x: cx, y: cy, baseX: cx, baseY: cy, radius: 24, type: 'hub', label: 'Router Hub', activity: 1, hovered: false },
      { id: 'gaming', x: cx, y: cy - radius, baseX: cx, baseY: cy - radius, radius: 14, type: 'endpoint', label: 'Gaming', activity: 0.3, hovered: false },
      { id: 'video', x: cx - radius * 0.87, y: cy + radius * 0.5, baseX: cx - radius * 0.87, baseY: cy + radius * 0.5, radius: 14, type: 'endpoint', label: 'Video Calls', activity: 0.3, hovered: false },
      { id: 'bulk', x: cx + radius * 0.87, y: cy + radius * 0.5, baseX: cx + radius * 0.87, baseY: cy + radius * 0.5, radius: 12, type: 'endpoint', label: 'Downloads', activity: 0.2, hovered: false },
      { id: 'iot', x: cx - radius * 0.5, y: cy - radius * 0.7, baseX: cx - radius * 0.5, baseY: cy - radius * 0.7, radius: 10, type: 'endpoint', label: 'IoT Devices', activity: 0.15, hovered: false },
      { id: 'smart', x: cx + radius * 0.5, y: cy - radius * 0.7, baseX: cx + radius * 0.5, baseY: cy - radius * 0.7, radius: 10, type: 'endpoint', label: 'Smart Home', activity: 0.15, hovered: false },
    ];

    // Initialize edges with bandwidth
    const endpoints = nodesRef.current.filter(n => n.type === 'endpoint');
    edgesRef.current = endpoints.map(node => ({
      from: 'hub',
      to: node.id,
      bandwidth: 0.3,
      targetBandwidth: 0.3,
      baseBandwidth: 0.3,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Initialize particles
    particlesRef.current = [];
    endpoints.forEach(node => {
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x: node.x,
          y: node.y,
          fromNode: Math.random() > 0.5 ? 'hub' : node.id,
          toNode: Math.random() > 0.5 ? node.id : 'hub',
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          size: 2 + Math.random() * 2,
        });
      }
    });

    // Initialize branches
    branchesRef.current = [];
  }, []);

  // Handle mouse events
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    
    mouseRef.current = { x, y, active: true };

    // Check node hover
    let hoveredLabel = '';
    let hoveredId = '';
    nodesRef.current.forEach(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      node.hovered = dist < node.radius + 10;
      if (node.hovered && !hoveredLabel) {
        hoveredLabel = node.label;
        hoveredId = node.id;
      }
    });

    if (hoveredLabel) {
      const edge = edgesRef.current.find(e => e.to === hoveredId);
      const bwPercent = edge ? Math.round(edge.bandwidth * 100) : 0;
      setTooltip({
        text: `${hoveredLabel}: ${bwPercent}% bandwidth`,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 30,
      });
      canvas.style.cursor = 'pointer';
    } else {
      setTooltip(null);
      canvas.style.cursor = 'default';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
    nodesRef.current.forEach(node => { node.hovered = false; });
    setTooltip(null);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    nodesRef.current.forEach(node => {
      const dx = x - node.x;
      const dy = y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < node.radius + 10 && node.type === 'endpoint') {
        const isDeselecting = activeNode === node.id;
        setActiveNode(isDeselecting ? null : node.id);
        
        // Boost bandwidth for this edge (mycelium grows thicker)
        const edge = edgesRef.current.find(e => e.to === node.id);
        if (edge && !isDeselecting) {
          edge.targetBandwidth = Math.min(edge.bandwidth + 0.5, 1);
          notify(`${node.label} pathway expanding to 100%!`, 'warning', 3000);
          
          // Reduce other edges significantly (resource redistribution)
          edgesRef.current.forEach(e => {
            if (e.to !== node.id) {
              e.targetBandwidth = Math.max(0.15, e.baseBandwidth * 0.5);
            }
          });
          
          // Add MANY more particles on the expanded path (15-20 particles burst)
          for (let i = 0; i < 20; i++) {
            particlesRef.current.push({
              x: node.x,
              y: node.y,
              fromNode: i % 2 === 0 ? 'hub' : node.id,
              toNode: i % 2 === 0 ? node.id : 'hub',
              progress: Math.random(),
              speed: 0.006 + Math.random() * 0.008, // Faster particles
              size: 4 + Math.random() * 4, // Bigger particles
            });
          }
          
          // Spawn new branch paths (mycelium growing new connections)
          const hub = nodesRef.current.find(n => n.id === 'hub')!;
          const midX = (hub.x + node.x) / 2;
          const midY = (hub.y + node.y) / 2;
          for (let i = 0; i < 3; i++) {
            const angle = Math.random() * Math.PI * 2;
            const length = 30 + Math.random() * 40;
            branchesRef.current.push({
              fromX: midX + (Math.random() - 0.5) * 40,
              fromY: midY + (Math.random() - 0.5) * 40,
              toX: midX + Math.cos(angle) * length,
              toY: midY + Math.sin(angle) * length,
              life: 1,
              maxLife: 3 + Math.random() * 2,
            });
          }
          
          // Reset after delay
          setTimeout(() => {
            edgesRef.current.forEach(e => {
              e.targetBandwidth = e.baseBandwidth;
            });
            notify('Bandwidth balanced across all paths', 'success', 2000);
          }, 3000);
        } else {
          // Reset all to base
          edgesRef.current.forEach(e => {
            e.targetBandwidth = e.baseBandwidth;
          });
        }
      }
    });
  }, [activeNode, notify]);

  // Setup canvas and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d')!;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNetwork(width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    // Animation function
    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const particles = particlesRef.current;
      const branches = branchesRef.current;
      const hub = nodes.find(n => n.id === 'hub');
      
      if (!hub) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Update node positions (float effect + mouse interaction)
      nodes.forEach(node => {
        const floatOffset = Math.sin(time * 0.001 + node.baseX * 0.01) * 3;
        node.x = node.baseX + floatOffset;
        node.y = node.baseY + Math.cos(time * 0.0015 + node.baseY * 0.01) * 2;

        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && node.type === 'endpoint') {
            node.x += dx * 0.03;
            node.y += dy * 0.03;
          }
        }
      });

      // Smoothly animate bandwidth changes
      edges.forEach(edge => {
        const diff = edge.targetBandwidth - edge.bandwidth;
        edge.bandwidth += diff * 0.05; // Smooth interpolation
        edge.pulsePhase += 0.03;
      });

      // Update and draw branches (new mycelium paths)
      for (let i = branches.length - 1; i >= 0; i--) {
        const branch = branches[i];
        branch.life -= 0.01 / branch.maxLife;
        
        if (branch.life <= 0) {
          branches.splice(i, 1);
          continue;
        }
        
        const alpha = branch.life * 0.5;
        ctx.beginPath();
        ctx.strokeStyle = getCssColor('--color-accent', alpha);
        ctx.lineWidth = 1 + branch.life * 2;
        ctx.moveTo(branch.fromX, branch.fromY);
        ctx.lineTo(branch.toX, branch.toY);
        ctx.stroke();
        
        // Growing tip
        ctx.beginPath();
        ctx.fillStyle = getCssColor('--color-accent', alpha * 1.5);
        ctx.arc(branch.toX, branch.toY, 2 + branch.life * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw connections (mycelium-like) with bandwidth visualization
      edges.forEach(edge => {
        const fromNode = hub;
        const toNode = nodes.find(n => n.id === edge.to);
        if (!toNode) return;

        const isActive = toNode.hovered || toNode.id === activeNode;
        const baseAlpha = isActive ? 0.9 : 0.25 + edge.bandwidth * 0.5;
        
        // Line width based on bandwidth - MUCH MORE DRAMATIC
        // Normal: 2px, Full bandwidth: 20px (10x difference)
        const baseWidth = 2 + edge.bandwidth * 18;
        const pulseWidth = Math.sin(edge.pulsePhase) * edge.bandwidth * 4;
        const lineWidth = baseWidth + pulseWidth;

        // Gradient with bandwidth-based intensity
        const gradient = ctx.createLinearGradient(fromNode.x, fromNode.y, toNode.x, toNode.y);
        gradient.addColorStop(0, getCssColor('--color-primary', baseAlpha));
        gradient.addColorStop(0.5, getCssColor('--color-accent', baseAlpha + edge.bandwidth * 0.4));
        gradient.addColorStop(1, getCssColor('--color-primary', baseAlpha));

        // Main connection
        const midX = (fromNode.x + toNode.x) / 2 + (toNode.y - fromNode.y) * 0.1;
        const midY = (fromNode.y + toNode.y) / 2 - (toNode.x - fromNode.x) * 0.1;
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.quadraticCurveTo(midX, midY, toNode.x, toNode.y);
        ctx.stroke();

        // Glow effect for active bandwidth (always show glow on expanded paths)
        if (edge.bandwidth > 0.4) {
          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = getCssColor('--color-accent', (edge.bandwidth - 0.3) * 0.5);
          ctx.lineWidth = lineWidth + 10;
          ctx.shadowColor = getCssColor('--color-accent', 1);
          ctx.shadowBlur = 15;
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.quadraticCurveTo(midX, midY, toNode.x, toNode.y);
          ctx.stroke();
          ctx.restore();
        }

        // Secondary branches based on activity
        if (edge.bandwidth > 0.5) {
          const numBranches = Math.floor(edge.bandwidth * 4);
          for (let b = 0; b < numBranches; b++) {
            ctx.beginPath();
            ctx.strokeStyle = getCssColor('--color-accent', 0.3 + edge.bandwidth * 0.2);
            ctx.lineWidth = 1 + edge.bandwidth * 2;
            const t = 0.3 + (b / numBranches) * 0.4;
            const px = (1-t)*(1-t)*fromNode.x + 2*(1-t)*t*midX + t*t*toNode.x;
            const py = (1-t)*(1-t)*fromNode.y + 2*(1-t)*t*midY + t*t*toNode.y;
            const angle = Math.sin(time * 0.002 + b + edge.pulsePhase) * 0.5 + b;
            const branchLen = 15 + edge.bandwidth * 25;
            ctx.moveTo(px, py);
            ctx.lineTo(px + Math.cos(angle) * branchLen, py + Math.sin(angle) * branchLen);
            ctx.stroke();
          }
        }
      });

      // Update and draw particles - MORE particles on WIDER paths
      particles.forEach((p, idx) => {
        const fromNode = nodes.find(n => n.id === p.fromNode);
        const toNode = nodes.find(n => n.id === p.toNode);
        if (!fromNode || !toNode) return;
        
        const edge = edgesRef.current.find(e => e.to === p.toNode || e.to === p.fromNode);
        // Faster on wider paths
        const speedMultiplier = edge ? 0.6 + edge.bandwidth * 1.5 : 0.5;
        
        p.progress += p.speed * speedMultiplier;
        if (p.progress >= 1) {
          p.progress = 0;
          [p.fromNode, p.toNode] = [p.toNode, p.fromNode];
          // Keep more particles on high bandwidth paths
          const maxParticles = edge && edge.bandwidth > 0.5 ? 80 : 40;
          if (particles.length > maxParticles && Math.random() > 0.8) {
            particles.splice(idx, 1);
            return;
          }
        }

        const t = p.progress;
        const midX = (fromNode.x + toNode.x) / 2 + (toNode.y - fromNode.y) * 0.1;
        const midY = (fromNode.y + toNode.y) / 2 - (toNode.x - fromNode.x) * 0.1;
        
        p.x = (1-t)*(1-t)*fromNode.x + 2*(1-t)*t*midX + t*t*toNode.x;
        p.y = (1-t)*(1-t)*fromNode.y + 2*(1-t)*t*midY + t*t*toNode.y;

        // Bigger, brighter particles on high bandwidth
        const bwBonus = edge ? edge.bandwidth : 0;
        const particleAlpha = 0.7 + Math.sin(t * Math.PI) * 0.3;
        const particleSize = p.size * (0.8 + bwBonus * 0.6 + Math.sin(t * Math.PI) * 0.3);
        
        // Glow for high bandwidth particles
        if (bwBonus > 0.5) {
          ctx.save();
          ctx.shadowColor = getCssColor('--color-accent', 1);
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.fillStyle = getCssColor('--color-accent', particleAlpha);
          ctx.arc(p.x, p.y, particleSize * 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        
        ctx.beginPath();
        ctx.fillStyle = getCssColor('--color-accent', particleAlpha);
        ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach(node => {
        const isActive = node.hovered || node.id === activeNode;
        const edge = edgesRef.current.find(e => e.to === node.id);
        
        // Glow effect
        if (isActive || node.type === 'hub') {
          const glowRadius = node.radius * (2 + (edge?.bandwidth || 0) * 1.5);
          const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
          glow.addColorStop(0, getCssColor('--color-primary', 0.4));
          glow.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.fillStyle = glow;
          ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Pulse ring for active
        if (isActive) {
          const pulseSize = node.radius * (1.3 + Math.sin(time * 0.005) * 0.2);
          ctx.beginPath();
          ctx.strokeStyle = getCssColor('--color-accent', 0.5);
          ctx.lineWidth = 2;
          ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Node body
        const nodeGradient = ctx.createRadialGradient(
          node.x - node.radius * 0.3, node.y - node.radius * 0.3, 0,
          node.x, node.y, node.radius
        );
        nodeGradient.addColorStop(0, getCssColor('--color-primary', 1));
        nodeGradient.addColorStop(1, getCssColor('--color-primary', 0.7));
        
        const nodeScale = isActive ? 1.15 : 1;
        ctx.beginPath();
        ctx.fillStyle = nodeGradient;
        ctx.arc(node.x, node.y, node.radius * nodeScale, 0, Math.PI * 2);
        ctx.fill();

        // Bandwidth indicator ring (shows current allocation)
        if (node.type === 'endpoint' && edge) {
          ctx.beginPath();
          ctx.strokeStyle = getCssColor('--color-accent', 0.8);
          ctx.lineWidth = 3 + edge.bandwidth * 3;
          ctx.arc(node.x, node.y, node.radius + 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * edge.bandwidth);
          ctx.stroke();
        }

        // Hub icon
        if (node.type === 'hub') {
          ctx.fillStyle = 'white';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', node.x, node.y);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initNetwork, getCssColor, activeNode]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-80 md:h-96 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="w-full h-full"
      />

      {/* Tooltip */}
      {tooltip && (
        <div 
          className="absolute bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium text-foreground shadow-lg border border-border pointer-events-none z-10 transition-opacity"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translateX(-50%)' }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Instructions - Clean and minimal */}
      <div className="absolute bottom-3 left-3 right-3 text-center">
        <span className="text-xs text-muted/70 bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
          Click nodes to simulate bandwidth allocation
        </span>
      </div>
    </div>
  );
}

// ===== Main Component =====

export default function SolutionSection() {
  const { solution } = siteContent;
  const { bioInspired, reflexiveLoop } = solution;

  const features = [
    {
      title: 'Decentralized Intelligence',
      description: 'Like mycelium, each node makes local decisions that benefit the entire network.',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
    {
      title: 'Continuous Adaptation',
      description: 'Real-time feedback loops adjust routing and priorities without manual intervention.',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      title: 'Self-Healing Paths',
      description: 'Automatic rerouting around failures, just as mycelium grows around obstacles.',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: 'Resource Optimization',
      description: 'Efficient nutrient distribution inspires our bandwidth allocation algorithms.',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="solution" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Approach
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {bioInspired.title}
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            {bioInspired.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Visualization */}
          <div className="order-2 lg:order-1">
            <MyceliumVisualization />
          </div>

          {/* Features */}
          <div className="order-1 lg:order-2 space-y-6">
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Learning from Nature&apos;s Networks
            </h3>
            {features.map((feature, index) => (
              <FeatureItem key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* Reflexive Loop Section */}
        <div className="bg-surface rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {reflexiveLoop.title}
            </h3>
            <p className="text-muted max-w-2xl mx-auto">
              {reflexiveLoop.description}
            </p>
          </div>

          {/* Loop Steps */}
          <div className="grid md:grid-cols-4 gap-6">
            {reflexiveLoop.steps.map((step: { step: number; title: string; description: string; icon: string }, index: number) => (
              <div key={index} className="relative">
                {/* Connector arrow (except for last item) */}
                {index < reflexiveLoop.steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-3 text-primary/30">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}

                <div className="text-center">
                  {/* Step number */}
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">{index + 1}</span>
                  </div>

                  {/* Step name */}
                  <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>

                  {/* Step description */}
                  <p className="text-sm text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Loop indicator */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 text-sm text-muted">
              <svg className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '3s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Continuous reflexive cycle</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
