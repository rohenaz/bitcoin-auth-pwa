import { type NextRequest, NextResponse } from 'next/server';
import { redis, backupKey } from '@/lib/redis';
import type { DeviceLinkToken, DeviceLinkValidateResponse } from '@/types/device-link';

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
    
    // Upstash Redis automatically deserializes JSON, so tokenData is already an object
    const data = tokenData as DeviceLinkToken;
    
    // Delete the token after validation (one-time use)
    await redis.del(tokenKey);
    
    // Fetch the encrypted backup for this user
    const encryptedBackup = await redis.get(backupKey(data.bapId));
    
    if (!encryptedBackup) {
      return NextResponse.json({ 
        error: 'No backup found for this account' 
      }, { status: 404 });
    }
    
    const response: DeviceLinkValidateResponse = {
      bapId: data.bapId,
      address: data.address,
      idKey: data.idKey,
      encryptedBackup: encryptedBackup as string
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error validating device link:', error);
    return NextResponse.json({ error: 'Failed to validate token' }, { status: 500 });
  }
}