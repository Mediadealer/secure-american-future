'use client';

import { useState, useEffect } from 'react';
import { config } from '@/lib/config';

interface NewsTickerProps {
  dashboardStartTime: number;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function NewsTicker({ dashboardStartTime }: NewsTickerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const delay = randomBetween(60000, 90000);
    const elapsed = Date.now() - dashboardStartTime;
    const remaining = Math.max(0, delay - elapsed);

    const timer = setTimeout(() => setVisible(true), remaining);
    return () => clearTimeout(timer);
  }, [dashboardStartTime]);

  if (!visible) return null;

  const messages = config.tickerMessages;
  const tickerText = messages.map((m) => `\u00A0\u00A0\u00A0\u2022 ${m}`).join('\u00A0\u00A0\u00A0');
  // Duplicate for seamless loop
  const fullText = `${tickerText}\u00A0\u00A0\u00A0${tickerText}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary text-white overflow-hidden">
      <div className="flex items-center">
        <div className="bg-accent px-3 py-2 text-xs font-bold tracking-wider uppercase flex-shrink-0 z-10">
          Bulletin
        </div>
        <div className="overflow-hidden flex-1">
          <div className="ticker-scroll py-2 text-sm">
            {fullText}
          </div>
        </div>
      </div>
    </div>
  );
}
