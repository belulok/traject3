'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, BoltIcon, ChevronDownIcon, UserIcon } from '@heroicons/react/24/outline';
import { MarketVisualization } from '@/components/MarketVisualization';
import { useAuth } from '@/contexts/AuthContext';
import { LoginModal } from '@/components/LoginModal';

// Dynamic provocative copy
const DYNAMIC_COPY = [
  {
    headline: "Your current skills won't survive the next 3 years.",
    subheadline: "Let's fix that in 60 seconds."
  },
  {
    headline: "The future doesn't care about your degree.",
    subheadline: "But it WILL care about your Web3 identity. Generate yours."
  },
  {
    headline: "The world just upgraded. Did you?",
    subheadline: "Type who you are → get your future-ready path."
  },
  {
    headline: "AI is replacing roles. Web3 is creating new ones.",
    subheadline: "Where do you stand? Let's find out."
  },
  {
    headline: "In 5 years, your job title will be irrelevant.",
    subheadline: "Your skills won't. Discover where you fit."
  },
  {
    headline: "You're not behind. You're just unguided.",
    subheadline: "Type who you are → get direction."
  },
  {
    headline: "Everything is changing. Except your career.",
    subheadline: "Let's make the right change."
  },
  {
    headline: "Web3, AI, automation… You either drown or evolve.",
    subheadline: "Let's evolve."
  },
  {
    headline: "Your future self is waiting.",
    subheadline: "Don't keep them waiting. Let's go."
  }
];

const EXAMPLES = [
  { text: "Graphic designer" },
  { text: "I want side income" },
  { text: "Marketing intern" },
  { text: "I want global remote work" },
  { text: "Student learning to code" },
  { text: "Content creator" }
];

const TRACKS = [
  { value: 'explorer', label: 'User / Explorer', description: 'Learn, explore, and earn in Web3' },
  { value: 'builder', label: 'Developer / Builder', description: 'Build projects and contribute code' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicCopy, setDynamicCopy] = useState(DYNAMIC_COPY[0]);
  const [focusedExample, setFocusedExample] = useState<number | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<'explorer' | 'builder'>('explorer');
  const [isTrackDropdownOpen, setIsTrackDropdownOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Random copy on mount
    const randomIndex = Math.floor(Math.random() * DYNAMIC_COPY.length);
    setDynamicCopy(DYNAMIC_COPY[randomIndex]);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setIsTrackDropdownOpen(false);
    if (isTrackDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isTrackDropdownOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    sessionStorage.setItem('traject3_query', query);
    sessionStorage.setItem('traject3_track', selectedTrack);

    // Navigate immediately - loading animation shows on result page
    router.push('/result');
  };

  const handleSurpriseMe = () => {
    const random = EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)];
    setQuery(random.text);
    setIsLoading(true);
    sessionStorage.setItem('traject3_query', random.text);
    sessionStorage.setItem('traject3_track', selectedTrack);

    // Navigate immediately - loading animation shows on result page
    router.push('/result');
  };


  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 3D Background (Three.js) */}
      <div className="fixed inset-0 -z-10">
        <MarketVisualization />
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => router.push('/dashboard')}
      />

      {/* Top Right Button - Dashboard or Login */}
      <div className="fixed top-4 right-4 z-50">
        {isAuthenticated && user ? (
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-lg border border-white/10 rounded-full hover:border-[#CFFF04]/50 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#CFFF04] to-[#2CFF05] flex items-center justify-center text-black font-bold text-sm">
              {user.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-white/80 group-hover:text-white text-sm font-medium">
              Dashboard
            </span>
          </button>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-lg border border-white/10 rounded-full hover:border-[#CFFF04]/50 transition-all group"
          >
            <UserIcon className="w-5 h-5 text-white/60 group-hover:text-[#CFFF04] transition-colors" />
            <span className="text-white/80 group-hover:text-white text-sm font-medium">
              Sign In
            </span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl w-full">
          {/* Badge */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#CFFF04]/10 to-[#2CFF05]/10 border border-[#CFFF04]/20 rounded-full backdrop-blur-sm">
              <BoltIcon className="w-4 h-4 text-[#CFFF04]" />
              <span className="text-xs font-semibold text-[#CFFF04] tracking-wide">Readiness for relevance</span>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#CFFF04] via-[#8AFF04] to-[#2CFF05] bg-clip-text text-transparent">
              Traject3
            </h1>
          </div>

          {/* Dynamic Headline */}
          <div className="text-center mb-8">
            <p className="text-2xl md:text-3xl text-gray-200 mb-2 leading-relaxed tracking-wide">
              {dynamicCopy.headline}
            </p>
            <p className="text-lg md:text-xl text-gray-400 tracking-wide">
              {dynamicCopy.subheadline}
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] rounded-2xl blur opacity-0 group-hover:opacity-20 group-focus-within:opacity-40 transition duration-300"></div>
              <div className="relative flex items-center bg-transparent hover:bg-gray-900/30 focus-within:bg-gray-900/50 border-2 border-gray-700/20 hover:border-gray-600/40 focus-within:border-[#CFFF04]/50 rounded-2xl hover:backdrop-blur-md focus-within:backdrop-blur-lg transition-all duration-300">
                {/* Track Selector Dropdown - Inside Input */}
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTrackDropdownOpen(!isTrackDropdownOpen);
                    }}
                    className="flex items-center gap-2 px-4 py-4 text-sm text-white/70 hover:text-white transition-colors border-r border-gray-700/20 hover:border-gray-600/40"
                  >
                    <span className={`w-2 h-2 rounded-full ${selectedTrack === 'builder' ? 'bg-[#CFFF04]' : 'bg-[#2CFF05]'}`} />
                    <span className="font-medium hidden sm:inline">{selectedTrack === 'builder' ? 'Builder' : 'Explorer'}</span>
                    <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isTrackDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isTrackDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                      {TRACKS.map((track) => (
                        <button
                          key={track.value}
                          type="button"
                          onClick={() => {
                            setSelectedTrack(track.value as 'explorer' | 'builder');
                            setIsTrackDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors ${selectedTrack === track.value ? 'bg-white/5' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${track.value === 'builder' ? 'bg-[#CFFF04]' : 'bg-[#2CFF05]'}`} />
                            <div>
                              <p className="text-sm font-medium text-white">{track.label}</p>
                              <p className="text-xs text-gray-400">{track.description}</p>
                            </div>
                            {selectedTrack === track.value && (
                              <span className="ml-auto text-[#CFFF04]">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input Field */}
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Who are you? What do you want?"
                  className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="group relative px-6 py-3 bg-gradient-to-r from-[#CFFF04] to-[#2CFF05] hover:from-[#d8ff20] hover:to-[#40ff20] text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-[#CFFF04]/30 hover:shadow-[#CFFF04]/50 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      Discover My Web3 Path
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>

              <button
                type="button"
                onClick={handleSurpriseMe}
                disabled={isLoading}
                className="group relative px-5 py-3 bg-gray-800/80 hover:bg-gray-700/90 border border-gray-700/50 hover:border-[#CFFF04]/50 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <BoltIcon className="w-4 h-4 text-[#CFFF04]" />
                  Surprise Me
                </span>
              </button>
            </div>
          </form>

          {/* Quick Start Examples */}
          <div className="space-y-3">
            <p className="text-center text-xs text-gray-400 font-medium tracking-wider uppercase">Quick Start Examples</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {EXAMPLES.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example.text)}
                  onMouseEnter={() => setFocusedExample(index)}
                  onMouseLeave={() => setFocusedExample(null)}
                  disabled={isLoading}
                  className="group relative px-4 py-3 bg-gradient-to-br from-gray-800/30 to-gray-900/20 hover:from-gray-700/50 hover:to-gray-800/40 border border-transparent rounded-xl text-sm text-gray-300 hover:text-white transition-all backdrop-blur-sm disabled:opacity-50 text-center overflow-hidden"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#CFFF04]/0 via-[#CFFF04]/5 to-[#2CFF05]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div
                    className="absolute inset-0 rounded-xl transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(to right, rgba(207, 255, 4, 0) 0%, rgba(207, 255, 4, 0.3) 50%, rgba(207, 255, 4, 0) 100%)',
                      maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                      opacity: focusedExample === index ? 0.4 : 0
                    }}
                  ></div>
                  <span className="relative z-10 font-medium tracking-wide">
                    {example.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Trust Signal */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Powered by AI • No wallet required • Trusted by Web3 pioneers
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
