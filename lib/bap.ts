import type { APIIdentity } from "@/types/bap";
import { redis, userKey, bapKey, addrKey } from "./redis";

export async function upsertRootProfile(
  bapId: string,
  addr: string,
  height: number,
  ui: Partial<{ displayName: string; avatar: string }>,
  bap: APIIdentity,
) {
  await redis.hset(userKey(bapId), {
    id: bapId,
    createdAt: Date.now() / 1e3,
    ...ui,
  });
  // Store the BAP profile as a JSON string, adding currentHeight to it.
  await redis.set(bapKey(bapId), JSON.stringify({ ...bap, currentHeight: height }));
  // Store the address to BAP ID mapping, block height as string.
  await redis.hset(addrKey(addr), { id: bapId, block: height.toString() });
}

export async function resolveAddress(addr: string): Promise<APIIdentity | null> {
  const idx = await redis.hgetall<{ id: string; block: string }>(addrKey(addr));
  if (!idx?.id) return null;
  
  const rawBapProfile = await redis.get<string>(bapKey(idx.id));
  if (!rawBapProfile) return null;

  // Parse the stored BAP profile and cast to include currentHeight.
  const bap = JSON.parse(rawBapProfile) as APIIdentity & { currentHeight: number };
  
  // Self-heal stale index if currentAddress in profile doesn't match queried address.
  // Note: The original plan had `block: bap.currentHeight` (a number), 
  // but hset values for addrKey are strings. So, convert to string.
  if (addr !== bap.currentAddress) {
    await redis.hset(addrKey(addr), { id: idx.id, block: bap.currentHeight.toString() });
  }

  // Return the BAP profile (currentHeight is an extension, not part of BapProfile type).
  // The caller might only expect BapProfile, so the extra currentHeight is fine.
  return bap;
} 