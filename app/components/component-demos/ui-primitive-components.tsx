/**
 * UI Primitive Component Demos
 */

import React from 'react';
import { 
  AuthCard,
  LoadingButton,
  PasswordInput,
  ErrorDisplay,
  WarningCard,
  Modal,
  StepIndicator
} from 'bitcoin-auth-ui';
import type { ComponentDemo } from './index';

export const uiPrimitiveDemos: Array<[string, ComponentDemo]> = [
  [
    'auth-card',
    {
      id: 'auth-card',
      render: () => (
        <AuthCard>
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">Welcome</h2>
            <p className="text-gray-600">This is an AuthCard component for authentication forms</p>
            <div className="flex gap-2 justify-center">
              <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                Sign In
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                Sign Up
              </button>
            </div>
          </div>
        </AuthCard>
      )
    }
  ],
  [
    'loading-button',
    {
      id: 'loading-button',
      render: () => {
        const LoadingButtonDemo = () => {
          const [loading, setLoading] = React.useState(false);
          
          return (
            <div className="space-y-4">
              <LoadingButton
                loading={loading}
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 2000);
                }}
              >
                {loading ? 'Processing...' : 'Click Me'}
              </LoadingButton>
              <p className="text-sm text-gray-500">Click to see loading state</p>
            </div>
          );
        };
        
        return <LoadingButtonDemo />;
      }
    }
  ],
  [
    'password-input',
    {
      id: 'password-input',
      render: () => {
        const PasswordInputDemo = () => {
          const [password, setPassword] = React.useState('');
          
          return (
            <div className="space-y-4">
              <PasswordInput
                value={password}
                onChange={(value) => setPassword(value)}
                placeholder="Enter your password"
              />
              <p className="text-sm text-gray-500">Password input with visibility toggle</p>
            </div>
          );
        };
        
        return <PasswordInputDemo />;
      }
    }
  ],
  [
    'error-display',
    {
      id: 'error-display',
      render: () => (
        <div className="space-y-4">
          <ErrorDisplay
            error="This is an example error message"
          />
          <ErrorDisplay
            error="This is another error message"
          />
          <p className="text-sm text-gray-500">Consistent error message display component</p>
        </div>
      )
    }
  ],
  [
    'warning-card',
    {
      id: 'warning-card',
      render: () => (
        <div className="space-y-4">
          <WarningCard
            title="Important"
            message="Please backup your recovery phrase before continuing"
          />
          <WarningCard
            message="This is a warning without a title"
          />
        </div>
      )
    }
  ],
  [
    'modal',
    {
      id: 'modal',
      render: () => {
        const ModalDemo = () => {
          const [isOpen, setIsOpen] = React.useState(false);
          
          return (
            <div>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Open Modal
              </button>
              <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Example Modal"
              >
                <div className="space-y-4">
                  <p>This is the modal content. You can put any React components here.</p>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </Modal>
            </div>
          );
        };
        
        return <ModalDemo />;
      }
    }
  ],
  [
    'step-indicator',
    {
      id: 'step-indicator',
      render: () => (
        <div className="space-y-4">
          <StepIndicator
            steps={[
              { id: '1', label: 'Generate', status: 'complete' },
              { id: '2', label: 'Password', status: 'active' },
              { id: '3', label: 'Backup', status: 'pending' },
              { id: '4', label: 'Complete', status: 'pending' }
            ]}
          />
          <p className="text-sm text-gray-500">Multi-step progress indicator</p>
        </div>
      )
    }
  ]
];