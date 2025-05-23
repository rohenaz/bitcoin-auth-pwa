import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
// import type { User } from 'next-auth'; // User type might not be needed if hgetall returns structured objects

export const GET = async () => {
  const keys = await redis.keys("user:*");
  if (!keys.length) return NextResponse.json({ result: [] });
  
  const pipe = redis.pipeline();
  for (const k of keys) {
    pipe.hgetall(k); // user records are hashes
  }
  // Each result from hgetall in a pipeline is [Error | null, Record<string, string> | null]
  const results = await pipe.exec<[Error | null, Record<string, string> | null][]>();
  
  const users = results
    .filter((result): result is [null, Record<string, string>] => result[0] === null && result[1] !== null)
    .map(result => result[1]);
  
  return NextResponse.json({ result: users });
};