'use client';

import { AUTH_STYLES } from '@/lib/config/auth-styles';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}

export default function AuthLayout({ title, subtitle, children, className = '' }: AuthLayoutProps) {
  return (
    <div className={`${AUTH_STYLES.layout.container} ${className}`}>
      <div className={`${AUTH_STYLES.layout.maxWidth} ${AUTH_STYLES.layout.spacing}`}>
        <div className={AUTH_STYLES.layout.header}>
          <h1 className={AUTH_STYLES.layout.title}>{title}</h1>
          <p className={AUTH_STYLES.layout.subtitle}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}