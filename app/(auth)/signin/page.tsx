'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { type BapMasterBackup, decryptBackup } from 'bitcoin-backup';
import { getAuthToken } from 'bitcoin-auth';
import Link from 'next/link';
import { BAP } from 'bsv-bap';
import { PrivateKey } from '@bsv/sdk';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { extractIdentityFromBackup, createAuthTokenFromBackup } from '@/lib/bap-utils';


function SignInPageContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasLocalBackup, setHasLocalBackup] = useState(false);
  const [password, setPassword] = useState('');
  const [showOAuthProviders, setShowOAuthProviders] = useState(false);
  const [importedDecryptedBackup, setImportedDecryptedBackup] = useState<BapMasterBackup | null>(null);
  const [step, setStep] = useState<'signin' | 'setPassword' | 'confirmPassword'>('signin');
  const [confirmPassword, setConfirmPassword] = useState('');
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  useEffect(() => {
    // Check if user has local backup
    const localBackup = localStorage.getItem('encryptedBackup');
    if (localBackup) {
      setHasLocalBackup(true);
    } else {
      setShowOAuthProviders(true);
    }
  }, []);

  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const encryptedBackup = localStorage.getItem('encryptedBackup');
      if (!encryptedBackup) {
        throw new Error('No local backup found');
      }

      // Decrypt the backup with the password
      const decrypted = await decryptBackup(encryptedBackup, password) as BapMasterBackup

      if (!decrypted) {
        throw new Error('Invalid backup format');
      }

      // Store WIF in session storage for authenticated requests
      sessionStorage.setItem(STORAGE_KEYS.DECRYPTED_BACKUP, JSON.stringify(decrypted));


      // Extract identity and create auth token
      const identity = extractIdentityFromBackup(decrypted);
      const authToken = createAuthTokenFromBackup(decrypted, '/api/auth/signin');

      console.log('Signing in with auth token:', authToken);
      console.log('BAP ID:', identity.id);
      console.log('Address:', identity.address);

      // Sign in with Bitcoin credentials
      const result = await signIn('credentials', {
        token: authToken,
        redirect: false,
      });

      if (result?.error) {
        // If user not found, try to create the user record
        if (result.error.includes('User not found')) {
          console.log('User not found, creating user record...');

          // Also store the encrypted backup if we have it
          const encryptedBackup = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_BACKUP);

          // Create auth token for user creation
          const createUserToken = getAuthToken({
            privateKeyWif: identity.privateKey,
            requestPath: '/api/users/create-from-backup',
            body: JSON.stringify({ bapId: identity.id, address: identity.address, encryptedBackup })
          });

          const createResponse = await fetch('/api/users/create-from-backup', {
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

          if (!createResponse.ok) {
            const errorData = await createResponse.json();
            console.error('Failed to create user:', errorData);
            throw new Error(errorData.error || 'Failed to create user');
          }

          // Try signing in again
          const retryResult = await signIn('credentials', {
            token: authToken,
            redirect: false,
          });

          if (retryResult?.ok) {
            window.location.href = callbackUrl;
            return;
          }
          console.error('Retry login failed:', retryResult);
          throw new Error(retryResult?.error || 'Failed to sign in after creating user');
        }

        throw new Error(result.error);
      }

      if (result?.ok) {
        // Ensure we're redirecting to the dashboard
        window.location.href = callbackUrl;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login');
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    setLoading(true);
    // For existing users signing in from new device
    // This will fail in the OAuth callback if no backup is found
    signIn(provider, {
      callbackUrl: '/signin/oauth-restore',
      redirect: true
    });
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setError('');
    setStep('confirmPassword');
  };

  const handleConfirmPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!importedDecryptedBackup) {
      setError('No backup data found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Import encryptBackup
      const { encryptBackup } = await import('bitcoin-backup');

      // Encrypt the backup
      const encrypted = await encryptBackup(importedDecryptedBackup, password);

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.ENCRYPTED_BACKUP, encrypted);

      // Store decrypted in sessionStorage
      sessionStorage.setItem(STORAGE_KEYS.DECRYPTED_BACKUP, JSON.stringify(importedDecryptedBackup));

      // Get private key for auth
      const bap = new BAP(importedDecryptedBackup.xprv);
      bap.importIds(importedDecryptedBackup.ids);
      const ids = bap.listIds();

      if (ids.length === 0) {
        throw new Error('No identities in backup');
      }

      const firstId = ids[0];
      if (!firstId) {
        throw new Error('No identity found');
      }

      const identityInstance = bap.getId(firstId);
      if (!identityInstance) {
        throw new Error('Could not get identity instance');
      }

      const memberBackup = identityInstance.exportMemberBackup();
      if (!memberBackup || !memberBackup.derivedPrivateKey) {
        throw new Error('Could not derive private key');
      }

      // Get address for user creation
      const pubkey = PrivateKey.fromWif(memberBackup.derivedPrivateKey).toPublicKey();
      const address = pubkey.toAddress();

      // Create auth token
      const authToken = getAuthToken({
        privateKeyWif: memberBackup.derivedPrivateKey,
        requestPath: '/api/auth/signin',
        body: ''
      });

      // Try to sign in
      const result = await signIn('credentials', {
        token: authToken,
        redirect: false,
      });

      if (result?.error) {
        // If user doesn't exist, create from backup
        if (result.error.includes('User not found')) {
          const createUserToken = getAuthToken({
            privateKeyWif: memberBackup.derivedPrivateKey,
            requestPath: '/api/users/create-from-backup',
            body: JSON.stringify({ bapId: firstId, address, encryptedBackup: encrypted })
          });

          const createResult = await fetch('/api/users/create-from-backup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Auth-Token': createUserToken
            },
            body: JSON.stringify({
              bapId: firstId,
              address,
              encryptedBackup: encrypted
            })
          });

          if (!createResult.ok) {
            const errorData = await createResult.json();
            throw new Error(errorData.error || 'Failed to create user');
          }

          // Try signing in again
          const retryResult = await signIn('credentials', {
            token: authToken,
            redirect: false,
          });

          if (retryResult?.error) {
            throw new Error(retryResult.error);
          }
        } else {
          throw new Error(result.error);
        }
      }

      // Success - redirect to dashboard
      window.location.href = callbackUrl;
    } catch (err) {
      console.error('Password confirmation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete import');
      setLoading(false);
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      let isUnencrypted = false;
      let decryptedBackup: BapMasterBackup | null = null;

      // First, check if it's an unencrypted backup (BapMasterBackup)
      try {
        const parsed = JSON.parse(text);
        // Check for BapMasterBackup structure
        if (parsed.xprv && parsed.ids && parsed.mnemonic) {
          isUnencrypted = true;
          decryptedBackup = parsed as BapMasterBackup;
        }
      } catch {
        // Not JSON, likely encrypted
      }

      if (isUnencrypted && decryptedBackup) {
        // Handle unencrypted backup - prompt for password
        setError('');
        setImportedDecryptedBackup(decryptedBackup);
        setStep('setPassword');
        setHasLocalBackup(false);
        setShowOAuthProviders(false);
        return;
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
        // Encrypted strings from bitcoin-backup are typically long base64-like strings
        if (text.length > 100 && /^[A-Za-z0-9+/=]+$/.test(text.trim())) {
          isValid = true;
        }
      }

      if (!isValid) {
        throw new Error('Invalid backup file format');
      }

      setHasLocalBackup(true);
      setShowOAuthProviders(false);
      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.ENCRYPTED_BACKUP, text.trim());
    } catch (err) {
      console.error('Import error:', err);
      setError('Invalid backup file. Please select a valid backup (encrypted or decrypted).');
      setLoading(false);
    }
  };

  // Handle password creation flow for imported decrypted backups
  if (step === 'setPassword' && importedDecryptedBackup) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Set Your Password</h1>
            <p className="text-gray-400">
              Create a password to encrypt your imported wallet
            </p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-900 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Create a strong password"
                required
                minLength={8}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 8 characters. This encrypts your Bitcoin keys.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || password.length < 8}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors"
            >
              Continue
            </button>
          </form>

          <div className="bg-amber-900/20 border border-amber-900 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <title>Warning</title>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-amber-500 mb-1">Important</p>
                <p className="text-amber-400/80">
                  This password cannot be recovered. If you forget it, you'll lose access to your Bitcoin identity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'confirmPassword' && importedDecryptedBackup) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Confirm Your Password</h1>
            <p className="text-gray-400">
              Enter your password again to confirm
            </p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-900 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleConfirmPassword} className="space-y-4">
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Re-enter your password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !confirmPassword}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Importing...' : 'Complete Import'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Default signin view
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">
            {hasLocalBackup ? 'Enter your password to decrypt your wallet' : 'Sign in with your linked account'}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {hasLocalBackup && !showOAuthProviders ? (
          <form onSubmit={handleLocalLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Unlocking...' : 'Unlock Wallet'}
            </button>


          </form>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-950 border border-gray-800 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <title>Google</title>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-950 border border-gray-800 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <title>GitHub</title>
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin('twitter')}
              disabled={loading}
              className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-950 border border-gray-800 rounded-lg font-medium transition-colors flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <title>X</title>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Continue with X</span>
            </button>

            {hasLocalBackup && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowOAuthProviders(false)}
                  className="text-blue-500 hover:text-blue-400 text-sm"
                >
                  Use local backup instead
                </button>
              </div>
            )}
          </div>
        )}

        {!hasLocalBackup && (
          <div className="border-t border-gray-800 pt-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-400 mb-3">Or import your existing backup</p>
              <label className="cursor-pointer inline-flex items-center space-x-2 text-blue-500 hover:text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <title>Import</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm font-medium">Import Backup File</span>
                <input
                  type="file"
                  accept=".json,.txt"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Supports both encrypted and decrypted backups</p>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-400">
          <p>
            Need a new identity?{' '}
            <Link href="/signup" className="text-blue-500 hover:text-blue-400">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    }>
      <SignInPageContent />
    </Suspense>
  );
} 