'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { config } from '@/lib/config';
import { ConversionToastContent } from '@/components/ui/conversion-toast';

interface UseConversionNotificationsOptions {
  enabled?: boolean;
  duration?: number;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function useConversionNotifications({
  enabled = true,
  duration = 4000,
}: UseConversionNotificationsOptions = {}) {
  const messageIndex = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const messages = config.activityToastMessages;

    const scheduleNext = () => {
      const delay = randomBetween(15000, 25000);
      return setTimeout(() => {
        const message = messages[messageIndex.current % messages.length];
        messageIndex.current++;

        const prefersReducedMotion =
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        toast.custom(
          () => (
            <div className={prefersReducedMotion ? '' : 'toast-fly-up'}>
              <ConversionToastContent message={message} />
            </div>
          ),
          {
            duration,
            position: 'bottom-right',
          }
        );

        timerRef = scheduleNext();
      }, delay);
    };

    let timerRef = scheduleNext();
    return () => clearTimeout(timerRef);
  }, [enabled, duration]);
}
