import { signIn } from 'next-auth/react';
import { type BapMasterBackup } from 'bitcoin-backup';
import { extractIdentityFromBackup, createAuthTokenFromBackup } from './bap-utils';
import { STORAGE_KEYS } from './storage-keys';

/**
 * Common function to sign in with a decrypted backup
 */
export async function signInWithBackup(
  backup: BapMasterBackup,
  options?: {
    redirect?: boolean;
    callbackUrl?: string;
  }
) {
  // Store decrypted backup in session
  sessionStorage.setItem(STORAGE_KEYS.DECRYPTED_BACKUP, JSON.stringify(backup));
  
  // Create auth token
  const authToken = createAuthTokenFromBackup(backup, '/api/auth/signin');
  
  // Sign in
  const result = await signIn('credentials', {
    token: authToken,
    redirect: options?.redirect ?? false,
    callbackUrl: options?.callbackUrl,
  });
  
  return result;
}

/**
 * Handle failed login by creating a new user
 */
export async function handleFailedLogin(
  backup: BapMasterBackup,
  encryptedBackup: string
) {
  const identity = extractIdentityFromBackup(backup);
  
  // Create auth token for user creation
  const createUserToken = createAuthTokenFromBackup(
    backup,
    '/api/users/create-from-backup',
    JSON.stringify({ 
      bapId: identity.id, 
      address: identity.address, 
      encryptedBackup 
    })
  );

  // Create the user
  const createUserResponse = await fetch('/api/users/create-from-backup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': createUserToken
    },
    body: JSON.stringify({
      bapId: identity.id,
      address: identity.address,
      encryptedBackup
    })
  });

  if (!createUserResponse.ok) {
    const error = await createUserResponse.json();
    throw new Error(error.error || 'Failed to create user');
  }

  // Now sign in
  return signInWithBackup(backup);
}