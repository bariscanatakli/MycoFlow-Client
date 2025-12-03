'use client';

import { siteContent } from '@/lib/content/mockData';

// ===== Problem Card Component =====

interface ProblemCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  stat: string;
  statLabel: string;
  color: 'red' | 'orange' | 'yellow';
}

function ProblemCard({ title, description, icon, stat, statLabel, color }: ProblemCardProps) {
  const colorClasses = {
    red: 'border-red-500/30 bg-red-500/5 hover:border-red-500/50',
    orange: 'border-orange-500/30 bg-orange-500/5 hover:border-orange-500/50',
    yellow: 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50',
  };

  const iconColorClasses = {
    red: 'text-red-500 bg-red-500/10',
    orange: 'text-orange-500 bg-orange-500/10',
    yellow: 'text-yellow-500 bg-yellow-500/10',
  };

  const statColorClasses = {
    red: 'text-red-500',
    orange: 'text-orange-500',
    yellow: 'text-yellow-500',
  };

  return (
    <div
      className={`
        relative p-6 rounded-2xl border transition-all duration-300
        ${colorClasses[color]}
        hover:scale-[1.02] hover:shadow-lg
      `}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconColorClasses[color]}`}>
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>

      {/* Description */}
      <p className="text-muted text-sm leading-relaxed mb-4">{description}</p>

      {/* Stat */}
      <div className="pt-4 border-t border-border/50">
        <span className={`text-2xl font-bold font-mono ${statColorClasses[color]}`}>{stat}</span>
        <span className="text-xs text-muted ml-2">{statLabel}</span>
      </div>
    </div>
  );
}

// ===== Icons =====

const icons = {
  latency: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  jitter: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  packetLoss: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
};

// ===== Main Component =====

export default function ProblemSection() {
  const { problem } = siteContent;

  const problems = [
    {
      title: 'High Latency',
      description: 'Traditional QoS systems react too slowly to network changes, causing delays that frustrate users and break real-time applications.',
      icon: icons.latency,
      stat: '150ms+',
      statLabel: 'average response delay',
      color: 'red' as const,
    },
    {
      title: 'Unpredictable Jitter',
      description: 'Inconsistent packet delivery times create stuttering in video calls, gaming lag, and unreliable VoIP connections.',
      icon: icons.jitter,
      stat: '25ms',
      statLabel: 'variation in latency',
      color: 'orange' as const,
    },
    {
      title: 'Packet Loss',
      description: 'Network congestion and poor routing decisions lead to dropped packets, requiring costly retransmissions and degraded quality.',
      icon: icons.packetLoss,
      stat: '2-5%',
      statLabel: 'packets dropped',
      color: 'yellow' as const,
    },
  ];

  return (
    <section id="problem" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            {problem.sectionTitle}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {problem.headline}
          </h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            {problem.description}
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {problems.map((item, index) => (
            <ProblemCard key={index} {...item} />
          ))}
        </div>

        {/* Impact Statement */}
        <div className="relative p-8 rounded-2xl bg-gradient-to-r from-red-500/5 via-orange-500/5 to-yellow-500/5 border border-border">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                The Real Cost
              </h3>
              <p className="text-muted">
                Poor network quality leads to frustrating video calls, laggy games, and slow downloads—all at the same time. 
                Traditional static QoS policies simply cannot adapt to the dynamic nature of modern home network traffic.
              </p>
            </div>
            <div className="flex-shrink-0 text-center">
              <div className="text-4xl font-bold text-accent">100ms+</div>
              <div className="text-sm text-muted">added latency</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
