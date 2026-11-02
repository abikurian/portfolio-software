'use client';

import * as React from 'react';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { KineticGrid } from '@/components/ui/kinetic-grid';
import { TechMarquee } from '@/components/ui/TechMarquee';
import { useLenis } from '@/components/providers/SmoothScroll';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { IBM_Plex_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { FlowSection } from '@/components/ui/story-scroll';

const ibmPlexSansHeroBtn = IBM_Plex_Sans({
  weight: '500',
  subsets: ['latin'],
  display: 'swap',
});

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
        const lines = titleRef.current.querySelectorAll('.hero-line');
        tl.fromTo(
          lines,
          { yPercent: 110, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power4.out' }
        );
      }

      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.45'
        );
      }
    },
    { scope: heroRef }
  );

  return (
    <FlowSection
      ref={heroRef}
      id="home"
      aria-label="Introduction"
      className="theme-dark bg-background pt-20 sm:pt-24 pb-14 sm:pb-16 border-b border-border/80 justify-center scroll-mt-24"
    >
      {/* Kinetic grid background (pointer-events none, behind content) */}
      <KineticGrid parentRef={heroRef} />

      <Container className="relative z-10 my-auto -translate-y-3 sm:-translate-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* At xl the name block spans columns 1 to 9 at most; below that it spans the full width */}
          <div className="col-span-12 xl:col-span-9">
            <h1
              ref={titleRef}
              aria-label="ABI KURIAN VARGHESE"
              className="font-anton uppercase tracking-tight text-[clamp(2.25rem,8.5vw,8.5rem)] leading-[0.9] text-balance text-left text-foreground select-none overflow-hidden mb-0"
              style={{ overflowWrap: 'anywhere' }}
            >
              <span className="block overflow-hidden">
                <span className="hero-line block will-change-transform">ABI KURIAN</span>
              </span>
              <span className="block overflow-hidden">
                <span className="hero-line block will-change-transform">VARGHESE</span>
              </span>
            </h1>

            {/* Tight inner spacing: name, role, subline and buttons as one cohesive group */}
            <div
              ref={contentRef}
              className="mt-[clamp(0.75rem,1.5vw,1.5rem)] max-w-2xl"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1.5">
                  ROLE
                </p>
                <p className="text-xl sm:text-2xl text-foreground font-medium leading-snug">
                  Full-stack developer
                </p>
              </div>

              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                Computer Science student in Kochi. I build offline-first web apps and work with local AI models.
              </p>

              <div className="mt-[clamp(1.25rem,2.5vw,2rem)] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Button
                  size="md"
                  onClick={() => scrollTo('#work')}
                  className={cn(
                    ibmPlexSansHeroBtn.className,
                    'w-full sm:w-auto normal-case tracking-[0.01em] text-[0.95rem] flex items-center justify-center gap-2 group'
                  )}
                >
                  <span>View work</span>
                  <ArrowDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:group-hover:translate-x-0" />
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  onClick={() => scrollTo('#contact')}
                  className={cn(
                    ibmPlexSansHeroBtn.className,
                    'w-full sm:w-auto normal-case tracking-[0.01em] text-[0.95rem] flex items-center justify-center gap-2 group'
                  )}
                >
                  <span>Get in touch</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:group-hover:translate-x-0" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Tech Marquee pinned to bottom edge per task 5 */}
      <TechMarquee />
    </FlowSection>
  );
}
