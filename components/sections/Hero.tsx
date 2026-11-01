'use client';

import * as React from 'react';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { KineticGrid } from '@/components/ui/kinetic-grid';
import { useLenis } from '@/components/providers/SmoothScroll';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

export function Hero() {
  const { scrollTo } = useLenis();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      if (titleRef.current) {
        const letters = titleRef.current.querySelectorAll('.hero-char');
        tl.fromTo(
          letters,
          { yPercent: 120, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, stagger: 0.02 }
        );
      }

      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          '-=0.5'
        );
      }
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Introduction"
      className="relative min-h-[80vh] flex flex-col justify-center pt-24 md:pt-32 pb-16 border-b border-border/80 overflow-hidden"
    >
      {/* Task 8: Kinetic grid background (pointer-events none, behind content) */}
      <KineticGrid parentRef={heroRef} />

      <Container className="my-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Title on two balanced lines */}
          <div className="lg:col-span-8">
            <h1
              ref={titleRef}
              aria-label="ABI KURIAN VARGHESE"
              className="font-anton uppercase tracking-tight text-[clamp(2.75rem,10vw,8.5rem)] leading-[0.9] text-foreground select-none overflow-hidden"
              style={{ overflowWrap: 'anywhere' }}
            >
              <span className="block overflow-hidden">
                {'ABI KURIAN'.split('').map((char, i) => (
                  <span key={i} className="inline-block overflow-hidden align-top">
                    <span className="hero-char inline-block will-change-transform">
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  </span>
                ))}
              </span>
              <span className="block overflow-hidden">
                {'VARGHESE'.split('').map((char, i) => (
                  <span key={`v-${i}`} className="inline-block overflow-hidden align-top">
                    <span className="hero-char inline-block will-change-transform">
                      {char}
                    </span>
                  </span>
                ))}
              </span>
            </h1>
          </div>

          {/* Role, Subline, CTAs */}
          <div ref={contentRef} className="lg:col-span-4 lg:pt-14 space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary mb-2">
                ROLE
              </p>
              <p className="text-xl sm:text-2xl text-foreground font-medium">
                Full-stack developer
              </p>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed">
              Computer Science student in Kochi. I build offline-first web apps and work with local AI models.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="md"
                onClick={() => scrollTo('#work')}
                className="flex items-center gap-2"
              >
                <span>View work</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => scrollTo('#contact')}
                className="flex items-center gap-2"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
