'use client';

import { useMockMetrics } from '@/lib/content/Provider';

// ===== Metric Card Component =====

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'primary' | 'accent' | 'success' | 'warning';
  trend?: 'up' | 'down' | 'stable';
}

function MetricCard({ label, value, icon, color, trend }: MetricCardProps) {
  const colorClasses = {
    primary: 'border-primary/30 bg-primary/5',
    accent: 'border-accent/30 bg-accent/5',
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
  };

  const valueColorClasses = {
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-success',
    warning: 'text-warning',
  };

  const trendIcons = {
    up: (
      <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="w-3 h-3 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    stable: (
      <svg className="w-3 h-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  };

  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl border p-4 
        ${colorClasses[color]}
        transition-all duration-300 hover:scale-105 hover:shadow-lg
      `}
    >
      {/* Icon */}
      <div className="flex items-center justify-between mb-2">
        <span className={`${valueColorClasses[color]}`}>
          {icon}
        </span>
        {trend && (
          <span className="flex items-center gap-1">
            {trendIcons[trend]}
          </span>
        )}
      </div>
      
      {/* Value */}
      <div className={`text-2xl font-bold font-mono ${valueColorClasses[color]}`}>
        {value}
      </div>
      
      {/* Label */}
      <div className="text-sm text-muted mt-1">
        {label}
      </div>
      
      {/* Animated pulse effect */}
      <div 
        className={`
          absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-10
          ${color === 'primary' ? 'bg-primary' : ''}
          ${color === 'accent' ? 'bg-accent' : ''}
          ${color === 'success' ? 'bg-success' : ''}
          ${color === 'warning' ? 'bg-warning' : ''}
          animate-pulse
        `}
      />
    </div>
  );
}

// ===== Icons =====

const icons = {
  rtt: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  jitter: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  packetLoss: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  throughput: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  queueDepth: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  ),
  cpu: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
};

// ===== Main MetricsPanel Component =====

interface MetricsPanelProps {
  className?: string;
  compact?: boolean;
}

export default function MetricsPanel({ className = '', compact = false }: MetricsPanelProps) {
  const { formatted, isLive, toggleLive } = useMockMetrics();

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-success animate-pulse' : 'bg-muted'}`} />
          <span className="text-sm font-medium text-foreground">
            {isLive ? 'Live Telemetry' : 'Paused'}
          </span>
        </div>
        
        <button
          onClick={toggleLive}
          className="text-xs px-3 py-1 rounded-full border border-border hover:bg-surface transition-colors"
        >
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Metrics Grid */}
      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
        <MetricCard
          label="Round Trip Time"
          value={formatted.rtt}
          icon={icons.rtt}
          color="primary"
          trend="stable"
        />
        
        <MetricCard
          label="Jitter"
          value={formatted.jitter}
          icon={icons.jitter}
          color="success"
          trend="down"
        />
        
        <MetricCard
          label="Packet Loss"
          value={formatted.packetLoss}
          icon={icons.packetLoss}
          color={parseFloat(formatted.packetLoss) > 1 ? 'warning' : 'success'}
          trend="stable"
        />
        
        <MetricCard
          label="Throughput"
          value={formatted.throughput}
          icon={icons.throughput}
          color="primary"
          trend="up"
        />
        
        {!compact && (
          <>
            <MetricCard
              label="Queue Depth"
              value={formatted.queueDepth}
              icon={icons.queueDepth}
              color="accent"
              trend="stable"
            />
            
            <MetricCard
              label="CPU Usage"
              value={formatted.cpuUsage}
              icon={icons.cpu}
              color={parseFloat(formatted.cpuUsage) > 70 ? 'warning' : 'success'}
              trend="stable"
            />
          </>
        )}
      </div>
    </div>
  );
}
