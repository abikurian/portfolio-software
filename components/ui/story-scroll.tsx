'use client';

import * as React from 'react';
import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export interface FlowSectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children: React.ReactNode;
}

export const FlowSection = React.forwardRef<HTMLElement, FlowSectionProps>(
  function FlowSection(
    {
      id,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      ...props
    },
    ref
  ) {
    return (
      <section
        ref={ref}
        id={id}
        data-flow-section
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className="relative min-h-screen min-h-svh w-full overflow-clip scroll-mt-24"
        {...props}
      >
        <div
          data-flow-inner
          className={cn(
            'flow-art-container relative flex min-h-screen min-h-svh w-full flex-col will-change-transform',
            className
          )}
          style={{ transformOrigin: 'bottom left' }}
        >
          {children}
        </div>
      </section>
    );
  }
);

export interface FlowArtProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  angle?: number;
  'aria-label'?: string;
}

export default function FlowArt({
  children,
  className,
  angle = 10,
  'aria-label': ariaLabel = 'Story scroll',
  ...props
}: FlowArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia();

    mm.add(
      '(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
      () => {
        if (!containerRef.current) return;
        const sections = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]')
        );
        if (sections.length === 0) return;

        const triggers: ScrollTrigger[] = [];

        sections.forEach((section, idx) => {
          gsap.set(section, { zIndex: idx + 1 });
          const inner = section.querySelector<HTMLElement>('.flow-art-container');
          if (inner) {
            if (idx > 0) {
              gsap.set(inner, { rotation: angle, transformOrigin: 'bottom left' });
              const tween = gsap.to(inner, {
                rotation: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'top 25%',
                  scrub: true,
                },
              });
              if (tween.scrollTrigger) {
                triggers.push(tween.scrollTrigger);
              }
            }

            if (idx < sections.length - 1) {
              const pinTrigger = ScrollTrigger.create({
                trigger: section,
                start: 'bottom bottom',
                end: 'bottom top',
                pin: true,
                pinSpacing: false,
              });
              triggers.push(pinTrigger);
            }
          }
        });

        ScrollTrigger.refresh();

        return () => {
          triggers.forEach((t) => {
            try {
              t.kill();
            } catch (err) {
              console.error('Error killing ScrollTrigger:', err);
            }
          });
        };
      }
    );

    // Refresh once fonts are ready
    if (typeof document !== 'undefined' && 'fonts' in document && document.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          ScrollTrigger.refresh();
        })
        .catch((err) => {
          console.error('Error in document.fonts.ready ScrollTrigger.refresh():', err);
        });
    }

    // Debounced resize handler (200ms)
    let resizeTimer: NodeJS.Timeout | null = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        try {
          ScrollTrigger.refresh();
        } catch (err) {
          console.error('Error in debounced resize ScrollTrigger.refresh():', err);
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      try {
        mm.revert();
      } catch (err) {
        console.error('Error in gsap.matchMedia revert():', err);
      }
    };
  }, [angle]);

  return (
    <div
      ref={containerRef}
      aria-label={ariaLabel}
      className={cn('w-full [overflow-x:clip]', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { FlowArt };
