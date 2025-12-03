/**
 * MycoFlow Landing Page - Content & Mock Data
 * 
 * Static content and demo telemetry data.
 * No real router connection - all data is simulated.
 */

import type { ContentSchema, TelemetryMetrics, TELEMETRY_RANGES } from './schema';

// ===== Helper Functions =====

/**
 * Adds random variance to a value
 */
export function addVariance(value: number, variance: number): number {
  return value + (Math.random() - 0.5) * 2 * variance;
}

/**
 * Clamps value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Returns health status based on metric values
 */
export function getHealthStatus(metrics: TelemetryMetrics): 'healthy' | 'warning' | 'critical' {
  if (metrics.rtt > 25 || metrics.jitter > 6 || metrics.packetLoss > 2) {
    return 'critical';
  }
  if (metrics.rtt > 18 || metrics.jitter > 3.5 || metrics.packetLoss > 0.5) {
    return 'warning';
  }
  return 'healthy';
}

/**
 * Updates mock telemetry values with variance
 */
export function updateTelemetry(
  current: TelemetryMetrics,
  ranges: typeof TELEMETRY_RANGES
): TelemetryMetrics {
  return {
    rtt: clamp(addVariance(current.rtt, ranges.rtt.variance), ranges.rtt.min, ranges.rtt.max),
    jitter: clamp(addVariance(current.jitter, ranges.jitter.variance), ranges.jitter.min, ranges.jitter.max),
    packetLoss: clamp(addVariance(current.packetLoss, ranges.packetLoss.variance), ranges.packetLoss.min, ranges.packetLoss.max),
    throughput: clamp(addVariance(current.throughput, ranges.throughput.variance), ranges.throughput.min, ranges.throughput.max),
    queueDepth: clamp(addVariance(current.queueDepth, ranges.queueDepth.variance), ranges.queueDepth.min, ranges.queueDepth.max),
    cpuUsage: clamp(addVariance(current.cpuUsage, ranges.cpuUsage.variance), ranges.cpuUsage.min, ranges.cpuUsage.max),
  };
}

// ===== Site Content =====

export const siteContent: ContentSchema = {
  meta: {
    title: 'MycoFlow - Adaptive QoS for OpenWrt Routers',
    description: 'Bio-inspired, reflexive Quality of Service system that runs directly on your OpenWrt router. Automatic traffic prioritization with zero configuration.',
    keywords: ['QoS', 'OpenWrt', 'CAKE', 'eBPF', 'router', 'network', 'traffic shaping', 'bufferbloat'],
  },

  hero: {
    badge: 'OpenWrt Package',
    title: 'MycoFlow',
    subtitle: 'Adaptive QoS That Runs on Your Router',
    description: 'A lightweight daemon for OpenWrt routers that automatically prioritizes network traffic. Uses eBPF for real-time telemetry and CAKE for queue management. No cloud, no config files, no manual rules.',
    primaryCTA: {
      label: 'See It In Action',
      href: '#demo',
      variant: 'primary',
    },
    secondaryCTA: {
      label: 'How It Works',
      href: '#how-it-works',
      variant: 'secondary',
    },
  },

  problem: {
    sectionTitle: 'The Problem',
    headline: 'Static QoS Fails Modern Networks',
    description: 'Traditional CAKE configurations use fixed bandwidth allocations. They cannot adapt to encrypted traffic patterns, changing network loads, or device behavior.',
    points: [
      {
        icon: '⚙️',
        title: 'Static Configuration',
        description: 'Fixed queue weights and DSCP mappings cannot respond to congestion spikes or traffic pattern changes.',
      },
      {
        icon: '🔒',
        title: 'Encrypted Traffic Blindness',
        description: 'Port-based classification fails with QUIC, HTTPS, and VPNs. Everything looks the same to the router.',
      },
      {
        icon: '📊',
        title: 'No Visibility',
        description: 'Users have no insight into queue depths, per-flow latency, or how bandwidth is actually being allocated.',
      },
      {
        icon: '🔧',
        title: 'Expert Knowledge Required',
        description: 'Tuning CAKE parameters requires deep understanding of tc, qdiscs, and traffic classification.',
      },
    ],
  },

  solution: {
    bioInspired: {
      title: 'Bio-Inspired Design',
      subtitle: 'Lessons from Mycelial Networks',
      description: 'Fungal mycelium networks dynamically redistribute nutrients based on local sensing and feedback. MycoFlow applies the same principles to network traffic.',
      analogy: {
        natural: 'Mycelium detects nutrient stress at hyphal tips and redirects resources within milliseconds.',
        technical: 'MycoFlow senses RTT spikes via eBPF probes and adjusts CAKE tin priorities in real-time.',
      },
      features: [
        {
          icon: '📡',
          title: 'Local Sensing',
          description: 'eBPF programs measure RTT, jitter, and packet loss per-flow without leaving kernel space.',
          highlight: true,
        },
        {
          icon: '🔄',
          title: 'Reflexive Control',
          description: 'Hysteresis-based feedback loop prevents oscillation while enabling fast adaptation.',
        },
        {
          icon: '🎯',
          title: 'Persona Inference',
          description: 'Heuristics classify flows as gaming, video, bulk, or background based on packet patterns.',
        },
      ],
    },
    reflexiveLoop: {
      title: 'The Reflexive Loop',
      description: 'MycoFlow runs a continuous sense-react cycle that adapts to network conditions in 100ms intervals.',
      steps: [
        {
          step: 1,
          title: 'Sense',
          description: 'eBPF hooks collect RTT, jitter, loss, and queue depth from tc statistics and ICMP probes.',
          icon: '📡',
        },
        {
          step: 2,
          title: 'Classify',
          description: 'Flow heuristics infer traffic type from packet sizes, inter-arrival times, and DNS/SNI hints.',
          icon: '🏷️',
        },
        {
          step: 3,
          title: 'React',
          description: 'CAKE tin shares and DSCP markings are adjusted via tc-netlink based on current metrics.',
          icon: '⚡',
        },
        {
          step: 4,
          title: 'Stabilize',
          description: 'EWMA filtering and hysteresis thresholds prevent rapid policy flapping.',
          icon: '📈',
        },
      ],
    },
  },

  features: {
    sectionTitle: 'Features',
    headline: 'What MycoFlow Does',
    description: 'A complete QoS solution that runs entirely on your router.',
    features: [
      {
        icon: '📦',
        title: 'Single Package Install',
        description: 'opkg install mycoflow. That is it. Auto-detects your WAN interface and starts adapting.',
        tag: 'Easy',
      },
      {
        icon: '🔬',
        title: 'eBPF Telemetry',
        description: 'Kernel-space packet inspection with near-zero overhead. No userspace copying.',
      },
      {
        icon: '🎚️',
        title: 'CAKE Integration',
        description: 'Works with existing CAKE/SQM setups. Dynamically adjusts tin shares and bandwidth limits.',
      },
      {
        icon: '📊',
        title: 'LuCI Dashboard',
        description: 'Real-time WebSocket-based UI showing per-flow metrics, queue depths, and adaptation history.',
        tag: 'Visual',
      },
      {
        icon: '💾',
        title: 'Resource Efficient',
        description: 'Targets <5% CPU and <16MB RAM on typical OpenWrt devices (MT7621, IPQ40xx).',
      },
      {
        icon: '🔓',
        title: 'Open Source',
        description: 'GPLv3 licensed. Fully auditable. Contributions welcome.',
        tag: 'OSS',
      },
    ],
  },

  metrics: {
    sectionTitle: 'Performance',
    headline: 'Measured Improvements',
    description: 'Lab results comparing static CAKE vs MycoFlow under mixed traffic loads (gaming + streaming + bulk downloads).',
    comparisons: [
      {
        label: 'Gaming Latency',
        before: { value: 45, unit: 'ms', label: 'P95 RTT' },
        after: { value: 12, unit: 'ms', label: 'P95 RTT' },
        improvement: '-73%',
      },
      {
        label: 'Video Call Jitter',
        before: { value: 15, unit: 'ms', label: 'Jitter' },
        after: { value: 3, unit: 'ms', label: 'Jitter' },
        improvement: '-80%',
      },
      {
        label: 'Packet Loss',
        before: { value: 2.5, unit: '%', label: 'Under Load' },
        after: { value: 0.1, unit: '%', label: 'Under Load' },
        improvement: '-96%',
      },
      {
        label: 'Adaptation Time',
        before: { value: 0, unit: 's', label: 'Static' },
        after: { value: 3, unit: 's', label: 'To Steady State' },
        improvement: 'Dynamic',
      },
    ],
  },

  personas: {
    sectionTitle: 'Use Cases',
    headline: 'Who Benefits',
    personas: [
      {
        id: 'gamer',
        name: 'Competitive Gamers',
        role: 'Low Latency Priority',
        avatar: '🎮',
        scenario: 'Playing ranked matches while housemates stream 4K video.',
        benefit: 'Gaming traffic automatically gets lowest-latency tin. Ping stays stable under load.',
        metrics: [
          { label: 'Latency Stability', improvement: '+95%' },
          { label: 'Jitter Reduction', improvement: '-85%' },
        ],
      },
      {
        id: 'remote-worker',
        name: 'Remote Workers',
        role: 'Video Conference Priority',
        avatar: '💼',
        scenario: 'Client calls during peak household internet usage.',
        benefit: 'Video/voice flows detected and prioritized. No more "you are breaking up" moments.',
        metrics: [
          { label: 'Call Quality', improvement: '+80%' },
          { label: 'Dropped Frames', improvement: '-90%' },
        ],
      },
      {
        id: 'homelab',
        name: 'Homelab Operators',
        role: 'Traffic Visibility',
        avatar: '��️',
        scenario: 'Running services that need predictable network behavior.',
        benefit: 'Full visibility into queue depths, per-flow stats, and adaptation decisions via LuCI.',
        metrics: [
          { label: 'Observability', improvement: '+100%' },
          { label: 'Manual Tuning', improvement: '-90%' },
        ],
      },
    ],
  },

  faq: {
    sectionTitle: 'FAQ',
    headline: 'Frequently Asked Questions',
    items: [
      {
        question: 'What routers does MycoFlow support?',
        answer: 'MycoFlow targets routers running OpenWrt 21.02+ with eBPF support. Designed for MT7621, IPQ40xx, x86_64 architectures. Minimum 64MB RAM recommended.',
        category: 'Compatibility',
      },
      {
        question: 'How do I install it?',
        answer: 'Add our feed to opkg, then: opkg update && opkg install mycoflow luci-app-mycoflow. Service starts automatically.',
        category: 'Installation',
      },
      {
        question: 'Does it work with SQM/CAKE?',
        answer: 'Yes. MycoFlow enhances existing SQM setups by dynamically adjusting tin shares and DSCP mappings. It does not replace CAKE, it drives it.',
        category: 'Compatibility',
      },
      {
        question: 'What about encrypted traffic?',
        answer: 'We use flow-level heuristics: packet sizes, timing patterns, DNS/SNI hints. No deep packet inspection needed.',
        category: 'Technical',
      },
      {
        question: 'How much CPU does it use?',
        answer: 'Target is <5% on typical OpenWrt hardware. eBPF runs in kernel space with minimal overhead. The main daemon is written in C.',
        category: 'Performance',
      },
      {
        question: 'Is there a cloud component?',
        answer: 'No. Everything runs locally on your router. No external dependencies, no data leaves your network.',
        category: 'Privacy',
      },
    ],
  },

  cta: {
    headline: 'Ready to Try MycoFlow?',
    description: 'Install the package and let your router learn your network. No configuration required.',
    primaryCTA: {
      label: 'View on GitHub',
      href: 'https://github.com/mycoflow/mycoflow',
      variant: 'primary',
    },
    secondaryCTA: {
      label: 'Read the Docs',
      href: 'https://docs.mycoflow.io',
      variant: 'secondary',
    },
  },

  footer: {
    copyright: 'MycoFlow Project. GPLv3 License.',
    links: [
      { label: 'GitHub', href: 'https://github.com/mycoflow' },
      { label: 'Documentation', href: 'https://docs.mycoflow.io' },
      { label: 'OpenWrt Forum', href: 'https://forum.openwrt.org' },
    ],
    social: [
      { name: 'GitHub', url: 'https://github.com/mycoflow', icon: 'github' },
      { name: 'Discord', url: 'https://discord.gg/mycoflow', icon: 'discord' },
    ],
  },
};

// ===== Before/After Telemetry =====

export const beforeMycoFlow: TelemetryMetrics = {
  rtt: 45,
  jitter: 15,
  packetLoss: 2.5,
  throughput: 65,
  queueDepth: 85,
  cpuUsage: 8,
};

export const afterMycoFlow: TelemetryMetrics = {
  rtt: 12,
  jitter: 3,
  packetLoss: 0.1,
  throughput: 92,
  queueDepth: 35,
  cpuUsage: 22,
};
