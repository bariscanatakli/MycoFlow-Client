'use client';

import { useState, useSyncExternalStore, useCallback } from 'react';

// ===== Types =====

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

// ===== Theme Store =====

let themeListeners: (() => void)[] = [];
let currentTheme: Theme = 'system';
let currentResolved: 'light' | 'dark' = 'dark';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDOM(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  currentResolved = resolved;
  
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
    document.documentElement.style.colorScheme = resolved;
  }
  
  return resolved;
}

function subscribe(listener: () => void) {
  themeListeners.push(listener);
  return () => {
    themeListeners = themeListeners.filter(l => l !== listener);
  };
}

function notifyListeners() {
  // Update cached snapshot before notifying
  cachedSnapshot = { theme: currentTheme, resolved: currentResolved };
  themeListeners.forEach(l => l());
}

// Snapshot type
interface ThemeSnapshot {
  theme: Theme;
  resolved: 'light' | 'dark';
}

// Cache client snapshot to prevent infinite loop
let cachedSnapshot: ThemeSnapshot = { theme: currentTheme, resolved: currentResolved };

function getThemeSnapshot(): ThemeSnapshot {
  return cachedSnapshot;
}

// Cache server snapshot to prevent infinite loop
const SERVER_SNAPSHOT: ThemeSnapshot = { theme: 'system', resolved: 'dark' };

function getServerSnapshot(): ThemeSnapshot {
  return SERVER_SNAPSHOT;
}

// Initialize on client
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('mycoflow-theme') as Theme | null;
  currentTheme = stored || 'system';
  applyThemeToDOM(currentTheme);
  cachedSnapshot = { theme: currentTheme, resolved: currentResolved };
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'system') {
      applyThemeToDOM('system');
      notifyListeners();
    }
  });
}

// ===== Mounted Store (for hydration) =====

let isMounted = false;

function subscribeMounted(listener: () => void) {
  // Schedule mount check
  if (typeof window !== 'undefined' && !isMounted) {
    isMounted = true;
    queueMicrotask(listener);
  }
  return () => {};
}

function getMountedSnapshot() {
  return isMounted;
}

function getMountedServerSnapshot() {
  return false;
}

// ===== Hook =====

export function useTheme(): ThemeContextValue {
  const snapshot = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);

  const setTheme = useCallback((newTheme: Theme) => {
    currentTheme = newTheme;
    applyThemeToDOM(newTheme);
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mycoflow-theme', newTheme);
    }
    
    notifyListeners();
  }, []);

  return { 
    theme: snapshot.theme, 
    resolvedTheme: snapshot.resolved, 
    setTheme 
  };
}

function useMounted(): boolean {
  return useSyncExternalStore(subscribeMounted, getMountedSnapshot, getMountedServerSnapshot);
}

// ===== Theme Toggle Button =====

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return (
      <button
        className={`p-2 rounded-lg bg-surface/50 border border-border ${className}`}
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={cycleTheme}
      className={`
        relative p-2 rounded-lg 
        bg-surface/50 hover:bg-surface 
        border border-border hover:border-primary/30
        transition-all duration-200
        ${className}
      `}
      aria-label={`Current theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {/* Sun icon */}
      <svg
        className={`
          w-5 h-5 transition-all duration-300
          ${resolvedTheme === 'light' ? 'text-yellow-500 rotate-0 scale-100' : 'text-gray-400 rotate-90 scale-0 absolute'}
        `}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Moon icon */}
      <svg
        className={`
          w-5 h-5 transition-all duration-300
          ${resolvedTheme === 'dark' ? 'text-blue-400 rotate-0 scale-100' : 'text-gray-400 -rotate-90 scale-0 absolute'}
        `}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>

      {/* System indicator dot */}
      {theme === 'system' && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}
    </button>
  );
}

// ===== Theme Dropdown (Alternative) =====

export function ThemeDropdown({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const mounted = useMounted();

  if (!mounted) return null;

  const options: { value: Theme; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border hover:border-primary/30 transition-colors"
      >
        <span>{options.find(o => o.value === theme)?.icon}</span>
        <span className="text-sm text-foreground">
          {options.find(o => o.value === theme)?.label}
        </span>
        <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setOpen(false)} 
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-40 rounded-lg bg-surface border border-border shadow-lg z-20">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                  hover:bg-primary/10 transition-colors
                  ${theme === option.value ? 'text-primary' : 'text-foreground'}
                  first:rounded-t-lg last:rounded-b-lg
                `}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
                {theme === option.value && (
                  <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
