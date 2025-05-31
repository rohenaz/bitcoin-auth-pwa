'use client';

import React, { useState } from 'react';
import {
  AuthFlowOrchestrator,
  LoginForm,
  // TODO: Re-enable PostButton when bigblocks v0.2.3 exports are fixed
  // PostButton,
  SendBSVButton,
  LoadingButton,
  StepIndicator,
  ErrorDisplay,
  WarningCard
} from 'bigblocks';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { Palette, Sparkles, Eye } from 'lucide-react';

interface ThemeShowcaseSectionProps {
  isClient: boolean;
}

const BITCOIN_THEMES = [
  { id: 'orange', name: 'Bitcoin Orange', color: 'bg-orange-500' },
  { id: 'gold', name: 'Digital Gold', color: 'bg-yellow-500' },
  { id: 'green', name: 'Crypto Green', color: 'bg-green-500' },
  { id: 'blue', name: 'Lightning Blue', color: 'bg-blue-500' },
  { id: 'purple', name: 'Satoshi Purple', color: 'bg-purple-500' },
  { id: 'red', name: 'Mining Red', color: 'bg-red-500' },
  { id: 'gray', name: 'Steel Gray', color: 'bg-gray-500' },
  { id: 'cyan', name: 'Neon Cyan', color: 'bg-cyan-500' }
] as const;

export function ThemeShowcaseSection({ isClient }: ThemeShowcaseSectionProps) {
  const [selectedTheme, setSelectedTheme] = useState<'orange' | 'gold' | 'green' | 'blue' | 'purple' | 'red' | 'gray' | 'cyan'>('orange');
  const [appearance, setAppearance] = useState<'light' | 'dark'>('dark');

  const mockSteps = [
    { id: '1', label: 'Connect', status: 'complete' as const },
    { id: '2', label: 'Verify', status: 'active' as const },
    { id: '3', label: 'Complete', status: 'pending' as const }
  ];

  return (
    <section className="border-b border-gray-800/50 bg-gradient-to-b from-purple-900/10 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🎨 Live Theme Showcase</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Change the theme below and watch ALL components instantly update their colors. 
            This demonstrates the power of bigblocks's unified theming system.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">8 Bitcoin Color Presets</span>
          </div>
        </div>

        {/* Theme Controls */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-semibold">Live Theme Controls</h3>
              <div className="flex-1" />
              <div className="text-sm text-gray-400">
                Choose any theme → See instant updates
              </div>
            </div>

            {/* Bitcoin Theme Selector */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Bitcoin Theme Preset</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {BITCOIN_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedTheme === theme.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${theme.color}`} />
                        <span className="text-sm font-medium">{theme.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Appearance Toggle */}
              <div>
                <label className="block text-sm font-medium mb-3">Appearance</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAppearance('dark')}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      appearance === 'dark'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    🌙 Dark
                  </button>
                  <button
                    onClick={() => setAppearance('light')}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      appearance === 'light'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    ☀️ Light
                  </button>
                </div>
              </div>
            </div>

            {/* Current Theme Code */}
            <div className="mt-6">
              <TerminalCodeBlock
                code={`<BitcoinThemeProvider 
  bitcoinTheme="${selectedTheme}" 
  appearance="${appearance}"
  radius="medium"
  scaling="100%"
>
  {children}
</BitcoinThemeProvider>`}
                language="tsx"
                filename="Your Provider Setup"
              />
            </div>
          </div>
        </div>

        {/* Live Component Demos */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
              <Eye className="w-6 h-6" />
              Watch Components Update Live
            </h3>
            <p className="text-gray-400">
              All these components automatically inherit the theme you selected above
            </p>
          </div>

          {/* Simulated Theme Provider Wrapper */}
          <div 
            className="space-y-8"
            style={{
              // This is just for visual demo - in real usage the BitcoinThemeProvider handles this
              '--bitcoin-primary': selectedTheme === 'orange' ? '#f97316' :
                                  selectedTheme === 'gold' ? '#eab308' :
                                  selectedTheme === 'green' ? '#22c55e' :
                                  selectedTheme === 'blue' ? '#3b82f6' :
                                  selectedTheme === 'purple' ? '#a855f7' :
                                  selectedTheme === 'red' ? '#ef4444' :
                                  selectedTheme === 'gray' ? '#6b7280' :
                                  '#06b6d4'
            } as React.CSSProperties}
          >
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Auth Components */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Authentication Components</h4>
                <div className="space-y-4">
                  {isClient ? (
                    <>
                      <LoginForm
                        mode="signin"
                        onSuccess={() => console.log('Login demo')}
                        onError={() => console.log('Login error demo')}
                      />
                      <div className="pt-4 border-t border-gray-700">
                        <StepIndicator
                          steps={mockSteps}
                          variant="horizontal"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="animate-pulse bg-gray-800 h-64 rounded-lg" />
                  )}
                </div>
              </div>

              {/* Action Components */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Action Components</h4>
                <div className="space-y-4">
                  {isClient ? (
                    <>
                      <div className="space-y-3">
                        {/* TODO: Re-enable PostButton when bigblocks v0.2.3 exports are fixed
                        <PostButton
                          onPost={(post) => console.log('Demo post:', post)}
                        >
                          Share Your Thoughts
                        </PostButton> */}
                        <div className="text-gray-500 text-center py-3">
                          PostButton component temporarily unavailable
                        </div>
                        
                        <SendBSVButton
                          onSuccess={(result) => console.log('Demo send:', result)}
                          onError={(error) => console.log('Demo error:', error)}
                        />
                        
                        <LoadingButton
                          loading={false}
                          onClick={() => console.log('Demo click')}
                          variant="solid"
                          size="3"
                        >
                          Loading Button Demo
                        </LoadingButton>
                      </div>
                    </>
                  ) : (
                    <div className="animate-pulse bg-gray-800 h-32 rounded-lg" />
                  )}
                </div>
              </div>

              {/* Feedback Components */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Feedback Components</h4>
                <div className="space-y-4">
                  {isClient ? (
                    <>
                      <ErrorDisplay
                        error="This is a demo error message that inherits the theme colors"
                      />
                      <WarningCard
                        title="Theme Demo Warning"
                        message="Notice how this warning adapts to your selected theme!"
                      />
                    </>
                  ) : (
                    <div className="animate-pulse bg-gray-800 h-24 rounded-lg" />
                  )}
                </div>
              </div>

              {/* Full Auth Flow */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Complete Auth Flow</h4>
                {isClient ? (
                  <AuthFlowOrchestrator
                    onSuccess={(backup) => console.log('Demo auth success:', backup)}
                    onError={(error) => console.log('Demo auth error:', error)}
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-64 rounded-lg" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-6">🎯 How to Implement This in Your App</h3>
            
            <div className="space-y-6">
              {/* Step 1 */}
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-sm">1</span>
                  Critical: CSS Import Location
                </h4>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                  <p className="text-red-400 text-sm font-semibold mb-2">
                    ⚠️ MOST COMMON MISTAKE: Importing CSS in wrong location
                  </p>
                  <p className="text-red-300 text-sm">
                    CSS MUST be imported in globals.css as the FIRST LINE, never in components
                  </p>
                </div>
                
                <TerminalCodeBlock
                  code={`/* app/globals.css - FIRST LINE */
@import '@radix-ui/themes/styles.css';

/* Then your other imports */
@tailwind base;
@tailwind components;
@tailwind utilities;`}
                  language="css"
                  filename="app/globals.css"
                />
              </div>

              {/* Step 2 */}
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-sm">2</span>
                  Provider Setup
                </h4>
                <TerminalCodeBlock
                  code={`// components/providers.tsx
'use client'
import { BitcoinThemeProvider } from 'bigblocks'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BitcoinThemeProvider 
      bitcoinTheme="${selectedTheme}" 
      appearance="${appearance}"
      radius="medium"
      scaling="100%"
    >
      {children}
    </BitcoinThemeProvider>
  )
}`}
                  language="tsx"
                  filename="components/providers.tsx"
                />
              </div>

              {/* Step 3 */}
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-sm">3</span>
                  Layout Integration
                </h4>
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
              </div>

              {/* Dynamic Theme Changing */}
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-sm">4</span>
                  Dynamic Theme Switching (Advanced)
                </h4>
                <TerminalCodeBlock
                  code={`// For dynamic theme switching, use state management
'use client'
import { useState } from 'react'
import { BitcoinThemeProvider } from 'bigblocks'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('${selectedTheme}')
  
  return (
    <BitcoinThemeProvider bitcoinTheme={theme} appearance="${appearance}">
      {/* Theme switcher */}
      <div className="theme-controls">
        {['orange', 'gold', 'green', 'blue'].map(t => (
          <button key={t} onClick={() => setTheme(t)}>
            {t}
          </button>
        ))}
      </div>
      {children}
    </BitcoinThemeProvider>
  )
}`}
                  language="tsx"
                  filename="Advanced: Dynamic Themes"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Theme Benefits */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">✨ Why Bitcoin Theme System is Powerful</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">🎯 Instant Consistency</h4>
                <p className="text-gray-300">Change one theme prop, ALL components update instantly</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">🎨 Bitcoin-Optimized</h4>
                <p className="text-gray-300">8 carefully curated color schemes perfect for Bitcoin apps</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">🌙 Light/Dark Ready</h4>
                <p className="text-gray-300">Every theme works perfectly in both light and dark modes</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">⚡ Zero Configuration</h4>
                <p className="text-gray-300">No CSS variables to manage, just change the theme prop</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}