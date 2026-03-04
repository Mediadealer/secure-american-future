'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, Lock, Check, Loader2 } from 'lucide-react';
import { config } from '@/lib/config';
import { getClickMagickId, trackRegistration } from '@/lib/clickmagick';

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  firstName: string;
  lastName: string;
  tid?: string;
  sub2?: string;
  sub3?: string;
}

export function ExitModal({ isOpen, onClose, userName, firstName, lastName, tid, sub2, sub3 }: ExitModalProps) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-background border-2 border-destructive sm:rounded-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10"
        >
          <X className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-8 sm:p-10">
          {/* Warning Header */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Wait! Don't Leave Yet
          </h2>

          <p className="text-center text-muted-foreground mb-6 text-base sm:text-lg leading-relaxed">
            You're about to lose your <span className="text-primary font-bold">accumulated earnings</span> and account access.
            By leaving now, your dashboard and commission balance will be assigned to the next visitor.
          </p>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-center">
              <span className="font-semibold text-primary">Secure your earnings now</span> — Enter your email below to activate your account and lock in your balance.
            </p>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                value={userName}
                disabled
                className="flex-1 bg-background/50 border-2 border-border text-muted-foreground"
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
              <p className="text-destructive text-sm text-center">{error}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="w-full py-6 text-sm font-semibold order-2 sm:order-1"
              >
                Close & Keep Watching
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 px-4 text-sm font-bold bg-primary hover:bg-primary/90 text-white order-1 sm:order-2 h-auto whitespace-normal leading-tight"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  config.ui.activationButton
                )}
              </Button>
            </div>
          </form>

          {/* Footer Icons */}
          <div className="flex justify-center gap-6 mt-6 text-xs text-muted-foreground">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
