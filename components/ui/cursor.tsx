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
    let xTo: ((value: number) => void) | null = null;
    let yTo: ((value: number) => void) | null = null;

    try {
      xTo = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
      yTo = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
    } catch (e) {
      console.error('Failed to init quickTo:', e);
    }

    // Set initial position off-screen
    try {
      gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 0 });
    } catch (e) {
      console.error('Failed to set initial cursor position:', e);
    }

    const handleMouseMove = (e: MouseEvent) => {
      try {
        if (!ring) return;
        gsap.to(ring, { opacity: 1, duration: 0.2 });
        if (xTo && yTo) {
          xTo(e.clientX);
          yTo(e.clientY);
        }

        // Check if hovering over links, buttons, or project rows
        const target = e.target as HTMLElement | null;
        if (!target) return;
        const interactive = target.closest?.('a, button, [role="button"], input, select, textarea');

        if (interactive && !isHoveringTarget) {
          isHoveringTarget = true;
          ring.classList.add('cursor-hover');
          gsap.to(ring, {
            width: 64,
            height: 64,
            duration: 0.3,
            ease: 'power3.out',
          });
        } else if (!interactive && isHoveringTarget) {
          isHoveringTarget = false;
          ring.classList.remove('cursor-hover');
          gsap.to(ring, {
            width: BASE_SIZE,
            height: BASE_SIZE,
            duration: 0.3,
            ease: 'power3.out',
          });
        }
      } catch (err) {
        console.error('Cursor mousemove error:', err);
      }
    };

    const handleMouseDown = () => {
      try {
        if (!ring) return;
        gsap.to(ring, { scale: 0.8, duration: 0.15, ease: 'power2.out' });
      } catch (e) {
        console.error('Cursor mousedown error:', e);
      }
    };

    const handleMouseUp = () => {
      try {
        if (!ring) return;
        gsap.to(ring, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
      } catch (e) {
        console.error('Cursor mouseup error:', e);
      }
    };

    const handleMouseLeave = () => {
      try {
        if (!ring) return;
        gsap.to(ring, { opacity: 0, duration: 0.25 });
      } catch (e) {
        console.error('Cursor mouseleave error:', e);
      }
    };

    const handleMouseEnter = () => {
      try {
        if (!ring) return;
        gsap.to(ring, { opacity: 1, duration: 0.25 });
      } catch (e) {
        console.error('Cursor mouseenter error:', e);
      }
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
      className="pointer-events-none fixed top-0 left-0 z-[99999] border border-foreground/60 bg-transparent mix-blend-difference will-change-transform transition-[background-color,border-color] duration-300 [&.cursor-hover]:bg-primary/15 [&.cursor-hover]:border-primary/80"
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
      }}
    />
  );
}
