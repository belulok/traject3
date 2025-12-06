/**
 * API Client for Traject3 Backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ResultPageRequest {
  userQuery: string;
  walletAddress?: string;
  existingArchetype?: string;
  discoveryMode?: string;
}

interface RelevanceExplanation {
  stigmaBuster: string;
  relevantPoints: string[];
  summary: string;
}

interface WhyNowExplanation {
  web2Ceiling: string[];
  modernChallenges: string[];
  web3Opportunities: string[];
  closingNote: string;
}

interface IdentityPreview {
  id: string;
  archetype: string;
  title: string;
  subtitle: string;
  icon: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedTimeToStart: string;
  potentialEarnings?: string;
}

interface MissionStep {
  order: number;
  text: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  requiresWallet: boolean;
  steps: MissionStep[];
  ctaText: string;
  ctaUrl: string;
  disclaimer?: string;
}

interface UpcomingUnlocks {
  title: string;
  description: string;
  bullets: string[];
  ctaText: string;
  ctaSubtext: string;
}

export interface ResultPageResponse {
  relevanceExplanation: RelevanceExplanation;
  whyNow: WhyNowExplanation;
  identityPreviews: IdentityPreview[];
  firstMission: Mission;
  upcomingUnlocks: UpcomingUnlocks;
}

/**
 * Fetch result page content from the backend
 */
export async function fetchResultPage(request: ResultPageRequest): Promise<ResultPageResponse> {
  const response = await fetch(`${API_BASE}/api/result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch default result page (for "I want side income" query)
 */
export async function fetchDefaultResultPage(): Promise<ResultPageResponse> {
  const response = await fetch(`${API_BASE}/api/result/default`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_BASE}/api/health`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Analyze wallet address
 */
export async function analyzeWallet(address: string): Promise<{
  address: string;
  analysis: {
    activityLevel: string;
    primaryInterests: string[];
    topProtocols: string[];
    nftCollections: string[];
    daoMemberships: string[];
    totalValueUsd: number;
    txCount: number;
    accountAge: number;
  };
  suggestedArchetype: string;
  personalizationHints: string[];
}> {
  const response = await fetch(`${API_BASE}/api/wallet/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}


