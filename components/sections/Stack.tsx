'use client';

import * as React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FadeUp } from '@/components/motion/FadeUp';
import { stackGroups } from '@/lib/data/stack';

export function Stack() {
  return (
    <Section id="stack" ariaLabelledBy="stack-heading">
      <Container>
        <SectionHeading id="stack-heading" number="03 /" title="TECHNICAL STACK" />

        {/* Spec Sheet Layout: Ruled plain grouped text lists */}
        <div className="border-t border-border">
          {stackGroups.map((group, idx) => {
            const indexNumber = String(idx + 1).padStart(2, '0');
            return (
              <FadeUp key={group.label} delay={idx * 0.04}>
                <div className="py-6 sm:py-8 border-b border-border/80 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-baseline">
                  {/* Category Label & Index */}
                  <div className="md:col-span-4 flex items-baseline gap-4">
                    <span className="font-mono text-xs text-primary select-none shrink-0">
                      {indexNumber}
                    </span>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold">
                      {group.label}
                    </h3>
                  </div>

                  {/* Plain Text List separated by middle dots */}
                  <div className="md:col-span-8">
                    <p className="font-mono text-sm sm:text-base text-foreground leading-relaxed">
                      {group.items.join('   /   ')}
                    </p>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>

        <div className="pt-6 font-mono text-xs text-muted-foreground flex justify-between">
          <span>SPEC SHEET: ALL ENVIRONMENTS &amp; FRAMEWORKS</span>
          <span>6 CATEGORIES</span>
        </div>
      </Container>
    </Section>
  );
}
