import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  ariaLabelledBy?: string;
  bleed?: boolean;
}

export function Section({
  id,
  ariaLabelledBy,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy || `${id}-heading`}
      className={cn(
        'relative w-full py-16 sm:py-24 md:py-32 scroll-mt-20 border-b border-border/80',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
