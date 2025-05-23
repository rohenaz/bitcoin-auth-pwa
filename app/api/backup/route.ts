import { redis, backupKey, oauthKey } from "@/lib/redis";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-helpers";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const bapId = url.searchParams.get("bapid");
  const oauthId = url.searchParams.get("oauthId");
  
  // Support both BAP ID and OAuth ID lookups
  let key: string;
  if (bapId) {
    key = backupKey(bapId);
  } else if (oauthId) {
    // OAuth ID format: "provider|providerAccountId"
    const [provider, providerAccountId] = oauthId.split('|');
    if (!provider || !providerAccountId) {
      return NextResponse.json({ error: "Invalid oauthId format" }, { status: 400 });
    }
    // Look up BAP ID from OAuth mapping
    const mappedBapId = await redis.get(oauthKey(provider, providerAccountId));
    if (!mappedBapId) {
      return NextResponse.json({ error: "No backup found for OAuth account" }, { status: 404 });
    }
    key = backupKey(String(mappedBapId));
  } else {
    return NextResponse.json({ error: "bapid or oauthId required" }, { status: 400 });
  }
  
  const encryptedBackupString = await redis.get<string>(key);
  
  return encryptedBackupString
    ? NextResponse.json({ backup: encryptedBackupString }) // Return the encrypted string within a JSON object
    : NextResponse.json({ error: "not found" }, { status: 404 });
};

export const POST = async (req: Request) => {
  // Verify user is authenticated
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { encryptedBackup, oauthProvider, oauthId } = body;

    if (!encryptedBackup) {
      return NextResponse.json({ error: "encryptedBackup required" }, { status: 400 });
    }

    // Store the backup with the user's BAP ID
    const bapId = session.user.id;
    if (!bapId) {
      return NextResponse.json({ error: "No BAP ID found in session" }, { status: 400 });
    }

    // Store the encrypted backup
    await redis.set(backupKey(bapId), encryptedBackup);
    
    // Store metadata about the backup
    const { createHash } = await import('crypto');
    const hash = createHash('sha256').update(encryptedBackup).digest('hex');
    await redis.set(`${backupKey(bapId)}:metadata`, {
      lastUpdated: new Date().toISOString(),
      hash
    });

    // If OAuth info provided, create mapping
    if (oauthProvider && oauthId) {
      await redis.set(oauthKey(oauthProvider, oauthId), bapId);
    }

    return NextResponse.json({ 
      success: true, 
      bapId,
      message: "Backup stored successfully" 
    });
  } catch (error) {
    console.error("Error storing backup:", error);
    return NextResponse.json({ 
      error: "Failed to store backup" 
    }, { status: 500 });
  }
}; 