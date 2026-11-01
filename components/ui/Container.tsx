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
        'w-full mx-auto px-4 sm:px-6 md:px-8',
        size === 'default' && 'max-w-[1148px]',
        size === 'narrow' && 'max-w-3xl',
        size === 'wide' && 'max-w-7xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

