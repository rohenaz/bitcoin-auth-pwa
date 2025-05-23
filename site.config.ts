/**
 * Site configuration for branding, SEO, and customization
 * Update these values to customize your Bitcoin Auth PWA instance
 */

export const siteConfig = {
  // Basic site information
  name: 'Bitcoin Auth PWA',
  shortName: 'BitAuth',
  description: 'Self-custodial Bitcoin authentication where your keys are your identity',
  tagline: 'Your Keys, Your Identity',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://bitcoin-auth.com',
  
  // Branding
  logo: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
    alt: 'Bitcoin Auth Logo'
  },
  
  // Theme colors (can be overridden by Tailwind config)
  theme: {
    primary: '#f97316', // orange-500
    primaryDark: '#ea580c', // orange-600
    secondary: '#3b82f6', // blue-500
    background: '#000000',
    surface: '#111111',
    text: '#ffffff',
    textMuted: '#9ca3af', // gray-400
    border: '#1f2937', // gray-800
    error: '#dc2626', // red-600
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
  },
  
  // SEO defaults
  seo: {
    title: 'Bitcoin Auth PWA - Self-Custodial Authentication',
    titleTemplate: '%s | Bitcoin Auth PWA',
    description: 'Revolutionary self-custodial authentication where Bitcoin keypairs ARE your identity. No passwords, no usernames - just cryptographic proof.',
    keywords: [
      'bitcoin authentication',
      'self-custodial auth',
      'bitcoin identity',
      'BAP protocol',
      'decentralized authentication',
      'passwordless login',
      'bitcoin wallet auth',
      'cryptographic identity'
    ],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'Bitcoin Auth PWA',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Bitcoin Auth PWA'
        }
      ]
    },
    twitter: {
      handle: '@bitcoinauth',
      site: '@bitcoinauth',
      cardType: 'summary_large_image',
    }
  },
  
  // Features configuration
  features: {
    multiProfile: true,
    oauthBackup: true,
    localBackup: true,
    deviceLinking: false, // Coming soon
    bapIntegration: true,
  },
  
  // OAuth providers configuration (actual keys in env vars)
  oauth: {
    providers: {
      google: {
        name: 'Google',
        icon: '🔗',
        enabled: true
      },
      github: {
        name: 'GitHub', 
        icon: '🔗',
        enabled: true
      },
      twitter: {
        name: 'X (Twitter)',
        icon: '🔗',
        enabled: false // Temporarily disabled
      }
    }
  },
  
  // Footer links
  footer: {
    links: [
      {
        title: 'Documentation',
        href: 'https://github.com/your-org/bitcoin-auth-pwa/wiki'
      },
      {
        title: 'GitHub',
        href: 'https://github.com/your-org/bitcoin-auth-pwa'
      },
      {
        title: 'BAP Protocol',
        href: 'https://bap.network'
      }
    ],
    copyright: `© ${new Date().getFullYear()} Bitcoin Auth PWA. All rights reserved.`
  },
  
  // Analytics (optional)
  analytics: {
    // Google Analytics, Plausible, etc.
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  },
  
  // PWA configuration
  pwa: {
    name: 'Bitcoin Auth PWA',
    shortName: 'BitAuth',
    description: 'Self-custodial Bitcoin authentication',
    themeColor: '#000000',
    backgroundColor: '#000000',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    startUrl: '/',
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
} as const;

export type SiteConfig = typeof siteConfig;