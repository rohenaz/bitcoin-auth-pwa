import { useState, useCallback, useEffect } from 'react';
import { type BapMasterBackup, decryptBackup } from 'bitcoin-backup';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { extractIdentityFromBackup } from '@/lib/bap-utils';
import { signInWithBackup, handleFailedLogin } from '@/lib/auth-flows';

interface UseAuthReturn {
  // State
  loading: boolean;
  error: string;
  hasLocalBackup: boolean;
  
  // Actions
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Auth methods
  signInWithPassword: (password: string, callbackUrl?: string) => Promise<void>;
  importBackupFile: (file: File) => Promise<{ isUnencrypted: boolean; backup?: BapMasterBackup }>;
  checkLocalBackup: () => boolean;
}

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasLocalBackup, setHasLocalBackup] = useState(false);

  // Check for local backup on mount
  useEffect(() => {
    setHasLocalBackup(checkLocalBackup());
  }, []);

  const checkLocalBackup = useCallback((): boolean => {
    const localBackup = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_BACKUP);
    return !!localBackup;
  }, []);

  const signInWithPassword = useCallback(async (password: string, callbackUrl = '/dashboard') => {
    setLoading(true);
    setError('');

    try {
      const encryptedBackup = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_BACKUP);
      if (!encryptedBackup) {
        throw new Error('No local backup found');
      }

      // Decrypt the backup with the password
      let decrypted: BapMasterBackup;
      try {
        decrypted = await decryptBackup(encryptedBackup, password) as BapMasterBackup;
      } catch (decryptError) {
        console.error('Decryption error details:', decryptError);
        if (decryptError instanceof Error && decryptError.message.includes('Invalid passphrase or corrupted data')) {
          throw new Error('Incorrect password. Please try again.');
        }
        throw decryptError;
      }

      if (!decrypted) {
        throw new Error('Invalid backup format');
      }

      // Extract identity for logging
      const identity = extractIdentityFromBackup(decrypted);
      console.log('Signing in with BAP ID:', identity.id);
      console.log('Address:', identity.address);

      // Sign in with backup
      const result = await signInWithBackup(decrypted);

      if (result?.error) {
        // If user not found, try to create the user record
        if (result.error.includes('User not found')) {
          console.log('User not found, creating user record...');
          await handleFailedLogin(decrypted, encryptedBackup);
          window.location.href = callbackUrl;
          return;
        }
        throw new Error(result.error);
      }

      if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  }, []);

  const importBackupFile = useCallback(async (file: File): Promise<{ isUnencrypted: boolean; backup?: BapMasterBackup }> => {
    const text = await file.text();
    let isUnencrypted = false;
    let decryptedBackup: BapMasterBackup | undefined = undefined;

    // First, check if it's an unencrypted backup (BapMasterBackup)
    try {
      const parsed = JSON.parse(text);
      // Check for BapMasterBackup structure
      if (parsed.xprv && parsed.ids && parsed.mnemonic) {
        isUnencrypted = true;
        decryptedBackup = parsed as BapMasterBackup;
        return { isUnencrypted, backup: decryptedBackup };
      }
    } catch {
      // Not JSON, likely encrypted
    }

    // If not unencrypted, validate it's an encrypted backup
    let isValid = false;

    try {
      // First try: Check if it's a JSON with encrypted fields (older format)
      const parsed = JSON.parse(text);
      if (parsed.encrypted || parsed.encryptedMnemonic) {
        isValid = true;
      }
    } catch {
      // Second try: Check if it's a plain encrypted string (current format)
      if (text.length > 100 && /^[A-Za-z0-9+/=]+$/.test(text.trim())) {
        isValid = true;
      }
    }

    if (!isValid) {
      throw new Error('Invalid backup file format');
    }

    // Store encrypted backup
    localStorage.setItem(STORAGE_KEYS.ENCRYPTED_BACKUP, text.trim());
    setHasLocalBackup(true);
    
    return { isUnencrypted: false };
  }, []);

  return {
    // State
    loading,
    error,
    hasLocalBackup,
    
    // Actions
    setError,
    setLoading,
    
    // Auth methods
    signInWithPassword,
    importBackupFile,
    checkLocalBackup,
  };
}