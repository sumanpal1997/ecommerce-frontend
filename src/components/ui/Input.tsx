import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id: customId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = customId || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 select-none"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
              className,
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-rose-600 animate-fadeIn">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
