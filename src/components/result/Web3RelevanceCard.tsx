'use client';

import { LightBulbIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Web3RelevanceData {
  stigmaBuster: string;
  relevantPoints: string[];
  summary: string;
}

interface Web3RelevanceCardProps {
  data?: Web3RelevanceData;
  track?: 'builder' | 'explorer';
}

export function Web3RelevanceCard({ data, track = 'explorer' }: Web3RelevanceCardProps) {
  const defaultData: Web3RelevanceData = {
    stigmaBuster: 'When most people hear "Web3", they think trading, scams, or complicated wallets.',
    relevantPoints: [
      "you can earn by contributing to real projects, not just taking random gigs",
      "your work can be provable and portable, not locked inside one platform",
      "you can plug directly into global opportunities, not only local jobs"
    ],
    summary: "Web3 is simply a more open version of the internet where money, work, and proof are built into the rails."
  };

  const { stigmaBuster, relevantPoints, summary } = data || defaultData;

  const accentColor = track === 'builder' ? '#CFFF04' : '#2CFF05';

  return (
    <div
      className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-tertiary)] mt-4"
      style={{
        borderColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`,
        boxShadow: `0 0 20px color-mix(in srgb, ${accentColor} 15%, transparent)`
      }}
    >
      {/* Decorative gradient */}
      <div
        className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] blur-[80px] rounded-full"
        style={{ backgroundColor: accentColor }}
      />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)` }}
          >
            <LightBulbIcon className="w-6 h-6" style={{ color: accentColor }} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-1">
              Your Web3 Relevance
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              {track === 'builder' ? 'What Web3 means for builders' : 'What Web3 actually means for you'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-5">
          {/* Stigma Buster */}
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {stigmaBuster}
          </p>

          <p className="text-[var(--text-secondary)] leading-relaxed">
            {track === 'builder'
              ? "For someone who wants to build and earn, that's not the interesting part."
              : "For someone who just wants to understand and use it, that's not interesting."
            }
          </p>

          {/* Highlight Box */}
          <div className="rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] p-5">
            <p className="font-medium mb-4" style={{ color: accentColor }}>
              The part that is interesting for you:
            </p>

            <ul className="space-y-3">
              {relevantPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-[#2CFF05] flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--text-primary)]">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div className="pt-2">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {summary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
