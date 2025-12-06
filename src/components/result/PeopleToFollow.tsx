'use client';

interface Creator {
  id: string;
  platform: string;
  handle: string;
  displayName: string;
  bio?: string;
  followers: number;
  category: string;
  topics: string[];
  url: string;
  isVerified?: boolean;
}

interface PeopleToFollowProps {
  creators: Creator[];
  track: 'builder' | 'explorer';
}

export function PeopleToFollow({ creators, track }: PeopleToFollowProps) {
  const categoryIcons: Record<string, string> = {
    builder: '🛠',
    founder: '🚀',
    educator: '📚',
    analyst: '📊',
    investor: '💰',
    artist: '🎨',
    community: '🌐',
  };

  const platformIcons: Record<string, string> = {
    twitter: '𝕏',
    farcaster: '🟣',
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  if (!creators || creators.length === 0) {
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
          <span className="text-xl">👥</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            People to Follow
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {track === 'builder'
              ? 'Builders, founders, and educators in Web3'
              : 'Learn from experts and community voices'
            }
          </p>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {creators.slice(0, 6).map((creator) => (
          <a
            key={creator.id}
            href={creator.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-4 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)]/50 hover:border-[var(--accent-cyan)]/50 hover:bg-[var(--bg-secondary)] transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              {/* Avatar placeholder */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                track === 'builder'
                  ? 'bg-[var(--accent-purple)]/20 text-[var(--accent-purple)]'
                  : 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]'
              }`}>
                {creator.displayName?.[0]?.toUpperCase() || '@'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[var(--text-primary)] truncate">
                    {creator.displayName || creator.handle}
                  </span>
                  {creator.isVerified && (
                    <span className="text-[var(--accent-cyan)]">✓</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <span>{platformIcons[creator.platform] || '🌐'}</span>
                  <span>@{creator.handle}</span>
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-full ${
                    track === 'builder'
                      ? 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)]'
                      : 'bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]'
                  }`}>
                    {categoryIcons[creator.category] || '👤'} {creator.category}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {formatFollowers(creator.followers)} followers
                  </span>
                </div>
              </div>
            </div>

            {creator.bio && (
              <p className="mt-2 text-xs text-[var(--text-secondary)] line-clamp-2">
                {creator.bio}
              </p>
            )}

            {/* Topics */}
            {creator.topics && creator.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {creator.topics.slice(0, 3).map((topic, i) => (
                  <span
                    key={i}
                    className="text-xs px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>

      {/* Show more link */}
      {creators.length > 6 && (
        <div className="text-center">
          <button className="text-sm text-[var(--accent-cyan)] hover:underline">
            View all {creators.length} creators →
          </button>
        </div>
      )}
    </div>
  );
}


