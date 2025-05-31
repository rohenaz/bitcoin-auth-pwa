/**
 * Core Component Demos
 */

import React from 'react';
import { 
  Modal,
  StepIndicator,
  FileImport,
  BackupImport,
  MnemonicDisplay,
  MnemonicMode,
  IdentityGeneration,
  type Step
} from 'bitcoin-auth-ui';
import type { ComponentDemo } from './index';

export const coreDemos: Array<[string, ComponentDemo]> = [
  [
    'modal',
    {
      id: 'modal',
      render: function ModalDemo() {
        const [isOpen, setIsOpen] = React.useState(false);
        return (
          <div>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            >
              Open Modal
            </button>
            <Modal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              title="Example Modal"
            >
              <div className="p-6">
                <p className="text-gray-300">This is a modal dialog with animations and proper focus management.</p>
              </div>
            </Modal>
          </div>
        );
      }
    }
  ],
  [
    'step-indicator',
    {
      id: 'step-indicator',
      render: function StepIndicatorDemo() {
        const [currentStep, setCurrentStep] = React.useState(1);
        const steps: Step[] = [
          { id: 'identity', label: 'Create Identity', status: currentStep > 0 ? 'complete' : 'active' },
          { id: 'backup', label: 'Save Backup', status: currentStep > 1 ? 'complete' : currentStep === 1 ? 'active' : 'pending' },
          { id: 'verify', label: 'Verify', status: currentStep > 2 ? 'complete' : currentStep === 2 ? 'active' : 'pending' },
        ];
        
        return (
          <div className="space-y-4">
            <StepIndicator steps={steps} />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
              >
                Next
              </button>
            </div>
          </div>
        );
      }
    }
  ],
  [
    'file-import',
    {
      id: 'file-import',
      render: (props) => (
        <FileImport
          accept=".json,.txt"
          maxSize={5 * 1024 * 1024}
          onFileSelect={(file) => {
            console.log('File selected:', file.name);
            props.onSuccess?.({ file });
          }}
          onError={(error) => {
            console.error('File error:', error);
            props.onError?.(error);
          }}
        />
      )
    }
  ],
  [
    'backup-import',
    {
      id: 'backup-import',
      render: (props) => (
        <div className="max-w-md mx-auto">
          <BackupImport
            onImport={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                console.log('Backup file selected:', file.name);
                props.onSuccess?.({ file });
              }
            }}
          />
        </div>
      )
    }
  ],
  [
    'mnemonic-display',
    {
      id: 'mnemonic-display',
      render: (props) => (
        <MnemonicDisplay
          mnemonic="abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
          mode={MnemonicMode.View}
          onContinue={() => {
            console.log('Mnemonic acknowledged');
            props.onSuccess?.('acknowledged');
          }}
        />
      )
    }
  ],
  [
    'identity-generation',
    {
      id: 'identity-generation',
      render: (props) => (
        <div className="max-w-md mx-auto">
          <IdentityGeneration
            onGenerate={() => {
              console.log('Generate identity clicked');
              props.onSuccess?.('generated');
            }}
            onImport={(file) => {
              console.log('Import file:', file.name);
              props.onSuccess?.({ file });
            }}
          />
        </div>
      )
    }
  ]
];