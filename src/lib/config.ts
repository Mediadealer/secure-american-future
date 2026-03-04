/**
 * Public configuration - safe to include in client bundles
 * For sensitive values, use environment variables in .env.local
 */

export const config = {
  // YouTube
  videoId: 'YzVGCJELw1k',
  playlistId: '',

  // URL parameters
  tidParam: 'tid',

  // Checkout URL (where users are redirected after email submission)
  // The tracking ID (tid) will be appended as ?sub1=tid
  checkoutUrl: 'https://example.com/checkout', // TODO: Set checkout URL

  // Dashboard initialization steps
  initSteps: [
    { text: 'Connecting to earnings network...', duration: 500, progress: 20 },
    { text: 'Loading retirement account data...', duration: 400, progress: 40 },
    { text: 'Syncing income statistics...', duration: 450, progress: 60 },
    { text: 'Retrieving commission data...', duration: 400, progress: 80 },
    { text: 'Finalizing dashboard...', duration: 350, progress: 100 },
  ],

  // Max stats targets (stats will tick up to these values)
  maxStats: {
    clicks: 152,
    conversions: 4,
    revenue: 135.00,
    balance: 135.00,
  },

  // Stats update timing (ms) - reaches max between 5:15 and 5:35
  statsUpdateInterval: {
    min: 3500,
    max: 3700,
  },

  // Engagement thresholds
  engagement: {
    videoWatchSeconds: 60,    // Seconds of video watched to highlight activation
    statsUpdatesCount: 5,     // Number of stat updates to observe
  },

  // Activation card delay (ms) - card hidden until this time passes
  activationDelayMs: 90000,

  // Card reveal delays (ms) - time from name submission to card appearance
  cardRevealDelays: {
    video: 0,              // Show immediately after init overlay
    accountStatus: 10000,  // 10 seconds
    todaysPerformance: 15000,  // 15 seconds
    commissionBalance: 20000,  // 20 seconds
    recentActivity: 25000,     // 25 seconds
  },

  // Campaign status steps (for stats card progress bars)
  campaignStatusSteps: [
    { label: 'Income Routing', activeText: 'Routing', completeText: 'Active', durationMs: 30000 },
    { label: 'Earnings Matching', activeText: 'Scanning', completeText: 'Matched', durationMs: 45000 },
    { label: 'Payout Optimization', activeText: 'Optimizing', completeText: 'Optimized', durationMs: 60000 },
  ],

  // Activity feed event messages
  activityFeedMessages: [
    'New visitor routed to your content link',
    'Earnings performance updated',
    'Income qualification in progress',
    'Content engagement verified',
    'Account health check passed',
    'Revenue stream adjusted',
    'New audience segment matched',
    'Conversion tracking validated',
    'Content page response OK',
    'Payout rate recalculated',
    'Income opportunity refreshed',
    'Engagement quality verified',
  ],

  // Activity feed timing (ms)
  activityFeedInterval: {
    min: 8000,
    max: 12000,
  },

  // Activity toast messages (replaces conversion toasts)
  activityToastMessages: [
    'New activity detected on your account',
    'Earnings update received',
    'Income routing optimized',
    'Content performance updated',
    'Audience engagement registered',
  ],

  // Engagement time trigger (ms after stats enabled)
  engagementTimeMs: 60000,

  // UI Text
  ui: {
    appName: 'SecurePayouts',

    // Name entry screen
    welcomeTitle: 'Access Your Retirement Earnings.',
    namePrompt: 'Enter your full name to view your earnings dashboard',
    nameInputPlaceholder: 'Enter Your Full Name',
    initButton: 'Access My Dashboard',

    // Dashboard
    accountTitle: 'Account Status',
    performanceTitle: "Today's Performance",
    balanceTitle: 'Commission Balance',
    metricsTitle: 'Conversion Metrics',
    campaignsTitle: 'Active Campaigns',
    activityTitle: 'Recent Activity',

    // Activation card
    activationTitle: 'Account Activation Required',
    activationText: 'Your earning potential has been verified. Complete activation to unlock your commissions and secure your financial future.',
    activationButton: 'Secure My Earnings Now',
    emailPlaceholder: 'Enter Your Best Email',

    // Badges and labels
    statusActive: 'ACTIVE',
    statusPending: 'PENDING SETUP',
    actionNeeded: 'ACTION NEEDED',

    // Footer items
    secureText: 'Secure',
    instantText: 'Instant activation',
    noCreditCard: '24/7 Support',
  },
} as const;

export type Config = typeof config;
