'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface BentoCard {
  title: string;
  description?: string;
  icon?: string;
  color: 'lime' | 'green' | 'dark' | 'orange' | 'purple';
  size: 'sm' | 'md' | 'lg';
}

interface BentoScrollSectionProps {
  headline: string;
  subheadline?: string;
  centerContent?: React.ReactNode;
  leftCards: BentoCard[];
  rightCards: BentoCard[];
}

const colorClasses = {
  lime: 'bg-[#CFFF04] text-black',
  green: 'bg-[#2CFF05] text-black',
  dark: 'bg-[#1a1f2e] text-white border border-[#CFFF04]/20',
  orange: 'bg-orange-400 text-black',
  purple: 'bg-purple-900 text-white',
};

const sizeClasses = {
  sm: 'h-32',
  md: 'h-44',
  lg: 'h-56',
};

function BentoCard({ card, index }: { card: BentoCard; index: number }) {
  return (
    <div
      className={`rounded-2xl p-5 ${colorClasses[card.color]} ${sizeClasses[card.size]} flex flex-col justify-between shadow-xl`}
    >
      <div>
        {card.icon && <span className="text-2xl mb-2 block">{card.icon}</span>}
        <h3 className="font-bold text-lg leading-tight">{card.title}</h3>
      </div>
      {card.description && (
        <p className="text-sm opacity-80 mt-2">{card.description}</p>
      )}
    </div>
  );
}

export function BentoScrollSection({
  headline,
  subheadline,
  centerContent,
  leftCards,
  rightCards,
}: BentoScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Headline animations
  const headlineOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.7, 0.85], [0, 1, 1, 0]);
  const headlineScale = useTransform(scrollYProgress, [0.1, 0.25, 0.7, 0.85], [0.8, 1, 1, 0.9]);
  const headlineY = useTransform(scrollYProgress, [0.1, 0.25, 0.6, 0.85], [50, 0, 0, -50]);

  // Left cards - stagger in from left
  const leftCardTransforms = leftCards.map((_, i) => {
    const startOffset = 0.15 + i * 0.08;
    const endOffset = 0.75 + i * 0.03;
    return {
      x: useTransform(scrollYProgress, [startOffset, startOffset + 0.15, endOffset, endOffset + 0.1], [-300, 0, 0, -300]),
      opacity: useTransform(scrollYProgress, [startOffset, startOffset + 0.1, endOffset, endOffset + 0.08], [0, 1, 1, 0]),
      rotate: useTransform(scrollYProgress, [startOffset, startOffset + 0.15, endOffset], [-10, 0, 0]),
    };
  });

  // Right cards - stagger in from right
  const rightCardTransforms = rightCards.map((_, i) => {
    const startOffset = 0.18 + i * 0.08;
    const endOffset = 0.75 + i * 0.03;
    return {
      x: useTransform(scrollYProgress, [startOffset, startOffset + 0.15, endOffset, endOffset + 0.1], [300, 0, 0, 300]),
      opacity: useTransform(scrollYProgress, [startOffset, startOffset + 0.1, endOffset, endOffset + 0.08], [0, 1, 1, 0]),
      rotate: useTransform(scrollYProgress, [startOffset, startOffset + 0.15, endOffset], [10, 0, 0]),
    };
  });

  // Center card
  const centerOpacity = useTransform(scrollYProgress, [0.12, 0.22, 0.7, 0.85], [0, 1, 1, 0]);
  const centerScale = useTransform(scrollYProgress, [0.12, 0.25, 0.7, 0.85], [0.8, 1, 1, 0.9]);
  const centerY = useTransform(scrollYProgress, [0.12, 0.25, 0.7, 0.85], [100, 0, 0, -100]);

  // Background color transition
  const bgOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.75, 0.9], [0, 1, 1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[350vh]"
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 bg-[#e8f5e0]"
        style={{ opacity: bgOpacity, zIndex: 0 }}
      />
      <div className="absolute inset-0 bg-[var(--bg-primary)]" style={{ zIndex: -1 }} />

      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden px-4"
        style={{ zIndex: 2 }}
      >
        {/* Grid Container */}
        <div className="relative w-full max-w-7xl mx-auto grid grid-cols-12 gap-4 items-center">

          {/* Left Column - Cards */}
          <div className="col-span-3 space-y-4">
            {leftCards.map((card, i) => (
              <motion.div
                key={i}
                style={{
                  x: leftCardTransforms[i].x,
                  opacity: leftCardTransforms[i].opacity,
                  rotate: leftCardTransforms[i].rotate,
                }}
              >
                <BentoCard card={card} index={i} />
              </motion.div>
            ))}
          </div>

          {/* Center Column - Main Content */}
          <div className="col-span-6 flex flex-col items-center justify-center">
            {/* Big Headline */}
            <motion.div
              className="text-center mb-6"
              style={{
                opacity: headlineOpacity,
                scale: headlineScale,
                y: headlineY,
              }}
            >
              <h2
                className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none"
                style={{
                  color: '#1a3a1a',
                  textShadow: '2px 2px 0 rgba(207, 255, 4, 0.3)',
                }}
              >
                {headline.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                ))}
              </h2>
              {subheadline && (
                <p className="text-lg md:text-xl text-gray-600 mt-4 font-medium">
                  {subheadline}
                </p>
              )}
            </motion.div>

            {/* Center Content (Card/Image) */}
            {centerContent && (
              <motion.div
                className="w-full max-w-sm"
                style={{
                  opacity: centerOpacity,
                  scale: centerScale,
                  y: centerY,
                }}
              >
                {centerContent}
              </motion.div>
            )}
          </div>

          {/* Right Column - Cards */}
          <div className="col-span-3 space-y-4">
            {rightCards.map((card, i) => (
              <motion.div
                key={i}
                style={{
                  x: rightCardTransforms[i].x,
                  opacity: rightCardTransforms[i].opacity,
                  rotate: rightCardTransforms[i].rotate,
                }}
              >
                <BentoCard card={card} index={i} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Pre-configured section for "Your Web3 Relevance"
export function Web3RelevanceBentoSection({ userQuery }: { userQuery: string }) {
  const leftCards: BentoCard[] = [
    {
      title: "No wallet needed",
      description: "Just explore. Zero setup.",
      icon: "🔓",
      color: 'dark',
      size: 'md',
    },
    {
      title: "No crypto trading",
      description: "This isn't about speculation",
      icon: "🚫",
      color: 'lime',
      size: 'sm',
    },
  ];

  const rightCards: BentoCard[] = [
    {
      title: "Private by default",
      description: "Your data stays yours",
      icon: "🔒",
      color: 'green',
      size: 'sm',
    },
    {
      title: "Just explore",
      description: "No risk. No commitment.",
      icon: "🧭",
      color: 'dark',
      size: 'md',
    },
  ];

  const centerContent = (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
      <div className="text-center mb-4">
        <span className="text-sm text-gray-500 uppercase tracking-wider">You searched for</span>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{userQuery}</h3>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-[#CFFF04] to-transparent mb-4" />
      <p className="text-sm text-gray-600 leading-relaxed">
        Web3 is not about crypto trading — it's about <strong>digital ownership</strong>,
        <strong> identity</strong>, and your <strong>next career transition</strong>.
      </p>
    </div>
  );

  return (
    <BentoScrollSection
      headline="YOUR WEB3 RELEVANCE"
      subheadline="Here's what this means for you"
      centerContent={centerContent}
      leftCards={leftCards}
      rightCards={rightCards}
    />
  );
}

// Pre-configured section for "Why This Matters Now"
export function WhyNowBentoSection() {
  const leftCards: BentoCard[] = [
    {
      title: "AI is automating Web2 jobs",
      description: "Traditional roles are shrinking",
      icon: "🤖",
      color: 'orange',
      size: 'md',
    },
    {
      title: "Ownership > Platforms",
      description: "Stop renting your audience",
      icon: "🏠",
      color: 'dark',
      size: 'md',
    },
  ];

  const rightCards: BentoCard[] = [
    {
      title: "Web3 roles are rising",
      description: "New careers emerging daily",
      icon: "📈",
      color: 'lime',
      size: 'md',
    },
    {
      title: "Global work, no borders",
      description: "Get paid from anywhere",
      icon: "🌍",
      color: 'green',
      size: 'md',
    },
  ];

  const centerContent = (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <span className="text-sm font-medium text-gray-700">New income streams</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <span className="text-sm font-medium text-gray-700">Skills that compound</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔐</span>
          <span className="text-sm font-medium text-gray-700">Own your work forever</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚀</span>
          <span className="text-sm font-medium text-gray-700">Early mover advantage</span>
        </div>
      </div>
    </div>
  );

  return (
    <BentoScrollSection
      headline="WHY THIS MATTERS NOW"
      subheadline="The world is shifting. Here's your opportunity."
      centerContent={centerContent}
      leftCards={leftCards}
      rightCards={rightCards}
    />
  );
}

