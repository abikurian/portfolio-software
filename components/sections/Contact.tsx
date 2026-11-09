'use client';

import * as React from 'react';
import { Container } from '@/components/ui/Container';
import { FlowSection } from '@/components/ui/story-scroll';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FadeUp } from '@/components/motion/FadeUp';
import ContactCards, {
  Monogram,
  LinkedinIcon,
  LinkedinCard,
  type ContributionDay,
} from '@/components/ui/contact-cards';

export interface ContactProps {
  githubDays?: ContributionDay[];
}

export function Contact({ githubDays = [] }: ContactProps = {}) {
  const email = 'abikurianvarghese@gmail.com';

  return (
    <FlowSection
      id="contact"
      aria-labelledby="contact-heading"
      className="theme-lemon bg-background border-t border-border py-16 sm:py-24 md:py-32 justify-center pb-[calc(6rem+env(safe-area-inset-bottom,0px))] sm:pb-36"
    >
      <Container>
        <SectionHeading id="contact-heading" title="CONTACT" />

        <div className="border-t border-border pt-10">
          <FadeUp>
            <span className="font-mono text-xs uppercase tracking-widest text-primary block">
              EMAIL DIRECT
            </span>

            <div className="mt-4">
              <a
                href={`mailto:${email}`}
                className="font-anton text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground hover:text-primary transition-colors duration-150 tracking-tight break-all leading-tight block focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
              >
                {email}
              </a>
            </div>

            <div className="mt-[clamp(1.5rem,3vw,2.5rem)]">
              <ContactCards
                email={email}
                github={{
                  username: 'abikurian',
                  url: 'https://github.com/abikurian',
                  days: githubDays,
                  avatar: <Monogram className="size-9 shrink-0" />,
                }}
                links={[
                  {
                    label: 'LinkedIn',
                    href: 'https://linkedin.com/in/abi-kurian-varghese',
                    icon: <LinkedinIcon className="size-5 fill-current" />,
                    card: (
                      <LinkedinCard
                        name="Abi Kurian Varghese"
                        title="Computer Science student · Full-stack developer"
                        avatar={<Monogram className="size-10 shrink-0" />}
                      />
                    ),
                  },
                ]}
                labels={{
                  copy: 'Copy my email',
                  copied: 'Email copied',
                  contributions: 'contributions in the last year',
                }}
              />
            </div>
          </FadeUp>
        </div>
      </Container>
    </FlowSection>
  );
}
