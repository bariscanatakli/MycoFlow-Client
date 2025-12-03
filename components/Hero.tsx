'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { siteContent } from '@/lib/content/mockData';

// Dynamically import 3D visualization
const NetworkVisualization = dynamic(
  () => import('@/components/three').then(mod => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Animated loading placeholder */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
          <div className="absolute inset-4 rounded-full border-2 border-primary/30 animate-ping animation-delay-200" />
          <div className="absolute inset-8 rounded-full border-2 border-primary/40 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full" />
        </div>
      </div>
    )
  }
);

// Typewriter hook
function useTypewriter(text: string, speed: number = 50, delay: number = 500) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);
    
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1));
          i++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayText, isComplete };
}

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 2000, delay: number = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(target * easeOut));
        
        if (progress >= 1) {
          clearInterval(interval);
        }
      }, 16);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);

  return count;
}

// Floating metric component
function FloatingMetric({ 
  label, 
  value, 
  unit, 
  position, 
  delay 
}: { 
  label: string; 
  value: string; 
  unit: string; 
  position: string; 
  delay: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div 
      className={`
        absolute ${position} glass rounded-lg p-3 transition-all duration-700 transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <div>
          <span className="text-text-inverse font-bold">{value}</span>
          <span className="text-text-inverse/70 text-sm ml-1">{unit}</span>
        </div>
      </div>
      <span className="text-text-inverse/50 text-xs">{label}</span>
    </div>
  );
}

export default function Hero() {
  const { hero } = siteContent;
  const { displayText, isComplete } = useTypewriter(hero.subtitle, 40, 800);
  const latencyCounter = useAnimatedCounter(73, 2000, 1500);
  const cpuCounter = useAnimatedCounter(5, 2000, 1700);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Gradient with Parallax */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-bg-light via-white to-primary/5 dark:from-bg-dark dark:via-bg-dark dark:to-primary/10"
        style={{
          transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
        }}
      />
      
      {/* Decorative Elements with Parallax */}
      <div 
        className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute bottom-20 left-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        style={{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
          }}
        />
      </div>

      <div className="section-container relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            {/* Badge with entrance animation */}
            {hero.badge && (
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in-up"
                style={{ animationDelay: '200ms' }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                {hero.badge}
              </div>
            )}

            {/* Title with gradient animation */}
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              <span className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
                {hero.title}
              </span>
            </h1>

            {/* Subtitle with typewriter effect */}
            <div 
              className="h-16 flex items-center animate-fade-in-up"
              style={{ animationDelay: '600ms' }}
            >
              <p className="text-xl md:text-2xl text-text-light font-medium">
                {displayText}
                {!isComplete && (
                  <span className="inline-block w-0.5 h-6 bg-primary ml-1 animate-blink" />
                )}
              </p>
            </div>

            {/* Description */}
            <p 
              className="text-lg text-text-light/80 max-w-xl leading-relaxed animate-fade-in-up"
              style={{ animationDelay: '800ms' }}
            >
              {hero.description}
            </p>

            {/* CTAs with stagger animation */}
            <div 
              className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up"
              style={{ animationDelay: '1000ms' }}
            >
              <button
                onClick={() => scrollToSection(hero.primaryCTA.href)}
                className="group btn-primary text-lg px-8 py-4 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {hero.primaryCTA.label}
                  <svg 
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              {hero.secondaryCTA && (
                <button
                  onClick={() => scrollToSection(hero.secondaryCTA!.href)}
                  className="group btn-secondary text-lg px-8 py-4"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {hero.secondaryCTA.label}
                  </span>
                </button>
              )}
            </div>

            {/* Animated Stats */}
            <div 
              className="flex flex-wrap gap-8 pt-8 border-t border-gray-200 dark:border-gray-800 animate-fade-in-up"
              style={{ animationDelay: '1200ms' }}
            >
              <div className="group cursor-default">
                <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform origin-left">
                  -{latencyCounter}%
                </div>
                <div className="text-sm text-text-light">Latency Reduction</div>
              </div>
              <div className="group cursor-default">
                <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform origin-left">
                  0 Config
                </div>
                <div className="text-sm text-text-light">Zero Manual Rules</div>
              </div>
              <div className="group cursor-default">
                <div className="text-3xl font-bold text-primary group-hover:scale-110 transition-transform origin-left">
                  &lt;{cpuCounter}%
                </div>
                <div className="text-sm text-text-light">CPU Overhead</div>
              </div>
            </div>
          </div>

          {/* 3D Scene */}
          <div 
            className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden animate-fade-in-up"
            style={{ 
              animationDelay: '600ms',
              transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * -5}deg)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            {/* Glow effect behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-xl opacity-50 animate-pulse-slow" />
            
            {/* Main container */}
            <div className="absolute inset-0 bg-gradient-to-br from-bg-dark/90 to-primary/10 rounded-2xl border border-white/10 backdrop-blur-sm">
              <NetworkVisualization 
                className="w-full h-full"
                nodeCount={12}
                particleCount={50}
              />
            </div>
            
            {/* Floating Metrics */}
            <FloatingMetric 
              label="Round Trip Time" 
              value="12" 
              unit="ms" 
              position="top-4 right-4" 
              delay={1400} 
            />
            <FloatingMetric 
              label="Jitter" 
              value="2.3" 
              unit="ms" 
              position="bottom-4 left-4" 
              delay={1600} 
            />
            <FloatingMetric 
              label="Packet Loss" 
              value="0.01" 
              unit="%" 
              position="top-4 left-4" 
              delay={1800} 
            />
            
            {/* Corner decorations */}
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-primary/30 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-primary/30 rounded-bl-2xl" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <button 
          onClick={() => scrollToSection('#problem')}
          className="group flex flex-col items-center gap-2 cursor-pointer"
          aria-label="Scroll to next section"
        >
          <span className="text-xs text-text-light/50 group-hover:text-primary transition-colors">
            Scroll to explore
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-text-light/30 group-hover:border-primary/50 flex items-start justify-center p-2 transition-colors">
            <div className="w-1 h-2 bg-text-light/50 group-hover:bg-primary rounded-full animate-pulse" />
          </div>
        </button>
      </div>
    </section>
  );
}
