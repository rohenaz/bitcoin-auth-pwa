/**
 * BAP (Bitcoin Attestation Protocol) Component Demos
 */

import React from 'react';
import { 
  BapKeyRotationManager,
  BapFileSigner,
  BapEncryptionSuite
} from 'bitcoin-auth-ui';
import { Utils } from '@bsv/sdk';
import type { ComponentDemo } from './index';

// Create mock BAP instance for demos using proper Utils from @bsv/sdk
const createMockBapInstance = () => {
  let currentPath = "/0'/0'/0'";
  const rootPath = "/0'/0'/0'";
  const identityKey = '02a1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  
  return {
    listIds: () => [{
      idKey: identityKey,
      rootPath,
      currentPath
    }],
    
    getAddress: (root: string, current: string) => {
      const pathToAddress: Record<string, string> = {
        "/0'/0'/0'": '1HjTer9VgkfeNaFibPB8EWUGJLEg8yAHfY',
        "/0'/0'/1'": '1NewAddressAfterRotation123456789',
        "/0'/0'/2'": '1AnotherRotatedAddress234567890',
      };
      return pathToAddress[current] || '1DefaultAddress1234567890';
    },
    
    newId: (idKey: string) => {
      if (idKey === identityKey) {
        const parts = currentPath.split('/');
        const lastPart = parts[parts.length - 1];
        if (lastPart) {
          const num = parseInt(lastPart.replace("'", ''));
          currentPath = parts.slice(0, -1).join('/') + `/${num + 1}'`;
        }
        return true;
      }
      return false;
    },
    
    getId: (idKey: string) => {
      if (idKey === identityKey) {
        return {
          exportMemberBackup: () => ({
            derivedPrivateKey: 'L1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            derivedPublicKey: '02a1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            idKey: identityKey
          }),
          getCurrentAddress: () => '1HjTer9VgkfeNaFibPB8EWUGJLEg8yAHfY',
          getIdTransaction: (prevPath: string): string[] => {
            // Proper BAP ID transaction format - returns string[] to match real BSV-BAP library
            return [
              '6a', // OP_RETURN opcode as hex string
              Utils.toHex(Utils.toArray('1BAPSuaPnfGnSBM3GLV9yhxUdYe4vGbdMT', 'utf8')), // BAP protocol address
              Utils.toHex(Utils.toArray('ID', 'utf8')),        // ID command
              identityKey,                                     // Identity key (already hex)
              Utils.toHex(Utils.toArray('1NewAddressAfterRotation123456789', 'utf8')) // New address
            ];
          }
        };
      }
      return null;
    }
  };
};

export const bapDemos: Array<[string, ComponentDemo]> = [
  [
    'bap-key-rotation-manager',
    {
      id: 'bap-key-rotation-manager',
      render: () => (
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <p className="text-blue-400 text-sm">
              ℹ️ This demo uses mock BAP instances. In production, use real BAP instances from authenticated users.
            </p>
          </div>
          <BapKeyRotationManager
            bapInstance={createMockBapInstance()}
            onRotationComplete={(newPath, txid) => {
              console.log('Demo: Key rotation complete:', { newPath, txid });
            }}
            showRotationHistory={true}
            autoBackupAfterRotation={true}
          />
        </div>
      )
    }
  ],
  [
    'bap-file-signer',
    {
      id: 'bap-file-signer',
      render: () => (
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <p className="text-blue-400 text-sm">
              ℹ️ This demo uses mock BAP instances. In production, use real BAP instances from authenticated users.
            </p>
          </div>
          <BapFileSigner
            bapInstance={createMockBapInstance()}
            mode="both"
            onFilesSigned={(results) => {
              console.log('Demo: Files signed:', results);
            }}
            onFileVerified={(result) => {
              console.log('Demo: File verified:', result);
            }}
            blockchainAnchor={false}
            maxFileSize={10 * 1024 * 1024}
          />
        </div>
      )
    }
  ],
  [
    'bap-encryption-suite',
    {
      id: 'bap-encryption-suite',
      render: () => (
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <p className="text-blue-400 text-sm">
              ℹ️ This demo uses mock BAP instances. In production, use real BAP instances from authenticated users.
            </p>
          </div>
          <BapEncryptionSuite
            bapInstance={createMockBapInstance()}
            onEncrypted={(result) => {
              console.log('Demo: Encryption complete:', result);
            }}
            onDecrypted={(result) => {
              console.log('Demo: Decryption complete:', result);
            }}
          />
        </div>
      )
    }
  ]
];