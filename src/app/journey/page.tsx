'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SpiderChart, SpiderChartData, defaultSpiderData } from '@/components/SpiderChart';
import { LoginModal } from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowRightIcon,
  BookmarkIcon,
  ShareIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlayIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  CodeBracketIcon,
  CalendarIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  RocketLaunchIcon,
  LockClosedIcon,
  SparklesIcon,
  TrophyIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

type Track = 'builder' | 'explorer';

interface ProfileSettings {
  startingLevel: string;
  riskMode: string;
  missionStyle: string;
  pace: string;
  socialMode: string;
  device: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'learn' | 'observe' | 'action' | 'community' | 'optional';
  duration: string;
  completed: boolean;
}

interface Week {
  week: number;
  title: string;
  missions: Mission[];
}

export default function JourneyPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [track, setTrack] = useState<Track>('explorer');
  const [spiderData, setSpiderData] = useState<SpiderChartData>(defaultSpiderData);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [profileSettings, setProfileSettings] = useState<ProfileSettings>({
    startingLevel: 'New to Web3',
    riskMode: 'Testnet only',
    missionStyle: 'Watch/Read first',
    pace: 'Steady (3–5 hrs)',
    socialMode: 'Lurker',
    device: 'Desktop-first',
  });

  useEffect(() => {
    const savedTrack = sessionStorage.getItem('traject3_track') as Track;
    const savedSpiderData = sessionStorage.getItem('traject3_spider_data');

    if (savedTrack) setTrack(savedTrack);
    if (savedSpiderData) {
      try {
        const parsed = JSON.parse(savedSpiderData);
        setSpiderData(parsed);
        deriveProfileSettings(parsed);
      } catch (e) {
        console.error('Failed to parse spider data');
      }
    }
  }, []);

  const deriveProfileSettings = (data: SpiderChartData) => {
    setProfileSettings({
      startingLevel: data.web3Depth >= 3 ? 'Active user' : data.web3Depth >= 1 ? 'Used a few apps' : 'New to Web3',
      riskMode: data.riskTolerance >= 3 ? 'Comfortable with real value' : data.riskTolerance >= 1 ? 'Tiny real amounts' : 'Testnet only',
      missionStyle: data.builderMindset >= 3 ? 'Guided on-chain actions' : data.web3Depth >= 2 ? 'Click & explore apps' : 'Watch/Read first',
      pace: data.timeCommitment >= 4 ? 'Deep (6–10+ hrs)' : data.timeCommitment >= 2 ? 'Steady (3–5 hrs)' : 'Light (1–2 hrs/wk)',
      socialMode: data.communityEngagement >= 3 ? 'Community-active' : data.communityEngagement >= 1 ? 'Quiet participant' : 'Lurker',
      device: 'Desktop-first',
    });
  };

  const getArchetype = () => {
    if (track === 'builder') {
      if (spiderData.builderMindset >= 4) return 'Creator';
      if (spiderData.technicalSkills >= 3) return 'Architect';
      if (spiderData.communityEngagement >= 3) return 'Operator';
      return 'Analyst';
    } else {
      if (spiderData.communityEngagement >= 4) return 'Community Citizen';
      if (spiderData.riskTolerance >= 3) return 'Strategist';
      if (spiderData.technicalSkills >= 2) return 'Power User';
      return 'Curious Observer';
    }
  };

  const getGoal = () => {
    if (track === 'builder') {
      if (spiderData.builderMindset >= 4) return 'Ship my first dApp';
      if (spiderData.riskTolerance >= 3) return 'Earn from bounties & hackathons';
      return 'Build a strong portfolio';
    } else {
      if (spiderData.riskTolerance >= 3) return 'Explore DeFi & yield strategies';
      if (spiderData.communityEngagement >= 3) return 'Join DAOs & governance';
      return 'Become a confident Web3 user';
    }
  };

  const getHorizon = () => {
    const hours = spiderData.timeCommitment >= 4 ? '8–15' : spiderData.timeCommitment >= 2 ? '4–7' : '1–3';
    return `30 days · ~${hours} hrs/week`;
  };

  const getVerticals = () => {
    const verticals = [];
    if (spiderData.riskTolerance >= 2) verticals.push('DeFi');
    if (spiderData.communityEngagement >= 2) verticals.push('DAOs');
    if (spiderData.builderMindset >= 2) verticals.push('NFTs');
    if (verticals.length === 0) verticals.push('Web3 Basics');
    return verticals;
  };

  const getChains = () => {
    if (spiderData.riskTolerance <= 1) return [{ name: 'Polygon', reason: 'Low fees, beginner friendly' }];
    if (spiderData.technicalSkills >= 3) return [
      { name: 'Ethereum', reason: 'Main ecosystem' },
      { name: 'Base', reason: 'Low fees, growing ecosystem' }
    ];
    return [
      { name: 'Base', reason: 'Low fees, beginner friendly' },
      { name: 'Polygon', reason: 'Established, low cost' }
    ];
  };

  const getJourneyPlan = (): Week[] => {
    const isBuilder = track === 'builder';

    return [
      {
        week: 1,
        title: 'Orientation & Safety',
        missions: [
          {
            id: 'm1',
            title: isBuilder ? 'Set up your dev environment' : 'Understand how wallets work',
            description: isBuilder ? 'Install Node.js, Git, and your favorite IDE' : '10-minute explainer on wallets & chains for normal people',
            type: 'learn',
            duration: '15 min',
            completed: false,
          },
          {
            id: 'm2',
            title: isBuilder ? 'Clone and run a starter template' : 'Explore a DeFi dashboard (read-only)',
            description: isBuilder ? 'Get familiar with a Web3 project structure' : 'Open this dashboard and label what you see',
            type: 'observe',
            duration: '20 min',
            completed: false,
          },
          {
            id: 'm3',
            title: 'Complete your first testnet transaction',
            description: 'Practice with fake tokens on a test network',
            type: 'optional',
            duration: '15 min',
            completed: false,
          },
        ],
      },
      {
        week: 2,
        title: 'First Real Usage',
        missions: [
          {
            id: 'm4',
            title: isBuilder ? 'Deploy a smart contract to testnet' : 'Use a beginner-friendly dApp',
            description: isBuilder ? 'Deploy your first contract using Remix or Hardhat' : 'Try a simple swap or mint on your chosen chain',
            type: 'action',
            duration: '30 min',
            completed: false,
          },
          {
            id: 'm5',
            title: 'Join your first community',
            description: 'Find a Discord/Telegram and read the start-here channel',
            type: 'community',
            duration: '15 min',
            completed: false,
          },
        ],
      },
      {
        week: 3,
        title: 'Identity & Community',
        missions: [
          {
            id: 'm6',
            title: 'Set up your Web3 identity',
            description: 'Create your handle and follow 3 people in your lane',
            type: 'action',
            duration: '20 min',
            completed: false,
          },
          {
            id: 'm7',
            title: isBuilder ? 'Contribute to an open-source project' : 'Participate in your first DAO vote',
            description: isBuilder ? 'Fix a small issue or improve documentation' : 'Vote on a proposal in Snapshot',
            type: 'action',
            duration: '30 min',
            completed: false,
          },
        ],
      },
      {
        week: 4,
        title: 'Stretch & Reflection',
        missions: [
          {
            id: 'm8',
            title: isBuilder ? 'Submit to a bounty or hackathon' : 'Try a quest with rewards',
            description: isBuilder ? 'Find a small bounty that matches your skills' : 'Complete a simple quest for XP or tokens',
            type: 'action',
            duration: '1+ hr',
            completed: false,
          },
          {
            id: 'm9',
            title: 'Reflect on your journey',
            description: 'What did you like? What do you want more of?',
            type: 'learn',
            duration: '15 min',
            completed: false,
          },
        ],
      },
    ];
  };

  const journeyPlan = getJourneyPlan();
  const archetype = getArchetype();
  const goal = getGoal();
  const verticals = getVerticals();
  const chains = getChains();

  // Handler functions
  const handleSaveJourney = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Save to localStorage with user association
    const savedJourneys = JSON.parse(localStorage.getItem('traject3_journeys') || '[]');
    const newJourney = {
      id: Date.now(),
      userId: user?.id,
      track,
      archetype,
      goal,
      spiderData,
      profileSettings,
      createdAt: new Date().toISOString(),
    };
    savedJourneys.push(newJourney);
    localStorage.setItem('traject3_journeys', JSON.stringify(savedJourneys));

    // Navigate to dashboard
    router.push('/dashboard');
  };

  const handleLoginSuccess = () => {
    // After login, save the journey and go to dashboard
    const savedJourneys = JSON.parse(localStorage.getItem('traject3_journeys') || '[]');
    const newJourney = {
      id: Date.now(),
      track,
      archetype,
      goal,
      spiderData,
      profileSettings,
      createdAt: new Date().toISOString(),
    };
    savedJourneys.push(newJourney);
    localStorage.setItem('traject3_journeys', JSON.stringify(savedJourneys));

    router.push('/dashboard');
  };

  const handleShare = async () => {
    const shareData = {
      title: `My Web3 Journey - ${archetype}`,
      text: `Check out my personalized Web3 learning path as a ${archetype}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('📋 Link copied to clipboard!');
    }
  };

  const handlePreviewMission = () => {
    const firstMission = document.getElementById('m1');
    if (firstMission) {
      firstMission.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstMission.classList.add('ring-2', 'ring-[#CFFF04]');
      setTimeout(() => {
        firstMission.classList.remove('ring-2', 'ring-[#CFFF04]');
      }, 2000);
    }
  };

  const communities = [
    { name: 'Bankless DAO', description: 'Beginner-friendly DeFi community', members: '50K+', type: 'Discord' },
    { name: 'Developer DAO', description: 'Learn to build in Web3', members: '10K+', type: 'Discord' },
    { name: 'Web3 Beginners', description: 'Ask any question, no judgment', members: '25K+', type: 'Telegram' },
  ];

  const peopleToFollow = [
    { name: 'Vitalik Buterin', handle: '@VitalikButerin', category: 'Thought Leader', platform: 'Twitter' },
    { name: 'Punk6529', handle: '@punk6529', category: 'NFT Educator', platform: 'Twitter' },
    { name: 'Patrick Collins', handle: '@PatrickAlphaC', category: 'Developer Educator', platform: 'YouTube' },
  ];

  const peers = [
    { name: 'alex.eth', archetype: 'Curious Observer', focus: 'DeFi basics', progress: 45 },
    { name: 'web3_sara', archetype: 'Power User', focus: 'NFT collecting', progress: 72 },
    { name: 'cryptodev_mike', archetype: 'Creator', focus: 'Smart contracts', progress: 38 },
  ];

  const badges = [
    { name: 'First Wallet Created', unlocked: false, icon: '🔐' },
    { name: 'Safe DeFi Explorer', unlocked: false, icon: '🔍' },
    { name: 'First On-Chain Action', unlocked: false, icon: '⚡' },
    { name: 'Community Member', unlocked: false, icon: '👥' },
    { name: 'First Governance Vote', unlocked: false, icon: '🗳️' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviewMission}
              className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
            >
              <EyeIcon className="w-5 h-5" />
              Preview Missions
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
            >
              <ShareIcon className="w-5 h-5" />
              Share
            </button>
            <button
              onClick={() => router.push('/questions')}
              className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              Adjust Focus
            </button>
          </div>
          <button
            onClick={handleSaveJourney}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] text-black font-bold rounded-xl hover:opacity-90 transition-opacity hover:scale-[1.02] active:scale-[0.98]"
          >
            <BookmarkIcon className="w-5 h-5" />
            Save Journey
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="pb-32">
        {/* 1. Hero Summary */}
        <section className="relative py-20 px-6 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
            >
              {/* Left - Profile */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#CFFF04] to-[#2CFF05] flex items-center justify-center text-4xl font-black text-black">
                  P
                </div>
                <div>
                  <p className="text-white/50 text-sm mb-1">You in Web3 (v1.0)</p>
                  <h1 className="text-3xl font-bold text-white mb-2">Your Personalized Journey</h1>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      track === 'builder' ? 'bg-[#CFFF04]/20 text-[#CFFF04]' : 'bg-[#2CFF05]/20 text-[#2CFF05]'
                    }`}>
                      {track === 'builder' ? '🛠 Builder' : '🧭 Explorer'} Track
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white">
                      {archetype}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right - Key Info */}
              <div className="grid grid-cols-2 gap-4 lg:gap-8">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Primary Goal</p>
                  <p className="text-white font-medium">{goal}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Horizon</p>
                  <p className="text-white font-medium">{getHorizon()}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. Profile Snapshot */}
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">How Your Plan Is Tuned</h2>
            <p className="text-white/50 mb-8">We heard your answers. Your plan is configured like this:</p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Starting Level', value: profileSettings.startingLevel, icon: <SparklesIcon className="w-4 h-4" /> },
                { label: 'Risk Mode', value: profileSettings.riskMode, icon: <ShieldCheckIcon className="w-4 h-4" /> },
                { label: 'Mission Style', value: profileSettings.missionStyle, icon: <EyeIcon className="w-4 h-4" /> },
                { label: 'Pace', value: profileSettings.pace, icon: <ClockIcon className="w-4 h-4" /> },
                { label: 'Social Mode', value: profileSettings.socialMode, icon: <ChatBubbleLeftRightIcon className="w-4 h-4" /> },
                { label: 'Device', value: profileSettings.device, icon: <ComputerDesktopIcon className="w-4 h-4" /> },
              ].map((setting, i) => (
                <motion.div
                  key={setting.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-2 text-white/50 mb-2">
                    {setting.icon}
                    <span className="text-xs uppercase tracking-wider">{setting.label}</span>
                  </div>
                  <p className="text-white font-medium text-sm">{setting.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Focus Areas */}
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Your Web3 Map</h2>
            <p className="text-white/50 mb-8">What you'll explore on this journey:</p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Verticals */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#CFFF04]/10 to-transparent border border-[#CFFF04]/20">
                <GlobeAltIcon className="w-8 h-8 text-[#CFFF04] mb-4" />
                <h3 className="text-white font-semibold mb-3">Verticals</h3>
                <div className="flex flex-wrap gap-2">
                  {verticals.map(v => (
                    <span key={v} className="px-3 py-1 bg-[#CFFF04]/20 text-[#CFFF04] rounded-full text-sm">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chains */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#2CFF05]/10 to-transparent border border-[#2CFF05]/20">
                <LinkIcon className="w-8 h-8 text-[#2CFF05] mb-4" />
                <h3 className="text-white font-semibold mb-3">Primary Chains</h3>
                <div className="space-y-2">
                  {chains.map(c => (
                    <div key={c.name}>
                      <span className="text-white font-medium">{c.name}</span>
                      <span className="text-white/50 text-sm ml-2">· {c.reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mission Themes */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10">
                <RocketLaunchIcon className="w-8 h-8 text-white mb-4" />
                <h3 className="text-white font-semibold mb-3">Mission Themes</h3>
                <div className="space-y-2 text-sm text-white/70">
                  <p>• Safety & red flags</p>
                  <p>• Understanding flows</p>
                  <p>• Doing simple actions</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. The Actual Plan */}
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Your 30-Day Path</h2>
            <p className="text-white/50 mb-8">A structured timeline tailored to your pace and goals:</p>

            <div className="space-y-8">
              {journeyPlan.map((week, weekIdx) => (
                <motion.div
                  key={week.week}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: weekIdx * 0.1 }}
                  className="relative"
                >
                  {/* Week Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#CFFF04] to-[#2CFF05] flex items-center justify-center text-black font-bold">
                      W{week.week}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Week {week.week}</h3>
                      <p className="text-white/50 text-sm">{week.title}</p>
                    </div>
                  </div>

                  {/* Missions */}
                  <div className="ml-6 pl-10 border-l-2 border-white/10 space-y-4">
                    {week.missions.map((mission, mIdx) => (
                      <div
                        key={mission.id}
                        id={mission.id}
                        className={`p-4 rounded-xl border transition-all ${
                          mission.type === 'optional'
                            ? 'bg-white/5 border-white/10 border-dashed'
                            : 'bg-white/5 border-white/10 hover:border-[#CFFF04]/30'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                mission.type === 'learn' ? 'bg-blue-500/20 text-blue-400' :
                                mission.type === 'observe' ? 'bg-yellow-500/20 text-yellow-400' :
                                mission.type === 'action' ? 'bg-green-500/20 text-green-400' :
                                mission.type === 'community' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-white/10 text-white/50'
                              }`}>
                                {mission.type === 'learn' ? '📚 Learn' :
                                 mission.type === 'observe' ? '👀 Observe' :
                                 mission.type === 'action' ? '⚡ Action' :
                                 mission.type === 'community' ? '👥 Community' :
                                 '✨ Optional'}
                              </span>
                              <span className="text-xs text-white/40">{mission.duration}</span>
                            </div>
                            <h4 className="text-white font-medium">{mission.title}</h4>
                            <p className="text-white/50 text-sm mt-1">{mission.description}</p>
                          </div>
                          <button
                            onClick={() => {
                              alert(`🚀 Starting: ${mission.title}\n\n${mission.description}\n\nEstimated time: ${mission.duration}`);
                            }}
                            className="ml-4 px-3 py-1 text-xs text-[#CFFF04] border border-[#CFFF04]/30 rounded-lg hover:bg-[#CFFF04]/10 transition-colors hover:scale-105 active:scale-95"
                          >
                            Start
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Apps, Chains & Tools */}
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Apps, Chains & Tools You'll Use</h2>
            <p className="text-white/50 mb-8">Everything is selected based on your preferences:</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-[#CFFF04] font-medium mb-2">Wallet</h3>
                <p className="text-white font-semibold">MetaMask</p>
                <p className="text-white/50 text-sm mt-1">Mobile & desktop friendly</p>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-[#CFFF04] font-medium mb-2">Explorer</h3>
                <p className="text-white font-semibold">Etherscan / Polygonscan</p>
                <p className="text-white/50 text-sm mt-1">See what's happening on-chain</p>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-[#CFFF04] font-medium mb-2">DeFi App</h3>
                <p className="text-white font-semibold">Uniswap</p>
                <p className="text-white/50 text-sm mt-1">Beginner-friendly swaps</p>
              </div>
              <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-[#CFFF04] font-medium mb-2">DAO Tool</h3>
                <p className="text-white font-semibold">Snapshot</p>
                <p className="text-white/50 text-sm mt-1">Gasless governance voting</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Communities & Events */}
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Communities & Events</h2>
            <p className="text-white/50 mb-8">Where people like you hang out:</p>

            <div className="grid md:grid-cols-3 gap-6">
              {communities.map((community, i) => (
                <motion.div
                  key={community.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#CFFF04]/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2 py-1 bg-[#CFFF04]/20 text-[#CFFF04] rounded-full">{community.type}</span>
                    <span className="text-xs text-white/40">{community.members} members</span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">{community.name}</h3>
                  <p className="text-white/50 text-sm mb-3">{community.description}</p>
                  <button
                    onClick={() => alert(`🔗 Opening ${community.name}...\n\nIn a full version, this would open the ${community.type} invite link.`)}
                    className="text-sm text-[#CFFF04] hover:underline"
                  >
                    Join →
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. People to Follow */}
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">People & Channels to Follow</h2>
            <p className="text-white/50 mb-8">Curated for your interests:</p>

            <div className="grid md:grid-cols-3 gap-6">
              {peopleToFollow.map((person, i) => (
                <motion.div
                  key={person.handle}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#CFFF04] to-[#2CFF05]" />
                    <div>
                      <h3 className="text-white font-semibold">{person.name}</h3>
                      <p className="text-white/50 text-sm">{person.handle}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded-full">{person.category}</span>
                    <span className="text-xs text-white/40">{person.platform}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Peers on Same Journey */}
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Others on the Same Journey</h2>
            <p className="text-white/50 mb-8">Connect with peers in your archetype and field:</p>

            <div className="grid md:grid-cols-3 gap-6">
              {peers.map((peer, i) => (
                <motion.div
                  key={peer.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                    <div>
                      <h3 className="text-white font-medium">{peer.name}</h3>
                      <p className="text-white/50 text-xs">{peer.archetype}</p>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm mb-3">Focusing on: {peer.focus}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2CFF05]" style={{ width: `${peer.progress}%` }} />
                    </div>
                    <span className="text-xs text-white/40">{peer.progress}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Safety & Guardrails */}
        <section className="py-16 px-6 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Safety & Guardrails</h2>
            <p className="text-white/50 mb-8">Personalized guidance based on your risk profile:</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Do's */}
              <div className="p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircleIcon className="w-6 h-6 text-green-400" />
                  <h3 className="text-green-400 font-semibold">Do's for YOU</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-white/80">
                    <span className="text-green-400 mt-1">✓</span>
                    Stick to testnets for first 2 weeks
                  </li>
                  <li className="flex items-start gap-2 text-white/80">
                    <span className="text-green-400 mt-1">✓</span>
                    Use a fresh wallet for learning (not your main)
                  </li>
                  <li className="flex items-start gap-2 text-white/80">
                    <span className="text-green-400 mt-1">✓</span>
                    Verify contract addresses before interacting
                  </li>
                </ul>
              </div>

              {/* Don'ts */}
              <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-400" />
                  <h3 className="text-red-400 font-semibold">Don'ts for YOU</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-white/80">
                    <span className="text-red-400 mt-1">✗</span>
                    Ignore DMs promising high returns
                  </li>
                  <li className="flex items-start gap-2 text-white/80">
                    <span className="text-red-400 mt-1">✗</span>
                    Don't bridge large amounts yet
                  </li>
                  <li className="flex items-start gap-2 text-white/80">
                    <span className="text-red-400 mt-1">✗</span>
                    Never share your seed phrase anywhere
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 10. Passport & Progress */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Your Passport & Progress</h2>
            <p className="text-white/50 mb-8">Track your achievements on this journey:</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Spider Chart */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Profile Snapshot</h3>
                <SpiderChart data={spiderData} track={track} />
              </div>

              {/* Badges */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-white font-semibold mb-4">Badges to Unlock</h3>
                <div className="space-y-4">
                  {badges.map((badge, i) => (
                    <div
                      key={badge.name}
                      className={`flex items-center gap-4 p-3 rounded-xl ${
                        badge.unlocked ? 'bg-[#CFFF04]/10' : 'bg-white/5'
                      }`}
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <div className="flex-1">
                        <p className={badge.unlocked ? 'text-white font-medium' : 'text-white/60'}>
                          {badge.name}
                        </p>
                      </div>
                      {badge.unlocked ? (
                        <CheckCircleIcon className="w-5 h-5 text-[#CFFF04]" />
                      ) : (
                        <LockClosedIcon className="w-5 h-5 text-white/30" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/50 text-sm">Progress</span>
                    <span className="text-white font-medium">0 / 5 badges</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] w-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

