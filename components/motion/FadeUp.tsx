'use client';

import * as React from 'react';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export interface FadeUpProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
  y?: number;
  triggerHook?: string;
}

export function FadeUp({
  children,
  className,
  delay = 0,
  duration = 0.7,
  y = 24,
  triggerHook = 'top 90%',
  ...props
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(ref.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        ref.current,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: triggerHook,
            once: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn('will-change-transform', className)} {...props}>
      {children}
    </div>
  );
}
