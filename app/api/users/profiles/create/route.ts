import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis } from '@/lib/redis';
import { BAP } from 'bsv-bap';
import { PrivateKey } from '@bsv/sdk';
import { encryptBackup } from 'bitcoin-backup';
import { verifyBitcoinAuth } from '@/lib/auth-middleware';
import type { BapMasterBackup } from 'bitcoin-backup';

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth();
    if (!session?.user?.address || !session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Read body as text first to avoid stream consumption issues
    const bodyText = await request.text();
    
    // Create a new request with the body for auth verification
    const authRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: bodyText
    });
    
    // Verify auth token
    try {
      await verifyBitcoinAuth(authRequest, '/api/users/profiles/create');
    } catch (authError) {
      console.error('Auth verification failed:', authError);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
    
    // Parse the body
    const body = JSON.parse(bodyText);
    const { decryptedBackup, password } = body;
    
    if (!decryptedBackup || !password) {
      console.error('Missing fields:', { hasBackup: !!decryptedBackup, hasPassword: !!password });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate the backup structure
    const backup = decryptedBackup as BapMasterBackup;
    console.log('Backup validation:', {
      hasXprv: !!backup.xprv,
      hasIds: !!backup.ids,
      idsType: typeof backup.ids,
      backupKeys: Object.keys(backup),
      idsLength: backup.ids ? backup.ids.length : 0
    });
    
    if (!backup.xprv || !backup.ids || typeof backup.ids !== 'string') {
      console.error('Invalid backup format - full backup:', JSON.stringify(backup));
      return NextResponse.json(
        { error: 'Invalid backup format' },
        { status: 400 }
      );
    }

    // Create BAP instance and import existing IDs
    const bap = new BAP(backup.xprv);
    bap.importIds(backup.ids);
    
    // Get the primary BAP ID from session
    const primaryBapId = session.user.id;
    
    // Verify user owns this backup by checking if primary ID exists
    const existingIds = bap.listIds();
    if (!existingIds.includes(primaryBapId)) {
      return NextResponse.json(
        { error: 'Unauthorized: backup does not contain your identity' },
        { status: 403 }
      );
    }

    // Create new ID
    const newIdResult = bap.newId();
    const newBapId = newIdResult.identityKey;
    
    // Export updated IDs
    const updatedIds = bap.exportIds();
    
    // Get the new identity's derived key
    const newMaster = bap.getId(newBapId);
    const newMemberBackup = newMaster?.exportMemberBackup();
    
    if (!newMemberBackup?.derivedPrivateKey) {
      throw new Error('Failed to generate new identity keys');
    }
    
    // Get address for the new identity
    const newPubkey = PrivateKey.fromWif(newMemberBackup.derivedPrivateKey).toPublicKey();
    const newAddress = newPubkey.toAddress().toString();
    
    // Update the backup with new IDs
    const updatedBackup: BapMasterBackup = {
      ...backup,
      ids: updatedIds
    };
    
    // Encrypt the updated backup
    const encryptedBackup = await encryptBackup(updatedBackup, password);
    
    // Store the updated backup in Redis (for primary profile)
    const backupKey = `backup:${primaryBapId}`;
    await redis.set(backupKey, encryptedBackup);
    
    // Update backup metadata
    const { Hash, Utils } = await import('@bsv/sdk');
    const { toHex } = Utils;
    const hash = toHex(Hash.sha256(encryptedBackup));
    
    const metadataKey = `${backupKey}:metadata`;
    await redis.set(metadataKey, {
      lastUpdated: new Date().toISOString(),
      profileCount: updatedIds.length,
      hash
    });
    
    // Create address mapping for the new profile
    await redis.set(`addr:${newAddress}`, {
      id: newBapId,
      block: 0 // Unpublished profile
    });
    
    // Note: OAuth mappings point to the primary BAP ID's backup,
    // so updating the primary backup automatically updates all OAuth access
    
    // Return the new profile info
    return NextResponse.json({
      success: true,
      profile: {
        idKey: newBapId,
        address: newAddress,
        index: updatedIds.length - 1
      },
      encryptedBackup
    });
    
  } catch (error) {
    console.error('Profile creation error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}