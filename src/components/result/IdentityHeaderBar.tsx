'use client';

import Link from 'next/link';
import { ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface IdentityHeaderBarProps {
  userQuery: string;
  mode: string;
}

export function IdentityHeaderBar({ userQuery, mode }: IdentityHeaderBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Logo + User Query */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] bg-clip-text text-transparent">T3</span>
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-[var(--border-subtle)] hidden sm:block" />

            {/* User Query */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[var(--text-muted)] text-sm hidden sm:inline">You:</span>
              <span className="text-[var(--text-primary)] font-medium truncate text-sm sm:text-base">
                {userQuery}
              </span>
            </div>
          </div>

          {/* Right: Mode Tag + New Search */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Mode Tag */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]">
              <SparklesIcon className="w-3.5 h-3.5 text-[#CFFF04]" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                Mode: {mode}
              </span>
            </div>

            {/* New Search Button */}
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border-subtle)] hover:border-[#CFFF04]/30 transition-all duration-200 group"
            >
              <ArrowPathIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[#CFFF04] transition-colors" />
              <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors hidden sm:inline">
                New Search
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}


