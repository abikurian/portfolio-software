'use client';

import Lenis from 'lenis';
import { createContext, useContext, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

type LenisContextValue = {
  scrollTo: (target: string | number | HTMLElement) => void;
  stop: () => void;
  start: () => void;
  resize: () => void;
};

const LenisContext = createContext<LenisContextValue>({
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
  resize: () => {},
});

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    if (typeof window !== 'undefined') {
      (window as unknown as { lenis?: Lenis }).lenis = lenis;
    }

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      if (typeof window !== 'undefined') {
        delete (window as unknown as { lenis?: Lenis }).lenis;
      }
    };
  }, []);

  const scrollTo = (target: string | number | HTMLElement) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target as string, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        offset: -88,
      });
    } else {
      if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const stop = () => {
    lenisRef.current?.stop();
  };

  const start = () => {
    lenisRef.current?.start();
  };

  const resize = () => {
    lenisRef.current?.resize();
  };

  return (
    <LenisContext.Provider value={{ scrollTo, stop, start, resize }}>
      {children}
    </LenisContext.Provider>
  );
}
