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
  firstName?: string;
}

export function InitOverlay({
  steps,
  currentStep,
  progress,
  status,
  completedSteps,
  isVisible,
  firstName,
}: InitOverlayProps) {
  if (!isVisible) return null;

  // Personalize status text
  const personalizedStatus = firstName
    ? status.replace('Connecting to', `Connecting ${firstName} to`)
             .replace('Loading retirement', `Loading ${firstName}'s retirement`)
             .replace('Finalizing dashboard', `Preparing ${firstName}'s report`)
    : status;

  return (
    <div className="fixed inset-0 bg-background/98 z-50 flex items-center justify-center transition-opacity duration-500">
      <div className="text-center max-w-md px-10">
        {/* Loading bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-1.5 bg-border" />
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl font-bold mb-3 text-foreground">
          {firstName ? `Initializing report for ${firstName}...` : 'Initializing Report...'}
        </h2>

        {/* Status */}
        <p className="font-serif italic text-muted-foreground mb-6 min-h-[24px] text-sm">
          {personalizedStatus}
        </p>

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
                <span className="font-serif text-sm">{step.text.replace('...', '')}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
