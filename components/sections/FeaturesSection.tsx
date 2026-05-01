'use client';

import { siteContent } from '@/lib/content/mockData';
import { QOS_TIERS, QoSTier } from '@/lib/content/schema';
import { useStaggeredReveal } from '@/lib/hooks';

// ===== QoS Tier Card =====

interface TierCardProps {
  tier: QoSTier;
  isHighlighted?: boolean;
}

function TierCard({ tier, isHighlighted }: TierCardProps) {
  const colorMap: Record<string, string> = {
    '#ef4444': 'from-red-500 to-red-600',
    '#f97316': 'from-orange-500 to-orange-600',
    '#eab308': 'from-yellow-500 to-yellow-600',
    '#22c55e': 'from-green-500 to-green-600',
  };

  const bgColorMap: Record<string, string> = {
    '#ef4444': 'bg-red-500/10 border-red-500/30',
    '#f97316': 'bg-orange-500/10 border-orange-500/30',
    '#eab308': 'bg-yellow-500/10 border-yellow-500/30',
    '#22c55e': 'bg-green-500/10 border-green-500/30',
  };

  return (
    <div
      className={`
        relative p-6 rounded-2xl border transition-all duration-300
        ${bgColorMap[tier.color] || 'bg-surface border-border'}
        ${isHighlighted ? 'scale-105 shadow-xl' : 'hover:scale-[1.02]'}
      `}
    >
      {/* Priority badge */}
      <div className={`absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r ${colorMap[tier.color] || 'from-gray-500 to-gray-600'} text-white text-xs font-medium`}>
        Priority {tier.priority}
      </div>

      {/* Tier name */}
      <h3 className="text-xl font-bold text-foreground mt-2 mb-3">{tier.name}</h3>

      {/* Description */}
      <p className="text-sm text-muted">{tier.description}</p>
    </div>
  );
}

// ===== Feature Card =====

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function FeatureCard({ title, description, icon, index = 0 }: FeatureCardProps & { index?: number }) {
  return (
    <div 
      className="group p-6 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
    </div>
  );
}

// ===== Main Component =====

export default function FeaturesSection() {
  const { personas } = siteContent;

  const features = [
    {
      title: 'Adaptive Routing',
      description: 'Dynamically reroute traffic based on real-time network conditions and application requirements.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      title: 'Self-Healing Networks',
      description: 'Automatic failover and recovery without manual intervention or service disruption.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: 'Intelligent Prioritization',
      description: 'Machine learning classifies traffic and assigns appropriate QoS tiers automatically.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Real-time Analytics',
      description: 'Comprehensive visibility into network performance with actionable insights.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: 'Zero-Config Deployment',
      description: 'Drop-in solution that learns your network topology and optimizes automatically.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
    {
      title: 'API-First Design',
      description: 'Comprehensive REST and WebSocket APIs for seamless integration with existing tools.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      title: 'Adaptive Baseline Learning',
      description: 'Sliding EWMA baseline (decay=0.01) refreshes every 60 cycles. Thresholds adapt to your actual ISP conditions — no manual tuning.',
      icon: <span className="text-xl">🧠</span>,
    },
    {
      title: 'Zero Flash Writes',
      description: 'All state lives in tmpfs (/tmp) or RAM buffers. No SD card / NAND wear. Safe for routers with limited write cycles.',
      icon: <span className="text-xl">🔒</span>,
    },
    {
      title: 'DNS-Based Classification',
      description: '585-entry domain catalog supplements flow heuristics. Streaming services, gaming platforms, and CDNs identified at DNS resolution time.',
      icon: <span className="text-xl">🗂️</span>,
    },
    {
      title: 'Per-Device DSCP',
      description: 'Each device gets its own persona based on its flow patterns. Gamer and remote-worker on the same WiFi network — both get optimal treatment.',
      icon: <span className="text-xl">📱</span>,
    },
  ];

  const tiers = Object.values(QOS_TIERS);
  const [featuresRef, featuresVisible] = useStaggeredReveal(features.length, 100);
  const [tiersRef, tiersVisible] = useStaggeredReveal(tiers.length, 150);
  const [personasRef, personasVisible] = useStaggeredReveal(personas.personas.length, 150);

  return (
    <section id="features" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            MycoFlow provides a comprehensive suite of tools for modern network QoS management.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`transform transition-all duration-500 ${
                featuresVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <FeatureCard {...feature} index={index} />
            </div>
          ))}
        </div>

        {/* QoS Tiers Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              QoS Tiers
            </h3>
            <p className="text-muted max-w-2xl mx-auto">
              Four intelligent tiers that automatically classify and prioritize your traffic.
            </p>
          </div>

          <div ref={tiersRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`transform transition-all duration-500 ${
                  tiersVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <TierCard tier={tier} isHighlighted={tier.priority === 1} />
              </div>
            ))}
          </div>
        </div>

        {/* Personas Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Built for Everyone
            </h3>
            <p className="text-muted max-w-2xl mx-auto">
              Six traffic personas auto-detected in real time. Each device gets optimal treatment.
            </p>
          </div>

          <div ref={personasRef} className="grid md:grid-cols-3 gap-6">
            {personas.personas.map((persona, index) => (
              <div 
                key={index} 
                className={`p-6 rounded-2xl bg-background border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-500 ${
                  personasVisible[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="text-3xl mb-4">{persona.avatar}</div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{persona.role}</h4>
                <p className="text-sm text-muted mb-4">{persona.scenario}</p>
                <div className="pt-4 border-t border-border">
                  <span className="text-xs text-primary font-medium">MycoFlow Benefit:</span>
                  <p className="text-sm text-foreground mt-1">{persona.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
