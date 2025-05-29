'use client';

import React, { useState } from 'react';
import { 
  BitcoinAuthProvider, 
  AuthButton,
  LoginForm,
  OAuthProviders,
  AuthFlowOrchestrator,
  Modal,
  PasswordInput,
  LoadingButton,
  ErrorDisplay,
  WarningCard,
  StepIndicator,
  DeviceLinkQR,
  MemberExport,
  FileImport,
  type Step
} from 'bitcoin-auth-ui';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Code2, Sparkles, Shield, Zap, Globe } from 'lucide-react';

export default function ShowcasePage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

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
      onSuccess={(user) => router.push('/dashboard')}
    />
  );
}`,
    cli: `# Initialize bitcoin-auth-ui in your project
npx bitcoin-auth-ui init

# Add specific components
npx bitcoin-auth-ui add auth-button login-form

# Or add the complete authentication flow
npx bitcoin-auth-ui add auth-flow`
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
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-yellow-500 text-transparent bg-clip-text">
                Bitcoin Auth UI
              </h1>
              <div className="flex justify-center mb-4">
                <span className="px-3 py-1 bg-orange-600/20 border border-orange-600/50 rounded-full text-sm text-orange-500">
                  v0.0.5
                </span>
              </div>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Production-ready Bitcoin authentication components for React. 
                Beautiful, secure, and easy to integrate.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button
                  onClick={() => copyCode(codeExamples.cli, 'cli-hero')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-lg font-medium text-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                >
                  <span className="flex items-center gap-2">
                    {copiedCode === 'cli-hero' ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Code2 className="w-5 h-5" />
                        npx bitcoin-auth-ui init
                      </>
                    )}
                  </span>
                </button>
                
                <a
                  href="https://github.com/b-open-io/bitcoin-auth-ui"
                  className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-lg transition-colors flex items-center justify-center gap-2"
                >
                  View on GitHub
                </a>
              </div>

              {/* Feature badges */}
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">TypeScript Ready</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Secure by Default</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Lightning Fast</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full">
                  <Globe className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">OAuth Ready</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Component Showcase */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-4">Component Gallery</h2>
              <p className="text-xl text-gray-400">
                Everything you need for Bitcoin authentication, ready to use
              </p>
            </motion.div>

            <div className="space-y-24">
              {/* Auth Button Demo */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Drop-in Authentication</h3>
                  <p className="text-gray-400 mb-6">
                    The simplest way to add Bitcoin authentication. Just one component that handles everything.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-6 mb-6">
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
                <div className="bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300">
                    <code>{codeExamples.authButton}</code>
                  </pre>
                </div>
              </div>

              {/* Login Form Demo */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 bg-gray-900/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300">
                    <code>{codeExamples.loginForm}</code>
                  </pre>
                </div>
                <div className="order-1 lg:order-2">
                  <h3 className="text-2xl font-bold mb-4">Customizable Login Form</h3>
                  <p className="text-gray-400 mb-6">
                    A complete login form with password input, error handling, and loading states.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-6 mb-6">
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

              {/* OAuth Providers Demo */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">OAuth Provider Integration</h3>
                  <p className="text-gray-400 mb-6">
                    Beautiful OAuth buttons with proper company icons. Supports Google, GitHub, and X (Twitter).
                  </p>
                  <div className="bg-gray-900 rounded-lg p-6 mb-6">
                    <OAuthProviders 
                      action="signin"
                      onProviderClick={(provider) => console.log('Provider clicked:', provider)}
                    />
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-6">
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

              {/* Component Examples */}
              <div>
                <h3 className="text-2xl font-bold mb-8 text-center">UI Components</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Modal Demo */}
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Modal</h4>
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                    >
                      Open Modal
                    </button>
                    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-4">Example Modal</h3>
                        <p className="text-gray-400">Beautiful modal with backdrop blur and animations.</p>
                      </div>
                    </Modal>
                  </div>

                  {/* Password Input Demo */}
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Password Input</h4>
                    <PasswordInput
                      value={password}
                      onChange={setPassword}
                      placeholder="Enter password"
                    />
                  </div>

                  {/* Loading Button Demo */}
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Loading Button</h4>
                    <LoadingButton loading={false}>
                      Click Me
                    </LoadingButton>
                    <LoadingButton loading={true} className="mt-2">
                      Processing...
                    </LoadingButton>
                  </div>

                  {/* Error Display Demo */}
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Error Display</h4>
                    <ErrorDisplay error="This is an example error message" />
                  </div>

                  {/* Warning Card Demo */}
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Warning Card</h4>
                    <WarningCard
                      title="Important"
                      message="This is a warning message"
                    />
                  </div>

                  {/* Step Indicator Demo */}
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Step Indicator</h4>
                    <StepIndicator steps={steps} />
                    <button
                      onClick={() => setCurrentStep((prev) => (prev + 1) % steps.length)}
                      className="mt-4 text-sm text-orange-500 hover:text-orange-400"
                    >
                      Next Step →
                    </button>
                  </div>

                  {/* Device Link QR Demo */}
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Device Link QR</h4>
                    <DeviceLinkQR 
                      onGenerateQR={async () => {
                        // Demo implementation - in real app, call your API
                        return {
                          qrData: 'https://example.com/link/demo-token-12345',
                          token: 'demo-token-12345',
                          expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
                        };
                      }}
                      baseUrl="https://example.com"
                    />
                  </div>

                  {/* Member Export Demo */}
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Member Export</h4>
                    <MemberExport 
                      profileName="Demo Profile"
                      onGenerateExport={async () => {
                        // Demo implementation - in real app, call your API
                        return {
                          qrData: 'https://example.com/export/demo-token',
                          token: 'demo-export-token',
                          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                        };
                      }}
                      baseUrl="https://example.com"
                    />
                  </div>

                  {/* File Import Demo */}
                  <div className="bg-gray-900 rounded-lg p-6 lg:col-span-2">
                    <h4 className="font-semibold mb-4">File Import</h4>
                    <FileImport 
                      onFileValidated={(file, result) => {
                        console.log('File validated:', file.name, result);
                      }}
                      onError={(error) => console.log('Import error:', error)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Complete Flow Demo */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Complete Authentication Flow</h2>
              <p className="text-xl text-gray-400">
                Everything orchestrated for you with AuthFlowOrchestrator
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="bg-gray-900 rounded-lg p-8">
                <AuthFlowOrchestrator
                  flowType="unified"
                  enableOAuth={true}
                  enableDeviceLink={true}
                  enableFileImport={true}
                  onSuccess={(user) => console.log('Demo success:', user)}
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Features</h3>
                <ul className="space-y-3 text-gray-300 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Unified signin/signup detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>OAuth provider integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Device linking via QR code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Backup file import</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <span>Multi-step flows with progress</span>
                  </li>
                </ul>

                <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300">
                    <code>{codeExamples.authFlow}</code>
                  </pre>
                </div>
                
                <button
                  onClick={() => copyCode(codeExamples.authFlow, 'authFlow')}
                  className="mt-4 text-sm text-orange-500 hover:text-orange-400 flex items-center gap-2"
                >
                  {copiedCode === 'authFlow' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy code
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Installation Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Get Started</h2>
            
            <div className="space-y-8">
              <div className="bg-gray-900 rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-4">Option 1: Install the Package</h3>
                <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto mb-4">
                  <code>npm install bitcoin-auth-ui@0.0.5</code>
                </pre>
                <p className="text-gray-400">
                  Install the complete package with all components and TypeScript support.
                </p>
              </div>

              <div className="bg-gray-900 rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-4">Option 2: Use the CLI (Recommended)</h3>
                <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto mb-4">
                  <code>{codeExamples.cli}</code>
                </pre>
                <p className="text-gray-400">
                  Add only the components you need. Works like shadcn/ui - components are copied to your project for full customization.
                </p>
              </div>

              <div className="bg-gray-900 rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-4">Peer Dependencies</h3>
                <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto mb-4">
                  <code>npm install @bsv/sdk bitcoin-auth bitcoin-backup bsv-bap react react-dom</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400">
              Built with ❤️ by the{' '}
              <a href="https://1sat.com" className="text-orange-500 hover:text-orange-400">
                1Sat
              </a>{' '}
              team for the Bitcoin SV ecosystem
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
              <a
                href="https://bitcoin-auth-ui-storybook.vercel.app"
                className="text-gray-400 hover:text-white"
              >
                Storybook
              </a>
            </div>
          </div>
        </footer>
      </div>
    </BitcoinAuthProvider>
  );
}