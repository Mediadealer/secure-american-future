import { Activity } from 'lucide-react';

interface ConversionToastContentProps {
  message: string;
}

export function ConversionToastContent({ message }: ConversionToastContentProps) {
  return (
    <div className="flex items-start gap-2 p-3 bg-card border-l-4 border-primary rounded-lg shadow-xl w-fit max-w-[220px] backdrop-blur-sm">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        <Activity className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-foreground mb-0.5 text-sm leading-tight">
          Activity Update
        </div>
        <div className="text-xs text-muted-foreground">
          {message}
        </div>
      </div>
    </div>
  );
}
