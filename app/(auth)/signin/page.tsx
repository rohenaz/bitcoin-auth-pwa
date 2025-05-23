'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { type BapMasterBackup, decryptBackup } from 'bitcoin-backup';
import { getAuthToken } from 'bitcoin-auth';
import Link from 'next/link';
import { BAP } from 'bsv-bap';

const DECRYPTED_BACKUP_KEY = 'decryptedBackup';
const ENCRYPTED_BACKUP_KEY = 'encryptedBackup';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasLocalBackup, setHasLocalBackup] = useState(false);
  const [password, setPassword] = useState('');
  const [showOAuthProviders, setShowOAuthProviders] = useState(false);
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
      sessionStorage.setItem(DECRYPTED_BACKUP_KEY, JSON.stringify(decrypted));
      

      // get the first key from the bap master backup
      const bap = new BAP(decrypted.xprv)
      const ids = bap.listIds()
      let id = ids[0]
      if (!id) {
        id = bap.newId().identityKey
      }
      const master = bap.getId(id)
      const membedBackup = master?.exportMemberBackup();
      const pk = membedBackup?.derivedPrivateKey;
      if (!pk) {
        throw new Error('No private key found in backup')
      }

      // Create the auth token
      const authToken = getAuthToken({
        privateKeyWif: pk,
        requestPath: '/api/auth/signin',
        body: ''
      });

      console.log('Signing in with auth token:', authToken);

      // Sign in with Bitcoin credentials
      const result = await signIn('credentials', {
        token: authToken,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push(callbackUrl);
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
    signIn(provider, { callbackUrl: '/signin/oauth-restore' });
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      // Validate it's a proper encrypted backup
      const parsed = JSON.parse(text);
      if (!parsed.encrypted || !parsed.encryptedMnemonic) {
        throw new Error('Invalid backup file format');
      }
      setHasLocalBackup(true);
      setShowOAuthProviders(false);
      // Store in localStorage
      localStorage.setItem(ENCRYPTED_BACKUP_KEY, text);
    } catch {
      setError('Invalid backup file. Please select a valid encrypted backup.');
    }
  };

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
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm font-medium">Import Backup File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
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