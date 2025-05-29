'use client';

import { AUTH_STYLES } from '@/lib/config/auth-styles';

interface ErrorDisplayProps {
  error?: string;
  className?: string;
}

export default function ErrorDisplay({ error, className = '' }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className={`${AUTH_STYLES.card.base} ${AUTH_STYLES.card.error} text-sm ${className}`}>
      {error}
    </div>
  );
}