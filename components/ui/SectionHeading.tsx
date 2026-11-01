import * as React from 'react';
import { cn } from '@/lib/utils';
import { RevealText } from '@/components/motion/RevealText';

export interface SectionHeadingProps {
  id: string;
  number?: string;
  title: string;
  className?: string;
}

export function SectionHeading({
  id,
  number,
  title,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('pb-8 border-b border-border/80 mb-12 sm:mb-16', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id={id}
          className="font-anton text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground"
        >
          <RevealText text={title} as="span" />
        </h2>
        {number && (
          <span className="font-mono text-xs uppercase tracking-widest text-primary shrink-0 select-none">
            {number}
          </span>
        )}
      </div>
    </div>
  );
}
