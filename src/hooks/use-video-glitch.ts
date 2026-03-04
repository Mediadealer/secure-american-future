'use client';

import { useState, useEffect, useRef, RefObject } from 'react';
import { VideoCardRef } from '@/components/dashboard/video-card';

type GlitchPhase = 'none' | 'flicker' | 'full' | 'blackout' | 'recovery';

interface UseVideoGlitchReturn {
  glitchPhase: GlitchPhase;
  statusMessage: string | null;
  statusColor: 'red' | 'amber' | 'green' | null;
  showBlackout: boolean;
}

const GLITCH_TRIGGER_TIME = 32; // seconds into video
const POLL_INTERVAL = 250; // ms

export function useVideoGlitch(
  videoRef: RefObject<VideoCardRef | null>
): UseVideoGlitchReturn {
  const [glitchPhase, setGlitchPhase] = useState<GlitchPhase>('none');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusColor, setStatusColor] = useState<'red' | 'amber' | 'green' | null>(null);
  const [showBlackout, setShowBlackout] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasTriggered.current) return;

      const time = videoRef.current?.getCurrentTime() ?? 0;
      if (time >= GLITCH_TRIGGER_TIME) {
        hasTriggered.current = true;
        triggerGlitchSequence();
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerGlitchSequence = () => {
    // Phase 1: Flicker (0-1s)
    setGlitchPhase('flicker');
    setStatusMessage('\u26A0 CONNECTION INTERRUPTED');
    setStatusColor('red');

    // Phase 2: Full glitch (1-3s)
    setTimeout(() => {
      setGlitchPhase('full');
      setStatusMessage('RECONNECTING TO SECURE SERVER...');
      setStatusColor('amber');
    }, 1000);

    // Phase 3: Blackout (3-3.3s)
    setTimeout(() => {
      setGlitchPhase('blackout');
      setShowBlackout(true);
      setStatusMessage(null);
      setStatusColor(null);
    }, 3000);

    // Phase 4: Recovery (3.3-5s)
    setTimeout(() => {
      setShowBlackout(false);
      setGlitchPhase('recovery');
      setStatusMessage('\u2713 SECURE CONNECTION RESTORED');
      setStatusColor('green');
    }, 3300);

    // Clear everything
    setTimeout(() => {
      setGlitchPhase('none');
      setStatusMessage(null);
      setStatusColor(null);
    }, 5300);
  };

  return { glitchPhase, statusMessage, statusColor, showBlackout };
}
