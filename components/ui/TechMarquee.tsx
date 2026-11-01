'use client';

import * as React from 'react';

const MARQUEE_ITEMS = [
  'JavaScript',
  'TypeScript',
  'Dart',
  'Python',
  'C',
  'SQL',
  'React',
  'Next.js',
  'Astro',
  'Node.js',
  'Tailwind CSS',
  'Supabase',
  'Firebase',
  'MongoDB',
  'MySQL',
  'Ollama',
];

export function TechMarquee() {
  return (
    <div
      aria-label="Technologies"
      className="absolute bottom-0 left-0 right-0 z-20 border-t border-border/60 bg-background/60 backdrop-blur-xs py-2.5 sm:py-3 overflow-hidden select-none"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div className="flex w-max group">
        <div className="flex items-center gap-6 shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {MARQUEE_ITEMS.map((item, i) => (
            <React.Fragment key={i}>
              <span>{item}</span>
              <span className="text-border select-none">&middot;</span>
            </React.Fragment>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="flex items-center gap-6 shrink-0 font-mono text-xs uppercase tracking-wider text-muted-foreground animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:hidden"
        >
          {MARQUEE_ITEMS.map((item, i) => (
            <React.Fragment key={`repeat-${i}`}>
              <span>{item}</span>
              <span className="text-border select-none">&middot;</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
