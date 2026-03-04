'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Stats {
  clicks: number;
  conversions: number;
  revenue: number;
  balance: number;
  pending: number;
  available: number;
}

interface MaxStats {
  clicks: number;
  conversions: number;
  revenue: number;
  balance: number;
}

interface UseLiveStatsOptions {
  maxStats: MaxStats;
  updateIntervalMin?: number;
  updateIntervalMax?: number;
  enabled?: boolean;
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function useLiveStats({
  maxStats,
  updateIntervalMin = 2000,
  updateIntervalMax = 3500,
  enabled = true,
}: UseLiveStatsOptions) {
  const [stats, setStats] = useState<Stats>({
    clicks: 0,
    conversions: 0,
    revenue: 0,
    balance: 0,
    pending: 0,
    available: 0,
  });

  const [isMaxed, setIsMaxed] = useState(false);

  const updateStats = useCallback(() => {
    setStats((prev) => {
      const clicksRemaining = maxStats.clicks - prev.clicks;
      const conversionsRemaining = maxStats.conversions - prev.conversions;
      const revenueRemaining = maxStats.revenue - prev.revenue;

      let newClicks = prev.clicks;
      let newConversions = prev.conversions;
      let newRevenue = prev.revenue;

      // 1. Update clicks first (always increment 1-3)
      if (clicksRemaining > 0) {
        const clickInc = Math.min(randomBetween(1, 3), clicksRemaining);
        newClicks += clickInc;
      }

      // 2. Update conversions based on clicks (coordinated)
      // Expected: ~38 clicks per conversion (152 / 4)
      const clicksPerConversion = maxStats.clicks / maxStats.conversions;
      const expectedConversions = Math.floor(newClicks / clicksPerConversion);

      if (expectedConversions > prev.conversions && conversionsRemaining > 0) {
        newConversions = Math.min(expectedConversions, maxStats.conversions);
      }

      // 3. Update revenue based on conversions (coordinated)
      // Expected: ~$33.75 per conversion (135 / 4)
      if (newConversions > prev.conversions && revenueRemaining > 0) {
        const revenuePerConversion = maxStats.revenue / maxStats.conversions;
        const revenueToAdd = revenuePerConversion * (newConversions - prev.conversions);

        // Add variance (+/- 15%) for realism
        const variance = (Math.random() - 0.5) * 0.3; // -15% to +15%
        const adjustedRevenue = revenueToAdd * (1 + variance);

        newRevenue = Math.min(prev.revenue + adjustedRevenue, maxStats.revenue);
      }

      const newBalance = newRevenue;

      // Check if maxed out
      if (newClicks >= maxStats.clicks && newRevenue >= maxStats.revenue) {
        setIsMaxed(true);
      }

      return {
        clicks: Math.round(newClicks),
        conversions: newConversions,
        revenue: Number(newRevenue.toFixed(2)),
        balance: Number(newBalance.toFixed(2)),
        pending: Number((newBalance * 0.8).toFixed(2)),
        available: Number((newBalance * 0.2).toFixed(2)),
      };
    });
  }, [maxStats]);

  useEffect(() => {
    if (!enabled || isMaxed) return;

    const interval = setInterval(() => {
      updateStats();
    }, randomBetween(updateIntervalMin, updateIntervalMax));

    return () => clearInterval(interval);
  }, [enabled, isMaxed, updateStats, updateIntervalMin, updateIntervalMax]);

  return { stats, isMaxed };
}
