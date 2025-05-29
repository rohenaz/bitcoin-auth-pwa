'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
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
  Modal,
  LoadingButton,
  PasswordInput,
  ErrorDisplay,
  WarningCard,
  type Step
} from 'bitcoin-auth-ui';
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
  Copy,
  Check,
  Filter
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
  'Code2': Code2
};

export default function ShowcasePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<ComponentExample | null>(components[0] || null);
  const [copiedCode, setCopiedCode] = useState<string>('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Filter components based on category and search
  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Group components by category
  const groupedComponents = useMemo(() => {
    const groups: Record<string, ComponentExample[]> = {};
    filteredComponents.forEach(component => {
      if (!groups[component.category]) {
        groups[component.category] = [];
      }
      groups[component.category]!.push(component);
    });
    return groups;
  }, [filteredComponents]);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
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
                Bitcoin Auth UI
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
                Beautiful, accessible React components for Bitcoin authentication. 
                Built with TypeScript, TailwindCSS, and Framer Motion.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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

              {/* Quick Access */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                <button
                  onClick={() => {
                    const authButton = components.find(c => c.id === 'auth-button');
                    if (authButton) setSelectedComponent(authButton);
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-800 hover:border-orange-500/50 rounded-lg transition-all group"
                >
                  <div className="text-orange-500 mb-2">
                    <Zap className="w-6 h-6 mx-auto" />
                  </div>
                  <div className="text-sm font-medium">AuthButton</div>
                  <div className="text-xs text-gray-500 mt-1">Drop-in auth</div>
                </button>
                <button
                  onClick={() => {
                    const flow = components.find(c => c.id === 'auth-flow-orchestrator');
                    if (flow) setSelectedComponent(flow);
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-800 hover:border-purple-500/50 rounded-lg transition-all group"
                >
                  <div className="text-purple-500 mb-2">
                    <Workflow className="w-6 h-6 mx-auto" />
                  </div>
                  <div className="text-sm font-medium">Auth Flows</div>
                  <div className="text-xs text-gray-500 mt-1">Complete flows</div>
                </button>
                <button
                  onClick={() => {
                    const oauth = components.find(c => c.id === 'oauth-providers');
                    if (oauth) setSelectedComponent(oauth);
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 rounded-lg transition-all group"
                >
                  <div className="text-blue-500 mb-2">
                    <Globe className="w-6 h-6 mx-auto" />
                  </div>
                  <div className="text-sm font-medium">OAuth</div>
                  <div className="text-xs text-gray-500 mt-1">Cloud backup</div>
                </button>
                <button
                  onClick={() => {
                    const hook = components.find(c => c.id === 'use-bitcoin-auth');
                    if (hook) setSelectedComponent(hook);
                  }}
                  className="p-4 bg-gray-900/50 border border-gray-800 hover:border-green-500/50 rounded-lg transition-all group"
                >
                  <div className="text-green-500 mb-2">
                    <Code2 className="w-6 h-6 mx-auto" />
                  </div>
                  <div className="text-sm font-medium">Hooks</div>
                  <div className="text-xs text-gray-500 mt-1">React hooks</div>
                </button>
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

              {/* Categories */}
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>All Components</span>
                    <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                      {components.length}
                    </span>
                  </div>
                </button>

                {componentCategories.map(category => {
                  const Icon = categoryIcons[category.icon] || Package;
                  const count = components.filter(c => c.category === category.id).length;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-orange-500/10 text-orange-500'
                          : 'text-gray-400 hover:text-white hover:bg-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{category.name}</span>
                        </div>
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                          {count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Component List */}
              <div className="mt-8 space-y-6">
                {Object.entries(groupedComponents).map(([categoryId, categoryComponents]) => {
                  const category = componentCategories.find(c => c.id === categoryId);
                  if (!category) return null;

                  return (
                    <div key={categoryId}>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        {category.name}
                      </h3>
                      <div className="space-y-1">
                        {categoryComponents.map(component => (
                          <button
                            key={component.id}
                            onClick={() => setSelectedComponent(component)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                              selectedComponent?.id === component.id
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{component.name}</span>
                              <ChevronRight className="w-3 h-3" />
                            </div>
                          </button>
                        ))}
                      </div>
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
                    <p className="text-gray-400 text-lg">{selectedComponent.description}</p>
                  </div>

                  {/* Import Statement */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Installation
                      </h3>
                      <button
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
                      {selectedComponent.id === 'login-form' && (
                        <LoginForm 
                          mode="signin"
                          onSuccess={() => console.log('Demo success')}
                          onError={() => console.log('Demo error')}
                        />
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
                      )}
                      {selectedComponent.id === 'yours-wallet-connector' && (
                        <YoursWalletConnector
                          onSuccess={(result) => console.log('Yours Wallet connected:', result)}
                          onError={(error) => console.error('Yours Wallet error:', error)}
                        />
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
                      {/* Hook examples show code only since they can't be demoed visually */}
                      {selectedComponent.category === 'hooks' && (
                        <div className="text-center py-8">
                          <Code2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">Hooks are demonstrated through code examples only.</p>
                          <p className="text-sm text-gray-500 mt-2">See the usage example below for implementation details.</p>
                        </div>
                      )}
                      {/* Layout components need special handling */}
                      {selectedComponent.category === 'layouts' && (
                        <div className="text-center py-8">
                          <Layout className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400">Layout components wrap entire pages.</p>
                          <p className="text-sm text-gray-500 mt-2">See the code example for proper usage.</p>
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
                              <tr key={prop.name} className={index < selectedComponent.props!.length - 1 ? 'border-b border-gray-800/50' : ''}>
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
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Variations
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedComponent.variations.map(variation => (
                          <div key={variation.name} className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                            <h4 className="font-medium mb-3">{variation.name}</h4>
                            {/* Render variation based on component type */}
                            {selectedComponent.id === 'auth-button' && (
                              <AuthButton {...variation.props}>{variation.props.children as React.ReactNode}</AuthButton>
                            )}
                            {selectedComponent.id === 'loading-button' && (
                              <LoadingButton {...variation.props}>{variation.props.children as React.ReactNode}</LoadingButton>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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