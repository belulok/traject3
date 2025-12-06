'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { SpiderChart, SpiderChartData, defaultSpiderData } from '@/components/SpiderChart';
import { MintingAnimation } from '@/components/MintingAnimation';
import { getQuestionsForTrack, Question } from '@/data/questions';

type Track = 'builder' | 'explorer';

interface Answer {
  questionId: string;
  values: string[];
  customValue?: string;
}

export default function QuestionsPage() {
  const router = useRouter();
  const [track, setTrack] = useState<Track>('explorer');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [customInput, setCustomInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMinting, setShowMinting] = useState(false);

  // Load track from session storage
  useEffect(() => {
    const savedTrack = sessionStorage.getItem('traject3_track');
    if (savedTrack === 'builder' || savedTrack === 'explorer') {
      setTrack(savedTrack);
    }
  }, []);

  const questions = useMemo(() => getQuestionsForTrack(track), [track]);
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Calculate spider chart data from answers
  const spiderData = useMemo((): SpiderChartData => {
    const data = { ...defaultSpiderData };

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question?.options) return;

      answer.values.forEach(value => {
        const option = question.options?.find(o => o.value === value);
        if (option?.spiderImpact) {
          Object.entries(option.spiderImpact).forEach(([key, impact]) => {
            if (key in data && typeof impact === 'number') {
              data[key as keyof SpiderChartData] = Math.min(5, Math.max(0, data[key as keyof SpiderChartData] + impact));
            }
          });
        }
      });
    });

    // Normalize values to be between 0-5
    Object.keys(data).forEach(key => {
      data[key as keyof SpiderChartData] = Math.min(5, Math.max(0, data[key as keyof SpiderChartData]));
    });

    return data;
  }, [answers, questions]);

  // Get current answer for the question
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  const handleSelect = (value: string) => {
    if (!currentQuestion) return;

    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === currentQuestion.id);

      if (currentQuestion.type === 'single_choice') {
        if (existing) {
          return prev.map(a =>
            a.questionId === currentQuestion.id
              ? { ...a, values: [value] }
              : a
          );
        }
        return [...prev, { questionId: currentQuestion.id, values: [value] }];
      } else {
        // multi_choice
        if (existing) {
          const newValues = existing.values.includes(value)
            ? existing.values.filter(v => v !== value)
            : [...existing.values, value];
          return prev.map(a =>
            a.questionId === currentQuestion.id
              ? { ...a, values: newValues }
              : a
          );
        }
        return [...prev, { questionId: currentQuestion.id, values: [value] }];
      }
    });
  };

  const handleCustomSubmit = () => {
    if (!customInput.trim() || !currentQuestion) return;

    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === currentQuestion.id);
      if (existing) {
        return prev.map(a =>
          a.questionId === currentQuestion.id
            ? { ...a, customValue: customInput }
            : a
        );
      }
      return [...prev, { questionId: currentQuestion.id, values: [], customValue: customInput }];
    });
    setCustomInput('');
  };

  const canProceed = () => {
    if (!currentAnswer) return false;
    return currentAnswer.values.length > 0 || !!currentAnswer.customValue;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCustomInput('');
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setCustomInput('');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Save answers to session storage
    sessionStorage.setItem('traject3_answers', JSON.stringify(answers));
    sessionStorage.setItem('traject3_spider_data', JSON.stringify(spiderData));
    sessionStorage.setItem('traject3_track', track);

    // Show minting animation
    setShowMinting(true);
  };

  const handleMintingComplete = () => {
    router.push('/journey');
  };

  const isSelected = (value: string) => {
    return currentAnswer?.values.includes(value) || false;
  };

  // Show minting animation
  if (showMinting) {
    return <MintingAnimation onComplete={handleMintingComplete} track={track} />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header Bar */}
      <header className="border-b border-[var(--border-subtle)] bg-black/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Home
            </button>
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${track === 'builder' ? 'bg-[#CFFF04]' : 'bg-[#2CFF05]'}`} />
              <span className="text-sm text-[var(--text-secondary)] capitalize font-medium">{track} Track</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left Side - Questions (3 columns) */}
          <div className="lg:col-span-3 flex flex-col">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[var(--text-muted)]">
                  Question {currentIndex + 1} of {questions.length}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  {Math.round(progress)}% complete
                </p>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${track === 'builder' ? '#CFFF04' : '#2CFF05'}, ${track === 'builder' ? '#2CFF05' : '#CFFF04'})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Question Content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion?.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Question */}
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                    {currentQuestion?.question}
                  </h2>

                  <p className="text-base text-[var(--text-muted)] mb-10">
                    {currentQuestion?.type === 'multi_choice'
                      ? 'Select all that apply'
                      : 'Select one option'}
                  </p>

                  {/* Options */}
                  <div className="space-y-4">
                    {currentQuestion?.options?.map((option, index) => (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSelect(option.value)}
                        className={`w-full text-left px-6 py-5 rounded-2xl border-2 transition-all ${
                          isSelected(option.value)
                            ? 'border-[#CFFF04] bg-[#CFFF04]/10'
                            : 'border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected(option.value)
                              ? 'border-[#CFFF04] bg-[#CFFF04]'
                              : 'border-gray-600'
                          }`}>
                            {isSelected(option.value) && (
                              <CheckIcon className="w-4 h-4 text-black" />
                            )}
                          </div>
                          <span className={`text-lg ${isSelected(option.value) ? 'text-white font-medium' : 'text-[var(--text-secondary)]'}`}>
                            {option.text}
                          </span>
                        </div>
                      </motion.button>
                    ))}

                    {/* Custom Input */}
                    {currentQuestion?.allowCustom && (
                      <div className="mt-6 pt-6 border-t border-gray-800">
                        <p className="text-sm text-[var(--text-muted)] mb-3">Or enter your own:</p>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder="Type your answer..."
                            className="flex-1 px-5 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#CFFF04]/50 text-lg"
                          />
                          <button
                            onClick={handleCustomSubmit}
                            disabled={!customInput.trim()}
                            className="px-6 py-4 bg-[#CFFF04] text-black font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d8ff20] transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        {currentAnswer?.customValue && (
                          <p className="mt-3 text-sm text-[#CFFF04]">
                            Your answer: {currentAnswer.customValue}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="mt-10 pt-6 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-5 py-3 text-[var(--text-muted)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back
                </button>

                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] text-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : currentIndex === questions.length - 1 ? (
                    <>
                      Complete
                      <CheckIcon className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRightIcon className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Passbook Card (2 columns) */}
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-24">
              {/* Passport Card */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)',
                  border: '1px solid rgba(207, 255, 4, 0.2)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(207, 255, 4, 0.1)'
                }}
              >
                {/* Card Glow Effect */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#CFFF04] to-transparent" />
                  <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#CFFF04] via-transparent to-[#2CFF05]" />
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2CFF05] to-transparent" />
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2CFF05] via-transparent to-[#CFFF04]" />
                </div>

                {/* Card Header */}
                <div className="relative z-10 p-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#CFFF04] to-[#2CFF05] flex items-center justify-center shadow-lg shadow-[#CFFF04]/20">
                      <span className="text-black font-black text-xl">P</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Your Passport</h3>
                      <p className="text-xs text-[var(--text-muted)]">Live profile preview</p>
                    </div>
                  </div>
                </div>

                {/* Spider Chart */}
                <div className="relative z-10 p-6">
                  <SpiderChart data={spiderData} track={track} />
                </div>

                {/* Stats Summary */}
                <div className="relative z-10 px-6 pb-6 space-y-3">
                  {[
                    { label: 'Technical Skills', value: spiderData.technicalSkills, color: '#CFFF04' },
                    { label: 'Risk Tolerance', value: spiderData.riskTolerance, color: '#CFFF04' },
                    { label: 'Community', value: spiderData.communityEngagement, color: '#2CFF05' },
                    { label: 'Time Investment', value: spiderData.timeCommitment, color: '#2CFF05' },
                    { label: 'Web3 Depth', value: spiderData.web3Depth, color: '#CFFF04' },
                    { label: 'Builder Mindset', value: spiderData.builderMindset, color: '#2CFF05' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between text-sm">
                      <span className="text-white/60">{stat.label}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: stat.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(stat.value / 5) * 100}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="text-white font-medium w-6 text-right">{stat.value.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div className="relative z-10 px-6 py-4 border-t border-white/5 bg-black/20">
                  <p className="text-xs text-center text-white/40">
                    {answers.length} of {questions.length} questions answered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
