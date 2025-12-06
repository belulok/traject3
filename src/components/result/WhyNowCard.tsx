'use client';

import { ClockIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface WhyNowData {
  web2Ceiling: string[];
  modernChallenges: string[];
  web3Opportunities: string[];
  closingNote: string;
}

interface WhyNowCardProps {
  data?: WhyNowData;
}

const defaultData: WhyNowData = {
  web2Ceiling: [
    'freelance platforms with race-to-the-bottom pricing',
    'content platforms where algorithms own the audience',
    "gigs that don't build long-term leverage or reputation",
  ],
  modernChallenges: [
    'AI is automating many generic online jobs',
    'platforms keep more value than the people doing the work',
  ],
  web3Opportunities: [
    'earn from bounties, grants, and protocol work, not just clients',
    'keep a public trail of contributions that future partners can see',
    'build small automations or strategies that keep working for you',
  ],
  closingNote: 'You don\'t need to "believe in Web3". You just need to see how new rails can support the income you already want.',
};

export function WhyNowCard({ data = defaultData }: WhyNowCardProps) {
  const { web2Ceiling, modernChallenges, web3Opportunities, closingNote } = data;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--accent-orange)]/10 flex items-center justify-center">
            <ClockIcon className="w-6 h-6 text-[var(--accent-orange)]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-1">
              Why This Matters Right Now
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              The old rails vs. the new opportunity
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Web2 Problems */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wide">
                The Current Ceiling
              </span>
            </div>

            <div className="rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] p-4">
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                The traditional approaches look like:
              </p>
              <ul className="space-y-2">
                {web2Ceiling.map((problem, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                    <span className="text-[var(--accent-orange)] mt-1">•</span>
                    {problem}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-[var(--bg-primary)]/50 border border-[var(--border-subtle)] p-4">
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                At the same time:
              </p>
              <ul className="space-y-2">
                {modernChallenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                    <span className="text-red-400 mt-1">•</span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Web3 Opportunities */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-4 h-4 text-[#2CFF05]" />
              <span className="text-sm font-medium text-[#2CFF05] uppercase tracking-wide">
                The New Rails
              </span>
            </div>

            <div className="rounded-xl bg-[#2CFF05]/5 border border-[#2CFF05]/20 p-4">
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                On the open Web3 side, you can:
              </p>
              <ul className="space-y-3">
                {web3Opportunities.map((opportunity, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
                    <span className="text-[#2CFF05] mt-1">✓</span>
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-5 border-t border-[var(--border-subtle)]">
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            {closingNote}
          </p>
        </div>
      </div>
    </div>
  );
}
