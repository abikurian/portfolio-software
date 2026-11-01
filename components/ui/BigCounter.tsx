'use client';

import * as React from 'react';
import { useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  className?: string;
}

export function BigCounter({ value, label, className }: BigCounterProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <aside
      aria-hidden="true"
      className={`hidden xl:block col-span-3 col-start-10 sticky top-[22vh] self-start pl-6 select-none pointer-events-none ${className || ''}`}
    >
      {/* Numeral overflow-hidden mask */}
      <div className="relative overflow-hidden h-[1.1em] leading-none">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={value}
            initial={
              prefersReduced
                ? { opacity: 1, y: 0 }
                : { y: '100%', opacity: 0.3 }
            }
            animate={
              prefersReduced
                ? { opacity: 1, y: 0 }
                : {
                    y: '0%',
                    opacity: 1,
                    color: ['hsl(var(--primary))', 'transparent'],
                  }
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
            className="font-anton text-[clamp(6rem,13vw,13rem)] leading-none"
            style={{
              WebkitTextStroke: '1px hsl(var(--foreground) / 0.3)',
              color: 'transparent',
            }}
          >
            {value}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Crossfading short label in mono font */}
      <div className="h-6 mt-3 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: prefersReduced ? 0.01 : 0.25 }}
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground truncate max-w-[220px]"
          >
            {label}
          </motion.p>
        </AnimatePresence>
      </div>
    </aside>
  );
}
