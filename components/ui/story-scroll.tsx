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
            'flow-art-container relative flex min-h-screen min-h-svh w-full flex-col',
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

        // Sticky top calculation using visualViewport height or innerHeight
        const updateStickyTops = () => {
          const vh = window.visualViewport?.height ?? window.innerHeight;
          sections.forEach((section, idx) => {
            if (idx < sections.length - 1) {
              const sectionHeight = section.offsetHeight;
              const topVal = Math.min(0, vh - sectionHeight);
              section.style.top = `${topVal}px`;
            }
          });
        };

        // ResizeObserver on each section
        const ro = new ResizeObserver(() => {
          updateStickyTops();
        });

        let lastWidth = window.innerWidth;
        let lastHeight = window.innerHeight;

        const handleResize = () => {
          const newWidth = window.innerWidth;
          const newHeight = window.innerHeight;
          // Ignore mobile address bar only changes
          if (newWidth === lastWidth && Math.abs(newHeight - lastHeight) <= 150) {
            return;
          }
          lastWidth = newWidth;
          lastHeight = newHeight;
          updateStickyTops();
        };

        window.addEventListener('resize', handleResize);

        sections.forEach((section, idx) => {
          ro.observe(section);

          const isLast = idx === sections.length - 1;
          section.style.zIndex = String(idx + 1);

          if (!isLast) {
            section.style.position = 'sticky';
          } else {
            section.style.position = 'relative';
            section.style.top = '';
          }

          const inner = section.querySelector<HTMLElement>('[data-flow-inner]');
          if (inner && idx > 0) {
            gsap.fromTo(
              inner,
              { rotation: angle, transformOrigin: 'bottom left' },
              {
                rotation: 0,
                ease: 'none',
                immediateRender: true,
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'top 20%',
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
              }
            );
          }
        });

        updateStickyTops();

        return () => {
          ro.disconnect();
          window.removeEventListener('resize', handleResize);
          sections.forEach((section) => {
            section.style.position = '';
            section.style.top = '';
            section.style.zIndex = '';
            const inner = section.querySelector<HTMLElement>('[data-flow-inner]');
            if (inner) {
              inner.style.transform = '';
              inner.style.transformOrigin = '';
              inner.style.willChange = 'auto';
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

    // Debounced resize handler (250ms) firing only when no scroll has occurred
    let resizeTimer: NodeJS.Timeout | null = null;
    let scrollAtResize = typeof window !== 'undefined' ? window.scrollY : 0;

    const handleDebouncedResize = () => {
      scrollAtResize = window.scrollY;
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.scrollY === scrollAtResize) {
          try {
            ScrollTrigger.refresh();
          } catch (err) {
            console.error('Error in debounced resize ScrollTrigger.refresh():', err);
          }
        }
      }, 250);
    };

    window.addEventListener('resize', handleDebouncedResize);

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleDebouncedResize);
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
