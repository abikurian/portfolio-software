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
          {/* Main Statement */}
          <div className="lg:col-span-7 space-y-6">
            <FadeUp>
              <p className="text-xl sm:text-2xl font-normal leading-relaxed text-foreground tracking-tight">
                I&apos;m a Computer Science student at SNGCE, Kochi, building full-stack Progressive Web Apps with secure backends in PostgreSQL and Firebase. I like understanding a system well enough to explain why it was built the way it was.
              </p>
            </FadeUp>
          </div>

          {/* Quick Facts */}
          <div className="lg:col-span-5">
            <FadeUp delay={0.1}>
              <div className="border-t border-border pt-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-primary mb-6">
                  QUICK FACTS
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-y-4">
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
