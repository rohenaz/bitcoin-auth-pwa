import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { provider } = await request.json();
    
    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    // Don't allow disconnecting the current session provider
    if (session.user.provider === provider) {
      return NextResponse.json(
        { error: 'Cannot disconnect the provider you are currently signed in with' },
        { status: 400 }
      );
    }

    // Find and remove the OAuth mapping for this provider
    const pattern = `oauth:${provider}:*`;
    const keys = await redis.keys(pattern);
    
    for (const key of keys) {
      const bapId = await redis.get(key);
      if (bapId === session.user.id) {
        await redis.del(key);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting account:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}