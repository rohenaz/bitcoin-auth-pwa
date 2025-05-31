'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ComponentGrid } from '@/components/ComponentGrid';

// Import bigblocks components normally since this is a client component
import {
  // Providers
  BitcoinAuthProvider,
  BitcoinThemeProvider,  
  BitcoinQueryProvider,
  
  // Authentication Components
  AuthButton,
  LoginForm,
  OAuthProviders,
  AuthFlowOrchestrator,
  SignupFlow,
  OAuthRestoreFlow,
  IdentityGeneration,
  
  // UI Components
  Modal,
  LoadingButton,
  PasswordInput,
  ErrorDisplay,
  WarningCard,
  StepIndicator,
  
  // Backup & Recovery
  BackupDownload,
  BackupImport,
  FileImport,
  MnemonicDisplay,
  DeviceLinkQR,
  MemberExport,
  QRCodeRenderer,
  CloudBackupManager,
  
  // Profile Components
  ProfileCard,
  ProfileEditor,
  ProfileSwitcher,
  ProfileManager,
  ProfilePublisher,
  ProfileViewer,
  ProfilePopover,
  
  // Wallet Components
  SendBSVButton,
  WalletOverview,
  DonateButton,
  QuickDonateButton,
  TokenBalance,
  CompactWalletOverview,
  QuickSendButton,
  HandCashConnector,
  YoursWalletConnector,
  
  // Social Components
  PostButton,
  LikeButton,
  FollowButton,
  SocialFeed,
  PostCard,
  MessageDisplay,
  CompactPostButton,
  
  // Market Components
  CreateListingButton,
  BuyListingButton,
  MarketTable,
  QuickListButton,
  QuickBuyButton,
  CompactMarketTable,
  
  // Layout Components
  AuthLayout,
  CenteredLayout,
  LoadingLayout,
  ErrorLayout,
  SuccessLayout,
  AuthCard,
  
  // BAP Components
  BapKeyRotationManager,
  BapFileSigner,
  BapEncryptionSuite,
  
  // Security Components
  ShamirSecretSharing,
  KeyManager,
  Type42KeyDerivation,
  
  // Developer Tools
  ArtifactDisplay,
  CodeBlock,
  ThemeDemo,
  CyberpunkDemo,
  TapButton,
  DataPushButton,
  DataPushForm
} from 'bigblocks';

// Import non-bigblocks components normally
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { Search, Filter, Grid, List, Eye, Code } from 'lucide-react';

const categories = [
  {
    id: 'authentication',
    name: 'Authentication',
    count: 7,
    components: [
      {
        name: 'auth-button',
        title: 'AuthButton',
        description: 'Simple authentication trigger button',
        component: <AuthButton>Sign In with Bitcoin</AuthButton>,
        promptPath: '/components/registry/prompts/auth-button.md',
      },
      {
        name: 'login-form',
        title: 'LoginForm', 
        description: 'Complete login form with multiple modes',
        component: <LoginForm mode="signin" onSuccess={(user) => console.log('Success:', user)} />,
        promptPath: '/components/registry/prompts/login-form.md',
      },
      {
        name: 'signup-flow',
        title: 'SignupFlow',
        description: 'Multi-step signup process',
        component: <SignupFlow onSuccess={(user) => console.log('Signup:', user)} />,
        promptPath: '/components/registry/prompts/signup-flow.md',
      },
      {
        name: 'oauth-providers',
        title: 'OAuthProviders',
        description: 'OAuth provider selection',
        component: <OAuthProviders onProviderClick={(provider) => console.log('Provider:', provider)} />,
        promptPath: '/components/registry/prompts/oauth-providers.md',
      },
      {
        name: 'auth-flow-orchestrator',
        title: 'AuthFlowOrchestrator',
        description: 'Unified auth flow management',
        component: <AuthFlowOrchestrator />,
        promptPath: '/components/registry/prompts/auth-flow-orchestrator.md',
      },
      {
        name: 'oauth-restore-flow',
        title: 'OAuthRestoreFlow',
        description: 'OAuth backup restoration',
        component: <OAuthRestoreFlow />,
      },
      {
        name: 'identity-generation',
        title: 'IdentityGeneration',
        description: 'Generate new Bitcoin identity',
        component: <IdentityGeneration onGenerate={() => {}} onImport={() => {}} />,
      },
    ],
  },
  {
    id: 'wallet',
    name: 'Wallet',
    count: 8,
    components: [
      {
        name: 'send-bsv-button',
        title: 'SendBSVButton',
        description: 'Send Bitcoin SV transactions',
        component: <SendBSVButton />,
        requiresFunding: true,
      },
      {
        name: 'donate-button',
        title: 'DonateButton',
        description: 'Accept Bitcoin donations',
        component: <DonateButton />,
        requiresFunding: true,
      },
      {
        name: 'quick-donate-button',
        title: 'QuickDonateButton',
        description: 'Quick donation button',
        component: <QuickDonateButton />,
        requiresFunding: true,
      },
      {
        name: 'wallet-overview',
        title: 'WalletOverview',
        description: 'Display wallet balance and info',
        component: <WalletOverview />,
      },
      {
        name: 'compact-wallet-overview',
        title: 'CompactWalletOverview',
        description: 'Compact wallet display',
        component: <CompactWalletOverview />,
      },
      {
        name: 'token-balance',
        title: 'TokenBalance',
        description: 'Show token balances',
        component: <TokenBalance tokens={[]} />,
      },
      {
        name: 'handcash-connector',
        title: 'HandCashConnector',
        description: 'Connect HandCash wallet',
        component: <HandCashConnector config={{ appId: 'demo' }} />,
      },
      {
        name: 'yours-wallet-connector',
        title: 'YoursWalletConnector',
        description: 'Connect Yours Wallet',
        component: <YoursWalletConnector />,
      },
    ],
  },
  {
    id: 'social',
    name: 'Social',
    count: 7,
    components: [
      {
        name: 'post-button',
        title: 'PostButton',
        description: 'Create on-chain posts',
        component: <PostButton />,
        requiresFunding: true,
      },
      {
        name: 'compact-post-button',
        title: 'CompactPostButton',
        description: 'Compact post creation',
        component: <CompactPostButton />,
        requiresFunding: true,
      },
      {
        name: 'like-button',
        title: 'LikeButton',
        description: 'Like on-chain content',
        component: <LikeButton txid="example" />,
        requiresFunding: true,
      },
      {
        name: 'follow-button',
        title: 'FollowButton',
        description: 'Follow users on-chain',
        component: <FollowButton idKey="example" />,
        requiresFunding: true,
      },
      {
        name: 'social-feed',
        title: 'SocialFeed',
        description: 'Display social content feed',
        component: <SocialFeed />,
      },
      {
        name: 'post-card',
        title: 'PostCard',
        description: 'Display individual posts',
        component: <PostCard post={{ content: 'Hello', txId: '123', timestamp: Date.now(), app: 'demo' }} />,
      },
      {
        name: 'message-display',
        title: 'MessageDisplay',
        description: 'Show messages and comments',
        component: <MessageDisplay message={{ content: 'Hello', timestamp: Date.now(), txId: '123', app: 'demo' }} />,
      },
    ],
  },
  {
    id: 'profile',
    name: 'Profile',
    count: 7,
    components: [
      {
        name: 'profile-card',
        title: 'ProfileCard',
        description: 'Display user profile',
        component: <ProfileCard profile={{ name: 'Satoshi', id: '1', address: '1A1zP1...', isPublished: true }} />,
      },
      {
        name: 'profile-editor',
        title: 'ProfileEditor',
        description: 'Edit profile information',
        component: <ProfileEditor profile={{ name: '', id: '', address: '', isPublished: false }} onSave={async () => {}} />,
      },
      {
        name: 'profile-switcher',
        title: 'ProfileSwitcher',
        description: 'Switch between profiles',
        component: <ProfileSwitcher profiles={[]} activeProfileId="1" onSwitch={() => {}} />,
      },
      {
        name: 'profile-viewer',
        title: 'ProfileViewer',
        description: 'View user profile details',
        component: <ProfileViewer profile={{ name: 'User', id: '1', address: '1A1zP1...', isPublished: true }} />,
      },
      {
        name: 'profile-popover',
        title: 'ProfilePopover',
        description: 'Profile preview popover',
        component: <ProfilePopover profile={{ name: 'User', id: '1', address: '1A1zP1...', isPublished: true }}><button>Hover me</button></ProfilePopover>,
      },
      {
        name: 'profile-publisher',
        title: 'ProfilePublisher',
        description: 'Publish profile on-chain',
        component: <ProfilePublisher profile={{ name: '', id: '', address: '', isPublished: false }} onPublish={() => Promise.resolve({ txid: '123' })} />,
        requiresFunding: true,
      },
      {
        name: 'profile-manager',
        title: 'ProfileManager',
        description: 'Complete profile management',
        component: <ProfileManager />,
      },
    ],
  },
  {
    id: 'market',
    name: 'Marketplace',
    count: 6,
    components: [
      {
        name: 'create-listing-button',
        title: 'CreateListingButton',
        description: 'Create marketplace listings',
        component: <CreateListingButton />,
        requiresFunding: true,
      },
      {
        name: 'buy-listing-button',
        title: 'BuyListingButton',
        description: 'Purchase marketplace items',
        component: <BuyListingButton listing={{ txid: '123', vout: 0, priceSats: 10000, payAddress: '1A1zP1...', ordAddress: '1A1zP1...', assetType: 'BSV21' as any }} />,
        requiresFunding: true,
      },
      {
        name: 'market-table',
        title: 'MarketTable',
        description: 'Display market listings',
        component: <MarketTable listings={[]} />,
      },
      {
        name: 'quick-list-button',
        title: 'QuickListButton',
        description: 'Quick listing creation',
        component: <QuickListButton />,
        requiresFunding: true,
      },
      {
        name: 'quick-buy-button',
        title: 'QuickBuyButton',
        description: 'Quick purchase button',
        component: <QuickBuyButton listing={{ txid: '123', vout: 0, priceSats: 10000, payAddress: '1A1zP1...', ordAddress: '1A1zP1...', assetType: 'BSV21' as any }} />,
        requiresFunding: true,
      },
      {
        name: 'compact-market-table',
        title: 'CompactMarketTable',
        description: 'Compact market view',
        component: <CompactMarketTable listings={[]} />,
      },
    ],
  },
  {
    id: 'backup',
    name: 'Backup & Recovery',
    count: 8,
    components: [
      {
        name: 'backup-download',
        title: 'BackupDownload',
        description: 'Download encrypted backups',
        component: <BackupDownload backup={{ ids: '1', xprv: 'xprv...', mnemonic: 'abandon abandon...' }} onDownloaded={() => {}} />,
      },
      {
        name: 'backup-import',
        title: 'BackupImport',
        description: 'Import wallet backups',
        component: <BackupImport onImport={(backup) => console.log('Imported:', backup)} />,
      },
      {
        name: 'file-import',
        title: 'FileImport',
        description: 'Import files with drag & drop',
        component: <FileImport />,
      },
      {
        name: 'mnemonic-display',
        title: 'MnemonicDisplay',
        description: 'Display recovery phrases',
        component: <MnemonicDisplay mnemonic="word1 word2 word3..." />,
      },
      {
        name: 'device-link-qr',
        title: 'DeviceLinkQR',
        description: 'QR code for device linking',
        component: <DeviceLinkQR onGenerateQR={async () => ({ qrData: '', token: '', expiresAt: new Date() })} />,
      },
      {
        name: 'qr-code-renderer',
        title: 'QRCodeRenderer',
        description: 'Render QR codes',
        component: <QRCodeRenderer data="bitcoin:1A1zP1..." />,
      },
      {
        name: 'member-export',
        title: 'MemberExport',
        description: 'Export member data',
        component: <MemberExport profileName="Demo" onGenerateExport={async () => ({ qrData: '', token: '', expiresAt: new Date() })} />,
      },
      {
        name: 'cloud-backup-manager',
        title: 'CloudBackupManager',
        description: 'Manage cloud backups',
        component: <CloudBackupManager />,
      },
    ],
  },
  {
    id: 'ui',
    name: 'UI Components',
    count: 8,
    components: [
      {
        name: 'loading-button',
        title: 'LoadingButton',
        description: 'Button with loading states',
        component: <LoadingButton loading={false}>Click Me</LoadingButton>,
      },
      {
        name: 'modal',
        title: 'Modal',
        description: 'Reusable modal dialog',
        component: <Modal isOpen={false} onClose={() => {}}>Modal Content</Modal>,
      },
      {
        name: 'password-input',
        title: 'PasswordInput',
        description: 'Secure password input',
        component: <PasswordInput value="" onChange={() => {}} />,
      },
      {
        name: 'step-indicator',
        title: 'StepIndicator',
        description: 'Multi-step progress',
        component: <StepIndicator steps={[{ id: '1', label: 'Step 1', status: 'complete' }, { id: '2', label: 'Step 2', status: 'active' }, { id: '3', label: 'Step 3', status: 'pending' }]} />,
        promptPath: '/components/registry/prompts/step-indicator.md',
      },
      {
        name: 'error-display',
        title: 'ErrorDisplay',
        description: 'Error message display',
        component: <ErrorDisplay error="Example error" />,
      },
      {
        name: 'warning-card',
        title: 'WarningCard',
        description: 'Warning notifications',
        component: <WarningCard message="This is a warning message" />,
      },
      {
        name: 'terminal-code-block',
        title: 'TerminalCodeBlock',
        description: 'Terminal-style code display',
        component: <TerminalCodeBlock code="npm install bigblocks" language="bash" />,
      },
      {
        name: 'code-block',
        title: 'CodeBlock',
        description: 'Syntax highlighted code',
        component: <CodeBlock code="const hello = 'world';" language="javascript" />,
      },
    ],
  },
  {
    id: 'bap',
    name: 'BAP Identity',
    count: 3,
    components: [
      {
        name: 'bap-key-rotation',
        title: 'BapKeyRotationManager',
        description: 'Manage BAP key rotation',
        component: <BapKeyRotationManager bapInstance={{} as any} />,
        requiresFunding: true,
      },
      {
        name: 'bap-file-signer',
        title: 'BapFileSigner',
        description: 'Sign files with BAP identity',
        component: <BapFileSigner bapInstance={{} as any} />,
      },
      {
        name: 'bap-encryption-suite',
        title: 'BapEncryptionSuite',
        description: 'Encrypt/decrypt with BAP',
        component: <BapEncryptionSuite bapInstance={{} as any} />,
      },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    count: 3,
    components: [
      {
        name: 'shamir-secret-sharing',
        title: 'ShamirSecretSharing',
        description: 'Split secrets securely',
        component: <ShamirSecretSharing />,
      },
      {
        name: 'key-manager',
        title: 'KeyManager',
        description: 'Manage cryptographic keys',
        component: <KeyManager />,
      },
      {
        name: 'type42-key-derivation',
        title: 'Type42KeyDerivation',
        description: 'BRC-42 key derivation',
        component: <Type42KeyDerivation />,
      },
    ],
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    count: 5,
    components: [
      {
        name: 'artifact-display',
        title: 'ArtifactDisplay',
        description: 'Display various artifacts',
        component: <ArtifactDisplay artifact={{ type: 'string' as any, src: 'example' }} />,
      },
      {
        name: 'theme-demo',
        title: 'ThemeDemo',
        description: 'Interactive theme demonstration',
        component: <ThemeDemo />,
      },
      {
        name: 'cyberpunk-demo',
        title: 'CyberpunkDemo',
        description: 'Cyberpunk theme showcase',
        component: <CyberpunkDemo />,
      },
      {
        name: 'tap-button',
        title: 'TapButton',
        description: 'Droplit tap interaction',
        component: <TapButton />,
        requiresFunding: true,
      },
      {
        name: 'data-push-button',
        title: 'DataPushButton',
        description: 'Push data to chain',
        component: <DataPushButton />,
        requiresFunding: true,
      },
    ],
  },
];

export function ComponentsPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCategories = useMemo(() => {
    return categories.map(category => ({
      ...category,
      components: category.components.filter(component =>
        component.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => 
      selectedCategory === 'all' || category.id === selectedCategory
    );
  }, [searchQuery, selectedCategory]);

  const totalComponents = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <BitcoinThemeProvider bitcoinTheme="orange" appearance="dark">
      <BitcoinAuthProvider config={{ apiUrl: '/api' }}>
        <BitcoinQueryProvider>
          <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-gray-800 sticky top-0 bg-black/95 backdrop-blur-sm z-40">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold text-orange-500">
                      BitcoinBlocks.dev
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                      <Link href="/quickstart" className="text-gray-400 hover:text-white transition-colors">
                        Quick Start
                      </Link>
                      <Link href="/components" className="text-white font-medium">
                        Components
                      </Link>
                      <Link href="/themes" className="text-gray-400 hover:text-white transition-colors">
                        Themes
                      </Link>
                      <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">
                        Docs
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>
            </header>

            {/* Page Header */}
            <div className="border-b border-gray-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-bold mb-4">Component Browser</h1>
                <p className="text-gray-400 text-lg">
                  {totalComponents} production-ready components for Bitcoin applications
                </p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.count})
                      </option>
                    ))}
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'} transition-colors`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Components Display */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              {filteredCategories.map(category => (
                category.components.length > 0 && (
                  <div key={category.id} className="mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-white">
                      {category.name}
                      <span className="ml-2 text-sm text-gray-500">
                        ({category.components.length})
                      </span>
                    </h2>
                    <ComponentGrid 
                      components={category.components} 
                      category={category.name}
                    />
                  </div>
                )
              ))}
            </div>
          </div>
        </BitcoinQueryProvider>
      </BitcoinAuthProvider>
    </BitcoinThemeProvider>
  );
}