/**
 * Device & Backup Component Demos
 */

import React from 'react';
import { 
  DeviceLinkQR,
  MemberExport,
  BackupDownload,
  BackupImport,
  FileImport,
  MnemonicDisplay,
  IdentityGeneration,
  QRCodeRenderer
} from 'bigblocks';
import type { ComponentDemo } from './index';

export const deviceBackupDemos: Array<[string, ComponentDemo]> = [
  [
    'device-link-qr',
    {
      id: 'device-link-qr',
      render: () => (
        <div className="space-y-4">
          <DeviceLinkQR
            onGenerateQR={async () => {
              // Simulate QR generation
              return {
                token: 'demo-device-link-token-123',
                qrData: 'https://example.com/link-device?token=demo-device-link-token-123',
                expiresAt: new Date(Date.now() + 600000) // 10 minutes
              };
            }}
            baseUrl="https://example.com"
          />
          <p className="text-sm text-gray-500">QR code for linking new devices securely</p>
        </div>
      )
    }
  ],
  [
    'member-export',
    {
      id: 'member-export',
      render: () => (
        <div className="space-y-4">
          <MemberExport
            profileName="Demo Profile"
            onGenerateExport={async () => {
              // Simulate member export generation
              return {
                token: 'demo-member-export-123',
                qrData: 'https://example.com/import-member?id=demo-member-export-123',
                expiresAt: new Date(Date.now() + 3600000) // 1 hour
              };
            }}
            baseUrl="https://example.com"
          />
          <p className="text-sm text-gray-500">Export member profile with QR code for easy sharing</p>
        </div>
      )
    }
  ],
  [
    'backup-download',
    {
      id: 'backup-download',
      render: () => {
        const demoBackup = {
          xprv: 'xprv_demo_key_for_showcase',
          ids: 'demo-bap-id-1',
          version: '1.0.0',
          timestamp: Date.now(),
          mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
        };

        return (
          <div className="space-y-4">
            <BackupDownload
              backup={demoBackup}
              password="demo-password"
              onDownloaded={() => console.log('Backup downloaded')}
              requireDownload={false}
            />
            <p className="text-sm text-gray-500">Download encrypted backup file securely</p>
          </div>
        );
      }
    }
  ],
  [
    'backup-import',
    {
      id: 'backup-import',
      render: (props) => (
        <div className="space-y-4">
          <BackupImport
            onImport={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log('Importing backup file:', file.name);
                props.onSuccess?.({ fileName: file.name, size: file.size });
              }
            }}
          />
          <p className="text-sm text-gray-500">Import backup files with validation</p>
        </div>
      )
    }
  ],
  [
    'file-import',
    {
      id: 'file-import',
      render: (props) => (
        <div className="space-y-4">
          <FileImport
            onFileValidated={(file, result) => {
              console.log('File validated:', file.name, result);
              props.onSuccess?.({ fileName: file.name, result });
            }}
            onError={(error) => {
              console.error('File validation error:', error);
              props.onError?.(error);
            }}
          />
          <p className="text-sm text-gray-500">Drag & drop file import with validation</p>
        </div>
      )
    }
  ],
  [
    'mnemonic-display',
    {
      id: 'mnemonic-display',
      render: () => {
        const demoMnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
        
        return (
          <div className="space-y-4">
            <MnemonicDisplay
              mnemonic={demoMnemonic}
              onContinue={() => console.log('User acknowledged mnemonic')}
              showCopyButton={true}
            />
            <p className="text-sm text-gray-500">Display recovery phrase with security warnings</p>
          </div>
        );
      }
    }
  ],
  [
    'identity-generation',
    {
      id: 'identity-generation',
      render: (props) => {
        const IdentityGenerationDemo = () => {
          const [loading, setLoading] = React.useState(false);
          
          return (
            <div className="space-y-4">
              <IdentityGeneration
                onGenerate={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    console.log('Identity generated');
                    props.onSuccess?.({ type: 'generated' });
                  }, 2000);
                }}
                onImport={(file) => {
                  console.log('Importing identity from file:', file.name);
                  props.onSuccess?.({ type: 'imported', fileName: file.name });
                }}
                loading={loading}
              />
              <p className="text-sm text-gray-500">Generate new Bitcoin identities or import existing ones</p>
            </div>
          );
        };
        
        return <IdentityGenerationDemo />;
      }
    }
  ],
  [
    'qr-code-renderer',
    {
      id: 'qr-code-renderer',
      render: () => (
        <div className="space-y-4">
          <QRCodeRenderer data="bitcoin:1BitcoinAddress123...?amount=0.001" />
          <p className="text-sm text-gray-500">QR code for Bitcoin payment URI</p>
        </div>
      )
    }
  ]
];