'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface IdentityCardData {
  title: string;
  subtitle: string;
  description: string;
  strengths: string[];
  ecosystems: string[];
}

interface IdentityCardSectionProps {
  data?: IdentityCardData;
}

const defaultData: IdentityCardData = {
  title: "Web3 Marketing Innovator",
  subtitle: "Pioneering marketing strategies in the decentralized world.",
  description: "You are becoming a leader in the field of Web3 marketing, capable of crafting innovative campaigns that leverage blockchain technology. Your skills in analytics, community engagement, and strategic planning set you apart.",
  strengths: ["Strategic Thinking", "Analytical Skills", "Community Engagement", "Creative Design"],
  ecosystems: ["Ethereum", "Polygon", "Binance Smart Chain"]
};

export function IdentityCardSection({ data = defaultData }: IdentityCardSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Scroll-based transforms
  const cardRotateX = useTransform(scrollYProgress, [0.1, 0.3, 0.5, 0.7], [0, -5, -15, -25]);
  const cardRotateY = useTransform(scrollYProgress, [0.1, 0.3, 0.5, 0.7], [0, 10, 20, 30]);
  const cardScale = useTransform(scrollYProgress, [0.1, 0.3, 0.5, 0.7], [1, 1.05, 1.1, 1.15]);

  // Info card opacity (fades out)
  const infoOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [1, 0.5, 0]);

  // Big text opacity (fades in)
  const bigTextOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.55], [0, 0.5, 1]);
  const bigTextScale = useTransform(scrollYProgress, [0.25, 0.4, 0.55], [0.8, 0.9, 1]);

  // Image reveal
  const imageOpacity = useTransform(scrollYProgress, [0.3, 0.45, 0.6], [0, 0.5, 1]);
  const imageScale = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [1.2, 1.1, 1]);

  // Mouse tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    setMousePosition({ x: x * 20, y: y * -20 });
  };

  // Split title into words for big text animation
  const titleWords = data.title.split(' ');

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400vh]"
    >
      {/* Cover background */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]" style={{ zIndex: 1 }} />

      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        style={{ zIndex: 2 }}
      >
        {/* The Card */}
        <motion.div
          ref={cardRef}
          className="relative w-[320px] md:w-[380px] h-[480px] md:h-[540px] cursor-pointer perspective-1000"
          style={{
            rotateX: isHovering ? mousePosition.y : cardRotateX,
            rotateY: isHovering ? mousePosition.x : cardRotateY,
            scale: cardScale,
            transformStyle: 'preserve-3d',
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setMousePosition({ x: 0, y: 0 });
          }}
        >
          {/* Card Background */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #0f1419 0%, #1a1f2e 50%, #0d1117 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 100px rgba(207, 255, 4, 0.1)',
              border: '1px solid rgba(207, 255, 4, 0.2)',
            }}
          >
            {/* Image Layer (reveals on scroll) */}
            <motion.div
              className="absolute inset-0"
              style={{ opacity: imageOpacity, scale: imageScale }}
            >
              <img
                src="/lucas-k-GAM-7l4QzmI-unsplash.jpg"
                alt="Identity"
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </motion.div>

            {/* Info Content (fades out) */}
            <motion.div
              className="absolute inset-0 p-5 md:p-6 flex flex-col"
              style={{ opacity: infoOpacity }}
            >
              {/* Title */}
              <div className="mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1.5">
                  {data.title}
                </h2>
                <p className="text-[#CFFF04] italic text-xs md:text-sm">
                  {data.subtitle}
                </p>
              </div>

              {/* Divider */}
              <div className="w-12 h-0.5 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] mb-4" />

              {/* Description */}
              <p className="text-gray-300 text-xs leading-relaxed mb-5">
                {data.description}
              </p>

              {/* Strengths */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#CFFF04] text-sm">⚡</span>
                  <span className="text-[10px] font-semibold text-[#CFFF04] uppercase tracking-wider">Your Strengths</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.strengths.map((strength, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-full bg-[#CFFF04]/10 border border-[#CFFF04]/30 text-[#CFFF04] text-[10px] font-medium"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ecosystems */}
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#2CFF05] text-sm">↗</span>
                  <span className="text-[10px] font-semibold text-[#2CFF05] uppercase tracking-wider">Best Ecosystems</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.ecosystems.map((eco, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 text-[10px] font-medium"
                    >
                      {eco}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

{/* Big Typography removed from inside card - now outside */}

            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `linear-gradient(
                  ${105 + mousePosition.x}deg,
                  transparent 40%,
                  rgba(207, 255, 4, 0.1) 45%,
                  rgba(207, 255, 4, 0.2) 50%,
                  rgba(207, 255, 4, 0.1) 55%,
                  transparent 60%
                )`,
              }}
            />
          </div>

          {/* Glow effect */}
          <div
            className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl -z-10"
            style={{
              background: 'radial-gradient(circle at center, rgba(207, 255, 4, 0.3) 0%, transparent 70%)',
            }}
          />
        </motion.div>

        {/* Big Typography - OUTSIDE the card */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          style={{ opacity: bigTextOpacity, scale: bigTextScale }}
        >
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none"
              style={{
                color: i % 2 === 0 ? 'rgba(207, 255, 4, 0.9)' : 'rgba(255, 255, 255, 0.12)',
                textShadow: i % 2 === 0 ? '0 0 80px rgba(207, 255, 4, 0.6)' : 'none',
                WebkitTextStroke: i % 2 !== 0 ? '2px rgba(207, 255, 4, 0.3)' : 'none',
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Side text - LEFT */}
        <motion.div
          className="absolute left-4 md:left-16 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            opacity: bigTextOpacity,
            x: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [-100, 0, 50]),
          }}
        >
          <span
            className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter"
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px rgba(207, 255, 4, 0.4)',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
            }}
          >
            FUTURE
          </span>
        </motion.div>

        {/* Side text - RIGHT */}
        <motion.div
          className="absolute right-4 md:right-16 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            opacity: bigTextOpacity,
            x: useTransform(scrollYProgress, [0.3, 0.5, 0.7], [100, 0, -50]),
          }}
        >
          <span
            className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter"
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px rgba(44, 255, 5, 0.4)',
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
            }}
          >
            IDENTITY
          </span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.3], [1, 0.5, 0]) }}
        >
          <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll to reveal</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#CFFF04] to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}

