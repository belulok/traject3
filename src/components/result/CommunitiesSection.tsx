'use client';

interface DAO {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  proposalCount: number;
  activeProposals: number;
  governanceUrl: string;
  category?: string;
  tags: string[];
  beginnerFriendliness: number;
}

interface CommunitiesSectionProps {
  daos: DAO[];
  track: 'builder' | 'explorer';
}

export function CommunitiesSection({ daos, track }: CommunitiesSectionProps) {
  const formatNumber = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  const getActivityBadge = (activeProposals: number) => {
    if (activeProposals > 3) return { text: 'Very Active', color: 'text-green-400 bg-green-400/10' };
    if (activeProposals > 0) return { text: 'Active', color: 'text-yellow-400 bg-yellow-400/10' };
    return { text: 'Quiet', color: 'text-gray-400 bg-gray-400/10' };
  };

  const getBeginnerBadge = (score: number) => {
    if (score >= 75) return { text: 'Beginner Friendly', show: true };
    if (score >= 60) return { text: 'Moderate', show: false };
    return { text: 'Advanced', show: false };
  };

  if (!daos || daos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          track === 'builder'
            ? 'bg-[var(--accent-purple)]/20'
            : 'bg-[var(--accent-cyan)]/20'
        }`}>
          <span className="text-xl">🏛</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Communities & DAOs
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {track === 'builder'
              ? 'DAOs looking for contributors like you'
              : 'Communities to explore and learn with'
            }
          </p>
        </div>
      </div>

      {/* DAOs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {daos.slice(0, 4).map((dao) => {
          const activity = getActivityBadge(dao.activeProposals);
          const beginner = getBeginnerBadge(dao.beginnerFriendliness);

          return (
            <a
              key={dao.id}
              href={dao.governanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 hover:border-[var(--accent-cyan)]/50 hover:bg-[var(--bg-secondary)] transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    track === 'builder'
                      ? 'bg-[var(--accent-purple)]/20 text-[var(--accent-purple)]'
                      : 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]'
                  }`}>
                    {dao.name?.[0]?.toUpperCase() || '🏛'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors">
                      {dao.name}
                    </h3>
                  </div>
                </div>
                <span className="text-xs text-[var(--text-muted)]">
                  ↗
                </span>
              </div>

              {dao.description && (
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                  {dao.description}
                </p>
              )}

              {/* Stats Row */}
              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-2">
                <span title="Members">
                  👥 {formatNumber(dao.memberCount)}
                </span>
                <span title="Total Proposals">
                  📋 {dao.proposalCount} proposals
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full ${activity.color}`}>
                  {activity.text}
                </span>
                {beginner.show && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-400">
                    ✓ {beginner.text}
                  </span>
                )}
                {dao.category && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                    {dao.category}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>

      {/* Explore more */}
      {daos.length > 4 && (
        <div className="text-center">
          <button className="text-sm text-[var(--accent-cyan)] hover:underline">
            Explore all {daos.length} communities →
          </button>
        </div>
      )}

      {/* Tip for explorers */}
      {track === 'explorer' && (
        <div className="p-3 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)]/50">
          <p className="text-xs text-[var(--text-secondary)]">
            💡 <strong>Tip:</strong> Start by reading a few proposals in any DAO to see how governance works.
            No wallet needed to browse!
          </p>
        </div>
      )}
    </div>
  );
}


