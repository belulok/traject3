'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { SpiderChart, SpiderChartData, defaultSpiderData } from '@/components/SpiderChart';

interface SharedJourney {
  id: number;
  track: 'builder' | 'explorer';
  archetype: string;
  goal: string;
  spiderData: SpiderChartData;
  createdAt: string;
}

export default function SharedJourneyPage() {
  const params = useParams();
  const router = useRouter();
  const journeyId = params.journeyId as string;
  const [journey, setJourney] = useState<SharedJourney | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load from localStorage (in production this would be an API call)
    const savedJourneys = localStorage.getItem('traject3_journeys');

    if (savedJourneys) {
      try {
        const journeys = JSON.parse(savedJourneys);
        const found = journeys.find((j: SharedJourney) => j.id.toString() === journeyId);
        if (found) {
          setJourney(found);
        }
      } catch (e) {
        console.error('Failed to load journey');
      }
    }

    // If not found, show demo data
    if (!journey) {
      setJourney({
        id: parseInt(journeyId),
        track: 'explorer',
        archetype: 'Community Citizen',
        goal: 'Explore DeFi & yield strategies',
        spiderData: defaultSpiderData,
        createdAt: new Date().toISOString(),
      });
    }

    setLoading(false);
  }, [journeyId]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: `${journey?.archetype} - Web3 Journey`,
        text: journey?.goal,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert('🔗 Link copied!');
    }
  };

  const handleStartSimilar = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#CFFF04] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">Journey not found</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] text-black font-bold rounded-lg"
          >
            Start Your Own Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(207, 255, 4, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(207, 255, 4, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-2xl font-black bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] bg-clip-text text-transparent">
              Traject3
            </span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ShareIcon className="w-4 h-4 text-white" />
            <span className="text-white text-sm">Share</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Shared Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/60">
              Shared Journey
            </span>
          </motion.div>

          {/* Journey Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
                  journey.track === 'builder'
                    ? 'bg-[#CFFF04]/20'
                    : 'bg-[#2CFF05]/20'
                }`}>
                  {journey.track === 'builder' ? '🛠' : '🧭'}
                </div>
                <div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    journey.track === 'builder'
                      ? 'bg-[#CFFF04]/20 text-[#CFFF04]'
                      : 'bg-[#2CFF05]/20 text-[#2CFF05]'
                  }`}>
                    {journey.track === 'builder' ? 'Builder Track' : 'Explorer Track'}
                  </span>
                  <h1 className="text-3xl font-bold text-white mt-2">{journey.archetype}</h1>
                </div>
              </div>
              <p className="text-xl text-white/60">{journey.goal}</p>
            </div>

            {/* Spider Chart */}
            <div className="p-8 border-b border-white/10">
              <h3 className="text-sm text-white/50 uppercase tracking-wider mb-6">Profile Analysis</h3>
              <div className="flex justify-center">
                <div className="w-64 h-64">
                  <SpiderChart data={journey.spiderData} />
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{journey.spiderData.technicalSkills}/5</p>
                <p className="text-white/50 text-sm">Technical Skills</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{journey.spiderData.riskTolerance}/5</p>
                <p className="text-white/50 text-sm">Risk Tolerance</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{journey.spiderData.communityEngagement}/5</p>
                <p className="text-white/50 text-sm">Community</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{journey.spiderData.timeCommitment}/5</p>
                <p className="text-white/50 text-sm">Time Investment</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{journey.spiderData.web3Depth}/5</p>
                <p className="text-white/50 text-sm">Web3 Depth</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{journey.spiderData.builderMindset}/5</p>
                <p className="text-white/50 text-sm">Builder Mindset</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-white/5 border-t border-white/10">
              <p className="text-xs text-white/30">
                Created {new Date(journey.createdAt).toLocaleDateString()}
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-white/50 mb-4">Want your own personalized Web3 journey?</p>
            <button
              onClick={handleStartSimilar}
              className="px-8 py-3 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Start Your Journey
            </button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

