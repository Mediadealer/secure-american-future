'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { config } from '@/lib/config';
import { Globe, Target, Zap } from 'lucide-react';

interface StatsCardProps {
  enabled?: boolean;
  isLoaded?: boolean;
}

const stepIcons = [Globe, Target, Zap];

export function StatsCard({ enabled = false, isLoaded = false }: StatsCardProps) {
  const [progress, setProgress] = useState<number[]>(
    config.campaignStatusSteps.map(() => 0)
  );
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    startTime.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime.current!;
      const newProgress = config.campaignStatusSteps.map((step) =>
        Math.min(100, (elapsed / step.durationMs) * 100)
      );
      setProgress(newProgress);

      if (newProgress.some((p) => p < 100)) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  return (
    <Card
      className={`border-t-2 border-t-primary transition-all duration-400 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-serif font-bold">Campaign Status</CardTitle>
        <span className="text-xs text-primary font-semibold animate-pulse-slow">● Live</span>
      </CardHeader>
      <CardContent className="space-y-4">
        {config.campaignStatusSteps.map((step, i) => {
          const Icon = stepIcons[i];
          const done = progress[i] >= 100;
          return (
            <div key={step.label} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
                  done ? 'bg-primary/15' : 'bg-muted'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors duration-500 ${
                    done ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{step.label}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-sm transition-colors duration-500 ${
                      done
                        ? 'bg-primary/10 text-primary'
                        : 'bg-accent/10 text-accent'
                    }`}
                  >
                    {done ? step.completeText : step.activeText}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-sm overflow-hidden">
                  <div
                    className={`h-full rounded-sm transition-colors duration-500 ${
                      done ? 'bg-primary' : 'bg-accent'
                    }`}
                    style={{ width: `${progress[i]}%`, transition: 'width 0.3s ease-out' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
