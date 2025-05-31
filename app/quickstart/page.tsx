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
} from 'bigblocks';
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

export default function QuickStartPage() {
  // Scroll to top on mount to fix navigation issue
  useEffect(() => {
    // Remove any hash from URL
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    // Force scroll to top
    window.scrollTo(0, 0);
    // Double-check after a brief delay to handle any async rendering
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);
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
                  <Link href="/quickstart" className="text-white">
                    Quick Start
                  </Link>
                  <Link href="/themes" className="text-gray-400 hover:text-white transition-colors">
                    Themes
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
                  <span className="text-sm font-medium">Step-by-Step Guide</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Bitcoin Development Tutorial
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
                  Learn Bitcoin development from the ground up. This progressive guide will take you from 
                  basic concepts to advanced features, with real working examples along the way.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                  <Link
                    href="/components"
                    className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Browse All Components
                  </Link>
                  <a
                    href="https://github.com/bitcoin-auth/bigblocks"
                    className="px-8 py-3 bg-gray-900 border border-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    View on GitHub
                  </a>
                </div>

                {/* Tutorial Journey Overview */}
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
                    <h3 className="text-xl font-semibold mb-4">Your Learning Journey</h3>
                    <div className="text-left space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold">1</span>
                        </div>
                        <div>
                          <p className="font-medium">Foundation</p>
                          <p className="text-sm text-gray-400">Set up your environment and learn the basic UI components</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold">2</span>
                        </div>
                        <div>
                          <p className="font-medium">Authentication</p>
                          <p className="text-sm text-gray-400">Implement Bitcoin-based authentication and user management</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold">3</span>
                        </div>
                        <div>
                          <p className="font-medium">Integration</p>
                          <p className="text-sm text-gray-400">Connect to the Bitcoin blockchain and handle real data</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold">4</span>
                        </div>
                        <div>
                          <p className="font-medium">Advanced Features</p>
                          <p className="text-sm text-gray-400">Add wallets, social features, and marketplace functionality</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-800">
                      <p className="text-sm text-gray-400">
                        <strong className="text-gray-300">Tip:</strong> Follow this guide from top to bottom for the best learning experience. 
                        Each section builds on the previous ones.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Part 1: Foundation */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-600/5 to-transparent" />
            <div className="relative py-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Part 1: Foundation</h2>
                <p className="text-lg text-gray-400">
                  Let's start with the basics. First, we'll set up your development environment 
                  and explore the fundamental building blocks.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <QuickStartSection isClient={isClient} />

          {/* UI Primitives */}
          <UIPrimitivesSection isClient={isClient} />

          {/* Layout Components */}
          <LayoutComponentsSection isClient={isClient} />

          {/* Theme Showcase */}
          <ThemeShowcaseSection isClient={isClient} />

          {/* Part 2: Authentication */}
          <div className="relative mt-24">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-600/5 to-transparent" />
            <div className="relative py-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Part 2: Authentication</h2>
                <p className="text-lg text-gray-400">
                  Now that you understand the basics, let's implement Bitcoin-based authentication. 
                  This is the core of any Bitcoin application.
                </p>
              </div>
            </div>
          </div>

          {/* Authentication Flow Demos */}
          <AuthFlowsSection isClient={isClient} />

          {/* OAuth & Wallet Connectors */}
          <OAuthConnectorsSection isClient={isClient} />

          {/* Backup & QR Components */}
          <BackupQRSection isClient={isClient} />

          {/* Part 3: Blockchain Integration */}
          <div className="relative mt-24">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-600/5 to-transparent" />
            <div className="relative py-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Part 3: Blockchain Integration</h2>
                <p className="text-lg text-gray-400">
                  Time to connect to the real Bitcoin blockchain. Learn how to fetch live data, 
                  manage identities, and implement security features.
                </p>
              </div>
            </div>
          </div>

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

          {/* Identity & BAP Components */}
          <IdentitySection isClient={isClient} />

          {/* Security Components */}
          <SecuritySection isClient={isClient} />

          {/* Part 4: Advanced Features */}
          <div className="relative mt-24">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-600/5 to-transparent" />
            <div className="relative py-16">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Part 4: Advanced Features</h2>
                <p className="text-lg text-gray-400">
                  You've mastered the fundamentals. Now let's add powerful features like wallets, 
                  social interactions, and marketplace functionality.
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Components Demo */}
          <WalletSection isClient={isClient} />

          {/* Social Components Demo */}
          <SocialSection isClient={isClient} />

          {/* Market Components Demo */}
          <MarketSection isClient={isClient} />

          {/* Completion Section */}
          <div className="relative mt-24 mb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/50 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-4">Congratulations! 🎉</h2>
                <p className="text-lg text-gray-300 mb-6">
                  You've completed the Bitcoin development tutorial. You now have all the tools 
                  and knowledge to build powerful Bitcoin applications.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/components"
                    className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Explore All Components
                  </Link>
                  <Link
                    href="/mcp-server"
                    className="px-8 py-3 bg-gray-900 border border-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Try AI-Powered Development
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
            <div className="max-w-7xl mx-auto text-center">
              <p className="text-gray-400">
                Built with ❤️ by the <a href="https://1satordinals.com" className="text-orange-500 hover:text-orange-400">1Sat</a> team. MIT Licensed.
              </p>
              <div className="flex justify-center gap-6 mt-6">
                <a
                  href="https://github.com/b-open-io/bigblocks"
                  className="text-gray-400 hover:text-white"
                >
                  GitHub
                </a>
                <a
                  href="https://www.npmjs.com/package/bigblocks"
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
