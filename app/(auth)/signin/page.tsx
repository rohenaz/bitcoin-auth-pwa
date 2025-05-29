'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { type BapMasterBackup, decryptBackup } from 'bitcoin-backup';
import Link from 'next/link';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { extractIdentityFromBackup } from '@/lib/bap-utils';
import { signInWithBackup, handleFailedLogin } from '@/lib/auth-flows';
import OAuthProviders from '@/components/OAuthProviders';
import { signIn } from 'next-auth/react';
import PasswordInput from '@/components/auth/PasswordInput';
import ErrorDisplay from '@/components/auth/ErrorDisplay';
import LoadingButton from '@/components/auth/LoadingButton';
import BackupImport from '@/components/auth/BackupImport';
import WarningCard from '@/components/auth/WarningCard';


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
    const localBackup = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_BACKUP);
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
        // Check if this is the specific iteration count error
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
          
          // Handle failed login by creating user
          await handleFailedLogin(decrypted, encryptedBackup);
          
          // Redirect to dashboard after successful user creation and login
          window.location.href = callbackUrl;
          return;
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

      // Try to sign in
      const result = await signInWithBackup(importedDecryptedBackup);

      if (result?.error) {
        // If user doesn't exist, create from backup
        if (result.error.includes('User not found')) {
          await handleFailedLogin(importedDecryptedBackup, encrypted);
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

          <ErrorDisplay error={error} />

          <form onSubmit={handleSetPassword} className="space-y-4">
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="Create a strong password"
              disabled={loading}
              showHint={true}
              autoComplete="new-password"
            />

            <LoadingButton
              disabled={password.length < 8}
              loading={loading}
            >
              Continue
            </LoadingButton>
          </form>

          <WarningCard 
            message="This password cannot be recovered. If you forget it, you'll lose access to your Bitcoin identity."
          />
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
            <OAuthProviders
              action="signin"
              onProviderClick={handleOAuthLogin}
              disabled={loading}
            />

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
          <BackupImport 
            onImport={handleImportBackup}
            disabled={loading}
          />
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