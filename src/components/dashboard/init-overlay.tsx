'use client';

import { Progress } from '@/components/ui/progress';
import { Check, Circle } from 'lucide-react';
import { InitStep } from '@/hooks/use-init-sequence';

interface InitOverlayProps {
  steps: readonly InitStep[];
  currentStep: number;
  progress: number;
  status: string;
  isComplete: boolean;
  completedSteps: boolean[];
  isVisible: boolean;
}

export function InitOverlay({
  steps,
  currentStep,
  progress,
  status,
  completedSteps,
  isVisible,
}: InitOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/98 z-50 flex items-center justify-center transition-opacity duration-500">
      <div className="text-center max-w-md px-10">
        {/* Spinner */}
        <div className="w-16 h-16 border-3 border-border border-t-primary rounded-full animate-spin-slow mx-auto mb-6" />

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-3">Initializing Dashboard</h2>

        {/* Status */}
        <p className="text-muted-foreground mb-6 min-h-[24px]">{status}</p>

        {/* Progress bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-1 bg-border" />
        </div>

        {/* Steps */}
        <div className="text-left space-y-2">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = completedSteps[index];

            return (
              <div
                key={index}
                className={`flex items-center gap-3 py-2 text-sm transition-colors ${
                  isCompleted
                    ? 'text-primary'
                    : isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground/50'
                }`}
              >
                <span className="w-5 flex justify-center">
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </span>
                <span>{step.text.replace('...', '')}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
