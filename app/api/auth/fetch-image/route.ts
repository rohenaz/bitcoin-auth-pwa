/**
 * OAuth flow for fetching profile images only
 * 
 * This endpoint initiates OAuth authentication specifically for
 * retrieving profile images without affecting the current session
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis } from '@/lib/redis';
import { ENABLED_PROVIDERS, type EnabledProvider } from '@/lib/env';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const providerParam = searchParams.get('provider');
    const returnUrl = searchParams.get('returnUrl') || '/dashboard';
    
    // Must be signed in
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/signin?error=SessionRequired', request.url));
    }
    
    if (!providerParam || !ENABLED_PROVIDERS.includes(providerParam as EnabledProvider)) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }
    
    const provider = providerParam as EnabledProvider;
    
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
    
    // Build OAuth authorization URL using NextAuth's signIn URL
    // This ensures we use the same redirect URI that's configured in Google Console
    const authUrl = new URL('/api/auth/signin/' + provider, request.url);
    authUrl.searchParams.set('callbackUrl', `/dashboard?oauth_image_state=${state}`);
    
    return NextResponse.redirect(authUrl);
    
  } catch (error) {
    console.error('Error initiating OAuth image fetch:', error);
    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
  }
}