import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis } from '@/lib/redis';
import { randomBytes } from 'crypto';

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
    await redis.set(tokenKey, JSON.stringify({
      bapId: session.user.id,
      address: session.user.address,
      idKey: session.user.idKey,
      createdAt: new Date().toISOString()
    }), {
      ex: 600 // 10 minutes expiry
    });
    
    // Get the base URL from environment or request
    const baseUrl = process.env.NEXTAUTH_URL || new URL(request.url).origin;
    const linkUrl = `${baseUrl}/link-device?token=${token}`;
    
    return NextResponse.json({ 
      url: linkUrl,
      token,
      expiresIn: 600 // 10 minutes
    });
  } catch (error) {
    console.error('Error generating device link:', error);
    return NextResponse.json({ error: 'Failed to generate link' }, { status: 500 });
  }
}