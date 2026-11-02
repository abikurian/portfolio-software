'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { FlowSection } from '@/components/ui/story-scroll';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BigCounter } from '@/components/ui/BigCounter';
import { FadeUp } from '@/components/motion/FadeUp';
import { stackGroups } from '@/lib/data/stack';
import { cn } from '@/lib/utils';

export function Stack() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [inViewIdx, setInViewIdx] = useState(0);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

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
  const currentLabel = stackGroups[activeIdx]?.label || stackGroups[0].label;

  return (
    <FlowSection id="skills" aria-labelledby="skills-heading" className="bg-background-light border-t border-border py-16 sm:py-24 md:py-32 justify-center">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left numeral at xl (columns 1 to 3) */}
          <BigCounter value={currentNum} label={currentLabel} side="left" />

          {/* Section heading & content in columns 4 to 12 */}
          <div className="col-span-12 xl:col-span-9 xl:col-start-4">
            <SectionHeading id="skills-heading" title="SKILLS" />

            {/* Spec Sheet Layout: Interactive hover list */}
            <div
              className="border-t border-border"
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {(stackGroups ?? []).map((group, idx) => {
                const isHovered = hoveredIdx === idx;
                const isDimmed = hoveredIdx !== null && !isHovered;

                return (
                  <FadeUp key={group.label} delay={idx * 0.04}>
                    <div
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
                        'relative py-6 sm:py-8 border-b border-border/80 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-baseline transition-all duration-300 ease-out cursor-default touch-manipulation focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                        isDimmed ? 'opacity-40' : 'opacity-100',
                        isHovered && 'translate-x-3 motion-reduce:translate-x-0'
                      )}
                    >
                      {/* Category Label */}
                      <div className="md:col-span-4">
                        <h3
                          className={cn(
                            'font-mono text-xs uppercase tracking-widest font-semibold transition-colors duration-200',
                            isHovered ? 'text-primary' : 'text-foreground'
                          )}
                        >
                          {group.label}
                        </h3>
                      </div>

                      {/* Plain Text List separated by middle dots */}
                      <div className="md:col-span-8">
                        {(group.items ?? []).length > 0 && (
                          <p className="font-mono text-sm sm:text-base text-foreground leading-relaxed">
                            {(group.items ?? []).join('   /   ')}
                          </p>
                        )}
                      </div>

                      {/* Thin accent line drawing under hovered group */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute bottom-0 left-0 h-[1px] bg-primary transition-all duration-300 origin-left',
                          isHovered ? 'w-full scale-x-100 opacity-100' : 'w-full scale-x-0 opacity-0'
                        )}
                      />
                    </div>
                  </FadeUp>
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
