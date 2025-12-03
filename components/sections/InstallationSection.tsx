'use client';

import { useState } from 'react';
import CodeBlock, { TerminalBlock } from '@/components/CodeBlock';

// ===== OpenWrt Configuration =====

const OPENWRT_CONFIG = {
  name: 'OpenWrt',
  version: '21.02+',
  commands: {
    install: [
      '# Update package list',
      'opkg update',
      '',
      '# Install MycoFlow and dependencies',
      'opkg install mycoflow luci-app-mycoflow',
      '',
      '# Initialize configuration',
      'mycoflow init',
      '',
      '# Enable and start service',
      '/etc/init.d/mycoflow enable',
      '/etc/init.d/mycoflow start',
    ],
    verify: [
      '# Check service status',
      'mycoflow status',
      '',
      '# View real-time metrics',
      'mycoflow stats --live',
    ],
  },
  requirements: [
    { label: 'OpenWrt Version', value: '21.02 or newer' },
    { label: 'RAM', value: '128MB minimum (256MB recommended)' },
    { label: 'Storage', value: '10MB free space' },
    { label: 'Kernel', value: 'Linux 5.4+ with eBPF support' },
  ],
  features: [
    'LuCI web interface integration',
    'Real-time traffic visualization',
    'Automatic CAKE QoS configuration',
    'Per-device bandwidth management',
  ],
};

// ===== Installation Steps =====

const STEPS = [
  {
    number: 1,
    title: 'Install Package',
    description: 'Use opkg to install MycoFlow and its LuCI interface.',
    command: 'opkg install mycoflow luci-app-mycoflow',
  },
  {
    number: 2,
    title: 'Initialize',
    description: 'Run init to detect your network interfaces and create default config.',
    command: 'mycoflow init',
  },
  {
    number: 3,
    title: 'Start Service',
    description: 'Enable the service to start automatically on boot.',
    command: '/etc/init.d/mycoflow enable && /etc/init.d/mycoflow start',
  },
  {
    number: 4,
    title: 'Access LuCI',
    description: "Open your router's web interface to configure MycoFlow.",
    command: null,
  },
];

// ===== Config Example =====

const CONFIG_EXAMPLE = `# /etc/config/mycoflow
# MycoFlow UCI Configuration

config mycoflow 'global'
    option enabled '1'
    option log_level 'info'
    option interface 'wan'
    option download_bw '100mbit'
    option upload_bw '20mbit'

config classification 'gaming'
    option enabled '1'
    option priority 'high'
    list ports '3074'
    list ports '3478-3480'

config classification 'streaming'
    option enabled '1'
    option priority 'medium'
    list hosts '*.netflix.com'
    list hosts '*.youtube.com'

config adaptation 'settings'
    option sensitivity '0.7'
    option learning_rate '0.1'
    option decay_factor '0.95'
    option hysteresis '3'`;

// ===== Step Card =====

interface StepCardProps {
  step: typeof STEPS[0];
}

function StepCard({ step }: StepCardProps) {
  return (
    <div className="flex gap-4 group">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors">
        {step.number}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
        <p className="text-sm text-muted mb-2">{step.description}</p>
        {step.command && (
          <code className="text-xs text-primary/80 bg-primary/5 px-2 py-1 rounded font-mono">
            {step.command}
          </code>
        )}
      </div>
    </div>
  );
}

// ===== Main Component =====

export default function InstallationSection() {
  const [showConfig, setShowConfig] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'verify'>('install');

  return (
    <section id="installation" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Quick Start
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Install on OpenWrt
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            MycoFlow is distributed as an OpenWrt package. Install it on your router and start optimizing your network in minutes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left: Terminal + Requirements */}
          <div className="space-y-6">
            {/* Tab Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('install')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'install'
                    ? 'bg-primary text-white'
                    : 'bg-background text-muted hover:text-foreground'
                }`}
              >
                📦 Installation
              </button>
              <button
                onClick={() => setActiveTab('verify')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === 'verify'
                    ? 'bg-primary text-white'
                    : 'bg-background text-muted hover:text-foreground'
                }`}
              >
                ✅ Verify
              </button>
            </div>

            {/* Terminal Commands */}
            <TerminalBlock
              commands={activeTab === 'install' ? OPENWRT_CONFIG.commands.install : OPENWRT_CONFIG.commands.verify}
              title={activeTab === 'install' ? 'OpenWrt SSH Terminal' : 'Verify Installation'}
            />

            {/* One-liner */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                🚀 Quick Install (One-liner)
              </h4>
              <code className="text-sm text-primary font-mono block overflow-x-auto whitespace-nowrap">
                wget -O- https://get.mycoflow.io/openwrt | sh
              </code>
              <p className="text-xs text-muted mt-2">
                Automatically detects your OpenWrt version and installs the correct package.
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-background rounded-xl p-5 border border-border">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                System Requirements
              </h4>
              <div className="grid gap-3">
                {OPENWRT_CONFIG.requirements.map((req, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-muted">{req.label}</span>
                    <span className="font-medium text-foreground">{req.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Steps + Config */}
          <div className="space-y-6">
            {/* Installation Steps */}
            <div className="bg-background rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  📋
                </span>
                Installation Steps
              </h3>
              <div className="space-y-6">
                {STEPS.map((step) => (
                  <StepCard key={step.number} step={step} />
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-5 border border-border">
              <h4 className="font-semibold text-foreground mb-3">✨ What&apos;s Included</h4>
              <ul className="space-y-2">
                {OPENWRT_CONFIG.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Configuration Toggle */}
            <div>
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <svg 
                  className={`w-4 h-4 transition-transform ${showConfig ? 'rotate-90' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showConfig ? 'Hide' : 'Show'} UCI Configuration Example
              </button>

              {showConfig && (
                <div className="mt-4">
                  <CodeBlock
                    code={CONFIG_EXAMPLE}
                    language="conf"
                    filename="/etc/config/mycoflow"
                    showLineNumbers
                  />
                </div>
              )}
            </div>

            {/* Help Links */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
              <a
                href="https://github.com/bariscanatakli/MycoFlow/wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Documentation
              </a>
              <a
                href="https://github.com/bariscanatakli/MycoFlow/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Get Help
              </a>
              <a
                href="https://github.com/bariscanatakli/MycoFlow"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
