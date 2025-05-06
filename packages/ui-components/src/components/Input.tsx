import React from 'react';
import clsx from 'clsx';
import { InputProps } from '../types';

export const Input: React.FC<InputProps> = ({
  className,
  type = 'text',
  name,
  value,
  placeholder,
  disabled = false,
  required = false,
  error,
  onChange,
  onBlur,
}) => {
  const baseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm';
  
  const stateClasses = error
    ? 'border-red-300 text-red-900 placeholder-red-300'
    : 'border-gray-300 placeholder-gray-400';
  
  const disabledClass = disabled ? 'bg-gray-100 cursor-not-allowed' : '';
  
  const inputClasses = clsx(
    baseClasses,
    stateClasses,
    disabledClass,
    className
  );
  
  return (
    <div>
      <input
        type={type}
        name={name}
        value={value}
        className={inputClasses}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
