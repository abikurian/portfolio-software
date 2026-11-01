'use client';

import * as React from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FadeUp } from '@/components/motion/FadeUp';

export function About() {
  return (
    <Section id="about" ariaLabelledBy="about-heading">
      <Container>
        <SectionHeading id="about-heading" number="01 /" title="ABOUT" />

        <div className="max-w-[65ch] space-y-8 text-foreground/90 text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.5]">
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
      </Container>
    </Section>
  );
}
