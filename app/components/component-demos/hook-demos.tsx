/**
 * Hook Demos
 */

import React from 'react';
import { 
  useBitcoinAuth,
  useHandCash,
  useYoursWallet,
  useAuthMessages
} from 'bigblocks';
import type { ComponentDemo } from './index';

export const hookDemos: Array<[string, ComponentDemo]> = [
  [
    'use-bitcoin-auth',
    {
      id: 'use-bitcoin-auth',
      render: () => {
        const BitcoinAuthDemo = () => {
          const {
            user,
            isAuthenticated,
            isLoading,
            signIn,
            signUp,
            signOut,
            reset
          } = useBitcoinAuth();

          return (
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold">useBitcoinAuth Hook Demo</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
                <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
                <div><strong>User:</strong> {user ? `${user.id?.slice(0, 8)}...` : 'None'}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => signIn('demo-password')}
                  disabled={isLoading}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => signUp('demo-password')}
                  disabled={isLoading}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
                >
                  Sign Up
                </button>
                <button
                  onClick={signOut}
                  disabled={!isAuthenticated}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                >
                  Sign Out
                </button>
                <button
                  onClick={reset}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>
          );
        };
        
        return <BitcoinAuthDemo />;
      }
    }
  ],
  [
    'use-handcash',
    {
      id: 'use-handcash',
      render: () => {
        const HandCashDemo = () => {
          const {
            isConnected,
            profile,
            authToken,
            startOAuth,
            disconnect
          } = useHandCash({
            appId: "demo-app-id",
            redirectUrl: "/auth/handcash",
            environment: "prod"
          });

          return (
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold">useHandCash Hook Demo</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</div>
                <div><strong>Profile:</strong> {profile ? profile.displayName || 'Connected' : 'None'}</div>
                <div><strong>Auth Token:</strong> {authToken ? 'Present' : 'None'}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={startOAuth}
                  disabled={isConnected}
                  className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
                >
                  Connect HandCash
                </button>
                <button
                  onClick={disconnect}
                  disabled={!isConnected}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                >
                  Disconnect
                </button>
              </div>
            </div>
          );
        };
        
        return <HandCashDemo />;
      }
    }
  ],
  [
    'use-yours-wallet',
    {
      id: 'use-yours-wallet',
      render: () => {
        const YoursWalletDemo = () => {
          const {
            isInstalled,
            isConnected,
            publicKey,
            connect,
            disconnect
          } = useYoursWallet();

          return (
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold">useYoursWallet Hook Demo</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Installed:</strong> {isInstalled ? 'Yes' : 'No'}</div>
                <div><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</div>
                <div><strong>Public Key:</strong> {publicKey ? `${publicKey.slice(0, 8)}...` : 'None'}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={connect}
                  disabled={!isInstalled || isConnected}
                  className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 disabled:opacity-50"
                >
                  Connect Yours
                </button>
                <button
                  onClick={disconnect}
                  disabled={!isConnected}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                >
                  Disconnect
                </button>
              </div>
              {!isInstalled && (
                <p className="text-xs text-amber-600">Yours Wallet extension not detected</p>
              )}
            </div>
          );
        };
        
        return <YoursWalletDemo />;
      }
    }
  ],
  [
    'use-auth-messages',
    {
      id: 'use-auth-messages',
      render: () => {
        const AuthMessagesDemo = () => {
          const messages = useAuthMessages();

          return (
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold">useAuthMessages Hook Demo</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Messages:</strong> {JSON.stringify(messages)}
                </div>
                <p className="text-gray-500">This hook provides customizable authentication messages</p>
              </div>
            </div>
          );
        };
        
        return <AuthMessagesDemo />;
      }
    }
  ]
];