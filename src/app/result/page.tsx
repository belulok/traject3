'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { IdentityHeaderBar } from '@/components/result/IdentityHeaderBar';
import { IdentityCardSection } from '@/components/result/IdentityCardSection';
import { Web3RelevanceBentoSection, WhyNowBentoSection } from '@/components/result/BentoScrollSection';
import { IdentityPreviewCards } from '@/components/result/IdentityPreviewCards';
import { InstantValueSection } from '@/components/result/InstantValueSection';
import { FirstSafeStep } from '@/components/result/FirstSafeStep';
import { UnlockNextCTA } from '@/components/result/UnlockNextCTA';
import { FloatingCardsSection, CreatorCard, DAOCard } from '@/components/result/FloatingCardsSection';
import LoadingAnimation from '@/components/LoadingAnimation';
import { useAuth } from '@/contexts/AuthContext';

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

interface ResultData {
  relevanceExplanation: {
    stigmaBuster: string;
    relevantPoints: string[];
    summary: string;
  };
  whyNow: {
    web2Ceiling: string[];
    modernChallenges: string[];
    web3Opportunities: string[];
    closingNote: string;
  };
  identityPreviews: {
    id: string;
    archetype: string;
    title: string;
    subtitle: string;
    icon: string;
    difficultyLevel: string;
    estimatedTimeToStart: string;
    potentialEarnings?: string;
  }[];
  firstMission: {
    id: string;
    title: string;
    description: string;
    estimatedMinutes: number;
    requiresWallet: boolean;
    steps: { order: number; text: string }[];
    ctaText: string;
    ctaUrl: string;
    disclaimer?: string;
  };
  upcomingUnlocks: {
    title: string;
    description: string;
    bullets: string[];
    ctaText: string;
    ctaSubtext: string;
  };
  track?: 'builder' | 'explorer';
  creators?: Creator[];
  daos?: DAO[];
}

// Position cards around the center like a collage
const getCardPosition = (index: number): { x: string; y: string } => {
  const positions = [
    { x: '12%', y: '20%' },   // Top left
    { x: '88%', y: '75%' },   // Bottom right
    { x: '85%', y: '18%' },   // Top right
    { x: '10%', y: '78%' },   // Bottom left
    { x: '78%', y: '48%' },   // Right middle
    { x: '18%', y: '52%' },   // Left middle
  ];
  return positions[index % positions.length];
};

export default function ResultPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [userQuery, setUserQuery] = useState("I want side income");
  const [userTrack, setUserTrack] = useState<'builder' | 'explorer'>('explorer');
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const storedQuery = sessionStorage.getItem('traject3_query') || 'I want side income';
    const storedTrack = sessionStorage.getItem('traject3_track') || 'auto';
    setUserQuery(storedQuery);
    fetchResult(storedQuery, storedTrack);
  }, []);

  const fetchResult = async (query: string, track: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/api/result/by-track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: query,
          track: track === 'auto' ? undefined : track,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch results');

      const data = await response.json();
      setResultData(data);
      setUserTrack(data.track || 'explorer');
    } catch (err) {
      console.error('Error fetching result:', err);
      setError('Failed to load results. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const mode = userTrack === 'builder' ? 'Builder · Web3 + AI' : 'Explorer · Understanding Web3';

  // Scroll progress indicator
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Show LoadingAnimation while loading - same as home page
  if (isLoading) {
    return <LoadingAnimation isVisible={true} />;
  }

  if (error || !resultData) {
    return (
      <div className="h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">Something went wrong</h2>
          <p className="text-[var(--text-secondary)] mb-6">{error || 'Unable to load results'}</p>
          <button
            onClick={() => fetchResult(userQuery, userTrack)}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] text-black font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const creators = resultData.creators || [];
  const daos = resultData.daos || [];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Background effects */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(207, 255, 4, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(207, 255, 4, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Fixed Header */}
      <div className="fixed top-1 left-0 right-0 z-40">
        <IdentityHeaderBar userQuery={userQuery} mode={mode} user={user} isAuthenticated={isAuthenticated} />
      </div>

      {/* Track Badge */}
      <div className="fixed top-20 left-6 z-40">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm ${
          userTrack === 'builder'
            ? 'bg-[#CFFF04]/10 border-[#CFFF04]/30 text-[#CFFF04]'
            : 'bg-[#2CFF05]/10 border-[#2CFF05]/30 text-[#2CFF05]'
        }`}>
          <span className="text-lg">{userTrack === 'builder' ? '🛠' : '🧭'}</span>
          <span className="text-sm font-medium">
            {userTrack === 'builder' ? 'Builder Track' : 'Explorer Track'}
          </span>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <main className="relative pt-24">
        {/* Section 0: Identity Card - Scroll-animated */}
        <div className="relative" style={{ zIndex: 5 }}>
          <IdentityCardSection
            data={{
              title: resultData.identityPreviews?.[0]?.title || "Web3 Marketing Innovator",
              subtitle: resultData.identityPreviews?.[0]?.subtitle || "Pioneering strategies in the decentralized world.",
              description: "You are becoming a leader in the field of Web3, capable of crafting innovative approaches that leverage blockchain technology. Your unique skills and perspective set you apart.",
              strengths: ["Strategic Thinking", "Analytical Skills", "Community Engagement", "Creative Design"],
              ecosystems: ["Ethereum", "Polygon", "Arbitrum"]
            }}
          />
        </div>

        {/* Section 1: Web3 Relevance - Bento Grid */}
        <div className="relative" style={{ zIndex: 6 }}>
          <Web3RelevanceBentoSection userQuery={userQuery} />
        </div>

        {/* Section 2: Why Now - Bento Grid */}
        <div className="relative" style={{ zIndex: 7 }}>
          <WhyNowBentoSection />
        </div>

        {/* Section 3: Identities */}
        <section className="min-h-screen flex items-center justify-center py-20 px-4 relative bg-[var(--bg-primary)]" style={{ zIndex: 5 }}>
          <div className="w-full max-w-5xl">
            <IdentityPreviewCards identities={resultData.identityPreviews} track={userTrack} />
          </div>
        </section>

        {/* Section 4: Instant Value - Scroll-animated cards */}
        <div className="relative" style={{ zIndex: 8 }}>
          <InstantValueSection />
        </div>

        {/* Section 5: People - Scroll-animated floating cards */}
        {creators.length > 0 && (
          <div className="relative" style={{ zIndex: 10 }}>
            <FloatingCardsSection
              headline="People"
              subheadline={`Follow ${creators.length} builders & educators shaping Web3`}
              accentColor={userTrack === 'builder' ? '#CFFF04' : '#2CFF05'}
              cards={creators.slice(0, 6).map((creator, i) => ({
                id: creator.id,
                position: getCardPosition(i),
                size: i < 2 ? 'lg' : i < 4 ? 'md' : 'sm',
                rotation: (i % 2 === 0 ? 1 : -1) * (5 + i * 3),
                content: (
                  <CreatorCard
                    displayName={creator.displayName}
                    handle={creator.handle}
                    platform={creator.platform}
                    followers={creator.followers}
                    category={creator.category}
                  />
                ),
              }))}
            />
          </div>
        )}

        {/* Section 5: Community - Scroll-animated floating cards */}
        {daos.length > 0 && (
          <div className="relative" style={{ zIndex: 20 }}>
            <FloatingCardsSection
              headline="Community"
              subheadline={`Explore ${daos.length} DAOs and governance spaces`}
              accentColor={userTrack === 'builder' ? 'var(--accent-cyan)' : 'var(--accent-purple)'}
              cards={daos.slice(0, 6).map((dao, i) => ({
                id: dao.id,
                position: getCardPosition(i),
                size: i < 2 ? 'lg' : i < 4 ? 'md' : 'sm',
                rotation: (i % 2 === 0 ? -1 : 1) * (4 + i * 3),
                content: (
                  <DAOCard
                    name={dao.name}
                    memberCount={dao.memberCount}
                    proposalCount={dao.proposalCount}
                    activeProposals={dao.activeProposals}
                    category={dao.category}
                  />
                ),
              }))}
            />
          </div>
        )}

        {/* Section 6: First Step */}
        <section className="relative" style={{ zIndex: 30 }}>
          <FirstSafeStep mission={resultData.firstMission} track={userTrack} />
        </section>

        {/* Section 7: CTA */}
        <section className="relative" style={{ zIndex: 30 }}>
          <UnlockNextCTA data={resultData.upcomingUnlocks} track={userTrack} />
        </section>
      </main>

      {/* Scroll hint */}
      <div className="fixed bottom-6 right-6 z-40 text-xs text-[var(--text-muted)] opacity-50">
        Scroll to explore ↓
      </div>
    </div>
  );
}
