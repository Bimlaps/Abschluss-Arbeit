import React from 'react';
import clsx from 'clsx';
import { BadgeProps } from '../types';

export const Badge: React.FC<BadgeProps> = ({
  className,
  children,
  variant = 'primary',
  size = 'md',
}) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium';
  
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-0.5 text-sm',
    lg: 'px-3.5 py-1 text-sm',
    xl: 'px-4 py-1 text-base',
  };
  
  const badgeClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );
  
  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};

export default Badge;
