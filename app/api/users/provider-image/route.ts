import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redis } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const provider = searchParams.get('provider');

    if (!provider || !['google', 'github', 'twitter'].includes(provider)) {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    console.log(`[provider-image] Fetching ${provider} image for user ${session.user.id}`);
    console.log(`[provider-image] Session provider: ${session.user.provider}, has image: ${!!session.user.image}`);

    // For OAuth sessions, check if current session is from this provider
    if (session.user.provider === provider && session.user.image) {
      console.log(`[provider-image] Returning session image: ${session.user.image}`);
      return NextResponse.json({ image: session.user.image });
    }

    // For credentials sessions with linked OAuth, look up stored OAuth data
    // First check if user has avatar stored
    const userKey = `user:${session.user.id}`;
    const userData = await redis.hgetall(userKey) as Record<string, string>;
    
    console.log(`[provider-image] User data avatar: ${userData?.avatar}`);
    
    // Check if there's a stored avatar that matches the provider pattern
    // Google images typically come from googleusercontent.com or lh3.googleusercontent.com
    if (userData?.avatar) {
      if (provider === 'google' && (userData.avatar.includes('googleusercontent.com') || userData.avatar.includes('google.com'))) {
        console.log(`[provider-image] Found Google avatar in user data: ${userData.avatar}`);
        return NextResponse.json({ image: userData.avatar });
      } else if (provider === 'github' && userData.avatar.includes('github')) {
        console.log(`[provider-image] Found GitHub avatar in user data: ${userData.avatar}`);
        return NextResponse.json({ image: userData.avatar });
      }
    }

    // Check BAP profile for any stored image
    const bapProfileKey = `bap:${session.user.id}`;
    const bapProfile = await redis.get(bapProfileKey);
    if (bapProfile) {
      const profile = typeof bapProfile === 'string' ? JSON.parse(bapProfile) : bapProfile;
      if (profile?.identity?.image) {
        // Check if the stored image matches the provider
        if (provider === 'google' && (profile.identity.image.includes('googleusercontent.com') || profile.identity.image.includes('google.com'))) {
          return NextResponse.json({ image: profile.identity.image });
        } else if (provider === 'github' && profile.identity.image.includes('github')) {
          return NextResponse.json({ image: profile.identity.image });
        }
      }
    }

    // Otherwise, try to find linked OAuth accounts
    // Get all OAuth mappings for this provider
    const oauthPattern = `oauth:${provider}:*`;
    const oauthKeys = await redis.keys(oauthPattern);
    
    for (const key of oauthKeys) {
      const bapId = await redis.get(key);
      if (bapId === session.user.id) {
        // Found the OAuth account linked to this user
        // For GitHub, we can construct the avatar URL
        if (provider === 'github') {
          const providerAccountId = key.split(':')[2];
          // GitHub users API to get avatar
          try {
            const response = await fetch(`https://api.github.com/user/${providerAccountId}`);
            if (response.ok) {
              const data = await response.json();
              return NextResponse.json({ image: data.avatar_url });
            }
          } catch (error) {
            console.error('Error fetching GitHub user:', error);
          }
        }
        
        // For Google, check if we have the image stored during OAuth flow
        // Since Google requires OAuth to get user info, we rely on stored data
        break;
      }
    }

    return NextResponse.json({ image: null });
  } catch (error) {
    console.error('Error fetching provider image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}