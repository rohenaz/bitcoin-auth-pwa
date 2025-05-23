/**
 * OAuth callback handler for image fetching
 * 
 * Handles the OAuth callback, extracts the profile image,
 * and returns to the profile editor without affecting the session
 */
import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { env, ENABLED_PROVIDERS, type EnabledProvider } from '@/lib/env';

// OAuth provider configurations
const OAUTH_CONFIGS = {
  github: {
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userUrl: 'https://api.github.com/user',
  },
  google: {
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  twitter: {
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    userUrl: 'https://api.twitter.com/2/users/me',
  }
};

function getRedirectUri(provider: string) {
  const baseUrl = env.NEXTAUTH_URL || 'http://localhost:3000';
  return `${baseUrl}/api/auth/fetch-image/callback?provider=${provider}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') as keyof typeof OAUTH_CONFIGS;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Handle OAuth errors (user denied, etc)
    if (error) {
      return NextResponse.redirect(new URL(`/dashboard?error=OAuthDenied`, request.url));
    }
    
    if (!provider || !code || !state || !OAUTH_CONFIGS[provider]) {
      return NextResponse.redirect(new URL('/dashboard?error=MissingParams', request.url));
    }
    
    // Retrieve and validate state
    const stateDataStr = await redis.get(`oauth-image-state:${state}`);
    if (!stateDataStr) {
      return NextResponse.redirect(new URL('/dashboard?error=InvalidState', request.url));
    }
    
    const stateData = JSON.parse(stateDataStr as string);
    await redis.del(`oauth-image-state:${state}`);
    
    // Check if provider is enabled
    if (!ENABLED_PROVIDERS.includes(provider as EnabledProvider)) {
      console.log(`Provider ${provider} is not enabled`);
      return NextResponse.redirect(new URL(`${stateData.returnUrl}?error=ProviderDisabled`, request.url));
    }
    
    const config = OAUTH_CONFIGS[provider];
    let profileImage: string | null = null;
    
    // Exchange code for access token and fetch user data based on provider
    if (provider === 'github') {
      const tokenResponse = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.AUTH_GITHUB_ID,
          client_secret: env.AUTH_GITHUB_SECRET,
          code,
        }),
      });
      
      const tokenData = await tokenResponse.json();
      
      if (tokenData.access_token) {
        const userResponse = await fetch(config.userUrl, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Accept': 'application/json',
          },
        });
        
        const userData = await userResponse.json();
        profileImage = userData.avatar_url;
      }
      
    } else if (provider === 'google') {
      const tokenResponse = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: env.AUTH_GOOGLE_ID,
          client_secret: env.AUTH_GOOGLE_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: getRedirectUri(provider),
        }),
      });
      
      const tokenData = await tokenResponse.json();
      
      if (tokenData.access_token) {
        const userResponse = await fetch(config.userUrl, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });
        
        const userData = await userResponse.json();
        profileImage = userData.picture;
      }
      
    } else if (provider === 'twitter') {
      const auth = Buffer.from(`${env.AUTH_TWITTER_ID}:${env.AUTH_TWITTER_SECRET}`).toString('base64');
      
      const tokenResponse = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          redirect_uri: getRedirectUri(provider),
          code_verifier: 'challenge', // Must match what was sent in authorize
        }),
      });
      
      const tokenData = await tokenResponse.json();
      
      if (tokenData.access_token) {
        const userResponse = await fetch(`${config.userUrl}?user.fields=profile_image_url`, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });
        
        const userData = await userResponse.json();
        profileImage = userData.data?.profile_image_url?.replace('_normal', ''); // Get full size image
      }
    }
    
    if (!profileImage) {
      return NextResponse.redirect(new URL(`${stateData.returnUrl}?error=NoImageFound`, request.url));
    }
    
    // Store the image temporarily for the user to retrieve
    await redis.setex(`oauth-image:${stateData.userId}:${provider}`, 300, profileImage); // 5 min expiry
    
    // Redirect back with success
    return NextResponse.redirect(new URL(`${stateData.returnUrl}?imageProvider=${provider}`, request.url));
    
  } catch (error) {
    console.error('Error in OAuth image callback:', error);
    return NextResponse.redirect(new URL('/dashboard?error=ImageFetchFailed', request.url));
  }
}