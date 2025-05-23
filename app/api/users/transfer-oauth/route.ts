import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis, backupKey, oauthKey } from '@/lib/redis';
import { decryptBackup, type BapMasterBackup } from 'bitcoin-backup';
import { extractIdentityFromBackup } from '@/lib/bap-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { provider, fromBapId, toBapId, verificationPassword } = await request.json();
    
    if (!provider || !fromBapId || !toBapId || !verificationPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Verify the current user owns the target account
    if (session.user.id !== toBapId) {
      return NextResponse.json({ error: 'Unauthorized to transfer to this account' }, { status: 403 });
    }
    
    // Fetch the backup for the source account
    const encryptedBackup = await redis.get(backupKey(fromBapId));
    if (!encryptedBackup) {
      return NextResponse.json({ error: 'Source account backup not found' }, { status: 404 });
    }
    
    // Verify ownership by decrypting the backup
    try {
      const decrypted = await decryptBackup(encryptedBackup as string, verificationPassword) as BapMasterBackup;
      if (!decrypted || !decrypted.xprv) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
      
      // Extract identity and verify it matches
      const identity = extractIdentityFromBackup(decrypted);
      if (identity.id !== fromBapId) {
        return NextResponse.json({ error: 'Identity verification failed' }, { status: 403 });
      }
    } catch (err) {
      console.error('Decryption failed:', err);
      return NextResponse.json({ error: 'Invalid password or corrupted backup' }, { status: 401 });
    }
    
    // Get the OAuth mapping
    const providerMapping = await redis.keys(`oauth:${provider}:*`);
    let providerAccountId: string | null = null;
    
    // Find the provider account ID that maps to fromBapId
    for (const key of providerMapping) {
      const mappedBapId = await redis.get(key);
      if (mappedBapId === fromBapId) {
        // Extract provider account ID from key
        const parts = key.split(':');
        if (parts.length >= 3) {
          providerAccountId = parts.slice(2).join(':');
          break;
        }
      }
    }
    
    if (!providerAccountId) {
      return NextResponse.json({ 
        error: `No ${provider} account linked to source identity` 
      }, { status: 404 });
    }
    
    // Transfer the OAuth link
    await redis.set(oauthKey(provider, providerAccountId), toBapId);
    
    // Also update the backup storage key if it exists
    const oauthBackupKey = `backup:${provider}|${providerAccountId}`;
    const oauthBackup = await redis.get(oauthBackupKey);
    if (oauthBackup) {
      // Update to point to new account's backup
      const newBackup = await redis.get(backupKey(toBapId));
      if (newBackup) {
        await redis.set(oauthBackupKey, newBackup);
      }
    }
    
    console.log(`Transferred ${provider} link from ${fromBapId} to ${toBapId}`);
    
    return NextResponse.json({ 
      success: true,
      message: `Successfully transferred ${provider} link`
    });
  } catch (error) {
    console.error('Error transferring OAuth:', error);
    return NextResponse.json({ error: 'Failed to transfer OAuth link' }, { status: 500 });
  }
}