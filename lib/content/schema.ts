/**
 * MycoFlow Landing Page - İçerik Şeması
 * 
 * Bu dosya sayfadaki tüm içerik yapısını ve tiplerini tanımlar.
 * Mock veriler için temel şema görevi görür.
 */

// ===== Temel Tipler =====

export interface CTAButton {
  label: string;
  href: string;
  variant: 'primary' | 'secondary' | 'accent';
}

export interface MetricValue {
  value: number;
  unit: string;
  label: string;
  description?: string;
}

// ===== Hero Section =====

export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  primaryCTA: CTAButton;
  secondaryCTA?: CTAButton;
  badge?: string;
}

// ===== Problem Section =====

export interface ProblemPoint {
  icon: string;
  title: string;
  description: string;
}

export interface ProblemContent {
  sectionTitle: string;
  headline: string;
  description: string;
  points: ProblemPoint[];
}

// ===== Solution Section =====

export interface SolutionFeature {
  icon: string;
  title: string;
  description: string;
  highlight?: boolean;
}

export interface BioInspiredContent {
  title: string;
  subtitle: string;
  description: string;
  analogy: {
    natural: string;
    technical: string;
  };
  features: SolutionFeature[];
}

export interface ReflexiveLoopContent {
  title: string;
  description: string;
  steps: {
    step: number;
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface SolutionContent {
  bioInspired: BioInspiredContent;
  reflexiveLoop: ReflexiveLoopContent;
}

// ===== Metrics Section =====

export interface MetricComparison {
  label: string;
  before: MetricValue;
  after: MetricValue;
  improvement: string; // örn: "-40%", "+2x"
}

export interface MetricsContent {
  sectionTitle: string;
  headline: string;
  description: string;
  comparisons: MetricComparison[];
}

// ===== Mock Telemetri (Canlı Demo) =====

export interface TelemetryMetrics {
  rtt: number;           // Round Trip Time (ms)
  jitter: number;        // Jitter (ms)
  packetLoss: number;    // Packet Loss (%)
  throughput: number;    // Throughput (Mbps)
  queueDepth: number;    // Queue Depth (%)
  cpuUsage: number;      // Router CPU (%)
}

export interface QoSTier {
  id: string;
  name: string;
  color: string;        // Tailwind renk class'ı
  priority: number;     // 1-4 (1 en yüksek)
  description: string;
}

// ===== Personas / Use Cases =====

export interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;       // emoji veya resim path
  scenario: string;
  benefit: string;
  metrics: {
    label: string;
    improvement: string;
  }[];
}

export interface PersonasContent {
  sectionTitle: string;
  headline: string;
  personas: Persona[];
}

// ===== Features Section =====

export interface Feature {
  icon: string;
  title: string;
  description: string;
  tag?: string;
}

export interface FeaturesContent {
  sectionTitle: string;
  headline: string;
  description: string;
  features: Feature[];
}

// ===== FAQ Section =====

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface FAQContent {
  sectionTitle: string;
  headline: string;
  items: FAQItem[];
}

// ===== CTA Section =====

export interface CTAContent {
  headline: string;
  description: string;
  primaryCTA: CTAButton;
  secondaryCTA?: CTAButton;
}

// ===== Footer =====

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface FooterContent {
  copyright: string;
  links: FooterLink[];
  social: SocialLink[];
}

// ===== Ana İçerik Şeması =====

export interface ContentSchema {
  meta: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: HeroContent;
  problem: ProblemContent;
  solution: SolutionContent;
  features: FeaturesContent;
  metrics: MetricsContent;
  personas: PersonasContent;
  faq: FAQContent;
  cta: CTAContent;
  footer: FooterContent;
}

// ===== QoS Tier Sabitleri =====

export const QOS_TIERS: QoSTier[] = [
  {
    id: 'realtime',
    name: 'Real-time',
    color: 'text-red-500',
    priority: 1,
    description: 'VoIP, Video conferencing',
  },
  {
    id: 'interactive',
    name: 'Interactive',
    color: 'text-orange-500',
    priority: 2,
    description: 'Gaming, Live streaming',
  },
  {
    id: 'streaming',
    name: 'Streaming',
    color: 'text-yellow-500',
    priority: 3,
    description: 'Video streaming, Music',
  },
  {
    id: 'bulk',
    name: 'Bulk',
    color: 'text-green-500',
    priority: 4,
    description: 'Downloads, Backups',
  },
];

// ===== Varsayılan Telemetri Değerleri =====

export const DEFAULT_TELEMETRY: TelemetryMetrics = {
  rtt: 12.5,
  jitter: 2.3,
  packetLoss: 0.1,
  throughput: 95.2,
  queueDepth: 45,
  cpuUsage: 18,
};

// ===== Telemetri Aralıkları (min/max) =====

export const TELEMETRY_RANGES = {
  rtt: { min: 8, max: 25, variance: 2 },
  jitter: { min: 1, max: 5, variance: 0.5 },
  packetLoss: { min: 0, max: 2, variance: 0.2 },
  throughput: { min: 85, max: 100, variance: 3 },
  queueDepth: { min: 20, max: 70, variance: 5 },
  cpuUsage: { min: 10, max: 35, variance: 3 },
};
