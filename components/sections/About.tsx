'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FadeUp } from '@/components/motion/FadeUp';
import { BigCounter } from '@/components/ui/BigCounter';

export function About() {
  const [currentNum, setCurrentNum] = useState('01');
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === p1Ref.current) {
              setCurrentNum('01');
            } else if (entry.target === p2Ref.current) {
              setCurrentNum('02');
            }
          }
        });
      },
      { rootMargin: '-30% 0px -30% 0px', threshold: 0.2 }
    );

    if (p1Ref.current) observer.observe(p1Ref.current);
    if (p2Ref.current) observer.observe(p2Ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <Section id="about" ariaLabelledBy="about-heading">
      <Container>
        <SectionHeading id="about-heading" title="ABOUT" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="col-span-12 xl:col-span-9 max-w-[65ch] space-y-8 text-foreground/90 text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.5]">
            <FadeUp>
              <p ref={p1Ref}>
                I&apos;m a Computer Science student at SNGCE, Kochi, building full-stack Progressive Web Apps with secure backends in PostgreSQL and Firebase. I like understanding a system well enough to explain why it was built the way it was.
              </p>
            </FadeUp>

            <FadeUp delay={0.06}>
              <p ref={p2Ref}>
                Most of my work sits where data has to stay correct. A finance tracker that syncs offline changes to the cloud without losing parity, protected by Row Level Security. A campus bus tracker that uses a geolocation algorithm to decide how often it syncs.
              </p>
            </FadeUp>
          </div>

          <BigCounter value={currentNum} label="About" />
        </div>
      </Container>
    </Section>
  );
}
