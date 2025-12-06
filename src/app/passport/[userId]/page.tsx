'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import {
  ShareIcon,
  ArrowLeftIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { SpiderChart, SpiderChartData, defaultSpiderData } from '@/components/SpiderChart';

interface PublicProfile {
  displayName: string;
  suiAddress?: string;
  createdAt: string;
  journeys: number;
  badges: string[];
  spiderData?: SpiderChartData;
}

export default function PublicPassportPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, this would fetch from an API
    // For now, try to load from localStorage if viewing own profile
    const savedUser = localStorage.getItem('traject3_user');
    const savedJourneys = localStorage.getItem('traject3_journeys');

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        const journeys = savedJourneys ? JSON.parse(savedJourneys) : [];

        // Get latest spider data from journeys
        const latestJourney = journeys[journeys.length - 1];

        setProfile({
          displayName: user.displayName || 'Web3 Explorer',
          suiAddress: user.suiAddress,
          createdAt: user.createdAt,
          journeys: journeys.length,
          badges: ['Early Adopter', 'Quiz Completed'],
          spiderData: latestJourney?.spiderData || defaultSpiderData,
        });
      } catch (e) {
        console.error('Failed to load profile');
      }
    } else {
      // Demo profile for shared links
      setProfile({
        displayName: 'Web3 Explorer',
        suiAddress: '0x' + userId.slice(0, 16) + '...' + userId.slice(-8),
        createdAt: new Date().toISOString(),
        journeys: 2,
        badges: ['Early Adopter'],
        spiderData: defaultSpiderData,
      });
    }
    setLoading(false);
  }, [userId]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: `${profile?.displayName}'s Web3 Passport`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert('🔗 Link copied!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#CFFF04] border-t-transparent rounded-full animate-spin" />
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
        <div className="max-w-2xl mx-auto">
          {/* Passport Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] rounded-3xl opacity-20 blur-xl" />

            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl overflow-hidden">
              {/* Header Section */}
              <div className="relative p-8 pb-0">
                <div className="absolute top-4 right-4 text-xs text-white/30">
                  PASSPORT
                </div>

                <div className="flex items-center gap-6">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#CFFF04] to-[#2CFF05] flex items-center justify-center text-5xl font-black text-black shadow-lg">
                    {profile?.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                      {profile?.displayName}
                    </h1>
                    {profile?.suiAddress && (
                      <p className="text-white/40 font-mono text-sm">
                        {profile.suiAddress}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <CheckBadgeIcon className="w-5 h-5 text-[#2CFF05]" />
                      <span className="text-[#2CFF05] text-sm">Verified Web3 Explorer</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="p-8">
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-white">{profile?.journeys || 0}</p>
                    <p className="text-white/50 text-sm">Journeys</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-white">{profile?.badges?.length || 0}</p>
                    <p className="text-white/50 text-sm">Badges</p>
                  </div>
                </div>

                {/* Spider Chart */}
                {profile?.spiderData && (
                  <div className="mb-8">
                    <h3 className="text-sm text-white/50 uppercase tracking-wider mb-4">Web3 Profile</h3>
                    <div className="bg-white/5 rounded-xl p-6">
                      <div className="w-48 h-48 mx-auto">
                        <SpiderChart data={profile.spiderData} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div>
                  <h3 className="text-sm text-white/50 uppercase tracking-wider mb-4">Badges Earned</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.badges?.map((badge, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-gradient-to-r from-[#CFFF04]/20 to-[#2CFF05]/20 border border-[#CFFF04]/30 rounded-full text-sm text-[#CFFF04]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
                <p className="text-xs text-white/30">
                  Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-xs text-white/30">
                  Powered by Traject3
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-white/50 mb-4">Want your own Web3 Passport?</p>
            <button
              onClick={() => router.push('/')}
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

