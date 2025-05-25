import { redis, backupKey, oauthKey } from "@/lib/redis";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-helpers";
import { Hash, Utils } from "@bsv/sdk";
import { apiError, apiSuccess } from "@/lib/api-utils";
import { linkOAuthAccount } from "@/lib/oauth-utils";
const { toHex } = Utils;

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
      return apiError("Invalid oauthId format");
    }
    // Look up BAP ID from OAuth mapping
    const mappedBapId = await redis.get(oauthKey(provider, providerAccountId));
    if (!mappedBapId) {
      return apiError("No backup found for OAuth account", 404);
    }
    key = backupKey(String(mappedBapId));
  } else {
    return apiError("bapid or oauthId required");
  }
  
  const encryptedBackupString = await redis.get<string>(key);
  
  return encryptedBackupString
    ? apiSuccess({ backup: encryptedBackupString })
    : apiError("not found", 404);
};

export const POST = async (req: Request) => {
  // Verify user is authenticated
  const session = await auth();
  if (!session?.user) {
    return apiError("Unauthorized", 401);
  }

  try {
    const body = await req.json();
    const { encryptedBackup, oauthProvider, oauthId, address, idKey } = body;

    if (!encryptedBackup) {
      return NextResponse.json({ error: "encryptedBackup required" }, { status: 400 });
    }

    // Store the backup with the user's BAP ID
    const bapId = body.bapId || session.user.id;
    if (!bapId) {
      return NextResponse.json({ error: "No BAP ID found" }, { status: 400 });
    }

    // Store the encrypted backup
    await redis.set(backupKey(bapId), encryptedBackup);
    
    // Store metadata about the backup

    const hash =  toHex(Hash.sha256(encryptedBackup))
    await redis.set(`${backupKey(bapId)}:metadata`, {
      lastUpdated: new Date().toISOString(),
      hash
    });

    // Always store user data and address mapping
    // Use address from request body or session
    const userAddress = address || session.user.address;
    const userIdKey = idKey || session.user.idKey || bapId;
    
    if (userAddress) {
      const userKey = `user:${bapId}`;
      await redis.hset(userKey, {
        address: userAddress,
        idKey: userIdKey,
        createdAt: Date.now() / 1e3
      });
      
      // Create address-to-BAP mapping for unpublished IDs
      const { addrKey, bapKey } = await import('@/lib/redis');
      const currentBlock = await redis.get('block:height') || '0';
      await redis.hset(addrKey(userAddress), { 
        id: bapId, 
        block: currentBlock.toString() 
      });
      
      // Store a basic BAP profile for unpublished identities
      // This ensures /api/bap can return something for new identities
      const existingProfile = await redis.get(bapKey(bapId));
      if (!existingProfile) {
        const basicProfile = {
          idKey: bapId,
          currentAddress: userAddress,
          identity: {
            '@context': 'https://schema.org',
            '@type': 'Person',
            alternateName: `Bitcoin User (${userAddress.substring(0, 8)}...)`,
          },
          block: Number(currentBlock) || 0,
          currentHeight: Number(currentBlock) || 0
        };
        await redis.set(bapKey(bapId), JSON.stringify(basicProfile));
      }
    } else {
      console.error('WARNING: No address available for user creation');
    }

    // If OAuth info provided, create OAuth mapping
    if (oauthProvider && oauthId) {
      const linkResult = await linkOAuthAccount(oauthProvider, oauthId, bapId);
      
      if (!linkResult.success && linkResult.error === 'already-linked') {
        return NextResponse.json({ 
          error: "This OAuth account is already linked to another Bitcoin identity",
          existingBapId: linkResult.existingBapId,
          code: 'OAUTH_ALREADY_LINKED'
        }, { status: 409 });
      }
    }
    
    // Store email mapping if we have the user's email
    if (session.user.email) {
      await redis.set(`email:${session.user.email}`, bapId);
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