/**
 * OAuth callback handler for linking providers
 * 
 * Handles the OAuth callback, exchanges the code for user info,
 * and creates the provider mapping without affecting the session.
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis, userKey, bapKey } from '@/lib/redis';
import { env, ENABLED_PROVIDERS, type EnabledProvider } from '@/lib/env';
import { linkOAuthAccount } from '@/lib/oauth-utils';

// OAuth provider configurations (matching the parent route)
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
  return `${baseUrl}/api/auth/link-provider/callback?provider=${provider}`;
}

// Handle OAuth callback
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') as keyof typeof OAUTH_CONFIGS;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Handle OAuth errors (user denied, etc)
    if (error) {
      return NextResponse.redirect(new URL(`/settings?error=OAuthDenied&provider=${provider}`, request.url));
    }
    
    // Must be signed in with credentials
    if (!session?.user?.id || session.user.provider !== 'credentials') {
      return NextResponse.redirect(new URL('/signin?error=SessionExpired', request.url));
    }
    
    // Validate state to prevent CSRF
    const expectedState = await redis.get(`oauth-state:${session.user.id}`);
    if (!state || state !== expectedState) {
      return NextResponse.redirect(new URL('/settings?error=InvalidState', request.url));
    }
    
    // Clean up state
    await redis.del(`oauth-state:${session.user.id}`);
    
    if (!provider || !code || !OAUTH_CONFIGS[provider]) {
      return NextResponse.redirect(new URL('/settings?error=MissingParams', request.url));
    }
    
    // Check if provider is enabled
    if (!ENABLED_PROVIDERS.includes(provider as EnabledProvider)) {
      console.log(`Provider ${provider} is not enabled`);
      return NextResponse.redirect(new URL('/settings?error=ProviderDisabled', request.url));
    }
    
    const config = OAUTH_CONFIGS[provider];
    let providerAccountId: string | null = null;
    let profileData: { name?: string; image?: string; bio?: string } = {};
    
    // Exchange code for access token based on provider
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
        // Get user info
        const userResponse = await fetch(config.userUrl, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Accept': 'application/json',
          },
        });
        
        const userData = await userResponse.json();
        providerAccountId = String(userData.id);
        profileData = {
          name: userData.name || userData.login,
          image: userData.avatar_url,
          bio: userData.bio
        };
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
        // Get user info
        const userResponse = await fetch(config.userUrl, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });
        
        const userData = await userResponse.json();
        providerAccountId = userData.id;
        profileData = {
          name: userData.name,
          image: userData.picture
        };
      }
      
    } else if (provider === 'twitter') {
      // Twitter uses OAuth 2.0 with PKCE
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
        // Get user info
        const userResponse = await fetch(config.userUrl, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });
        
        const userData = await userResponse.json();
        providerAccountId = userData.data?.id;
        profileData = {
          name: userData.data?.name,
          image: userData.data?.profile_image_url?.replace('_normal', ''),
          bio: userData.data?.description
        };
      }
    }
    
    if (!providerAccountId) {
      console.error(`Failed to get provider account ID for ${provider}`);
      return NextResponse.redirect(new URL('/settings?error=OAuthFailed', request.url));
    }
    
    // Create the OAuth mapping
    const linkResult = await linkOAuthAccount(provider, providerAccountId, session.user.id);
    
    if (!linkResult.success && linkResult.error === 'already-linked') {
      console.error(`OAuth account already linked: ${provider}|${providerAccountId} -> ${linkResult.existingBapId}`);
      const redirectUrl = new URL('/settings', request.url);
      redirectUrl.searchParams.set('error', 'OAuthAlreadyLinked');
      redirectUrl.searchParams.set('provider', provider);
      if (linkResult.existingBapId) {
        redirectUrl.searchParams.set('existingBapId', linkResult.existingBapId);
      }
      return NextResponse.redirect(redirectUrl);
    }
    
    // Store the encrypted backup if provided
    const encryptedBackup = await redis.get(`pending-backup:${session.user.id}`);
    if (encryptedBackup) {
      const oauthId = `${provider}|${providerAccountId}`;
      await redis.set(`backup:${oauthId}`, encryptedBackup);
      await redis.del(`pending-backup:${session.user.id}`);
    }
    
    // Import OAuth profile data if user doesn't have any
    try {
      const bapId = session.user.id;
      const uKey = userKey(bapId);
      const fullUserData = await redis.hgetall(uKey) as Record<string, string>;
      
      // Check if we should import profile data
      const shouldImportName = !fullUserData.displayName && profileData.name;
      const shouldImportImage = !fullUserData.avatar && profileData.image;
      
      if (shouldImportName || shouldImportImage) {
        const updates: Record<string, string> = {};
        
        if (shouldImportName && profileData.name) {
          updates.displayName = profileData.name;
        }
        if (shouldImportImage && profileData.image) {
          updates.avatar = profileData.image;
        }
        
        await redis.hset(uKey, updates);
        console.log('✅ Imported OAuth profile data during linking:', { bapId, updates });
      }
      
      // Update BAP profile if needed
      const bKey = bapKey(bapId);
      const existingBapData = await redis.get(bKey);
      
      let bapProfile: { idKey: string; currentAddress: string; identity: { '@context'?: string; '@type'?: string; alternateName?: string; image?: string; description?: string; [key: string]: unknown }; block: number; currentHeight: number };
      if (existingBapData) {
        bapProfile = typeof existingBapData === 'string' 
          ? JSON.parse(existingBapData) 
          : existingBapData;
      } else {
        // Create new BAP profile structure
        bapProfile = {
          idKey: bapId,
          currentAddress: fullUserData.address || '',
          identity: {
            '@context': 'https://schema.org',
            '@type': 'Person'
          },
          block: 0,
          currentHeight: 0
        };
      }
      
      // Check if BAP profile needs updates
      const needsBapUpdate = (!bapProfile.identity?.alternateName && profileData.name) ||
        (!bapProfile.identity?.image && profileData.image) ||
        (!bapProfile.identity?.description && profileData.bio);
      
      if (needsBapUpdate) {
        bapProfile.identity = bapProfile.identity || {};
        
        if (!bapProfile.identity.alternateName && profileData.name) {
          bapProfile.identity.alternateName = profileData.name;
        }
        if (!bapProfile.identity.image && profileData.image) {
          bapProfile.identity.image = profileData.image;
        }
        if (!bapProfile.identity.description && profileData.bio) {
          bapProfile.identity.description = profileData.bio;
        }
        
        await redis.set(bKey, bapProfile);
        console.log('✅ Updated BAP profile with OAuth data during linking:', { bapId, identity: bapProfile.identity });
      }
    } catch (error) {
      console.error('Error importing OAuth profile data during linking:', error);
      // Don't fail the linking if profile import fails
    }
    
    console.log(`Successfully linked ${provider} account ${providerAccountId} to user ${session.user.id}`);
    
    // Redirect back to settings with success
    return NextResponse.redirect(new URL(`/settings?linked=${provider}`, request.url));
    
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    return NextResponse.redirect(new URL('/settings?error=LinkFailed', request.url));
  }
}