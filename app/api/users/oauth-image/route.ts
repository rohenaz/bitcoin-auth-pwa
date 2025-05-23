/**
 * API endpoint to retrieve OAuth profile images
 * 
 * This endpoint retrieves temporarily stored OAuth profile images
 * or fetches them from connected accounts
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!state) {
      return NextResponse.json({ error: 'State required' }, { status: 400 });
    }
    
    // Check if this state exists and belongs to this user
    const stateDataStr = await redis.get(`oauth-image-state:${state}`);
    if (!stateDataStr) {
      return NextResponse.json({ error: 'Invalid or expired state' }, { status: 400 });
    }
    
    const stateData = JSON.parse(stateDataStr as string);
    if (stateData.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check for temporarily stored OAuth image
    const imageKey = `oauth-temp-image:${state}`;
    const storedImage = await redis.get(imageKey);
    
    if (storedImage) {
      // Clean up both temporary storage and state
      await redis.del(imageKey);
      await redis.del(`oauth-image-state:${state}`);
      return NextResponse.json({ image: storedImage });
    }
    
    return NextResponse.json({ error: 'No image available' }, { status: 404 });
    
  } catch (error) {
    console.error('Error fetching OAuth image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}