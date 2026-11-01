'use client';

import * as React from 'react';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number; // duration in seconds
  reverse?: boolean;
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  className,
  speed = 25,
  reverse = false,
  pauseOnHover = true,
  ...props
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!trackRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const tween = gsap.to(trackRef.current, {
        xPercent: reverse ? 50 : -50,
        ease: 'none',
        duration: speed,
        repeat: -1,
      });

      if (pauseOnHover && containerRef.current) {
        const onEnter = () => tween.pause();
        const onLeave = () => tween.play();
        const el = containerRef.current;
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
        return () => {
          el.removeEventListener('mouseenter', onEnter);
          el.removeEventListener('mouseleave', onLeave);
        };
      }
    },
    { scope: containerRef, dependencies: [speed, reverse, pauseOnHover] }
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-hidden select-none', className)}
      {...props}
    >
      <div
        ref={trackRef}
        className="flex w-max flex-nowrap will-change-transform"
      >
        <div className="flex shrink-0 items-center gap-8 pr-8">
          {children}
        </div>
        <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

