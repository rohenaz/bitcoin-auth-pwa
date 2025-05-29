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
} from 'bitcoin-auth-ui';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  Package
} from 'lucide-react';
import QRCode from 'qrcode';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { getLatestBlockHeight } from '@/lib/block';

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
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
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
            
            <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
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
                <div className="mt-16 grid grid-cols-2 md:grid-cols-6 gap-4 max-w-5xl mx-auto">
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
                  <a href="#backup-demos" className="p-4 bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 rounded-lg transition-all group">
                    <div className="text-blue-500 mb-2">
                      <Package className="w-6 h-6 mx-auto" />
                    </div>
                    <div className="text-sm font-medium">Backup & QR</div>
                    <div className="text-xs text-gray-500 mt-1">File validation & QR codes</div>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Live API Demos Section */}
          <section id="api-demos" className="border-b border-gray-800/50 bg-gray-950/50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">🚀 Live API Demos</h2>
                <p className="text-gray-400 text-lg">Real public APIs integrated with Bitcoin Auth components</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* BSV Block Height */}
                <div className="bg-black border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    BSV Blockchain Height
                  </h3>
                  <p className="text-gray-400 mb-4">Live data from Bitcoin SV blockchain</p>
                  <button
                    type="button"
                    onClick={async () => {
                      setApiLoading(true);
                      const { height } = await getLatestBlockHeight();
                      setBlockHeight(height);
                      setApiLoading(false);
                    }}
                    disabled={apiLoading}
                    className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    {apiLoading ? 'Fetching...' : 'Get Latest Block Height'}
                  </button>
                  {blockHeight && (
                    <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700">
                      <p className="text-green-400 font-mono text-lg">Block: {blockHeight.toLocaleString()}</p>
                      <p className="text-gray-500 text-sm mt-1">Source: Block Headers Service</p>
                    </div>
                  )}
                </div>

                {/* BAP Profile Lookup */}
                <div className="bg-black border border-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    BAP Profile Lookup
                  </h3>
                  <p className="text-gray-400 mb-4">Query Bitcoin addresses for BAP profiles</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={bapAddress}
                      onChange={(e) => setBapAddress(e.target.value)}
                      placeholder="Enter Bitcoin address..."
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => lookupBapProfile(bapAddress)}
                      disabled={apiLoading || !bapAddress}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      {apiLoading ? 'Looking up...' : 'Lookup BAP Profile'}
                    </button>
                  </div>
                  {bapProfile && (
                    <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700">
                      {'error' in bapProfile ? (
                        <p className="text-yellow-400">⚠️ {bapProfile.error as string}</p>
                      ) : (
                        <>
                          <p className="text-green-400 text-sm">✅ Profile found!</p>
                          <pre className="text-gray-300 text-xs mt-2 overflow-x-auto">
                            {JSON.stringify(bapProfile, null, 2)}
                          </pre>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Authentication Flow Demos */}
          <section id="auth-demos" className="border-b border-gray-800/50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">🔐 Authentication Flow Demos</h2>
                <p className="text-gray-400 text-lg">Complete authentication experiences using Bitcoin Auth UI components</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* AuthFlowOrchestrator Demo */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Unified Auth Flow</h3>
                    <p className="text-gray-400 mb-4">Complete signup, signin, and recovery in one component</p>
                    
                    {/* Backend Requirements */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend Endpoints:</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>• <code className="text-orange-400">/api/auth/[...nextauth]</code> - NextAuth handler with Bitcoin credentials</p>
                        <p>• <code className="text-orange-400">/api/backup</code> - Store/retrieve encrypted backups</p>
                        <p>• <code className="text-orange-400">/api/users/create-from-backup</code> - Create user from backup</p>
                        <p>• <code className="text-orange-400">/api/auth/link-provider</code> - OAuth provider linking</p>
                        <p>• <code className="text-orange-400">/api/device-link/generate</code> - Device linking tokens</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-8">
                    <AuthFlowOrchestrator
                      flowType="unified"
                      enableOAuth={true}
                      enableDeviceLink={true}
                      onSuccess={(user) => console.log('Auth success:', user)}
                    />
                  </div>
                  
                  <TerminalCodeBlock
                    code={`import { AuthFlowOrchestrator } from 'bitcoin-auth-ui';

<AuthFlowOrchestrator
  flowType="unified"
  enableOAuth={true}
  enableDeviceLink={true}
  onSuccess={(user) => {
    // Handle successful authentication
    console.log('User authenticated:', user);
    router.push('/dashboard');
  }}
/>`}
                    language="jsx"
                    filename="UnifiedAuth.jsx"
                  />
                </div>

                {/* Login Form Demo */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Login Form</h3>
                    <p className="text-gray-400 mb-4">Bitcoin-based login with password recovery options</p>
                    
                    {/* Backend Requirements */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend Endpoints:</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>• <code className="text-orange-400">/api/auth/[...nextauth]</code> - NextAuth authentication</p>
                        <p>• <code className="text-orange-400">/api/backup</code> - Retrieve encrypted backups</p>
                        <p>• <code className="text-orange-400">/api/auth/callback/oauth</code> - OAuth callback handling</p>
                        <p>• <code className="text-orange-400">/api/users/connected-accounts</code> - Check linked providers</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-8">
                    <LoginForm
                      mode="signin"
                      onSuccess={(user) => console.log('Login success:', user)}
                    />
                  </div>
                  
                  <TerminalCodeBlock
                    code={`import { LoginForm } from 'bitcoin-auth-ui';

<LoginForm
  mode="signin"
  onSuccess={(user) => {
    // Handle successful login
    setUser(user);
    toast.success('Welcome back!');
  }}
  onError={(error) => {
    toast.error(error.message);
  }}
/>`}
                    language="jsx"
                    filename="LoginForm.jsx"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Market Components Demo */}
          <section id="market-demos" className="border-b border-gray-800/50 bg-gray-950/50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">🛒 Marketplace Components</h2>
                <p className="text-gray-400 text-lg">Complete marketplace functionality for trading BSV-based assets</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Market Table Demo */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Market Table</h3>
                    <p className="text-gray-400 mb-4">Browse and interact with live marketplace listings</p>
                    
                    {/* Backend Requirements */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend Endpoints:</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>• <code className="text-orange-400">/api/market/listings</code> - Get marketplace listings</p>
                        <p>• <code className="text-orange-400">/api/market/buy</code> - Purchase listing transaction</p>
                        <p>• <code className="text-orange-400">/api/market/stats</code> - Market statistics and volume</p>
                        <p>• <strong className="text-yellow-400">1Sat Ordinals API</strong> - For asset metadata and pricing</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                    {isClient ? (
                      <MarketTable
                        listings={marketListings}
                        onListingClick={(listing) => {
                          setSelectedListing(listing);
                          console.log('Selected listing:', listing);
                        }}
                        onBuySuccess={(txid, listing) => {
                          console.log('Purchase successful:', txid, listing);
                          // Simulate removing the bought listing
                          setMarketListings(prev => prev.filter(l => l.txid !== listing.txid));
                        }}
                        onBuyError={(error, listing) => {
                          console.error('Purchase failed:', error, listing);
                        }}
                        loading={false}
                        showAssetType={true}
                        showSeller={true}
                        maxItems={10}
                      />
                    ) : (
                      <div className="animate-pulse bg-gray-800 h-48 rounded-lg" />
                    )}
                    {selectedListing && (
                      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                        <p className="text-blue-400 text-sm">✅ Selected: {selectedListing.assetType} listing for {selectedListing.priceSats.toLocaleString()} sats</p>
                      </div>
                    )}
                  </div>
                  
                  <TerminalCodeBlock
                    code={`import { MarketTable } from 'bitcoin-auth-ui';

<MarketTable
  listings={marketListings}
  onListingClick={(listing) => {
    // Handle listing selection
    setSelectedListing(listing);
  }}
  onBuySuccess={(txid, listing) => {
    // Handle successful purchase
    toast.success('Purchase successful!');
    refetchListings();
  }}
  onBuyError={(error, listing) => {
    // Handle purchase error
    toast.error(error.message);
  }}
  loading={isLoading}
  showAssetType={true}
  showSeller={true}
/>`}
                    language="jsx"
                    filename="MarketTable.jsx"
                  />
                </div>

                {/* Create & Buy Listing Buttons */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Listing Actions</h3>
                    <p className="text-gray-400 mb-4">Create new listings and purchase existing ones</p>
                    
                    {/* Backend Requirements */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend Endpoints:</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>• <code className="text-orange-400">/api/market/create</code> - Create new listing transaction</p>
                        <p>• <code className="text-orange-400">/api/market/buy</code> - Purchase listing transaction</p>
                        <p>• <code className="text-orange-400">/api/wallet/utxos</code> - Get user UTXOs for transactions</p>
                        <p>• <code className="text-orange-400">/api/wallet/broadcast</code> - Broadcast signed transactions</p>
                        <p>• <strong className="text-yellow-400">BSV SDK</strong> - For transaction building and signing</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Create Listing</h4>
                      {isClient ? (
                        <CreateListingButton
                          onSuccess={(result) => {
                            console.log('Listing created:', result);
                            // Add the new listing to our mock data
                            const newListing: MarketListing = {
                              txid: typeof result === 'string' ? result : `demo-new-listing-${Date.now()}`,
                              vout: 0,
                              priceSats: Math.floor(Math.random() * 5000000) + 100000,
                              payAddress: '1NewListingAddress123456789',
                              ordAddress: '1NewOrdAddress123456789',
                              assetType: 'ordinals' as AssetType,
                              origin: `demo-new-listing-${Date.now()}_0`,
                              contentType: 'image/jpeg',
                              createdAt: Date.now(),
                              seller: '1NewListingAddress123456789',
                              height: (blockHeight || 895000) + 1
                            };
                            setMarketListings(prev => [newListing, ...prev]);
                          }}
                          onError={(error) => console.error('Create failed:', error)}
                          buttonText="List Item for Sale"
                          variant="solid"
                          size="3"
                          className="w-full"
                        />
                      ) : (
                        <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />
                      )}
                    </div>
                    
                    <div className="border-t border-gray-700 pt-6">
                      <h4 className="text-lg font-semibold mb-3">Buy Selected Listing</h4>
                      {selectedListing && isClient ? (
                        <BuyListingButton
                          listing={selectedListing}
                          onSuccess={(txid) => {
                            console.log('Purchase successful:', txid);
                            // Remove the purchased listing
                            setMarketListings(prev => prev.filter(l => l.txid !== selectedListing.txid));
                            setSelectedListing(null);
                          }}
                          onError={(error) => console.error('Purchase failed:', error)}
                          buttonText={`Buy for ${selectedListing.priceSats.toLocaleString()} sats`}
                          variant="solid"
                          size="3"
                          showDetails={true}
                          className="w-full"
                        />
                      ) : !isClient ? (
                        <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />
                      ) : (
                        <div className="w-full bg-gray-700 text-gray-400 font-semibold py-3 px-6 rounded-lg text-center">
                          Select a listing from the table above to buy
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <TerminalCodeBlock
                    code={`import { 
                      CreateListingButton,
                      BuyListingButton,
                      useCreateListing,
                      useBuyListing 
                    } from 'bitcoin-auth-ui';

// Create listing
<CreateListingButton
  onSuccess={(result) => {
    toast.success('Listing created!');
    router.push(\`/market/\${result.txid}\`);
  }}
  onError={(error) => {
    toast.error(error.message);
  }}
  buttonText="List Item for Sale"
  variant="solid"
  size="3"
/>

// Buy listing  
<BuyListingButton
  listing={selectedListing}
  onSuccess={(txid) => {
    toast.success('Purchase successful!');
    refetchListings();
  }}
  onError={(error) => {
    toast.error(error.message);
  }}
  buttonText="Buy Now"
  showDetails={true}
/>`}
                    language="jsx"
                    filename="MarketActions.jsx"
                  />
                </div>
              </div>

              {/* Market Hooks Example */}
              <div className="mt-16">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold mb-3">Market Hooks Usage</h3>
                  <p className="text-gray-400">Low-level hooks for custom marketplace implementations</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <TerminalCodeBlock
                    code={`import { useCreateListing } from 'bitcoin-auth-ui';

function CustomCreateForm() {
  const createListing = useCreateListing();
  
  const handleSubmit = async (formData) => {
    try {
      const result = await createListing.mutateAsync({
        assetType: 'ordinals',
        price: formData.price,
        utxo: formData.selectedUtxo,
        payAddress: user.address,
        ordAddress: user.ordAddress
      });
      
      console.log('Created:', result.txid);
    } catch (error) {
      console.error('Failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Custom form fields */}
    </form>
  );
}`}
                    language="tsx"
                    filename="useCreateListing.tsx"
                  />
                  
                  <TerminalCodeBlock
                    code={`import { useBuyListing } from 'bitcoin-auth-ui';

function CustomBuyFlow() {
  const buyListing = useBuyListing();
  
  const handlePurchase = async (listing) => {
    try {
      const result = await buyListing.mutateAsync({
        listing,
        paymentAddress: user.address,
        ordAddress: user.ordAddress,
        utxos: userUtxos
      });
      
      // Purchase successful
      router.push('/wallet');
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <div>
      <button 
        onClick={() => handlePurchase(listing)}
        disabled={buyListing.isLoading}
      >
        {buyListing.isLoading ? 'Processing...' : 'Buy Now'}
      </button>
    </div>
  );
}`}
                    language="tsx"
                    filename="useBuyListing.tsx"
                  />
                </div>

                {/* Setup Requirements */}
                <div className="mt-12 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                  <h4 className="text-blue-400 font-semibold mb-4">📋 Setup Requirements for Market Components:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-white font-medium mb-2">Frontend Setup:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• QueryClientProvider wrapper</li>
                        <li>• BitcoinAuthProvider setup</li>
                        <li>• Wallet connection (for signing)</li>
                        <li>• Error handling & notifications</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-white font-medium mb-2">Backend APIs:</h5>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Market listing endpoints</li>
                        <li>• Transaction building APIs</li>
                        <li>• UTXO management system</li>
                        <li>• Broadcast & monitoring</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* bSocial Components Demo */}
          <section id="bsocial-demos" className="border-b border-gray-800/50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">🎭 Social Components</h2>
                <p className="text-gray-400 text-lg">Complete social media functionality on Bitcoin</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Social Actions */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Social Actions</h3>
                    <p className="text-gray-400 mb-4">Post, like, and follow actions on Bitcoin</p>
                    
                    {/* Backend Requirements */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend Endpoints:</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>• <code className="text-orange-400">/api/social/post</code> - Create social posts</p>
                        <p>• <code className="text-orange-400">/api/social/like</code> - Like/unlike posts</p>
                        <p>• <code className="text-orange-400">/api/social/follow</code> - Follow/unfollow users</p>
                        <p>• <strong className="text-yellow-400">BSocial Protocol</strong> - For social transactions</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Create Post</h4>
                      {isClient ? (
                        <div className="space-y-3">
                          <PostButton />
                          <div className="text-xs text-gray-500 mt-2">💡 Demo: PostButton component rendered</div>
                        </div>
                      ) : (
                        <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Social Actions</h4>
                      <div className="flex gap-3">
                        {isClient ? (
                          <>
                            <div className="flex-1">
                              <LikeButton txid="demo-post-1" />
                              <div className="text-xs text-gray-500 mt-1">LikeButton</div>
                            </div>
                            <div className="flex-1">
                              <FollowButton bapId="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" />
                              <div className="text-xs text-gray-500 mt-1">FollowButton</div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="animate-pulse bg-gray-800 h-10 rounded-lg flex-1" />
                            <div className="animate-pulse bg-gray-800 h-10 rounded-lg flex-1" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <TerminalCodeBlock
                    code={`import { 
                      PostButton,
                      LikeButton,
                      FollowButton 
                    } from 'bitcoin-auth-ui';

// Create social post
<PostButton
  onSuccess={(result) => {
    toast.success('Post created!');
    router.push(\`/post/\${result.txid}\`);
  }}
  onError={(error) => {
    toast.error(error.message);
  }}
  buttonText="Share Your Thoughts"
  variant="solid"
/>

// Like a post
<LikeButton
  txid={post.txid}
  onSuccess={() => {
    toast.success('Post liked!');
    refetchPosts();
  }}
  variant="soft"
/>

// Follow user
<FollowButton
  bapId={user.bapId}
  onSuccess={() => {
    toast.success('User followed!');
    refetchFollowing();
  }}
  variant="outline"
/>`}
                    language="jsx"
                    filename="SocialActions.jsx"
                  />
                </div>

                {/* Social Feed */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Social Feed</h3>
                    <p className="text-gray-400 mb-4">Display posts and social interactions</p>
                    
                    {/* Backend Requirements */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend Endpoints:</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>• <code className="text-orange-400">/api/social/feed</code> - Get paginated posts</p>
                        <p>• <code className="text-orange-400">/api/social/reactions</code> - Get post reactions</p>
                        <p>• <code className="text-orange-400">/api/users/profile</code> - Get user profiles</p>
                        <p>• <strong className="text-yellow-400">BSocial API</strong> - For social data queries</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Live Social Feed</h4>
                    {isClient ? (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <p className="text-gray-300 mb-2">Just deployed my first Bitcoin Auth app! 🚀 #BitcoinAuth #BSV</p>
                          <p className="text-xs text-gray-500">Demo social post - PostCard component</p>
                        </div>
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <p className="text-gray-300 mb-2">The marketplace components are incredibly smooth. Love the React Query integration!</p>
                          <p className="text-xs text-gray-500">Demo social post - PostCard component</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="animate-pulse bg-gray-800 h-24 rounded-lg" />
                        <div className="animate-pulse bg-gray-800 h-24 rounded-lg" />
                      </div>
                    )}
                  </div>
                  
                  <TerminalCodeBlock
                    code={`import { SocialFeed, PostCard } from 'bitcoin-auth-ui';

// Social feed with infinite scroll
<SocialFeed
  config={{
    algorithm: 'following',
    limit: 20,
    bapId: user.bapId
  }}
  onPostClick={(post) => {
    router.push(\`/post/\${post.txid}\`);
  }}
  onAuthorClick={(bapId) => {
    router.push(\`/profile/\${bapId}\`);
  }}
  showLoadMore={true}
  variant="default"
/>

// Individual post card
<PostCard
  post={post}
  onLike={(txid) => {
    likePost(txid);
  }}
  onReply={(txid) => {
    setReplyingTo(txid);
  }}
  showActions={true}
  variant="compact"
/>`}
                    language="jsx"
                    filename="SocialFeed.jsx"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Wallet Components Demo */}
          <section id="wallet-demos" className="border-b border-gray-800/50 bg-gray-950/50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">💰 Wallet Components</h2>
                <p className="text-gray-400 text-lg">Bitcoin wallet functionality and balance management</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Send BSV */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Send BSV</h3>
                    <p className="text-gray-400 mb-4">Send Bitcoin with fee estimation</p>
                    
                    {/* Backend Requirements */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend Endpoints:</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>• <code className="text-orange-400">/api/wallet/utxos</code> - Get user UTXOs</p>
                        <p>• <code className="text-orange-400">/api/wallet/send</code> - Create send transaction</p>
                        <p>• <code className="text-orange-400">/api/wallet/broadcast</code> - Broadcast transaction</p>
                        <p>• <strong className="text-yellow-400">BSV SDK</strong> - For transaction building</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Send Transaction</h4>
                    {isClient ? (
                      <div className="space-y-3">
                        <SendBSVButton />
                        <div className="text-xs text-gray-500">💡 Demo: SendBSVButton component rendered</div>
                      </div>
                    ) : (
                      <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />
                    )}
                    
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                      <p className="text-blue-400 text-sm">💡 Demo: Click to simulate a BSV transaction</p>
                    </div>
                  </div>
                  
                  <TerminalCodeBlock
                    code={`import { SendBSVButton } from 'bitcoin-auth-ui';

<SendBSVButton
  onSuccess={(result) => {
    toast.success(\`Sent! TXID: \${result.txid}\`);
    router.push(\`/tx/\${result.txid}\`);
    refreshBalance();
  }}
  onError={(error) => {
    toast.error(error.message);
  }}
  buttonText="Send BSV"
  showFeeEstimate={true}
  variant="solid"
/>`}
                    language="jsx"
                    filename="SendBSV.jsx"
                  />
                </div>

                {/* Wallet Overview */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Wallet Overview</h3>
                    <p className="text-gray-400 mb-4">Display balance and wallet information</p>
                    
                    {/* Backend Requirements */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend Endpoints:</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>• <code className="text-orange-400">/api/wallet/balance</code> - Get wallet balance</p>
                        <p>• <code className="text-orange-400">/api/wallet/transactions</code> - Get transaction history</p>
                        <p>• <code className="text-orange-400">/api/wallet/tokens</code> - Get token balances</p>
                        <p>• <strong className="text-yellow-400">Exchange APIs</strong> - For BSV/USD rates</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                    <h4 className="text-lg font-semibold mb-4">Live Wallet Balance</h4>
                    {isClient ? (
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">0.05234 BSV</div>
                          <div className="text-gray-400">≈ $3.42 USD</div>
                          <div className="text-xs text-gray-500 mt-2">💡 Demo: WalletOverview component</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-semibold">Recent Transactions:</div>
                          <div className="p-2 bg-gray-800 rounded text-xs">
                            <div className="text-green-400">+0.001 BSV (Received)</div>
                            <div className="text-gray-500">3 confirmations</div>
                          </div>
                          <div className="p-2 bg-gray-800 rounded text-xs">
                            <div className="text-red-400">-0.0005 BSV (Sent)</div>
                            <div className="text-gray-500">6 confirmations</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-pulse bg-gray-800 h-48 rounded-lg" />
                    )}
                  </div>
                  
                  <TerminalCodeBlock
                    code={`import { WalletOverview } from 'bitcoin-auth-ui';

<WalletOverview
  balance={walletBalance}
  recentTransactions={transactions}
  onTransactionClick={(txid) => {
    router.push(\`/tx/\${txid}\`);
  }}
  onRefresh={() => {
    refetchBalance();
    refetchTransactions();
  }}
  showTokens={true}
  showTransactions={true}
  variant="default"
/>`}
                    language="jsx"
                    filename="WalletOverview.jsx"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Backup & QR Code Demos */}
          <section id="backup-demos" className="border-b border-gray-800/50 bg-gray-950/30">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">📱 Backup & QR Code Demos</h2>
                <p className="text-gray-400 text-lg">File validation, device linking, and secure backup features</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* File Import Demo */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">File Validation</h3>
                    <p className="text-gray-400 mb-4 text-sm">Real backup format detection</p>
                    
                    {/* Backend Requirements */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                      <h4 className="text-green-400 font-semibold mb-1">✅ Client-Side Only</h4>
                      <p className="text-sm text-gray-300">No backend endpoints required - validation happens in browser</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                    <FileImport
                      onFileValidated={(file, result) => {
                        setFileValidationResult({
                          fileName: file.name,
                          fileSize: file.size,
                          type: `${result.fileType} (${result.format})`,
                          valid: result.isValid,
                          timestamp: new Date().toISOString()
                        });
                      }}
                      onError={(error) => {
                        setFileValidationResult({
                          error: error,
                          valid: false,
                          timestamp: new Date().toISOString()
                        });
                      }}
                    />
                    {fileValidationResult && (
                      <div className="mt-4 bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                        {fileValidationResult.valid ? (
                          <>
                            <p className="text-green-400 text-sm font-semibold">✅ File Validated!</p>
                            <div className="mt-2 text-xs text-gray-300 space-y-1">
                              <p><span className="text-gray-500">File:</span> {fileValidationResult.fileName || 'Unknown'}</p>
                              <p><span className="text-gray-500">Type:</span> <span className="text-blue-400">{fileValidationResult.type || 'Unknown'}</span></p>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="text-red-400 text-sm font-semibold">❌ Validation Failed</p>
                            <p className="text-xs text-gray-300 mt-1">{fileValidationResult.error}</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <TerminalCodeBlock
                    code={`import { FileImport } from 'bitcoin-auth-ui';

<FileImport
  onFileValidated={(file, result) => {
    console.log('Valid backup type:', result.fileType);
    // Process validated backup file
    handleBackupImport(file, result);
  }}
  onError={(error) => {
    toast.error(\`Invalid file: \${error}\`);
  }}
/>`}
                    language="jsx"
                    filename="FileValidation.jsx"
                  />
                </div>

                {/* Device Link QR Demo */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Device Linking</h3>
                    <p className="text-gray-400 mb-4 text-sm">QR codes with real blockchain data</p>
                    
                    {/* Backend Requirements */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                      <h4 className="text-red-400 font-semibold mb-1">🔧 Required Backend Endpoints:</h4>
                      <div className="text-xs text-gray-300 space-y-1">
                        <p>• <code className="text-orange-400">/api/device-link/generate</code> - Create secure tokens</p>
                        <p>• <code className="text-orange-400">/api/device-link/validate</code> - Validate tokens & return backup</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                      <p className="text-blue-400 text-sm">🔗 Live Demo: Real BSV blockchain data!</p>
                    </div>
                    <DeviceLinkQR 
                      onGenerateQR={async () => {
                        setApiLoading(true);
                        try {
                          const { height } = await getLatestBlockHeight();
                          const realBlockHeight = height || 895000;
                          
                          const url = `https://bitcoin-auth-demo.com/link/block-${realBlockHeight}-demo`;
                          const qrDataUrl = await QRCode.toDataURL(url);
                          
                          setBlockHeight(realBlockHeight);
                          
                          return {
                            qrData: qrDataUrl,
                            token: `block-${realBlockHeight}-demo`,
                            expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                          };
                        } finally {
                          setApiLoading(false);
                        }
                      }}
                      baseUrl="https://bitcoin-auth-demo.com"
                    />
                    {blockHeight && (
                      <div className="mt-4 bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                        <p className="text-green-400 text-sm">✅ BSV Block: {blockHeight.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                  
                  <TerminalCodeBlock
                    code={`import { DeviceLinkQR } from 'bitcoin-auth-ui';

<DeviceLinkQR 
  onGenerateQR={async () => {
    // Generate secure device link token
    const response = await fetch('/api/device-link/generate', {
      method: 'POST',
      headers: { 'X-Auth-Token': authToken }
    });
    return response.json();
  }}
  baseUrl={process.env.NEXT_PUBLIC_APP_URL}
/>`}
                    language="jsx"
                    filename="DeviceLink.jsx"
                  />
                </div>

                {/* Mnemonic Display Demo */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Recovery Phrase</h3>
                    <p className="text-gray-400 mb-4 text-sm">Secure mnemonic display</p>
                    
                    {/* Backend Requirements */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
                      <h4 className="text-green-400 font-semibold mb-1">✅ Client-Side Only</h4>
                      <p className="text-sm text-gray-300">No backend endpoints required - displays mnemonics in browser only</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                    <MnemonicDisplay
                      mnemonic="abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
                      onContinue={() => console.log('Continue clicked')}
                      showCopyButton={true}
                    />
                  </div>
                  
                  <TerminalCodeBlock
                    code={`import { MnemonicDisplay } from 'bitcoin-auth-ui';

<MnemonicDisplay
  mnemonic={generatedMnemonic}
  onContinue={() => {
    // User acknowledged mnemonic
    setStep('verify');
  }}
  showCopyButton={true}
/>`}
                    language="jsx"
                    filename="MnemonicDisplay.jsx"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Integration Examples */}
          <section id="integration-demos" className="border-b border-gray-800/50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">⚡ Integration Examples</h2>
                <p className="text-gray-400 text-lg">Real-world integration patterns you can copy and paste</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Full App Integration */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Complete App Setup</h3>
                    <p className="text-gray-400 mb-4">How to wrap your entire app with Bitcoin Auth</p>
                    
                    {/* Backend Requirements */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                      <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend Infrastructure:</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>• <code className="text-orange-400">/api/auth/[...nextauth]</code> - NextAuth with Bitcoin credentials provider</p>
                        <p>• <code className="text-orange-400">/api/backup</code> - Encrypted backup storage (GET/POST)</p>
                        <p>• <code className="text-orange-400">/api/users/*</code> - User management endpoints</p>
                        <p>• <code className="text-orange-400">/api/device-link/*</code> - Device linking system</p>
                        <p>• <strong className="text-yellow-400">Redis/KV Store</strong> - For user data, backups, and OAuth mappings</p>
                        <p>• <strong className="text-yellow-400">OAuth Apps</strong> - GitHub/Google/X developer credentials</p>
                      </div>
                    </div>
                  </div>
                  
                  <TerminalCodeBlock
                    code={`// app/layout.tsx
import { BitcoinAuthProvider } from 'bitcoin-auth-ui';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <BitcoinAuthProvider 
          config={{ 
            apiUrl: '/api',
            authEndpoint: '/api/auth/[...nextauth]',
            backupEndpoint: '/api/backup'
          }}
        >
          {children}
        </BitcoinAuthProvider>
      </body>
    </html>
  );
}`}
                    language="tsx"
                    filename="layout.tsx"
                  />

                  <TerminalCodeBlock
                    code={`// lib/api-client.ts
import { getAuthToken } from 'bitcoin-auth';
import { extractIdentityFromBackup } from '@/lib/bap-utils';

export async function authenticatedFetch(
  url: string, 
  options: RequestInit,
  backup: BapMasterBackup
) {
  const { privateKey } = extractIdentityFromBackup(backup);
  
  // Create auth token for this specific request
  const authToken = getAuthToken({
    privateKeyWif: privateKey,
    requestPath: url,
    body: options.body as string || ''
  });
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'X-Auth-Token': authToken,
    },
  });
}`}
                    language="typescript"
                    filename="api-client.ts"
                  />
                </div>

                {/* API Integration */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">API Integration</h3>
                    <p className="text-gray-400 mb-4">Backend API patterns for Bitcoin authentication</p>
                  </div>
                  
                  <TerminalCodeBlock
                    code={`// app/api/backup/route.ts
import { NextRequest } from 'next/server';
import { parseAuthToken, verifyAuthToken } from 'bitcoin-auth';

export async function POST(request: NextRequest) {
  const authToken = request.headers.get('X-Auth-Token');
  
  // Read body as text first to avoid stream consumption issues
  const bodyText = await request.text();
  
  // Verify Bitcoin auth token with actual request data
  const isValid = verifyAuthToken(authToken, {
    requestPath: '/api/backup',
    body: bodyText,
    timestamp: new Date().toISOString()
  }, 1000 * 60 * 10); // 10 minute time window
  
  if (!isValid) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { encryptedBackup } = JSON.parse(bodyText);
  
  // Store encrypted backup in Redis/database
  await storeBackup(encryptedBackup);
  
  return Response.json({ success: true });
}`}
                    language="typescript"
                    filename="backup-api.ts"
                  />

                  <TerminalCodeBlock
                    code={`// lib/auth-middleware.ts
import { parseAuthToken, verifyAuthToken, type AuthPayload } from 'bitcoin-auth';
import { PublicKey } from '@bsv/sdk';

const TIME_PAD = 1000 * 60 * 10; // 10 minutes

export async function verifyBitcoinAuth(request: Request, requestPath: string) {
  const authToken = request.headers.get('X-Auth-Token');
  if (!authToken) throw new Error('Missing auth token');
  
  const body = await request.text();
  const parsedToken = parseAuthToken(authToken);
  
  const payload: AuthPayload = {
    requestPath,
    body,
    timestamp: new Date().toISOString()
  };
  
  const isValid = verifyAuthToken(authToken, payload, TIME_PAD);
  if (!isValid) throw new Error('Invalid auth token');
  
  return {
    pubkey: parsedToken.pubkey,
    address: PublicKey.fromString(parsedToken.pubkey).toAddress()
  };
}`}
                    language="typescript"
                    filename="auth-middleware.ts"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
            <div className="max-w-8xl mx-auto text-center">
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