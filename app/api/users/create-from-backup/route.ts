import { type NextRequest, NextResponse } from 'next/server';
import { parseAuthToken, verifyAuthToken } from 'bitcoin-auth';
import { redis, userKey, addrKey } from '@/lib/redis';
import { PublicKey } from '@bsv/sdk';

export async function POST(request: NextRequest) {
  try {
    const authToken = request.headers.get('X-Auth-Token');
    if (!authToken) {
      return NextResponse.json({ error: 'No auth token provided' }, { status: 401 });
    }

    const body = await request.json();
    const { bapId, address } = body;
    
    if (!bapId || !address) {
      return NextResponse.json({ error: 'BAP ID and address are required' }, { status: 400 });
    }

    // Parse and verify the auth token
    const parsedToken = parseAuthToken(authToken);
    if (!parsedToken || !parsedToken.pubkey) {
      return NextResponse.json({ error: 'Invalid auth token' }, { status: 401 });
    }

    // Verify the token
    const ok = verifyAuthToken(authToken, {
      requestPath: '/api/users/create-from-backup',
      body: JSON.stringify({ bapId, address }),
      timestamp: new Date().toISOString()
    }, 1000 * 60 * 10); // 10 minute time window

    if (!ok) {
      return NextResponse.json({ error: 'Invalid auth token' }, { status: 401 });
    }

    // Verify the address matches the pubkey
    const derivedAddress = PublicKey.fromString(parsedToken.pubkey).toAddress();
    if (derivedAddress !== address) {
      return NextResponse.json({ error: 'Address does not match auth token' }, { status: 403 });
    }

    // Check if user already exists
    const existingUser = await redis.hgetall(userKey(bapId));
    if (existingUser && Object.keys(existingUser).length > 0) {
      return NextResponse.json({ message: 'User already exists', bapId });
    }

    // Create the user record
    await redis.hset(userKey(bapId), {
      id: bapId,
      address: address,
      idKey: bapId,
      createdAt: Date.now() / 1e3,
      displayName: `Bitcoin User (${address.substring(0, 8)}...)`
    });

    // Create address-to-BAP mapping
    const currentBlock = await redis.get('block:height') || '0';
    await redis.hset(addrKey(address), { 
      id: bapId, 
      block: currentBlock.toString() 
    });

    return NextResponse.json({ 
      success: true, 
      bapId,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.error('Error creating user from backup:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}