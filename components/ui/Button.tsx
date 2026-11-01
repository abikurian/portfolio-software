'use client';

import * as React from 'react';
import { useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { gsap } from '@/lib/gsap';

export const buttonVariants = cva(
  'group relative inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider select-none cursor-pointer border overflow-hidden transition-all duration-[120ms] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 motion-reduce:active:scale-100 motion-reduce:transition-none',
  {
    variants: {
      variant: {
        primary:
          'border-primary text-primary hover:text-primary-foreground bg-transparent before:content-[\'\'] before:absolute before:inset-0 before:bg-primary before:origin-left before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300 before:ease-out before:-z-10 motion-reduce:before:hidden motion-reduce:hover:bg-primary motion-reduce:hover:text-primary-foreground',
        outline:
          'border-border text-foreground hover:text-primary-foreground bg-transparent before:content-[\'\'] before:absolute before:inset-0 before:bg-primary before:origin-left before:scale-x-0 hover:before:scale-x-100 before:transition-transform before:duration-300 before:ease-out before:-z-10 hover:border-primary motion-reduce:before:hidden motion-reduce:hover:bg-primary motion-reduce:hover:text-primary-foreground',
        ghost:
          'border-transparent text-muted-foreground hover:text-foreground',
        link:
          'border-transparent text-foreground underline-offset-4 hover:underline hover:text-primary p-0 h-auto',
      },
      size: {
        sm: 'min-h-[44px] px-4 py-2',
        md: 'min-h-[44px] px-5 py-2.5',
        lg: 'min-h-[48px] px-7 py-3',
        icon: 'min-h-[44px] min-w-[44px] h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  magnetic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size, magnetic = true, children, ...props }, forwardedRef) => {
    const innerRef = useRef<HTMLButtonElement>(null);
    const resolvedRef = (forwardedRef as React.RefObject<HTMLButtonElement | null>) || innerRef;

    useEffect(() => {
      const el = resolvedRef.current;
      if (!el || !magnetic || variant !== 'primary') return;

      const isFinePointer =
        window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(pointer: coarse)').matches;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!isFinePointer || prefersReduced) return;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power3.out' });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const maxRadius = Math.max(rect.width, rect.height) / 2 + 40;
        if (dist < maxRadius) {
          const pull = 0.15;
          xTo(Math.max(-8, Math.min(8, dx * pull)));
          yTo(Math.max(-8, Math.min(8, dy * pull)));
        } else {
          xTo(0);
          yTo(0);
        }
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      window.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
        xTo(0);
        yTo(0);
      };
    }, [magnetic, variant, resolvedRef]);

    return (
      <button
        ref={resolvedRef}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
