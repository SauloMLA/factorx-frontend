'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface AuroraBgProps {
  className?: string;
  colors?: string[];
  children?: React.ReactNode;
}

export function AuroraBg({
  className,
  colors = [
    'oklch(0.76 0.12 82 / 25%)',   // champagne gold
    'oklch(0.55 0.10 200 / 18%)',  // deep teal
    'oklch(0.40 0.08 280 / 12%)',  // midnight indigo
    'oklch(0.76 0.12 82 / 12%)',   // gold accent
  ],
  children,
}: AuroraBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden bg-[oklch(0.06_0_0)]', className)}>
      {/* Aurora glow blobs */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden blur-[80px]"
        aria-hidden="true"
      >
        <div
          className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full animate-pulse"
          style={{ background: colors[0] }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] rounded-full animate-pulse"
          style={{ background: colors[1], animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] rounded-full"
          style={{ background: colors[2] }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full"
          style={{ background: colors[3] }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
