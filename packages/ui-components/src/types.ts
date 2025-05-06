import { ReactNode } from 'react';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

export interface BaseProps {
  className?: string;
  children?: ReactNode;
}

export interface ButtonProps extends BaseProps {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export interface InputProps extends BaseProps {
  type?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export interface CardProps extends BaseProps {
  title?: string;
  footer?: ReactNode;
}

export interface AlertProps extends BaseProps {
  variant?: Variant;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export interface BadgeProps extends BaseProps {
  variant?: Variant;
  size?: Size;
}

export interface SpinnerProps extends BaseProps {
  size?: Size;
  variant?: Variant;
}
