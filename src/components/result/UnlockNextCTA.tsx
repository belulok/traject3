'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { CheckIcon, ArrowRightIcon, BoltIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface UnlockData {
  title: string;
  description: string;
  bullets: string[];
  ctaText: string;
  ctaSubtext: string;
}

interface UnlockNextCTAProps {
  data?: UnlockData;
  track?: 'builder' | 'explorer';
}

const defaultData: UnlockData = {
  title: 'Want a Clear, Personal Path Instead of Guessing?',
  description: 'Answer 10 quick questions and we\'ll:',
  bullets: [
    'map you to the income identity that fits you best',
    'generate a 7-day action plan that respects your time and risk comfort',
    'create your Future Skills Passport so your missions and progress are tracked',
    'surface live bounties, quests, and jobs that match your level',
  ],
  ctaText: 'Get My Personal 7-Day Path (2 min)',
  ctaSubtext: 'No trading. No shilling. Just skills, experiments, and real opportunities.',
};

export function UnlockNextCTA({ data = defaultData, track = 'explorer' }: UnlockNextCTAProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position tracking with spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring config for smooth momentum
  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const rotateZ = useSpring(useMotionValue(-8), springConfig); // Start tilted

  const identity = {
    title: track === 'builder' ? 'On-Chain Contributor' : 'Curious Explorer',
    subtitle: track === 'builder'
      ? 'Does small tasks for real projects (content, testing, ops, research) and gets paid transparently on-chain.'
      : 'Takes guided tours through DeFi, NFTs, and DAOs to understand how everything connects – no coding required.',
  };

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center (-1 to 1)
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(x);
    mouseY.set(y);

    // Apply tilt based on mouse position (inverted for natural feel)
    rotateX.set(-y * 15); // Tilt up/down
    rotateY.set(x * 15);  // Tilt left/right
    rotateZ.set(-8 + x * 3); // Subtle twist
  };

  const handleMouseLeave = () => {
    // Reset to default tilted position
    rotateX.set(0);
    rotateY.set(0);
    rotateZ.set(-8);
  };

  // Auto-rotate every 4 seconds
  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoRotate]);

  const handleCardClick = () => {
    setAutoRotate(false);
    setIsFlipped(prev => !prev);
  };

  const strengths = ['Strategic Thinking', 'Analytical Skills', 'Community Engagement', 'Creative Design'];
  const ecosystems = ['Ethereum', 'Polygon', 'Arbitrum'];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#0a0a0a]" />

      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left side - 3D Rotating Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <div
              ref={cardRef}
              className="relative w-[320px] h-[480px] cursor-pointer group"
              style={{ perspective: '1200px' }}
              onClick={handleCardClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Card Container with mouse-following tilt */}
              <motion.div
                className="relative w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  rotateX: rotateX,
                  rotateY: isFlipped ? 180 : rotateY,
                  rotateZ: rotateZ,
                }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                {/* Front Side - Identity Info */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%)',
                    border: '1px solid rgba(207, 255, 4, 0.2)'
                  }}
                >
                  {/* Shine effect that follows mouse */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at calc(50% + ${mouseX.get() * 50}%) calc(50% + ${mouseY.get() * 50}%), rgba(207, 255, 4, 0.15) 0%, transparent 50%)`,
                    }}
                  />

                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#CFFF04] to-transparent" />
                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#CFFF04] via-transparent to-[#2CFF05]" />
                  </div>

                  <div className="relative z-10 p-8 h-full flex flex-col">
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {identity.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-sm italic text-[#CFFF04] mb-4 leading-relaxed">
                      {identity.subtitle}
                    </p>

                    {/* Divider */}
                    <div className="w-12 h-1 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] mb-4" />

                    {/* Description */}
                    <p className="text-sm text-white/70 leading-relaxed mb-6">
                      You are becoming a leader in the field of Web3, capable of crafting innovative approaches that leverage blockchain technology. Your unique skills and perspective set you apart.
                    </p>

                    {/* Strengths */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <BoltIcon className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#CFFF04]">
                          Your Strengths
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {strengths.map((strength, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs rounded-full border border-[#CFFF04]/30 text-[#CFFF04]/80"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Ecosystems */}
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 mb-3">
                        <ArrowPathIcon className="w-4 h-4 text-[#2CFF05]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#2CFF05]">
                          Best Ecosystems
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ecosystems.map((eco, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-xs rounded-full border border-white/20 text-white/60"
                          >
                            {eco}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Click hint */}
                  <div className="absolute bottom-4 right-4 text-[10px] text-white/30 uppercase tracking-wider">
                    Click to flip
                  </div>
                </div>

                {/* Back Side - Image with Big Typography */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    border: '1px solid rgba(207, 255, 4, 0.3)'
                  }}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: 'url(/lucas-k-GAM-7l4QzmI-unsplash.jpg)',
                    }}
                  />

                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                  {/* Big Typography */}
                  <div className="relative z-10 h-full flex flex-col items-start justify-end px-6 pb-12 overflow-hidden">
                    <motion.span
                      className="text-[50px] sm:text-[60px] font-black leading-[0.85] tracking-tight"
                      style={{
                        color: '#CFFF04',
                        textShadow: '0 0 60px rgba(207, 255, 4, 0.5), 0 2px 10px rgba(0,0,0,0.8)'
                      }}
                    >
                      {identity.title.split(' ')[0]?.toUpperCase() || 'ON-CHAIN'}
                    </motion.span>
                    <motion.span
                      className="text-[40px] sm:text-[50px] font-black leading-[0.85] tracking-tight text-white"
                      style={{
                        textShadow: '0 0 40px rgba(255, 255, 255, 0.3), 0 2px 10px rgba(0,0,0,0.8)'
                      }}
                    >
                      {identity.title.split(' ').slice(1).join(' ')?.toUpperCase() || 'CONTRIBUTOR'}
                    </motion.span>
                  </div>

                  {/* Click hint */}
                  <div className="absolute bottom-4 right-4 text-[10px] text-white/50 uppercase tracking-wider">
                    Click to flip
                  </div>
                </div>
              </motion.div>

              {/* Glow effect under card */}
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 blur-xl opacity-50"
                style={{ background: 'linear-gradient(90deg, #CFFF04, #2CFF05)' }}
              />
            </div>
          </motion.div>

          {/* Right side - Next Step Content */}
          <div className="space-y-6 order-1 lg:order-2">
            {/* Big Typography Header */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight mb-4">
                NEXT
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CFFF04] to-[#2CFF05]">
                  STEP
                </span>
              </h2>
              <p className="text-xl text-white/70 mt-4">
                {data.title}
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-base text-white/50"
            >
              {data.description}
            </motion.p>

            {/* Benefits List */}
            <div className="space-y-3">
              {data.bullets.map((bullet, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2CFF05]/20 flex items-center justify-center mt-0.5">
                    <CheckIcon className="w-3 h-3 text-[#2CFF05]" />
                  </span>
                  <span className="text-base text-white/80">{bullet}</span>
                </motion.div>
              ))}
            </div>

            {/* No Requirements Note */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="text-sm text-white/40"
            >
              {track === 'builder'
                ? 'No wallet. No coding required. Just clarity and next steps.'
                : 'No wallet. No crypto purchases. Just clarity and next steps.'
              }
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <Link
                href="/questions"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-black font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform group"
                style={{
                  background: 'linear-gradient(135deg, #CFFF04 0%, #2CFF05 100%)',
                  boxShadow: '0 10px 40px rgba(207, 255, 4, 0.3)'
                }}
              >
                {data.ctaText}
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Trust Signal */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
              className="text-sm text-white/30"
            >
              {data.ctaSubtext}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
