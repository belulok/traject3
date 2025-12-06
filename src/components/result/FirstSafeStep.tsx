'use client';

import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Mission {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  requiresWallet: boolean;
  steps: { order: number; text: string }[];
  ctaText: string;
  ctaUrl: string;
  disclaimer?: string;
}

interface FirstSafeStepProps {
  mission?: Mission;
  track?: 'builder' | 'explorer';
}

const defaultMission: Mission = {
  id: 'first-safe-step',
  title: 'See Real On-Chain Income Flows',
  description: 'Before you "do Web3", just look through the glass.',
  estimatedMinutes: 10,
  requiresWallet: false,
  steps: [
    { order: 1, label: 'OBSERVE THE FLOW', text: 'Open a live dashboard of a real DeFi pool or rewards program' },
    { order: 2, label: 'UNDERSTAND THE MECHANICS', text: 'See where the money comes from, how fees are paid out, and how transparent it is' },
    { order: 3, label: 'ZERO COMMITMENT', text: 'No wallet, no sign-up, no tokens – just observe how people actually earn' },
  ] as any,
  ctaText: 'Show Me a Real Example',
  ctaUrl: '#',
  disclaimer: 'This is not financial advice. Just observation.',
};

export function FirstSafeStep({ mission = defaultMission, track = 'explorer' }: FirstSafeStepProps) {
  const steps = [
    { label: 'OBSERVE THE FLOW', text: 'Open a live dashboard of a real DeFi pool or rewards program.' },
    { label: 'UNDERSTAND THE MECHANICS', text: 'See where the money comes from, how fees are paid out, and how transparent it is.' },
    { label: 'ZERO COMMITMENT', text: 'No wallet, no sign-up, no tokens – just observe how people actually earn.' },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-[#0a0a0a]" />

      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left side - Big Typography */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
            className=""
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.9] tracking-tight">
              YOUR
              <br />
              FIRST
              <br />
              SAFE
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CFFF04] to-[#2CFF05]">
                STEP
              </span>
            </h2>

            {/* Time indicator */}
            <div className="mt-8 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#2CFF05] animate-pulse" />
              <span className="text-sm text-[var(--text-muted)] uppercase tracking-wider">
                {mission.estimatedMinutes} mins • No Wallet Required
              </span>
            </div>
          </motion.div>

          {/* Right side - Content Points */}
          <div className="space-y-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="group"
              >
                <h3
                  className="text-sm font-bold uppercase tracking-wider mb-2"
                  style={{ color: '#CFFF04' }}
                >
                  {step.label}
                </h3>
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
                  {step.text}
                </p>
              </motion.div>
            ))}

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
              viewport={{ once: true }}
              className="pt-6"
            >
              <Link
                href={mission.ctaUrl}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-black font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform group"
                style={{
                  background: 'linear-gradient(135deg, #CFFF04 0%, #2CFF05 100%)'
                }}
              >
                {mission.ctaText}
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Disclaimer */}
            {mission.disclaimer && (
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
                className="text-xs text-[var(--text-muted)] leading-relaxed pt-4"
              >
                {mission.disclaimer}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
