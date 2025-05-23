'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { decryptBackup, type BapMasterBackup } from 'bitcoin-backup';
import { BAP } from 'bsv-bap';
import { getAuthToken } from 'bitcoin-auth';
import { signIn } from 'next-auth/react';
import type { DeviceLinkValidateResponse } from '@/types/device-link';

const DECRYPTED_BACKUP_KEY = 'decryptedBackup';
const ENCRYPTED_BACKUP_KEY = 'encryptedBackup';

function LinkDeviceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tokenData, setTokenData] = useState<{
    bapId: string;
    address: string;
    idKey: string;
  } | null>(null);
  const [password, setPassword] = useState('');
  const [decrypting, setDecrypting] = useState(false);
  const [encryptedBackup, setEncryptedBackup] = useState<string | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('No token provided');
        setLoading(false);
        return;
      }

      try {
        // Validate the token
        const response = await fetch('/api/device-link/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Invalid or expired token');
        }

        const data: DeviceLinkValidateResponse = await response.json();
        setTokenData(data);
        
        // Check if we already have the backup
        const existingBackup = localStorage.getItem(ENCRYPTED_BACKUP_KEY);
        if (existingBackup) {
          // User already has backup, just sign them in
          router.push('/signin');
          return;
        }
        
        // Fetch the encrypted backup
        if (data.encryptedBackup) {
          setEncryptedBackup(data.encryptedBackup);
          setLoading(false);
        } else {
          throw new Error('No backup found for this account');
        }
      } catch (err) {
        console.error('Token validation error:', err);
        setError(err instanceof Error ? err.message : 'Failed to validate token');
        setLoading(false);
      }
    };

    validateToken();
  }, [searchParams, router]);

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!encryptedBackup || !tokenData) return;

    setDecrypting(true);
    setError('');

    try {
      // Decrypt the backup
      const decrypted = await decryptBackup(encryptedBackup, password) as BapMasterBackup;
      
      if (!decrypted || !decrypted.xprv) {
        throw new Error('Invalid password or corrupted backup');
      }

      // Store in session storage
      sessionStorage.setItem(DECRYPTED_BACKUP_KEY, JSON.stringify(decrypted));
      
      // Store encrypted backup in local storage for future sign-ins
      localStorage.setItem(ENCRYPTED_BACKUP_KEY, encryptedBackup);
      
      // Get private key for auth
      const bap = new BAP(decrypted.xprv);
      bap.importIds(decrypted.ids);
      const ids = bap.listIds();
      const id = ids[0];
      
      if (!id) {
        throw new Error('No identity found in backup');
      }
      
      const master = bap.getId(id);
      const memberBackup = master?.exportMemberBackup();
      const pk = memberBackup?.derivedPrivateKey;
      
      if (!pk) {
        throw new Error('No private key found in backup');
      }

      // Create auth token
      const authToken = getAuthToken({
        privateKeyWif: pk,
        requestPath: '/api/auth/signin',
        body: ''
      });

      // Sign in with Bitcoin credentials
      const result = await signIn('credentials', {
        token: authToken,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Redirect to dashboard
      router.push('/dashboard');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-400">Validating device link...</p>
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
              <title>Error</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Link Failed</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => router.push('/signin')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <title>Device Link</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Link This Device</h1>
          <p className="text-gray-400">
            Enter your password to access your Bitcoin identity on this device
          </p>
        </div>

        {tokenData && (
          <div className="bg-gray-900 rounded-lg p-4 text-sm">
            <p className="text-gray-400">Linking to account:</p>
            <p className="font-mono text-xs mt-1">{tokenData.address}</p>
          </div>
        )}

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
            {decrypting ? 'Decrypting...' : 'Link Device & Sign In'}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push('/signin')}
            className="text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LinkDevicePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <LinkDeviceContent />
    </Suspense>
  );
}