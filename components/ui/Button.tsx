import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer border',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground border-primary hover:bg-transparent hover:text-primary transition-all duration-150',
        outline:
          'border-border bg-transparent text-foreground hover:border-foreground transition-all duration-150',
        ghost:
          'border-transparent text-muted-foreground hover:text-foreground',
        link:
          'border-transparent text-foreground underline-offset-4 hover:underline hover:text-primary p-0 h-auto',
      },
      size: {
        sm: 'h-8 px-3',
        md: 'min-h-10 px-5 py-2.5',
        lg: 'min-h-12 px-7 py-3',
        icon: 'h-10 w-10',
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
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
