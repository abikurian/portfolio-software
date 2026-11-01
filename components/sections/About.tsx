'use client';

import * as React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FadeUp } from '@/components/motion/FadeUp';

export function About() {
  const quickFacts = [
    { label: 'Location', value: 'Kochi, Kerala' },
    { label: 'Degree', value: 'B.Tech CSE, 2023 to 2027' },
    { label: 'Institution', value: 'KTU / SNGCE' },
    { label: 'Current focus', value: 'Generative AI with local models (Ollama)' },
  ];

  return (
    <Section id="about" ariaLabelledBy="about-heading">
      <Container>
        <SectionHeading id="about-heading" number="01 /" title="ABOUT" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left: Three verbatim paragraphs */}
          <div className="lg:col-span-7 space-y-6 text-foreground/90 text-base sm:text-lg leading-relaxed">
            <FadeUp>
              <p>
                I&apos;m a Computer Science student at SNGCE, Kochi, building full-stack Progressive Web Apps with secure backends in PostgreSQL and Firebase. I like understanding a system well enough to explain why it was built the way it was.
              </p>
            </FadeUp>

            <FadeUp delay={0.06}>
              <p>
                Most of my work sits where data has to stay correct. A finance tracker that syncs offline changes to the cloud without losing parity, protected by Row Level Security. A campus bus tracker that uses a geolocation algorithm to decide how often it syncs.
              </p>
            </FadeUp>

            <FadeUp delay={0.12}>
              <p>
                I also work below the web layer: Linux, C and socket programming, and relational schema design in MySQL. Lately I&apos;ve been building with generative AI pipelines and running local models with Ollama.
              </p>
            </FadeUp>
          </div>

          {/* Right: Quick Facts block */}
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
