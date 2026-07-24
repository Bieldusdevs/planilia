'use client';

import { forwardRef } from 'react';
import { clsx } from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary: 'gold-gradient text-secondary hover:transform hover:-translate-y-0.5 hover:shadow-lg focus:ring-primary',
      secondary: 'gold-gradient-dark text-light hover:transform hover:-translate-y-0.5 hover:shadow-lg focus:ring-secondary',
      outline: 'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-secondary transform hover:-translate-y-0.5 focus:ring-primary',
      ghost: 'text-secondary hover:bg-primary/10 focus:ring-primary',
      danger: 'bg-red-500 text-white hover:bg-red-600 hover:transform hover:-translate-y-0.5 hover:shadow-lg focus:ring-red-500',
      success: 'bg-green-500 text-white hover:bg-green-600 hover:transform hover:-translate-y-0.5 hover:shadow-lg focus:ring-green-500',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600 hover:transform hover:-translate-y-0.5 hover:shadow-lg focus:ring-yellow-500',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-2.5',
      lg: 'px-8 py-3.5 text-lg',
    };

    return (
      <button
        ref={ref}
        className={clsx(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';
