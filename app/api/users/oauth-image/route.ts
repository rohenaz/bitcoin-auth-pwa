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
    const provider = searchParams.get('provider');
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!provider) {
      return NextResponse.json({ error: 'Provider required' }, { status: 400 });
    }
    
    // First check if we have a temporarily stored image from recent OAuth flow
    const tempImageKey = `oauth-image:${session.user.id}:${provider}`;
    const tempImage = await redis.get(tempImageKey);
    
    if (tempImage) {
      // Clean up the temporary image
      await redis.del(tempImageKey);
      return NextResponse.json({ image: tempImage });
    }
    
    // If no temporary image, check if user has this provider connected
    // This would require fetching the provider's current profile image
    // For now, return not found
    return NextResponse.json({ error: 'No image available' }, { status: 404 });
    
  } catch (error) {
    console.error('Error fetching OAuth image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}