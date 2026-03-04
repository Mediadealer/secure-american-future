'use client';

import { config } from '@/lib/config';

interface TopBarProps {
  isConnected?: boolean;
}

function formatDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function TopBar({ isConnected = false }: TopBarProps) {
  return (
    <header className="bg-card border-b-2 border-border">
      {/* Top thin rule */}
      <div className="border-b border-border px-6 py-1.5 flex justify-between items-center text-xs text-muted-foreground">
        <span>{formatDate()}</span>
        <span className="tracking-widest uppercase font-semibold">
          {isConnected ? 'Vol. I, No. 1' : 'Loading...'}
        </span>
      </div>

      {/* Masthead */}
      <div className="text-center py-4 px-6">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.12em] uppercase text-primary leading-tight">
          {config.ui.appName}
        </h1>
        <div className="mt-1 text-xs tracking-[0.3em] uppercase text-accent font-bold">
          Special Report &mdash; Exclusive Edition
        </div>
      </div>

      {/* Bottom thin rule */}
      <div className="border-t-2 border-border" />
    </header>
  );
}
