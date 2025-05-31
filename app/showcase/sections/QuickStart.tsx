'use client';

import React, { useState } from 'react';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { CheckCircle, AlertTriangle, ExternalLink, Copy, Book } from 'lucide-react';

interface QuickStartSectionProps {
  isClient: boolean;
}

export function QuickStartSection({ isClient }: QuickStartSectionProps) {
  const [activeTab, setActiveTab] = useState<'nextjs' | 'react' | 'troubleshooting'>('nextjs');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  return (
    <section id="quick-start" className="border-b border-gray-800/50 bg-gradient-to-b from-orange-900/10 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🚀 Quick Start Guide</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Get bitcoin-auth-ui running in your project with zero configuration issues. 
            Follow this guide to avoid common pitfalls and get started quickly.
          </p>
        </div>

        {/* Framework Tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex border-b border-gray-700">
            {(['nextjs', 'react', 'troubleshooting'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-orange-400 border-b-2 border-orange-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab === 'nextjs' && '⚡ Next.js 15'}
                {tab === 'react' && '⚛️ React 18/19'}
                {tab === 'troubleshooting' && '🔧 Troubleshooting'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'nextjs' && (
            <div className="space-y-8">
              {/* Step 1: Installation */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white rounded-full text-sm font-bold">1</span>
                  Installation
                </h3>
                <div className="space-y-4">
                  <TerminalCodeBlock
                    code="npm install bitcoin-auth-ui @radix-ui/themes"
                    language="bash"
                    filename="Terminal"
                  />
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-400 text-sm">
                      💡 <strong>Important:</strong> bitcoin-auth-ui requires @radix-ui/themes for styling. 
                      Both packages must be installed together.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: CSS Setup */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white rounded-full text-sm font-bold">2</span>
                  CSS Setup (CRITICAL)
                </h3>
                <div className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      CRITICAL: CSS Import Location
                    </h4>
                    <p className="text-red-300 text-sm mb-3">
                      ❌ <strong>DON'T</strong> import in components - causes hydration issues and broken styles
                    </p>
                    <p className="text-green-300 text-sm">
                      ✅ <strong>ALWAYS</strong> import in globals.css as the FIRST LINE
                    </p>
                  </div>
                  
                  <TerminalCodeBlock
                    code={`/* app/globals.css - FIRST LINE */
@import '@radix-ui/themes/styles.css';

/* Then your other imports */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom styles */`}
                    language="css"
                    filename="app/globals.css"
                  />
                </div>
              </div>

              {/* Step 3: Provider Setup */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white rounded-full text-sm font-bold">3</span>
                  Provider Setup
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-300">Create a providers component with the exact hierarchy:</p>
                  
                  <TerminalCodeBlock
                    code={`// components/providers.tsx - EXACT TEMPLATE
'use client'

import { BitcoinThemeProvider } from 'bitcoin-auth-ui'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BitcoinThemeProvider 
      bitcoinTheme="orange" 
      appearance="dark"
      radius="medium"
      scaling="100%"
    >
      {/* Your other providers (SessionProvider, etc.) */}
      {children}
    </BitcoinThemeProvider>
  )
}`}
                    language="tsx"
                    filename="components/providers.tsx"
                  />

                  <TerminalCodeBlock
                    code={`// app/layout.tsx
import { Providers } from '@/components/providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}`}
                    language="tsx"
                    filename="app/layout.tsx"
                  />

                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ <strong>Note:</strong> The <code>suppressHydrationWarning</code> in the html tag 
                      prevents theme-related hydration mismatches.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4: First Component */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 bg-orange-600 text-white rounded-full text-sm font-bold">4</span>
                  Test Your Setup
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-300">Add a simple component to verify everything works:</p>
                  
                  <TerminalCodeBlock
                    code={`// app/page.tsx
import { AuthFlowOrchestrator } from 'bitcoin-auth-ui'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <AuthFlowOrchestrator
          onSuccess={(backup) => {
            console.log('Authentication successful:', backup)
          }}
          onError={(error) => {
            console.error('Authentication error:', error)
          }}
        />
      </div>
    </div>
  )
}`}
                    language="tsx"
                    filename="app/page.tsx"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'react' && (
            <div className="space-y-6">
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">React 18/19 Setup</h3>
                <div className="space-y-4">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-blue-400 text-sm">
                      💡 bitcoin-auth-ui works with both React 18 and 19. For React 19, you may need to isolate 
                      the BitcoinThemeProvider to specific pages if you encounter compatibility issues.
                    </p>
                  </div>

                  <TerminalCodeBlock
                    code={`// index.css - FIRST LINE
@import '@radix-ui/themes/styles.css';

/* Your other styles */`}
                    language="css"
                    filename="src/index.css"
                  />

                  <TerminalCodeBlock
                    code={`// App.tsx
import { BitcoinThemeProvider } from 'bitcoin-auth-ui'
import './index.css'

function App() {
  return (
    <BitcoinThemeProvider bitcoinTheme="orange" appearance="dark">
      {/* Your app content */}
    </BitcoinThemeProvider>
  )
}

export default App`}
                    language="tsx"
                    filename="src/App.tsx"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'troubleshooting' && (
            <div className="space-y-6">
              {/* Common Errors */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4">Common Issues & Solutions</h3>
                <div className="space-y-6">
                  
                  {/* Error 1 */}
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="text-red-400 font-semibold mb-2">Error: "createContext is not a function"</h4>
                    <p className="text-gray-300 text-sm mb-2"><strong>Cause:</strong> React version incompatibility</p>
                    <p className="text-green-300 text-sm mb-3"><strong>Solution:</strong> Use React 18.x or isolate BitcoinThemeProvider</p>
                    <TerminalCodeBlock
                      code="npm install react@18 react-dom@18"
                      language="bash"
                      filename="Fix for React 19 issues"
                    />
                  </div>

                  {/* Error 2 */}
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="text-red-400 font-semibold mb-2">Error: "Styles not loading" / Components look broken</h4>
                    <p className="text-gray-300 text-sm mb-2"><strong>Cause:</strong> CSS import in wrong location</p>
                    <p className="text-green-300 text-sm"><strong>Solution:</strong> Move @radix-ui/themes/styles.css import to globals.css first line</p>
                  </div>

                  {/* Error 3 */}
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="text-red-400 font-semibold mb-2">Error: "Hydration mismatch"</h4>
                    <p className="text-gray-300 text-sm mb-2"><strong>Cause:</strong> Server/client theme mismatch</p>
                    <p className="text-green-300 text-sm"><strong>Solution:</strong> Add suppressHydrationWarning to html tag</p>
                  </div>

                  {/* Error 4 */}
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="text-red-400 font-semibold mb-2">Error: "Module not found" for components</h4>
                    <p className="text-gray-300 text-sm mb-2"><strong>Cause:</strong> Missing dependencies or wrong import paths</p>
                    <p className="text-green-300 text-sm"><strong>Solution:</strong> Ensure both bitcoin-auth-ui and @radix-ui/themes are installed</p>
                  </div>
                </div>
              </div>

              {/* Working Example */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Book className="w-6 h-6" />
                  Working Example Repository
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-300">
                    The <strong>bitcoin-auth-pwa</strong> repository is the canonical working example. 
                    Check these files for exact setup:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a
                      href="https://github.com/bitcoin-auth/bitcoin-auth-pwa/blob/main/app/providers.tsx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">app/providers.tsx</span>
                    </a>
                    <a
                      href="https://github.com/bitcoin-auth/bitcoin-auth-pwa/blob/main/app/globals.css"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">app/globals.css</span>
                    </a>
                    <a
                      href="https://github.com/bitcoin-auth/bitcoin-auth-pwa/blob/main/app/layout.tsx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">app/layout.tsx</span>
                    </a>
                    <a
                      href="https://github.com/bitcoin-auth/bitcoin-auth-pwa/blob/main/package.json"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">package.json</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Integration Checklist */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Integration Checklist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Radix CSS imported in globals.css (first line)',
                'BitcoinThemeProvider wrapping app',
                'React 18.x (or isolated provider for 19.x)',
                'suppressHydrationWarning in <html> tag',
                'Test with AuthFlowOrchestrator component',
                'No CSS imports in component files',
                'Both bitcoin-auth-ui and @radix-ui/themes installed',
                'Provider hierarchy matches template'
              ].map((item, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedItems[item] || false}
                    onChange={() => toggleCheck(item)}
                    className="rounded border-gray-600 bg-gray-800 text-orange-500 focus:ring-orange-500"
                  />
                  <span className={`text-sm ${checkedItems[item] ? 'text-green-400 line-through' : 'text-gray-300'}`}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Provider Requirements */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-6">Provider Requirements by Component</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Needs BitcoinThemeProvider
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• AuthFlowOrchestrator</li>
                  <li>• SignupFlow, LoginForm</li>
                  <li>• OAuthProviders</li>
                  <li>• All UI components</li>
                  <li>• Layout components</li>
                </ul>
              </div>
              <div>
                <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Works Without Providers
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• useBitcoinAuth hook</li>
                  <li>• Utility functions</li>
                  <li>• Type definitions</li>
                  <li>• AuthManager class</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}