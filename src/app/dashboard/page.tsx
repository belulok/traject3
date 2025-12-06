'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/LoginModal';
import {
  PlusIcon,
  ArrowRightIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  BriefcaseIcon,
  TrophyIcon,
  NewspaperIcon,
  UserGroupIcon,
  CalendarIcon,
  UserIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
  PencilIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';

interface SavedJourney {
  id: number;
  userId?: string;
  track: 'builder' | 'explorer';
  archetype: string;
  goal: string;
  spiderData: any;
  profileSettings: any;
  createdAt: string;
}

type DashboardTab = 'journeys' | 'bounties' | 'hackathons' | 'jobs' | 'news' | 'communities' | 'events' | 'passport';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [savedJourneys, setSavedJourneys] = useState<SavedJourney[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>('journeys');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showJourneyMenu, setShowJourneyMenu] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
    loadJourneys();
  }, [isAuthenticated]);

  const loadJourneys = () => {
    const saved = localStorage.getItem('traject3_journeys');
    if (saved) {
      try {
        setSavedJourneys(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load journeys');
      }
    }
  };

  const deleteJourney = (id: number) => {
    const updated = savedJourneys.filter(j => j.id !== id);
    setSavedJourneys(updated);
    localStorage.setItem('traject3_journeys', JSON.stringify(updated));
    setShowJourneyMenu(null);
  };

  const openJourney = (journey: SavedJourney) => {
    // Store the journey data in sessionStorage so the journey page can load it
    sessionStorage.setItem('traject3_track', journey.track);
    sessionStorage.setItem('traject3_spider_data', JSON.stringify(journey.spiderData));
    sessionStorage.setItem('traject3_answers', JSON.stringify([])); // Empty answers, using spider data directly
    sessionStorage.setItem('traject3_journey_id', journey.id.toString());

    // Navigate to journey page
    router.push('/journey');
  };

  const sharePassport = async () => {
    const passportUrl = `${window.location.origin}/passport/${user?.id || 'anonymous'}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.displayName}'s Web3 Passport`,
          text: 'Check out my Web3 journey and credentials!',
          url: passportUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(passportUrl);
      alert('🔗 Passport link copied to clipboard!');
    }
  };

  const shareJourney = async (journey: SavedJourney) => {
    const journeyUrl = `${window.location.origin}/journey/shared/${journey.id}`;
    await navigator.clipboard.writeText(journeyUrl);
    alert('🔗 Journey link copied to clipboard!');
    setShowJourneyMenu(null);
  };

  const tabs: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { id: 'journeys', label: 'My Journeys', icon: <BookmarkIcon className="w-5 h-5" /> },
    { id: 'bounties', label: 'Bounties', icon: <TrophyIcon className="w-5 h-5" /> },
    { id: 'hackathons', label: 'Hackathons', icon: <TrophyIcon className="w-5 h-5" /> },
    { id: 'jobs', label: 'Web3 Jobs', icon: <BriefcaseIcon className="w-5 h-5" /> },
    { id: 'news', label: 'News', icon: <NewspaperIcon className="w-5 h-5" /> },
    { id: 'communities', label: 'Communities', icon: <UserGroupIcon className="w-5 h-5" /> },
    { id: 'events', label: 'Events', icon: <CalendarIcon className="w-5 h-5" /> },
    { id: 'passport', label: 'My Passport', icon: <UserIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          if (!isAuthenticated) {
            router.push('/');
          }
          setShowLoginModal(false);
        }}
        onSuccess={() => setShowLoginModal(false)}
      />

      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <h1
                onClick={() => router.push('/')}
                className="text-2xl font-black bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] bg-clip-text text-transparent cursor-pointer"
              >
                Traject3
              </h1>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search bounties, jobs, communities..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#CFFF04]/50"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-white/60 hover:text-white transition-colors">
                <BellIcon className="w-5 h-5" />
              </button>
              <button className="p-2 text-white/60 hover:text-white transition-colors">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              {user && (
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CFFF04] to-[#2CFF05] flex items-center justify-center text-black font-bold text-sm">
                    {user.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm text-white font-medium">{user.displayName}</p>
                    <p className="text-xs text-white/40">{user.email || `${user.suiAddress?.slice(0, 8)}...`}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="text-xs text-white/40 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-20 bottom-0 w-64 bg-gray-900/50 border-r border-white/10 p-4 overflow-y-auto">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#CFFF04]/10 text-[#CFFF04]'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* New Journey Button */}
          <div className="mt-8">
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              <PlusIcon className="w-5 h-5" />
              New Journey
            </button>
          </div>
        </aside>

        {/* Main Area */}
        <main className="flex-1 ml-64 p-8">
          {/* Journeys Tab */}
          {activeTab === 'journeys' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">My Journeys</h2>
                  <p className="text-white/50">Your saved personalized Web3 learning paths</p>
                </div>
              </div>

              {savedJourneys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <BookmarkIcon className="w-10 h-10 text-white/30" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No journeys yet</h3>
                  <p className="text-white/50 mb-6 text-center max-w-md">
                    Take the quiz to get your personalized Web3 learning path and save it here.
                  </p>
                  <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] text-black font-bold rounded-xl"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Create Your First Journey
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedJourneys.map((journey) => (
                    <motion.div
                      key={journey.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative group"
                    >
                      <div
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#CFFF04]/30 transition-colors cursor-pointer"
                        onClick={() => openJourney(journey)}
                      >
                        {/* Card Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              journey.track === 'builder'
                                ? 'bg-[#CFFF04]/20 text-[#CFFF04]'
                                : 'bg-[#2CFF05]/20 text-[#2CFF05]'
                            }`}>
                              {journey.track === 'builder' ? '🛠' : '🧭'}
                            </div>
                            <div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                journey.track === 'builder'
                                  ? 'bg-[#CFFF04]/20 text-[#CFFF04]'
                                  : 'bg-[#2CFF05]/20 text-[#2CFF05]'
                              }`}>
                                {journey.track === 'builder' ? 'Builder' : 'Explorer'}
                              </span>
                              <h3 className="text-white font-semibold mt-1">{journey.archetype}</h3>
                            </div>
                          </div>

                          {/* Menu */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowJourneyMenu(showJourneyMenu === journey.id ? null : journey.id);
                              }}
                              className="p-1 text-white/40 hover:text-white transition-colors"
                            >
                              <EllipsisHorizontalIcon className="w-5 h-5" />
                            </button>

                            {showJourneyMenu === journey.id && (
                              <div className="absolute right-0 top-8 w-40 bg-gray-900 border border-white/10 rounded-lg shadow-xl overflow-hidden z-10">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    shareJourney(journey);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                                >
                                  <ShareIcon className="w-4 h-4" />
                                  Share
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteJourney(journey.id);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Goal */}
                        <p className="text-white/60 text-sm mb-4">{journey.goal}</p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <span>Created {new Date(journey.createdAt).toLocaleDateString()}</span>
                        </div>

                        {/* Open Button */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openJourney(journey);
                            }}
                            className="flex items-center gap-2 text-sm text-[#CFFF04] hover:underline"
                          >
                            Open Journey
                            <ChevronRightIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Add New Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => router.push('/')}
                    className="p-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-[#CFFF04]/30 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                      <PlusIcon className="w-6 h-6 text-white/40" />
                    </div>
                    <p className="text-white/40 font-medium">Create New Journey</p>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* Bounties Tab */}
          {activeTab === 'bounties' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Bounties</h2>
              <p className="text-white/50 mb-8">Find paid tasks that match your skills</p>

              <div className="grid gap-4">
                {[
                  { title: 'Build a DeFi Dashboard', reward: '$500', platform: 'Dework', difficulty: 'Intermediate', deadline: '5 days' },
                  { title: 'Smart Contract Audit', reward: '$1,000', platform: 'Immunefi', difficulty: 'Advanced', deadline: '2 weeks' },
                  { title: 'Write Technical Documentation', reward: '$200', platform: 'Layer3', difficulty: 'Beginner', deadline: '1 week' },
                ].map((bounty, i) => (
                  <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#CFFF04]/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{bounty.title}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs px-2 py-1 bg-[#CFFF04]/20 text-[#CFFF04] rounded-full">{bounty.reward}</span>
                          <span className="text-xs text-white/40">{bounty.platform}</span>
                          <span className="text-xs text-white/40">{bounty.difficulty}</span>
                          <span className="text-xs text-white/40">Due: {bounty.deadline}</span>
                        </div>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-white/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hackathons Tab */}
          {activeTab === 'hackathons' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Hackathons</h2>
              <p className="text-white/50 mb-8">Upcoming competitions and build events</p>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: 'ETH Global Bangkok', date: 'Dec 15-17, 2025', prizes: '$100K+', location: 'Bangkok, Thailand' },
                  { name: 'Sui Overflow', date: 'Jan 2026', prizes: '$50K', location: 'Online' },
                ].map((hack, i) => (
                  <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-white font-semibold text-lg">{hack.name}</h3>
                    <p className="text-white/50 mt-1">{hack.location}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <span className="text-xs px-2 py-1 bg-[#2CFF05]/20 text-[#2CFF05] rounded-full">{hack.prizes}</span>
                      <span className="text-xs text-white/40">{hack.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Web3 Jobs</h2>
              <p className="text-white/50 mb-8">Full-time and contract opportunities</p>

              <div className="grid gap-4">
                {[
                  { title: 'Senior Solidity Developer', company: 'Uniswap', location: 'Remote', salary: '$150-200K' },
                  { title: 'Frontend Engineer', company: 'Aave', location: 'Remote', salary: '$120-160K' },
                  { title: 'Community Manager', company: 'Polygon', location: 'Remote', salary: '$80-100K' },
                ].map((job, i) => (
                  <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#CFFF04]/30 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{job.title}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm text-white/60">{job.company}</span>
                          <span className="text-xs text-white/40">{job.location}</span>
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">{job.salary}</span>
                        </div>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 text-white/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* News Tab */}
          {activeTab === 'news' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Web3 News</h2>
              <p className="text-white/50 mb-8">Stay updated with the latest in Web3</p>

              <div className="grid gap-4">
                {[
                  { title: 'Sui Network Reaches 1M Daily Active Users', source: 'The Block', time: '2 hours ago' },
                  { title: 'Ethereum L2 TVL Hits New All-Time High', source: 'DeFi Llama', time: '5 hours ago' },
                  { title: 'New DAO Governance Framework Proposed', source: 'Bankless', time: '1 day ago' },
                ].map((news, i) => (
                  <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#CFFF04]/30 transition-colors cursor-pointer">
                    <h3 className="text-white font-semibold">{news.title}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-white/60">{news.source}</span>
                      <span className="text-xs text-white/40">{news.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Communities Tab */}
          {activeTab === 'communities' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Communities</h2>
              <p className="text-white/50 mb-8">Like Luma for Web3 communities</p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Developer DAO', members: '10K+', type: 'Discord', category: 'Builders' },
                  { name: 'Bankless', members: '200K+', type: 'Discord', category: 'Education' },
                  { name: 'Sui Community', members: '50K+', type: 'Discord', category: 'Ecosystem' },
                ].map((community, i) => (
                  <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#CFFF04] to-[#2CFF05] mb-4" />
                    <h3 className="text-white font-semibold">{community.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-white/40">{community.members} members</span>
                      <span className="text-xs px-2 py-1 bg-white/10 text-white/60 rounded-full">{community.category}</span>
                    </div>
                    <button className="mt-4 text-sm text-[#CFFF04] hover:underline">Join →</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Events</h2>
              <p className="text-white/50 mb-8">Like Eventbrite for Web3 events</p>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: 'Intro to DeFi Workshop', date: 'Dec 10, 2025', type: 'Online', price: 'Free' },
                  { name: 'Sui Builder Meetup', date: 'Dec 15, 2025', type: 'Singapore', price: 'Free' },
                ].map((event, i) => (
                  <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <CalendarIcon className="w-5 h-5 text-[#CFFF04]" />
                      <span className="text-sm text-white/60">{event.date}</span>
                    </div>
                    <h3 className="text-white font-semibold">{event.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-white/40">{event.type}</span>
                      <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">{event.price}</span>
                    </div>
                    <button className="mt-4 text-sm text-[#CFFF04] hover:underline">RSVP →</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Passport Tab */}
          {activeTab === 'passport' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">My Passport</h2>
              <p className="text-white/50 mb-8">Your shareable Web3 identity - like Linktree for Web3</p>

              <div className="max-w-2xl">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10">
                  {/* Profile Header */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#CFFF04] to-[#2CFF05] flex items-center justify-center text-4xl font-black text-black">
                      {user?.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{user?.displayName || 'Anonymous'}</h3>
                      <p className="text-white/50">{user?.suiAddress ? `${user.suiAddress.slice(0, 10)}...${user.suiAddress.slice(-8)}` : 'No wallet connected'}</p>
                      <button className="mt-2 text-sm text-[#CFFF04] hover:underline flex items-center gap-1">
                        <PencilIcon className="w-4 h-4" />
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mb-8">
                    <h4 className="text-sm text-white/50 uppercase tracking-wider mb-4">Social Links</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {['Twitter', 'GitHub', 'Discord', 'Farcaster'].map((platform) => (
                        <button
                          key={platform}
                          className="p-3 rounded-lg border border-dashed border-white/20 text-white/40 hover:border-[#CFFF04]/50 hover:text-white transition-colors"
                        >
                          + Add {platform}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="mb-8">
                    <h4 className="text-sm text-white/50 uppercase tracking-wider mb-4">Badges</h4>
                    <p className="text-white/30 text-sm">Complete missions to earn badges</p>
                  </div>

                  {/* Share Button */}
                  <button
                    onClick={sharePassport}
                    className="w-full py-3 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <ShareIcon className="w-5 h-5" />
                    Share My Passport
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
