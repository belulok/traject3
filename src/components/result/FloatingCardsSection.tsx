'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface FloatingCard {
  id: string;
  content: React.ReactNode;
  position: {
    x: string;
    y: string;
  };
  size: 'sm' | 'md' | 'lg';
  rotation?: number;
}

interface FloatingCardsSectionProps {
  headline: string;
  subheadline?: string;
  cards: FloatingCard[];
  accentColor?: string;
}

// Calculate grid position based on card count
// 2 rows max, columns expand horizontally
const getGridPosition = (index: number, totalCards: number): { x: number; y: number } => {
  const rows = 2;

  const col = Math.floor(index / rows);
  const row = index % rows;

  // Card dimensions + gaps
  const cardWidth = 260;
  const cardHeight = 160;
  const gapX = 32;
  const gapY = 32;

  // Start positions with more breathing room
  const startX = 48;
  const startY = 260; // More room below headline

  const x = startX + col * (cardWidth + gapX);
  const y = startY + row * (cardHeight + gapY);

  return { x, y };
};

// Scattered positions (percentages for floating state)
const SCATTERED_POSITIONS = [
  { x: 8, y: 12 },
  { x: 92, y: 82 },
  { x: 88, y: 10 },
  { x: 6, y: 88 },
  { x: 85, y: 48 },
  { x: 10, y: 52 },
  { x: 72, y: 18 },
  { x: 28, y: 85 },
  { x: 55, y: 8 },
  { x: 45, y: 92 },
  { x: 95, y: 35 },
  { x: 5, y: 35 },
];

// Exit positions (cards fly out)
const EXIT_POSITIONS = [
  { x: -20, y: -20 },
  { x: 120, y: 120 },
  { x: 120, y: -20 },
  { x: -20, y: 120 },
  { x: 130, y: 50 },
  { x: -30, y: 50 },
  { x: 80, y: -30 },
  { x: 30, y: 130 },
  { x: 60, y: -30 },
  { x: 50, y: 130 },
  { x: 130, y: 30 },
  { x: -30, y: 30 },
];

// =============================================================================
// Individual Card - Scattered → Grid → Exit animation
// =============================================================================

function ParallaxCard({
  card,
  index,
  totalCards,
  scrollYProgress,
  containerWidth,
}: {
  card: FloatingCard;
  index: number;
  totalCards: number;
  scrollYProgress: any;
  containerWidth: number;
}) {
  const scattered = SCATTERED_POSITIONS[index % SCATTERED_POSITIONS.length];
  const grid = getGridPosition(index, totalCards);
  const exit = EXIT_POSITIONS[index % EXIT_POSITIONS.length];

  // Convert positions to px
  const scatteredX = (scattered.x / 100) * containerWidth;
  const scatteredY = (scattered.y / 100) * (typeof window !== 'undefined' ? window.innerHeight : 800);
  const exitX = (exit.x / 100) * containerWidth;
  const exitY = (exit.y / 100) * (typeof window !== 'undefined' ? window.innerHeight : 800);

  // Position: scattered → grid → exit
  const x = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.75, 1],
    [scatteredX, scatteredX, grid.x, grid.x, exitX]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.75, 1],
    [scatteredY, scatteredY, grid.y, grid.y, exitY]
  );

  // Rotation: tilted → straight → tilted out
  const initialRotation = (index % 2 === 0 ? 1 : -1) * (8 + (index % 5) * 3);
  const exitRotation = (index % 2 === 0 ? -1 : 1) * (15 + (index % 4) * 5);
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.75, 1],
    [initialRotation, initialRotation, 0, 0, exitRotation]
  );

  // Scale: small → full → small
  const scale = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.8, 1],
    [0.5, 0.85, 1, 1, 0.6]
  );

  // Opacity: fade in → visible → fade out
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.5, 0.85, 1],
    [0, 1, 1, 1, 0]
  );

  return (
    <motion.div
      className="absolute rounded-xl shadow-lg overflow-hidden will-change-transform"
      style={{
        left: 0,
        top: 0,
        x,
        y,
        width: 260,
        height: 160,
        rotate,
        scale,
        opacity,
      }}
    >
      {card.content}
    </motion.div>
  );
}

// =============================================================================
// Main Section
// =============================================================================

export function FloatingCardsSection({
  headline,
  subheadline,
  cards,
  accentColor = '#CFFF04',
}: FloatingCardsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Calculate total grid width for horizontal scroll
  const rows = 2;
  const cols = Math.ceil(cards.length / rows);
  const cardWidth = 260;
  const gapX = 32;
  const totalGridWidth = 48 + cols * (cardWidth + gapX) + 80;

  // Container width for scattered positions
  const containerWidth = typeof window !== 'undefined' ? Math.max(window.innerWidth, totalGridWidth) : 1200;

  // Headline: center → top-left → exit up
  const headlineX = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], ['50%', '50%', '0%', '0%', '0%']);
  const headlineLeft = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], ['0px', '0px', '48px', '48px', '48px']);
  const headlineY = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], ['50%', '50%', '0%', '0%', '0%']);
  const headlineTop = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], ['0px', '0px', '120px', '120px', '-100px']);
  const headlineScale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [1, 1, 0.38, 0.38, 0.3]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.12, 0.5, 0.85, 1], [0, 1, 1, 1, 0]);
  const headlineTranslateX = useTransform(scrollYProgress, [0, 0.2, 0.5, 1], ['-50%', '-50%', '0%', '0%']);
  const headlineTranslateY = useTransform(scrollYProgress, [0, 0.2, 0.5, 1], ['-50%', '-50%', '0%', '0%']);

  // Subheadline
  const subOpacity = useTransform(scrollYProgress, [0, 0.15, 0.5, 0.85, 1], [0, 1, 1, 1, 0]);
  const subX = useTransform(scrollYProgress, [0, 0.2, 0.5, 1], ['50%', '50%', '0%', '0%']);
  const subLeft = useTransform(scrollYProgress, [0, 0.2, 0.5, 1], ['0px', '0px', '48px', '48px']);
  const subY = useTransform(scrollYProgress, [0, 0.2, 0.5, 1], ['58%', '58%', '0%', '0%']);
  const subTop = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], ['0px', '0px', '190px', '190px', '-50px']);
  const subTranslateX = useTransform(scrollYProgress, [0, 0.2, 0.5, 1], ['-50%', '-50%', '0%', '0%']);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[300vh]"
    >
      {/* Cover that hides previous section's sticky content */}
      <div
        className="absolute inset-0 bg-[var(--bg-primary)] pointer-events-none"
        style={{ zIndex: 1 }}
      />

      <div
        className="sticky top-0 h-screen bg-[var(--bg-primary)]"
        style={{
          overflow: 'clip',
          zIndex: 2,
        }}
      >
        {/* Inner container - scrollbar hidden with CSS */}
        <div
          className="relative h-full overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{
            width: '100%',
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE/Edge */
          }}
        >
          <div
            className="relative h-full"
            style={{
              width: `${Math.max(totalGridWidth, typeof window !== 'undefined' ? window.innerWidth : 1200)}px`,
              minWidth: '100%',
            }}
          >
            {/* Cards */}
            {cards.map((card, index) => (
              <ParallaxCard
                key={card.id}
                card={card}
                index={index}
                totalCards={cards.length}
                scrollYProgress={scrollYProgress}
                containerWidth={containerWidth}
              />
            ))}

            {/* Headline */}
            <motion.h1
              className="absolute z-10 text-6xl md:text-8xl lg:text-9xl font-black tracking-tight whitespace-nowrap pointer-events-none origin-top-left"
              style={{
                left: headlineLeft,
                top: headlineTop,
                x: headlineX,
                y: headlineY,
                translateX: headlineTranslateX,
                translateY: headlineTranslateY,
                scale: headlineScale,
                opacity: headlineOpacity,
                color: accentColor,
                textShadow: `0 0 80px ${accentColor}40`,
              }}
            >
              {headline}
            </motion.h1>

            {/* Subheadline */}
            {subheadline && (
              <motion.p
                className="absolute z-10 text-base md:text-lg text-[var(--text-secondary)] pointer-events-none whitespace-nowrap"
                style={{
                  left: subLeft,
                  top: subTop,
                  x: subX,
                  y: subY,
                  translateX: subTranslateX,
                  opacity: subOpacity,
                }}
              >
                {subheadline}
              </motion.p>
            )}

            {/* Vignette - fades in and out */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, transparent 20%, var(--bg-primary) 85%)`,
                opacity: useTransform(scrollYProgress, [0, 0.3, 0.6, 0.85, 1], [1, 0.3, 0, 0.3, 1]),
              }}
            />
          </div>
        </div>
      </div>

      {/* CSS to hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// =============================================================================
// Creator Card
// =============================================================================

interface CreatorCardProps {
  displayName: string;
  handle: string;
  platform: string;
  followers: number;
  category: string;
}

export function CreatorCard({ displayName, handle, platform, followers, category }: CreatorCardProps) {
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${Math.round(count / 1000)}K`;
    return count.toString();
  };

  const platformIcon = platform === 'twitter' ? '𝕏' : platform === 'farcaster' ? '🟣' : '🌐';
  const categoryColors: Record<string, string> = {
    builder: 'from-[#CFFF04]/50 to-[#2CFF05]/50 border-[#CFFF04]/40',
    founder: 'from-[#2CFF05]/50 to-[#CFFF04]/50 border-[#2CFF05]/40',
    educator: 'from-[#CFFF04]/50 to-emerald-800/50 border-[#CFFF04]/40',
    analyst: 'from-[#2CFF05]/50 to-[#CFFF04]/50 border-[#2CFF05]/40',
    investor: 'from-[#CFFF04]/50 to-[#2CFF05]/50 border-[#CFFF04]/40',
    community: 'from-[#2CFF05]/50 to-[#CFFF04]/50 border-[#2CFF05]/40',
  };

  return (
    <div className={`w-full h-full bg-gradient-to-br ${categoryColors[category] || 'from-slate-600/50 to-slate-800/50 border-slate-500/40'} border backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between`}>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center text-lg font-bold text-white border border-white/20">
          {displayName?.[0]?.toUpperCase() || '@'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-[15px] truncate">{displayName}</p>
          <p className="text-sm text-white/60">{platformIcon} @{handle}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs px-3 py-1 rounded-full bg-white/15 text-white/90 capitalize font-medium">
          {category}
        </span>
        <span className="text-base font-bold text-[#2CFF05]">
          {formatFollowers(followers)}
        </span>
      </div>
    </div>
  );
}

// =============================================================================
// DAO Card
// =============================================================================

interface DAOCardProps {
  name: string;
  memberCount: number;
  proposalCount: number;
  activeProposals: number;
  category?: string;
}

export function DAOCard({ name, memberCount, proposalCount, activeProposals, category }: DAOCardProps) {
  const formatNumber = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${Math.round(count / 1000)}K`;
    return count.toString();
  };

  const isActive = activeProposals > 0;

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#CFFF04]/30 to-[#2CFF05]/30 border border-[#CFFF04]/40 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg border border-white/20">
          🏛
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-[15px] truncate">{name}</h3>
          {category && (
            <span className="text-sm text-white/60 capitalize">{category}</span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 text-sm">
        <span className="text-white/70 font-medium">👥 {formatNumber(memberCount)}</span>
        <span className={`font-semibold ${isActive ? 'text-[#2CFF05]' : 'text-white/50'}`}>
          {isActive ? `🟢 ${activeProposals} active` : `${proposalCount}`}
        </span>
      </div>
    </div>
  );
}
