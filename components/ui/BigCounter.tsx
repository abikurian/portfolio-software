'use client';

import * as React from 'react';
import { useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      mq.addEventListener('change', callback);
      return () => mq.removeEventListener('change', callback);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );
}

export interface BigCounterProps {
  value: string; // e.g. "01", "02"
  label: string; // e.g. "About", "Smart Yatra"
  side?: 'left' | 'right';
  className?: string;
}

export function BigCounter({ value = '01', label = '', side = 'right', className }: BigCounterProps) {
  const prefersReduced = usePrefersReducedMotion();

  const safeValue = value || '01';
  const safeLabel = label || '';
  const isLeft = side === 'left';

  return (
    <aside
      aria-hidden="true"
      className={cn(
        'hidden xl:block col-span-3 sticky top-[22vh] self-start select-none pointer-events-none z-10',
        isLeft ? 'col-start-1 text-left pr-6' : 'col-start-10 text-right pl-6',
        className
      )}
    >
      {/* Numeral overflow-hidden container sized with font-anton and clamp font size */}
      <div className="relative font-anton text-[clamp(6rem,13vw,13rem)] leading-none overflow-hidden h-[1.15em] flex items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={safeValue}
            initial={
              prefersReduced
                ? { opacity: 1, y: 0 }
                : { y: '100%', opacity: 0.5 }
            }
            animate={
              prefersReduced
                ? { opacity: 1, y: 0 }
                : { y: '0%', opacity: 1 }
            }
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { y: '-100%', opacity: 0 }
            }
            transition={{
              duration: prefersReduced ? 0.01 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              'w-full leading-none will-change-transform',
              isLeft ? 'text-left' : 'text-right'
            )}
            style={{
              WebkitTextStroke: '1.5px hsl(var(--foreground) / 0.4)',
              color: 'transparent',
            }}
          >
            {safeValue}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Crossfading short label in mono font */}
      <div className={cn('h-6 mt-3 overflow-hidden flex', isLeft ? 'justify-start' : 'justify-end')}>
        <AnimatePresence mode="wait">
          <motion.p
            key={safeLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: prefersReduced ? 0.01 : 0.25 }}
            className={cn(
              'font-mono text-xs uppercase tracking-widest text-muted-foreground truncate max-w-[220px]',
              isLeft ? 'text-left' : 'text-right'
            )}
          >
            {safeLabel}
          </motion.p>
        </AnimatePresence>
      </div>
    </aside>
  );
}
