'use client';

import React, { useState } from 'react';
import {
  AuthLayout,
  CenteredLayout,
  LoadingLayout,
  ErrorLayout,
  SuccessLayout
} from 'bigblocks';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { Layout } from 'lucide-react';

interface LayoutComponentsSectionProps {
  isClient: boolean;
}

export function LayoutComponentsSection({ isClient }: LayoutComponentsSectionProps) {
  const [selectedLayout, setSelectedLayout] = useState<'auth' | 'centered' | 'loading' | 'error' | 'success'>('auth');

  const renderSelectedLayout = () => {
    switch(selectedLayout) {
      case 'auth':
        return (
          <AuthLayout>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">Auth form content goes here</p>
              <button className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg">
                Sign In
              </button>
            </div>
          </AuthLayout>
        );
      case 'centered':
        return (
          <CenteredLayout>
            <div className="bg-gray-800 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Centered Content</h3>
              <p className="text-gray-300">This layout centers content vertically and horizontally</p>
            </div>
          </CenteredLayout>
        );
      case 'loading':
        return (
          <LoadingLayout 
            message="Processing your transaction..."
            showSpinner={true}
          />
        );
      case 'error':
        return (
          <ErrorLayout message="Transaction failed. Please check your balance and try again." />
        );
      case 'success':
        return (
          <SuccessLayout
            message="Transaction completed successfully!"
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">📐 Layout Components</h2>
          <p className="text-gray-400 text-lg">Pre-built layouts for common Bitcoin app screens</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-teal-500/10 text-teal-400 px-4 py-2 rounded-full">
            <Layout className="w-4 h-4" />
            <span className="text-sm font-medium">Full-Page Layouts</span>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto">
          {/* Layout Selector */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Select Layout Type</h3>
            <div className="flex flex-wrap gap-2">
              {(['auth', 'centered', 'loading', 'error', 'success'] as const).map((layout) => (
                <button
                  key={layout}
                  onClick={() => setSelectedLayout(layout)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedLayout === layout
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {layout.charAt(0).toUpperCase() + layout.slice(1)} Layout
                </button>
              ))}
            </div>
          </div>

          {/* Layout Preview */}
          <div className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden" style={{ height: '500px' }}>
            {isClient ? (
              <div className="h-full bg-gray-900">
                {renderSelectedLayout()}
              </div>
            ) : (
              <div className="animate-pulse bg-gray-800 h-full" />
            )}
          </div>

          {/* Layout Descriptions */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-2">Auth Layout</h4>
              <p className="text-gray-400 text-sm">
                Full-page authentication layout with optional header/footer and centered form area.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-2">Centered Layout</h4>
              <p className="text-gray-400 text-sm">
                Centers content both vertically and horizontally. Perfect for single actions.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-2">Loading Layout</h4>
              <p className="text-gray-400 text-sm">
                Full-screen loading state with spinner and customizable message.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-2">Error Layout</h4>
              <p className="text-gray-400 text-sm">
                Full-screen error display with optional retry button and error details.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h4 className="text-lg font-semibold mb-2">Success Layout</h4>
              <p className="text-gray-400 text-sm">
                Success state with transaction details and continue action.
              </p>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TerminalCodeBlock
            code={`import { 
  AuthLayout,
  LoginForm 
} from 'bigblocks';

function SignInPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your wallet"
      showHeader={true}
      showFooter={true}
    >
      <LoginForm
        mode="signin"
        onSuccess={(backup) => {
          router.push('/dashboard');
        }}
        onError={(error) => {
          toast.error(error.message);
        }}
      />
    </AuthLayout>
  );
}`}
            language="jsx"
            filename="SignInPage.jsx"
          />

          <TerminalCodeBlock
            code={`import { 
  LoadingLayout,
  ErrorLayout,
  SuccessLayout 
} from 'bigblocks';

function TransactionFlow() {
  const { status, error, txid } = useTransaction();
  
  if (status === 'loading') {
    return (
      <LoadingLayout 
        message="Broadcasting transaction..."
        showSpinner={true}
      />
    );
  }
  
  if (status === 'error') {
    return (
      <ErrorLayout
        error={error.message}
        onRetry={handleRetry}
        showRetry={true}
      />
    );
  }
  
  if (status === 'success') {
    return (
      <SuccessLayout
        message="Payment sent!"
        txid={txid}
        onContinue={() => router.push('/wallet')}
      />
    );
  }
  
  return <TransactionForm />;
}`}
            language="jsx"
            filename="TransactionFlow.jsx"
          />
        </div>
      </div>
    </section>
  );
}