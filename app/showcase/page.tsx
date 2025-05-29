'use client';

import React, { useState } from 'react';
import { 
  BitcoinAuthProvider, 
  AuthButton,
  LoginForm,
  OAuthProviders,
  AuthFlowOrchestrator,
  DeviceLinkQR,
  MemberExport,
  FileImport,
  StepIndicator,
  HandCashConnector,
  YoursWalletConnector,
  type Step
} from 'bitcoin-auth-ui';
import { motion } from 'framer-motion';
import { CheckCircle2, Code2, Sparkles, Shield, Zap, Globe, Key, QrCode, Download, Workflow } from 'lucide-react';
import QRCode from 'qrcode';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';

export default function ShowcasePage() {
  const [selectedFlow, setSelectedFlow] = useState<'unified' | 'signin' | 'signup' | 'oauth-restore'>('unified');

  const codeExamples = {
    authButton: `import { BitcoinAuthProvider, AuthButton } from 'bitcoin-auth-ui';

function App() {
  return (
    <BitcoinAuthProvider>
      <AuthButton>Sign In with Bitcoin</AuthButton>
    </BitcoinAuthProvider>
  );
}`,
    loginForm: `import { LoginForm } from 'bitcoin-auth-ui';

function SignInPage() {
  return (
    <LoginForm
      mode="signin"
      onSuccess={(user) => console.log('Signed in:', user)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}`,
    authFlow: `import { AuthFlowOrchestrator } from 'bitcoin-auth-ui';

function AuthPage() {
  return (
    <AuthFlowOrchestrator
      flowType="unified"
      enableOAuth={true}
      enableDeviceLink={true}
      onSuccess={(user) => router.push('/dashboard')}
    />
  );
}`,
    deviceLink: `import { DeviceLinkQR } from 'bitcoin-auth-ui';

function DeviceLinkPage() {
  return (
    <DeviceLinkQR
      onGenerateQR={async () => {
        const res = await fetch('/api/device-link/generate');
        const { qrData, token } = await res.json();
        return { qrData, token, expiresAt };
      }}
      baseUrl={window.location.origin}
    />
  );
}`,
    fileImport: `import { FileImport } from 'bitcoin-auth-ui';

function ImportBackup() {
  return (
    <FileImport
      onFileValidated={(file, result) => {
        // Handle validated backup file
        console.log('Backup type:', result.type);
      }}
      onError={(error) => alert(error)}
    />
  );
}`
  };

  const steps: Step[] = [
    { id: 'generate', label: 'Generate Identity', status: 'complete' },
    { id: 'password', label: 'Set Password', status: 'active' },
    { id: 'backup', label: 'Save Backup', status: 'pending' },
    { id: 'link', label: 'Link Cloud', status: 'pending' }
  ];

  return (
    <BitcoinAuthProvider config={{ apiUrl: '/api' }}>
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-transparent to-purple-600/20" />
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Production-Ready Components</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Bitcoin Auth UI
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
                Beautiful, accessible React components for Bitcoin authentication. 
                Built with TypeScript, TailwindCSS, and Framer Motion.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <a
                  href="https://github.com/bitcoin-auth/bitcoin-auth-ui"
                  className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View on GitHub
                </a>
                <code className="px-6 py-3 bg-gray-900 rounded-lg text-orange-500 font-mono">
                  npm install bitcoin-auth-ui
                </code>
              </div>

              <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Secure by Default</h3>
                  <p className="text-sm text-gray-500">Client-side encryption</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Lightning Fast</h3>
                  <p className="text-sm text-gray-500">Optimized performance</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Code2 className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Developer Friendly</h3>
                  <p className="text-sm text-gray-500">Great DX with TypeScript</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Fully Accessible</h3>
                  <p className="text-sm text-gray-500">WCAG 2.1 compliant</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Authentication Components */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full mb-4">
                <Key className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">Authentication</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Core Authentication Components</h2>
              <p className="text-xl text-gray-400">
                Everything you need for Bitcoin-based authentication
              </p>
            </div>

            <div className="space-y-24">
              {/* Auth Button Demo */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Drop-in Authentication</h3>
                  <p className="text-gray-400 mb-6">
                    The simplest way to add Bitcoin authentication. Just one component that handles everything.
                  </p>
                  <div className="bg-gray-950 border border-gray-900 rounded-lg p-6 mb-6">
                    <AuthButton>Sign In with Bitcoin</AuthButton>
                  </div>
                </div>
                <TerminalCodeBlock
                  code={codeExamples.authButton}
                  language="jsx"
                  filename="App.jsx"
                />
              </div>

              {/* Login Form Demo */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <TerminalCodeBlock
                    code={codeExamples.loginForm}
                    language="jsx"
                    filename="SignInPage.jsx"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <h3 className="text-2xl font-bold mb-4">Customizable Login Form</h3>
                  <p className="text-gray-400 mb-6">
                    A complete login form with password input, error handling, and loading states.
                  </p>
                  <div className="bg-gray-950 border border-gray-900 rounded-lg p-6 mb-6">
                    <LoginForm 
                      mode="signin"
                      onSuccess={() => console.log('Demo success')}
                      onError={() => console.log('Demo error')}
                    />
                  </div>
                </div>
              </div>

              {/* OAuth Providers */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">OAuth Cloud Backup</h3>
                  <p className="text-gray-400 mb-6">
                    Let users store encrypted backups with their favorite OAuth providers. No more lost keys!
                  </p>
                  <div className="bg-gray-950 border border-gray-900 rounded-lg p-6 mb-6">
                    <OAuthProviders
                      onProviderClick={(provider) => console.log('Selected:', provider)}
                    />
                  </div>
                  <div className="bg-gray-950 border border-gray-900 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Features:</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Google, GitHub, Twitter integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>HandCash and Yours Wallet support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Loading states and animations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Extensible provider system</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="bg-gray-950 border border-gray-900 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Step Indicator</h4>
                  <StepIndicator steps={steps} />
                  <p className="text-sm text-gray-400 mt-4">
                    Guide users through multi-step processes with clear visual progress
                  </p>
                </div>
              </div>

              {/* BSV Wallet Integration */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">BSV Wallet Integration</h3>
                  <p className="text-gray-400 mb-6">
                    Native BSV wallet connectors for HandCash and Yours Wallet with OAuth flows and transaction support.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-950 border border-gray-900 rounded-lg p-6">
                      <h4 className="font-semibold mb-4 text-orange-500">HandCash Connector</h4>
                      <HandCashConnector
                        config={{
                          appId: "demo-app-id",
                          appSecret: "demo-app-secret",
                          redirectUrl: typeof window !== 'undefined' ? `${window.location.origin}/auth/handcash` : '',
                          environment: "iae"
                        }}
                        onSuccess={(result) => console.log('HandCash connected:', result)}
                        onError={(error) => console.error('HandCash error:', error)}
                      />
                    </div>
                    
                    <div className="bg-gray-950 border border-gray-900 rounded-lg p-6">
                      <h4 className="font-semibold mb-4 text-blue-500">Yours Wallet Connector</h4>
                      <YoursWalletConnector
                        onSuccess={(result) => console.log('Yours Wallet connected:', result)}
                        onError={(error) => console.error('Yours Wallet error:', error)}
                      />
                    </div>
                  </div>
                </div>
                
                <TerminalCodeBlock
                  code={`// HandCash OAuth Integration
<HandCashConnector
  config={{
    appId: process.env.HANDCASH_APP_ID,
    appSecret: process.env.HANDCASH_APP_SECRET,
    redirectUrl: "/auth/handcash",
    environment: "prod"
  }}
  onSuccess={(result) => {
    console.log('Auth token:', result.authToken);
    console.log('Profile:', result.profile);
    // Access encrypted backups using HandCash keys
  }}
/>

// Yours Wallet Browser Extension
<YoursWalletConnector
  onSuccess={(result) => {
    console.log('Public key:', result.publicKey);
    // Wallet operations via browser extension
  }}
  onError={console.error}
/>`}
                  language="jsx"
                  filename="WalletIntegration.jsx"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Device Linking Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950 border-t border-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full mb-4">
                <QrCode className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">Device Linking</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Cross-Device Authentication</h2>
              <p className="text-xl text-gray-400">
                Link devices securely without relying on cloud providers
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-4">Device Link QR</h3>
                <p className="text-gray-400 mb-6">
                  Generate time-limited QR codes for secure device-to-device linking. Perfect for onboarding new devices.
                </p>
                <div className="bg-black border border-gray-900 rounded-lg p-6">
                  <DeviceLinkQR 
                    onGenerateQR={async () => {
                      const url = 'https://example.com/link/demo-token-12345';
                      const qrDataUrl = await QRCode.toDataURL(url);
                      return {
                        qrData: qrDataUrl,
                        token: 'demo-token-12345',
                        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                      };
                    }}
                    baseUrl="https://example.com"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Member Export</h3>
                <p className="text-gray-400 mb-6">
                  Export member profiles with QR codes for easy sharing between devices or users.
                </p>
                <div className="bg-black border border-gray-900 rounded-lg p-6">
                  <MemberExport 
                    profileName="Demo Profile"
                    onGenerateExport={async () => {
                      const url = 'https://example.com/export/demo-token';
                      const qrDataUrl = await QRCode.toDataURL(url);
                      return {
                        qrData: qrDataUrl,
                        token: 'demo-export-token',
                        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                      };
                    }}
                    baseUrl="https://example.com"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12">
              <TerminalCodeBlock
                code={codeExamples.deviceLink}
                language="jsx"
                filename="DeviceLinkPage.jsx"
              />
            </div>
          </div>
        </section>

        {/* Backup Management Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full mb-4">
                <Download className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">Backup Management</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Secure Backup & Recovery</h2>
              <p className="text-xl text-gray-400">
                Multiple ways to backup and restore Bitcoin identities
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-2xl font-bold mb-4">File Import</h3>
                <p className="text-gray-400 mb-6">
                  Import existing backups from multiple formats with automatic detection and validation.
                </p>
                <div className="bg-gray-950 border border-gray-900 rounded-lg p-6">
                  <FileImport 
                    onFileValidated={(file, result) => {
                      console.log('File validated:', file.name, result);
                    }}
                    onError={(error) => console.log('Import error:', error)}
                  />
                </div>
                <div className="mt-4 p-4 bg-gray-950 border border-gray-900 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">Supported formats:</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Encrypted backups (.txt)</li>
                    <li>• WIF format (.txt)</li>
                    <li>• BapMasterBackup (.json)</li>
                    <li>• BapMemberBackup (.json)</li>
                    <li>• OneSatBackup (.json)</li>
                  </ul>
                </div>
              </div>

              <TerminalCodeBlock
                code={codeExamples.fileImport}
                language="jsx"
                filename="ImportBackup.jsx"
              />
            </div>
          </div>
        </section>

        {/* Complete Flows Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950 border-t border-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full mb-4">
                <Workflow className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">Complete Flows</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Authentication Flows</h2>
              <p className="text-xl text-gray-400">
                Pre-built flows that handle the entire authentication journey
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
              <div>
                <h3 className="text-xl font-bold mb-4">Available Flows</h3>
                <p className="text-gray-400 mb-6">Click on a flow to see it in action</p>
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedFlow('unified')}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedFlow === 'unified' 
                        ? 'bg-orange-500/10 border-orange-500/50' 
                        : 'bg-black border-gray-900 hover:border-gray-800'
                    }`}
                  >
                    <h4 className="font-semibold text-orange-500 mb-2">Unified Flow</h4>
                    <p className="text-sm text-gray-400">
                      Smart detection of new vs returning users with seamless transitions
                    </p>
                  </button>
                  <button
                    onClick={() => setSelectedFlow('signin')}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedFlow === 'signin' 
                        ? 'bg-blue-500/10 border-blue-500/50' 
                        : 'bg-black border-gray-900 hover:border-gray-800'
                    }`}
                  >
                    <h4 className="font-semibold text-blue-500 mb-2">Sign In Flow</h4>
                    <p className="text-sm text-gray-400">
                      For returning users with local backup, OAuth restore, or import options
                    </p>
                  </button>
                  <button
                    onClick={() => setSelectedFlow('signup')}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedFlow === 'signup' 
                        ? 'bg-green-500/10 border-green-500/50' 
                        : 'bg-black border-gray-900 hover:border-gray-800'
                    }`}
                  >
                    <h4 className="font-semibold text-green-500 mb-2">Sign Up Flow</h4>
                    <p className="text-sm text-gray-400">
                      New user onboarding with identity generation and backup creation
                    </p>
                  </button>
                  <button
                    onClick={() => setSelectedFlow('oauth-restore')}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedFlow === 'oauth-restore' 
                        ? 'bg-purple-500/10 border-purple-500/50' 
                        : 'bg-black border-gray-900 hover:border-gray-800'
                    }`}
                  >
                    <h4 className="font-semibold text-purple-500 mb-2">OAuth Restore</h4>
                    <p className="text-sm text-gray-400">
                      Recover encrypted backups from cloud providers
                    </p>
                  </button>
                </div>
              </div>
              
              <div className="bg-black border border-gray-900 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-2">
                  {selectedFlow === 'unified' && 'Unified Flow'}
                  {selectedFlow === 'signin' && 'Sign In Flow'}
                  {selectedFlow === 'signup' && 'Sign Up Flow'}
                  {selectedFlow === 'oauth-restore' && 'OAuth Restore Flow'}
                </h3>
                <p className="text-gray-400 mb-6 text-sm">
                  {selectedFlow === 'unified' && 'Automatically detects new vs returning users'}
                  {selectedFlow === 'signin' && 'For users with existing Bitcoin identities'}
                  {selectedFlow === 'signup' && 'Create a new Bitcoin identity from scratch'}
                  {selectedFlow === 'oauth-restore' && 'Restore from cloud backup providers'}
                </p>
                <AuthFlowOrchestrator
                  key={selectedFlow}
                  flowType={selectedFlow}
                  enableOAuth={true}
                  enableDeviceLink={selectedFlow !== 'oauth-restore'}
                  enableFileImport={selectedFlow !== 'oauth-restore'}
                  onSuccess={(user) => console.log('Demo success:', user)}
                />
              </div>
            </div>

            {/* AuthFlowOrchestrator Code Section */}
            <div className="border-t border-gray-900 pt-16">
              <h3 className="text-2xl font-bold mb-4 text-center">How AuthFlowOrchestrator Works</h3>
              <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
                The AuthFlowOrchestrator is a smart component that manages the entire authentication experience. 
                It automatically detects the user's state and guides them through the appropriate flow.
              </p>
              
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Features</h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Automatic flow detection based on local storage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Seamless transitions between different states</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Built-in error handling and recovery</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>OAuth, device linking, and file import support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Fully customizable with props and callbacks</span>
                    </li>
                  </ul>
                  
                  <h4 className="text-lg font-semibold mb-4 mt-8">Configuration Options</h4>
                  <TerminalCodeBlock
                    code={`interface AuthFlowOrchestratorProps {
  flowType: 'unified' | 'signin' | 'signup' | 'oauth-restore';
  enableOAuth?: boolean;
  enableDeviceLink?: boolean;
  enableFileImport?: boolean;
  onSuccess: (user: AuthUser) => void;
  onError?: (error: AuthError) => void;
}`}
                    language="typescript"
                    filename="types.ts"
                  />
                </div>
                
                <TerminalCodeBlock
                  code={codeExamples.authFlow}
                  language="jsx"
                  filename="AuthPage.jsx"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Customization Showcase Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-900 bg-black relative overflow-hidden">
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(cyan 1px, transparent 1px),
                  linear-gradient(90deg, cyan 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                animation: 'grid-move 20s linear infinite',
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-400 uppercase tracking-wider">Fully Customizable</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                Make It Your Own
              </h2>
              <p className="text-xl text-gray-300">
                Every component can be styled to match your brand. Here's a cyberpunk theme example.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Cyberpunk themed component */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 rounded-lg blur-md opacity-60" />
                <div className="relative bg-black rounded-lg p-8 border border-cyan-500/30">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                      SYSTEM ACCESS
                    </h3>
                    <p className="text-cyan-300/70 text-sm uppercase tracking-wider">Initialize Neural Link</p>
                  </div>
                  
                  {/* Custom styled LoginForm with Tailwind */}
                  <div className="cyberpunk-theme">
                    <style jsx global>{`
                      @keyframes grid-move {
                        0% { transform: translate(0, 0); }
                        100% { transform: translate(50px, 50px); }
                      }
                      
                      @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(100%); }
                      }
                      
                      .cyberpunk-theme button {
                        @apply relative overflow-hidden;
                        background: linear-gradient(45deg, #00ffff, #ff00ff);
                        transition: all 0.3s ease;
                      }
                      
                      .cyberpunk-theme button::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        background: linear-gradient(45deg, transparent, rgba(255,255,255,0.6), transparent);
                        transform: translateX(-100%);
                        transition: transform 0.6s;
                      }
                      
                      .cyberpunk-theme button:hover::before {
                        animation: shimmer 0.6s ease-out;
                      }
                      
                      .cyberpunk-theme button:hover {
                        transform: scale(1.05);
                        box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff;
                      }
                      
                      .cyberpunk-theme input {
                        background: rgba(0, 255, 255, 0.1) !important;
                        border: 2px solid #00ffff !important;
                        color: #00ffff !important;
                        font-family: 'Courier New', monospace !important;
                      }
                      
                      .cyberpunk-theme input:focus {
                        border-color: #ff00ff !important;
                        box-shadow: 0 0 10px #ff00ff, inset 0 0 10px rgba(255, 0, 255, 0.2) !important;
                        background: rgba(255, 0, 255, 0.1) !important;
                      }
                      
                      .cyberpunk-theme input::placeholder {
                        color: rgba(0, 255, 255, 0.5) !important;
                      }
                    `}</style>
                    <div className="[&_button]:bg-gradient-to-r [&_button]:from-cyan-400 [&_button]:to-fuchsia-500 [&_button]:text-black [&_button]:font-bold [&_button]:uppercase [&_button]:tracking-widest [&_button]:px-6 [&_button]:py-3 [&_button]:border-none [&_button]:transition-all [&_button]:duration-300 [&_h1]:uppercase [&_h1]:tracking-[3px] [&_h2]:uppercase [&_h2]:tracking-[3px] [&_h3]:uppercase [&_h3]:tracking-[3px] [&_h1]:drop-shadow-[0_0_10px_currentColor] [&_h2]:drop-shadow-[0_0_10px_currentColor] [&_h3]:drop-shadow-[0_0_10px_currentColor]">
                      <LoginForm
                        mode="signin"
                        onSuccess={() => console.log('Access granted')}
                        onError={() => console.log('Access denied')}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 border border-cyan-500/30 rounded bg-cyan-500/5">
                    <p className="text-xs text-cyan-400 font-mono">
                      SYSTEM STATUS: <span className="text-green-400">ONLINE</span>
                    </p>
                    <p className="text-xs text-cyan-400 font-mono">
                      SECURITY LEVEL: <span className="text-yellow-400">MAXIMUM</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Code example */}
              <div>
                <h3 className="text-xl font-bold mb-4">Customize with Tailwind CSS</h3>
                <p className="text-gray-400 mb-6">
                  bitcoin-auth-ui is built with Tailwind CSS. Override styles using arbitrary value selectors, @apply directive, or custom classes.
                </p>
                
                <div className="mb-6">
                  <TerminalCodeBlock
                    code={`// Method 1: Use Tailwind arbitrary value selectors
<div className="[&_button]:bg-gradient-to-r [&_button]:from-cyan-400 [&_button]:to-fuchsia-500 [&_button]:text-black [&_button]:font-bold [&_button]:uppercase [&_button]:tracking-widest">
  <LoginForm mode="signin" onSuccess={handleSuccess} />
</div>

// Method 2: CSS + Tailwind @apply
<style jsx global>{\`
  .cyberpunk-theme button {
    @apply relative overflow-hidden;
    background: linear-gradient(45deg, #00ffff, #ff00ff);
  }
  
  .cyberpunk-theme input {
    @apply font-mono text-cyan-400 border-2 border-cyan-400;
    background: rgba(0, 255, 255, 0.1) !important;
  }
\`}</style>

// Method 3: Custom CSS classes
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00ffff',
        'neon-pink': '#ff00ff',
      }
    }
  }
}`}
                    language="jsx"
                    filename="CustomTheme.jsx"
                  />
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-950 border border-gray-900 rounded-lg">
                    <h4 className="font-semibold mb-2">Theme Ideas</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• <span className="text-cyan-400">Cyberpunk</span> - Neon colors, glowing effects</li>
                      <li>• <span className="text-green-400">Matrix</span> - Green terminals, cascading text</li>
                      <li>• <span className="text-purple-400">Synthwave</span> - Retro 80s aesthetics</li>
                      <li>• <span className="text-orange-400">Minimal</span> - Clean, modern design</li>
                      <li>• <span className="text-blue-400">Corporate</span> - Professional look</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-950 border border-gray-900 rounded-lg">
                    <h4 className="font-semibold mb-2">Customization Methods</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>✓ Tailwind arbitrary value selectors <code className="text-cyan-400">[&_button]:bg-red-500</code></li>
                      <li>✓ CSS-in-JS with <code className="text-cyan-400">@apply</code> directive</li>
                      <li>✓ Custom Tailwind config extensions</li>
                      <li>✓ CSS custom properties and variables</li>
                      <li>✓ Component composition patterns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400">
              Built with ❤️ by the <a href="https://1satordinals.com" className="text-orange-500 hover:text-orange-400">1Sat</a> team. MIT Licensed.
            </p>
            <div className="flex justify-center gap-6 mt-6">
              <a
                href="https://github.com/b-open-io/bitcoin-auth-ui"
                className="text-gray-400 hover:text-white"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/bitcoin-auth-ui"
                className="text-gray-400 hover:text-white"
              >
                npm
              </a>
            </div>
          </div>
        </footer>
      </div>
    </BitcoinAuthProvider>
  );
}