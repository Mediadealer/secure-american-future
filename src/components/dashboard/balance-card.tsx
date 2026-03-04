'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { config } from '@/lib/config';
import { AlertTriangle, Lock } from 'lucide-react';

interface BalanceCardProps {
  isLoaded?: boolean;
}

export function BalanceCard({ isLoaded = false }: BalanceCardProps) {
  return (
    <Card
      className={`transition-all duration-400 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">
          {config.ui.balanceTitle}
        </CardTitle>
        <span className="text-xs text-primary animate-pulse-slow">
          ● Accumulating
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2">
            <div>
              <span className="text-2xl text-muted-foreground align-top">$</span>
              <span className="text-5xl font-bold text-primary">***.**</span>
            </div>
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="flex-1 text-center p-3 bg-background rounded-md">
            <div className="text-xs text-muted-foreground mb-1">Pending</div>
            <div className="font-semibold">$***.**</div>
          </div>
          <div className="flex-1 text-center p-3 bg-background rounded-md">
            <div className="text-xs text-muted-foreground mb-1">Available</div>
            <div className="font-semibold">$***.**</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-accent bg-accent/10 border border-accent/30 rounded-md p-3">
          <AlertTriangle className="w-4 h-4" />
          <span>Complete setup to reveal earnings</span>
        </div>
      </CardContent>
    </Card>
  );
}
