'use client';

import { config } from '@/lib/config';
import { Banknote } from 'lucide-react';

interface TopBarProps {
  isConnected?: boolean;
}

export function TopBar({ isConnected = false }: TopBarProps) {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <Banknote className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-foreground">
          {config.ui.appName}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isConnected
              ? 'bg-primary'
              : 'bg-accent animate-pulse-slow'
          }`}
        />
        <span className="text-sm text-muted-foreground">
          {isConnected ? 'Connected' : 'Connecting...'}
        </span>
      </div>
    </div>
  );
}
