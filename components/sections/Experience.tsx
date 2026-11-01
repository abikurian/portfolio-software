'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrubLine } from '@/components/motion/ScrubLine';
import { FadeUp } from '@/components/motion/FadeUp';
import { BigCounter } from '@/components/ui/BigCounter';
import { experiences, education, extras } from '@/lib/data/experience';

export function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);

  const timelineEntries = [
    { label: experiences[0]?.org || 'Internship', num: '01' },
    { label: experiences[1]?.org || 'Internship', num: '02' },
    { label: education?.org || 'University', num: '03' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = entryRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) {
              setActiveIdx(idx);
            }
          }
        });
      },
      { rootMargin: '-35% 0px -35% 0px', threshold: 0.1 }
    );

    entryRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const currentNum = timelineEntries[activeIdx]?.num || '01';
  const currentLabel = timelineEntries[activeIdx]?.label || 'Experience';

  return (
    <Section id="experience" ariaLabelledBy="experience-heading">
      <Container>
        <SectionHeading id="experience-heading" title="EXPERIENCE &amp; EDUCATION" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="col-span-12 xl:col-span-9">
            <div ref={timelineRef} className="relative border-t border-border pt-8">
              {/* ScrubLine hairline on the left */}
              <div className="hidden sm:block absolute left-0 top-8 bottom-0 w-[1px] bg-border/40">
                <ScrubLine triggerRef={timelineRef} className="w-[1px] bg-primary h-full" />
              </div>

              <div className="sm:pl-10 space-y-12 sm:space-y-16">
                {/* Internships */}
                {experiences.map((exp, idx) => (
                  <FadeUp key={exp.org} delay={idx * 0.08}>
                    <div
                      ref={(el) => {
                        entryRefs.current[idx] = el;
                      }}
                      className="border-b border-border/60 pb-10 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-start"
                    >
                      <div className="md:col-span-4 space-y-1">
                        <span className="font-mono text-xs uppercase tracking-widest text-primary block">
                          {exp.mode} INTERNSHIP
                        </span>
                        <span className="font-mono text-xs text-muted-foreground block">
                          {exp.start} — {exp.end || 'Present'}
                        </span>
                        <div className="text-sm font-medium text-foreground pt-1">
                          {exp.org}
                        </div>
                      </div>

                      <div className="md:col-span-8 space-y-4">
                        <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-foreground">
                          {exp.role}
                        </h3>

                        <ul className="space-y-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {exp.points.map((point, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-3">
                              <span className="text-primary font-mono select-none">&bull;</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </FadeUp>
                ))}

                {/* University Degree */}
                <FadeUp delay={0.2}>
                  <div
                    ref={(el) => {
                      entryRefs.current[2] = el;
                    }}
                    className="border-b border-border/60 pb-10 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-start"
                  >
                    <div className="md:col-span-4 space-y-1">
                      <span className="font-mono text-xs uppercase tracking-widest text-primary block">
                        DEGREE PROGRAM
                      </span>
                      <span className="font-mono text-xs text-muted-foreground block">
                        {education.start} — {education.end}
                      </span>
                      <div className="text-sm font-medium text-foreground pt-1">
                        {education.org}
                      </div>
                    </div>

                    <div className="md:col-span-8">
                      <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-foreground">
                        {education.degree}
                      </h3>
                    </div>
                  </div>
                </FadeUp>

                {/* Academic Seminar & Certification */}
                <FadeUp delay={0.25}>
                  <div className="pt-2">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-primary mb-6">
                      ADDITIONAL CREDENTIALS &amp; SEMINARS
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {extras.map((extra, eIdx) => (
                        <div key={eIdx} className="border-l border-border pl-4">
                          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                            {extra.label}
                          </span>
                          <p className="text-sm text-foreground leading-relaxed font-medium">
                            {extra.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              </div>
            </div>
          </div>

          <BigCounter value={currentNum} label={currentLabel} />
        </div>
      </Container>
    </Section>
  );
}
