'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { config } from '@/lib/config';
import { trackInitialize } from '@/lib/clickmagick';
import { useConversionNotifications } from '@/hooks/use-conversion-notifications';
import { useInitSequence } from '@/hooks/use-init-sequence';
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
import { Banknote } from 'lucide-react';
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

  // Video ref to control playback
  const videoRef = useRef<VideoCardRef>(null);

  // Init sequence - only start after name submitted
  const { currentStep, progress, status, isComplete, completedSteps, start: startInit } =
    useInitSequence({
      steps: config.initSteps,
      autoStart: false,
      onComplete: () => {
        setTimeout(() => {
          window.scrollTo(0, 0);
          setShowInitOverlay(false);
          revealCards();
        }, 600);
      },
    });

  // Conversion notifications (activity toasts)
  useConversionNotifications({ enabled: statsEnabled });

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

  // Back button detection - only enabled when dashboard is visible
  useBackButton(() => {
    setShowExitModal(true);
  }, !showNameEntry);

  // Reveal cards with configured delays
  const revealCards = () => {
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

        // Enable stats after last card
        if (index === delays.length - 1) {
          setTimeout(() => setStatsEnabled(true), 500);
        }
      }, delay);
    });
  };

  // Handle name submission
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    // Fire ClickMagick "Action" goal — Initialize Dashboard
    trackInitialize();

    // Parse full name into first and last name
    const fullName = nameInput.trim();
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Set name and hide entry form
    setUserName(fullName);
    setUserFirstName(firstName);
    setUserLastName(lastName);
    setShowNameEntry(false);

    // Show init overlay and start sequence
    setShowInitOverlay(true);
    startInit();

    // Start video with sound IMMEDIATELY - must be in click handler for user gesture!
    // The init overlay provides the "delay feel" while video plays in background
    videoRef.current?.play();
  };

  return (
    <div className="min-h-screen relative">
      {/* Dashboard content - always rendered so video loads */}
      <TopBar isConnected={isComplete} />

      <InitOverlay
        steps={config.initSteps}
        currentStep={currentStep}
        progress={progress}
        status={status}
        isComplete={isComplete}
        completedSteps={completedSteps}
        isVisible={showInitOverlay}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-6 max-w-[1400px] mx-auto">
        <VideoCard ref={videoRef} isLoaded={cardsLoaded[0]} />

        {showActivation && (
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
        )}

        <AccountCard userName={userName} isLoaded={cardsLoaded[1]} />
        <StatsCard enabled={statsEnabled} isLoaded={cardsLoaded[2]} />
        <BalanceCard isLoaded={cardsLoaded[3]} />
        <ActivityCard enabled={statsEnabled} isLoaded={cardsLoaded[4]} />
      </div>

      {/* Name entry overlay - covers everything until submitted */}
      {showNameEntry && (
        <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-8 pb-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 mx-auto mb-6 flex items-center justify-center">
                  <Banknote className="w-9 h-9 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  {config.ui.welcomeTitle}
                </h1>
                <p className="text-muted-foreground">
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
                  className="text-center text-lg py-6 bg-background border-2 border-border focus:border-primary"
                  autoFocus
                />

                <Button
                  type="submit"
                  disabled={!nameInput.trim()}
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  {config.ui.initButton}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Exit modal - shows when user tries to leave */}
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin" />
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
