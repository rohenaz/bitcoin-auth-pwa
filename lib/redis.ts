import { Redis } from "@upstash/redis";

// Use Vercel KV environment variables
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export function userKey(bapId: string)      { return `user:${bapId}`; }
export function bapKey(bapId: string)       { return `bap:${bapId}`; }
export function addrKey(addr: string)    { return `addr2bap:${addr}`; }
export function oauthKey(p: string, s: string) { return `oauth:${p}:${s}`; }
export function backupKey(bapId: string)    { return `backup:${bapId}`; } 
export function latestBlockKey()    { return "block:height"; }