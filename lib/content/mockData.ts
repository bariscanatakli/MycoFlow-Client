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
    badge: 'OpenWrt Package · IEEE Draft Paper',
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
    headline: 'Measured in the Lab',
    description: 'QEMU benchmark: 5-client simultaneous scenario (gamer + VoIP + video + streaming + torrent). Compared against FIFO baseline and static CAKE. All results from OpenWrt 23.05 on emulated MT7981B.',
    comparisons: [
      {
        label: 'Gaming Ping Under Load',
        before: { value: 693, unit: 'ms', label: 'Extra Latency (FIFO)' },
        after: { value: 0.1, unit: 'ms', label: 'Extra Latency (MycoFlow)' },
        improvement: '-99.9%',
      },
      {
        label: 'Voice Tin vs Bulk Tin',
        before: { value: 34.7, unit: 'ms', label: 'Bulk Delay (CAKE tin)' },
        after: { value: 0.2, unit: 'ms', label: 'Voice Delay (CAKE tin)' },
        improvement: '154× separation',
      },
      {
        label: 'CAKE-Only vs MycoFlow',
        before: { value: 0.2, unit: 'ms', label: 'CAKE Static (A+)' },
        after: { value: 0.1, unit: 'ms', label: 'MycoFlow Adaptive (A+)' },
        improvement: '2× better',
      },
      {
        label: 'RAM Overhead',
        before: { value: 0, unit: '', label: 'No QoS daemon' },
        after: { value: 336, unit: 'bytes', label: 'MycoFlow full state' },
        improvement: 'Near zero',
      },
    ],
  },

  personas: {
    sectionTitle: 'Use Cases',
    headline: 'Who Benefits',
    personas: [
      {
        id: 'voip',
        name: 'VoIP & Phone Calls',
        role: 'Highest Priority (EF)',
        avatar: '📞',
        scenario: 'IP phone or softphone during heavy household downloads.',
        benefit: 'Classified via packet-size (<120B) + bandwidth heuristic. DSCP EF → Voice CAKE tin. Sub-millisecond jitter.',
        metrics: [
          { label: 'DSCP Mark', improvement: 'EF (Expedited Forwarding)' },
          { label: 'Latency Target', improvement: '<20ms RTT' },
        ],
      },
      {
        id: 'gaming',
        name: 'Competitive Gaming',
        role: 'Low Latency (CS4)',
        avatar: '🎮',
        scenario: 'Ranked match while housemates stream 4K and torrent.',
        benefit: 'Small packets + few flows → GAMING persona. DSCP CS4 → Voice CAKE tin. Stable ping even under 100% link saturation.',
        metrics: [
          { label: 'Latency Overhead', improvement: '+0.1ms (vs +693ms FIFO)' },
          { label: 'DSCP Mark', improvement: 'CS4 → Voice tin' },
        ],
      },
      {
        id: 'video',
        name: 'Video Conferencing',
        role: 'Real-Time Video (CS3)',
        avatar: '🎥',
        scenario: 'Client Zoom call during peak household usage.',
        benefit: 'Medium bandwidth (200kbps–8Mbps) → VIDEO persona. DSCP CS3 → Video CAKE tin. No pixelation or freezes.',
        metrics: [
          { label: 'DSCP Mark', improvement: 'CS3 → Video tin' },
          { label: 'Latency Target', improvement: '<75ms RTT' },
        ],
      },
      {
        id: 'streaming',
        name: '4K Streaming',
        role: 'Buffered Video (CS2)',
        avatar: '📺',
        scenario: 'Netflix 4K on smart TV while others work and game.',
        benefit: 'Elephant flow with asymmetric rx/tx ratio → STREAMING. Buffer-tolerant. Gets CS2 to avoid starving interactive flows.',
        metrics: [
          { label: 'DSCP Mark', improvement: 'CS2 → Video tin' },
          { label: 'Latency Target', improvement: '<150ms RTT' },
        ],
      },
      {
        id: 'bulk',
        name: 'Large Downloads',
        role: 'Background Bulk (CS1)',
        avatar: '📦',
        scenario: 'Steam game update or OS ISO download running overnight.',
        benefit: 'High-volume symmetric elephant flow → BULK. Deprioritized without pause. Fills available headroom only.',
        metrics: [
          { label: 'DSCP Mark', improvement: 'CS1 → Bulk tin' },
          { label: 'Latency Target', improvement: '<200ms RTT' },
        ],
      },
      {
        id: 'torrent',
        name: 'P2P / BitTorrent',
        role: 'Lowest Priority (CS1)',
        avatar: '🔄',
        scenario: 'Linux ISO torrent seeding continuously in background.',
        benefit: 'Flow count >30 → TORRENT persona. Lowest priority queue. Never blocks foreground traffic.',
        metrics: [
          { label: 'Detection', improvement: 'flow_count > 30' },
          { label: 'Impact on Others', improvement: '~0ms' },
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
        answer: 'MycoFlow targets OpenWrt 23.05+ routers. Primary test platform: Xiaomi AX3000T (MediaTek MT7981B, 2× Cortex-A53 @ 1.3GHz, 256MB RAM). Also works on MT7621, IPQ40xx, and x86_64. Requires iptables-nft (default on OpenWrt 23+).',
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
  rtt: 693,
  jitter: 34.7,
  packetLoss: 2.8,
  throughput: 60,
  queueDepth: 90,
  cpuUsage: 6,
};

export const afterMycoFlow: TelemetryMetrics = {
  rtt: 0.1,
  jitter: 0.2,
  packetLoss: 0.05,
  throughput: 96,
  queueDepth: 20,
  cpuUsage: 22,
};
