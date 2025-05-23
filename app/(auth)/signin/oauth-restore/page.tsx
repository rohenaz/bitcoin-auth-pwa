'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { decryptBackup, type BapMasterBackup } from 'bitcoin-backup';
import { signInWithBackup } from '@/lib/auth-flows';
import { STORAGE_KEYS } from '@/lib/storage-keys';

export default function OAuthRestorePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [encryptedBackup, setEncryptedBackup] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [decrypting, setDecrypting] = useState(false);

  const fetchBackupFromOAuth = useCallback(async () => {
    if (!session?.user?.provider || !session?.user?.id) {
      setError('No OAuth provider information found');
      setLoading(false);
      return;
    }

    try {
      // Construct OAuth ID from session
      let oauthId: string;
      
      // Check if we have provider account ID directly
      if (session.user.provider && session.user.providerAccountId) {
        oauthId = `${session.user.provider}|${session.user.providerAccountId}`;
      } else if (session.user.id.includes('-')) {
        // Fallback: Extract from composite ID format "provider-providerAccountId"
        const parts = session.user.id.split('-');
        if (parts.length >= 2) {
          oauthId = `${parts[0]}|${parts.slice(1).join('-')}`;
        } else {
          console.error('Cannot parse OAuth ID from composite ID:', session.user.id);
          setError('Invalid OAuth session format.');
          setTimeout(() => {
            signOut({ callbackUrl: '/signin' });
          }, 2000);
          return;
        }
      } else {
        console.error('No OAuth provider information in session:', session.user);
        setError('Not signed in with OAuth provider.');
        setTimeout(() => {
          signOut({ callbackUrl: '/signin' });
        }, 2000);
        return;
      }
      
      console.log('Fetching backup for OAuth ID:', oauthId);
      console.log('Session user:', {
        id: session.user.id,
        provider: session.user.provider,
        providerAccountId: session.user.providerAccountId,
        isOAuthOnly: session.user.isOAuthOnly
      });
      const response = await fetch(`/api/backup?oauthId=${oauthId}`);
      
      if (!response.ok) {
        const responseText = await response.text();
        console.error('Backup fetch failed:', response.status, responseText);
        
        if (response.status === 404) {
          // No backup found
          console.error('No backup found for OAuth ID:', oauthId);
          
          // Check if this user has a potential match via email
          if (session.user.needsLinking && session.user.potentialBapId) {
            // TODO: Implement account linking flow
            setError('We found an existing account with your email. Account linking coming soon.');
            setTimeout(() => {
              signOut({ callbackUrl: '/signin' });
            }, 3000);
            return;
          }
          
          // New user - redirect to signup with OAuth info
          console.log('New OAuth user, redirecting to signup');
          // Sign out and redirect to signup - the OAuth info will guide them
          router.push('/signup/oauth');
          return;
        }
        throw new Error(`Failed to fetch backup: ${responseText}`);
      }

      const data = await response.json();
      
      // Store the encrypted backup in localStorage
      localStorage.setItem(STORAGE_KEYS.ENCRYPTED_BACKUP, data.backup);
      
      // Set the encrypted backup in state to show the decrypt form
      setEncryptedBackup(data.backup);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching backup:', err);
      setError('Failed to retrieve your backup. Please try again.');
      setLoading(false);
    }
  }, [session, router]);

  useEffect(() => {
    console.log('OAuth restore - status:', status, 'session:', session);
    
    if (status === 'loading') return;
    
    if (!session?.user) {
      console.log('No session user, redirecting to signin');
      router.push('/signin');
      return;
    }

    console.log('Session exists, fetching backup from OAuth');
    // Try to fetch backup using OAuth info
    fetchBackupFromOAuth();
  }, [session, status, router, fetchBackupFromOAuth]);

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!encryptedBackup) return;

    setDecrypting(true);
    setError('');

    try {
      // Decrypt the backup
      const decrypted = await decryptBackup(encryptedBackup, password) as BapMasterBackup;
      
      if (!decrypted) {
        throw new Error('Invalid backup format');
      }

      // Store encrypted backup in local storage for future sign-ins
      localStorage.setItem(STORAGE_KEYS.ENCRYPTED_BACKUP, encryptedBackup);
      
      // Sign out of OAuth session first
      await signOut({ redirect: false });

      // Sign in with the decrypted backup
      const result = await signInWithBackup(decrypted);

      if (result?.error) {
        throw new Error(result.error);
      }

      // Force a hard redirect to ensure session is properly updated
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Decryption error:', err);
      setError(err instanceof Error ? err.message : 'Failed to decrypt backup');
      setDecrypting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Retrieving your backup...</p>
        </div>
      </div>
    );
  }

  if (error && !encryptedBackup) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-900/20 border border-red-900 rounded-lg p-6">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No Backup Found</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to account creation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Restore Your Wallet</h1>
          <p className="text-gray-400">
            We found your backup. Enter your password to decrypt it.
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleDecrypt} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Encryption Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your encryption password"
              required
              disabled={decrypting}
            />
          </div>

          <button
            type="submit"
            disabled={decrypting || !password}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors"
          >
            {decrypting ? 'Decrypting...' : 'Decrypt & Sign In'}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => signOut({ callbackUrl: '/signin' })}
            className="text-sm text-gray-400 hover:text-white"
          >
            Try a different account
          </button>
        </div>
      </div>
    </div>
  );
}