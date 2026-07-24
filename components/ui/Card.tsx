'use client';

import { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gold';
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white border-2 border-accent/30',
      glass: 'glass border border-white/20',
      gold: 'bg-gradient-to-br from-primary/5 to-accent/10 border-2 border-primary/30',
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-2xl p-6 shadow-lg',
          variantClasses[variant],
          hover && 'card-hover',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

// ===== Card Header =====
export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx('mb-4 pb-3 border-b-2 border-dashed border-accent/50', className)}
      {...props}
    >
      {children}
    </div>
  ),
);
CardHeader.displayName = 'CardHeader';

// ===== Card Title =====
export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={clsx('text-xl font-bold text-secondary flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </h3>
  ),
);
CardTitle.displayName = 'CardTitle';

// ===== Card Content =====
export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={clsx('space-y-4', className)} {...props}>
      {children}
    </div>
  ),
);
CardContent.displayName = 'CardContent';
