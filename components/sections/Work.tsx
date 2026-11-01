'use client';

import * as React from 'react';
import { useState, useRef, useSyncExternalStore } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BigCounter } from '@/components/ui/BigCounter';
import { FadeUp } from '@/components/motion/FadeUp';
import { useLenis } from '@/components/providers/SmoothScroll';
import { projects } from '@/lib/data/projects';
import { cn } from '@/lib/utils';

function useIsFinePointer() {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia('(pointer: fine)');
      mq.addEventListener('change', callback);
      return () => mq.removeEventListener('change', callback);
    },
    () => window.matchMedia('(pointer: fine)').matches,
    () => false
  );
}

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

export function Work() {
  const { resize } = useLenis();
  const [activeSlug, setActiveSlug] = useState<string | null>(projects[0]?.slug ?? null);
  const [activeIdx, setActiveIdx] = useState(0);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFinePointer = useIsFinePointer();
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseEnter = (slug: string, idx: number) => {
    setActiveIdx(idx);
    if (!isFinePointer) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveSlug(slug);
    }, 80);
  };

  const handleMouseLeaveList = () => {
    if (!isFinePointer) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveSlug(null);
  };

  const handleFocus = (slug: string, idx: number) => {
    setActiveIdx(idx);
    setActiveSlug(slug);
  };

  const handleKeyDown = (e: React.KeyboardEvent, slug: string, idx: number) => {
    if (e.key === 'Escape') {
      setActiveSlug(null);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveIdx(idx);
      setActiveSlug((prev) => (prev === slug ? null : slug));
    }
  };

  const handleToggleClick = (slug: string, idx: number) => {
    setActiveIdx(idx);
    setActiveSlug((prev) => (prev === slug ? null : slug));
  };

  const currentCounterNum = String(Math.max(1, (activeIdx ?? 0) + 1)).padStart(2, '0');
  const currentCounterLabel = (projects?.[activeIdx] ?? projects?.[0])?.title ?? 'Selected Work';

  return (
    <Section id="work" ariaLabelledBy="work-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Section heading & content in columns 1 to 9 */}
          <div className="col-span-12 xl:col-span-9 xl:col-start-1">
            <SectionHeading id="work-heading" title="SELECTED WORK" />

            <div
              onMouseLeave={handleMouseLeaveList}
              className="border-t border-border divide-y divide-border/60"
            >
              {(projects ?? []).map((project, idx) => {
                const isOpen = activeSlug === project.slug;
                const isDimmed = activeSlug !== null && !isOpen;

                return (
                  <FadeUp key={project.slug} delay={idx * 0.06} y={24}>
                    <div
                      onMouseEnter={() => handleMouseEnter(project.slug, idx)}
                      className={cn(
                        'transition-opacity duration-200 py-6 sm:py-8',
                        isDimmed ? 'opacity-50' : 'opacity-100',
                        prefersReducedMotion && 'transition-none'
                      )}
                    >
                      {/* Collapsed Row Header: title (and status) + stack line */}
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`details-${project.slug}`}
                        onClick={() => handleToggleClick(project.slug, idx)}
                        onFocus={() => handleFocus(project.slug, idx)}
                        onKeyDown={(e) => handleKeyDown(e, project.slug, idx)}
                        className="w-full text-left min-h-[44px] cursor-pointer touch-manipulation focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none py-2 group transition-transform duration-100 ease-out active:scale-[0.99] motion-reduce:active:scale-100 motion-reduce:transition-none select-none"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
                          {/* Title and status */}
                          <div className="lg:col-span-6">
                            <h3
                              className={cn(
                                'font-anton text-2xl sm:text-3xl uppercase tracking-tight transition-colors duration-150',
                                isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary'
                              )}
                            >
                              {project.title}
                            </h3>
                            {project.status && (
                              <span className="font-mono text-xs text-muted-foreground block mt-1">
                                {project.status}
                              </span>
                            )}
                          </div>

                          {/* Stack line */}
                          <div className="lg:col-span-6 lg:text-right">
                            {(project.stack ?? []).length > 0 && (
                              <div className="font-mono text-xs text-foreground/80 break-words [overflow-wrap:anywhere]">
                                {(project.stack ?? []).join(' · ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Expanded Details Area: Clean flush left alignment with full description */}
                      <div
                        id={`details-${project.slug}`}
                        onTransitionEnd={(e) => {
                          if (e.propertyName === 'grid-template-rows') {
                            resize();
                          }
                        }}
                        className={cn(
                          'grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out',
                          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                          prefersReducedMotion && 'transition-none duration-0'
                        )}
                      >
                        <div className="min-h-0">
                          <div
                            className={cn(
                              'pt-6 mt-4 border-t border-border/40 space-y-4 max-w-[75ch] transition-all duration-300',
                              isOpen
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 -translate-y-2 pointer-events-none',
                              prefersReducedMotion && 'transition-none duration-0 translate-y-0 opacity-100'
                            )}
                          >
                            {project.phase && (
                              <div className="font-mono text-xs text-muted-foreground uppercase">
                                Phase: <span className="text-foreground">{project.phase}</span>
                              </div>
                            )}

                            <p className="text-sm sm:text-base text-foreground leading-relaxed break-words">
                              {project.summary}
                            </p>

                            {(project.stack ?? []).length > 0 && (
                              <div className="font-mono text-xs text-muted-foreground">
                                <span className="text-primary uppercase tracking-wider block mb-1">
                                  Technical Stack
                                </span>
                                <span className="text-foreground break-words [overflow-wrap:anywhere]">{(project.stack ?? []).join('   /   ')}</span>
                              </div>
                            )}

                            {(project.details ?? []).length > 0 && (
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                {(project.details ?? []).map((detail, dIdx) => (
                                  <li key={dIdx}>{detail}</li>
                                ))}
                              </ul>
                            )}

                            {(project.points ?? []).length > 0 && (
                              <ul className="space-y-1 text-sm text-muted-foreground">
                                {(project.points ?? []).map((point, pIdx) => (
                                  <li key={pIdx}>{point}</li>
                                ))}
                              </ul>
                            )}

                            {(project.tags ?? []).length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-2">
                                {(project.tags ?? []).map((tag, tIdx) => (
                                  <span key={tIdx} className="font-mono text-xs text-muted-foreground">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {(project.links ?? []).length > 0 && (
                              <div className="flex flex-wrap gap-4 pt-2">
                                {(project.links ?? []).map((link, lIdx) => (
                                  <a
                                    key={lIdx}
                                    href={link.href}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="font-mono text-xs text-primary underline underline-offset-4 hover:text-foreground"
                                  >
                                    {link.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>

            {/* Footnote */}
            <div className="pt-6 font-mono text-xs text-muted-foreground">
              <span>Previous portfolios explored Astro, WebGL canvas and brutalist layouts.</span>
            </div>
          </div>

          {/* Right numeral at xl (columns 10 to 12) */}
          <BigCounter value={currentCounterNum} label={currentCounterLabel} side="right" />
        </div>
      </Container>
    </Section>
  );
}
