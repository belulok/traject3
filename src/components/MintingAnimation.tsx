'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

interface MintingAnimationProps {
  onComplete: () => void;
  track: 'builder' | 'explorer';
}

export function MintingAnimation({ onComplete, track }: MintingAnimationProps) {
  const [stage, setStage] = useState<'processing' | 'minting' | 'complete'>('processing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Stage 1: Processing (0-40%)
    const processingTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 40) {
          clearInterval(processingTimer);
          setStage('minting');
          return prev;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(processingTimer);
  }, []);

  useEffect(() => {
    if (stage === 'minting') {
      // Stage 2: Minting (40-90%)
      const mintingTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(mintingTimer);
            setStage('complete');
            return prev;
          }
          return prev + 1;
        });
      }, 40);

      return () => clearInterval(mintingTimer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'complete') {
      // Final stage: Complete animation
      const completeTimer = setTimeout(() => {
        setProgress(100);
      }, 300);

      const redirectTimer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => {
        clearTimeout(completeTimer);
        clearTimeout(redirectTimer);
      };
    }
  }, [stage, onComplete]);

  const accentColor = track === 'builder' ? '#CFFF04' : '#2CFF05';

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{ backgroundColor: accentColor }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
              opacity: 0.3
            }}
            animate={{
              y: -10,
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Card Container */}
        <motion.div
          className="relative w-[300px] h-[420px] mb-10"
          style={{ perspective: '1000px' }}
        >
          {/* The Card */}
          <motion.div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)',
              border: `2px solid ${stage === 'complete' ? accentColor : 'rgba(255,255,255,0.1)'}`,
              boxShadow: stage === 'complete'
                ? `0 0 60px ${accentColor}40, 0 20px 60px rgba(0,0,0,0.5)`
                : '0 20px 60px rgba(0,0,0,0.5)',
              transformStyle: 'preserve-3d'
            }}
            animate={{
              rotateY: stage === 'minting' ? [0, 10, -10, 5, -5, 0] : 0,
              rotateX: stage === 'minting' ? [0, 5, -5, 3, -3, 0] : 0,
              scale: stage === 'complete' ? 1.05 : 1,
            }}
            transition={{
              rotateY: { duration: 2, repeat: stage === 'minting' ? Infinity : 0 },
              rotateX: { duration: 2.5, repeat: stage === 'minting' ? Infinity : 0 },
              scale: { duration: 0.5 }
            }}
          >
            {/* Card Glow Border Animation */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${accentColor}, transparent, ${accentColor}, transparent)`,
                opacity: stage === 'minting' ? 0.5 : stage === 'complete' ? 0.8 : 0.2,
              }}
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
            />

            {/* Card Inner with Background Image */}
            <div className="absolute inset-[2px] rounded-3xl overflow-hidden">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(/lucas-k-GAM-7l4QzmI-unsplash.jpg)' }}
              />

              {/* Dark Gradient Overlay */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: stage === 'complete'
                    ? 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)'
                    : 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%)'
                }}
                animate={{ opacity: stage === 'complete' ? 0.7 : 1 }}
                transition={{ duration: 0.5 }}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
                {/* Passport Icon */}
                <motion.div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}dd, ${track === 'builder' ? '#2CFF05' : '#CFFF04'}dd)`,
                    boxShadow: `0 10px 40px ${accentColor}60`
                  }}
                  animate={{
                    scale: stage === 'minting' ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: stage === 'minting' ? Infinity : 0
                  }}
                >
                  <span className="text-black font-black text-4xl">P</span>
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-2 text-shadow">
                  {track === 'builder' ? 'Builder' : 'Explorer'} Passport
                </h3>
                <p className="text-sm text-white/70 mb-8 text-center">
                  Your personalized Web3 identity
                </p>

                {/* Status Indicator */}
                <AnimatePresence mode="wait">
                  {stage === 'complete' ? (
                    <motion.div
                      key="complete"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: accentColor,
                        boxShadow: `0 0 30px ${accentColor}80`
                      }}
                    >
                      <CheckIcon className="w-8 h-8 text-black" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="loading"
                      className="w-16 h-16 rounded-full border-4 border-white/20 backdrop-blur-sm"
                      style={{ borderTopColor: accentColor }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Floating particles around card during minting */}
          {stage === 'minting' && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: accentColor }}
                  initial={{
                    x: 150,
                    y: 210,
                    scale: 0
                  }}
                  animate={{
                    x: 150 + Math.cos(i * Math.PI / 4) * 180,
                    y: 210 + Math.sin(i * Math.PI / 4) * 220,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Status Text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              {stage === 'processing' && 'Processing your answers...'}
              {stage === 'minting' && 'Minting your passport...'}
              {stage === 'complete' && 'Passport Minted!'}
            </h2>
            <p className="text-white/50">
              {stage === 'processing' && 'Analyzing your preferences'}
              {stage === 'minting' && 'Creating your personalized identity'}
              {stage === 'complete' && 'Redirecting to your results...'}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="w-80 mt-8">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accentColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-center text-white/30 text-sm mt-2">{progress}%</p>
        </div>
      </div>
    </div>
  );
}

