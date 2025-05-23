/**
 * Custom OAuth linking flow that doesn't create new sessions
 * 
 * This endpoint initiates OAuth authentication for linking providers
 * to existing Bitcoin-authenticated accounts. Unlike NextAuth's default
 * behavior, this maintains the current credentials session.
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis } from '@/lib/redis';
import { env, ENABLED_PROVIDERS, type EnabledProvider } from '@/lib/env';
import { OAUTH_PROVIDERS, getOAuthConfig } from '@/lib/oauth-config';
import crypto from 'crypto';

function getRedirectUri(provider: string) {
  const baseUrl = env.NEXTAUTH_URL || 'http://localhost:3000';
  return `${baseUrl}/api/auth/link-provider/callback?provider=${provider}`;
}

// Generate OAuth authorization URL
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') as keyof typeof OAUTH_PROVIDERS;
    
    // Must be signed in with credentials to link providers
    if (!session?.user?.id || session.user.provider !== 'credentials') {
      return NextResponse.redirect(new URL('/settings?error=CredentialsRequired', request.url));
    }
    
    if (!provider || !OAUTH_PROVIDERS[provider]) {
      return NextResponse.redirect(new URL('/settings?error=InvalidProvider', request.url));
    }
    
    // Check if provider is enabled
    if (!ENABLED_PROVIDERS.includes(provider as EnabledProvider)) {
      console.log(`Provider ${provider} is not enabled`);
      return NextResponse.redirect(new URL('/settings?error=ProviderDisabled', request.url));
    }
    
    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');
    await redis.setex(`oauth-state:${session.user.id}`, 600, state); // 10 min expiry
    
    // Store any pending data we need after OAuth
    const encryptedBackup = searchParams.get('backup');
    if (encryptedBackup) {
      await redis.setex(`pending-backup:${session.user.id}`, 600, encryptedBackup);
    }
    
    // Build OAuth authorization URL
    const config = getOAuthConfig(provider);
    const params = new URLSearchParams({
      response_type: 'code',
      scope: config.scope,
      state,
      redirect_uri: getRedirectUri(provider),
      client_id: config.clientId,
    });
    
    // Provider-specific parameters
    if (provider === 'google') {
      params.set('access_type', 'offline');
      params.set('prompt', 'consent');
    } else if (provider === 'twitter') {
      params.set('code_challenge', 'challenge'); // Twitter requires PKCE
      params.set('code_challenge_method', 'plain');
    }
    
    return NextResponse.redirect(`${config.authUrl}?${params}`);
    
  } catch (error) {
    console.error('Error initiating OAuth link:', error);
    return NextResponse.redirect(new URL('/settings?error=LinkInitFailed', request.url));
  }
}