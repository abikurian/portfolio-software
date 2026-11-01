'use client';

import * as React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FadeUp } from '@/components/motion/FadeUp';

export function About() {
  const quickFacts = [
    { label: 'Location', value: 'Kochi, Kerala' },
    { label: 'Degree', value: 'B.Tech CSE, 2023-2027' },
    { label: 'Institution', value: 'KTU / SNGCE' },
    { label: 'Current focus', value: 'Generative AI with local models (Ollama)' },
  ];

  return (
    <Section id="about" ariaLabelledBy="about-heading">
      <Container>
        <SectionHeading id="about-heading" number="01 /" title="ABOUT" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Col 1-5: Portrait Slot & Meta */}
          <div className="lg:col-span-5 space-y-6">
            <FadeUp>
              <div className="border border-border p-4 bg-background">
                <div className="aspect-[4/5] bg-secondary/50 border border-border/60 flex flex-col justify-between p-6">
                  <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                    <span>PORTRAIT</span>
                    <span>ABI KURIAN</span>
                  </div>

                  <div className="my-auto text-center font-mono text-xs text-muted-foreground">
                    <p className="text-primary mb-1">{"{{PORTRAIT_SLOT}}"}</p>
                    <p className="text-[11px] text-muted-foreground/70">
                      Photo or abstract visual slot
                    </p>
                  </div>

                  <div className="font-mono text-[11px] text-muted-foreground/50 border-t border-border/40 pt-2">
                    SNGCE / CSE &bull; KOCHI
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Col 6-12: Plain Statement & Definition List */}
          <div className="lg:col-span-7 space-y-10">
            <FadeUp delay={0.1}>
              <p className="text-xl sm:text-2xl md:text-3xl font-normal leading-relaxed text-foreground tracking-tight">
                I&apos;m a Computer Science student at SNGCE, Kochi, building full-stack Progressive Web Apps with secure backends in PostgreSQL and Firebase. I like understanding a system well enough to explain why it was built the way it was.
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="pt-6 border-t border-border">
                <h3 className="font-mono text-xs uppercase tracking-widest text-primary mb-6">
                  QUICK FACTS
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {quickFacts.map((fact, idx) => (
                    <div key={idx} className="border-b border-border/40 pb-3">
                      <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        {fact.label}
                      </dt>
                      <dd className="text-sm text-foreground font-medium">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </FadeUp>
          </div>
        </div>
      </Container>
    </Section>
  );
}
