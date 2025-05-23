import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis, userKey, bapKey } from '@/lib/redis';

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
    const { alternateName, image, description } = await request.json();
    
    // Validate inputs
    if (!alternateName || typeof alternateName !== 'string') {
      return NextResponse.json({ error: 'Invalid alternateName' }, { status: 400 });
    }

    const bapId = session.user.id;
    
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
    } else {
      // Create new profile if it doesn't exist
      profile = {
        idKey: bapId,
        currentAddress: session.user.address,
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