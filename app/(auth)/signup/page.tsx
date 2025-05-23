'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { type BapMasterBackup, encryptBackup } from 'bitcoin-backup';
import { BAP } from 'bsv-bap';
import Link from 'next/link';
import { HD, Mnemonic } from '@bsv/sdk';
import { getAuthToken } from 'bitcoin-auth';
import { signIn } from 'next-auth/react';

const ENCRYPTED_BACKUP_KEY = 'encryptedBackup';
const DECRYPTED_BACKUP_KEY = 'decryptedBackup';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<'intro' | 'password' | 'confirm'>('intro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bapBackup, setBapBackup] = useState<BapMasterBackup | null>(null);
  const [, setBapId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [oauthInfo, setOauthInfo] = useState<{ provider?: string; email?: string; name?: string } | null>(null);

  useEffect(() => {
    // Check if coming from OAuth
    const oauthSignupInfo = sessionStorage.getItem('oauthSignupInfo');
    if (oauthSignupInfo) {
      try {
        const info = JSON.parse(oauthSignupInfo);
        setOauthInfo(info);
      } catch (err) {
        console.error('Error parsing OAuth info:', err);
      }
    }
  }, []);

  const generateWallet = useCallback(async (label: string) => {
    setLoading(true);
    setError('');

    try {
      // Generate a new BAP identity
      const mnemonic = Mnemonic.fromRandom()
      const seed = mnemonic.toSeed()
      const hdKey = HD.fromSeed(seed)
      const xprv = hdKey.toString()
      const bap = new BAP(xprv);
      const rootId = bap.newId();

      setBapId(rootId.identityKey);
      
      const ids = bap.exportIds()
      // Create BAP master backup
      const backup = {
        xprv,
        ids,
        createdAt: new Date().toISOString(),
        mnemonic: mnemonic.toString(),
        label
      } as BapMasterBackup

      setBapBackup(backup);
      setStep('password');
    } catch (err) {
      console.error('Wallet generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate wallet');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setStep('confirm');
    setError('');
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!bapBackup) {
        throw new Error('No wallet backup found');
      }

      // Encrypt the backup
      const encrypted = await encryptBackup(bapBackup, password);

      // Store encrypted backup locally
      localStorage.setItem(ENCRYPTED_BACKUP_KEY, encrypted);
      
      // Store decrypted backup in session for immediate use
      sessionStorage.setItem(DECRYPTED_BACKUP_KEY, JSON.stringify(bapBackup));

      // Sign in with credentials to create the user account
      const bap = new BAP(bapBackup.xprv);
      bap.importIds(bapBackup.ids);
      const ids = bap.listIds();
      const id = ids[0];
      if (!id) {
        throw new Error('No identity found in backup');
      }

      const master = bap.getId(id);
      const memberBackup = master?.exportMemberBackup();
      const pk = memberBackup?.derivedPrivateKey;
      if (!pk) {
        throw new Error('No private key found');
      }

      // Create auth token and sign in
      const authToken = getAuthToken({
        privateKeyWif: pk,
        requestPath: '/api/auth/signin',
        body: ''
      });

      const result = await signIn('credentials', {
        token: authToken,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
      
      // Check if we have OAuth info from an OAuth-first signup
      const oauthSignupInfo = sessionStorage.getItem('oauthSignupInfo');
      if (oauthSignupInfo) {
        try {
          const { provider, providerAccountId, email } = JSON.parse(oauthSignupInfo);
          
          // Get the BAP ID from the backup
          const bapId = bap.listIds()[0] || bap.newId().identityKey;
          
          // Store the backup with OAuth mapping
          await fetch('/api/backup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              encryptedBackup: encrypted,
              bapId: bapId,
              oauthProvider: provider,
              oauthId: providerAccountId
            })
          });
          
          // Store email mapping if provided
          if (email) {
            // This will be handled by the backup endpoint
          }
          
          sessionStorage.removeItem('oauthSignupInfo');
          
          // Skip OAuth linking page since they're already linked
          router.push('/success');
          return;
        } catch (err) {
          console.error('Error linking OAuth account:', err);
        }
      }

      // Now redirect to OAuth linking with an active session
      router.push('/signup/oauth');
    } catch (err) {
      console.error('Encryption error:', err);
      setError(err instanceof Error ? err.message : 'Failed to encrypt wallet');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {step === 'intro' && (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Welcome to Bitcoin Auth</h1>
              <p className="text-gray-400 mb-8">
                Create your self-sovereign identity with Bitcoin
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Generate Bitcoin Keys</h3>
                  <p className="text-sm text-gray-400">
                    We'll create a unique Bitcoin identity that only you control
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Create Password</h3>
                  <p className="text-sm text-gray-400">
                    Encrypt your keys with a strong password
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Link Cloud Backup</h3>
                  <p className="text-sm text-gray-400">
                    Store encrypted backup for multi-device access
                  </p>
                </div>
              </div>
            </div>

            {oauthInfo && (
              <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <title>Info</title>
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm">
                    <p className="font-semibold text-blue-400 mb-1">Signed in with {oauthInfo.provider}</p>
                    <p className="text-blue-300">
                      Your Bitcoin identity will be automatically linked to your {oauthInfo.provider} account
                      {oauthInfo.email && <> ({oauthInfo.email})</>}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-900 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={() => generateWallet('Default Identity')}
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Generating...' : 'Generate New Bitcoin Identity'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-gray-400">or</span>
              </div>
            </div>

            <label className="cursor-pointer">
              <div className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg font-medium transition-colors text-center">
                Import Existing Identity
              </div>
              <input
                type="file"
                accept=".json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  try {
                    const text = await file.text();
                    // Check if it's an encrypted backup
                    const parsed = JSON.parse(text);
                    if (parsed.encrypted && parsed.encryptedMnemonic) {
                      // It's already encrypted, store it and go to sign in
                      localStorage.setItem(ENCRYPTED_BACKUP_KEY, text);
                      router.push('/signin');
                    } else if (parsed.xprv && parsed.mnemonic) {
                      // It's an unencrypted backup, we need to encrypt it
                      setIsImporting(true);
                      setBapBackup(parsed as BapMasterBackup);
                      if (parsed.ids && parsed.ids.length > 0) {
                        setBapId(parsed.ids[0].id);
                      }
                      setStep('password');
                    } else {
                      throw new Error('Invalid backup format');
                    }
                  } catch {
                    setError('Invalid backup file. Please select a valid backup.');
                  }
                }}
                className="hidden"
              />
            </label>

            <div className="text-center text-sm text-gray-400">
              <p>
                Already have an account?{' '}
                <Link href="/signin" className="text-blue-500 hover:text-blue-400">
                  Sign In
                </Link>
              </p>
            </div>
          </>
        )}

        {step === 'password' && (
          <>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <title>Check</title>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">{isImporting ? 'Identity Imported!' : 'Identity Generated!'}</h2>
              <p className="text-gray-400">
                {isImporting ? 'Create a password to secure your imported identity' : 'Now let\'s secure it with a password'}
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Create Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter a strong password"
                  required
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters. This encrypts your Bitcoin keys.
                </p>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-900 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!password || password.length < 8}
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
          </>
        )}

        {step === 'confirm' && (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Confirm Your Password</h2>
              <p className="text-gray-400">
                Enter your password again to confirm
              </p>
            </div>

            <form onSubmit={handleConfirmSubmit} className="space-y-4">
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
                />
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-900 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !confirmPassword}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Encrypting...' : 'Encrypt & Continue'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('password');
                  setConfirmPassword('');
                  setError('');
                }}
                className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 