'use client';

import { useState, useEffect, useCallback } from 'react';

// ===== Types =====

interface GitHubStatsProps {
  owner?: string;
  repo?: string;
  className?: string;
}

interface RepoStats {
  stars: number;
  forks: number;
  watchers: number;
  openIssues: number;
}

interface Contributor {
  login: string;
  avatar: string;
  contributions: number;
}

// ===== Initial/Fallback Data =====

const INITIAL_STATS: RepoStats = {
  stars: 0,
  forks: 0,
  watchers: 0,
  openIssues: 0,
};

// ===== GitHub API Hook =====

function useGitHubStats(owner: string, repo: string) {
  const [stats, setStats] = useState<RepoStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: { 'Accept': 'application/vnd.github.v3+json' },
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      if (res.ok) {
        const data = await res.json();
        setStats({
          stars: data.stargazers_count || 0,
          forks: data.forks_count || 0,
          watchers: data.subscribers_count || 0,
          openIssues: data.open_issues_count || 0,
        });
      }
    } catch {
      // Keep initial stats on error
    } finally {
      setLoading(false);
    }
  }, [owner, repo]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading };
}

function useGitHubContributors(owner: string, repo: string, limit: number) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchContributors = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${limit}`,
        {
          headers: { 'Accept': 'application/vnd.github.v3+json' },
          next: { revalidate: 3600 }
        }
      );
      
      if (res.ok) {
        const data = await res.json();
        // Get total count from Link header if available
        const linkHeader = res.headers.get('Link');
        let total = data.length;
        if (linkHeader) {
          const match = linkHeader.match(/page=(\d+)>; rel="last"/);
          if (match) {
            total = parseInt(match[1]) * limit;
          }
        }
        
        setContributors(data.map((c: { login: string; avatar_url: string; contributions: number }) => ({
          login: c.login,
          avatar: c.avatar_url,
          contributions: c.contributions,
        })));
        setTotalCount(total);
      }
    } catch {
      // Keep empty on error
    } finally {
      setLoading(false);
    }
  }, [owner, repo, limit]);

  useEffect(() => {
    fetchContributors();
  }, [fetchContributors]);

  return { contributors, totalCount, loading };
}

// ===== Format Number =====

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

// ===== GitHub Star Button =====

interface StarButtonProps extends GitHubStatsProps {
  compact?: boolean;
}

export function GitHubStarButton({ 
  owner = 'bariscanatakli', 
  repo = 'MycoFlow',
  className = '',
  compact = false
}: StarButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { stats, loading } = useGitHubStats(owner, repo);

  return (
    <a
      href={`https://github.com/${owner}/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        inline-flex items-center gap-2 rounded-lg
        bg-gray-900 hover:bg-gray-800 
        border border-gray-700 hover:border-gray-600
        text-white font-medium text-sm
        transition-all duration-200
        ${compact ? 'px-3 py-1.5' : 'px-4 py-2'}
        ${isHovered ? 'scale-105' : ''}
        ${className}
      `}
    >
      {/* GitHub Icon */}
      <svg className={compact ? 'w-4 h-4' : 'w-5 h-5'} fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
      
      {!compact && <span>Star on GitHub</span>}
      
      {/* Star count badge */}
      <span className={`rounded bg-gray-700 text-gray-300 font-mono ${compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-0.5 text-xs'}`}>
        {loading ? '...' : formatNumber(stats.stars)}
      </span>
    </a>
  );
}

// ===== Stats Badges =====

export function GitHubBadges({ 
  owner = 'bariscanatakli',
  repo = 'MycoFlow',
  className = '' 
}: GitHubStatsProps) {
  const { stats, loading } = useGitHubStats(owner, repo);

  const badges = [
    { label: 'Stars', value: stats.stars, icon: '⭐' },
    { label: 'Forks', value: stats.forks, icon: '🍴' },
    { label: 'Watchers', value: stats.watchers, icon: '👀' },
  ];

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {badges.map((badge) => (
        <div 
          key={badge.label}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-sm"
        >
          <span>{badge.icon}</span>
          <span className="font-semibold text-foreground">
            {loading ? '...' : formatNumber(badge.value)}
          </span>
          <span className="text-muted">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

// ===== Contributors Grid =====

export function ContributorAvatars({ 
  owner = 'bariscanatakli', 
  repo = 'MycoFlow',
  limit = 8,
  className = '' 
}: GitHubStatsProps & { limit?: number }) {
  const { contributors, totalCount, loading } = useGitHubContributors(owner, repo, limit);

  if (loading) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="flex -space-x-2">
          {Array.from({ length: Math.min(limit, 5) }).map((_, i) => (
            <div 
              key={i}
              className="w-8 h-8 rounded-full bg-surface border-2 border-background animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (contributors.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex -space-x-2">
        {contributors.map((contributor: Contributor, i: number) => (
          <a
            key={contributor.login}
            href={`https://github.com/${contributor.login}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block"
            title={`${contributor.login} (${contributor.contributions} contributions)`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={contributor.avatar}
              alt={contributor.login}
              className="w-8 h-8 rounded-full border-2 border-background hover:scale-110 hover:z-10 transition-transform"
              style={{ zIndex: contributors.length - i }}
            />
          </a>
        ))}
      </div>
      
      {totalCount > limit && (
        <a
          href={`https://github.com/${owner}/${repo}/graphs/contributors`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-muted hover:text-primary transition-colors"
        >
          +{totalCount - limit} contributors
        </a>
      )}
    </div>
  );
}

// ===== Full Stats Card =====

export default function GitHubStats({ 
  owner = 'bariscanatakli', 
  repo = 'MycoFlow',
  className = '' 
}: GitHubStatsProps) {
  return (
    <div className={`bg-surface rounded-2xl p-6 border border-border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          {owner}/{repo}
        </h3>
        <GitHubStarButton owner={owner} repo={repo} />
      </div>
      
      <GitHubBadges className="mb-4" />
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-sm text-muted">Contributors</span>
        <ContributorAvatars owner={owner} repo={repo} limit={6} />
      </div>
    </div>
  );
}
