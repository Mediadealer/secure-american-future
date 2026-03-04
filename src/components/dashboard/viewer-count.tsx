'use client';

import { useState, useEffect } from 'react';
import { config } from '@/lib/config';

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ViewerCount() {
  const [count, setCount] = useState(() =>
    randomBetween(config.viewerCount.min, config.viewerCount.max)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const delta = randomBetween(-3, 3);
        const next = prev + delta;
        return Math.max(config.viewerCount.min, Math.min(config.viewerCount.max, next));
      });
    }, config.viewerCount.intervalMs + randomBetween(-2000, 7000));

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-1.5 border-b border-border bg-secondary/50">
      <p className="text-xs font-serif italic text-muted-foreground">
        <span className="inline-block w-2 h-2 rounded-full bg-accent mr-1.5 align-middle animate-pulse-slow" />
        {count} Americans are reading this report right now
      </p>
    </div>
  );
}
