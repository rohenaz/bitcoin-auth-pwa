import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { decryptBackup } from 'bitcoin-backup';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password required' }, { status: 400 });
    }

    // Check if token exists
    const tokenData = await redis.get(`member-export:${token}`);
    if (!tokenData) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 404 });
    }

    const { bapId, createdBy } = JSON.parse(tokenData as string);
    
    // Get the encrypted backup for the user who created this token
    const encryptedBackup = await redis.get(`backup:${createdBy}`);
    if (!encryptedBackup) {
      return NextResponse.json({ error: 'No backup found' }, { status: 404 });
    }

    // Validate password by trying to decrypt
    try {
      const decrypted = await decryptBackup(JSON.parse(encryptedBackup as string), password);
      
      // Verify it's a master backup
      if (!('mnemonic' in decrypted && 'xprv' in decrypted)) {
        return NextResponse.json({ error: 'Invalid backup format' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Delete the token after successful validation
    await redis.del(`member-export:${token}`);

    return NextResponse.json({ 
      encryptedBackup,
      bapId 
    });
  } catch (error) {
    console.error('Member export download error:', error);
    return NextResponse.json(
      { error: 'Failed to process export' },
      { status: 500 }
    );
  }
}