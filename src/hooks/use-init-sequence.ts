'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface InitStep {
  text: string;
  duration: number;
  progress: number;
}

interface UseInitSequenceOptions {
  steps: readonly InitStep[];
  onComplete?: () => void;
  startDelay?: number;
  autoStart?: boolean;
}

export function useInitSequence({
  steps,
  onComplete,
  startDelay = 500,
  autoStart = true,
}: UseInitSequenceOptions) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');
  const [isComplete, setIsComplete] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );
  const [hasStarted, setHasStarted] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const processStep = useCallback((stepIndex: number) => {
    if (stepIndex >= steps.length) {
      setStatus('Dashboard ready!');
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    const step = steps[stepIndex];
    setCurrentStep(stepIndex);
    setStatus(step.text);
    setProgress(step.progress);

    // After duration, mark step complete and move to next
    setTimeout(() => {
      setCompletedSteps((prev) => {
        const updated = [...prev];
        updated[stepIndex] = true;
        return updated;
      });
      processStep(stepIndex + 1);
    }, step.duration);
  }, [steps]);

  // Manual start function
  const start = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);
    setTimeout(() => {
      processStep(0);
    }, startDelay);
  }, [hasStarted, processStep, startDelay]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && !hasStarted) {
      start();
    }
  }, [autoStart, hasStarted, start]);

  return {
    currentStep,
    progress,
    status,
    isComplete,
    completedSteps,
    activeStep: currentStep >= 0 && currentStep < steps.length ? currentStep : -1,
    start,
  };
}
