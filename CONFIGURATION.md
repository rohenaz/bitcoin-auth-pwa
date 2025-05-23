# Configuration Guide

This guide explains how to customize your Bitcoin Auth PWA instance.

## Site Configuration

All site-wide configuration is centralized in `site.config.ts`. This file controls:

### Branding
- Site name and short name
- Description and tagline
- Logo paths (light/dark variants)
- Theme colors

### SEO
- Page titles and templates
- Meta descriptions
- Open Graph settings
- Twitter card configuration
- Keywords

### Features
Enable/disable features:
- `multiProfile`: Multiple BAP profiles per user
- `oauthBackup`: OAuth provider backup functionality
- `localBackup`: Local backup export/import
- `deviceLinking`: Cross-device identity (coming soon)
- `bapIntegration`: Bitcoin Attestation Protocol integration

### OAuth Providers
Configure which OAuth providers are available:
```typescript
oauth: {
  providers: {
    google: { enabled: true },
    github: { enabled: true },
    twitter: { enabled: false }
  }
}
```

## Environment Variables

Create a `.env.local` file with:

```bash
# Core (Required)
AUTH_SECRET=your-32-char-secret  # Generate: openssl rand -base64 32
AUTH_URL=http://localhost:3000   # Your app URL

# OAuth Providers (Required for each enabled provider)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
AUTH_TWITTER_ID=your-twitter-client-id
AUTH_TWITTER_SECRET=your-twitter-client-secret

# Optional
BAP_API_URL=https://sigmaidentity.com/api
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

## Vercel Deployment

When deploying to Vercel:

1. Vercel KV is automatically provisioned (provides Redis storage)
2. Set environment variables in Vercel dashboard
3. OAuth redirect URIs must use your production domain

## PWA Configuration

### Icons
Place your app icons in `/public/icons/` with these sizes:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

### Manifest
The PWA manifest is automatically generated from site config.

## Customization Examples

### Change Brand Colors
Edit `site.config.ts`:
```typescript
theme: {
  primary: '#your-color',
  primaryDark: '#your-darker-color',
  // ... other colors
}
```

### Add Footer Links
```typescript
footer: {
  links: [
    { title: 'Your Link', href: 'https://your-url.com' }
  ]
}
```

### Disable OAuth Provider
```typescript
oauth: {
  providers: {
    twitter: { enabled: false }
  }
}
```

## React Query Configuration

Data fetching behavior can be adjusted in `app/providers.tsx`:
- `staleTime`: How long data is considered fresh
- `gcTime`: How long to keep data in cache
- `retry`: Number of retry attempts
- `refetchOnWindowFocus`: Refetch when window regains focus