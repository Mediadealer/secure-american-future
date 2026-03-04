'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { config } from '@/lib/config';

interface AccountCardProps {
  userName: string;
  isLoaded?: boolean;
}

export function AccountCard({ userName, isLoaded = false }: AccountCardProps) {
  return (
    <Card
      className={`transition-all duration-400 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">
          {config.ui.accountTitle}
        </CardTitle>
        <Badge variant="outline" className="bg-primary/15 text-primary border-0">
          {config.ui.statusActive}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-muted-foreground to-muted" />
          <div>
            <div className="font-semibold text-lg">{userName || 'New Affiliate'}</div>
            <div className="text-sm text-muted-foreground font-mono">
              ID: #AFH-{new Date().getFullYear()}-XXXXX
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Member Since</div>
            <div className="font-semibold text-sm">Just Now</div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1">Account Tier</div>
            <div className="font-semibold text-sm text-accent">
              {config.ui.statusPending}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
