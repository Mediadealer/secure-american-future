'use client';

import { useEffect, useCallback } from 'react';

/**
 * Hook to detect back button clicks and trigger a callback
 * @param onBack - Callback to execute when back button is pressed
 * @param enabled - Whether the hook is active (default: true)
 */
export function useBackButton(onBack: () => void, enabled: boolean = true) {
  const handleBack = useCallback(() => {
    if (enabled) {
      onBack();
    }
  }, [onBack, enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Push a dummy state to detect back button
    window.history.pushState({ modal: true }, '');

    const handlePopState = () => {
      // User pressed back - show modal and push state again to stay on page
      handleBack();
      window.history.pushState({ modal: true }, '');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleBack, enabled]);
}
