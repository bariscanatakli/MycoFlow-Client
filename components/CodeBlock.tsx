'use client';

import { useState, useCallback } from 'react';

// ===== Types =====

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

// ===== Copy Button =====

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 group"
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

// ===== Syntax Highlighting (Simple) =====

function highlightSyntax(code: string, language: string): string {
  // Simple regex-based highlighting for common patterns
  let highlighted = code
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (language === 'bash' || language === 'shell') {
    highlighted = highlighted
      // Comments
      .replace(/(#.*)$/gm, '<span class="text-gray-500">$1</span>')
      // Commands (first word)
      .replace(/^(\s*)(npm|npx|curl|wget|sudo|apt|opkg|ssh|cd|mkdir|cat|echo)/gm, '$1<span class="text-green-400">$2</span>')
      // Flags
      .replace(/(\s)(-{1,2}[\w-]+)/g, '$1<span class="text-yellow-400">$2</span>')
      // Strings
      .replace(/(".*?"|'.*?')/g, '<span class="text-orange-400">$1</span>')
      // URLs
      .replace(/(https?:\/\/[^\s"']+)/g, '<span class="text-blue-400">$1</span>');
  } else if (language === 'json') {
    highlighted = highlighted
      // Keys
      .replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1"</span>:')
      // String values
      .replace(/: "([^"]+)"/g, ': <span class="text-green-400">"$1"</span>')
      // Numbers
      .replace(/: (\d+)/g, ': <span class="text-orange-400">$1</span>')
      // Booleans
      .replace(/: (true|false)/g, ': <span class="text-purple-400">$1</span>');
  } else if (language === 'yaml' || language === 'conf') {
    highlighted = highlighted
      // Comments
      .replace(/(#.*)$/gm, '<span class="text-gray-500">$1</span>')
      // Keys
      .replace(/^(\s*)([a-zA-Z_][\w-]*):/gm, '$1<span class="text-blue-400">$2</span>:')
      // Values
      .replace(/:\s+(.+)$/gm, ': <span class="text-green-400">$1</span>');
  }

  return highlighted;
}

// ===== Main Component =====

export default function CodeBlock({
  code,
  language = 'bash',
  filename,
  showLineNumbers = false,
  className = '',
}: CodeBlockProps) {
  const lines = code.trim().split('\n');
  const highlightedCode = highlightSyntax(code.trim(), language);

  return (
    <div className={`relative group rounded-xl overflow-hidden ${className}`}>
      {/* Header with filename */}
      {filename && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-sm text-gray-400 ml-2">{filename}</span>
        </div>
      )}

      {/* Code area */}
      <div className="relative bg-gray-900 p-4 overflow-x-auto">
        <CopyButton code={code.trim()} />
        
        <pre className="text-sm font-mono text-gray-300 leading-relaxed">
          {showLineNumbers ? (
            <code className="flex">
              {/* Line numbers */}
              <span className="select-none pr-4 text-gray-600 text-right min-w-[2rem]">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </span>
              {/* Code */}
              <span 
                className="flex-1"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </code>
          ) : (
            <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          )}
        </pre>
      </div>
    </div>
  );
}

// ===== Terminal Style Variant =====

export function TerminalBlock({ 
  commands,
  title = 'Terminal',
}: { 
  commands: string[];
  title?: string;
}) {
  const code = commands.join('\n');

  return (
    <div className="relative group rounded-xl overflow-hidden border border-gray-800">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-sm text-gray-500 ml-2">{title}</span>
      </div>

      {/* Terminal content */}
      <div className="relative bg-black p-4">
        <CopyButton code={code} />
        
        <div className="font-mono text-sm space-y-1">
          {commands.map((cmd, i) => (
            <div key={i} className="flex">
              <span className="text-green-500 select-none mr-2">$</span>
              <span className="text-gray-300">{cmd}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
