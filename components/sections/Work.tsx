'use client';

import * as React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FadeUp } from '@/components/motion/FadeUp';
import { projects } from '@/lib/data/projects';

export function Work() {
  const featured = projects[0];
  const otherProjects = projects.slice(1);

  return (
    <Section id="work" ariaLabelledBy="work-heading">
      <Container>
        <SectionHeading id="work-heading" number="02 /" title="SELECTED WORK" />

        <div className="border-t border-border">
          {/* Featured Project: Expanded Case Study Row */}
          <FadeUp>
            <div className="group py-10 sm:py-14 border-b border-border transition-colors hover:bg-secondary/30">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Index & Title */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
                      01 / FEATURED CASE STUDY
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      2026
                    </span>
                  </div>

                  <h3 className="font-anton text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {featured.title}
                  </h3>

                  <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    ROLE: {featured.role}
                  </div>
                </div>

                {/* Details & Architecture Decisions */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      SYSTEM ARCHITECTURE &amp; SUMMARY
                    </h4>
                    <p className="text-base sm:text-lg text-foreground leading-relaxed">
                      {featured.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/40 text-sm">
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                        KEY DECISION 01
                      </span>
                      <p className="text-muted-foreground">
                        Dexie.js indexed storage handles offline transactions with immediate local availability.
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                        KEY DECISION 02
                      </span>
                      <p className="text-muted-foreground">
                        PostgreSQL Row Level Security verifies identity before reconciling background sync queues.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-4">
                    <div className="font-mono text-xs text-muted-foreground">
                      STACK: <span className="text-foreground">{featured.stack.join(' · ')}</span>
                    </div>
                    <div className="font-mono text-xs text-primary">
                      {"{{PROJECT_COVER_FINANCE}}"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Remaining Projects: Ruled Index Rows */}
          {otherProjects.map((project, idx) => {
            const indexNumber = String(idx + 2).padStart(2, '0');
            return (
              <FadeUp key={project.slug} delay={(idx + 1) * 0.05}>
                <div className="group py-8 sm:py-10 border-b border-border transition-colors hover:bg-secondary/30">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
                    {/* Index & Title */}
                    <div className="lg:col-span-4 flex items-baseline gap-4">
                      <span className="font-mono text-xs text-primary select-none shrink-0">
                        {indexNumber}
                      </span>
                      <div>
                        <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        {project.team && (
                          <span className="font-mono text-[11px] text-muted-foreground block mt-1">
                            {project.team}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-5">
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {project.summary}
                      </p>
                    </div>

                    {/* Stack & Metadata */}
                    <div className="lg:col-span-3 lg:text-right">
                      <div className="font-mono text-xs text-foreground/80">
                        {project.stack.join(' · ')}
                      </div>
                      <div className="font-mono text-[11px] text-muted-foreground mt-1">
                        {project.textOnly ? 'SYSTEM SPEC' : 'PROTOTYPE'}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>

        {/* Footnote per section 4.2 */}
        <div className="pt-6 font-mono text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <span>Previous portfolios explored Astro, WebGL canvas and brutalist layouts.</span>
          <span>5 PROJECTS LISTED</span>
        </div>
      </Container>
    </Section>
  );
}
