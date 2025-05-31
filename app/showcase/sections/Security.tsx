'use client';

import React, { useState } from 'react';
import {
  ShamirSecretSharing,
  KeyManager,
  Type42KeyDerivation
} from 'bitcoin-auth-ui';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { Shield } from 'lucide-react';

interface SecuritySectionProps {
  isClient: boolean;
}

export function SecuritySection({ isClient }: SecuritySectionProps) {
  const [secretShares, setSecretShares] = useState<string[]>([]);
  const [recoveredSecret, setRecoveredSecret] = useState('');
  const [derivedKeys, setDerivedKeys] = useState<any[]>([]);

  // Mock data
  const mockPrivateKey = 'L1HKVVLHXiUhecWnwFYF6L3shkf1E12HUmuZTESvBXUdx318oo8s';
  const mockKeys = [
    { id: '1', name: 'Primary Wallet', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', type: 'wallet' },
    { id: '2', name: 'Identity Key', address: '1BitcoinEaterAddressDontSendf59kuE', type: 'identity' },
    { id: '3', name: 'Backup Key', address: '1C5bSj1iEGUgSTbziymG7Cn18ENQuT36vv', type: 'backup' }
  ];

  return (
    <section id="security-demos" className="border-b border-gray-800/50 bg-gradient-to-b from-red-900/20 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🔒 Security Components</h2>
          <p className="text-gray-400 text-lg">Advanced cryptographic tools for Bitcoin key management</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Enterprise-Grade Security</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shamir Secret Sharing */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Shamir Secret Sharing</h3>
              <p className="text-gray-400 mb-4">Split private keys into secure shares</p>
              
              {/* Client-Side Info */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-green-400 font-semibold mb-2">✅ Works Client-Side</h4>
                <p className="text-sm text-gray-300">All cryptographic operations happen in your browser</p>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                <p className="text-red-400 text-sm">🔐 Demo: Split and recover Bitcoin private keys</p>
              </div>
              
              {isClient ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <h4 className="font-semibold mb-2">Demo Private Key</h4>
                    <p className="font-mono text-xs text-gray-400 break-all">{mockPrivateKey}</p>
                  </div>
                  
                  <ShamirSecretSharing />
                  
                  {secretShares.length > 0 && (
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <h4 className="font-semibold mb-2">Generated Shares</h4>
                      {secretShares.map((share, i) => (
                        <p key={i} className="font-mono text-xs text-gray-400 mb-1">
                          Share {i + 1}: {share.substring(0, 20)}...
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-pulse bg-gray-800 h-64 rounded-lg" />
              )}
            </div>
          </div>

          {/* Key Manager & Type42 */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Advanced Key Management</h3>
              <p className="text-gray-400 mb-4">Manage multiple keys and derive child keys</p>
              
              {/* Features */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-blue-400 font-semibold mb-2">🔑 Features:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Hierarchical key derivation (BRC-42)</li>
                  <li>• Multi-key management dashboard</li>
                  <li>• Secure key generation and storage</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-6">
              {/* Key Manager */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Key Manager</h4>
                {isClient ? (
                  <KeyManager />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-48 rounded-lg" />
                )}
              </div>

              {/* Type42 Key Derivation */}
              <div>
                <h4 className="text-lg font-semibold mb-3">BRC-42 Key Derivation</h4>
                {isClient ? (
                  <Type42KeyDerivation />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-32 rounded-lg" />
                )}
                
                {derivedKeys.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                    <h4 className="font-semibold mb-2">Derived Keys</h4>
                    {derivedKeys.map((key, i) => (
                      <p key={i} className="font-mono text-xs text-gray-400 mb-1">
                        {key.path}: {key.address}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TerminalCodeBlock
            code={`import { 
  ShamirSecretSharing,
  KeyManager 
} from 'bitcoin-auth-ui';

function SecureKeyBackup() {
  const [shares, setShares] = useState([]);
  
  const handleSplitKey = (privateKey) => {
    // Split into 5 shares, need 3 to recover
    const shares = shamirSplit(privateKey, 3, 5);
    
    // Distribute shares to trusted parties
    shares.forEach((share, i) => {
      sendToTrustedParty(i, share);
    });
    
    setShares(shares);
  };
  
  return (
    <>
      <ShamirSecretSharing
        onSplit={handleSplitKey}
        onRecover={(recovered) => {
          console.log('Key recovered:', recovered);
        }}
        threshold={3}
        totalShares={5}
        mode="split"
      />
      
      <KeyManager
        keys={userKeys}
        onKeyGenerate={generateNewKey}
        showActions={true}
      />
    </>
  );
}`}
            language="jsx"
            filename="SecureKeyBackup.jsx"
          />

          <TerminalCodeBlock
            code={`import { Type42KeyDerivation } from 'bitcoin-auth-ui';

function PaymailKeyDerivation() {
  const derivePaymentKey = async (invoice) => {
    const derivedKey = await deriveType42Key({
      masterKey: wallet.xprv,
      protocol: 'paymail',
      keyID: user.paymail,
      counterparty: invoice.paymail,
      invoice: invoice.id
    });
    
    // Use derived key for this specific payment
    const address = derivedKey.address;
    const privateKey = derivedKey.privateKey;
    
    return createPayment(address, privateKey);
  };
  
  return (
    <Type42KeyDerivation
      masterKey={wallet.xprv}
      protocol="paymail"
      keyID={user.paymail}
      onDerive={(result) => {
        console.log('Payment key:', result);
        // Each payment gets unique key
        processPayment(result);
      }}
    />
  );
}`}
            language="jsx"
            filename="PaymailKeyDerivation.jsx"
          />
        </div>
      </div>
    </section>
  );
}