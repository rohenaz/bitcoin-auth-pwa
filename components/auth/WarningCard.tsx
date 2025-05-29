'use client';

import { AUTH_STYLES } from '@/lib/config/auth-styles';

interface WarningCardProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function WarningCard({ 
  title = 'Important',
  message,
  icon,
  className = '' 
}: WarningCardProps) {
  const defaultIcon = (
    <svg className={`${AUTH_STYLES.icon.size.md} ${AUTH_STYLES.text.warning} flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
      <title>Warning</title>
      <path 
        fillRule="evenodd" 
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
        clipRule="evenodd" 
      />
    </svg>
  );

  return (
    <div className={`${AUTH_STYLES.card.base} ${AUTH_STYLES.card.warning} ${className}`}>
      <div className="flex items-start space-x-3">
        {icon || defaultIcon}
        <div className="text-sm">
          <p className={`font-semibold ${AUTH_STYLES.text.warning} mb-1`}>{title}</p>
          <p className={`${AUTH_STYLES.text.warning} opacity-80`}>{message}</p>
        </div>
      </div>
    </div>
  );
}