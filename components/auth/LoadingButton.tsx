'use client';

import { authStyles } from '@/lib/config/auth-styles';

interface LoadingButtonProps {
  type?: 'button' | 'submit';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  loadingText?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
}

export default function LoadingButton({
  type = 'submit',
  loading = false,
  disabled = false,
  children,
  loadingText,
  onClick,
  className = '',
  variant = 'primary',
}: LoadingButtonProps) {
  const isDisabled = disabled || loading;
  const state = loading ? 'loading' : isDisabled ? 'disabled' : 'default';
  const buttonClasses = authStyles.getButtonClasses(variant, state);

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`${buttonClasses} ${className}`.trim()}
    >
      {loading ? (loadingText || 'Loading...') : children}
    </button>
  );
}