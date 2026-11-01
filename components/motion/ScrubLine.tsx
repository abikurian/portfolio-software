'use client';

import * as React from 'react';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export interface ScrubLineProps extends React.HTMLAttributes<HTMLDivElement> {
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function ScrubLine({
  className,
  triggerRef,
  ...props
}: ScrubLineProps) {
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!lineRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(lineRef.current, { scaleY: 1 });
        return;
      }

      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const targetTrigger = triggerRef?.current || lineRef.current?.parentElement;
        if (!targetTrigger || !lineRef.current) return;

        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: targetTrigger,
              start: 'top 75%',
              end: 'bottom 85%',
              scrub: 0.5,
            },
          }
        );
      });

      mm.add('(max-width: 767px)', () => {
        if (lineRef.current) {
          gsap.set(lineRef.current, { scaleY: 1 });
        }
      });
    },
    { scope: lineRef, dependencies: [triggerRef] }
  );

  return (
    <div
      ref={lineRef}
      className={cn('w-[1px] bg-primary origin-top will-change-transform', className)}
      {...props}
    />
  );
}

