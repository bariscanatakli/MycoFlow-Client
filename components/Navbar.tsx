'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { GitHubStarButton } from './GitHubStats';

// ===== Navigation Items =====

const navItems = [
  { label: 'Problem', href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'Install', href: '#installation' },
  { label: 'Demo', href: '#demo' },
  { label: 'Metrics', href: '#metrics' },
];

// ===== Navbar Component =====

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm' 
          : 'bg-transparent'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className={`text-xl font-bold transition-colors ${isScrolled ? 'text-foreground' : 'text-white'}`}>
              MycoFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  text-sm font-medium transition-colors hover:text-primary
                  ${isScrolled ? 'text-muted' : 'text-white/80'}
                `}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* GitHub Star Button */}
            <GitHubStarButton compact />
            
            {/* CTA Button */}
            <Link
              href="#demo"
              className="btn-primary text-sm px-4 py-2"
            >
              Try Demo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-surface/50 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className={`w-6 h-6 transition-colors ${isScrolled ? 'text-foreground' : 'text-white'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300
            ${isMobileMenuOpen ? 'max-h-80 pb-4' : 'max-h-0'}
          `}
        >
          <div className="flex flex-col gap-2 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-muted hover:text-primary hover:bg-surface/50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {/* GitHub Star Button - Mobile */}
            <div className="px-4 py-2">
              <GitHubStarButton />
            </div>
            
            <Link
              href="#demo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mx-4 mt-2 btn-primary text-center text-sm"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
