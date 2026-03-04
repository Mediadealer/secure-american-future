'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { config } from '@/lib/config';

interface UseTestimonialPopupsOptions {
  enabled?: boolean;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function TestimonialContent({ name, state, quote }: { name: string; state: string; quote: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('');
  return (
    <div className="flex items-start gap-3 p-3 bg-card border border-border rounded-sm shadow-lg w-fit max-w-[260px]">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
        <span className="text-sm font-bold text-primary font-serif">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-foreground text-sm leading-tight">
          {name} <span className="font-normal text-muted-foreground">from {state}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1 italic font-serif">
          &ldquo;{quote}&rdquo;
        </div>
      </div>
    </div>
  );
}

export function useTestimonialPopups({ enabled = true }: UseTestimonialPopupsOptions = {}) {
  const messageIndex = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const testimonials = config.testimonialMessages;

    const scheduleNext = () => {
      const delay = randomBetween(45000, 90000);
      return setTimeout(() => {
        const t = testimonials[messageIndex.current % testimonials.length];
        messageIndex.current++;

        toast.custom(
          () => <TestimonialContent name={t.name} state={t.state} quote={t.quote} />,
          {
            duration: 6000,
            position: 'bottom-left',
          }
        );

        timerRef = scheduleNext();
      }, delay);
    };

    let timerRef = scheduleNext();
    return () => clearTimeout(timerRef);
  }, [enabled]);
}
