'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  BitcoinAuthProvider,
  BitcoinThemeProvider,
  BitcoinQueryProvider,
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
  Modal,
  LoadingButton,
  PasswordInput,
  ErrorDisplay,
  WarningCard,
  SignupFlow,
  OAuthRestoreFlow,
  BackupImport,
  MnemonicDisplay,
  IdentityGeneration,
  // Market components
  CreateListingButton,
  BuyListingButton,
  MarketTable,
  QuickListButton,
  QuickBuyButton,
  CompactMarketTable,
  // Social components
  PostButton,
  LikeButton,
  FollowButton,
  SocialFeed,
  PostCard,
  MessageDisplay,
  // Wallet components
  SendBSVButton,
  WalletOverview,
  DonateButton,
  QuickDonateButton,
  TokenBalance,
  CompactWalletOverview,
  QuickSendButton,
  // Profile Management
  ProfileCard,
  ProfileEditor,
  ProfileManager,
  ProfilePopover,
  ProfilePublisher,
  ProfileSwitcher,
  ProfileViewer,
  CloudBackupManager,
  // Developer Tools
  ShamirSecretSharing,
  KeyManager,
  Type42KeyDerivation,
  ArtifactDisplay,
  ThemeDemo,
  CyberpunkDemo,
  // Layout components
  AuthLayout,
  CenteredLayout,
  LoadingLayout,
  ErrorLayout,
  SuccessLayout,
  AuthCard,
  // Additional components
  BackupDownload,
  QRCodeRenderer,
  OAuthConflictModal,
  OAuthRestoreForm,
  // Hooks
  useBitcoinAuth,
  useHandCash,
  useYoursWallet,
  useAuthMessages,
  // Types
  type Step
} from 'bigblocks';
// Droplit components (local)
import { TapButton, DataPushButton } from '../../droplit/components';
import { motion } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  Shield, 
  Zap, 
  Globe, 
  Code2, 
  Package,
  Wallet,
  Layout,
  Layers,
  Workflow,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Filter,
  Download,
  Fingerprint,
  Palette
} from 'lucide-react';
import QRCode from 'qrcode';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { components, componentCategories, type ComponentExample } from './components-data';

// Icon mapping for categories
const categoryIcons: Record<string, React.ElementType> = {
  'Workflow': Workflow,
  'Package': Package,
  'Wallet': Wallet,
  'Shield': Shield,
  'Layers': Layers,
  'Layout': Layout,
  'Code2': Code2,
  'Fingerprint': Fingerprint
};

export default function ShowcasePage() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['auth-flows']); // Start with first category expanded
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<ComponentExample | null>(components[0] || null);
  const [copiedCode, setCopiedCode] = useState<string>('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // OAuth callback handling
  const [oauthResult, setOauthResult] = useState<{
    success: boolean;
    provider: string;
    code?: string;
    error?: string;
  } | null>(null);

  // Check for OAuth callback parameters on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const oauthSuccess = urlParams.get('oauth_success');
      const oauthError = urlParams.get('oauth_error');
      const provider = urlParams.get('provider');
      const code = urlParams.get('code');

      if (provider && (oauthSuccess || oauthError)) {
        setOauthResult({
          success: oauthSuccess === 'true',
          provider,
          code: code || undefined,
          error: oauthError || undefined
        });

        // Auto-select the relevant OAuth component
        if (provider === 'handcash') {
          const handcashComponent = components.find(c => c.id === 'handcash-connector');
          if (handcashComponent) {
            setSelectedComponent(handcashComponent);
            setExpandedCategories(prev => [...prev, 'oauth-wallets']);
          }
        } else if (provider === 'yours-wallet') {
          const yoursComponent = components.find(c => c.id === 'yours-wallet-connector');
          if (yoursComponent) {
            setSelectedComponent(yoursComponent);
            setExpandedCategories(prev => [...prev, 'oauth-wallets']);
          }
        }

        // Clean URL after handling
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, []);

  // Get current component index and navigation helpers
  const currentIndex = selectedComponent ? components.findIndex(c => c.id === selectedComponent.id) : -1;
  const previousComponent = currentIndex > 0 ? components[currentIndex - 1] : null;
  const nextComponent = currentIndex < components.length - 1 ? components[currentIndex + 1] : null;

  // Enhanced search with fuzzy matching
  const filteredComponents = useMemo(() => {
    if (searchQuery === '') return components;
    
    const query = searchQuery.toLowerCase();
    return components.filter(component => {
      // Check name, description, and category
      const searchableText = [
        component.name,
        component.description,
        component.category,
        componentCategories.find(c => c.id === component.category)?.name || ''
      ].join(' ').toLowerCase();
      
      // Simple fuzzy match - check if all query characters appear in order
      let queryIndex = 0;
      for (let i = 0; i < searchableText.length && queryIndex < query.length; i++) {
        if (searchableText[i] === query[queryIndex]) {
          queryIndex++;
        }
      }
      return queryIndex === query.length;
    });
  }, [searchQuery]);


  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const navigateToComponent = (component: ComponentExample) => {
    setSelectedComponent(component);
    // Auto-expand the category containing this component
    if (!expandedCategories.includes(component.category)) {
      setExpandedCategories(prev => [...prev, component.category]);
    }
    // Close mobile menu if open
    setShowMobileMenu(false);
  };

  const goToPrevious = () => {
    if (previousComponent) {
      navigateToComponent(previousComponent);
    }
  };

  const goToNext = () => {
    if (nextComponent) {
      navigateToComponent(nextComponent);
    }
  };

  // Demo states for interactive components
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const demoSteps: Step[] = [
    { id: 'generate', label: 'Generate Identity', status: 'complete' },
    { id: 'password', label: 'Set Password', status: 'active' },
    { id: 'backup', label: 'Save Backup', status: 'pending' },
    { id: 'link', label: 'Link Cloud', status: 'pending' }
  ];

  return (
    <BitcoinAuthProvider config={{ apiUrl: '/api' }}>
      <BitcoinQueryProvider>
        <div className="min-h-screen bg-black text-white">
        {/* Navigation Header */}
        <header className="border-b border-gray-800/50 sticky top-0 bg-black/95 backdrop-blur-sm z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <nav className="flex items-center space-x-8">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/quickstart" className="text-gray-400 hover:text-white transition-colors">
                  Quick Start
                </Link>
                <Link href="/themes" className="text-gray-400 hover:text-white transition-colors">
                  Themes
                </Link>
                <Link href="/components" className="text-white">
                  Components
                </Link>
                <Link href="/mcp-server" className="text-gray-400 hover:text-white transition-colors">
                  MCP Server
                </Link>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </nav>
              
              {/* Mobile menu button */}
              <button
                type="button"
                className="lg:hidden p-2"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Hero Section - Keep existing */}
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
                Component Browser
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
                Explore all 89 Bitcoin authentication components with live demos, 
                props documentation, and copy-paste code examples.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://github.com/bitcoin-auth/bigblocks"
                  className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View on GitHub
                </a>
                <code className="px-6 py-3 bg-gray-900 rounded-lg text-orange-500 font-mono">
                  npm install bigblocks
                </code>
              </div>

              {/* Quick Access */}
              <div className="mt-16 max-w-6xl mx-auto">
                {/* All Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {componentCategories.map((category, index) => {
                    const Icon = categoryIcons[category.icon] || Package;
                    const categoryComponents = filteredComponents.filter(c => c.category === category.id);
                    const colorClasses = [
                      { border: 'hover:border-orange-500/50', text: 'text-orange-500' },
                      { border: 'hover:border-purple-500/50', text: 'text-purple-500' },
                      { border: 'hover:border-blue-500/50', text: 'text-blue-500' },
                      { border: 'hover:border-green-500/50', text: 'text-green-500' },
                      { border: 'hover:border-cyan-500/50', text: 'text-cyan-500' },
                      { border: 'hover:border-pink-500/50', text: 'text-pink-500' },
                      { border: 'hover:border-yellow-500/50', text: 'text-yellow-500' },
                      { border: 'hover:border-red-500/50', text: 'text-red-500' },
                      { border: 'hover:border-indigo-500/50', text: 'text-indigo-500' },
                      { border: 'hover:border-teal-500/50', text: 'text-teal-500' }
                    ];
                    const colorClass = colorClasses[index % colorClasses.length] || { border: 'hover:border-orange-500/50', text: 'text-orange-500' };
                    
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          // Navigate to first component in category or expand category
                          if (categoryComponents.length > 0) {
                            const firstComponent = categoryComponents[0];
                            if (firstComponent) {
                              navigateToComponent(firstComponent);
                            }
                          }
                        }}
                        className={`p-4 bg-gray-900/50 border border-gray-800 ${colorClass.border} rounded-lg transition-all group`}
                      >
                        <div className={`${colorClass.text} mb-2`}>
                          <Icon className="w-6 h-6 mx-auto" />
                        </div>
                        <div className="text-sm font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {categoryComponents.length} component{categoryComponents.length !== 1 ? 's' : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Component Browser */}
        <div className="flex">
          {/* Sidebar */}
          <aside className={`
            fixed lg:sticky lg:top-16 inset-y-0 lg:inset-y-auto left-0 z-40
            transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 transition-transform duration-300
            w-80 bg-gray-950 border-r border-gray-800/50
            h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] overflow-y-auto
          `}>
            <div className="p-6">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Accordion Categories */}
              <div className="space-y-1">
                {componentCategories.map(category => {
                  const Icon = categoryIcons[category.icon] || Package;
                  const categoryComponents = filteredComponents.filter(c => c.category === category.id);
                  const isExpanded = expandedCategories.includes(category.id);
                  
                  if (categoryComponents.length === 0 && searchQuery) return null;
                  
                  return (
                    <div key={category.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedCategories(prev =>
                            isExpanded
                              ? prev.filter(id => id !== category.id)
                              : [...prev, category.id]
                          );
                        }}
                        className="w-full text-left px-4 py-2 rounded-lg transition-colors hover:bg-gray-900 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                              {categoryComponents.length}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-6 mt-1 space-y-1">
                            {categoryComponents.map(component => (
                              <button
                                type="button"
                                key={component.id}
                                onClick={() => navigateToComponent(component)}
                                className={`w-full text-left px-4 py-2 rounded-lg transition-colors text-sm ${
                                  selectedComponent?.id === component.id
                                    ? 'bg-orange-500/10 text-orange-500'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{component.name}</span>
                                  {selectedComponent?.id === component.id && (
                                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Mobile overlay */}
          {showMobileMenu && (
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setShowMobileMenu(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowMobileMenu(false);
                }
              }}
              role="button"
              tabIndex={0}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="max-w-5xl mx-auto p-8">
              {selectedComponent ? (
                <motion.div
                  key={selectedComponent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Component Header */}
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">{selectedComponent.name}</h2>
                    <p className="text-gray-400 text-lg mb-4">{selectedComponent.description}</p>
                    
                    {/* Requirements Badges */}
                    {selectedComponent.requirements && selectedComponent.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedComponent.requirements.map((req, index) => (
                          <div
                            key={index}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                              req.type === 'provider' 
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                : req.type === 'funding'
                                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                                : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            }`}
                          >
                            <span className="text-xs">
                              {req.type === 'provider' ? '🔧' : req.type === 'funding' ? '💰' : '⚙️'}
                            </span>
                            {req.link ? (
                              <a 
                                href={req.link}
                                className="hover:underline"
                                title={req.description}
                              >
                                {req.name}
                              </a>
                            ) : (
                              <span title={req.description}>{req.name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Import Statement */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Installation
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(selectedComponent.importStatement, 'import')}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedCode === 'import' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                      <code className="text-sm text-gray-300">{selectedComponent.importStatement}</code>
                    </div>
                  </div>

                  {/* Live Demo */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Live Demo
                    </h3>
                    <div className="bg-gray-950 border border-gray-800 rounded-lg p-8">
                      {/* Render component based on ID */}
                      {selectedComponent.id === 'auth-button' && (
                        <AuthButton>Sign In with Bitcoin</AuthButton>
                      )}
                      {selectedComponent.id === 'login-form-basic' && (
                        <LoginForm 
                          mode="signin"
                          onSuccess={() => console.log('Demo success')}
                          onError={() => console.log('Demo error')}
                        />
                      )}
                      {selectedComponent.id === 'login-form-advanced' && (
                        <div className="max-w-md mx-auto">
                          <LoginForm
                            mode="signin"
                            onSuccess={(user) => console.log('Login success:', user)}
                          />
                        </div>
                      )}
                      {selectedComponent.id === 'oauth-providers' && (
                        <OAuthProviders
                          onProviderClick={(provider) => console.log('Selected:', provider)}
                        />
                      )}
                      {selectedComponent.id === 'loading-button' && (
                        <div className="space-y-4">
                          <LoadingButton
                            onClick={() => {
                              setIsLoading(true);
                              setTimeout(() => setIsLoading(false), 2000);
                            }}
                            loading={isLoading}
                          >
                            Click Me
                          </LoadingButton>
                        </div>
                      )}
                      {selectedComponent.id === 'password-input' && (
                        <PasswordInput
                          value={password}
                          onChange={(value) => setPassword(value)}
                          placeholder="Enter your password"
                        />
                      )}
                      {selectedComponent.id === 'step-indicator' && (
                        <StepIndicator steps={demoSteps} />
                      )}
                      {selectedComponent.id === 'modal' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                          >
                            Open Modal
                          </button>
                          <Modal
                            isOpen={modalOpen}
                            onClose={() => setModalOpen(false)}
                            title="Example Modal"
                          >
                            <p>This is a modal dialog component.</p>
                          </Modal>
                        </>
                      )}
                      {selectedComponent.id === 'error-display' && (
                        <ErrorDisplay error="This is an error message" />
                      )}
                      {selectedComponent.id === 'warning-card' && (
                        <WarningCard
                          title="Important Notice"
                          message="Please backup your recovery phrase in a safe place."
                        />
                      )}
                      {selectedComponent.id === 'file-import' && (
                        <FileImport
                          onFileValidated={(file) => console.log('File validated:', file.name)}
                          onError={(error) => console.log('Error:', error)}
                        />
                      )}
                      {selectedComponent.id === 'device-link-qr' && (
                        <DeviceLinkQR 
                          onGenerateQR={async () => {
                            const url = 'https://example.com/link/demo-token';
                            const qrDataUrl = await QRCode.toDataURL(url);
                            return {
                              qrData: qrDataUrl,
                              token: 'demo-token',
                              expiresAt: new Date(Date.now() + 10 * 60 * 1000)
                            };
                          }}
                          baseUrl="https://example.com"
                        />
                      )}
                      {selectedComponent.id === 'member-export' && (
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
                      )}
                      {selectedComponent.id === 'handcash-connector' && (
                        <div className="space-y-4">
                          {oauthResult && oauthResult.provider === 'handcash' && (
                            <div className={`p-4 rounded-lg border ${
                              oauthResult.success 
                                ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                                : 'bg-red-500/10 border-red-500/50 text-red-400'
                            }`}>
                              {oauthResult.success ? (
                                <div>
                                  <p className="font-medium">✅ HandCash OAuth Success!</p>
                                  <p className="text-sm mt-1">Authorization code: {oauthResult.code?.substring(0, 20)}...</p>
                                </div>
                              ) : (
                                <div>
                                  <p className="font-medium">❌ HandCash OAuth Error</p>
                                  <p className="text-sm mt-1">Error: {oauthResult.error}</p>
                                </div>
                              )}
                            </div>
                          )}
                          <HandCashConnector
                            config={{
                              appId: "demo-app-id",
                              redirectUrl: typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/handcash` : '',
                              environment: "iae"
                            }}
                            onSuccess={(result) => {
                              console.log('HandCash connected:', result);
                              setOauthResult({ success: true, provider: 'handcash', code: 'demo-result' });
                            }}
                            onError={(error: unknown) => {
                              console.error('HandCash error:', error);
                              const errorMessage = error instanceof Error ? error.message : String(error);
                              setOauthResult({ success: false, provider: 'handcash', error: errorMessage });
                            }}
                          />
                        </div>
                      )}
                      {selectedComponent.id === 'yours-wallet-connector' && (
                        <div className="space-y-4">
                          {oauthResult && oauthResult.provider === 'yours-wallet' && (
                            <div className={`p-4 rounded-lg border ${
                              oauthResult.success 
                                ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                                : 'bg-red-500/10 border-red-500/50 text-red-400'
                            }`}>
                              {oauthResult.success ? (
                                <div>
                                  <p className="font-medium">✅ Yours Wallet OAuth Success!</p>
                                  <p className="text-sm mt-1">Authorization code: {oauthResult.code?.substring(0, 20)}...</p>
                                </div>
                              ) : (
                                <div>
                                  <p className="font-medium">❌ Yours Wallet OAuth Error</p>
                                  <p className="text-sm mt-1">Error: {oauthResult.error}</p>
                                </div>
                              )}
                            </div>
                          )}
                          <YoursWalletConnector
                            onSuccess={(result) => {
                              console.log('Yours Wallet connected:', result);
                              setOauthResult({ success: true, provider: 'yours-wallet', code: 'demo-result' });
                            }}
                            onError={(error: unknown) => {
                              console.error('Yours Wallet error:', error);
                              const errorMessage = error instanceof Error ? error.message : String(error);
                              setOauthResult({ success: false, provider: 'yours-wallet', error: errorMessage });
                            }}
                          />
                        </div>
                      )}
                      {selectedComponent.id === 'auth-flow-orchestrator' && (
                        <div className="max-w-md mx-auto">
                          <AuthFlowOrchestrator
                            flowType="unified"
                            enableOAuth={true}
                            enableDeviceLink={true}
                            onSuccess={(user) => console.log('Auth success:', user)}
                          />
                        </div>
                      )}
                      {selectedComponent.id === 'signup-flow' && (
                        <div className="max-w-md mx-auto">
                          <SignupFlow
                            onSuccess={(user) => console.log('Signup success:', user)}
                            onError={(error) => console.error('Signup error:', error)}
                          />
                        </div>
                      )}
                      {selectedComponent.id === 'oauth-restore-flow' && (
                        <div className="max-w-md mx-auto">
                          <OAuthRestoreFlow
                            showProviderSelection={true}
                            showPasswordEntry={true}
                            onRestoreSuccess={(bapId) => console.log('Restore success:', bapId)}
                            onRestoreError={(error) => console.error('Restore error:', error)}
                          />
                        </div>
                      )}
                      {selectedComponent.id === 'oauth-restore-form' && (
                        <div className="text-center py-8 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                          <Shield className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                          <p className="text-gray-400">⚠️ Backend Required: This component needs OAuth provider context and encrypted backup data.</p>
                          <p className="text-sm text-gray-500 mt-2">See component description and code example for backend integration details.</p>
                        </div>
                      )}
                      {selectedComponent.id === 'backup-import' && (
                        <BackupImport
                          onImport={(e) => console.log('File selected:', e.target.files?.[0]?.name)}
                        />
                      )}
                      {selectedComponent.id === 'backup-download' && (
                        <div className="text-center py-8 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                          <Download className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                          <p className="text-gray-400">⚠️ Backend Required: This component needs a generated BAP backup object from the authentication flow.</p>
                          <p className="text-sm text-gray-500 mt-2">See component description and code example for integration details.</p>
                        </div>
                      )}
                      {selectedComponent.id === 'mnemonic-display' && (
                        <MnemonicDisplay
                          mnemonic="abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
                          onContinue={() => console.log('Continue clicked')}
                          showCopyButton={true}
                        />
                      )}
                      {selectedComponent.id === 'identity-generation' && (
                        <IdentityGeneration
                          onGenerate={() => console.log('Generate clicked')}
                          onImport={(file) => console.log('Import file:', file.name)}
                        />
                      )}
                      {selectedComponent.id === 'bitcoin-auth-provider' && (
                        <div className="text-center py-8 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                          <Package className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                          <p className="text-gray-400">🔧 Configuration Required: This context provider needs backend API configuration.</p>
                          <p className="text-sm text-gray-500 mt-2">Wrap your app with it and provide apiUrl configuration as shown in the code example.</p>
                        </div>
                      )}

                      {/* Provider Components */}
                      {selectedComponent.id === 'bitcoin-theme-provider' && (
                        <div className="space-y-4">
                          <div className="text-center py-8 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                            <div className="text-orange-400 mb-4">
                              <Palette className="w-12 h-12 mx-auto" />
                            </div>
                            <p className="text-gray-400">🎨 Theme Provider: This provider is already wrapping this demo!</p>
                            <p className="text-sm text-gray-500 mt-2">The current theme system is powered by BitcoinThemeProvider with 8 color presets.</p>
                          </div>
                          <div className="text-center">
                            <ThemeDemo />
                          </div>
                        </div>
                      )}
                      {selectedComponent.id === 'bitcoin-query-provider' && (
                        <div id="bitcoin-query-provider" className="text-center py-8 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                          <div className="text-blue-400 mb-4">
                            <Package className="w-12 h-12 mx-auto" />
                          </div>
                          <p className="text-gray-400">⚡ Query Provider: Enables React Query for market, wallet, and social components.</p>
                          <p className="text-sm text-gray-500 mt-2">Wrap components that need data fetching with BitcoinQueryProvider.</p>
                          <div className="mt-4 text-left bg-gray-900/50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚠️ Required For:</h4>
                            <ul className="text-xs text-gray-300 space-y-1">
                              <li>• SendBSVButton, WalletOverview, TokenBalance</li>
                              <li>• PostButton, LikeButton, FollowButton</li>
                              <li>• CreateListingButton, MarketTable</li>
                              <li>• All components that fetch blockchain data</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Profile Management Components */}
                      {selectedComponent.id === 'profile-card' && (
                        <div className="max-w-md mx-auto">
                          <ProfileCard
                            profile={{
                              '@type': 'Person' as any,
                              id: 'satoshi-demo',
                              address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
                              isPublished: true,
                              name: 'Satoshi Nakamoto',
                              alternateName: 'satoshi',
                              description: 'Creator of Bitcoin and digital currency pioneer',
                              image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=satoshi'
                            }}
                            showActions={true}
                            onEdit={() => console.log('Edit profile')}
                          />
                        </div>
                      )}
                      {selectedComponent.id === 'profile-editor' && (
                        <div className="max-w-md mx-auto">
                          <ProfileEditor
                            profile={{
                              '@type': 'Person' as any,
                              id: 'demo-user',
                              address: '1DemoUserAddress...',
                              isPublished: false,
                              name: 'Demo User',
                              alternateName: 'demo',
                              description: 'A demo profile for editing'
                            }}
                            onSave={async (profile) => console.log('Saved profile:', profile)}
                            onCancel={() => console.log('Cancelled editing')}
                          />
                        </div>
                      )}
                      {selectedComponent.id === 'profile-manager' && (
                        <div className="text-center py-8 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
                          <Package className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                          <p className="text-gray-400">👤 ProfileManager: Complete profile management interface</p>
                          <p className="text-sm text-gray-500 mt-2">This component provides multi-profile support with create, edit, and delete operations.</p>
                        </div>
                      )}
                      {selectedComponent.id === 'profile-popover' && (
                        <div className="max-w-sm mx-auto">
                          <ProfilePopover
                            profile={{
                              '@type': 'Person' as any,
                              id: 'demo-popover-user',
                              address: '1PopoverUserAddress...',
                              isPublished: true,
                              name: 'Demo Popover User',
                              alternateName: 'demo-popover',
                              description: 'Profile shown in popover demo',
                              image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=popover'
                            }}
                          >
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                              Hover for Profile
                            </button>
                          </ProfilePopover>
                        </div>
                      )}
                      {selectedComponent.id === 'profile-publisher' && (
                        <div className="max-w-md mx-auto">
                          <ProfilePublisher
                            profile={{
                              '@type': 'Person' as any,
                              id: 'demo-publisher-user',
                              address: '1PublisherUserAddress...',
                              isPublished: false,
                              name: 'Demo Publisher User',
                              alternateName: 'demo-publisher',
                              description: 'Profile ready to be published to blockchain'
                            }}
                            onPublish={async (profileId) => {
                              console.log('Publishing profile:', profileId);
                              // Simulate publishing delay
                              await new Promise(resolve => setTimeout(resolve, 2000));
                              console.log('Profile published successfully!');
                              return { txid: 'demo-publish-tx-123' };
                            }}
                          />
                        </div>
                      )}
                      {selectedComponent.id === 'profile-switcher' && (
                        <div className="max-w-sm mx-auto">
                          <ProfileSwitcher
                            profiles={[
                              { '@type': 'Person' as any, id: 'personal', address: '1PersonalProfile...', isPublished: true, name: 'Personal', alternateName: 'personal' },
                              { '@type': 'Person' as any, id: 'work', address: '1WorkProfile...', isPublished: false, name: 'Work', alternateName: 'work' },
                              { '@type': 'Organization' as any, id: 'company', address: '1CompanyProfile...', isPublished: true, name: 'Company', alternateName: 'company' }
                            ]}
                            activeProfileId="personal"
                            onSwitch={(id: string) => console.log('Switched to profile:', id)}
                            onCreate={() => console.log('Create new profile')}
                          />
                        </div>
                      )}
                      {selectedComponent.id === 'profile-viewer' && (
                        <div className="max-w-md mx-auto">
                          <ProfileViewer
                            profile={{
                              '@type': 'Person' as any,
                              id: 'hal-finney',
                              address: '1HalFinneyAddress...',
                              isPublished: true,
                              name: 'Hal Finney',
                              alternateName: 'hal',
                              description: 'Computer scientist and early Bitcoin adopter',
                              image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hal',
                              url: 'https://example.com/hal'
                            }}
                          />
                        </div>
                      )}
                      {selectedComponent.id === 'cloud-backup-manager' && (
                        <div className="text-center py-8 bg-green-500/5 border border-green-500/20 rounded-lg">
                          <Package className="w-12 h-12 text-green-500 mx-auto mb-4" />
                          <p className="text-gray-400">☁️ CloudBackupManager: Multi-provider backup management</p>
                          <p className="text-sm text-gray-500 mt-2">Manage encrypted backups across Google Drive, GitHub, and Dropbox.</p>
                        </div>
                      )}

                      {/* Wallet Components */}
                      {selectedComponent.id === 'donate-button' && (
                        <div className="text-center">
                          <DonateButton />
                        </div>
                      )}
                      {selectedComponent.id === 'quick-donate-button' && (
                        <div className="text-center">
                          <QuickDonateButton />
                        </div>
                      )}
                      {selectedComponent.id === 'token-balance' && (
                        <div className="text-center">
                          <TokenBalance tokens={[]} />
                        </div>
                      )}
                      {selectedComponent.id === 'compact-wallet-overview' && (
                        <div className="text-center">
                          <CompactWalletOverview />
                        </div>
                      )}
                      {selectedComponent.id === 'quick-send-button' && (
                        <div className="text-center">
                          <QuickSendButton 
                            amount="0.001"
                            recipient="1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"
                          />
                        </div>
                      )}

                      {/* Developer Tools */}
                      {selectedComponent.id === 'theme-demo' && (
                        <div className="text-center">
                          <ThemeDemo />
                        </div>
                      )}
                      {selectedComponent.id === 'cyberpunk-demo' && (
                        <div className="text-center">
                          <CyberpunkDemo />
                        </div>
                      )}
                      {selectedComponent.id === 'shamir-secret-sharing' && (
                        <div className="text-center">
                          <ShamirSecretSharing />
                        </div>
                      )}
                      {selectedComponent.id === 'key-manager' && (
                        <div className="text-center">
                          <KeyManager />
                        </div>
                      )}
                      {selectedComponent.id === 'type42-key-derivation' && (
                        <div className="text-center">
                          <Type42KeyDerivation />
                        </div>
                      )}
                      {selectedComponent.id === 'artifact-display' && (
                        <div className="text-center py-8 bg-gray-500/5 border border-gray-500/20 rounded-lg">
                          <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-400">📄 ArtifactDisplay: Display various Bitcoin artifact types</p>
                          <p className="text-sm text-gray-500 mt-2">Supports text, JSON, images, and other artifact formats.</p>
                        </div>
                      )}

                      {/* Market Components */}
                      {selectedComponent.id === 'quick-list-button' && (
                        <div className="text-center">
                          <QuickListButton />
                        </div>
                      )}
                      {selectedComponent.id === 'quick-buy-button' && (
                        <div className="text-center">
                          <QuickBuyButton listing={{} as any} />
                        </div>
                      )}
                      {selectedComponent.id === 'compact-market-table' && (
                        <div className="text-center">
                          <CompactMarketTable listings={[]} />
                        </div>
                      )}
                      {selectedComponent.id === 'create-listing-button' && (
                        <div className="text-center">
                          <CreateListingButton />
                        </div>
                      )}
                      {selectedComponent.id === 'buy-listing-button' && (
                        <div className="text-center">
                          <BuyListingButton listing={{} as any} />
                        </div>
                      )}
                      {selectedComponent.id === 'market-table' && (
                        <div className="text-center">
                          <MarketTable listings={[]} />
                        </div>
                      )}

                      {/* Wallet Components */}
                      {selectedComponent.id === 'send-bsv-button' && (
                        <div className="text-center">
                          <SendBSVButton />
                        </div>
                      )}
                      {selectedComponent.id === 'wallet-overview' && (
                        <div className="text-center">
                          <WalletOverview />
                        </div>
                      )}

                      {/* Social Components */}
                      {selectedComponent.id === 'social-feed' && (
                        <div className="text-center">
                          <SocialFeed posts={[]} />
                        </div>
                      )}
                      {selectedComponent.id === 'post-card' && (
                        <div className="text-center">
                          <PostCard post={{} as any} />
                        </div>
                      )}
                      {selectedComponent.id === 'like-button' && (
                        <div className="text-center">
                          <LikeButton txid="demo-post-123" />
                        </div>
                      )}
                      {selectedComponent.id === 'follow-button' && (
                        <div className="text-center">
                          <FollowButton idKey="demo-user-456" />
                        </div>
                      )}
                      {selectedComponent.id === 'post-button' && (
                        <div className="text-center">
                          <PostButton />
                        </div>
                      )}

                      {/* Additional Components */}
                      {selectedComponent.id === 'qr-code-renderer' && (
                        <div className="text-center">
                          <QRCodeRenderer
                            data="bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa?amount=0.001"
                            size={200}
                          />
                        </div>
                      )}
                      {selectedComponent.id === 'oauth-conflict-modal' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                          >
                            Show OAuth Conflict
                          </button>
                          <OAuthConflictModal
                            isOpen={modalOpen}
                            provider="google"
                            currentBapId="current-demo-account"
                            existingBapId="existing-account-123"
                            onTransferComplete={() => {
                              console.log('Account transferred');
                              setModalOpen(false);
                            }}
                            onSwitchAccount={() => {
                              console.log('Switched accounts');
                              setModalOpen(false);
                            }}
                            onClose={() => setModalOpen(false)}
                          />
                        </>
                      )}
                      {selectedComponent.id === 'message-display' && (
                        <MessageDisplay
                          message={{
                            txId: 'demo-message-123',
                            content: 'Hello! This is a Bitcoin message.',
                            contentType: 'text/plain' as const,
                            timestamp: Date.now() - 1800000,
                            app: 'bigblocks-demo',
                            author: {
                              idKey: 'demo-user-123',
                              currentAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
                              rootAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
                              addresses: [],
                              block: 800000,
                              firstSeen: Date.now() - 864000000,
                              timestamp: Date.now() - 1800000,
                              valid: true,
                              identity: {
                                '@type': 'Person',
                                alternateName: 'Demo User',
                                description: 'A demo user for showcasing MessageDisplay'
                              } as any
                            }
                          }}
                          showTimestamp={true}
                        />
                      )}

                      {/* Layout Components */}
                      {selectedComponent.id === 'auth-card' && (
                        <AuthCard>
                          <h3 className="text-lg font-semibold mb-4">Demo Card Content</h3>
                          <p className="text-gray-400 mb-4">This is an example of content inside an AuthCard component.</p>
                          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors">
                            Action Button
                          </button>
                        </AuthCard>
                      )}
                      
                      {/* Provider components */}
                      {selectedComponent.category === 'providers' && (
                        <div className="text-center py-8 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                          <Package className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                          <p className="text-gray-400">⚙️ Provider Components: These wrap your entire app to provide context and configuration.</p>
                          <p className="text-sm text-gray-500 mt-2">See the code example for proper app-level setup and configuration options.</p>
                        </div>
                      )}
                      
                      {/* Profile management components */}
                      {selectedComponent.category === 'profile-management' && (
                        <div className="text-center py-8 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
                          <Package className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                          <p className="text-gray-400">👤 Profile Management: These components require authenticated user context with profile data.</p>
                          <p className="text-sm text-gray-500 mt-2">See the code example for integration with user profiles and schema.org data.</p>
                        </div>
                      )}
                      
                      {/* Core utilities */}
                      {selectedComponent.category === 'core-utilities' && (
                        <div className="text-center py-8 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
                          <Package className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                          <p className="text-gray-400">🛠️ Core Utilities: These are classes and functions, not React components.</p>
                          <p className="text-sm text-gray-500 mt-2">Use these utilities in your application logic. See code examples for usage patterns.</p>
                        </div>
                      )}
                      
                      {/* Hook examples show code only since they can't be demoed visually */}
                      {selectedComponent.category === 'hooks' && (
                        <div className="text-center py-8 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                          <Code2 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                          <p className="text-gray-400">🪝 React Hooks: These are demonstrated through code examples only.</p>
                          <p className="text-sm text-gray-500 mt-2">Most hooks require BitcoinAuthProvider setup and backend integration. See usage examples below.</p>
                        </div>
                      )}
                      {/* Layout components need special handling */}
                      {selectedComponent.category === 'layouts' && (
                        <div className="text-center py-8 bg-green-500/5 border border-green-500/20 rounded-lg">
                          <Layout className="w-12 h-12 text-green-500 mx-auto mb-4" />
                          <p className="text-gray-400">📱 Layout Components: These wrap entire pages and set overall structure.</p>
                          <p className="text-sm text-gray-500 mt-2">See the code example for proper page-level usage patterns.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Code Example */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Usage Example
                    </h3>
                    <TerminalCodeBlock
                      code={selectedComponent.codeExample}
                      language="jsx"
                      filename="Example.jsx"
                    />
                  </div>

                  {/* Props Documentation */}
                  {selectedComponent.props && selectedComponent.props.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Props
                      </h3>
                      <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-800">
                              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Prop</th>
                              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Type</th>
                              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Required</th>
                              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedComponent.props.map((prop, index) => (
                              <tr key={prop.name} className={index < (selectedComponent.props?.length || 0) - 1 ? 'border-b border-gray-800/50' : ''}>
                                <td className="px-4 py-3 text-sm font-mono text-orange-400">{prop.name}</td>
                                <td className="px-4 py-3 text-sm font-mono text-blue-400">{prop.type}</td>
                                <td className="px-4 py-3 text-sm">
                                  {prop.required ? (
                                    <span className="text-green-400">✓</span>
                                  ) : (
                                    <span className="text-gray-500">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-300">{prop.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Variations */}
                  {selectedComponent.variations && selectedComponent.variations.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Variations
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedComponent.variations.map(variation => (
                          <div key={variation.name} className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                            <h4 className="font-medium mb-3">{variation.name}</h4>
                            {/* Render variation based on component type */}
                            {selectedComponent.id === 'auth-button' && (
                              <AuthButton {...variation.props}>{String(variation.props.children)}</AuthButton>
                            )}
                            {selectedComponent.id === 'loading-button' && (
                              <LoadingButton {...variation.props}>{String(variation.props.children)}</LoadingButton>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-8 border-t border-gray-800/50">
                    <div className="w-24">
                      {previousComponent ? (
                        <button
                          type="button"
                          onClick={goToPrevious}
                          className="group flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg transition-all"
                        >
                          <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                          <span className="text-sm font-medium">Previous</span>
                        </button>
                      ) : (
                        <div className="w-24" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{currentIndex + 1}</span>
                      <span>/</span>
                      <span>{components.length}</span>
                    </div>
                    
                    <div className="w-24 flex justify-end">
                      {nextComponent ? (
                        <button
                          type="button"
                          onClick={goToNext}
                          className="group flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-lg transition-all"
                        >
                          <span className="text-sm font-medium">Next</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      ) : (
                        <div className="w-24" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Default view when no component selected */
                <div className="text-center py-20">
                  <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">Select a Component</h3>
                  <p className="text-gray-500">Choose a component from the sidebar to view its documentation and demo</p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* FAQ/Troubleshooting Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50 bg-gray-950/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">FAQ & Troubleshooting</h2>
            
            {/* Next.js Configuration */}
            <div className="mb-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-400 mb-2">Next.js Configuration Required</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    If you encounter "Cannot find module" errors with bitcoin-auth dependencies, add this to your <code className="text-amber-300 bg-amber-500/20 px-1 rounded">next.config.ts</code>:
                  </p>
                  <pre className="text-xs bg-black/60 text-amber-300 p-4 rounded-lg border border-amber-500/30 overflow-x-auto">
{`const nextConfig = {
  serverExternalPackages: ['bsv-bap', '@bsv/sdk'],
  transpilePackages: ['bitcoin-auth', 'bitcoin-backup', 'bitcoin-image'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, net: false, tls: false,
      };
    }
    return config;
  },
};`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Additional FAQ items can be added here */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Need more help? Check out the{' '}
                <a href="https://github.com/bitcoin-auth/bigblocks/issues" className="text-orange-500 hover:text-orange-400">
                  GitHub Issues
                </a>
                {' '}or join our community.
              </p>
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
      </BitcoinQueryProvider>
    </BitcoinAuthProvider>
  );
}