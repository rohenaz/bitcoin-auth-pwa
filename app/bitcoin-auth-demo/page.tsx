'use client';

import React, { useState } from 'react';
import { 
  BitcoinAuthProvider, 
  AuthButton, 
  LoginForm, 
  useBitcoinAuth,
  type BitcoinAuthConfig,
  type AuthUser,
  type AuthError
} from 'bitcoin-auth-ui';

// Demo configuration
const demoConfig: BitcoinAuthConfig = {
  apiUrl: '/api',
  oauthProviders: ['google', 'github'],
  theme: {
    mode: 'dark',
    colors: {
      primary: '#f7931a', // Bitcoin orange
      secondary: '#4a5568',
      background: '#000000',
      surface: '#1a1a1a',
      error: '#e53e3e',
      warning: '#d69e2e',
      success: '#38a169',
      text: {
        primary: '#ffffff',
        secondary: '#a0aec0',
        disabled: '#4a5568'
      },
      border: '#2d3748'
    }
  },
  redirects: {
    success: '/dashboard',
    signup: '/signup',
    signin: '/signin'
  }
};

// Custom component using the headless hook
function CustomAuthStatus() {
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    error, 
    signOut,
    profileCount,
    activeProfile 
  } = useBitcoinAuth();

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="animate-pulse">Loading authentication status...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
        <h3 className="font-medium text-red-400 mb-2">Authentication Error</h3>
        <p className="text-sm text-red-300">{error.message}</p>
        <p className="text-xs text-red-400 mt-1">Code: {error.code}</p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
        <h3 className="font-medium text-green-400 mb-3">Authenticated Successfully</h3>
        <div className="space-y-2 text-sm">
          <div><span className="text-gray-400">Address:</span> {user.address}</div>
          <div><span className="text-gray-400">Identity:</span> {user.id.substring(0, 16)}...</div>
          <div><span className="text-gray-400">Profiles:</span> {profileCount}</div>
          {activeProfile && (
            <div><span className="text-gray-400">Active:</span> {activeProfile.address.substring(0, 16)}...</div>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="text-gray-400">Not authenticated</div>
    </div>
  );
}

export default function BitcoinAuthDemoPage() {
  const [selectedDemo, setSelectedDemo] = useState<'simple' | 'custom' | 'headless'>('simple');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleSuccess = (user: AuthUser) => {
    addLog(`Authentication successful for ${user.address}`);
    setShowLoginForm(false);
  };

  const handleError = (error: AuthError) => {
    addLog(`Authentication error: ${error.code} - ${error.message}`);
  };

  return (
    <BitcoinAuthProvider 
      config={{
        ...demoConfig,
        onSuccess: (user) => addLog(`Global success handler: ${user.address}`),
        onError: (error) => addLog(`Global error handler: ${error.code}`)
      }}
    >
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Bitcoin Authentication Components Demo
            </h1>
            <p className="text-gray-400 text-lg">
              Demonstrating the production-grade Bitcoin authentication component library
            </p>
          </div>

          {/* Demo Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Choose Demo Mode</h2>
            <div className="flex space-x-4">
              {[
                { key: 'simple', label: 'Simple Drop-in', description: 'AuthButton component' },
                { key: 'custom', label: 'Custom Form', description: 'LoginForm component' },
                { key: 'headless', label: 'Headless Hook', description: 'useBitcoinAuth hook' }
              ].map((demo) => (
                <button
                  key={demo.key}
                  onClick={() => setSelectedDemo(demo.key as 'simple' | 'custom' | 'headless')}
                  className={`p-4 rounded-lg border transition-colors ${
                    selectedDemo === demo.key
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                      : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">{demo.label}</div>
                  <div className="text-sm text-gray-400">{demo.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Demo Area */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Demo Area</h2>
              
              {/* Authentication Status */}
              <div>
                <h3 className="text-lg font-medium mb-3">Authentication Status</h3>
                <CustomAuthStatus />
              </div>

              {/* Selected Demo */}
              <div>
                <h3 className="text-lg font-medium mb-3">
                  {selectedDemo === 'simple' && 'Simple Drop-in Component'}
                  {selectedDemo === 'custom' && 'Custom Login Form'}
                  {selectedDemo === 'headless' && 'Headless Hook Implementation'}
                </h3>

                {selectedDemo === 'simple' && (
                  <div className="space-y-4">
                    <p className="text-gray-400 text-sm">
                      The simplest way to add Bitcoin authentication to any app. 
                      Just wrap with provider and add the button.
                    </p>
                    <div className="p-6 bg-gray-900 rounded-lg border border-gray-700">
                      <AuthButton mode="signin">
                        Sign In with Bitcoin
                      </AuthButton>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {`<AuthButton mode="signin">Sign In with Bitcoin</AuthButton>`}
                    </div>
                  </div>
                )}

                {selectedDemo === 'custom' && (
                  <div className="space-y-4">
                    <p className="text-gray-400 text-sm">
                      Full-featured login form with complete authentication flow.
                      Handles signup, signin, backup import, and OAuth linking.
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowLoginForm(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Open Login Form
                      </button>
                      
                      {showLoginForm && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full relative">
                            <button
                              onClick={() => setShowLoginForm(false)}
                              className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                              ✕
                            </button>
                            
                            <LoginForm 
                              mode="signin"
                              onSuccess={handleSuccess}
                              onError={handleError}
                              className="mt-4"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {`<LoginForm mode="signin" onSuccess={handleSuccess} onError={handleError} />`}
                    </div>
                  </div>
                )}

                {selectedDemo === 'headless' && (
                  <div className="space-y-4">
                    <p className="text-gray-400 text-sm">
                      Use the headless hook to build completely custom authentication UIs.
                      Full access to all authentication state and actions.
                    </p>
                    <HeadlessDemo onLog={addLog} />
                  </div>
                )}
              </div>
            </div>

            {/* Documentation & Logs */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Event Logs</h3>
                <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="text-gray-500 text-sm">No events yet...</div>
                  ) : (
                    <div className="space-y-1">
                      {logs.map((log, index) => (
                        <div key={index} className="text-xs font-mono text-green-400">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setLogs([])}
                  className="mt-2 text-xs text-gray-400 hover:text-white"
                >
                  Clear logs
                </button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Configuration</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(demoConfig, null, 2)}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Quick Start</h3>
                <div className="bg-gray-900 rounded-lg p-4 text-sm space-y-3">
                  <div>
                    <div className="text-gray-400 mb-1">1. Install the library:</div>
                    <code className="text-green-400 font-mono text-xs">npm install @bitcoin-auth/react</code>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">2. Wrap your app:</div>
                    <code className="text-blue-400 font-mono text-xs">{'<BitcoinAuthProvider config={config}>'}</code>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">3. Add authentication:</div>
                    <code className="text-orange-400 font-mono text-xs">{'<AuthButton />'}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <div className="text-gray-400 text-sm">
                Bitcoin Authentication Component Library Demo
              </div>
              <div className="flex space-x-4 text-sm">
                <a href="/storybook" className="text-blue-400 hover:text-blue-300">
                  View Storybook
                </a>
                <a href="https://github.com/your-org/bitcoin-auth" className="text-blue-400 hover:text-blue-300">
                  GitHub
                </a>
                <a href="/docs" className="text-blue-400 hover:text-blue-300">
                  Documentation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BitcoinAuthProvider>
  );
}

// Headless demo component
function HeadlessDemo({ onLog }: { onLog: (message: string) => void }) {
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    error,
    signIn, 
    signUp, 
    signOut,
    generateBackup,
    hasLocalBackup,
    currentStep,
    mode,
    setMode,
    reset
  } = useBitcoinAuth();

  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!password) return;
    onLog('Attempting sign in with headless hook...');
    const result = await signIn(password);
    if (result.success) {
      onLog('Sign in successful via headless hook');
    } else {
      onLog(`Sign in failed: ${result.error?.message}`);
    }
  };

  const handleGenerateBackup = () => {
    onLog('Generating new backup...');
    const backup = generateBackup();
    onLog(`Generated backup with mnemonic: ${backup.mnemonic.split(' ').slice(0, 3).join(' ')}...`);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-900 rounded-lg">
        <h4 className="font-medium mb-3">Hook State</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">Authenticated:</span>{' '}
            <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>
              {isAuthenticated ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Loading:</span>{' '}
            <span className={isLoading ? 'text-yellow-400' : 'text-gray-400'}>
              {isLoading ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Has Backup:</span>{' '}
            <span className={hasLocalBackup ? 'text-green-400' : 'text-gray-400'}>
              {hasLocalBackup ? 'Yes' : 'No'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Current Step:</span>{' '}
            <span className="text-blue-400">{currentStep}</span>
          </div>
          <div>
            <span className="text-gray-400">Mode:</span>{' '}
            <span className="text-purple-400">{mode}</span>
          </div>
          <div>
            <span className="text-gray-400">Error:</span>{' '}
            <span className={error ? 'text-red-400' : 'text-gray-400'}>
              {error ? error.code : 'None'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-900 rounded-lg">
        <h4 className="font-medium mb-3">Actions</h4>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
            />
            <button
              onClick={handleSignIn}
              disabled={!password || isLoading}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded text-sm"
            >
              Sign In
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleGenerateBackup}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
            >
              Generate Backup
            </button>
            <button
              onClick={() => {
                setMode('signup');
                onLog('Switched to signup mode');
              }}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
            >
              Switch to Signup
            </button>
            <button
              onClick={() => {
                reset();
                onLog('Reset authentication state');
              }}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm"
            >
              Reset
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  signOut();
                  onLog('Signed out via headless hook');
                }}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 font-mono bg-gray-900 p-3 rounded">
        {`const { signIn, signUp, signOut, user, isLoading } = useBitcoinAuth();`}
      </div>
    </div>
  );
}