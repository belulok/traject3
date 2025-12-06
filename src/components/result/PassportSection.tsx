'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SpiderChart, SpiderChartData, defaultSpiderData } from '@/components/SpiderChart';
import {
  RocketLaunchIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface PassportSectionProps {
  track: 'builder' | 'explorer';
}

interface PersonalizedInsight {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

export function PassportSection({ track }: PassportSectionProps) {
  const [spiderData, setSpiderData] = useState<SpiderChartData>(defaultSpiderData);
  const [insights, setInsights] = useState<PersonalizedInsight[]>([]);

  useEffect(() => {
    // Load spider data from session storage
    const savedData = sessionStorage.getItem('traject3_spider_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSpiderData(parsed);
        generateInsights(parsed);
      } catch (e) {
        console.error('Failed to parse spider data:', e);
      }
    }
  }, []);

  const generateInsights = (data: SpiderChartData) => {
    const generatedInsights: PersonalizedInsight[] = [];

    // Technical Skills insight
    if (data.technicalSkills >= 3) {
      generatedInsights.push({
        icon: <CodeBracketIcon className="w-5 h-5" />,
        title: 'Strong Technical Foundation',
        description: 'You have solid coding skills. Focus on smart contract development and protocol-level contributions.',
        color: '#CFFF04'
      });
    } else if (data.technicalSkills >= 1) {
      generatedInsights.push({
        icon: <CodeBracketIcon className="w-5 h-5" />,
        title: 'Growing Technical Skills',
        description: 'Start with no-code tools and gradually build up to more technical projects.',
        color: '#CFFF04'
      });
    }

    // Risk Tolerance insight
    if (data.riskTolerance >= 3) {
      generatedInsights.push({
        icon: <CurrencyDollarIcon className="w-5 h-5" />,
        title: 'Ready for DeFi',
        description: 'Your risk profile suits exploring yield strategies, liquidity provision, and on-chain trading.',
        color: '#2CFF05'
      });
    } else {
      generatedInsights.push({
        icon: <ShieldCheckIcon className="w-5 h-5" />,
        title: 'Safety First Approach',
        description: 'Start with testnets and educational content before committing any real value.',
        color: '#2CFF05'
      });
    }

    // Community insight
    if (data.communityEngagement >= 3) {
      generatedInsights.push({
        icon: <UserGroupIcon className="w-5 h-5" />,
        title: 'Community Leader Potential',
        description: 'Your social energy is perfect for DAO participation, community management, or ambassador roles.',
        color: '#CFFF04'
      });
    } else {
      generatedInsights.push({
        icon: <UserGroupIcon className="w-5 h-5" />,
        title: 'Observer Mode',
        description: 'Start by lurking in communities, absorbing knowledge before actively participating.',
        color: '#CFFF04'
      });
    }

    // Web3 Depth insight
    if (data.web3Depth >= 3) {
      generatedInsights.push({
        icon: <GlobeAltIcon className="w-5 h-5" />,
        title: 'Web3 Native',
        description: 'You understand the ecosystem well. Focus on advanced topics like MEV, cross-chain, or governance.',
        color: '#2CFF05'
      });
    } else {
      generatedInsights.push({
        icon: <GlobeAltIcon className="w-5 h-5" />,
        title: 'Web3 Explorer',
        description: 'Perfect time to explore! Start with wallet setup, basic transactions, and understanding gas.',
        color: '#2CFF05'
      });
    }

    // Builder Mindset insight
    if (data.builderMindset >= 3) {
      generatedInsights.push({
        icon: <RocketLaunchIcon className="w-5 h-5" />,
        title: 'Builder DNA',
        description: 'You think like a creator. Consider hackathons, bounties, and open-source contributions.',
        color: '#CFFF04'
      });
    }

    setInsights(generatedInsights.slice(0, 4)); // Max 4 insights
  };

  const getProfileStrength = () => {
    const total = Object.values(spiderData).reduce((a, b) => a + b, 0);
    const max = 30; // 6 dimensions * 5 max
    return Math.round((total / max) * 100);
  };

  const getProfileType = () => {
    const { technicalSkills, communityEngagement, riskTolerance, builderMindset, web3Depth } = spiderData;

    if (builderMindset >= 3 && technicalSkills >= 3) return 'Technical Builder';
    if (communityEngagement >= 3 && builderMindset >= 2) return 'Community Builder';
    if (riskTolerance >= 3 && web3Depth >= 2) return 'DeFi Explorer';
    if (communityEngagement >= 3) return 'Social Explorer';
    if (web3Depth >= 2) return 'Curious Learner';
    return 'Fresh Explorer';
  };

  return (
    <section className="min-h-screen bg-black py-20 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CFFF04] to-[#2CFF05]">Passport</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Based on your answers, we've created a personalized profile to guide your Web3 journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left - Passport Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)',
                border: '2px solid rgba(207, 255, 4, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(207, 255, 4, 0.1)'
              }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: 'url(/lucas-k-GAM-7l4QzmI-unsplash.jpg)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black/90" />

              {/* Glow Border */}
              <div className="absolute inset-0 opacity-50">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#CFFF04] to-transparent" />
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-[#CFFF04] via-transparent to-[#2CFF05]" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2CFF05] to-transparent" />
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#2CFF05] via-transparent to-[#CFFF04]" />
              </div>

              {/* Card Content */}
              <div className="relative z-10 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#CFFF04] to-[#2CFF05] flex items-center justify-center shadow-lg shadow-[#CFFF04]/30">
                      <span className="text-black font-black text-2xl">P</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">{track === 'builder' ? 'Builder' : 'Explorer'} Passport</h3>
                      <p className="text-sm text-white/50">Web3 Identity Card</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#CFFF04]">{getProfileStrength()}%</p>
                    <p className="text-xs text-white/50">Profile Strength</p>
                  </div>
                </div>

                {/* Profile Type */}
                <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/50 mb-1">Profile Type</p>
                  <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#CFFF04] to-[#2CFF05]">
                    {getProfileType()}
                  </p>
                </div>

                {/* Spider Chart */}
                <div className="mb-6">
                  <SpiderChart data={spiderData} track={track} />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Technical', value: spiderData.technicalSkills },
                    { label: 'Risk', value: spiderData.riskTolerance },
                    { label: 'Community', value: spiderData.communityEngagement },
                    { label: 'Time', value: spiderData.timeCommitment },
                    { label: 'Web3', value: spiderData.web3Depth },
                    { label: 'Builder', value: spiderData.builderMindset },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between text-sm p-2 rounded-lg bg-white/5">
                      <span className="text-white/60">{stat.label}</span>
                      <span className="text-white font-medium">{stat.value.toFixed(1)}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Personalized Insights */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Personalized Insights
            </h3>

            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${insight.color}20`, color: insight.color }}
                  >
                    {insight.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                    <p className="text-sm text-white/60 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Recommended Actions */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-[#CFFF04]/10 to-[#2CFF05]/10 border border-[#CFFF04]/20">
              <h4 className="font-bold text-white mb-4">Recommended First Steps</h4>
              <ul className="space-y-3">
                {track === 'builder' ? (
                  <>
                    <li className="flex items-center gap-3 text-sm text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CFFF04]" />
                      Set up your development environment
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CFFF04]" />
                      Complete your first smart contract tutorial
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CFFF04]" />
                      Join a builder Discord community
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center gap-3 text-sm text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2CFF05]" />
                      Set up your first wallet safely
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2CFF05]" />
                      Explore a testnet without real funds
                    </li>
                    <li className="flex items-center gap-3 text-sm text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2CFF05]" />
                      Follow key thought leaders in your interest areas
                    </li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

