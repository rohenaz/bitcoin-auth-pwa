'use client';

import React, { useState } from 'react';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { Fingerprint } from 'lucide-react';

interface IdentitySectionProps {
  isClient: boolean;
}

export function IdentitySection({ isClient }: IdentitySectionProps) {
  const [showKeyRotation, setShowKeyRotation] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [encryptedData, setEncryptedData] = useState('');

  // Mock BAP identity
  const mockBapIdentity = {
    id: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    name: 'Satoshi Nakamoto',
    idKey: 'satoshi@bitcoin.com',
    currentKey: 0,
    rotationHistory: [
      { key: 0, rotatedAt: '2024-01-01', reason: 'Initial key' }
    ]
  };

  return (
    <section className="border-b border-gray-800/50 bg-gradient-to-b from-indigo-900/20 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🆔 Identity Components</h2>
          <p className="text-gray-400 text-lg">Bitcoin Attestation Protocol identity management</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full">
            <Fingerprint className="w-4 h-4" />
            <span className="text-sm font-medium">Decentralized Identity</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* BAP Key Rotation */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">BAP Key Rotation</h3>
              <p className="text-gray-400 mb-4">Rotate identity keys for enhanced security</p>
              
              {/* Backend Requirements */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <code className="text-orange-400">/api/bap/rotate</code> - Rotate BAP keys</li>
                  <li>• <code className="text-orange-400">/api/bap/publish</code> - Publish to blockchain</li>
                  <li>• BAP SDK integration for key management</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 mb-4">
                <p className="text-indigo-400 text-sm">🔐 Demo: BAP key rotation (requires BAP instance)</p>
              </div>
              
              {isClient ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <h4 className="font-semibold mb-2">Current Identity</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">ID:</span> <span className="font-mono">{mockBapIdentity.id}</span></p>
                      <p><span className="text-gray-500">Name:</span> {mockBapIdentity.name}</p>
                      <p><span className="text-gray-500">Current Key:</span> #{mockBapIdentity.currentKey}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowKeyRotation(!showKeyRotation)}
                    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    Rotate Identity Key
                  </button>
                  
                  {showKeyRotation && (
                    <div className="p-4 bg-gray-900 rounded-lg">
                      <p className="text-sm text-gray-400 mb-3">
                        Key rotation will generate a new key pair and update your BAP identity on-chain.
                      </p>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">
                        Confirm Rotation
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="animate-pulse bg-gray-800 h-48 rounded-lg" />
              )}
            </div>
          </div>

          {/* BAP File Signing & Encryption */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">File Signing & Encryption</h3>
              <p className="text-gray-400 mb-4">Sign and encrypt files with BAP identity</p>
              
              {/* Features */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-blue-400 font-semibold mb-2">✨ Features:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Sign files with BAP identity</li>
                  <li>• Encrypt data for specific recipients</li>
                  <li>• Verify signatures and decrypt data</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-6">
              {/* File Signing */}
              <div>
                <h4 className="text-lg font-semibold mb-3">File Signing</h4>
                {isClient ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600"
                    />
                    <button 
                      disabled={!selectedFile}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      Sign File
                    </button>
                  </div>
                ) : (
                  <div className="animate-pulse bg-gray-800 h-24 rounded-lg" />
                )}
              </div>

              {/* Data Encryption */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Data Encryption</h4>
                {isClient ? (
                  <div className="space-y-3">
                    <textarea
                      placeholder="Enter data to encrypt..."
                      value={encryptedData}
                      onChange={(e) => setEncryptedData(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg resize-none focus:border-indigo-500 focus:outline-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                        Encrypt
                      </button>
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                        Decrypt
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="animate-pulse bg-gray-800 h-32 rounded-lg" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TerminalCodeBlock
            code={`import { 
  BapKeyRotationManager,
  useBapKeyRotation 
} from 'bigblocks';

function IdentityManager() {
  const { rotateKey, isRotating } = useBapKeyRotation();
  const [bapInstance, setBapInstance] = useState(null);
  
  const handleKeyRotation = async () => {
    try {
      const result = await rotateKey({
        bapInstance,
        reason: 'Scheduled rotation',
        publishToChain: true
      });
      
      toast.success('Key rotated successfully');
      console.log('New key index:', result.newKeyIndex);
    } catch (error) {
      toast.error('Key rotation failed');
    }
  };
  
  return (
    <BapKeyRotationManager
      bapInstance={bapInstance}
      onRotationComplete={(event) => {
        console.log('Rotation complete:', event);
      }}
      showHistory={true}
      allowManualRotation={true}
    />
  );
}`}
            language="jsx"
            filename="IdentityManager.jsx"
          />

          <TerminalCodeBlock
            code={`import { 
  BapFileSigner,
  BapEncryptionSuite 
} from 'bigblocks';

function SecureFileManager() {
  const [mode, setMode] = useState('sign');
  
  return (
    <>
      <BapFileSigner
        bapInstance={bapInstance}
        mode="detached" // or "attached"
        onSign={(result) => {
          console.log('Signature:', result.signature);
          saveSignature(result);
        }}
        onVerify={(isValid) => {
          toast[isValid ? 'success' : 'error'](
            isValid ? 'Valid signature' : 'Invalid signature'
          );
        }}
      />
      
      <BapEncryptionSuite
        bapInstance={bapInstance}
        mode="asymmetric" // or "symmetric"
        onEncrypt={(encrypted) => {
          console.log('Encrypted:', encrypted);
        }}
        onDecrypt={(decrypted) => {
          console.log('Decrypted:', decrypted);
        }}
        recipientKeys={['key1', 'key2']}
      />
    </>
  );
}`}
            language="jsx"
            filename="SecureFileManager.jsx"
          />
        </div>
      </div>
    </section>
  );
}