'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ValueCard {
  type: 'opportunity' | 'community' | 'resource' | 'mission';
  title: string;
  description: string;
  tag?: string;
  author?: {
    name: string;
    initials: string;
    color: string;
  };
  icon?: string;
  link?: string;
}

const defaultCards: ValueCard[] = [
  {
    type: 'opportunity',
    title: 'Design a Landing Page',
    description: 'Create a landing page for a DeFi protocol. $500 bounty, beginner-friendly.',
    tag: 'Bounty • $500',
    icon: '💰',
    author: { name: 'Gitcoin', initials: 'GC', color: 'bg-[#CFFF04]' },
  },
  {
    type: 'opportunity',
    title: 'Community Manager Role',
    description: 'Help grow a Web3 gaming community. Remote, part-time, paid in USDC.',
    tag: 'Job • Remote',
    icon: '💼',
    author: { name: 'GameFi DAO', initials: 'GD', color: 'bg-purple-400' },
  },
  {
    type: 'community',
    title: 'Web3 Designers Guild',
    description: '2,500+ designers building the future of Web3. Weekly calls, job board, mentorship.',
    tag: 'Community • Free',
    icon: '🎨',
    author: { name: 'Designer DAO', initials: 'DD', color: 'bg-pink-400' },
  },
  {
    type: 'community',
    title: 'Bankless Community',
    description: 'Learn DeFi, earn crypto, go bankless. 50k+ members worldwide.',
    tag: 'Community • Free',
    icon: '🏦',
    author: { name: 'Bankless', initials: 'BL', color: 'bg-red-400' },
  },
  {
    type: 'opportunity',
    title: 'ETH Denver Hackathon',
    description: 'Join 15,000+ builders at the largest Web3 event. Prizes worth $1M+.',
    tag: 'Event • Feb 2025',
    icon: '🎪',
    author: { name: 'ETHDenver', initials: 'ED', color: 'bg-blue-400' },
  },
  {
    type: 'resource',
    title: 'Web3 Starter Kit',
    description: 'Free guide: 10 tools every Web3 beginner needs. No wallet required.',
    tag: 'Free Resource',
    icon: '📚',
    author: { name: 'Traject3', initials: 'T3', color: 'bg-[#2CFF05]' },
  },
  {
    type: 'community',
    title: 'Developer DAO',
    description: 'Build Web3 with 8,000+ developers. Open source, beginner-friendly.',
    tag: 'Community • Free',
    icon: '👨‍💻',
    author: { name: 'DevDAO', initials: 'D_', color: 'bg-indigo-400' },
  },
  {
    type: 'mission',
    title: 'Your First Mission',
    description: 'Spend 10 minutes exploring a real DeFi dashboard. No wallet needed, just observe.',
    tag: 'Intro Mission • 10 min',
    icon: '🚀',
    author: { name: 'Traject3', initials: 'T3', color: 'bg-gradient-to-r from-[#CFFF04] to-[#2CFF05]' },
  },
];

function ValueCardComponent({ card, index }: { card: ValueCard; index: number }) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/10 max-w-md">
      {/* Tag */}
      {card.tag && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{card.icon}</span>
          <span className="text-xs font-semibold text-[#CFFF04] uppercase tracking-wider">
            {card.tag}
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-300 leading-relaxed mb-4">
        {card.description}
      </p>

      {/* Author */}
      {card.author && (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${card.author.color} flex items-center justify-center text-xs font-bold text-black`}>
            {card.author.initials}
          </div>
          <span className="text-sm text-white font-medium">{card.author.name}</span>
        </div>
      )}
    </div>
  );
}

export function InstantValueSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Headline
  const headlineOpacity = useTransform(scrollYProgress, [0.05, 0.12, 0.85, 0.95], [0, 1, 1, 0]);
  const headlineY = useTransform(scrollYProgress, [0.05, 0.15, 0.85, 0.95], [-50, 0, 0, -50]);

  // Each card has its own scroll animation - staggered appearance
  const cardAnimations = defaultCards.map((_, i) => {
    const startIn = 0.08 + i * 0.08;
    const endIn = startIn + 0.1;
    const startOut = 0.75 + i * 0.02;
    const endOut = startOut + 0.08;

    return {
      opacity: useTransform(scrollYProgress, [startIn, endIn, startOut, endOut], [0, 1, 1, 0]),
      y: useTransform(scrollYProgress, [startIn, endIn, startOut, endOut], [80, 0, 0, -80]),
      scale: useTransform(scrollYProgress, [startIn, endIn], [0.9, 1]),
    };
  });

  // Background image opacity
  const bgOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.8, 0.95], [0, 1, 1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600vh]"
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: bgOpacity, zIndex: 0 }}
      >
        <img
          src="/lucas-k-GAM-7l4QzmI-unsplash.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Fallback dark bg */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]" style={{ zIndex: -1 }} />

      <div
        className="sticky top-0 h-screen flex flex-col items-center justify-start pt-20 overflow-hidden px-4"
        style={{ zIndex: 2 }}
      >
        {/* Headline */}
        <motion.div
          className="text-center mb-12"
          style={{ opacity: headlineOpacity, y: headlineY }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Here&apos;s something useful{' '}
            <span className="text-[#CFFF04]">right now</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Before you continue, grab these instant wins. No signup needed.
          </p>
        </motion.div>

        {/* Cards Stack - Centered */}
        <div className="relative w-full max-w-lg flex flex-col items-center gap-4">
          {defaultCards.map((card, i) => (
            <motion.div
              key={i}
              className="w-full"
              style={{
                opacity: cardAnimations[i].opacity,
                y: cardAnimations[i].y,
                scale: cardAnimations[i].scale,
              }}
            >
              <ValueCardComponent card={card} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

