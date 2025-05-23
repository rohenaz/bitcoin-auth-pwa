/**
 * Centralized storage keys to avoid magic strings
 */
export const STORAGE_KEYS = {
  // Local Storage
  ENCRYPTED_BACKUP: 'encryptedBackup',
  
  // Session Storage
  DECRYPTED_BACKUP: 'decryptedBackup',
  OAUTH_SIGNUP_INFO: 'oauthSignupInfo',
  OAUTH_LINKING: 'oauth_linking',
  PENDING_OAUTH_LINK: 'pendingOAuthLink',
  PENDING_BACKUP: 'pending-backup',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];