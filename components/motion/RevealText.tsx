'use client';

import * as React from 'react';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export interface RevealTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';
  className?: string;
  delay?: number;
}

export function RevealText({
  text,
  as: Component = 'span',
  className,
  delay = 0,
}: RevealTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const words = text.split(' ');

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(containerRef.current.querySelectorAll('.word-inner'), {
          yPercent: 0,
          opacity: 1,
        });
        return;
      }

      const elements = containerRef.current.querySelectorAll('.word-inner');
      gsap.fromTo(
        elements,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.04,
          ease: 'power4.out',
          delay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 88%',
            once: true,
          },
          onComplete: () => {
            elements.forEach((el) => {
              (el as HTMLElement).style.willChange = 'auto';
            });
          },
        }
      );
    },
    { scope: containerRef }
  );

  return React.createElement(
    Component,
    {
      ref: containerRef,
      'aria-label': text,
      className: cn('inline-block leading-inherit', className),
    },
    <span aria-hidden="true" className="inline flex-wrap">
      {(words ?? []).map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-top mr-[0.25em] last:mr-0 pb-[0.08em]"
        >
          <span className="word-inner inline-block will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
