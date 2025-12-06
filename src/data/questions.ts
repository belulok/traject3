export interface QuestionOption {
  text: string;
  value: string;
  spiderImpact?: {
    technicalSkills?: number;
    riskTolerance?: number;
    communityEngagement?: number;
    timeCommitment?: number;
    web3Depth?: number;
    builderMindset?: number;
  };
}

export interface Question {
  id: string;
  question: string;
  type: 'single_choice' | 'multi_choice' | 'text_input';
  options?: QuestionOption[];
  allowCustom?: boolean;
  placeholder?: string;
  influences: string[];
}

// Builder Track Questions
export const builderQuestions: Question[] = [
  {
    id: 'b1',
    question: 'What is your main intention for the next 4–8 weeks?',
    type: 'single_choice',
    options: [
      { text: 'Explore and learn the basics of building in Web3/AI', value: 'learn', spiderImpact: { builderMindset: 1, web3Depth: 1 } },
      { text: 'Ship a small but real Web3/AI project or demo', value: 'ship', spiderImpact: { builderMindset: 3, technicalSkills: 2 } },
      { text: 'Earn from bounties, grants or hackathons', value: 'earn', spiderImpact: { builderMindset: 4, riskTolerance: 2 } },
      { text: 'Build a strong portfolio to get hired', value: 'portfolio', spiderImpact: { builderMindset: 3, technicalSkills: 3 } },
      { text: 'Validate an idea for a startup/product', value: 'startup', spiderImpact: { builderMindset: 5, riskTolerance: 4 } },
    ],
    influences: ['goal', 'mission_type', 'roadmap_outcome', 'archetype'],
  },
  {
    id: 'b2',
    question: 'What best describes your current background?',
    type: 'single_choice',
    options: [
      { text: 'Student / fresh grad', value: 'student', spiderImpact: { technicalSkills: 1, timeCommitment: 3 } },
      { text: 'Junior developer', value: 'junior_dev', spiderImpact: { technicalSkills: 2, builderMindset: 2 } },
      { text: 'Mid/Senior developer', value: 'senior_dev', spiderImpact: { technicalSkills: 4, builderMindset: 3 } },
      { text: 'Designer / Product / UX', value: 'design', spiderImpact: { technicalSkills: 2, builderMindset: 3 } },
      { text: 'Data / ML / Analytics', value: 'data', spiderImpact: { technicalSkills: 3, builderMindset: 2 } },
      { text: 'Business / Ops / Marketing', value: 'business', spiderImpact: { communityEngagement: 3, builderMindset: 2 } },
      { text: 'Non-technical but motivated to build', value: 'non_tech', spiderImpact: { builderMindset: 2, timeCommitment: 2 } },
    ],
    allowCustom: true,
    influences: ['starting_level', 'archetype_lane', 'mission_difficulty'],
  },
  {
    id: 'b3',
    question: 'How comfortable are you with coding right now?',
    type: 'single_choice',
    options: [
      { text: "I've never really coded", value: 'none', spiderImpact: { technicalSkills: 0 } },
      { text: "I've done tutorials but not real projects", value: 'tutorials', spiderImpact: { technicalSkills: 1 } },
      { text: 'I can build small projects with guidance', value: 'guided', spiderImpact: { technicalSkills: 2 } },
      { text: 'I regularly build and ship projects', value: 'proficient', spiderImpact: { technicalSkills: 4 } },
    ],
    influences: ['mission_difficulty', 'mission_scaffolding'],
  },
  {
    id: 'b4',
    question: 'Which technologies do you want your missions to focus on first?',
    type: 'multi_choice',
    options: [
      { text: 'JavaScript / TypeScript', value: 'js_ts', spiderImpact: { technicalSkills: 1 } },
      { text: 'React / Next.js', value: 'react', spiderImpact: { technicalSkills: 1 } },
      { text: 'Node.js / APIs', value: 'node', spiderImpact: { technicalSkills: 1 } },
      { text: 'Solidity / smart contracts', value: 'solidity', spiderImpact: { technicalSkills: 2, web3Depth: 2 } },
      { text: 'Rust', value: 'rust', spiderImpact: { technicalSkills: 3, web3Depth: 1 } },
      { text: 'Python (bots, data, AI)', value: 'python', spiderImpact: { technicalSkills: 1 } },
      { text: "I'm not sure, recommend for me", value: 'recommend', spiderImpact: {} },
    ],
    influences: ['tech_stack', 'mission_stack', 'people_to_follow_dev'],
  },
  {
    id: 'b5',
    question: 'What is your experience with Web3/blockchain development?',
    type: 'single_choice',
    options: [
      { text: 'Total beginner (no Web3 dev yet)', value: 'beginner', spiderImpact: { web3Depth: 0 } },
      { text: 'Deployed something from a tutorial', value: 'tutorial', spiderImpact: { web3Depth: 1 } },
      { text: 'Built a small custom contract or dApp', value: 'custom', spiderImpact: { web3Depth: 3 } },
      { text: 'Contributed to or built a real Web3 product', value: 'experienced', spiderImpact: { web3Depth: 5 } },
    ],
    influences: ['web3_experience', 'onchain_depth', 'starting_missions'],
  },
  {
    id: 'b6',
    question: 'How many hours per week can you realistically invest in building?',
    type: 'single_choice',
    options: [
      { text: '1–3 hours / week', value: '1-3', spiderImpact: { timeCommitment: 1 } },
      { text: '4–7 hours / week', value: '4-7', spiderImpact: { timeCommitment: 2 } },
      { text: '8–15 hours / week', value: '8-15', spiderImpact: { timeCommitment: 4 } },
      { text: '16+ hours / week', value: '16+', spiderImpact: { timeCommitment: 5 } },
    ],
    influences: ['pace', 'mission_count_per_week'],
  },
  {
    id: 'b7',
    question: 'What timeframe do you want this plan to cover?',
    type: 'single_choice',
    options: [
      { text: 'One intense weekend', value: 'weekend', spiderImpact: { timeCommitment: 3 } },
      { text: '2–4 weeks', value: '2-4weeks', spiderImpact: { timeCommitment: 2 } },
      { text: '1–3 months', value: '1-3months', spiderImpact: { timeCommitment: 3 } },
      { text: '3–6 months', value: '3-6months', spiderImpact: { timeCommitment: 4 } },
    ],
    influences: ['roadmap_length', 'milestone_spacing'],
  },
  {
    id: 'b8',
    question: 'Which areas of Web3 interest you most as a builder?',
    type: 'multi_choice',
    options: [
      { text: 'DeFi (lending, swaps, yield, infra)', value: 'defi', spiderImpact: { web3Depth: 2, riskTolerance: 1 } },
      { text: 'DAOs & governance tools', value: 'dao', spiderImpact: { communityEngagement: 2, web3Depth: 1 } },
      { text: 'NFTs / creator economy / social', value: 'nft', spiderImpact: { web3Depth: 1 } },
      { text: 'On-chain identity & reputation', value: 'identity', spiderImpact: { web3Depth: 2 } },
      { text: 'Gaming / on-chain worlds', value: 'gaming', spiderImpact: { web3Depth: 1 } },
      { text: 'Core infrastructure / tooling / SDKs', value: 'infra', spiderImpact: { technicalSkills: 2, web3Depth: 3 } },
      { text: 'I want to sample a bit of everything', value: 'all', spiderImpact: { web3Depth: 1 } },
    ],
    influences: ['web3_verticals', 'mission_vertical_mix', 'communities_to_join', 'people_to_follow_vertical'],
  },
  {
    id: 'b9',
    question: 'Which ecosystems or chains do you want to prioritize?',
    type: 'multi_choice',
    options: [
      { text: 'Ethereum / L2s (Arbitrum, Optimism, Base, etc.)', value: 'ethereum', spiderImpact: { web3Depth: 2 } },
      { text: 'Solana', value: 'solana', spiderImpact: { web3Depth: 2 } },
      { text: 'Cosmos / appchains', value: 'cosmos', spiderImpact: { web3Depth: 3 } },
      { text: 'Bitcoin L2s / tooling', value: 'bitcoin', spiderImpact: { web3Depth: 2 } },
      { text: 'New L1s (Sui, Aptos, etc.)', value: 'new_l1', spiderImpact: { web3Depth: 2, riskTolerance: 1 } },
      { text: 'No strong preference, pick what fits my goals', value: 'flexible', spiderImpact: {} },
    ],
    influences: ['preferred_chains', 'ecosystem_selection', 'events_by_chain'],
  },
  {
    id: 'b10',
    question: 'How do you feel about using mainnet vs testnet while building?',
    type: 'single_choice',
    options: [
      { text: 'Only testnet/simulated – no real money at all', value: 'testnet_only', spiderImpact: { riskTolerance: 0 } },
      { text: 'Mostly testnet, tiny mainnet experiments are okay', value: 'mostly_testnet', spiderImpact: { riskTolerance: 1 } },
      { text: 'Comfortable with mainnet for realistic flows', value: 'mainnet_ok', spiderImpact: { riskTolerance: 3 } },
      { text: "Very comfortable using mainnet, I'll manage risk", value: 'mainnet_confident', spiderImpact: { riskTolerance: 5 } },
    ],
    influences: ['risk_profile', 'network_type_for_missions', 'onchain_mission_depth'],
  },
  {
    id: 'b11',
    question: 'What is your wallet situation as a builder?',
    type: 'single_choice',
    options: [
      { text: "I don't have any wallet yet", value: 'none', spiderImpact: { web3Depth: 0 } },
      { text: 'I created one but barely used it', value: 'created', spiderImpact: { web3Depth: 1 } },
      { text: 'I have a wallet I use occasionally', value: 'occasional', spiderImpact: { web3Depth: 2 } },
      { text: 'I actively use multiple wallets and chains', value: 'active', spiderImpact: { web3Depth: 4 } },
    ],
    influences: ['wallet_onboarding', 'first_wallet_mission', 'onchain_verification_options'],
  },
  {
    id: 'b12',
    question: 'How comfortable are you with GitHub and open-source workflows?',
    type: 'single_choice',
    options: [
      { text: "I've never really used GitHub", value: 'none', spiderImpact: { technicalSkills: 0 } },
      { text: 'I can clone and run repos', value: 'clone', spiderImpact: { technicalSkills: 1 } },
      { text: 'I can commit, push and open PRs', value: 'contribute', spiderImpact: { technicalSkills: 3, communityEngagement: 1 } },
      { text: "I maintain or review other people's code", value: 'maintain', spiderImpact: { technicalSkills: 5, communityEngagement: 2 } },
    ],
    influences: ['oss_contribution_level', 'mission_type_repo', 'archetype_operator_vs_creator'],
  },
  {
    id: 'b13',
    question: 'What kind of things do you most want your missions to have you build?',
    type: 'multi_choice',
    options: [
      { text: 'Small standalone demo apps', value: 'demos', spiderImpact: { builderMindset: 2 } },
      { text: 'Production-like components for a bigger product', value: 'production', spiderImpact: { builderMindset: 4, technicalSkills: 1 } },
      { text: 'Bots / agents that automate things', value: 'bots', spiderImpact: { technicalSkills: 2, builderMindset: 3 } },
      { text: 'Analytics dashboards / data pipelines', value: 'analytics', spiderImpact: { technicalSkills: 2 } },
      { text: 'Protocol-level contracts / smart logic', value: 'protocol', spiderImpact: { technicalSkills: 3, web3Depth: 2 } },
    ],
    influences: ['mission_artifacts', 'portfolio_shape', 'archetype_architect_vs_builder'],
  },
  {
    id: 'b14',
    question: 'Do you want your plan to include bounties, grants or hackathons?',
    type: 'single_choice',
    options: [
      { text: 'No, just private learning and building', value: 'private', spiderImpact: { communityEngagement: 0 } },
      { text: 'Maybe 1–2 small bounties if they fit naturally', value: 'maybe', spiderImpact: { communityEngagement: 1, riskTolerance: 1 } },
      { text: 'Yes, I want bounties/hackathons highlighted', value: 'yes', spiderImpact: { communityEngagement: 3, riskTolerance: 2 } },
      { text: 'Yes, I want them to be a core focus', value: 'core', spiderImpact: { communityEngagement: 4, riskTolerance: 3 } },
    ],
    influences: ['external_opportunities_weight', 'mission_includes_bounties', 'events_recommendation'],
  },
  {
    id: 'b15',
    question: 'How do you prefer to learn while building?',
    type: 'single_choice',
    options: [
      { text: 'Short written guidance + code snippets', value: 'written', spiderImpact: {} },
      { text: 'Video walkthroughs + then code', value: 'video', spiderImpact: {} },
      { text: 'Docs/specs + experimentation', value: 'docs', spiderImpact: { technicalSkills: 1 } },
      { text: 'Templates/starter repos + tweak', value: 'templates', spiderImpact: { builderMindset: 1 } },
      { text: 'A mix of everything', value: 'mix', spiderImpact: {} },
    ],
    influences: ['learning_style', 'resource_format', 'content_sources'],
  },
  {
    id: 'b16',
    question: 'How much do you want AI coding tools (like Cursor/Claude) involved in your missions?',
    type: 'single_choice',
    options: [
      { text: 'Light: mostly me, AI just helps when I\'m stuck', value: 'light', spiderImpact: { technicalSkills: 1 } },
      { text: 'Balanced: I code + AI assists regularly', value: 'balanced', spiderImpact: {} },
      { text: 'Heavy: I want AI pair-programming on almost everything', value: 'heavy', spiderImpact: { builderMindset: 1 } },
      { text: "I'm not sure, show me both patterns", value: 'unsure', spiderImpact: {} },
    ],
    influences: ['ai_assistance_level', 'mission_prompting', 'tooling_recommendations'],
  },
  {
    id: 'b17',
    question: 'Which description fits your natural role when building?',
    type: 'single_choice',
    options: [
      { text: "I'm a creator/maker (I like imagining and building experiences)", value: 'creator', spiderImpact: { builderMindset: 4 } },
      { text: "I'm an architect (I like systems, structure, and design of logic)", value: 'architect', spiderImpact: { technicalSkills: 2, builderMindset: 3 } },
      { text: "I'm an operator (I like shipping, integrating, and making things work)", value: 'operator', spiderImpact: { builderMindset: 3 } },
      { text: "I'm an analyst (I like data, metrics, and insights)", value: 'analyst', spiderImpact: { technicalSkills: 1 } },
    ],
    influences: ['archetype', 'mission_role_focus', 'people_to_follow_role_models'],
  },
  {
    id: 'b18',
    question: 'How public do you want your builder identity to be?',
    type: 'single_choice',
    options: [
      { text: 'Private for now – no public footprint', value: 'private', spiderImpact: { communityEngagement: 0 } },
      { text: 'Pseudonymous handle is okay', value: 'pseudo', spiderImpact: { communityEngagement: 1 } },
      { text: "I'm okay using my real identity", value: 'real', spiderImpact: { communityEngagement: 2 } },
      { text: 'I want to actively build a public builder brand', value: 'public', spiderImpact: { communityEngagement: 4 } },
    ],
    influences: ['identity_visibility', 'social_missions', 'platforms_to_use'],
  },
  {
    id: 'b19',
    question: 'Where do you prefer to connect with other builders and communities?',
    type: 'multi_choice',
    options: [
      { text: 'Discord', value: 'discord', spiderImpact: { communityEngagement: 1 } },
      { text: 'Telegram', value: 'telegram', spiderImpact: { communityEngagement: 1 } },
      { text: 'Farcaster / Lens', value: 'farcaster', spiderImpact: { communityEngagement: 2, web3Depth: 1 } },
      { text: 'Twitter/X', value: 'twitter', spiderImpact: { communityEngagement: 1 } },
      { text: 'Reddit', value: 'reddit', spiderImpact: { communityEngagement: 1 } },
      { text: 'In-person meetups/events', value: 'inperson', spiderImpact: { communityEngagement: 3 } },
      { text: "I'm not ready for community yet", value: 'none', spiderImpact: { communityEngagement: 0 } },
    ],
    influences: ['community_channels', 'communities_to_join', 'events_vs_online_weight'],
  },
  {
    id: 'b20',
    question: 'What outcome would make you feel this plan was a success 30–60 days from now?',
    type: 'multi_choice',
    options: [
      { text: "A working demo I'm proud to show", value: 'demo', spiderImpact: { builderMindset: 2 } },
      { text: 'A stronger GitHub + public profile', value: 'profile', spiderImpact: { communityEngagement: 1, builderMindset: 1 } },
      { text: 'My first bounty/grant/hackathon shipped', value: 'bounty', spiderImpact: { riskTolerance: 1, communityEngagement: 1 } },
      { text: 'Clearer identity and path as a builder', value: 'clarity', spiderImpact: { builderMindset: 1 } },
      { text: 'New connections with other serious builders', value: 'connections', spiderImpact: { communityEngagement: 2 } },
      { text: "Knowing confidently if this is or isn't my lane", value: 'decision', spiderImpact: {} },
    ],
    influences: ['success_criteria', 'roadmap_emphasis', 'final_mission_design'],
  },
];

// Explorer Track Questions
export const explorerQuestions: Question[] = [
  {
    id: 'e1',
    question: 'What is your main goal in exploring Web3 right now?',
    type: 'single_choice',
    options: [
      { text: 'Understand the basics and key concepts', value: 'learn', spiderImpact: { web3Depth: 1 } },
      { text: 'Become a confident user of a few Web3 apps', value: 'user', spiderImpact: { web3Depth: 2 } },
      { text: 'Explore side income / wealth-building paths', value: 'income', spiderImpact: { riskTolerance: 2, web3Depth: 2 } },
      { text: 'Find future career or collaboration opportunities', value: 'career', spiderImpact: { communityEngagement: 2 } },
      { text: 'Decide if this space is even for me', value: 'decide', spiderImpact: { web3Depth: 1 } },
    ],
    influences: ['goal', 'depth', 'mission_type', 'archetype_seed'],
  },
  {
    id: 'e2',
    question: 'How familiar are you with Web3 and crypto today?',
    type: 'single_choice',
    options: [
      { text: 'I know almost nothing', value: 'nothing', spiderImpact: { web3Depth: 0 } },
      { text: "I've watched/read a bit but never used anything", value: 'watched', spiderImpact: { web3Depth: 1 } },
      { text: "I've bought coins on an exchange", value: 'exchange', spiderImpact: { web3Depth: 2, riskTolerance: 1 } },
      { text: "I've used DeFi, NFTs or other on-chain apps multiple times", value: 'experienced', spiderImpact: { web3Depth: 4 } },
    ],
    influences: ['starting_level', 'safety_depth', 'mission_difficulty'],
  },
  {
    id: 'e3',
    question: 'Do you currently have a crypto wallet (MetaMask, Phantom, etc.)?',
    type: 'single_choice',
    options: [
      { text: "No, I don't have any wallet", value: 'none', spiderImpact: { web3Depth: 0 } },
      { text: "I created one but don't remember how to use it", value: 'forgot', spiderImpact: { web3Depth: 1 } },
      { text: 'Yes, but I rarely use it', value: 'rarely', spiderImpact: { web3Depth: 2 } },
      { text: 'Yes, and I use it regularly', value: 'regular', spiderImpact: { web3Depth: 4 } },
    ],
    influences: ['wallet_status', 'wallet_onboarding_missions', 'onchain_verification_options'],
  },
  {
    id: 'e4',
    question: 'How much real money (if any) are you willing to risk while learning?',
    type: 'single_choice',
    options: [
      { text: 'Zero – only testnets or simulations', value: 'zero', spiderImpact: { riskTolerance: 0 } },
      { text: 'Very small amounts (like the price of a coffee)', value: 'small', spiderImpact: { riskTolerance: 1 } },
      { text: 'Moderate amounts if the learning is clear', value: 'moderate', spiderImpact: { riskTolerance: 3 } },
      { text: "I'm comfortable with higher risk for higher upside", value: 'high', spiderImpact: { riskTolerance: 5 } },
    ],
    influences: ['risk_profile', 'network_type_for_missions', 'defi_mission_depth'],
  },
  {
    id: 'e5',
    question: 'Which parts of Web3 are you most curious to explore as a user?',
    type: 'multi_choice',
    options: [
      { text: 'DeFi (saving, lending, swapping, yield)', value: 'defi', spiderImpact: { web3Depth: 1, riskTolerance: 1 } },
      { text: 'NFTs (art, collectibles, memberships)', value: 'nft', spiderImpact: { web3Depth: 1 } },
      { text: 'Gaming / metaverse', value: 'gaming', spiderImpact: { web3Depth: 1 } },
      { text: 'DAOs & governance', value: 'dao', spiderImpact: { communityEngagement: 2, web3Depth: 1 } },
      { text: 'On-chain identity & reputation', value: 'identity', spiderImpact: { web3Depth: 2 } },
      { text: 'Social / creator platforms', value: 'social', spiderImpact: { communityEngagement: 1 } },
      { text: 'Payments / remittances', value: 'payments', spiderImpact: { web3Depth: 1 } },
      { text: "I'm open to anything, surprise me", value: 'open', spiderImpact: { web3Depth: 1 } },
    ],
    influences: ['web3_verticals', 'mission_vertical_mix', 'communities_to_join', 'people_to_follow_vertical'],
  },
  {
    id: 'e6',
    question: 'Which description feels most like you in this space?',
    type: 'single_choice',
    options: [
      { text: 'Curious observer – I like to watch and understand', value: 'observer', spiderImpact: { communityEngagement: 0 } },
      { text: 'Power user – I like mastering tools and features', value: 'power_user', spiderImpact: { technicalSkills: 2, web3Depth: 2 } },
      { text: 'Collector – I like owning and curating things', value: 'collector', spiderImpact: { web3Depth: 1 } },
      { text: 'Community person – I like hanging out with people', value: 'community', spiderImpact: { communityEngagement: 4 } },
      { text: 'Strategist – I care about systems, risks and opportunities', value: 'strategist', spiderImpact: { riskTolerance: 2, technicalSkills: 1 } },
    ],
    influences: ['archetype', 'mission_flavor', 'community_role'],
  },
  {
    id: 'e7',
    question: 'How many hours per week can you realistically spend exploring Web3?',
    type: 'single_choice',
    options: [
      { text: '1–2 hours / week', value: '1-2', spiderImpact: { timeCommitment: 1 } },
      { text: '3–5 hours / week', value: '3-5', spiderImpact: { timeCommitment: 2 } },
      { text: '6–10 hours / week', value: '6-10', spiderImpact: { timeCommitment: 4 } },
      { text: 'More than 10 hours / week', value: '10+', spiderImpact: { timeCommitment: 5 } },
    ],
    influences: ['pace', 'mission_count_per_week', 'roadmap_length'],
  },
  {
    id: 'e8',
    question: 'What type of missions feel best for you at the start?',
    type: 'single_choice',
    options: [
      { text: 'Watch & read only – no actions yet', value: 'passive', spiderImpact: { riskTolerance: 0 } },
      { text: 'Click around real apps in a safe way', value: 'explore', spiderImpact: { riskTolerance: 1 } },
      { text: 'Do simple on-chain actions with small or no value', value: 'simple', spiderImpact: { riskTolerance: 2, web3Depth: 1 } },
      { text: 'Complete full guided flows (e.g. swap, mint, vote)', value: 'guided', spiderImpact: { riskTolerance: 3, web3Depth: 2 } },
    ],
    influences: ['mission_depth', 'first_mission_type', 'interaction_level'],
  },
  {
    id: 'e9',
    question: 'How do you prefer to learn?',
    type: 'single_choice',
    options: [
      { text: 'Short written explainers', value: 'written', spiderImpact: {} },
      { text: 'Video / walkthroughs', value: 'video', spiderImpact: {} },
      { text: 'Interactive missions / challenges', value: 'interactive', spiderImpact: { builderMindset: 1 } },
      { text: 'Live sessions / workshops', value: 'live', spiderImpact: { communityEngagement: 1 } },
      { text: 'A mix of everything', value: 'mix', spiderImpact: {} },
    ],
    influences: ['learning_style', 'resource_format', 'content_sources'],
  },
  {
    id: 'e10',
    question: 'Where do you already spend most of your time online for content and updates?',
    type: 'multi_choice',
    options: [
      { text: 'YouTube', value: 'youtube', spiderImpact: {} },
      { text: 'Twitter/X', value: 'twitter', spiderImpact: { communityEngagement: 1 } },
      { text: 'Discord', value: 'discord', spiderImpact: { communityEngagement: 1 } },
      { text: 'Telegram', value: 'telegram', spiderImpact: { communityEngagement: 1 } },
      { text: 'Reddit', value: 'reddit', spiderImpact: { communityEngagement: 1 } },
      { text: 'Lens / Farcaster / other Web3 socials', value: 'web3_social', spiderImpact: { communityEngagement: 2, web3Depth: 1 } },
      { text: 'Instagram / TikTok', value: 'social', spiderImpact: {} },
      { text: "None of these / I'm not sure", value: 'none', spiderImpact: {} },
    ],
    influences: ['channels_for_people_to_follow', 'community_channels', 'content_recommendation_surfaces'],
  },
  {
    id: 'e11',
    question: 'How social do you want your Web3 journey to be at the start?',
    type: 'single_choice',
    options: [
      { text: 'I prefer to stay in "lurker" mode and just read', value: 'lurker', spiderImpact: { communityEngagement: 0 } },
      { text: "I'm okay reacting or asking a question sometimes", value: 'occasional', spiderImpact: { communityEngagement: 1 } },
      { text: "I'm happy to join conversations and meet people", value: 'active', spiderImpact: { communityEngagement: 3 } },
      { text: "I'd love to be very active in communities", value: 'very_active', spiderImpact: { communityEngagement: 5 } },
    ],
    influences: ['social_energy', 'community_mission_type', 'community_intensity'],
  },
  {
    id: 'e12',
    question: 'How interested are you in DAOs and governance (voting, proposals, community decisions)?',
    type: 'single_choice',
    options: [
      { text: 'Not interested right now', value: 'not_interested', spiderImpact: {} },
      { text: 'Curious to understand how it works', value: 'curious', spiderImpact: { web3Depth: 1 } },
      { text: 'Interested in trying a simple vote or discussion', value: 'interested', spiderImpact: { communityEngagement: 2, web3Depth: 1 } },
      { text: "Very interested – I'd like to be active one day", value: 'very_interested', spiderImpact: { communityEngagement: 3, web3Depth: 2 } },
    ],
    influences: ['dao_interest', 'dao_mission_weight', 'dao_communities'],
  },
  {
    id: 'e13',
    question: 'When you think about side income or value from Web3, which feels closest to you?',
    type: 'single_choice',
    options: [
      { text: "I'm not focused on income, just learning", value: 'learning', spiderImpact: { riskTolerance: 0 } },
      { text: "I'd like to earn small rewards while learning (quests, XP, NFTs)", value: 'rewards', spiderImpact: { riskTolerance: 1 } },
      { text: "I'd like to explore more serious DeFi / yield options later", value: 'defi', spiderImpact: { riskTolerance: 3, web3Depth: 1 } },
      { text: "I'd like to find on-chain tasks or gigs eventually", value: 'gigs', spiderImpact: { riskTolerance: 2, builderMindset: 1 } },
    ],
    influences: ['income_focus', 'defi_vs_quests_weight', 'mission_rewards_type'],
  },
  {
    id: 'e14',
    question: 'What matters most to you when choosing which chains or ecosystems to use?',
    type: 'single_choice',
    options: [
      { text: 'Low fees and fast transactions', value: 'fees', spiderImpact: { technicalSkills: 1 } },
      { text: 'Big, established names and brand recognition', value: 'brand', spiderImpact: { riskTolerance: -1 } },
      { text: 'Ecosystems that are beginner-friendly and well documented', value: 'beginner', spiderImpact: {} },
      { text: 'Ecosystems active in my region or language', value: 'regional', spiderImpact: {} },
      { text: "I'm not sure, please choose for me", value: 'choose', spiderImpact: {} },
    ],
    influences: ['chain_preference_criteria', 'preferred_chains', 'onboarding_chain_choice'],
  },
  {
    id: 'e15',
    question: 'Which region do you live in or mostly operate from?',
    type: 'single_choice',
    allowCustom: true,
    options: [
      { text: 'North America', value: 'na', spiderImpact: {} },
      { text: 'Europe', value: 'eu', spiderImpact: {} },
      { text: 'Latin America', value: 'latam', spiderImpact: {} },
      { text: 'Africa', value: 'africa', spiderImpact: {} },
      { text: 'Middle East', value: 'mena', spiderImpact: {} },
      { text: 'South Asia', value: 'south_asia', spiderImpact: {} },
      { text: 'Southeast Asia', value: 'sea', spiderImpact: {} },
      { text: 'East Asia', value: 'east_asia', spiderImpact: {} },
      { text: 'Oceania', value: 'oceania', spiderImpact: {} },
      { text: 'Prefer not to say / online only', value: 'online', spiderImpact: {} },
    ],
    influences: ['region', 'event_geo_matching', 'local_community_suggestions'],
  },
  {
    id: 'e16',
    question: 'Are you interested in joining live events (online or offline)?',
    type: 'single_choice',
    options: [
      { text: 'Not for now, just self-paced', value: 'self_paced', spiderImpact: { communityEngagement: 0 } },
      { text: 'Online events / webinars only', value: 'online', spiderImpact: { communityEngagement: 1 } },
      { text: 'Local in-person meetups if nearby', value: 'local', spiderImpact: { communityEngagement: 3 } },
      { text: 'Both online and offline if relevant', value: 'both', spiderImpact: { communityEngagement: 4 } },
    ],
    influences: ['events_interest', 'events_vs_selfpaced_weight', 'event_recommendations'],
  },
  {
    id: 'e17',
    question: 'How do you want your Web3 identity to be handled?',
    type: 'single_choice',
    options: [
      { text: 'Fully anonymous (no link to real identity)', value: 'anonymous', spiderImpact: { communityEngagement: 0 } },
      { text: 'Pseudonymous handle is fine', value: 'pseudo', spiderImpact: { communityEngagement: 1 } },
      { text: "I'm okay using my real identity if it's safe", value: 'real', spiderImpact: { communityEngagement: 2 } },
      { text: "I don't know yet, I need guidance", value: 'unsure', spiderImpact: {} },
    ],
    influences: ['identity_visibility', 'passport_style', 'platforms_to_suggest'],
  },
  {
    id: 'e18',
    question: 'In the future, would you consider learning to build (code/design) in Web3, or do you prefer to stay as a user?',
    type: 'single_choice',
    options: [
      { text: 'I only want to be a user', value: 'user_only', spiderImpact: { builderMindset: 0 } },
      { text: 'Maybe later, but not now', value: 'maybe', spiderImpact: { builderMindset: 1 } },
      { text: "Yes, I'm open to building if guided", value: 'open', spiderImpact: { builderMindset: 2 } },
      { text: 'I already know I want to build later', value: 'build', spiderImpact: { builderMindset: 4 } },
    ],
    influences: ['builder_bridge_potential', 'builder_content_ratio', 'future_track_suggestion'],
  },
  {
    id: 'e19',
    question: 'Which devices do you mostly use for exploring apps and content?',
    type: 'single_choice',
    options: [
      { text: 'Mobile only', value: 'mobile', spiderImpact: {} },
      { text: 'Mostly mobile, sometimes laptop/desktop', value: 'mostly_mobile', spiderImpact: {} },
      { text: 'Mostly laptop/desktop', value: 'desktop', spiderImpact: { technicalSkills: 1 } },
      { text: 'I switch equally between devices', value: 'both', spiderImpact: {} },
    ],
    influences: ['device_profile', 'mission_device_constraints', 'app_recommendations'],
  },
  {
    id: 'e20',
    question: 'If we look back 30–60 days from now, what would make you feel this Web3 journey was a success?',
    type: 'multi_choice',
    options: [
      { text: 'I understand the core concepts and language', value: 'concepts', spiderImpact: { web3Depth: 1 } },
      { text: 'I feel safe and confident using a few Web3 apps', value: 'confident', spiderImpact: { web3Depth: 1, riskTolerance: 1 } },
      { text: "I've done my first on-chain actions without fear", value: 'onchain', spiderImpact: { web3Depth: 2, riskTolerance: 1 } },
      { text: "I've joined at least one community that fits me", value: 'community', spiderImpact: { communityEngagement: 2 } },
      { text: "I've started a path toward income or career options", value: 'income', spiderImpact: { riskTolerance: 1 } },
      { text: "I've decided clearly if this space is or isn't for me", value: 'decision', spiderImpact: {} },
    ],
    influences: ['success_criteria', 'roadmap_emphasis', 'final_mission_design'],
  },
];

export function getQuestionsForTrack(track: 'builder' | 'explorer'): Question[] {
  return track === 'builder' ? builderQuestions : explorerQuestions;
}

