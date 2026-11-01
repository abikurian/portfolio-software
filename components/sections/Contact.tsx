'use client';

import * as React from 'react';
import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FadeUp } from '@/components/motion/FadeUp';
import { Copy, Check, ArrowUpRight } from 'lucide-react';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const email = 'abikurianvarghese@gmail.com';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy email', err);
    }
  };

  return (
    <Section id="contact" ariaLabelledBy="contact-heading" className="pb-24 sm:pb-36">
      <Container>
        <SectionHeading id="contact-heading" number="05 /" title="CONTACT" />

        <div className="border-t border-border pt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Oversized Email Link */}
          <div className="lg:col-span-8 space-y-6">
            <FadeUp>
              <span className="font-mono text-xs uppercase tracking-widest text-primary block">
                EMAIL DIRECT
              </span>

              <div className="space-y-4">
                <a
                  href={`mailto:${email}`}
                  className="font-anton text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground hover:text-primary transition-colors tracking-tight break-all leading-tight block"
                >
                  {email}
                </a>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-border hover:border-primary text-foreground text-xs font-mono uppercase tracking-wider transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    aria-label="Copy email address to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-primary" />
                        <span className="text-primary font-semibold">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>COPY ADDRESS</span>
                      </>
                    )}
                  </button>

                  <div aria-live="polite" className="sr-only">
                    {copied ? 'Email copied to clipboard' : ''}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border/40 font-mono text-xs text-muted-foreground flex flex-wrap gap-8">
                <div>
                  <span className="block text-foreground/60 uppercase">LOCATION</span>
                  <span>Kochi, Kerala, India</span>
                </div>
                <div>
                  <span className="block text-foreground/60 uppercase">TIMEZONE</span>
                  <span>IST (UTC +05:30)</span>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Right: Channels */}
          <div className="lg:col-span-4 space-y-8">
            <FadeUp delay={0.1}>
              <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-4">
                LINKS
              </span>

              <div className="border-t border-border/60 divide-y divide-border/40 font-mono text-xs">
                <a
                  href="https://linkedin.com/in/abi-kurian-varghese"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 text-foreground hover:text-primary transition-colors group"
                >
                  <span className="uppercase">LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <a
                  href="https://github.com/abikurian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 text-foreground hover:text-primary transition-colors group"
                >
                  <span className="uppercase">GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </Container>
    </Section>
  );
}
