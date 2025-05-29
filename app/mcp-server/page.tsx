'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Code2, Cpu, RefreshCw, CheckCircle2, ArrowRight, Zap, Layout, Palette } from 'lucide-react';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { 
  BitcoinAuthProvider,
  AuthFlowOrchestrator,
  LoginForm,
  OAuthProviders,
  HandCashConnector,
  YoursWalletConnector
} from 'bitcoin-auth-ui';

type LayoutVariant = {
  id: string;
  name: string;
  description: string;
  color: string;
  component: React.ReactNode;
};

export default function MCPServerPage() {
  const [selectedLayout, setSelectedLayout] = useState<string>('wallet');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLayouts, setGeneratedLayouts] = useState<LayoutVariant[]>([]);

  // Predefined layout examples (in real implementation, these would be AI-generated)
  const layoutVariants: LayoutVariant[] = [
    {
      id: 'wallet',
      name: 'Wallet Dashboard',
      description: 'Full-featured wallet with balance display and transaction history',
      color: 'from-green-500 to-emerald-600',
      component: (
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Balance</h3>
            <p className="text-3xl font-mono">0.00125400 BSV</p>
            <p className="text-sm text-gray-400 mt-1">≈ $42.50 USD</p>
          </div>
          <LoginForm mode="signin" onSuccess={() => {}} />
        </div>
      )
    },
    {
      id: 'exchange',
      name: 'Exchange Interface',
      description: 'Trading platform with OAuth integration and wallet connections',
      color: 'from-blue-500 to-indigo-600',
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="text-sm text-gray-400">Buy BSV</h4>
              <p className="text-2xl font-bold text-green-400">$33.82</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <h4 className="text-sm text-gray-400">Sell BSV</h4>
              <p className="text-2xl font-bold text-red-400">$33.65</p>
            </div>
          </div>
          <OAuthProviders onProviderClick={() => {}} />
          <div className="flex gap-4">
            <HandCashConnector 
              config={{ appId: "demo", appSecret: "demo", environment: "iae" }}
              className="flex-1"
            />
            <YoursWalletConnector className="flex-1" />
          </div>
        </div>
      )
    },
    {
      id: 'social',
      name: 'Social Platform',
      description: 'Decentralized social app with Bitcoin identity authentication',
      color: 'from-purple-500 to-pink-600',
      component: (
        <div className="space-y-6">
          <AuthFlowOrchestrator
            flowType="unified"
            enableOAuth={true}
            enableDeviceLink={true}
            onSuccess={() => {}}
          />
          <div className="bg-gray-900 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Connected as</p>
            <p className="font-mono text-xs">1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</p>
          </div>
        </div>
      )
    }
  ];

  const generateLayouts = async () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratedLayouts(layoutVariants);
    setIsGenerating(false);
  };

  const selectedVariant = [...layoutVariants, ...generatedLayouts].find(v => v.id === selectedLayout);

  const installCommand = `bunx bsv-mcp add bitcoin-auth-ui`;
  
  const usageExample = `// Ask your AI assistant to generate a Bitcoin app layout
// "Create a Bitcoin wallet dashboard with authentication"

import { generateBitcoinLayout } from 'bsv-mcp';

const layout = await generateBitcoinLayout({
  type: 'wallet',
  features: ['auth', 'balance', 'transactions'],
  theme: 'dark'
});

// The AI will generate a complete component using bitcoin-auth-ui`;

  const configExample = `// .mcp/config.json
{
  "tools": {
    "bsv-mcp": {
      "command": "bunx bsv-mcp@latest",
      "env": {
        "BSV_NETWORK": "mainnet"
      }
    }
  }
}`;

  return (
    <BitcoinAuthProvider config={{ apiUrl: '/api' }}>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation Header */}
        <header className="border-b border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <nav className="flex items-center space-x-8">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/showcase" className="text-gray-400 hover:text-white transition-colors">
                  Showcase
                </Link>
                <Link href="/components" className="text-gray-400 hover:text-white transition-colors">
                  Components
                </Link>
                <Link href="/mcp-server" className="text-white">
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
        <section className="relative overflow-hidden border-b border-gray-900">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-500 px-4 py-2 rounded-full mb-6">
                <Cpu className="w-4 h-4" />
                <span className="text-sm font-medium">Model Context Protocol Server</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                BSV-MCP + Bitcoin Auth UI
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
                AI-powered Bitcoin app generation. Get instant layouts and components 
                tailored to your specific use case, all powered by MCP.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <a
                  href="https://github.com/rohenaz/bsv-mcp"
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  View BSV-MCP
                  <ArrowRight className="w-4 h-4" />
                </a>
                <code className="px-6 py-3 bg-gray-900 rounded-lg text-purple-400 font-mono">
                  {installCommand}
                </code>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-1">AI-Generated Layouts</h3>
                  <p className="text-sm text-gray-500">Instant Bitcoin app scaffolding</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-1">MCP Integration</h3>
                  <p className="text-sm text-gray-500">Works with Claude, Cursor, VS Code</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Code2 className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-1">Production Ready</h3>
                  <p className="text-sm text-gray-500">Best practices built-in</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Layout Generator Demo */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-full mb-4">
                <Layout className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">AI Layout Generator</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">Generate Bitcoin App Layouts</h2>
              <p className="text-xl text-gray-400">
                AI creates tailored layouts for your specific Bitcoin use case
              </p>
            </div>

            <div className="mb-12 text-center">
              <button
                onClick={generateLayouts}
                disabled={isGenerating}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Generating Layouts...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate 3 Layout Variations
                  </>
                )}
              </button>
            </div>

            {(layoutVariants.length > 0 || generatedLayouts.length > 0) && (
              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                {[...layoutVariants, ...generatedLayouts].map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedLayout(variant.id)}
                    className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                      selectedLayout === variant.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-800 hover:border-gray-700 bg-gray-900/50'
                    }`}
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${variant.color} rounded-t-xl`} />
                    
                    <h3 className="text-xl font-bold mb-2">{variant.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{variant.description}</p>
                    
                    {selectedLayout === variant.id && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="w-5 h-5 text-purple-500" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Palette className="w-3 h-3" />
                      <span>Customizable theme</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedVariant && (
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold mb-6">Preview: {selectedVariant.name}</h3>
                  <div className="bg-gray-950 border border-gray-800 rounded-xl p-8">
                    {selectedVariant.component}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold mb-6">Generated Code</h3>
                  <TerminalCodeBlock
                    code={`import { ${
                      selectedVariant.id === 'wallet' ? 'LoginForm' :
                      selectedVariant.id === 'exchange' ? 'OAuthProviders, HandCashConnector, YoursWalletConnector' :
                      'AuthFlowOrchestrator'
                    } } from 'bitcoin-auth-ui';

export default function ${selectedVariant.name.replace(/\s+/g, '')}() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">${selectedVariant.name}</h1>
      
      ${selectedVariant.id === 'wallet' ? `{/* Wallet balance display */}
      <div className="bg-gray-900 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Balance</h3>
        <p className="text-3xl font-mono">0.00125400 BSV</p>
      </div>
      
      {/* Authentication */}
      <LoginForm 
        mode="signin"
        onSuccess={handleAuth}
      />` : selectedVariant.id === 'exchange' ? `{/* Market data */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <PriceCard title="Buy" price="$33.82" />
        <PriceCard title="Sell" price="$33.65" />
      </div>
      
      {/* OAuth providers */}
      <OAuthProviders onProviderClick={handleOAuth} />
      
      {/* Wallet connections */}
      <div className="flex gap-4 mt-8">
        <HandCashConnector config={handcashConfig} />
        <YoursWalletConnector />
      </div>` : `{/* Complete auth flow */}
      <AuthFlowOrchestrator
        flowType="unified"
        enableOAuth={true}
        enableDeviceLink={true}
        onSuccess={handleAuthSuccess}
      />
      
      {/* User info */}
      <UserProfile />`}
    </div>
  );
}`}
                    language="jsx"
                    filename={`${selectedVariant.name.replace(/\s+/g, '')}.jsx`}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950 border-t border-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">How BSV-MCP Works</h2>
              <p className="text-xl text-gray-400">
                Integrate AI-powered Bitcoin development into your workflow
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-black border border-gray-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-500">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Install MCP Server</h3>
                <p className="text-gray-400 mb-4">
                  Add BSV-MCP to your AI development environment
                </p>
                <TerminalCodeBlock
                  code="bunx bsv-mcp add bitcoin-auth-ui"
                  language="bash"
                  filename="terminal"
                />
              </div>

              <div className="bg-black border border-gray-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-500">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Configure Your Project</h3>
                <p className="text-gray-400 mb-4">
                  Set up MCP configuration for your Bitcoin app
                </p>
                <TerminalCodeBlock
                  code={configExample}
                  language="json"
                  filename=".mcp/config.json"
                />
              </div>

              <div className="bg-black border border-gray-800 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-500">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Generate Components</h3>
                <p className="text-gray-400 mb-4">
                  Let AI create perfect Bitcoin app layouts
                </p>
                <TerminalCodeBlock
                  code={usageExample}
                  language="javascript"
                  filename="generateApp.js"
                />
              </div>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6">Supported AI Environments</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Claude</p>
                    <p className="text-sm text-gray-400">Native MCP support</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Cursor</p>
                    <p className="text-sm text-gray-400">Built-in integration</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">VS Code</p>
                    <p className="text-sm text-gray-400">Via Continue.dev</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Windsurf</p>
                    <p className="text-sm text-gray-400">Full support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Start Building Bitcoin Apps with AI
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              BSV-MCP + Bitcoin Auth UI = The fastest way to build Bitcoin applications
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://github.com/rohenaz/bsv-mcp"
                className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Get Started with BSV-MCP
              </a>
              <a
                href="/showcase"
                className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                View Component Library
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-900">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400">
              Built with ❤️ by the <a href="https://1satordinals.com" className="text-purple-500 hover:text-purple-400">1Sat</a> team. MIT Licensed.
            </p>
          </div>
        </footer>
      </div>
    </BitcoinAuthProvider>
  );
}