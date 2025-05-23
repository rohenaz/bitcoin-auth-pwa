import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis, userKey, bapKey } from '@/lib/redis';
import { verifyBitcoinAuth } from '@/lib/auth-middleware';
import { verifyProfileOwnership } from '@/lib/profile-utils';
import type { BapMasterBackup } from 'bitcoin-backup';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user data
    const userData = await redis.hgetall(userKey(session.user.id));
    
    // Get BAP profile
    const bapProfile = await redis.get(bapKey(session.user.id));
    const profile = bapProfile 
      ? (typeof bapProfile === 'string' ? JSON.parse(bapProfile) : bapProfile)
      : null;
    
    return NextResponse.json({
      alternateName: userData?.displayName || profile?.identity?.alternateName || '',
      image: userData?.avatar || profile?.identity?.image || '',
      description: profile?.identity?.description || ''
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Clone request to read body twice
    const requestClone = request.clone();
    
    // Parse request body first
    const { alternateName, image, description, bapId, address } = await request.json();
    
    // Verify Bitcoin auth token with cloned request
    const authResult = await verifyBitcoinAuth(requestClone, '/api/users/profile');
    
    // Validate inputs
    if (!alternateName || typeof alternateName !== 'string') {
      return NextResponse.json({ error: 'Invalid alternateName' }, { status: 400 });
    }

    if (!bapId || !address) {
      return NextResponse.json({ error: 'Missing profile identifiers' }, { status: 400 });
    }

    // Verify the address matches the auth token
    if (authResult.address !== address) {
      return NextResponse.json({ error: 'Address mismatch with auth token' }, { status: 403 });
    }

    // For multi-profile support: verify the user owns this BAP ID
    // Get the user's decrypted backup from session storage (passed via request)
    const decryptedBackupStr = request.headers.get('X-Decrypted-Backup');
    if (!decryptedBackupStr) {
      // Fall back to checking if it's the primary profile
      if (bapId !== session.user.id) {
        return NextResponse.json({ error: 'Cannot verify profile ownership' }, { status: 403 });
      }
    } else {
      // Verify ownership through backup
      try {
        const backup = JSON.parse(decryptedBackupStr) as BapMasterBackup;
        if (!verifyProfileOwnership(backup, bapId)) {
          return NextResponse.json({ error: 'Unauthorized to update this profile' }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: 'Invalid backup data' }, { status: 400 });
      }
    }
    
    // Update user record
    await redis.hset(userKey(bapId), {
      displayName: alternateName,
      avatar: image || ''
    });
    
    // Update BAP profile
    const existingProfile = await redis.get(bapKey(bapId));
    let profile;
    
    if (existingProfile) {
      // Parse if string, otherwise use as-is
      profile = typeof existingProfile === 'string' 
        ? JSON.parse(existingProfile) 
        : existingProfile;
      profile.identity = {
        ...profile.identity,
        alternateName,
        image: image || undefined,
        description: description || undefined
      };
      // Update current address if different
      profile.currentAddress = address;
    } else {
      // Create new profile if it doesn't exist
      profile = {
        idKey: bapId,
        currentAddress: address,
        identity: {
          '@context': 'https://schema.org',
          '@type': 'Person',
          alternateName,
          image: image || undefined,
          description: description || undefined
        },
        block: 0,
        currentHeight: 0
      };
    }
    
    // Store updated profile
    await redis.set(bapKey(bapId), JSON.stringify(profile));
    
    return NextResponse.json({ 
      success: true,
      profile: {
        alternateName,
        image,
        description
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}