/**
 * OAuth flow for fetching profile images only
 * 
 * This endpoint initiates OAuth authentication specifically for
 * retrieving profile images without affecting the current session
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis } from '@/lib/redis';
import { env, ENABLED_PROVIDERS, type EnabledProvider } from '@/lib/env';
import { getOAuthConfig } from '@/lib/oauth-config';
import crypto from 'crypto';

function getRedirectUri(provider: string) {
  const baseUrl = env.NEXTAUTH_URL || 'http://localhost:3000';
  return `${baseUrl}/api/auth/fetch-image/callback?provider=${provider}`;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') as keyof typeof ENABLED_PROVIDERS;
    const returnUrl = searchParams.get('returnUrl') || '/dashboard';
    
    // Must be signed in
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/signin?error=SessionRequired', request.url));
    }
    
    if (!provider || !ENABLED_PROVIDERS.includes(provider as EnabledProvider)) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }
    
    // Generate state for CSRF protection and to store context
    const state = crypto.randomBytes(32).toString('hex');
    const stateData = {
      userId: session.user.id,
      provider,
      returnUrl,
      purpose: 'fetch-image'
    };
    
    // Store state data temporarily (10 min expiry)
    await redis.setex(`oauth-image-state:${state}`, 600, JSON.stringify(stateData));
    
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
      params.set('access_type', 'online'); // We don't need refresh tokens
      params.set('prompt', 'select_account'); // Allow user to choose account
    } else if (provider === 'twitter') {
      params.set('code_challenge', 'challenge'); // Twitter requires PKCE
      params.set('code_challenge_method', 'plain');
    }
    
    return NextResponse.redirect(`${config.authUrl}?${params}`);
    
  } catch (error) {
    console.error('Error initiating OAuth image fetch:', error);
    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
  }
}