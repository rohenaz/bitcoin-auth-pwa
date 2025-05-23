// Enabled OAuth providers - controls which env vars are required
export const ENABLED_PROVIDERS = ['google', 'github'] as const; // Add 'twitter' when their API is working
export type EnabledProvider = typeof ENABLED_PROVIDERS[number];

type Env = {
  // Always required
  BAP_API_URL: string
  AUTH_SECRET: string
  
  // OAuth providers - required based on ENABLED_PROVIDERS
  AUTH_GOOGLE_ID: string
  AUTH_GOOGLE_SECRET: string
  AUTH_GITHUB_ID: string
  AUTH_GITHUB_SECRET: string
  AUTH_TWITTER_ID: string
  AUTH_TWITTER_SECRET: string
  
  // Optional
  NEXTAUTH_URL?: string
}

// Build env object with defaults
const env: Env = {
  // Required
  BAP_API_URL: process.env.BAP_API_URL ?? 'https://api.sigmaidentity.com/v1',
  AUTH_SECRET: process.env.AUTH_SECRET ?? '',
  
  // OAuth - will validate these based on ENABLED_PROVIDERS
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID ?? '',
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET ?? '',
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID ?? '',
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET ?? '',
  AUTH_TWITTER_ID: process.env.AUTH_TWITTER_ID ?? '',
  AUTH_TWITTER_SECRET: process.env.AUTH_TWITTER_SECRET ?? '',
  
  // Optional
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
}

// Validate required env vars
const requiredVars: string[] = ['AUTH_SECRET'];

// Add OAuth provider requirements based on ENABLED_PROVIDERS
for (const provider of ENABLED_PROVIDERS) {
  const upperProvider = provider.toUpperCase();
  requiredVars.push(`AUTH_${upperProvider}_ID`, `AUTH_${upperProvider}_SECRET`);
}

// Check all required vars
const missingVars: string[] = [];
for (const varName of requiredVars) {
  if (!env[varName as keyof Env]) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

export { env }
