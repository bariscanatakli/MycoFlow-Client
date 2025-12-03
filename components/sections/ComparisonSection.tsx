'use client';

import { useState, useEffect } from 'react';
import { beforeMycoFlow, afterMycoFlow } from '@/lib/content/mockData';
import { useScrollReveal } from '@/lib/hooks';

// ===== Animated Comparison Bar =====

interface AnimatedBarProps {
  label: string;
  beforeValue: number;
  afterValue: number;
  maxValue: number;
  unit: string;
  isLowerBetter?: boolean;
  isVisible: boolean;
  delay: number;
}

function AnimatedBar({ label, beforeValue, afterValue, maxValue, unit, isLowerBetter = true, isVisible, delay }: AnimatedBarProps) {
  const [animate, setAnimate] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setAnimate(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  const beforePercent = (beforeValue / maxValue) * 100;
  const afterPercent = (afterValue / maxValue) * 100;
  const improvement = isLowerBetter 
    ? Math.round(((beforeValue - afterValue) / beforeValue) * 100)
    : Math.round(((afterValue - beforeValue) / beforeValue) * 100);

  return (
    <div className={`space-y-3 transition-all duration-700 ${animate ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            isLowerBetter ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
          }`}>
            {isLowerBetter ? '↓' : '↑'} {improvement}% {isLowerBetter ? 'lower' : 'higher'}
          </span>
        </div>
      </div>
      
      {/* Before/After stacked bars */}
      <div className="space-y-2">
        {/* Before */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-red-400 w-12">Before</span>
          <div className="flex-1 h-6 bg-surface rounded-lg overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-400 rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-2"
              style={{ width: animate ? `${beforePercent}%` : '0%' }}
            >
              <span className="text-xs font-mono text-white font-semibold">
                {beforeValue}{unit}
              </span>
            </div>
          </div>
        </div>
        
        {/* After */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-green-400 w-12">After</span>
          <div className="flex-1 h-6 bg-surface rounded-lg overflow-hidden relative">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-2"
              style={{ 
                width: animate ? `${afterPercent}%` : '0%',
                transitionDelay: '300ms'
              }}
            >
              <span className="text-xs font-mono text-white font-semibold">
                {afterValue}{unit}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Animated Stat Card =====

interface StatCardProps {
  value: number;
  suffix: string;
  label: string;
  color: 'primary' | 'success' | 'accent';
  isVisible: boolean;
  delay: number;
}

function StatCard({ value, suffix, label, color, isVisible, delay }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimate(true);
        const duration = 2000;
        const startTime = Date.now();
        
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(Math.floor(value * easeOut));
          
          if (progress >= 1) clearInterval(interval);
        }, 16);
        
        return () => clearInterval(interval);
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, value, delay]);

  const colorClasses = {
    primary: 'bg-primary/5 border-primary/20 text-primary',
    success: 'bg-success/5 border-success/20 text-success',
    accent: 'bg-accent/5 border-accent/20 text-accent',
  };

  return (
    <div 
      className={`text-center p-8 rounded-2xl border transition-all duration-700 ${colorClasses[color]} ${
        animate ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
      }`}
    >
      <div className="text-5xl font-bold mb-2">
        {displayValue}{suffix}
      </div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
}

// ===== Before/After Toggle =====

function BeforeAfterToggle() {
  const [showAfter, setShowAfter] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAfter(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-surface rounded-2xl p-8 border border-border overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setShowAfter(false)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            !showAfter ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500'
          }`}
        >
          Before
        </button>
        <button
          onClick={() => setShowAfter(true)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            showAfter ? 'bg-green-500 text-white' : 'bg-green-500/10 text-green-500'
          }`}
        >
          After
        </button>
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-8">Network Status</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'RTT', before: '45ms', after: '12ms' },
          { label: 'Jitter', before: '15ms', after: '2.3ms' },
          { label: 'Loss', before: '2.5%', after: '0.1%' },
          { label: 'Throughput', before: '71%', after: '100%' },
        ].map((stat, i) => (
          <div key={i} className="text-center p-4 rounded-xl bg-background">
            <div className={`text-2xl font-bold transition-all duration-500 ${
              showAfter ? 'text-green-500' : 'text-red-500'
            }`}>
              {showAfter ? stat.after : stat.before}
            </div>
            <div className="text-xs text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Visual indicator */}
      <div className="mt-6 flex justify-center">
        <div className="flex gap-2">
          <div className={`w-2 h-2 rounded-full transition-all ${!showAfter ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`w-2 h-2 rounded-full transition-all ${showAfter ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </div>
    </div>
  );
}

// ===== Main Component =====

export default function ComparisonSection() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  const metrics = [
    {
      label: 'Round Trip Time',
      before: beforeMycoFlow.rtt,
      after: afterMycoFlow.rtt,
      unit: 'ms',
      maxValue: 100,
      isLowerBetter: true,
    },
    {
      label: 'Jitter',
      before: beforeMycoFlow.jitter,
      after: afterMycoFlow.jitter,
      unit: 'ms',
      maxValue: 30,
      isLowerBetter: true,
    },
    {
      label: 'Packet Loss',
      before: beforeMycoFlow.packetLoss,
      after: afterMycoFlow.packetLoss,
      unit: '%',
      maxValue: 5,
      isLowerBetter: true,
    },
    {
      label: 'Throughput Efficiency',
      before: beforeMycoFlow.throughput,
      after: afterMycoFlow.throughput,
      unit: '%',
      maxValue: 100,
      isLowerBetter: false,
    },
    {
      label: 'Queue Depth',
      before: beforeMycoFlow.queueDepth,
      after: afterMycoFlow.queueDepth,
      unit: '%',
      maxValue: 100,
      isLowerBetter: true,
    },
  ];

  return (
    <section id="metrics" className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Expected Results
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Before vs After MycoFlow
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Projected performance improvements based on simulation data and QoS research.
          </p>
        </div>

        {/* Before/After Toggle Card */}
        <div className="mb-12">
          <BeforeAfterToggle />
        </div>

        {/* Animated Comparison Bars */}
        <div ref={ref} className="bg-surface rounded-2xl p-8 border border-border mb-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-foreground">Performance Breakdown</h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-red-400" />
                <span className="text-sm text-muted">Before MycoFlow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-400" />
                <span className="text-sm text-muted">After MycoFlow</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {metrics.map((metric, index) => (
              <AnimatedBar
                key={index}
                label={metric.label}
                beforeValue={metric.before}
                afterValue={metric.after}
                maxValue={metric.maxValue}
                unit={metric.unit}
                isLowerBetter={metric.isLowerBetter}
                isVisible={isVisible}
                delay={index * 200}
              />
            ))}
          </div>
        </div>

        {/* Animated Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard
            value={73}
            suffix="%"
            label="Average Latency Reduction"
            color="primary"
            isVisible={isVisible}
            delay={0}
          />
          <StatCard
            value={96}
            suffix="%"
            label="Packet Loss Reduction"
            color="success"
            isVisible={isVisible}
            delay={200}
          />
          <StatCard
            value={41}
            suffix="%"
            label="Throughput Increase"
            color="accent"
            isVisible={isVisible}
            delay={400}
          />
        </div>

        {/* Platform info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted mb-4">Based on simulation data • Currently in development for OpenWrt</p>
          <div className="flex justify-center gap-2 items-center">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">OpenWrt 21.02+</span>
            <span className="text-xs text-muted">More platforms coming soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
