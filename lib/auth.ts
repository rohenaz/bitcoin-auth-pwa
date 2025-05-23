import NextAuth, { type Account, type Session, type User } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
// import Twitter from "next-auth/providers/twitter";
import Credentials from "next-auth/providers/credentials";
import { type AuthPayload, parseAuthToken, verifyAuthToken } from "bitcoin-auth";
import { redis, oauthKey, userKey, latestBlockKey, addrKey } from "./redis";
import { upsertRootProfile } from "./bap";
import type { APIResponse, APIIdentity, Organization } from "@/types/bap";
import { PublicKey } from "@bsv/sdk";
import { getLatestBlockHeight } from "./block";
import { env, ENABLED_PROVIDERS } from "./env";
import type { JWT } from "next-auth/jwt";
// amount of time to pad the timestamp in the token
const TIME_PAD = 1000 * 60 * 10 // 10 minutes
 
// 1. Credentials provider handles X-Auth-Token verification
// Build providers array dynamically based on available credentials
const providers = [];

// Add OAuth providers based on ENABLED_PROVIDERS from env
// The env module guarantees these vars exist for enabled providers
if (ENABLED_PROVIDERS.includes('google')) {
  providers.push(Google({
    clientId: env.AUTH_GOOGLE_ID,
    clientSecret: env.AUTH_GOOGLE_SECRET,
    allowDangerousEmailAccountLinking: true,
  }));
}

if (ENABLED_PROVIDERS.includes('github')) {
  providers.push(GitHub({
    clientId: env.AUTH_GITHUB_ID,
    clientSecret: env.AUTH_GITHUB_SECRET,
    allowDangerousEmailAccountLinking: true,
  }));
}

// Twitter is temporarily disabled, uncomment when enabled
// if (ENABLED_PROVIDERS.includes('twitter')) {
//   providers.push(Twitter({
//     clientId: env.AUTH_TWITTER_ID,
//     clientSecret: env.AUTH_TWITTER_SECRET,
//     allowDangerousEmailAccountLinking: true,
//   }));
// }

// Always include the Bitcoin credentials provider
const customProvider = Credentials({
  name: "Bitcoin-Auth",
  credentials: {
    token: { label: "Token", type: "text" },
  },
  async authorize (credentials) {
    console.log('🔐 Authorize called with credentials:', !!credentials?.token);
    
    if (!credentials?.token) {
      console.log('❌ No token provided');
      return null;
    }
    
    const parsedToken = parseAuthToken(credentials.token)
    console.log('📄 Parsed token:', {
      pubkey: `${parsedToken?.pubkey?.substring(0, 10)}...`,
      requestPath: parsedToken?.requestPath,
      timestamp: parsedToken?.timestamp
    });
    
    if (!parsedToken || !parsedToken.pubkey) {
      console.log('❌ Invalid token or missing pubkey');
      return null;
    }

    const timestamp = new Date().toISOString()
    const targetPayload = {
      // for generic auth not specific to a request, 
      // we use the request path from the token
      requestPath: parsedToken?.requestPath,
      timestamp
    } as AuthPayload
    
    console.log('🔍 Verifying token with payload:', {
      requestPath: targetPayload.requestPath,
      timestamp: targetPayload.timestamp
    });
    
    const ok = verifyAuthToken(credentials.token, targetPayload, TIME_PAD);
    console.log('✅ Token verification result:', ok);
    
    if (ok) {
      // look up the bap ID from the pubkey
      const pubkey = parsedToken?.pubkey
      console.log('🔍 Looking up cached BAP profile for pubkey:', `${pubkey?.substring(0, 10)}...`);
      
      const bapId = await redis.get<APIResponse<APIIdentity>>(`bap:${pubkey}`)
      console.log('📦 Cached BAP profile found:', !!bapId);
      
      // if the profile is not found, fetch it from the BAP API
      if (!bapId && pubkey) {
        console.log('🌐 No cached profile, fetching from BAP API...');
        
        try {
          const bapProfile = await getBapProfile(pubkey)
          console.log('✅ BAP profile fetched successfully:', !!bapProfile);
          
          const address = PublicKey.fromString(pubkey).toAddress()
          if (bapProfile) {
            console.log('💾 Storing BAP profile in cache and upserting root profile...');
            
            // get the current block height (number)
            const blockHeight = await redis.get(latestBlockKey())
            if (!blockHeight) {
              const blockHeight = await getLatestBlockHeight()
              if (!blockHeight) {
                throw new Error("Current block height not found")
              }
              await redis.set(latestBlockKey(), blockHeight)
            }
            await upsertRootProfile(bapProfile.idKey, bapProfile.currentAddress, Number(blockHeight), {
              displayName: bapProfile.identity?.alternateName,
              avatar: bapProfile.identity?.image,
            }, bapProfile)
            await redis.set(`bap:${address}:${bapProfile.idKey}:${pubkey}`, { result: bapProfile })
            console.log('✅ BAP profile stored successfully');
          } else {
            console.log('⚠️ BAP profile is null, checking for existing user by address mapping');
            // For unpublished BAP IDs, check if we have an address-to-BAP mapping
            const address = PublicKey.fromString(pubkey).toAddress()
            
            // Use the existing address-to-BAP mapping
            const addrMapping = await redis.hgetall<{ id: string; block: string }>(addrKey(address));
            
            if (addrMapping?.id) {
              // We have a BAP ID for this address, get the user data
              const userData = await redis.hgetall(userKey(addrMapping.id)) as Record<string, string>;
              
              if (userData) {
                const user = { 
                  id: addrMapping.id, 
                  name: userData.displayName || `Bitcoin User (${address.substring(0, 8)}...)`, 
                  image: userData.avatar || null,
                  address,
                  idKey: userData.idKey || addrMapping.id
                } as User;
                console.log('👤 Found existing user with unpublished BAP ID:', user);
                return user;
              }
            }
            
            // If we still don't have a user, create one for this unpublished BAP ID
            // This handles the case where someone has a valid backup but no user record yet
            console.log('⚠️ No user found, creating new user record for unpublished BAP ID');
            
            // We need to extract the BAP ID from the token or generate one
            // For now, we'll throw an error asking them to sign up
            // In a production system, you might want to auto-create the user here
            console.error('❌ No user found for address:', address);
            throw new Error('User not found. Please complete signup to create your user record.');
          }
        } catch (error) {
          console.error('❌ Failed to fetch BAP profile:', error);
          console.log('🔄 Looking for existing user by address mapping...');
          
          // For unpublished BAP IDs, check if we have an address-to-BAP mapping
          const address = PublicKey.fromString(pubkey).toAddress()
          
          // Use the existing address-to-BAP mapping
          const addrMapping = await redis.hgetall<{ id: string; block: string }>(addrKey(address));
          
          if (addrMapping?.id) {
            // We have a BAP ID for this address, get the user data
            const userData = await redis.hgetall(userKey(addrMapping.id)) as Record<string, string>;
            
            if (userData) {
              const user = { 
                id: addrMapping.id, 
                name: userData.displayName || `Bitcoin User (${address.substring(0, 8)}...)`, 
                image: userData.avatar || null,
                address,
                idKey: userData.idKey || addrMapping.id
              } as User;
              console.log('👤 Found existing user with unpublished BAP ID:', user);
              return user;
            }
          }
          
          // If we still don't have a user, this is an error condition
          console.error('❌ No user found for address:', address);
          throw new Error('User not found. Please sign up first.');
        }
      }
      
      const profile = bapId?.result?.identity
      const id = bapId?.result?.idKey
      const name = profile?.alternateName
      const image = profile?.image || (profile as Organization)?.logo
      const user = { id, name, image } as User;
      
      console.log('👤 Returning cached user:', { id, name, hasImage: !!image });
      return user;
    }
    
    console.log('❌ Token verification failed, returning null');
    return null;
  },
});
providers.push(customProvider);

export const authOptions = {
  // adapter: UpstashRedisAdapter(redis), // Not needed with JWT strategy
  providers,
  secret: env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: {
    signIn: '/signin',
    error: '/signin',
  },
  callbacks: {
    redirect: async ({ url, baseUrl }: { url: string; baseUrl: string }) => {
      // If the URL contains oauth-restore, preserve it
      if (url.includes('/signin/oauth-restore')) {
        return url;
      }
      // If the URL contains settings with connected parameter, preserve it
      if (url.includes('/settings?connected=')) {
        return url;
      }
      // If the URL contains signup/oauth, preserve it
      if (url.includes('/signup/oauth')) {
        return url;
      }
      // If the URL contains dashboard, preserve it
      if (url.includes('/dashboard')) {
        return url;
      }
      // If the URL contains success, preserve it
      if (url.includes('/success')) {
        return url;
      }
      // Otherwise, use the URL or default to baseUrl
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    jwt: async ({ token, user, account }: { token: JWT, user: User, account: Account | null }) => {
      if (user) {
        token.sub = user.id;
        token.address = (user as User).address;
        token.idKey = (user as User).idKey;
        // Capture email from OAuth provider
        if (user.email) {
          token.email = user.email;
        }
      }
      if (account?.provider && account.providerAccountId) {
        token.provider = account.provider;
        // Always store providerAccountId for OAuth providers
        if (account.provider !== 'credentials') {
          token.providerAccountId = String(account.providerAccountId);
        }
        
        // For OAuth providers, check if there's a linked BAP identity
        if (account.provider !== 'credentials') {
          const mappedBapId = await redis.get(oauthKey(account.provider, String(account.providerAccountId)));
          
          if (mappedBapId) {
            // User has a linked Bitcoin identity, load it
            const userKey = `user:${mappedBapId}`;
            const userData = await redis.hgetall(userKey) as { address?: string; idKey?: string } | null;
            
            if (userData && userData.address) {
              token.sub = mappedBapId as string;
              token.address = userData.address;
              token.idKey = userData.idKey || (mappedBapId as string);
              token.linkedProvider = account.provider;
            }
          } else {
            // No linked identity yet
            const oauthUserId = `${account.provider}-${account.providerAccountId}`;
            
            // Check if we have a user with this email
            if (user.email) {
              token.email = user.email;
              
              // Check if email is already associated with a BAP ID
              const emailKey = `email:${user.email}`;
              const existingBapId = await redis.get(emailKey);
              
              if (existingBapId) {
                // Found a user with this email
                token.potentialBapId = existingBapId as string;
                token.needsLinking = true;
              }
            }
            
            token.sub = oauthUserId;
            token.isOAuthOnly = true;
          }
        }
      }
      return token;
    },
    session: async ({ session, token }: { session: Session, token: JWT }) => {
      if (token) {
        session.user.id = token.sub as string;
        session.user.address = token.address as string;
        session.user.idKey = token.idKey as string;
        session.user.provider = token.provider as string;
        session.user.providerAccountId = token.providerAccountId as string;
        session.user.isOAuthOnly = token.isOAuthOnly as boolean;
        session.user.email = token.email as string;
        session.user.potentialBapId = token.potentialBapId as string;
        session.user.needsLinking = token.needsLinking as boolean;
      }
      return session;
    },
  },
} as const;

export default NextAuth(authOptions);

export async function getUserByToken(token: string | undefined) {
  if (!token) {
    return null;
  }
  const parsedToken = parseAuthToken(token);
  if (!parsedToken || !parsedToken.pubkey) {
    return null;
  }
  console.log('Getting user by token:', parsedToken);
  // To get the user by token, we first need to resolve the pubkey to a rootBapId.
  // This mimics part of the logic in `authorize` but without creating/updating user profiles.
  // This is a simplified lookup and might need its own robust resolver.
  try {
    const bapProfileResult = await getBapProfile(parsedToken.pubkey);
    console.log('BAP profile result:', bapProfileResult);
    if (bapProfileResult?.idKey) {
      const rootBapId = bapProfileResult.idKey;
      return await redis.hgetall(userKey(rootBapId)) as User | null;
    }
  } catch (error) {
    console.error("Error fetching BAP profile in getUserByToken:", error);
    return null;
  }
  return null;
}

async function getBapProfile(pubkey: string) {
  console.log('🔍 getBapProfile called with pubkey:', `${pubkey.substring(0, 10)}...`);
  
  const address = PublicKey.fromString(pubkey).toAddress()
  console.log('📍 Generated address:', address);
  console.log('🌐 BAP API URL:', env.BAP_API_URL);
  console.log('📤 Sending POST to:', `${env.BAP_API_URL}/identity/validByAddress`);
  console.log('📤 Request body:', { address });
  
  try {
    const response = await fetch(`${env.BAP_API_URL}/identity/validByAddress`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ address }),
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Response error text:', errorText);
      throw new Error(`BAP API error: ${response.status} - ${errorText}`);
    }
    
    const bapData = await response.json() as APIResponse<APIIdentity>;
    console.log('📄 BAP response data:', JSON.stringify(bapData, null, 2));
    console.log('🎯 Returning result:', bapData.result);
    
    return bapData.result;
  } catch (error) {
    console.error('💥 getBapProfile error:', error);
    throw error;
  }
}
