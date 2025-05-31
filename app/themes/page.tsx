'use client';

import React, { useState } from 'react';
import {
  BitcoinAuthProvider,
  BitcoinThemeProvider,
  BitcoinQueryProvider,
  // Auth components
  AuthFlowOrchestrator,
  LoginForm,
  SignupFlow,
  AuthButton,
  // UI components
  LoadingButton,
  PasswordInput,
  StepIndicator,
  Modal,
  ErrorDisplay,
  WarningCard,
  // Social components
  PostButton,
  LikeButton,
  FollowButton,
  // Market components
  CreateListingButton,
  BuyListingButton,
  type AssetType,
  // Wallet components
  SendBSVButton,
  DonateButton,
  QuickDonateButton,
  // OAuth & Connectors
  OAuthProviders,
  HandCashConnector,
  YoursWalletConnector,
  // Backup & Device
  FileImport,
  DeviceLinkQR,
  BackupDownload,
  MnemonicDisplay,
  // Layout components
  AuthLayout,
  CenteredLayout,
  // Security
  ShamirSecretSharing,
  KeyManager,
  Type42KeyDerivation
} from 'bigblocks';
import Link from 'next/link';
import { 
  Palette, 
  Sun, 
  Moon,
  Maximize2,
  Circle,
  Square,
  Copy,
  Check
} from 'lucide-react';

type BitcoinTheme = 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'red' | 'pink' | 'indigo';
type Appearance = 'light' | 'dark';
type Radius = 'none' | 'small' | 'medium' | 'large' | 'full';
type Scaling = '90%' | '95%' | '100%' | '105%' | '110%';

export default function ThemesPage() {
  const [bitcoinTheme, setBitcoinTheme] = useState<BitcoinTheme>('orange');
  const [appearance, setAppearance] = useState<Appearance>('dark');
  const [radius, setRadius] = useState<Radius>('medium');
  const [scaling, setScaling] = useState<Scaling>('100%');
  const [copied, setCopied] = useState(false);
  
  // Example data for components
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const themes: { value: BitcoinTheme; label: string; color: string }[] = [
    { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
    { value: 'yellow', label: 'Yellow', color: 'bg-yellow-500' },
    { value: 'green', label: 'Green', color: 'bg-green-500' },
    { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { value: 'red', label: 'Red', color: 'bg-red-500' },
    { value: 'pink', label: 'Pink', color: 'bg-pink-500' },
    { value: 'indigo', label: 'Indigo', color: 'bg-indigo-500' }
  ];

  const radiusOptions: { value: Radius; label: string; icon: React.ReactNode }[] = [
    { value: 'none', label: 'None', icon: <Square className="w-4 h-4" /> },
    { value: 'small', label: 'Small', icon: <Square className="w-4 h-4 rounded-sm" /> },
    { value: 'medium', label: 'Medium', icon: <Square className="w-4 h-4 rounded" /> },
    { value: 'large', label: 'Large', icon: <Square className="w-4 h-4 rounded-lg" /> },
    { value: 'full', label: 'Full', icon: <Circle className="w-4 h-4" /> }
  ];

  const copyConfig = () => {
    const config = `<BitcoinThemeProvider
  bitcoinTheme="${bitcoinTheme}"
  appearance="${appearance}"
  radius="${radius}"
  scaling="${scaling}"
>
  {children}
</BitcoinThemeProvider>`;
    
    navigator.clipboard.writeText(config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BitcoinQueryProvider>
      <BitcoinAuthProvider config={{ apiUrl: '/api' }}>
        <BitcoinThemeProvider 
          bitcoinTheme={bitcoinTheme}
          appearance={appearance}
          radius={radius}
          scaling={scaling}
        >
          <div className="min-h-screen bg-gray-1 text-gray-12">
            {/* Header */}
            <header className="border-b border-gray-6 sticky top-0 bg-gray-1/95 backdrop-blur-sm z-50">
              <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <nav className="flex items-center space-x-8">
                    <Link href="/" className="text-gray-11 hover:text-gray-12 transition-colors">
                      Home
                    </Link>
                    <Link href="/quickstart" className="text-gray-11 hover:text-gray-12 transition-colors">
                      Quick Start
                    </Link>
                    <Link href="/themes" className="text-gray-12">
                      Themes
                    </Link>
                    <Link href="/components" className="text-gray-11 hover:text-gray-12 transition-colors">
                      Components
                    </Link>
                    <Link href="/mcp-server" className="text-gray-11 hover:text-gray-12 transition-colors">
                      MCP Server
                    </Link>
                  </nav>
                </div>
              </div>
            </header>

            <div className="max-w-[1920px] mx-auto">
              <div className="flex">
                {/* Sidebar Controls */}
                <aside className="w-80 border-r border-gray-6 p-6 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
                  <div className="space-y-8">
                    {/* Theme Selection */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-11 mb-4 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Color Theme
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {themes.map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => setBitcoinTheme(theme.value)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all ${
                              bitcoinTheme === theme.value
                                ? 'border-accent-9 bg-accent-3'
                                : 'border-gray-6 hover:border-gray-7'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full ${theme.color}`} />
                            <span className="text-sm">{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Appearance */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-11 mb-4">Appearance</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAppearance('light')}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border transition-all ${
                            appearance === 'light'
                              ? 'border-accent-9 bg-accent-3'
                              : 'border-gray-6 hover:border-gray-7'
                          }`}
                        >
                          <Sun className="w-4 h-4" />
                          <span className="text-sm">Light</span>
                        </button>
                        <button
                          onClick={() => setAppearance('dark')}
                          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border transition-all ${
                            appearance === 'dark'
                              ? 'border-accent-9 bg-accent-3'
                              : 'border-gray-6 hover:border-gray-7'
                          }`}
                        >
                          <Moon className="w-4 h-4" />
                          <span className="text-sm">Dark</span>
                        </button>
                      </div>
                    </div>

                    {/* Radius */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-11 mb-4">Border Radius</h3>
                      <div className="space-y-2">
                        {radiusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setRadius(option.value)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-md border transition-all ${
                              radius === option.value
                                ? 'border-accent-9 bg-accent-3'
                                : 'border-gray-6 hover:border-gray-7'
                            }`}
                          >
                            <span className="text-sm">{option.label}</span>
                            {option.icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Scaling */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-11 mb-4 flex items-center gap-2">
                        <Maximize2 className="w-4 h-4" />
                        UI Scale
                      </h3>
                      <div className="space-y-2">
                        {(['90%', '95%', '100%', '105%', '110%'] as Scaling[]).map((scale) => (
                          <button
                            key={scale}
                            onClick={() => setScaling(scale)}
                            className={`w-full px-3 py-2 rounded-md border transition-all text-sm ${
                              scaling === scale
                                ? 'border-accent-9 bg-accent-3'
                                : 'border-gray-6 hover:border-gray-7'
                            }`}
                          >
                            {scale}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Copy Config */}
                    <div className="pt-4 border-t border-gray-6">
                      <button
                        onClick={copyConfig}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-9 hover:bg-accent-10 text-white rounded-md transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Theme Config
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </aside>

                {/* Component Grid */}
                <main className="flex-1 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Authentication */}
                    <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-11 mb-4">Authentication</h3>
                      <div className="space-y-4">
                        <AuthButton>Sign In with Bitcoin</AuthButton>
                        <LoadingButton loading={loading} onClick={() => setLoading(!loading)}>
                          {loading ? 'Processing...' : 'Submit'}
                        </LoadingButton>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-11 mb-4">Form Inputs</h3>
                      <div className="space-y-4">
                        <PasswordInput
                          value={password}
                          onChange={setPassword}
                          placeholder="Enter password"
                        />
                        <input
                          type="text"
                          placeholder="Regular input"
                          className="w-full px-3 py-2 bg-gray-3 border border-gray-6 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-9"
                        />
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-11 mb-4">Progress</h3>
                      <StepIndicator
                        steps={[
                          { id: '1', label: 'Generate', status: 'complete' },
                          { id: '2', label: 'Password', status: 'active' },
                          { id: '3', label: 'Backup', status: 'pending' }
                        ]}
                      />
                    </div>

                    {/* Social Actions */}
                    <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-11 mb-4">Social</h3>
                      <div className="space-y-3">
                        <PostButton />
                        <div className="flex gap-2">
                          <LikeButton txid="demo-txid" />
                          <FollowButton idKey="demo-id" />
                        </div>
                      </div>
                    </div>

                    {/* Market Actions */}
                    <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-11 mb-4">Marketplace</h3>
                      <div className="space-y-3">
                        <CreateListingButton />
                        <BuyListingButton 
                          listing={{
                            txid: 'demo',
                            vout: 0,
                            priceSats: 1000000,
                            payAddress: '1demo...',
                            ordAddress: '1demo...',
                            assetType: 'ordinals' as AssetType
                          } as any}
                        />
                      </div>
                    </div>

                    {/* Wallet */}
                    <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-11 mb-4">Wallet</h3>
                      <div className="space-y-3">
                        <SendBSVButton />
                        <DonateButton />
                        <QuickDonateButton />
                      </div>
                    </div>

                    {/* OAuth */}
                    <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-11 mb-4">OAuth & Wallets</h3>
                      <OAuthProviders 
                        onProviderClick={() => {}}
                      />
                    </div>

                    {/* File Operations */}
                    <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-11 mb-4">File & Backup</h3>
                      <div className="space-y-4">
                        <FileImport 
                          onFileValidated={() => {}}
                          onError={() => {}}
                        />
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-11 mb-4">Feedback</h3>
                      <div className="space-y-4">
                        <ErrorDisplay error="Something went wrong" />
                        <WarningCard message="Please backup your keys" />
                      </div>
                    </div>

                    {/* Modal Demo */}
                    <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-11 mb-4">Overlays</h3>
                      <button
                        onClick={() => setModalOpen(true)}
                        className="px-4 py-2 bg-accent-9 hover:bg-accent-10 text-white rounded-md transition-colors"
                      >
                        Open Modal
                      </button>
                      <Modal
                        isOpen={modalOpen}
                        onClose={() => setModalOpen(false)}
                        title="Example Modal"
                      >
                        <p className="text-gray-11">
                          This is a modal dialog demonstrating the theme.
                        </p>
                        <div className="mt-4 flex justify-end gap-3">
                          <button
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 border border-gray-6 rounded-md hover:bg-gray-3"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setModalOpen(false)}
                            className="px-4 py-2 bg-accent-9 hover:bg-accent-10 text-white rounded-md"
                          >
                            Confirm
                          </button>
                        </div>
                      </Modal>
                    </div>

                    {/* Full Width Components */}
                    <div className="col-span-full">
                      <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                        <h3 className="text-sm font-medium text-gray-11 mb-4">Login Form</h3>
                        <div className="max-w-md mx-auto">
                          <LoginForm 
                            mode="signin"
                            onSuccess={() => {}}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mnemonic Display */}
                    <div className="col-span-full lg:col-span-2">
                      <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                        <h3 className="text-sm font-medium text-gray-11 mb-4">Recovery Phrase</h3>
                        <MnemonicDisplay
                          mnemonic="example seed phrase words here for demonstration purposes only do not use this"
                          onContinue={() => {}}
                        />
                      </div>
                    </div>

                    {/* Device Link QR */}
                    <div className="col-span-full lg:col-span-2">
                      <div className="bg-gray-2 border border-gray-6 rounded-lg p-6">
                        <h3 className="text-sm font-medium text-gray-11 mb-4">Device Linking</h3>
                        <DeviceLinkQR 
                          onGenerateQR={async () => ({ 
                            token: 'demo-token',
                            qrData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
                            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                          })}
                          baseUrl="https://example.com"
                        />
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </BitcoinThemeProvider>
      </BitcoinAuthProvider>
    </BitcoinQueryProvider>
  );
}