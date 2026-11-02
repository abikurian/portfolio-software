'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { FlowSection } from '@/components/ui/story-scroll';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BigCounter } from '@/components/ui/BigCounter';
import { stackGroups } from '@/lib/data/stack';
import { gsap, useGSAP } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export function Stack() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [inViewIdx, setInViewIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Entrance animation: fade up smoothly with ~0.06s stagger once
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const rows = listRef.current?.querySelectorAll('.skill-group-row');
      if (!rows || rows.length === 0) return;

      gsap.fromTo(
        rows,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
          clearProps: 'transform,opacity',
        }
      );
    },
    { scope: sectionRef }
  );

  // In-view observer for BigCounter tracking when not hovered
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = groupRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) {
              setInViewIdx(idx);
            }
          }
        });
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0.1 }
    );

    groupRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const activeIdx = hoveredIdx !== null ? hoveredIdx : inViewIdx;
  const currentNum = String(activeIdx + 1).padStart(2, '0');
  const currentLabel = stackGroups[activeIdx]?.label || stackGroups[0]?.label || 'Skills';

  return (
    <FlowSection
      ref={sectionRef}
      id="skills"
      aria-labelledby="skills-heading"
      className="theme-lemon bg-background border-t border-border py-16 sm:py-24 md:py-32 justify-center"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left numeral at xl (columns 1 to 3) */}
          <BigCounter value={currentNum} label={currentLabel} side="left" />

          {/* Section heading & content in columns 4 to 12 */}
          <div className="col-span-12 xl:col-span-9 xl:col-start-4">
            <SectionHeading id="skills-heading" title="SKILLS" />

            {/* Spec Sheet Layout: Interactive hover list */}
            <div
              ref={listRef}
              className="border-t border-border"
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {(stackGroups ?? []).map((group, idx) => {
                const isHovered = hoveredIdx === idx;
                const isDimmed = hoveredIdx !== null && !isHovered;

                return (
                  <div
                    key={group.label}
                    ref={(el) => {
                      groupRefs.current[idx] = el;
                    }}
                    role="button"
                    tabIndex={0}
                    onClick={() => setHoveredIdx((prev) => (prev === idx ? null : idx))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setHoveredIdx((prev) => (prev === idx ? null : idx));
                      }
                    }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onFocus={() => setHoveredIdx(idx)}
                    className={cn(
                      'skill-group-row relative py-6 sm:py-8 border-b border-border/80 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-baseline transition-all duration-300 ease-out cursor-default touch-manipulation focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                      isDimmed ? 'opacity-40' : 'opacity-100',
                      isHovered && 'translate-x-3 motion-reduce:translate-x-0'
                    )}
                  >
                    {/* Category Label */}
                    <div className="md:col-span-4">
                      <h3
                        className={cn(
                          'font-mono text-xs uppercase tracking-widest font-semibold transition-colors duration-200',
                          isHovered ? 'text-accent underline decoration-2 underline-offset-4' : 'text-foreground/90'
                        )}
                      >
                        {group.label}
                      </h3>
                    </div>

                    {/* Skill Pills */}
                    <div className="md:col-span-8 flex flex-wrap gap-2">
                      {(group.items ?? []).map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center px-2.5 py-1 font-mono text-xs sm:text-sm bg-foreground/5 border border-border/60 text-foreground transition-colors"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Thin accent line drawing under hovered group */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute bottom-0 left-0 h-[1.5px] bg-accent transition-all duration-300 origin-left',
                        isHovered ? 'w-full scale-x-100 opacity-100' : 'w-full scale-x-0 opacity-0'
                      )}
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-6 font-mono text-xs text-muted-foreground">
              <span>SPEC SHEET: ALL ENVIRONMENTS &amp; FRAMEWORKS</span>
            </div>
          </div>
        </div>
      </Container>
    </FlowSection>
  );
}
