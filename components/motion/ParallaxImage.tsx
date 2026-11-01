'use client';

import * as React from 'react';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export interface ParallaxImageProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number; // yPercent delta
  children: React.ReactNode;
}

export function ParallaxImage({
  children,
  className,
  speed = 10,
  ...props
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !targetRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        if (!containerRef.current || !targetRef.current) return;
        gsap.fromTo(
          targetRef.current,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

      mm.add('(max-width: 767px)', () => {
        if (targetRef.current) {
          gsap.set(targetRef.current, { yPercent: 0 });
        }
      });
    },
    { scope: containerRef, dependencies: [speed] }
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      {...props}
    >
      <div ref={targetRef} className="h-full w-full will-change-transform scale-110">
        {children}
      </div>
    </div>
  );
}

