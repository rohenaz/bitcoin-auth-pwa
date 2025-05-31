/**
 * Developer Tools Component Demos
 */

import React from 'react';
import { 
  ShamirSecretSharing,
  Type42KeyDerivation,
  KeyManager,
  ArtifactDisplay,
  ArtifactType,
  ThemeDemo,
  CyberpunkDemo
} from 'bigblocks';
import type { ComponentDemo } from './index';

export const developerToolDemos: Array<[string, ComponentDemo]> = [
  [
    'shamir-secret-sharing',
    {
      id: 'shamir-secret-sharing',
      render: () => (
        <div className="max-w-2xl mx-auto">
          <ShamirSecretSharing
            privateKey="L1RrrnXkcKut5DEMwtDthjwRcTTwED36thyL1DebVrKuwvohjMNi"
            onKeyReconstructed={(wif) => {
              console.log('Key reconstructed:', wif);
            }}
          />
        </div>
      )
    }
  ],
  [
    'type42-key-derivation',
    {
      id: 'type42-key-derivation',
      render: () => (
        <div className="max-w-2xl mx-auto">
          <Type42KeyDerivation
            privateKey="L1RrrnXkcKut5DEMwtDthjwRcTTwED36thyL1DebVrKuwvohjMNi"
            onKeyDerived={(derivedKey) => {
              console.log('Key derived:', derivedKey);
            }}
          />
        </div>
      )
    }
  ],
  [
    'key-manager',
    {
      id: 'key-manager',
      render: () => (
        <div className="max-w-3xl mx-auto">
          <KeyManager
            onKeySelect={(key) => {
              console.log('Key selected:', key);
            }}
            onKeyExport={(key) => {
              console.log('Key exported:', key);
            }}
          />
        </div>
      )
    }
  ],
  [
    'artifact-display',
    {
      id: 'artifact-display',
      render: () => (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Text Artifact</h4>
            <ArtifactDisplay
              artifact={{
                src: 'data:text/plain;base64,SGVsbG8gZnJvbSB0aGUgQml0Y29pbiBibG9ja2NoYWluIQ==',
                type: ArtifactType.Text,
                contentType: 'text/plain',
                name: 'Text Artifact'
              }}
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">JSON Artifact</h4>
            <ArtifactDisplay
              artifact={{
                src: `data:application/json;base64,${btoa(JSON.stringify({ message: 'Bitcoin data', timestamp: Date.now() }))}`,
                type: ArtifactType.JSON as any,
                contentType: 'application/json',
                name: 'JSON Artifact'
              }}
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">Image Artifact</h4>
            <ArtifactDisplay
              artifact={{
                src: 'https://via.placeholder.com/300x200?text=Bitcoin+Artifact',
                type: ArtifactType.Image,
                contentType: 'image/png',
                name: 'Image Artifact'
              }}
            />
          </div>
        </div>
      )
    }
  ],
  [
    'theme-demo',
    {
      id: 'theme-demo',
      render: () => (
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <p className="text-blue-400 text-sm">
              💡 ThemeDemo showcases all available Bitcoin theme presets.
              Change the theme using the controls at the top of the page.
            </p>
          </div>
          <ThemeDemo />
        </div>
      )
    }
  ],
  [
    'cyberpunk-demo',
    {
      id: 'cyberpunk-demo',
      render: () => (
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 p-4 bg-purple-500/10 border border-purple-500/50 rounded-lg">
            <p className="text-purple-400 text-sm">
              🌃 CyberpunkDemo showcases the cyberpunk theme variant with neon effects.
            </p>
          </div>
          <CyberpunkDemo />
        </div>
      )
    }
  ]
];