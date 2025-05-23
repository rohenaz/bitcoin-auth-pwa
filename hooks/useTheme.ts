import { siteConfig } from '@/site.config';

/**
 * Hook to access theme configuration
 * Can be extended to support dynamic theme switching
 */
export function useTheme() {
  return {
    colors: siteConfig.theme,
    primaryColor: siteConfig.theme.primary,
    backgroundColor: siteConfig.theme.background,
    textColor: siteConfig.theme.text,
  };
}