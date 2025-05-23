'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function OAuthPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState('');
  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);

  useEffect(() => {
    // Check if we have the decrypted backup in session
    const decryptedBackup = sessionStorage.getItem('decryptedBackup');
    if (!decryptedBackup) {
      // If no backup, redirect to signup
      router.push('/signup');
      return;
    }

    // Check if we're returning from OAuth linking
    const handleOAuthReturn = async () => {
      const linkingData = sessionStorage.getItem('oauth_linking');
      if (linkingData && session?.user?.provider && session.user.provider !== 'credentials') {
        try {
          const { bapId, provider } = JSON.parse(linkingData);
          const encryptedBackup = localStorage.getItem('encryptedBackup');
          
          if (encryptedBackup && provider === session.user.provider) {
            // Store the backup with OAuth mapping
            const response = await fetch('/api/backup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                encryptedBackup,
                bapId,
                oauthProvider: session.user.provider,
                oauthId: session.user.id
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

              // Sign back in with Bitcoin credentials
              const backup = JSON.parse(decryptedBackup);
              const { BAP } = await import('bsv-bap');
              const { getAuthToken } = await import('bitcoin-auth');
              const { signIn } = await import('next-auth/react');
              
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

                  await signIn('credentials', {
                    token: authToken,
                    redirect: false,
                  });
                }
              }
            }

            // Clean up
            sessionStorage.removeItem('oauth_linking');
          }
        } catch (err) {
          console.error('Error handling OAuth return:', err);
        }
      }
    };

    handleOAuthReturn();
  }, [session, router]);

  const handleOAuthLink = async (provider: string) => {
    try {
      // Store backup info in session storage for after OAuth
      const encryptedBackup = localStorage.getItem('encryptedBackup');
      const decryptedBackup = sessionStorage.getItem('decryptedBackup');
      if (!encryptedBackup || !decryptedBackup || !session?.user?.id) {
        throw new Error('Missing backup or session');
      }

      // Store info for after OAuth callback
      sessionStorage.setItem('oauth_linking', JSON.stringify({
        bapId: session.user.id,
        provider,
        address: session.user.address,
        idKey: session.user.idKey
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

    // We should already be signed in from the signup flow
    if (!session?.user) {
      router.push('/signin');
      return;
    }

    // Store the backup if we haven't already
    const encryptedBackup = localStorage.getItem('encryptedBackup');
    if (encryptedBackup && linkedProviders.length > 0) {
      try {
        await fetch('/api/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            encryptedBackup,
            bapId: session.user.id
          })
        });
      } catch (err) {
        console.error('Error storing backup:', err);
      }
    }

    // Redirect to success/dashboard
    router.push('/success');
  };

  const providers = [
    {
      id: 'google',
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <title>Google</title>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <title>GitHub</title>
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
    {
      id: 'twitter',
      name: 'X',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <title>X</title>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
  ];

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

        <div className="space-y-3">
          {providers.map((provider) => {
            const isLinked = linkedProviders.includes(provider.id);
            return (
              <button
                type="button"
                key={provider.id}
                onClick={() => !isLinked && handleOAuthLink(provider.id)}
                disabled={isLinked}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-between ${
                  isLinked
                    ? 'bg-green-900/20 border-green-900 border cursor-default'
                    : 'bg-gray-900 hover:bg-gray-800 border border-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {provider.icon}
                  <span>{provider.name}</span>
                </div>
                {isLinked && (
                  <div className="flex items-center text-green-500 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <title>Linked</title>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Linked
                  </div>
                )}
              </button>
            );
          })}
        </div>

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
    </div>
  );
} 