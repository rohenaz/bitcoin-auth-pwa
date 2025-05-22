import { Redis } from '@upstash/redis';
import type { User } from 'next-auth';
import { NextResponse } from 'next/server';

const redis = Redis.fromEnv();

export const GET = async () => {
  // Fetch all users from Redis
  // Not sure what structure we're using yet
  const userKeys = await redis.keys("user:*");
  const users = await redis.mget(userKeys) as User[];
  // Return the result in the response
  return new NextResponse(JSON.stringify({ users }), { status: 200 });
};