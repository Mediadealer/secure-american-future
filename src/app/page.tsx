'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { config } from '@/lib/config';
import { trackInitialize } from '@/lib/clickmagick';
import { useConversionNotifications } from '@/hooks/use-conversion-notifications';
import { useInitSequence } from '@/hooks/use-init-sequence';
import { useVideoGlitch } from '@/hooks/use-video-glitch';
import { useTestimonialPopups } from '@/hooks/use-testimonial-popups';
import {
  TopBar,
  InitOverlay,
  StatsCard,
  BalanceCard,
  AccountCard,
  ActivityCard,
  ActivationCard,
  VideoCard,
} from '@/components/dashboard';
import { ViewerCount } from '@/components/dashboard/viewer-count';
import { SlotsRemaining } from '@/components/dashboard/slots-remaining';
import { NewsTicker } from '@/components/dashboard/news-ticker';
import { TrustBadges } from '@/components/dashboard/trust-badges';
import { ShieldAlert } from 'lucide-react';
import { VideoCardRef } from '@/components/dashboard/video-card';
import { ExitModal } from '@/components/exit-modal';
import { useBackButton } from '@/hooks/use-back-button';

function MainContent() {
  const searchParams = useSearchParams();
  const tid = searchParams.get(config.tidParam) || '';
  const sub2 = searchParams.get('sub2') || '';
  const sub3 = searchParams.get('sub3') || '';

  // Name entry state
  const [showNameEntry, setShowNameEntry] = useState(true);
  const [nameInput, setNameInput] = useState('');
  const [userName, setUserName] = useState('New Affiliate');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');

  // Exit modal state
  const [showExitModal, setShowExitModal] = useState(false);

  // Dashboard state
  const [showInitOverlay, setShowInitOverlay] = useState(false);
  const [cardsLoaded, setCardsLoaded] = useState<boolean[]>(new Array(5).fill(false));
  const [statsEnabled, setStatsEnabled] = useState(false);
  const [engagementMet, setEngagementMet] = useState(false);
  const [showActivation, setShowActivation] = useState(false);
  const [dashboardStartTime, setDashboardStartTime] = useState<number | null>(null);

  // Escalating headline state
  const [headlineTier, setHeadlineTier] = useState(0);

  // Video ref to control playback
  const videoRef = useRef<VideoCardRef>(null);

  // Glitch effect
  const { glitchPhase, statusMessage, statusColor, showBlackout } = useVideoGlitch(videoRef);

  // Init sequence - only start after name submitted
  const { currentStep, progress, status, isComplete, completedSteps, start: startInit } =
    useInitSequence({
      steps: config.initSteps,
      autoStart: false,
      onComplete: () => {
        setTimeout(() => {
          window.scrollTo(0, 0);
          setShowInitOverlay(false);
          setDashboardStartTime(Date.now());
          revealCards();
        }, 600);
      },
    });

  // Conversion notifications (activity toasts)
  useConversionNotifications({ enabled: statsEnabled });

  // Testimonial popups
  useTestimonialPopups({ enabled: statsEnabled });

  // Track engagement - time-based trigger
  useEffect(() => {
    if (!statsEnabled) return;
    const timer = setTimeout(() => {
      setEngagementMet(true);
    }, config.engagementTimeMs);
    return () => clearTimeout(timer);
  }, [statsEnabled]);

  // Show activation card after delay
  useEffect(() => {
    if (!statsEnabled) return;
    const timer = setTimeout(() => {
      setShowActivation(true);
    }, config.activationDelayMs);
    return () => clearTimeout(timer);
  }, [statsEnabled]);

  // Escalating headlines
  useEffect(() => {
    if (!dashboardStartTime) return;
    const t1 = setTimeout(() => setHeadlineTier(1), 120000); // 2 min
    const t2 = setTimeout(() => setHeadlineTier(2), 300000); // 5 min
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [dashboardStartTime]);

  useEffect(() => {
    if (showActivation) setHeadlineTier(3);
  }, [showActivation]);

  // Back button detection
  useBackButton(() => {
    setShowExitModal(true);
  }, !showNameEntry);

  // Reveal cards with configured delays
  const revealCards = useCallback(() => {
    const delays = [
      config.cardRevealDelays.video,
      config.cardRevealDelays.accountStatus,
      config.cardRevealDelays.todaysPerformance,
      config.cardRevealDelays.commissionBalance,
      config.cardRevealDelays.recentActivity,
    ];

    delays.forEach((delay, index) => {
      setTimeout(() => {
        setCardsLoaded((prev) => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });

        if (index === delays.length - 1) {
          setTimeout(() => setStatsEnabled(true), 500);
        }
      }, delay);
    });
  }, []);

  // Handle name submission
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    trackInitialize();

    const fullName = nameInput.trim();
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setUserName(fullName);
    setUserFirstName(firstName);
    setUserLastName(lastName);
    setShowNameEntry(false);
    setShowInitOverlay(true);
    startInit();
    videoRef.current?.play();
  };

  const headlineMessages = [
    'Read this important report carefully',
    'Your spot is being held for the next 15 minutes',
    'WARNING: 2 enrollment slots were just taken',
    'Your account is ready — activate now',
  ];

  // Glitch class on container
  const glitchClass =
    glitchPhase === 'flicker' ? 'glitch-flicker' :
    glitchPhase === 'full' ? 'glitch-full glitch-static' :
    '';

  return (
    <div className={`min-h-screen relative ${!showNameEntry ? 'watermark-container' : ''} ${glitchClass}`}>
      {/* Glitch blackout overlay */}
      {showBlackout && <div className="glitch-blackout" />}

      {/* Glitch status bar */}
      {statusMessage && (
        <div
          className={`fixed top-0 left-0 right-0 z-[9998] text-center py-2 text-sm font-bold font-serif tracking-wide transition-all duration-300 ${
            statusColor === 'red' ? 'bg-destructive text-white' :
            statusColor === 'amber' ? 'bg-amber-500 text-white animate-pulse-slow' :
            'bg-green-600 text-white'
          }`}
        >
          {statusMessage}
        </div>
      )}

      {/* Dashboard content */}
      <TopBar isConnected={isComplete} />

      {/* Viewer count - below masthead */}
      {dashboardStartTime && !showNameEntry && !showInitOverlay && (
        <ViewerCount />
      )}

      <InitOverlay
        steps={config.initSteps}
        currentStep={currentStep}
        progress={progress}
        status={status}
        isComplete={isComplete}
        completedSteps={completedSteps}
        isVisible={showInitOverlay}
        firstName={userFirstName}
      />

      {/* Escalating headline banner */}
      {dashboardStartTime && !showInitOverlay && (
        <div className={`text-center py-3 px-6 border-b border-border ${
          headlineTier >= 2 ? 'bg-accent/10 text-accent' : 'bg-secondary text-foreground'
        }`}>
          <p className={`text-sm font-serif italic ${headlineTier >= 2 ? 'font-bold' : ''}`}>
            {headlineTier >= 3 && showActivation
              ? `${userFirstName ? userFirstName + ', your' : 'Your'} account is ready — activate now`
              : headlineMessages[headlineTier]}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-6 max-w-[1400px] mx-auto">
        {/* Video card with newspaper section label */}
        <div className="col-span-full">
          <div className="newspaper-section-label mb-2">Featured Report</div>
          <VideoCard ref={videoRef} isLoaded={cardsLoaded[0]} />
          {cardsLoaded[0] && (
            <p className="text-xs text-muted-foreground italic mt-2 font-serif">
              Watch: The retirement income discovery they tried to suppress
            </p>
          )}
        </div>

        {/* Slots remaining banner */}
        {statsEnabled && <SlotsRemaining />}

        {showActivation && (
          <div className="col-span-full lg:col-span-2">
            <div className="newspaper-section-label mb-2">Action Required</div>
            <ActivationCard
              userName={userName}
              firstName={userFirstName}
              lastName={userLastName}
              tid={tid}
              sub2={sub2}
              sub3={sub3}
              isLoaded={true}
              isHighlighted={engagementMet}
            />
          </div>
        )}

        <div>
          <div className="newspaper-section-label mb-2">Subscriber Profile</div>
          <AccountCard userName={userName} isLoaded={cardsLoaded[1]} />
        </div>

        <div className="lg:col-span-2">
          <div className="newspaper-section-label mb-2">Financial Report</div>
          <StatsCard enabled={statsEnabled} isLoaded={cardsLoaded[2]} />
        </div>

        <div>
          <div className="newspaper-section-label mb-2">Earnings Desk</div>
          <BalanceCard isLoaded={cardsLoaded[3]} />
        </div>

        <div className="lg:col-span-2">
          <div className="newspaper-section-label mb-2">Wire Service</div>
          <ActivityCard enabled={statsEnabled} isLoaded={cardsLoaded[4]} firstName={userFirstName} />
        </div>

        {/* Trust badges */}
        {statsEnabled && (
          <div className="col-span-full">
            <TrustBadges />
          </div>
        )}
      </div>

      {/* Name entry overlay — newspaper front page */}
      {showNameEntry && (
        <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <Card className="border-2 border-double border-border rounded-sm shadow-lg">
              <CardContent className="pt-8 pb-8">
                {/* Newspaper header */}
                <div className="text-center mb-2">
                  <div className="text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground mb-2">
                    Special Report
                  </div>
                  <div className="border-t-2 border-b border-border py-2 mb-4">
                    <h2 className="font-serif text-lg sm:text-xl tracking-[0.1em] uppercase text-primary font-black">
                      Secure American Future
                    </h2>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-sm bg-primary mx-auto mb-6 flex items-center justify-center">
                    <ShieldAlert className="w-9 h-9 text-white" />
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-3 text-foreground leading-tight">
                    {config.ui.welcomeTitle}
                  </h1>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                    {config.ui.namePrompt}
                  </p>
                </div>

                <form onSubmit={handleNameSubmit} className="space-y-4">
                  <Input
                    type="text"
                    placeholder={config.ui.nameInputPlaceholder}
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                    autoComplete="name"
                    className="text-center text-lg py-6 bg-background border-2 border-border focus:border-primary rounded-sm"
                    autoFocus
                  />

                  <Button
                    type="submit"
                    disabled={!nameInput.trim()}
                    className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-white rounded-sm"
                  >
                    {config.ui.initButton}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* News ticker — appears 60-90s after dashboard loads */}
      {dashboardStartTime && <NewsTicker dashboardStartTime={dashboardStartTime} />}

      {/* Exit modal */}
      <ExitModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        userName={userName}
        firstName={userFirstName}
        lastName={userLastName}
        tid={tid}
        sub2={sub2}
        sub3={sub3}
      />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-border border-t-primary rounded-full animate-spin-slow mx-auto mb-4" />
        <p className="font-serif text-muted-foreground italic text-sm">Loading report...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MainContent />
    </Suspense>
  );
}
