import { redis, userKey, addrKey, latestBlockKey } from './redis';

interface UserProfileData {
  displayName?: string;
  avatar?: string;
  email?: string;
  [key: string]: unknown;
}

/**
 * Create or update a user profile in Redis
 */
export async function createUserProfile(
  bapId: string, 
  address: string, 
  metadata?: UserProfileData
) {
  const currentBlock = await redis.get(latestBlockKey()) || '0';
  
  const userData = {
    id: bapId,
    address,
    idKey: bapId,
    createdAt: Date.now() / 1e3,
    displayName: metadata?.displayName || `Bitcoin User (${address.substring(0, 8)}...)`,
    ...metadata
  };
  
  // Store user data
  await redis.hset(userKey(bapId), userData);
  
  // Store address mapping
  await redis.hset(addrKey(address), { 
    id: bapId, 
    block: currentBlock.toString() 
  });
  
  return userData;
}

/**
 * Get user profile from Redis
 */
export async function getUserProfile(bapId: string) {
  return await redis.hgetall(userKey(bapId));
}

/**
 * Check if a user exists
 */
export async function userExists(bapId: string): Promise<boolean> {
  const exists = await redis.exists(userKey(bapId));
  return exists === 1;
}