'use client';

import { useState, useEffect, useRef, useCallback, RefObject } from 'react';
import { VideoCardRef } from '@/components/dashboard/video-card';

type GlitchPhase = 'none' | 'flicker' | 'full' | 'blackout' | 'recovery';

interface UseVideoGlitchReturn {
  glitchPhase: GlitchPhase;
  statusMessage: string | null;
  statusColor: 'red' | 'amber' | 'green' | null;
  showBlackout: boolean;
}

// Three trigger points: ~30s, ~4min, ~10min
const GLITCH_TRIGGER_TIMES = [30, 240, 600];
const POLL_INTERVAL = 250; // ms

export function useVideoGlitch(
  videoRef: RefObject<VideoCardRef | null>
): UseVideoGlitchReturn {
  const [glitchPhase, setGlitchPhase] = useState<GlitchPhase>('none');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusColor, setStatusColor] = useState<'red' | 'amber' | 'green' | null>(null);
  const [showBlackout, setShowBlackout] = useState(false);
  const triggeredSet = useRef<Set<number>>(new Set());
  const isGlitching = useRef(false);

  const triggerGlitchSequence = useCallback(() => {
    if (isGlitching.current) return;
    isGlitching.current = true;

    // Phase 1: Flicker (0–1.5s)
    setGlitchPhase('flicker');
    setStatusMessage('\u26A0 CONNECTION INTERRUPTED');
    setStatusColor('red');

    // Phase 2: Full glitch (1.5–5s)
    setTimeout(() => {
      setGlitchPhase('full');
      setStatusMessage('RECONNECTING TO SECURE SERVER...');
      setStatusColor('amber');
    }, 1500);

    // Phase 3: Blackout (5–5.5s)
    setTimeout(() => {
      setGlitchPhase('blackout');
      setShowBlackout(true);
      setStatusMessage(null);
      setStatusColor(null);
    }, 5000);

    // Phase 4: Recovery (5.5–7.5s)
    setTimeout(() => {
      setShowBlackout(false);
      setGlitchPhase('recovery');
      setStatusMessage('\u2713 SECURE CONNECTION RESTORED');
      setStatusColor('green');
    }, 5500);

    // Clear everything at ~7.5s
    setTimeout(() => {
      setGlitchPhase('none');
      setStatusMessage(null);
      setStatusColor(null);
      isGlitching.current = false;
    }, 7500);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isGlitching.current) return;

      const time = videoRef.current?.getCurrentTime() ?? 0;

      for (const triggerTime of GLITCH_TRIGGER_TIMES) {
        if (!triggeredSet.current.has(triggerTime) && time >= triggerTime && time < triggerTime + 5) {
          triggeredSet.current.add(triggerTime);
          triggerGlitchSequence();
          break;
        }
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [triggerGlitchSequence, videoRef]);

  return { glitchPhase, statusMessage, statusColor, showBlackout };
}
