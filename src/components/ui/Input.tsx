'use client';

import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        'w-full px-3 py-2 border border-muted-300 rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500',
        'text-muted-900 placeholder-muted-400',
        'transition-colors duration-200',
        className
      )}
      {...props}
    />
  )
);

Input.displayName = 'Input';

export default Input;
