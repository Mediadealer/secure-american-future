'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { config } from '@/lib/config';
import {
  Zap,
  Globe,
  BarChart3,
  Target,
  Shield,
  Link2,
  Activity,
} from 'lucide-react';

interface ActivityCardProps {
  enabled?: boolean;
  isLoaded?: boolean;
  firstName?: string;
}

interface FeedEvent {
  id: number;
  message: string;
  timestamp: number;
}

const feedIcons = [Globe, BarChart3, Target, Shield, Link2, Activity];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function relativeTime(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 10) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ago`;
}

export function ActivityCard({ enabled = false, isLoaded = false, firstName }: ActivityCardProps) {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [, setTick] = useState(0);
  const nextId = useRef(0);
  const usedIndices = useRef<Set<number>>(new Set());
  const eventCount = useRef(0);

  const addEvent = useCallback(() => {
    const messages = config.activityFeedMessages;
    eventCount.current++;

    // Every 4th event, insert a personalized message
    if (firstName && eventCount.current % 4 === 0) {
      const personalMessages = [
        `New opportunity matched for ${firstName}`,
        `Earnings update ready for ${firstName}`,
        `${firstName}'s content link performance verified`,
      ];
      const msg = personalMessages[randomBetween(0, personalMessages.length - 1)];
      const event: FeedEvent = {
        id: nextId.current++,
        message: msg,
        timestamp: Date.now(),
      };
      setEvents((prev) => [event, ...prev].slice(0, 8));
      return;
    }

    let idx: number;
    if (usedIndices.current.size >= messages.length) {
      usedIndices.current.clear();
    }
    do {
      idx = randomBetween(0, messages.length - 1);
    } while (usedIndices.current.has(idx));
    usedIndices.current.add(idx);

    const event: FeedEvent = {
      id: nextId.current++,
      message: messages[idx],
      timestamp: Date.now(),
    };

    setEvents((prev) => [event, ...prev].slice(0, 8));
  }, [firstName]);

  useEffect(() => {
    if (!enabled) return;

    const firstTimer = setTimeout(() => {
      addEvent();
    }, 3000);

    const scheduleNext = () => {
      const delay = randomBetween(
        config.activityFeedInterval.min,
        config.activityFeedInterval.max
      );
      return setTimeout(() => {
        addEvent();
        timerRef = scheduleNext();
      }, delay);
    };

    let timerRef = setTimeout(() => {
      timerRef = scheduleNext();
    }, 3000 + randomBetween(config.activityFeedInterval.min, config.activityFeedInterval.max));

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(timerRef);
    };
  }, [enabled, addEvent]);

  useEffect(() => {
    if (events.length === 0) return;
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, [events.length]);

  return (
    <Card
      className={`border-t-2 border-t-primary transition-all duration-400 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-serif font-bold">
          {config.ui.activityTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event) => {
          const Icon = feedIcons[event.id % feedIcons.length];
          return (
            <div
              key={event.id}
              className="flex items-center gap-3 p-3 bg-secondary rounded-sm animate-in fade-in slide-in-from-top-2 duration-300"
            >
              <div className="w-8 h-8 rounded-sm bg-muted-foreground/15 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="flex-1 text-sm">{event.message}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {relativeTime(event.timestamp)}
              </span>
            </div>
          );
        })}

        <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/30 rounded-sm">
          <div className="w-8 h-8 rounded-sm bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="flex-1 text-sm font-semibold text-primary">
            {firstName ? `Action required: Complete ${firstName}'s setup` : 'Action required: Complete setup'}
          </span>
          <span className="text-xs text-muted-foreground">Now</span>
        </div>
      </CardContent>
    </Card>
  );
}
