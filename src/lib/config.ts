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

  // Viewer count (engagement)
  viewerCount: { min: 30, max: 65, intervalMs: 8000 },

  // Slots remaining counter
  slotsRemaining: { start: 23, decrementIntervalMs: 45000 },

  // News ticker messages
  tickerMessages: [
    'BULLETIN: 3 Americans joined Secure American Future in the last hour',
    'UPDATE: Available enrollment slots decreasing — {slots} of 100 remaining',
    'NOTICE: This report may be removed without warning',
    'REPORT: Members report first earnings within 14 days',
  ],

  // Testimonial popup messages
  testimonialMessages: [
    { name: 'Robert M.', state: 'Texas', quote: 'I wish I found this years ago.' },
    { name: 'Linda S.', state: 'Florida', quote: 'Finally, something that actually works for retirement.' },
    { name: 'James W.', state: 'Ohio', quote: 'My wife didn\'t believe me until she saw the numbers.' },
    { name: 'Patricia K.', state: 'Arizona', quote: 'I was skeptical at first, but the results speak for themselves.' },
    { name: 'Gary T.', state: 'North Carolina', quote: 'This changed everything for us.' },
    { name: 'Barbara H.', state: 'Pennsylvania', quote: 'I tell all my friends about this.' },
    { name: 'Donald R.', state: 'Michigan', quote: 'Best decision I made for my retirement.' },
    { name: 'Susan C.', state: 'Georgia', quote: 'Simple to get started and the support is great.' },
  ],

  // UI Text
  ui: {
    appName: 'Secure American Future',

    // Name entry screen
    welcomeTitle: 'Your Retirement May Not Be Enough.',
    namePrompt: 'Thousands of Americans over 50 are discovering a new income stream they were never told about. Enter your name to see if you qualify.',
    nameInputPlaceholder: 'Enter Your Full Name',
    initButton: 'Check My Eligibility',

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
