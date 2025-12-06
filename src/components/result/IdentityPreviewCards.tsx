'use client';

import { CurrencyDollarIcon, CubeTransparentIcon, CpuChipIcon, ShieldCheckIcon, UserGroupIcon, ScaleIcon, BoltIcon, IdentificationIcon } from '@heroicons/react/24/outline';

interface IdentityPreview {
  id: string;
  archetype: string;
  title: string;
  subtitle: string;
  icon: string;
  difficultyLevel: string;
  estimatedTimeToStart: string;
  potentialEarnings?: string;
}

interface IdentityPreviewCardsProps {
  identities?: IdentityPreview[];
  track?: 'builder' | 'explorer';
}

const iconMap: Record<string, React.ReactNode> = {
  'currency-dollar': <CurrencyDollarIcon className="w-6 h-6" />,
  'cube-transparent': <CubeTransparentIcon className="w-6 h-6" />,
  'cpu-chip': <CpuChipIcon className="w-6 h-6" />,
  'shield-check': <ShieldCheckIcon className="w-6 h-6" />,
  'user-group': <UserGroupIcon className="w-6 h-6" />,
  'scale': <ScaleIcon className="w-6 h-6" />,
  'bolt': <BoltIcon className="w-6 h-6" />,
  'compass': <CubeTransparentIcon className="w-6 h-6" />,
  'identification': <IdentificationIcon className="w-6 h-6" />,
};

const defaultIdentities: IdentityPreview[] = [
  {
    id: 'defi-explorer',
    archetype: 'defi_explorer',
    title: 'DeFi Explorer',
    subtitle: 'Learns how people earn from providing liquidity, yield strategies, and automated vaults – without needing to be a trader.',
    icon: 'currency-dollar',
    difficultyLevel: 'beginner',
    estimatedTimeToStart: '1-2 hours',
    potentialEarnings: '$50-500/month passive',
  },
  {
    id: 'onchain-contributor',
    archetype: 'onchain_contributor',
    title: 'On-Chain Contributor',
    subtitle: 'Does small tasks for real projects (content, testing, ops, research) and gets paid transparently on-chain.',
    icon: 'cube-transparent',
    difficultyLevel: 'beginner',
    estimatedTimeToStart: '30 mins',
    potentialEarnings: '$100-1000/month active',
  },
  {
    id: 'automation-tinkerer',
    archetype: 'automation_tinkerer',
    title: 'Automation Tinkerer',
    subtitle: 'Combines AI + Web3 tools to build tiny bots, dashboards, or alerts that help others – and gets paid for it.',
    icon: 'cpu-chip',
    difficultyLevel: 'intermediate',
    estimatedTimeToStart: '1 week learning',
    potentialEarnings: '$200-2000/month',
  },
];

export function IdentityPreviewCards({ identities = defaultIdentities, track = 'explorer' }: IdentityPreviewCardsProps) {
  const accentColor = track === 'builder' ? '#CFFF04' : '#2CFF05';

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] mb-2">
          {track === 'builder'
            ? 'Who You Could Become as a Builder'
            : 'Who You Could Become as a User'
          }
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          {track === 'builder'
            ? 'Possible builder identities based on your goals'
            : 'Possible user identities for someone with your goals'
          }
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        {identities.map((identity, index) => (
          <div
            key={identity.id}
            className="group relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5 transition-all duration-300 cursor-pointer hover:bg-[var(--bg-card-hover)]"
            style={{
              '--hover-border': accentColor,
            } as React.CSSProperties}
          >
            {/* Background Gradient on Hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${accentColor} 20%, transparent), transparent)`
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center mb-4 text-[var(--text-secondary)] group-hover:text-[#CFFF04] transition-colors">
                {iconMap[identity.icon] || <CubeTransparentIcon className="w-6 h-6" />}
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2CFF05]" />
                <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wide">
                  {identity.difficultyLevel}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {identity.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                {identity.subtitle}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
                <span>⏱ {identity.estimatedTimeToStart}</span>
                {identity.potentialEarnings && (
                  <span>💰 {identity.potentialEarnings}</span>
                )}
              </div>
            </div>

            {/* Hover indicator */}
            <div
              className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`
              }}
            />
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-center text-sm text-[var(--text-muted)] pt-2">
        You're not choosing yet. These are just possible futures for someone with your goal.
      </p>
    </div>
  );
}
