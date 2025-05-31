/**
 * Authentication Flow Component Demos
 */

import React from 'react';
import { 
  AuthFlowOrchestrator,
  SignupFlow,
  OAuthRestoreFlow,
  LoginForm,
  AuthButton
} from 'bitcoin-auth-ui';
import type { ComponentDemo } from './index';

export const authFlowDemos: Array<[string, ComponentDemo]> = [
  [
    'auth-flow-orchestrator',
    {
      id: 'auth-flow-orchestrator',
      render: (props) => (
        <div className="max-w-md mx-auto">
          <AuthFlowOrchestrator
            flowType="unified"
            enableOAuth={true}
            enableDeviceLink={true}
            onSuccess={(user) => {
              console.log('Auth success:', user);
              props.onSuccess?.(user);
            }}
            onError={(error) => {
              console.error('Auth error:', error);
              props.onError?.(error);
            }}
          />
        </div>
      )
    }
  ],
  [
    'signup-flow',
    {
      id: 'signup-flow',
      render: (props) => (
        <div className="max-w-md mx-auto">
          <SignupFlow
            onSuccess={(user) => {
              console.log('Signup complete:', user);
              props.onSuccess?.(user);
            }}
            onError={(error) => {
              console.error('Signup error:', error);
              props.onError?.(error);
            }}
          />
        </div>
      )
    }
  ],
  [
    'oauth-restore-flow',
    {
      id: 'oauth-restore-flow',
      render: (props) => (
        <OAuthRestoreFlow
          showProviderSelection={true}
          showPasswordEntry={true}
          onRestoreSuccess={(bapId) => {
            console.log('Restore success:', bapId);
            props.onSuccess?.(bapId);
          }}
          onRestoreError={(error) => {
            console.error('Restore error:', error);
            props.onError?.(error);
          }}
        />
      )
    }
  ],
  [
    'login-form',
    {
      id: 'login-form',
      render: (props) => (
        <div className="max-w-md mx-auto">
          <LoginForm
            mode="signin"
            onSuccess={(user) => {
              console.log('Login success:', user);
              props.onSuccess?.(user);
            }}
            onError={(error) => {
              console.error('Login error:', error);
              props.onError?.(error);
            }}
          />
        </div>
      )
    }
  ],
  [
    'auth-button',
    {
      id: 'auth-button',
      render: (props) => (
        <div className="flex items-center justify-center p-8">
          <AuthButton
            mode="signin"
          />
        </div>
      )
    }
  ]
];