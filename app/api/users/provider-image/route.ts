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

    // For OAuth sessions, check if current session is from this provider
    if (session.user.provider === provider && session.user.image) {
      return NextResponse.json({ image: session.user.image });
    }

    // For credentials sessions with linked OAuth, look up stored OAuth data
    // First check if user has avatar stored
    const userKey = `user:${session.user.id}`;
    const userData = await redis.hgetall(userKey) as Record<string, string>;
    
    // If user has avatar stored from OAuth import, return it
    if (userData?.avatar) {
      return NextResponse.json({ image: userData.avatar });
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
        
        // For Google/Twitter, we'd need to use their APIs with proper auth
        // For now, return null as we don't have stored images
        break;
      }
    }

    return NextResponse.json({ image: null });
  } catch (error) {
    console.error('Error fetching provider image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}