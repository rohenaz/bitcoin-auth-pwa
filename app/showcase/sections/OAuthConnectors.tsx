'use client';

import React from 'react';
import {
  OAuthProviders,
  HandCashConnector,
  YoursWalletConnector,
  OAuthConflictModal
} from 'bitcoin-auth-ui';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { Link } from 'lucide-react';

interface OAuthConnectorsSectionProps {
  isClient: boolean;
}

export function OAuthConnectorsSection({ isClient }: OAuthConnectorsSectionProps) {
  const [showConflictModal, setShowConflictModal] = React.useState(false);
  
  // Mock OAuth providers
  const mockProviders = [
    { id: 'google', name: 'Google', icon: <span>🔍</span> },
    { id: 'github', name: 'GitHub', icon: <span>🐙</span> },
    { id: 'twitter', name: 'Twitter', icon: <span>🐦</span> }
  ];
  
  const mockLinkedProviders = ['google'];

  return (
    <section id="oauth-connectors-demos" className="border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🔗 OAuth & Wallet Connectors</h2>
          <p className="text-gray-400 text-lg">Connect external wallets and OAuth providers for backup</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full">
            <Link className="w-4 h-4" />
            <span className="text-sm font-medium">Multi-Provider Support</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* OAuth Providers */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">OAuth Backup Providers</h3>
              <p className="text-gray-400 mb-4">Link OAuth accounts for encrypted backup storage</p>
              
              {/* Backend Requirements */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend Endpoints:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <code className="text-orange-400">/api/auth/link-provider</code> - OAuth linking flow</li>
                  <li>• <code className="text-orange-400">/api/auth/callback/*</code> - OAuth callbacks</li>
                  <li>• <code className="text-orange-400">/api/users/connected-accounts</code> - List linked accounts</li>
                  <li>• <code className="text-orange-400">/api/users/disconnect-account</code> - Unlink accounts</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                <p className="text-blue-400 text-sm">🔐 Demo: Link OAuth accounts for secure backup</p>
              </div>
              
              {isClient ? (
                <div className="space-y-4">
                  <OAuthProviders
                    providers={mockProviders}
                    linkedProviders={mockLinkedProviders}
                    onProviderClick={(provider) => {
                      console.log('Provider clicked:', provider);
                    }}
                  />
                  
                  <button
                    onClick={() => setShowConflictModal(true)}
                    className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                  >
                    Test Conflict Modal
                  </button>
                  
                  {showConflictModal && (
                    <OAuthConflictModal
                      isOpen={showConflictModal}
                      onClose={() => setShowConflictModal(false)}
                      provider="google"
                      existingBapId="existing-bap-id-123"
                      currentBapId="current-bap-id-456"
                      onTransferComplete={() => {
                        console.log('Transfer completed');
                        setShowConflictModal(false);
                      }}
                      onSwitchAccount={() => {
                        console.log('Switched to existing account');
                        setShowConflictModal(false);
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="animate-pulse bg-gray-800 h-48 rounded-lg" />
              )}
            </div>
          </div>

          {/* Wallet Connectors */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">External Wallet Connectors</h3>
              <p className="text-gray-400 mb-4">Connect HandCash and Yours Wallet</p>
              
              {/* Wallet Requirements */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-yellow-400 font-semibold mb-2">💡 Integration Notes:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• HandCash requires OAuth app registration</li>
                  <li>• Yours Wallet uses browser extension</li>
                  <li>• Both support BSV transactions</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-4">
              {/* HandCash Connector */}
              <div>
                <h4 className="text-lg font-semibold mb-3">HandCash</h4>
                {isClient ? (
                  <HandCashConnector
                    config={{
                      appId: 'demo-app-id',
                      redirectUrl: '/api/auth/callback/handcash'
                    }}
                    onSuccess={(result) => {
                      console.log('HandCash connected:', result);
                    }}
                    onError={(error) => {
                      console.error('HandCash error:', error);
                    }}
                    className="w-full"
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />
                )}
              </div>

              {/* Yours Wallet Connector */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Yours Wallet</h4>
                {isClient ? (
                  <YoursWalletConnector
                    onSuccess={(result) => {
                      console.log('Yours Wallet connected:', result);
                    }}
                    onError={(error) => {
                      console.error('Yours Wallet error:', error);
                    }}
                    className="w-full"
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TerminalCodeBlock
            code={`import { 
  OAuthProviders,
  OAuthConflictModal 
} from 'bitcoin-auth-ui';

function BackupSettings() {
  const [providers] = useState([
    { id: 'google', name: 'Google' },
    { id: 'github', name: 'GitHub' }
  ]);
  
  const { data: linked } = useConnectedAccounts();
  
  return (
    <>
      <OAuthProviders
        providers={providers}
        linkedProviders={linked || []}
        onProviderClick={async (provider) => {
          if (linked?.includes(provider)) {
            await disconnectProvider(provider);
          } else {
            window.location.href = \`/api/auth/link-provider?provider=\${provider}\`;
          }
        }}
      />
      
      {conflictError && (
        <OAuthConflictModal
          isOpen={true}
          onClose={() => setConflictError(null)}
          provider={conflictError.provider}
          existingBapId={conflictError.existingBapId}
          currentBapId={currentBapId}
          onTransferComplete={handleTransferComplete}
          onSwitchAccount={handleSwitchAccount}
        />
      )}
    </>
  );
}`}
            language="jsx"
            filename="BackupSettings.jsx"
          />

          <TerminalCodeBlock
            code={`import { 
  HandCashConnector,
  YoursWalletConnector 
} from 'bitcoin-auth-ui';

function WalletConnectors() {
  const [handcashConnected, setHandcashConnected] = useState(false);
  const [yoursConnected, setYoursConnected] = useState(false);
  
  return (
    <div className="space-y-4">
      <HandCashConnector
        config={{
          appId: process.env.NEXT_PUBLIC_HANDCASH_APP_ID!,
          redirectUrl: '/api/auth/callback/handcash'
        }}
        onSuccess={(result) => {
          setHandcashConnected(true);
          // Store account details
          localStorage.setItem('handcash', JSON.stringify(result));
        }}
        onError={(error) => {
          console.error('HandCash error:', error);
        }}
      />
      
      <YoursWalletConnector
        onSuccess={(result) => {
          setYoursConnected(true);
          // Store wallet details
          localStorage.setItem('yours-wallet', JSON.stringify(result));
        }}
        onError={(error) => {
          console.error('Yours Wallet error:', error);
        }}
      />
    </div>
  );
}`}
            language="jsx"
            filename="WalletConnectors.jsx"
          />
        </div>
      </div>
    </section>
  );
}