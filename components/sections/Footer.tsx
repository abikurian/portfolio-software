'use client';

import * as React from 'react';
import { Container } from '@/components/ui/Container';
import { useLenis } from '@/components/providers/SmoothScroll';
import { ArrowUp } from 'lucide-react';

export function Footer() {
  const { scrollTo } = useLenis();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-8 bg-background text-xs font-mono text-muted-foreground">
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-foreground">
            &copy; {currentYear} ABI KURIAN VARGHESE
          </span>
          <span className="text-border">/</span>
          <span>KOCHI, KERALA</span>
        </div>

        <div>
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none uppercase"
            aria-label="Back to top of page"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </Container>
    </footer>
  );
}
