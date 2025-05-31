/**
 * OAuth & Wallet Integration Component Demos
 */

import React from 'react';
import { 
  OAuthProviders,
  HandCashConnector,
  YoursWalletConnector,
  OAuthConflictModal,
  OAuthRestoreForm
} from 'bitcoin-auth-ui';
import type { ComponentDemo } from './index';

export const oauthWalletDemos: Array<[string, ComponentDemo]> = [
  [
    'oauth-providers',
    {
      id: 'oauth-providers',
      render: () => {
        const OAuthProvidersDemo = () => {          
          return (
            <div className="space-y-4">
              <OAuthProviders
                onProviderClick={(provider) => {
                  console.log('OAuth provider clicked:', provider);
                }}
              />
              <p className="text-sm text-gray-500">OAuth provider selection for connecting accounts</p>
            </div>
          );
        };
        
        return <OAuthProvidersDemo />;
      }
    }
  ],
  [
    'handcash-connector',
    {
      id: 'handcash-connector',
      render: (props) => (
        <div className="space-y-4">
          <HandCashConnector
            config={{
              appId: "demo-app-id",
              redirectUrl: "/auth/handcash",
              environment: "prod"
            }}
            onSuccess={(result) => {
              console.log('HandCash connected:', result);
              props.onSuccess?.(result);
            }}
            onError={(error) => {
              console.error('HandCash connection error:', error);
              props.onError?.(error);
            }}
          />
          <p className="text-sm text-gray-500">Connect to HandCash wallet for payments and identity</p>
        </div>
      )
    }
  ],
  [
    'yours-wallet-connector',
    {
      id: 'yours-wallet-connector',
      render: (props) => (
        <div className="space-y-4">
          <YoursWalletConnector
            onSuccess={(result) => {
              console.log('Yours Wallet connected:', result);
              props.onSuccess?.(result);
            }}
            onError={(error) => {
              console.error('Yours Wallet connection error:', error);
              props.onError?.(error);
            }}
          />
          <p className="text-sm text-gray-500">Connect to Yours Wallet browser extension</p>
        </div>
      )
    }
  ],
  [
    'oauth-conflict-modal',
    {
      id: 'oauth-conflict-modal',
      render: () => {
        const OAuthConflictDemo = () => {
          const [isOpen, setIsOpen] = React.useState(false);
          
          return (
            <div>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Simulate OAuth Conflict
              </button>
              <OAuthConflictModal
                isOpen={isOpen}
                provider="google"
                existingBapId="existing-bap-id-123"
                currentBapId="current-bap-id-456"
                onTransferComplete={() => {
                  console.log('OAuth link transferred');
                  setIsOpen(false);
                }}
                onSwitchAccount={() => {
                  console.log('Switched to existing account');
                  setIsOpen(false);
                }}
                onClose={() => setIsOpen(false)}
              />
            </div>
          );
        };
        
        return <OAuthConflictDemo />;
      }
    }
  ],
  [
    'oauth-restore-form',
    {
      id: 'oauth-restore-form',
      render: (props) => (
        <div className="space-y-4">
          <OAuthRestoreForm
            provider="google"
            encryptedBackup="demo-encrypted-backup-string-base64"
            onSuccess={(decryptedBackup) => {
              console.log('Backup decrypted successfully');
              props.onSuccess?.(decryptedBackup);
            }}
            onError={(error) => {
              console.error('Decryption error:', error);
              props.onError?.(error);
            }}
          />
          <p className="text-sm text-gray-500">Password form for decrypting OAuth-stored backups</p>
        </div>
      )
    }
  ]
];