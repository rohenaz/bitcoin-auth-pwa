type Env = {
  AUTH_GOOGLE_ID?: string
  AUTH_GOOGLE_SECRET?: string
  AUTH_GITHUB_ID?: string
  AUTH_GITHUB_SECRET?: string
  AUTH_TWITTER_ID?: string
  AUTH_TWITTER_SECRET?: string
  BAP_API_URL: string
  AUTH_SECRET: string
}

const env: Env = {
  AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
  AUTH_TWITTER_ID: process.env.AUTH_TWITTER_ID,
  AUTH_TWITTER_SECRET: process.env.AUTH_TWITTER_SECRET,
  BAP_API_URL: process.env.BAP_API_URL ?? 'https://api.sigmaidentity.com/v1',
  AUTH_SECRET: process.env.AUTH_SECRET ?? '',
}

// Only require AUTH_SECRET and BAP_API_URL
if (!env.AUTH_SECRET) {
  throw new Error('Missing required environment variable: AUTH_SECRET');
}

export { env }
