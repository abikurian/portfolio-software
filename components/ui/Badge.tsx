import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'outline' | 'muted';
}

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-mono tracking-wider uppercase border rounded-none',
        variant === 'default' && 'bg-secondary text-foreground border-border/80',
        variant === 'accent' && 'bg-primary text-primary-foreground border-primary',
        variant === 'outline' && 'border-border text-muted-foreground',
        variant === 'muted' && 'bg-muted/40 text-muted-foreground border-transparent',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
