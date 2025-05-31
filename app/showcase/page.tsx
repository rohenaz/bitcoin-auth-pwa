'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BitcoinAuthProvider,
  BitcoinQueryProvider, 
  AuthFlowOrchestrator,
  LoginForm,
  FileImport,
  DeviceLinkQR,
  MnemonicDisplay,
  // Market components - the real deal
  CreateListingButton,
  BuyListingButton,
  MarketTable,
  type MarketListing,
  type AssetType,
  // bSocial components
  PostButton,
  LikeButton,
  FollowButton,
  SocialFeed,
  PostCard,
  // Wallet components
  SendBSVButton,
  WalletOverview,
  // Missing OAuth & Wallet components
  OAuthProviders,
  HandCashConnector,
  YoursWalletConnector,
  OAuthConflictModal,
  // Missing backup & security components
  MemberExport,
  BackupDownload,
  BackupImport,
  IdentityGeneration,
  // Missing UI primitives
  LoadingButton,
  PasswordInput,
  StepIndicator,
  Modal,
  ErrorDisplay,
  WarningCard,
  QRCodeRenderer,
  // Missing layout components
  AuthLayout,
  CenteredLayout,
  LoadingLayout,
  ErrorLayout,
  SuccessLayout,
  // Missing auth flows
  SignupFlow,
  OAuthRestoreFlow,
  AuthButton,
  // Missing hooks
  useBitcoinAuth,
  useHandCash,
  useYoursWallet,
  useAuthMessages,
  // Security components
  ShamirSecretSharing,
  KeyManager,
  Type42KeyDerivation,
  // v0.2.2 New components
  DonateButton,
  QuickDonateButton
} from 'bitcoin-auth-ui';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Package,
  Fingerprint,
  Store,
  Users,
  Layout,
  Lock,
  Palette
} from 'lucide-react';
import QRCode from 'qrcode';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { getLatestBlockHeight } from '@/lib/block';

// Import section components
import { QuickStartSection } from './sections/QuickStart';
import { ThemeShowcaseSection } from './sections/ThemeShowcase';
import { LiveAPIsSection } from './sections/LiveAPIs';
import { AuthFlowsSection } from './sections/AuthFlows';
import { MarketSection } from './sections/Market';
import { SocialSection } from './sections/Social';
import { WalletSection } from './sections/Wallet';
import { OAuthConnectorsSection } from './sections/OAuthConnectors';
import { BackupQRSection } from './sections/BackupQR';
import { UIPrimitivesSection } from './sections/UIPrimitives';
import { LayoutComponentsSection } from './sections/LayoutComponents';
import { IdentitySection } from './sections/Identity';
import { SecuritySection } from './sections/Security';

export default function ShowcasePage() {
  // Real API data states
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [bapProfile, setBapProfile] = useState<Record<string, unknown> | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [bapAddress, setBapAddress] = useState('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
  const [fileValidationResult, setFileValidationResult] = useState<{
    fileName?: string;
    fileSize?: number;
    type?: string;
    valid: boolean;
    timestamp: string;
    error?: string;
  } | null>(null);
  
  // Hydration state
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Market component states
  const [marketListings, setMarketListings] = useState<MarketListing[]>([
    {
      txid: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
      vout: 0,
      priceSats: 1000000,
      payAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      ordAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      assetType: 'ordinals' as AssetType,
      origin: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b_0',
      contentType: 'image/webp',
      createdAt: Date.now() - 86400000,
      seller: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      height: 895234
    },
    {
      txid: '6f2e1a4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda44c',
      vout: 0,
      priceSats: 500000,
      payAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      ordAddress: '1C5bSj1iEGUgSTbziymG7Cn18ENQuT36vv',
      assetType: 'bsv20' as AssetType,
      tokenId: 'DEMO',
      tokenAmount: '1000',
      symbol: 'DEMO',
      decimals: 8,
      createdAt: Date.now() - 43200000,
      seller: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      height: 895156
    },
    {
      txid: '8c3d2f7baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda55d',
      vout: 0,
      priceSats: 2500000,
      payAddress: '1C5bSj1iEGUgSTbziymG7Cn18ENQuT36vv',
      ordAddress: '1D9rZVGiKKvVeZz8RvMGEQu5h2LiYK8fNu',
      assetType: 'ordinals' as AssetType,
      origin: '8c3d2f7baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda55d_0',
      contentType: 'image/png',
      createdAt: Date.now() - 172800000,
      seller: '1C5bSj1iEGUgSTbziymG7Cn18ENQuT36vv',
      height: 895089
    }
  ]);
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null);
  
  // Real API functions
  const lookupBapProfile = async (address: string) => {
    setApiLoading(true);
    try {
      const response = await fetch(`/api/bap?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setBapProfile(data);
      } else {
        setBapProfile({ error: 'Profile not found' });
      }
    } catch {
      setBapProfile({ error: 'Lookup failed' });
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <BitcoinQueryProvider>
      <BitcoinAuthProvider config={{ apiUrl: '/api' }}>
        <div className="min-h-screen bg-black text-white">
          {/* Navigation Header */}
          <header className="border-b border-gray-800/50 sticky top-0 bg-black/95 backdrop-blur-sm z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <nav className="flex items-center space-x-8">
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                  <Link href="/showcase" className="text-white">
                    Showcase
                  </Link>
                  <Link href="/components" className="text-gray-400 hover:text-white transition-colors">
                    Components
                  </Link>
                  <Link href="/mcp-server" className="text-gray-400 hover:text-white transition-colors">
                    MCP Server
                  </Link>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          
          {/* Hero Section */}
          <section className="relative overflow-hidden border-b border-gray-800/50">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-transparent to-purple-600/20" />
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
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
                  Live Demos
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
                  Real working examples of Bitcoin Auth components integrated with live APIs. 
                  Copy the code and use it in your projects.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/components"
                    className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Browse All Components
                  </Link>
                  <a
                    href="https://github.com/bitcoin-auth/bitcoin-auth-ui"
                    className="px-8 py-3 bg-gray-900 border border-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    View on GitHub
                  </a>
                </div>

                {/* Quick Access to Demo Categories */}
                <div className="mt-16 max-w-5xl mx-auto">
                  {/* Priority Banners */}
                  <div className="mb-6 space-y-3">
                    <a href="#quick-start" className="block p-4 bg-gradient-to-r from-orange-600/20 to-purple-600/20 border border-orange-500/50 hover:border-orange-400 rounded-lg transition-all group">
                      <div className="text-center">
                        <div className="text-orange-400 mb-1">
                          <Sparkles className="w-6 h-6 mx-auto" />
                        </div>
                        <div className="text-lg font-bold">🚀 Start Here: Quick Setup Guide</div>
                        <div className="text-xs text-gray-400 mt-1">Avoid common pitfalls • Get running in 5 minutes</div>
                      </div>
                    </a>
                    
                    <a href="#theme-showcase" className="block p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 hover:border-purple-400 rounded-lg transition-all group">
                      <div className="text-center">
                        <div className="text-purple-400 mb-1">
                          <Palette className="w-6 h-6 mx-auto" />
                        </div>
                        <div className="text-lg font-bold">🎨 Live Theme Demo: See Colors Change</div>
                        <div className="text-xs text-gray-400 mt-1">8 Bitcoin themes • Watch all components update live</div>
                      </div>
                    </a>
                  </div>
                  
                  {/* First Row - Primary Categories */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-3">
                    <a href="#api-demos" className="p-4 bg-gray-900/50 border border-gray-800 hover:border-orange-500/50 rounded-lg transition-all group">
                      <div className="text-orange-500 mb-2">
                        <Zap className="w-6 h-6 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">Live APIs</div>
                      <div className="text-xs text-gray-500 mt-1">Real blockchain data</div>
                    </a>
                    <a href="#auth-demos" className="p-4 bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 rounded-lg transition-all group">
                      <div className="text-purple-500 mb-2">
                        <Shield className="w-6 h-6 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">Auth Flows</div>
                      <div className="text-xs text-gray-500 mt-1">Complete examples</div>
                    </a>
                    <a href="#market-demos" className="p-4 bg-gray-900/50 border border-gray-800 hover:border-green-500/50 rounded-lg transition-all group">
                      <div className="text-green-500 mb-2">
                        <Package className="w-6 h-6 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">Marketplace</div>
                      <div className="text-xs text-gray-500 mt-1">Trading components</div>
                    </a>
                    <a href="#bsocial-demos" className="p-4 bg-gray-900/50 border border-gray-800 hover:border-pink-500/50 rounded-lg transition-all group">
                      <div className="text-pink-500 mb-2">
                        <Package className="w-6 h-6 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">Social</div>
                      <div className="text-xs text-gray-500 mt-1">bSocial components</div>
                    </a>
                    <a href="#wallet-demos" className="p-4 bg-gray-900/50 border border-gray-800 hover:border-yellow-500/50 rounded-lg transition-all group">
                      <div className="text-yellow-500 mb-2">
                        <Package className="w-6 h-6 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">Wallet</div>
                      <div className="text-xs text-gray-500 mt-1">BSV transactions</div>
                    </a>
                  </div>
                  
                  {/* Second Row - Secondary Categories */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-3">
                    <a href="#oauth-connectors-demos" className="p-4 bg-gray-900/50 border border-gray-800 hover:border-cyan-500/50 rounded-lg transition-all group">
                      <div className="text-cyan-500 mb-2">
                        <Package className="w-6 h-6 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">OAuth</div>
                      <div className="text-xs text-gray-500 mt-1">Wallet connectors</div>
                    </a>
                    <a href="#backup-demos" className="p-4 bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 rounded-lg transition-all group">
                      <div className="text-blue-500 mb-2">
                        <Package className="w-6 h-6 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">Backup & QR</div>
                      <div className="text-xs text-gray-500 mt-1">Device linking & QR</div>
                    </a>
                    <a href="#ui-primitives-demos" className="p-4 bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 rounded-lg transition-all group">
                      <div className="text-indigo-500 mb-2">
                        <Palette className="w-6 h-6 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">UI Primitives</div>
                      <div className="text-xs text-gray-500 mt-1">Building blocks</div>
                    </a>
                    <a href="#layout-demos" className="p-4 bg-gray-900/50 border border-gray-800 hover:border-teal-500/50 rounded-lg transition-all group">
                      <div className="text-teal-500 mb-2">
                        <Layout className="w-6 h-6 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">Layouts</div>
                      <div className="text-xs text-gray-500 mt-1">Page layouts</div>
                    </a>
                  </div>
                  
                  {/* Third Row - Advanced Categories */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <a href="#identity-demos" className="p-4 bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 rounded-lg transition-all group">
                      <div className="text-indigo-500 mb-2">
                        <Fingerprint className="w-6 h-6 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">Identity & BAP</div>
                      <div className="text-xs text-gray-500 mt-1">Bitcoin identity</div>
                    </a>
                    <a href="#security-demos" className="p-4 bg-gray-900/50 border border-gray-800 hover:border-red-500/50 rounded-lg transition-all group">
                      <div className="text-red-500 mb-2">
                        <Lock className="w-6 h-6 mx-auto" />
                      </div>
                      <div className="text-sm font-medium">Security</div>
                      <div className="text-xs text-gray-500 mt-1">Cryptographic tools</div>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Quick Start Guide */}
          <QuickStartSection isClient={isClient} />

          {/* Theme Showcase */}
          <ThemeShowcaseSection isClient={isClient} />

          {/* Live API Demos Section */}
          <LiveAPIsSection 
            blockHeight={blockHeight}
            setBlockHeight={setBlockHeight}
            bapProfile={bapProfile}
            setBapProfile={setBapProfile}
            apiLoading={apiLoading}
            setApiLoading={setApiLoading}
            bapAddress={bapAddress}
            setBapAddress={setBapAddress}
          />

          {/* Authentication Flow Demos */}
          <AuthFlowsSection isClient={isClient} />

          {/* Market Components Demo */}
          <MarketSection isClient={isClient} />

          {/* Social Components Demo */}
          <SocialSection isClient={isClient} />

          {/* Wallet Components Demo */}
          <WalletSection isClient={isClient} />

          {/* OAuth & Wallet Connectors */}
          <OAuthConnectorsSection isClient={isClient} />

          {/* Backup & QR Components */}
          <BackupQRSection isClient={isClient} />

          {/* UI Primitives */}
          <UIPrimitivesSection isClient={isClient} />

          {/* Layout Components */}
          <LayoutComponentsSection isClient={isClient} />

          {/* Identity & BAP Components */}
          <IdentitySection isClient={isClient} />

          {/* Security Components */}
          <SecuritySection isClient={isClient} />
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
    </BitcoinQueryProvider>
  );
}
