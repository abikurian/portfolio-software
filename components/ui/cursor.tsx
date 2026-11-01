'use client';

import * as React from 'react';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { gsap } from '@/lib/gsap';

function useIsDesktopFinePointer() {
  return useSyncExternalStore(
    (callback) => {
      const mqPointer = window.matchMedia('(pointer: fine)');
      const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      mqPointer.addEventListener('change', callback);
      mqMotion.addEventListener('change', callback);
      return () => {
        mqPointer.removeEventListener('change', callback);
        mqMotion.removeEventListener('change', callback);
      };
    },
    () => window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );
}

export function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);
  const isEnabled = useIsDesktopFinePointer();

  useEffect(() => {
    if (!isEnabled || !ringRef.current) return;

    const ring = ringRef.current;
    let isHoveringTarget = false;

    // Center offset based on 36px base size
    const BASE_SIZE = 36;
    const xTo = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

    // Set initial position off-screen
    gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 0 });

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(ring, { opacity: 1, duration: 0.2 });
      xTo(e.clientX);
      yTo(e.clientY);

      // Check if hovering over links, buttons, or project rows
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('a, button, [role="button"], input, select, textarea');

      if (interactive && !isHoveringTarget) {
        isHoveringTarget = true;
        gsap.to(ring, {
          width: 64,
          height: 64,
          backgroundColor: 'hsl(var(--primary) / 0.12)',
          borderColor: 'hsl(var(--primary) / 0.8)',
          duration: 0.3,
          ease: 'power3.out',
        });
      } else if (!interactive && isHoveringTarget) {
        isHoveringTarget = false;
        gsap.to(ring, {
          width: BASE_SIZE,
          height: BASE_SIZE,
          backgroundColor: 'transparent',
          borderColor: 'hsl(var(--foreground) / 0.6)',
          duration: 0.3,
          ease: 'power3.out',
        });
      }
    };

    const handleMouseDown = () => {
      gsap.to(ring, { scale: 0.8, duration: 0.15, ease: 'power2.out' });
    };

    const handleMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
    };

    const handleMouseLeave = () => {
      gsap.to(ring, { opacity: 0, duration: 0.25 });
    };

    const handleMouseEnter = () => {
      gsap.to(ring, { opacity: 1, duration: 0.25 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[99999] border border-foreground/60 mix-blend-difference will-change-transform"
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
      }}
    />
  );
}
