import NextAuth, { type User } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import X from "next-auth/providers/twitter";
import Credentials from "next-auth/providers/credentials";
import { type AuthPayload, parseAuthToken, verifyAuthToken } from "bitcoin-auth";
import { Redis } from "@upstash/redis"
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import type { APIIdentity, APIResponse, Organization } from "@/types/bap";
import { PublicKey } from "@bsv/sdk";

// amount of time to pad the timestamp in the token
const TIME_PAD = 1000 * 60 * 10 // 10 minutes
const BAP_API_URL = "https://api.sigmaidentity.com"

const redis = Redis.fromEnv();
 
// 1. Credentials provider handles X-Auth-Token verification
export const { handlers, auth } = NextAuth({
  adapter: UpstashRedisAdapter(redis),
  providers: [
    Credentials({
      name: "Bitcoin",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.token) return null;
        const parsedToken = parseAuthToken(credentials.token)
        const timestamp = new Date().toISOString()
        const targetPayload = {
          // for generic auth not specific to a request, 
          // we use the request path from the token
          requestPath: parsedToken?.requestPath,
          timestamp
        } as AuthPayload
        const ok = verifyAuthToken(credentials.token, targetPayload, TIME_PAD);

        if (ok) {
          // look up the bap ID from the pubkey
          const pubkey = parsedToken?.pubkey
          const bapId = await redis.get<APIResponse<APIIdentity>>(`bap:${pubkey}`)
          // if the profile is not found, fetch it from the BAP API
          if (!bapId && pubkey) {
            const bapId = await getBapProfile(pubkey)
            const address = PublicKey.fromString(pubkey).toAddress()
            await redis.set(`bap:${address}:${bapId}:${pubkey}`, bapId)
          }
          const profile = bapId?.result?.identity
          const id = bapId?.result?.idKey
          const name = profile?.alternateName
          const image = profile?.image || (profile as Organization)?.logo

          return { id, name, image } as User
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) token.sub = user.id;
      if (account?.provider) token.provider = account.provider;
      return token;
    },
  },
});


export async function getUserByToken(token: string | undefined) {
  if (!token) {
    return null
  }
  const parsedToken = parseAuthToken(token)
  if (!parsedToken) {
    return null
  }
  return await redis.get(`user:${parsedToken.pubkey}`) as User
}

async function getBapProfile(pubkey: string) {
  const address = PublicKey.fromString(pubkey).toAddress()
  const bap = await fetch(`${BAP_API_URL}/identity/${address}`)
  const bapData = await bap.json() as APIResponse<APIIdentity>
  return bapData.result
}
