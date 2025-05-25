import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import crypto from 'crypto';
import { authOptions } from '@/lib/auth';
import { redis } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bapId } = await request.json();
    if (!bapId) {
      return NextResponse.json({ error: 'BAP ID required' }, { status: 400 });
    }

    // For member export, we'll verify ownership when they provide password
    // This is just generating a token, actual verification happens during download

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Store token with member export data (10 minute expiry)
    await redis.setex(
      `member-export:${token}`,
      600, // 10 minutes
      JSON.stringify({
        bapId,
        createdBy: session.user.id,
        createdAt: new Date().toISOString(),
      })
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Member export generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate export token' },
      { status: 500 }
    );
  }
}