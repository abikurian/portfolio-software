import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide';
}

export function Container({
  className,
  size = 'default',
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto px-[clamp(1.25rem,4vw,4rem)]',
        size === 'default' && 'max-w-[1440px]',
        size === 'narrow' && 'max-w-4xl',
        size === 'wide' && 'max-w-[1440px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
