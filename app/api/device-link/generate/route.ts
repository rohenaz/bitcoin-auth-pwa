import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis } from '@/lib/redis';
import { randomBytes } from 'crypto';
import type { DeviceLinkToken, DeviceLinkResponse } from '@/types/device-link';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Generate a secure random token
    const token = randomBytes(32).toString('hex');
    
    // Store the token in Redis with user info and 10-minute expiry
    const tokenKey = `device-link:${token}`;
    const tokenData: DeviceLinkToken = {
      bapId: session.user.id,
      address: session.user.address,
      idKey: session.user.idKey,
      createdAt: new Date().toISOString()
    };
    
    await redis.set(tokenKey, tokenData, {
      ex: 600 // 10 minutes expiry
    });
    
    // Get the base URL from environment or request
    const baseUrl = process.env.NEXTAUTH_URL || new URL(request.url).origin;
    const linkUrl = `${baseUrl}/link-device?token=${token}`;
    
    const response: DeviceLinkResponse = {
      url: linkUrl,
      token,
      expiresIn: 600 // 10 minutes
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating device link:', error);
    return NextResponse.json({ error: 'Failed to generate link' }, { status: 500 });
  }
}