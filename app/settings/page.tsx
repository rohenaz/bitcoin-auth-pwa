"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface ConnectedAccount {
  provider: string;
  providerAccountId: string;
  connected: boolean;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const providers = [
    { id: 'google', name: 'Google', icon: '🔗' },
    { id: 'github', name: 'GitHub', icon: '🔗' },
    { id: 'twitter', name: 'X (Twitter)', icon: '🔗' },
  ];

  useEffect(() => {
    if (session?.user) {
      fetchConnectedAccounts();
    }
  }, [session]);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetch('/api/users/connected-accounts');
      if (response.ok) {
        const accounts = await response.json();
        setConnectedAccounts(accounts);
      }
    } catch (error) {
      console.error('Failed to fetch connected accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = async (provider: string) => {
    await signIn(provider, { 
      callbackUrl: '/settings?connected=' + provider 
    });
  };

  const handleDisconnectAccount = async (provider: string) => {
    try {
      const response = await fetch('/api/users/disconnect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });

      if (response.ok) {
        await fetchConnectedAccounts();
      }
    } catch (error) {
      console.error('Failed to disconnect account:', error);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please sign in to access settings</p>
          <Link 
            href="/signin"
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Link 
            href="/dashboard"
            className="text-gray-400 hover:text-white transition-colors mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-400 mt-2">
            Manage your account settings and connected backup anchors
          </p>
        </div>

        {/* Account Overview */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Bitcoin Address</span>
              <span className="font-mono text-sm bg-gray-800 px-3 py-1 rounded">
                {session.user.address || session.user.id}
              </span>
            </div>
            {session.user.idKey && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">BAP Identity Key</span>
                <span className="font-mono text-sm bg-gray-800 px-3 py-1 rounded">
                  {session.user.idKey.substring(0, 12)}...
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Session Provider</span>
              <span className="capitalize text-orange-400">
                {session.user.provider || 'bitcoin'}
              </span>
            </div>
          </div>
        </div>

        {/* Connected Backup Anchors */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Backup Anchors</h2>
          <p className="text-gray-400 text-sm mb-6">
            OAuth providers used to store your encrypted backup across devices. 
            Link multiple providers for redundancy.
          </p>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {providers.map((provider) => {
                const isConnected = connectedAccounts.some(
                  account => account.provider === provider.id && account.connected
                );
                
                return (
                  <div 
                    key={provider.id}
                    className="flex items-center justify-between p-4 border border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-sm text-gray-400">
                          {isConnected ? 'Connected' : 'Not connected'}
                        </div>
                      </div>
                    </div>
                    
                    {isConnected ? (
                      <button
                        onClick={() => handleDisconnectAccount(provider.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Disconnect
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnectAccount(provider.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Security Settings */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <Link
              href="/settings/security"
              className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <div className="font-medium">Security Settings</div>
                  <div className="text-sm text-gray-400">
                    Manage encryption and backup security
                  </div>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-red-400">Danger Zone</h2>
          <p className="text-gray-400 text-sm mb-4">
            These actions are permanent and cannot be undone.
          </p>
          
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}