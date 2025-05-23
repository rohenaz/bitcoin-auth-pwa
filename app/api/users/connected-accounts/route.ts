import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { auth } from '@/lib/auth-helpers';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const providers = ['google', 'github', 'twitter'];
    const connectedAccounts = [];

    // Check each provider to see if there's a stored OAuth mapping
    for (const provider of providers) {
      // For OAuth-authenticated users, check if they came in via this provider
      if (session.user.provider === provider) {
        connectedAccounts.push({
          provider,
          providerAccountId: session.user.id,
          connected: true
        });
      } else {
        // Check if there's a backup linked to this provider
        // We need to scan for any OAuth keys that map to this user's BAP ID
        const pattern = `oauth:${provider}:*`;
        const keys = await redis.keys(pattern);
        
        let isConnected = false;
        for (const key of keys) {
          const bapId = await redis.get(key);
          if (bapId === session.user.id) {
            isConnected = true;
            break;
          }
        }
        
        if (isConnected) {
          connectedAccounts.push({
            provider,
            providerAccountId: 'linked',
            connected: true
          });
        }
      }
    }

    return NextResponse.json(connectedAccounts);
  } catch (error) {
    console.error('Error fetching connected accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connected accounts' },
      { status: 500 }
    );
  }
}