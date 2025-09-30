import React, { forwardRef } from 'react';
import { InputProps } from '@/types';
import { cn } from '@/utils';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      value,
      onChange,
      placeholder = '',
      error,
      required = false,
      maxLength,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <input
          ref={ref}
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        
        {maxLength && (
          <div className="text-xs text-gray-500 text-right">
            {value.length}/{maxLength}
          </div>
        )}
        
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
