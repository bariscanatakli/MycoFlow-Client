'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Three.js visualization
const AdaptiveNetwork = dynamic(
  () => import('@/components/three/AdaptiveNetwork'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
);

// Phase descriptions with enhanced metadata
const PHASES = {
  idle: {
    title: 'Normal Operation',
    description: 'Network is balanced. All devices receive fair bandwidth allocation.',
    color: 'text-muted',
    bgColor: 'bg-muted/10',
    borderColor: 'border-muted/30',
    emoji: '✅',
    step: 0,
  },
  stress: {
    title: 'Stress Detected',
    description: 'A device experiences increased demand (latency spike, packet loss). Local sensors detect the anomaly.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    emoji: '⚠️',
    step: 1,
  },
  sensing: {
    title: 'Sensing & Classification',
    description: 'eBPF probes measure RTT, jitter, and flow patterns. Traffic is classified by type (gaming, video, bulk).',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    emoji: '📡',
    step: 2,
  },
  adapting: {
    title: 'Resource Redistribution',
    description: 'Like mycelium redirecting nutrients, bandwidth is reallocated. CAKE tin shares adjust dynamically.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    emoji: '🔄',
    step: 3,
  },
  stable: {
    title: 'Stabilization',
    description: 'Hysteresis prevents oscillation. The network settles into a new, optimized state.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    emoji: '🎯',
    step: 4,
  },
};

// Timeline steps for progress indicator
const TIMELINE_STEPS = ['Idle', 'Detect', 'Sense', 'Adapt', 'Stable'];

// Mycelium principles
const PRINCIPLES = [
  {
    bio: 'Local Sensing',
    bioDesc: 'Hyphal tips detect nutrient gradients locally',
    tech: 'eBPF Probes',
    techDesc: 'Kernel-space packet inspection measures RTT/jitter per-flow',
    icon: '📡',
  },
  {
    bio: 'Resource Translocation',
    bioDesc: 'Nutrients flow towards areas of need',
    tech: 'CAKE Tin Rebalancing',
    techDesc: 'Bandwidth reallocated based on real-time demand',
    icon: '🔄',
  },
  {
    bio: 'Path Strengthening',
    bioDesc: 'Used pathways grow thicker, unused ones atrophy',
    tech: 'Dynamic DSCP Marking',
    techDesc: 'Priority flows get stronger QoS guarantees',
    icon: '💪',
  },
  {
    bio: 'Hysteresis',
    bioDesc: 'Structural stability prevents rapid changes',
    tech: 'EWMA Filtering',
    techDesc: 'Smoothed metrics prevent policy flapping',
    icon: '⚖️',
  },
];

export default function HowItWorksSection() {
  const [currentPhase, setCurrentPhase] = useState<keyof typeof PHASES>('idle');
  const phase = PHASES[currentPhase];

  // Track phase changes for visual feedback
  const handlePhaseChange = (p: string) => {
    const newPhase = p as keyof typeof PHASES;
    setCurrentPhase(newPhase);
  };
  
  return (
    <section id="how-it-works" className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Bio-Inspired Design
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How Mycelium Networks Learn
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Fungal networks have evolved over 1 billion years to efficiently distribute resources.
            MycoFlow applies these principles to network traffic management.
          </p>
        </div>

        {/* Interactive Demo */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* 3D Visualization */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-bg-dark to-primary/5 border border-border">
              {/* Three.js Canvas */}
              <div className="w-full h-full">
                <AdaptiveNetwork
                  onPhaseChange={handlePhaseChange}
                  simulationSpeed={1}
                />
              </div>
            </div>

            {/* Phase + Timeline - Clean layout below canvas */}
            <div className="mt-4 p-4 bg-surface/50 rounded-xl border border-border">
              {/* Current Phase */}
              <div className={`flex items-center justify-center gap-3 mb-4 pb-4 border-b border-border`}>
                <span className="text-2xl">{phase.emoji}</span>
                <div>
                  <span className={`font-bold text-lg ${phase.color}`}>{phase.title}</span>
                  <p className="text-xs text-muted">{phase.description}</p>
                </div>
              </div>
              
              {/* Step Indicators */}
              <div className="flex items-center justify-between">
                {TIMELINE_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          i <= phase.step 
                            ? `${phase.color.replace('text-', 'bg-')} text-white` 
                            : 'bg-muted/20 text-muted'
                        } ${i === phase.step ? 'ring-2 ring-offset-2 ring-offset-surface scale-110 ' + phase.color.replace('text-', 'ring-') : ''}`}
                      >
                        {i < phase.step ? '✓' : i + 1}
                      </div>
                      <span className={`mt-2 text-xs font-medium ${i <= phase.step ? phase.color : 'text-muted'}`}>
                        {step}
                      </span>
                    </div>
                    {i < TIMELINE_STEPS.length - 1 && (
                      <div className="flex-1 mx-2 h-1 rounded-full bg-muted/20 overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${i < phase.step ? phase.color.replace('text-', 'bg-') : ''}`}
                          style={{ width: i < phase.step ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Instruction */}
              <p className="text-center text-xs text-muted mt-4">
                👆 Click on Gaming or Video node above to simulate network stress
              </p>
            </div>
          </div>

          {/* Explanation Panel */}
          <div className="flex flex-col justify-center space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              The Reflexive Control Loop
            </h3>
            <p className="text-muted">
              Just like mycelium continuously senses and responds to its environment,
              MycoFlow runs a 100ms feedback loop that:
            </p>
            
            {/* Steps - Enhanced with better visual feedback */}
            <div className="space-y-4">
              {[
                { step: 1, title: 'Sense', desc: 'eBPF hooks measure RTT, jitter, loss per-flow', icon: '📡', phases: ['sensing'] },
                { step: 2, title: 'Classify', desc: 'Heuristics identify traffic type from packet patterns', icon: '🏷️', phases: ['sensing'] },
                { step: 3, title: 'React', desc: 'CAKE tin shares adjusted via tc-netlink', icon: '⚡', phases: ['adapting'] },
                { step: 4, title: 'Stabilize', desc: 'EWMA filtering prevents oscillation', icon: '📈', phases: ['stable'] },
              ].map((item, i) => {
                const isActive = item.phases.includes(currentPhase);
                return (
                <div 
                  key={i}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-500 ${
                    isActive
                      ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/10'
                      : 'border-border bg-surface/50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all duration-300 ${isActive ? 'bg-primary text-white' : 'bg-primary/10'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono transition-colors ${isActive ? 'text-primary font-bold' : 'text-primary/70'}`}>Step {item.step}</span>
                      <span className="font-semibold text-foreground">{item.title}</span>
                      {isActive && <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary animate-pulse">Active</span>}
                    </div>
                    <p className="text-sm text-muted">{item.desc}</p>
                  </div>
                </div>
              );
              })}
            </div>
          </div>
        </div>

        {/* Principles Mapping */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-foreground text-center mb-10">
            Biology → Technology Mapping
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRINCIPLES.map((p, i) => (
              <div 
                key={i}
                className="relative p-6 rounded-2xl border border-border bg-surface/50 hover:border-primary/50 transition-all group"
              >
                {/* Icon */}
                <div className="text-3xl mb-4">{p.icon}</div>
                
                {/* Bio side */}
                <div className="mb-4 pb-4 border-b border-border/50">
                  <span className="text-xs text-muted uppercase tracking-wider">Biology</span>
                  <h4 className="font-semibold text-foreground">{p.bio}</h4>
                  <p className="text-sm text-muted">{p.bioDesc}</p>
                </div>
                
                {/* Tech side */}
                <div>
                  <span className="text-xs text-primary uppercase tracking-wider">MycoFlow</span>
                  <h4 className="font-semibold text-foreground">{p.tech}</h4>
                  <p className="text-sm text-muted">{p.techDesc}</p>
                </div>
                
                {/* Arrow connector */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Deep Dive Link */}
        <div className="mt-16 text-center">
          <a 
            href="#demo" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors"
          >
            <span>See live network telemetry</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
