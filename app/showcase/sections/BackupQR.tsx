'use client';

import React, { useState } from 'react';
import {
  BackupDownload,
  FileImport,
  DeviceLinkQR,
  QRCodeRenderer,
  MnemonicDisplay
} from 'bitcoin-auth-ui';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { QrCode } from 'lucide-react';

interface BackupQRSectionProps {
  isClient: boolean;
}

export function BackupQRSection({ isClient }: BackupQRSectionProps) {
  const [showMnemonic, setShowMnemonic] = useState(false);
  
  // Mock data
  const mockBackup = {
    ids: ['backup123'],
    xprv: 'xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi',
    mnemonic: 'abandon ability able about above absent absorb abstract absurd abuse access accident',
    createdAt: new Date().toISOString()
  };
  
  const mockEncryptedBackup = 'U2FsdGVkX1+...'; // Encrypted version of backup
  
  const mockMnemonic = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent',
    'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident'
  ];

  return (
    <section id="backup-demos" className="border-b border-gray-800/50 bg-gray-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">📱 Backup & QR Components</h2>
          <p className="text-gray-400 text-lg">Secure backup management and device linking via QR codes</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full">
            <QrCode className="w-4 h-4" />
            <span className="text-sm font-medium">Cross-Device Support</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Backup Management */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Backup Management</h3>
              <p className="text-gray-400 mb-4">Download and import encrypted backups</p>
              
              {/* Client-Side Info */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-green-400 font-semibold mb-2">✅ Works Client-Side</h4>
                <p className="text-sm text-gray-300">Backup encryption/decryption happens in the browser</p>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-6">
              {/* Backup Download */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Download Backup</h4>
                {isClient ? (
                  <BackupDownload
                    backup={mockBackup as any}
                    password="demo-password"
                    onDownloaded={() => {
                      console.log('Backup downloaded');
                    }}
                    className="w-full"
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />
                )}
              </div>

              {/* File Import */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Import Backup</h4>
                {isClient ? (
                  <FileImport
                    onFileSelect={(file) => {
                      console.log('File selected:', file.name);
                    }}
                    accept=".txt,.json"
                    maxSize={5 * 1024 * 1024} // 5MB
                    className="w-full"
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-32 rounded-lg" />
                )}
              </div>

              {/* Mnemonic Display */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Recovery Phrase</h4>
                <button
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  className="mb-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm transition-colors"
                >
                  {showMnemonic ? 'Hide' : 'Show'} Recovery Phrase
                </button>
                {showMnemonic && isClient && (
                  <MnemonicDisplay
                    mnemonic={mockMnemonic.join(' ')}
                    onContinue={() => {
                      console.log('Mnemonic acknowledged');
                      setShowMnemonic(false);
                    }}
                    showCopyButton={true}
                    className="w-full"
                  />
                )}
              </div>
            </div>
          </div>

          {/* QR Code Features */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">QR Code Features</h3>
              <p className="text-gray-400 mb-4">Device linking and data transfer via QR</p>
              
              {/* QR Info */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-blue-400 font-semibold mb-2">📲 Device Linking</h4>
                <p className="text-sm text-gray-300">Securely link devices without cloud storage</p>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-6">
              {/* Device Link QR */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Device Linking QR</h4>
                {isClient ? (
                  <DeviceLinkQR
                    onGenerateQR={async () => {
                      // Simulate API call
                      return {
                        qrData: JSON.stringify({
                          token: 'device-link-token-123',
                          backup: mockEncryptedBackup
                        }),
                        token: 'device-link-token-123',
                        expiresAt: new Date(Date.now() + 600000)
                      };
                    }}
                    baseUrl={window.location.origin}
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-64 w-64 rounded-lg mx-auto" />
                )}
              </div>

              {/* Generic QR Renderer */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Generic QR Code</h4>
                {isClient ? (
                  <QRCodeRenderer
                    data="bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.001"
                    size={200}
                    className="mx-auto"
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-48 w-48 rounded-lg mx-auto" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TerminalCodeBlock
            code={`import { 
  BackupDownload,
  FileImport,
  MnemonicDisplay 
} from 'bitcoin-auth-ui';

function BackupManager() {
  const [backup, setBackup] = useState(null);
  
  const handleImport = async (file) => {
    const content = await file.text();
    try {
      // Decrypt backup with password
      const decrypted = await decryptBackup(content, password);
      setBackup(decrypted);
      toast.success('Backup imported successfully');
    } catch (error) {
      toast.error('Invalid backup or password');
    }
  };
  
  return (
    <>
      <BackupDownload
        backup={backup}
        password={password}
        onDownloaded={() => {
          analytics.track('backup_downloaded');
        }}
      />
      
      <FileImport
        onFileSelect={handleImport}
        accept=".txt,.json"
        maxSize={5 * 1024 * 1024}
      />
      
      <MnemonicDisplay
        mnemonic={backup?.mnemonic}
        onAcknowledge={() => {
          setShowMnemonic(false);
        }}
        variant="grid"
        showCopyButton={true}
      />
    </>
  );
}`}
            language="jsx"
            filename="BackupManager.jsx"
          />

          <TerminalCodeBlock
            code={`import { 
  DeviceLinkQR,
  QRCodeRenderer 
} from 'bitcoin-auth-ui';

function DeviceLinking() {
  const [linkToken, setLinkToken] = useState(null);
  
  const generateLink = async () => {
    const response = await fetch('/api/device-link/generate', {
      method: 'POST'
    });
    const { token, expires } = await response.json();
    setLinkToken({ token, expires });
  };
  
  return (
    <>
      <DeviceLinkQR
        linkData={{
          token: linkToken?.token,
          expires: linkToken?.expires,
          backup: encryptedBackup
        }}
        onExpire={() => {
          setLinkToken(null);
          toast.info('Link expired, generate a new one');
        }}
        size={300}
        showTimer={true}
      />
      
      {/* Bitcoin payment QR */}
      <QRCodeRenderer
        data={\`bitcoin:\${address}?amount=\${amount}\`}
        size={250}
      />
    </>
  );
}`}
            language="jsx"
            filename="DeviceLinking.jsx"
          />
        </div>
      </div>
    </section>
  );
}