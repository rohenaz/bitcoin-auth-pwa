import { redis, oauthKey } from './redis';

export interface OAuthLinkResult {
  success: boolean;
  error?: 'already-linked' | 'failed';
  existingBapId?: string;
}

/**
 * Check if an OAuth account is already linked to a BAP ID
 */
export async function checkOAuthLink(provider: string, providerAccountId: string): Promise<string | null> {
  const existingBapId = await redis.get(oauthKey(provider, providerAccountId));
  return existingBapId as string | null;
}

/**
 * Link an OAuth account to a BAP ID, checking for conflicts
 */
export async function linkOAuthAccount(
  provider: string, 
  providerAccountId: string, 
  bapId: string,
  options?: {
    force?: boolean; // Force link even if already linked to another account
  }
): Promise<OAuthLinkResult> {
  try {
    // Check if already linked
    const existingBapId = await checkOAuthLink(provider, providerAccountId);
    
    if (existingBapId && existingBapId !== bapId) {
      if (!options?.force) {
        return {
          success: false,
          error: 'already-linked',
          existingBapId
        };
      }
      // If forcing, we'll overwrite the existing link
      console.warn(`Overwriting OAuth link: ${provider}|${providerAccountId} from ${existingBapId} to ${bapId}`);
    }
    
    // Create the link
    await redis.set(oauthKey(provider, providerAccountId), bapId);
    
    return { success: true };
  } catch (error) {
    console.error('Error linking OAuth account:', error);
    return {
      success: false,
      error: 'failed'
    };
  }
}