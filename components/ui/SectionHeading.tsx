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
  title,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('pb-8 border-b border-border/80 mb-12 sm:mb-16', className)}>
      <h2
        id={id}
        className="font-header font-normal text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-foreground"
      >
        <RevealText text={title} as="span" />
      </h2>
    </div>
  );
}
