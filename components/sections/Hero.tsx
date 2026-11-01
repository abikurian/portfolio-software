'use client';

import * as React from 'react';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { KineticGrid } from '@/components/ui/kinetic-grid';
import { useLenis } from '@/components/providers/SmoothScroll';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { IBM_Plex_Sans } from 'next/font/google';
import { cn } from '@/lib/utils';

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
      className="relative min-h-screen min-h-svh flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 border-b border-border/80 overflow-hidden"
    >
      {/* Kinetic grid background (pointer-events none, behind content) */}
      <KineticGrid parentRef={heroRef} />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-[clamp(1rem,2vw,2rem)]">
          {/* Title on two balanced lines spanning width */}
          <div className="col-span-12">
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

          {/* Role, Subline, CTAs sit in a tighter column group beneath it, aligned to the same grid */}
          <div ref={contentRef} className="col-span-12 lg:col-span-7 xl:col-span-6 space-y-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-primary mb-1.5">
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
                className={cn(
                  ibmPlexSansHeroBtn.className,
                  'normal-case tracking-[0.01em] text-[0.95rem] flex items-center gap-2 group'
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
                  'normal-case tracking-[0.01em] text-[0.95rem] flex items-center gap-2 group'
                )}
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:group-hover:translate-x-0" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
