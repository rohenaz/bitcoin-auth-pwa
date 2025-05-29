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
  type Step
} from 'bitcoin-auth-ui';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Code2, Sparkles, Shield, Zap, Globe, Key, QrCode, Download, Workflow } from 'lucide-react';
import QRCode from 'qrcode';

export default function ShowcasePage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

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
                  <button
                    onClick={() => copyCode(codeExamples.authButton, 'authButton')}
                    className="text-sm text-orange-500 hover:text-orange-400 flex items-center gap-2"
                  >
                    {copiedCode === 'authButton' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy code
                  </button>
                </div>
                <div className="bg-gray-950 border border-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300">
                    <code>{codeExamples.authButton}</code>
                  </pre>
                </div>
              </div>

              {/* Login Form Demo */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 bg-gray-950 border border-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300">
                    <code>{codeExamples.loginForm}</code>
                  </pre>
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
                  <button
                    onClick={() => copyCode(codeExamples.loginForm, 'loginForm')}
                    className="text-sm text-orange-500 hover:text-orange-400 flex items-center gap-2"
                  >
                    {copiedCode === 'loginForm' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copy code
                  </button>
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
                        <span>SVG company icons (not emojis!)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Loading states and animations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Linked provider indicators</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>Fully customizable</span>
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

            <div className="mt-12 bg-black border border-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300">
                <code>{codeExamples.deviceLink}</code>
              </pre>
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

              <div className="bg-gray-950 border border-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
                  <code>{codeExamples.fileImport}</code>
                </pre>
              </div>
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

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="bg-black border border-gray-900 rounded-lg p-8">
                <h3 className="text-xl font-bold mb-4">AuthFlowOrchestrator</h3>
                <p className="text-gray-400 mb-6">
                  Complete authentication with automatic flow detection, OAuth integration, and device linking.
                </p>
                <AuthFlowOrchestrator
                  flowType="unified"
                  enableOAuth={true}
                  enableDeviceLink={true}
                  enableFileImport={true}
                  onSuccess={(user) => console.log('Demo success:', user)}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Available Flows</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-black border border-gray-900 rounded-lg">
                    <h4 className="font-semibold text-orange-500 mb-2">Unified Flow</h4>
                    <p className="text-sm text-gray-400">
                      Smart detection of new vs returning users with seamless transitions
                    </p>
                  </div>
                  <div className="p-4 bg-black border border-gray-900 rounded-lg">
                    <h4 className="font-semibold text-blue-500 mb-2">Sign In Flow</h4>
                    <p className="text-sm text-gray-400">
                      For returning users with local backup, OAuth restore, or import options
                    </p>
                  </div>
                  <div className="p-4 bg-black border border-gray-900 rounded-lg">
                    <h4 className="font-semibold text-green-500 mb-2">Sign Up Flow</h4>
                    <p className="text-sm text-gray-400">
                      New user onboarding with identity generation and backup creation
                    </p>
                  </div>
                  <div className="p-4 bg-black border border-gray-900 rounded-lg">
                    <h4 className="font-semibold text-purple-500 mb-2">OAuth Restore</h4>
                    <p className="text-sm text-gray-400">
                      Recover encrypted backups from cloud providers
                    </p>
                  </div>
                </div>

                <div className="mt-8 bg-black border border-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300">
                    <code>{codeExamples.authFlow}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400">
              Built with ❤️ by the Bitcoin Auth team. MIT Licensed.
            </p>
          </div>
        </footer>
      </div>
    </BitcoinAuthProvider>
  );
}