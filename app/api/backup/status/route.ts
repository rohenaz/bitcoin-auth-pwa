import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth-helpers';
import { redis, backupKey } from '@/lib/redis';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bapId = session.user.id;
    
    // Get cloud backup
    const cloudBackup = await redis.get<string>(backupKey(bapId));
    
    if (!cloudBackup) {
      return NextResponse.json({
        hasCloudBackup: false,
        isOutdated: false
      });
    }

    // Get cloud backup metadata
    const metadata = await redis.get<{
      lastUpdated: string;
      hash: string;
    }>(`${backupKey(bapId)}:metadata`);

    // Since this is a server-side route, we can't access localStorage directly
    // The client will determine if the backup is outdated by comparing hashes
    
    return NextResponse.json({
      hasCloudBackup: true,
      lastUpdated: metadata?.lastUpdated || new Date().toISOString(),
      isOutdated: false, // Client will determine this
      cloudBackupHash: metadata?.hash
    });
  } catch (error) {
    console.error('Error checking backup status:', error);
    return NextResponse.json(
      { error: 'Failed to check backup status' },
      { status: 500 }
    );
  }
}