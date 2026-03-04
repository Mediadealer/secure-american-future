'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { config } from '@/lib/config';
import { getClickMagickId, trackRegistration } from '@/lib/clickmagick';
import { Zap, Lock, Check, Loader2 } from 'lucide-react';

interface ActivationCardProps {
  userName: string;
  firstName: string;
  lastName: string;
  tid?: string;
  sub2?: string;
  sub3?: string;
  isLoaded?: boolean;
  isHighlighted?: boolean;
}

export function ActivationCard({
  userName,
  firstName,
  lastName,
  tid,
  sub2,
  sub3,
  isLoaded = false,
  isHighlighted = false,
}: ActivationCardProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Fire ClickMagick "Engagement" goal — email registration
    trackRegistration();

    // Get ClickMagick ID for conversion tracking
    const mcid = getClickMagickId();

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fname: firstName || userName,
          lname: lastName,
          email,
          tid,
          sub2,
          sub3,
          mcid,
        }),
      });

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data.error || 'Submission failed. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      className={`col-span-full lg:col-span-2 border-2 transition-all duration-500 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${
        isHighlighted
          ? 'border-primary shadow-lg shadow-primary/20 animate-pulse-slow'
          : 'border-primary'
      }`}
      style={{
        background: 'linear-gradient(135deg, #1a1f26 0%, #0f1419 100%)',
      }}
    >
      <CardHeader className="bg-primary/10 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {config.ui.activationTitle}
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-accent/15 text-accent border-0 animate-pulse-slow"
          >
            {config.ui.actionNeeded}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <p className="text-muted-foreground mb-5 leading-relaxed">
          {config.ui.activationText}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <Input
              type="text"
              value={userName}
              disabled
              className="flex-1 bg-background border-2 border-border text-muted-foreground"
            />
            <Input
              type="email"
              placeholder={config.ui.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="flex-1 bg-background border-2 border-border focus:border-primary"
            />
          </div>

          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-6 text-sm font-bold bg-primary hover:bg-primary/90 text-white"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              config.ui.activationButton
            )}
          </Button>
        </form>

        <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            {config.ui.secureText}
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            {config.ui.instantText}
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-3 h-3" />
            {config.ui.noCreditCard}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
