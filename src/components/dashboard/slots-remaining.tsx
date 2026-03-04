'use client';

import { useState, useEffect } from 'react';
import { config } from '@/lib/config';

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function SlotsRemaining() {
  const [slots, setSlots] = useState<number>(config.slotsRemaining.start);

  useEffect(() => {
    const scheduleDecrement = () => {
      const delay = config.slotsRemaining.decrementIntervalMs + randomBetween(-10000, 15000);
      return setTimeout(() => {
        setSlots((prev) => Math.max(1, prev - 1));
        timerRef = scheduleDecrement();
      }, delay);
    };

    let timerRef = scheduleDecrement();
    return () => clearTimeout(timerRef);
  }, []);

  const isUrgent = slots <= 10;

  return (
    <div className="col-span-full">
      <div className={`text-center py-3 px-6 border-2 rounded-sm ${
        isUrgent
          ? 'border-destructive bg-destructive/5'
          : 'border-accent bg-accent/5'
      }`}>
        <p className={`text-sm font-serif font-bold ${isUrgent ? 'pulse-red' : 'text-accent'}`}>
          {isUrgent ? 'BREAKING: ' : ''}Only {slots} of 100 spots remain
        </p>
      </div>
    </div>
  );
}
