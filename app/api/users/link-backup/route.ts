import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis, backupKey, oauthKey } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { encryptedBackup, bapId } = await request.json();
    
    if (!encryptedBackup || !bapId) {
      return NextResponse.json({ error: 'encryptedBackup and bapId are required' }, { status: 400 });
    }

    // Store the encrypted backup
    await redis.set(backupKey(bapId), encryptedBackup);

    // If user is OAuth authenticated, create the mapping
    if (session.user.provider && session.user.provider !== 'credentials') {
      // Extract provider account ID from the session user ID
      // OAuth users have ID format: "provider-providerAccountId"
      const parts = session.user.id.split('-');
      if (parts.length >= 2) {
        const provider = parts[0];
        const providerAccountId = parts.slice(1).join('-');
        if (provider && providerAccountId) {
          await redis.set(oauthKey(provider, providerAccountId), bapId);
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Backup linked successfully' 
    });
  } catch (error) {
    console.error('Error linking backup:', error);
    return NextResponse.json(
      { error: 'Failed to link backup' },
      { status: 500 }
    );
  }
}