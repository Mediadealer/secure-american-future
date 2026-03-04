'use client';

import { Lock, ShieldCheck, Flag } from 'lucide-react';

export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-6 py-4 border-t border-b border-border">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="w-4 h-4" />
        <span>256-Bit Encrypted</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4" />
        <span>Privacy Protected</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Flag className="w-4 h-4" />
        <span>American Owned</span>
      </div>
    </div>
  );
}
