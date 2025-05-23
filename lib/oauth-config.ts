import { env, type EnabledProvider } from './env';

export interface OAuthProviderConfig {
  name: string;
  icon: string;
  authUrl: string;
  tokenUrl: string;
  userUrl: string;
  scope: string;
  clientId: string;
  clientSecret: string;
}

/**
 * OAuth provider configurations
 */
export const OAUTH_PROVIDERS: Record<EnabledProvider | 'twitter', Omit<OAuthProviderConfig, 'clientId' | 'clientSecret'>> = {
  github: {
    name: 'GitHub',
    icon: '🔗',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userUrl: 'https://api.github.com/user',
    scope: 'read:user user:email',
  },
  google: {
    name: 'Google',
    icon: '🔗',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile',
  },
  twitter: {
    name: 'X (Twitter)',
    icon: '🔗',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    userUrl: 'https://api.twitter.com/2/users/me',
    scope: 'users.read tweet.read offline.access',
  }
};

/**
 * Get OAuth provider config with credentials
 */
export function getOAuthConfig(provider: EnabledProvider | 'twitter'): OAuthProviderConfig {
  const config = OAUTH_PROVIDERS[provider];
  
  if (!config) {
    throw new Error(`Unknown OAuth provider: ${provider}`);
  }
  
  const upperProvider = provider.toUpperCase();
  const clientId = env[`AUTH_${upperProvider}_ID` as keyof typeof env] as string;
  const clientSecret = env[`AUTH_${upperProvider}_SECRET` as keyof typeof env] as string;
  
  return {
    ...config,
    clientId,
    clientSecret
  };
}