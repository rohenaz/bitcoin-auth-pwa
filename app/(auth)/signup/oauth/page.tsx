'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import OAuthProviders from '@/components/OAuthProviders';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import OAuthConflictModal from '@/components/OAuthConflictModal';

export default function OAuthPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState('');
  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);
  const [conflictModal, setConflictModal] = useState<{
    isOpen: boolean;
    provider: string;
    existingBapId: string;
  } | null>(null);

  useEffect(() => {
    // Check if this is an OAuth-only user without Bitcoin credentials
    if (session?.user?.isOAuthOnly && !sessionStorage.getItem(STORAGE_KEYS.DECRYPTED_BACKUP)) {
      console.log('OAuth-only user detected, redirecting to create Bitcoin identity');
      // Store OAuth info for after identity creation
      sessionStorage.setItem(STORAGE_KEYS.OAUTH_SIGNUP_INFO, JSON.stringify({
        provider: session.user.provider,
        providerAccountId: session.user.providerAccountId,
        email: session.user.email,
        name: session.user.name
      }));
      // Redirect to main signup to create Bitcoin identity
      router.push('/signup');
      return;
    }
    
    // Check if we have the decrypted backup in session
    const decryptedBackup = sessionStorage.getItem(STORAGE_KEYS.DECRYPTED_BACKUP);
    if (!decryptedBackup) {
      // If no backup and not OAuth-only, redirect to signup
      router.push('/signup');
      return;
    }

    // Check if we're returning from OAuth linking
    const handleOAuthReturn = async () => {
      const linkingData = sessionStorage.getItem(STORAGE_KEYS.OAUTH_LINKING);
      if (linkingData && session?.user?.provider && session.user.provider !== 'credentials') {
        try {
          const { bapId, provider } = JSON.parse(linkingData);
          const encryptedBackup = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_BACKUP);
          
          if (encryptedBackup && provider === session.user.provider) {
            // Extract provider account ID from the OAuth session
            let providerAccountId = session.user.providerAccountId;
            
            // If not available, try to extract from composite ID
            if (!providerAccountId && session.user.id.includes('-')) {
              // OAuth user ID format: "provider-providerAccountId"
              const parts = session.user.id.split('-');
              if (parts[0] === session.user.provider) {
                providerAccountId = parts.slice(1).join('-'); // Handle IDs with dashes
              }
            }
            
            if (!providerAccountId) {
              console.error('Could not extract provider account ID');
              throw new Error('Invalid OAuth session');
            }
            
            console.log('Storing backup with OAuth mapping:', {
              provider: session.user.provider,
              providerAccountId,
              bapId
            });
            
            // Store the backup with OAuth mapping
            const response = await fetch('/api/backup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                encryptedBackup,
                bapId,
                oauthProvider: session.user.provider,
                oauthId: providerAccountId
              })
            });

            if (response.ok) {
              // Mark provider as linked
              setLinkedProviders(prev => {
                if (!prev.includes(provider)) {
                  return [...prev, provider];
                }
                return prev;
              });
              
              console.log('✅ OAuth account linked successfully');
              // Continue to sign back in with Bitcoin credentials below
            } else if (response.status === 409) {
              // OAuth account already linked to another identity
              const data = await response.json();
              setConflictModal({
                isOpen: true,
                provider: session.user.provider,
                existingBapId: data.existingBapId
              });
              return;
            } else {
              // Other error - don't continue with sign-in
              console.error('Failed to store backup:', response.status);
              setError('Failed to link account. Please try again.');
              return;
            }

            // Sign back in with Bitcoin credentials
            const backup = JSON.parse(decryptedBackup);
            const { BAP } = await import('bsv-bap');
            const { getAuthToken } = await import('bitcoin-auth');
            const { signIn, signOut } = await import('next-auth/react');
            
            const bap = new BAP(backup.xprv);
            bap.importIds(backup.ids);
            const ids = bap.listIds();
            const id = ids[0];
            
            if (id) {
              const master = bap.getId(id);
              const memberBackup = master?.exportMemberBackup();
              const pk = memberBackup?.derivedPrivateKey;
              
              if (pk) {
                const authToken = getAuthToken({
                  privateKeyWif: pk,
                  requestPath: '/api/auth/signin',
                  body: ''
                });

                // Sign out of OAuth session first
                console.log('🔄 Signing out of OAuth session...');
                await signOut({ redirect: false });

                // Add a small delay to ensure sign out completes
                await new Promise(resolve => setTimeout(resolve, 500));

                console.log('🔐 Signing in with Bitcoin credentials...');
                const result = await signIn('credentials', {
                  token: authToken,
                  redirect: false,
                });
                
                console.log('🔐 Sign in result:', result);
                
                if (result?.ok) {
                  // Successfully signed back in with Bitcoin credentials
                  console.log('✅ Successfully signed in with Bitcoin credentials');
                  // Clean up and redirect
                  sessionStorage.removeItem(STORAGE_KEYS.OAUTH_LINKING);
                  router.push('/dashboard');
                  return;
                }
                
                console.error('❌ Failed to sign in with Bitcoin credentials:', result?.error);
                // Don't leave user in limbo - redirect to signin
                router.push('/signin');
              }
            }

            // Clean up
            sessionStorage.removeItem(STORAGE_KEYS.OAUTH_LINKING);
          }
        } catch (err) {
          console.error('Error handling OAuth return:', err);
          // Don't leave user stuck - redirect to signin
          router.push('/signin');
        }
      }
    };

    handleOAuthReturn();
  }, [session, router]);

  const handleOAuthLink = async (provider: string) => {
    try {
      // Store backup info in session storage for after OAuth
      const encryptedBackup = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_BACKUP);
      const decryptedBackup = sessionStorage.getItem(STORAGE_KEYS.DECRYPTED_BACKUP);
      
      if (!encryptedBackup || !decryptedBackup) {
        throw new Error('No backup found. Please complete signup first.');
      }
      
      // Always extract BAP ID from backup, don't rely on session during signup
      const backup = JSON.parse(decryptedBackup);
      const { BAP } = await import('bsv-bap');
      const bap = new BAP(backup.xprv);
      bap.importIds(backup.ids);
      const bapId = bap.listIds()[0];
      
      if (!bapId) {
        throw new Error('No identity found in backup');
      }
      
      // Extract address from backup
      const master = bap.getId(bapId);
      const memberBackup = master?.exportMemberBackup();
      if (!memberBackup?.derivedPrivateKey) {
        throw new Error('Invalid backup format');
      }
      
      const { PrivateKey } = await import('@bsv/sdk');
      const pubkey = PrivateKey.fromWif(memberBackup.derivedPrivateKey).toPublicKey();
      const address = pubkey.toAddress().toString();
      
      // Store info for after OAuth callback
      sessionStorage.setItem(STORAGE_KEYS.OAUTH_LINKING, JSON.stringify({
        bapId,
        provider,
        address,
        idKey: bapId
      }));

      // Sign in with OAuth provider
      await signIn(provider, {
        callbackUrl: '/signup/oauth',
        redirect: true,
      });
    } catch (err) {
      console.error('OAuth link error:', err);
      setError(err instanceof Error ? err.message : 'Failed to link account');
    }
  };

  const handleContinue = async () => {
    if (linkedProviders.length === 0 && !window.confirm('Continue without linking any accounts? This means you won\'t be able to access your identity from other devices.')) {
      return;
    }

    // Get BAP ID from backup instead of session
    const decryptedBackup = sessionStorage.getItem(STORAGE_KEYS.DECRYPTED_BACKUP);
    if (!decryptedBackup) {
      router.push('/signin');
      return;
    }

    try {
      const backup = JSON.parse(decryptedBackup);
      const { BAP } = await import('bsv-bap');
      const bap = new BAP(backup.xprv);
      bap.importIds(backup.ids);
      const bapId = bap.listIds()[0];

      if (!bapId) {
        throw new Error('No identity found in backup');
      }

      // Store the backup if we haven't already and have linked providers
      const encryptedBackup = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_BACKUP);
      if (encryptedBackup && linkedProviders.length > 0) {
        try {
          await fetch('/api/backup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              encryptedBackup,
              bapId
            })
          });
        } catch (err) {
          console.error('Error storing backup:', err);
        }
      }

      // Redirect to success/dashboard
      router.push('/success');
    } catch (err) {
      console.error('Error processing backup:', err);
      setError('Failed to process backup. Please try again.');
    }
  };


  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <title>Bitcoin-Auth</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Secure Your Backup</h1>
          <p className="text-gray-400">
            Link cloud providers to enable multi-device access
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="font-semibold mb-4">Why link multiple accounts?</h2>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <title>Access your identity from any device</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Access your identity from any device</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <title>Redundant backups across providers</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Redundant backups across providers</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <title>Never lose access to your Bitcoin identity</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Never lose access to your Bitcoin identity</span>
            </li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <OAuthProviders
          action="link"
          linkedProviders={linkedProviders}
          onProviderClick={handleOAuthLink}
          callbackUrl="/signup/oauth"
        />

        <div className="text-center text-sm text-gray-500">
          <p className="mb-4">
            {linkedProviders.length === 0 
              ? 'Link at least one account to continue'
              : `${linkedProviders.length} account${linkedProviders.length > 1 ? 's' : ''} linked`
            }
          </p>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={linkedProviders.length === 0}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors"
        >
          {linkedProviders.length === 0 ? 'Link an Account to Continue' : 'Continue to Dashboard'}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleContinue}
            className="text-gray-500 hover:text-gray-400 text-sm"
          >
            Skip for now (not recommended)
          </button>
        </div>
      </div>

      {conflictModal && (
        <OAuthConflictModal
          isOpen={conflictModal.isOpen}
          onClose={() => setConflictModal(null)}
          provider={conflictModal.provider}
          existingBapId={conflictModal.existingBapId}
          currentBapId={session?.user?.id || ''}
          onTransferComplete={() => {
            // Mark provider as linked and close modal
            setLinkedProviders(prev => [...prev, conflictModal.provider]);
            setConflictModal(null);
            setError('');
          }}
          onSwitchAccount={() => {
            // Redirect to signin to use existing account
            router.push('/signin');
          }}
        />
      )}
    </div>
  );
} 