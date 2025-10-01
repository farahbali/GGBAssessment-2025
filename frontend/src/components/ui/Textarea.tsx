import React, { forwardRef } from 'react';
import { InputProps } from '@/types';
import { cn } from '@/utils';

interface TextareaProps extends Omit<InputProps, 'maxLength'> {
  maxLength?: number;
  rows?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      value,
      onChange,
      placeholder = '',
      error,
      required = false,
      maxLength,
      rows = 4,
      className = '',
      ...props
    },
    ref
  ) => {
    const textareaId = `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
    
    return (
      <div className="space-y-1">
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          rows={rows}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-vertical',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        
        {maxLength && (
          <div className="text-xs text-gray-500 text-right">
            {value.length}/{maxLength}
          </div>
        )}
        
        {error && (
          <p id={`${textareaId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
