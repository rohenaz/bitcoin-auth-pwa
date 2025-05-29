/**
 * Centralized configuration exports
 * Import all auth-related configurations from this single entry point
 */

// Re-export all configurations
export * from './auth.config';
export * from './auth-styles';
export { AUTH_MESSAGES, getMessage } from '../auth-messages';

// Re-export site config
export { siteConfig } from '@/site.config';

// Combined auth configuration object
import { getAuthConfig } from './auth.config';
import { AUTH_STYLES, authStyles } from './auth-styles';
import { AUTH_MESSAGES, getMessage } from '../auth-messages';
import { siteConfig } from '@/site.config';

export const authConfig = {
  // Configuration
  ...getAuthConfig(),
  
  // Messages
  messages: AUTH_MESSAGES,
  getMessage,
  
  // Styles
  styles: AUTH_STYLES,
  styleHelpers: authStyles,
  
  // Site features
  features: siteConfig.features,
} as const;

// Type exports for convenience
export type AuthConfig = typeof authConfig;
export type AuthTimeConfig = typeof authConfig.time;
export type AuthPasswordConfig = typeof authConfig.password;
export type AuthOAuthConfig = typeof authConfig.oauth;
export type AuthUIConfig = typeof authConfig.ui;
export type AuthMessages = typeof AUTH_MESSAGES;
export type AuthStyles = typeof AUTH_STYLES;