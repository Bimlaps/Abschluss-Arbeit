import React from 'react';
import clsx from 'clsx';
import { CardProps } from '../types';

export const Card: React.FC<CardProps> = ({
  className,
  children,
  title,
  footer,
}) => {
  const baseClasses = 'bg-white shadow rounded-lg overflow-hidden';
  
  const cardClasses = clsx(
    baseClasses,
    className
  );
  
  return (
    <div className={cardClasses}>
      {title && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
        </div>
      )}
      
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
