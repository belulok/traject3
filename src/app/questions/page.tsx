'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import { SpiderChart, SpiderChartData, defaultSpiderData } from '@/components/SpiderChart';
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

    // Navigate to result page
    router.push('/result');
  };

  const isSelected = (value: string) => {
    return currentAnswer?.values.includes(value) || false;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex">
      {/* Left Side - Questions */}
      <div className="flex-1 flex flex-col max-w-3xl">
        {/* Header */}
        <header className="p-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${track === 'builder' ? 'bg-[#CFFF04]' : 'bg-[#2CFF05]'}`} />
              <span className="text-sm text-[var(--text-secondary)] capitalize">{track} Track</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: track === 'builder' ? '#CFFF04' : '#2CFF05' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </header>

        {/* Question Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion?.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Question */}
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {currentQuestion?.question}
              </h2>

              <p className="text-sm text-[var(--text-muted)] mb-8">
                {currentQuestion?.type === 'multi_choice'
                  ? 'Select all that apply'
                  : 'Select one option'}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion?.options?.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                      isSelected(option.value)
                        ? 'border-[#CFFF04] bg-[#CFFF04]/10'
                        : 'border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected(option.value)
                          ? 'border-[#CFFF04] bg-[#CFFF04]'
                          : 'border-gray-600'
                      }`}>
                        {isSelected(option.value) && (
                          <CheckIcon className="w-3 h-3 text-black" />
                        )}
                      </div>
                      <span className={`text-base ${isSelected(option.value) ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                        {option.text}
                      </span>
                    </div>
                  </motion.button>
                ))}

                {/* Custom Input */}
                {currentQuestion?.allowCustom && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-sm text-[var(--text-muted)] mb-2">Or enter your own:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        placeholder="Type your answer..."
                        className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#CFFF04]/50"
                      />
                      <button
                        onClick={handleCustomSubmit}
                        disabled={!customInput.trim()}
                        className="px-4 py-3 bg-[#CFFF04] text-black font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d8ff20] transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {currentAnswer?.customValue && (
                      <p className="mt-2 text-sm text-[#CFFF04]">
                        Your answer: {currentAnswer.customValue}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer Navigation */}
        <footer className="p-6 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 text-[var(--text-muted)] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] text-black font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : currentIndex === questions.length - 1 ? (
                <>
                  Complete
                  <CheckIcon className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </footer>
      </div>

      {/* Right Side - Passbook with Spider Chart */}
      <div className="hidden lg:flex w-[400px] bg-gray-900/50 border-l border-[var(--border-subtle)] flex-col">
        {/* Passbook Header */}
        <div className="p-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#CFFF04] to-[#2CFF05] flex items-center justify-center">
              <span className="text-black font-bold text-lg">P</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Your Passport</h3>
              <p className="text-xs text-[var(--text-muted)]">Live profile preview</p>
            </div>
          </div>
        </div>

        {/* Spider Chart */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <SpiderChart data={spiderData} track={track} />
          </div>

          {/* Stats Summary */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Technical Skills</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#CFFF04] transition-all duration-300"
                    style={{ width: `${(spiderData.technicalSkills / 5) * 100}%` }}
                  />
                </div>
                <span className="text-white text-xs w-4">{spiderData.technicalSkills.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Risk Tolerance</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#CFFF04] transition-all duration-300"
                    style={{ width: `${(spiderData.riskTolerance / 5) * 100}%` }}
                  />
                </div>
                <span className="text-white text-xs w-4">{spiderData.riskTolerance.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Community</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2CFF05] transition-all duration-300"
                    style={{ width: `${(spiderData.communityEngagement / 5) * 100}%` }}
                  />
                </div>
                <span className="text-white text-xs w-4">{spiderData.communityEngagement.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Time Investment</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2CFF05] transition-all duration-300"
                    style={{ width: `${(spiderData.timeCommitment / 5) * 100}%` }}
                  />
                </div>
                <span className="text-white text-xs w-4">{spiderData.timeCommitment.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Web3 Depth</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#CFFF04] transition-all duration-300"
                    style={{ width: `${(spiderData.web3Depth / 5) * 100}%` }}
                  />
                </div>
                <span className="text-white text-xs w-4">{spiderData.web3Depth.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">Builder Mindset</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2CFF05] transition-all duration-300"
                    style={{ width: `${(spiderData.builderMindset / 5) * 100}%` }}
                  />
                </div>
                <span className="text-white text-xs w-4">{spiderData.builderMindset.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Questions Answered */}
          <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
            <p className="text-xs text-[var(--text-muted)] text-center">
              {answers.length} of {questions.length} questions answered
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
