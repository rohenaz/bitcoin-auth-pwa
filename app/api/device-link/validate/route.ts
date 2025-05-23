import { NextRequest, NextResponse } from 'next/server';
import { redis, backupKey } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }
    
    // Retrieve token data from Redis
    const tokenKey = `device-link:${token}`;
    const tokenData = await redis.get(tokenKey);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 404 });
    }
    
    const data = JSON.parse(tokenData as string);
    
    // Delete the token after validation (one-time use)
    await redis.del(tokenKey);
    
    // Fetch the encrypted backup for this user
    const encryptedBackup = await redis.get(backupKey(data.bapId));
    
    if (!encryptedBackup) {
      return NextResponse.json({ 
        error: 'No backup found for this account' 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      bapId: data.bapId,
      address: data.address,
      idKey: data.idKey,
      encryptedBackup
    });
  } catch (error) {
    console.error('Error validating device link:', error);
    return NextResponse.json({ error: 'Failed to validate token' }, { status: 500 });
  }
}