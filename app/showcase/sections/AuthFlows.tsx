'use client';

import React, { useState } from 'react';
import { 
  AuthFlowOrchestrator,
  LoginForm,
  SignupFlow,
  OAuthRestoreFlow,
  AuthButton,
  IdentityGeneration,
  PasswordInput,
  StepIndicator
} from 'bitcoin-auth-ui';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { Fingerprint } from 'lucide-react';

interface AuthFlowsSectionProps {
  isClient: boolean;
}

export function AuthFlowsSection({ isClient }: AuthFlowsSectionProps) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <section id="auth-demos" className="border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🔐 Authentication Flow Demos</h2>
          <p className="text-gray-400 text-lg">Complete authentication journeys with real Bitcoin keypairs</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full">
            <Fingerprint className="w-4 h-4" />
            <span className="text-sm font-medium">Bitcoin Keys ARE Your Identity</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Unified Auth Flow */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Unified Authentication</h3>
              <p className="text-gray-400 mb-4">All-in-one flow with smart mode detection</p>
              
              {/* Backend Requirements */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend Endpoints:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <code className="text-orange-400">/api/backup</code> - Store/retrieve encrypted backups</li>
                  <li>• <code className="text-orange-400">/api/users/create-from-backup</code> - Create user records</li>
                  <li>• <code className="text-orange-400">/api/bap</code> - Query BAP profiles</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                <p className="text-blue-400 text-sm">🔥 Live Demo: Try all authentication modes!</p>
              </div>
              
              {isClient ? (
                <AuthFlowOrchestrator
                  onSuccess={(backup) => {
                    console.log('Auth successful:', backup);
                  }}
                  onError={(error) => {
                    console.error('Auth error:', error);
                  }}
                />
              ) : (
                <div className="animate-pulse bg-gray-800 h-96 rounded-lg" />
              )}
            </div>
          </div>

          {/* Individual Flow Components */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Individual Components</h3>
              <p className="text-gray-400 mb-4">Mix and match authentication components</p>
              
              {/* Client-Side Info */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-green-400 font-semibold mb-2">✅ Some Client-Side Only</h4>
                <p className="text-sm text-gray-300">Identity generation & password components work offline</p>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <div className="space-y-6">
                {/* Login Form */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Login Form</h4>
                  {isClient ? (
                    <LoginForm
                      mode="signin"
                      onSuccess={(backup) => {
                        console.log('Login successful');
                      }}
                      onError={(error) => {
                        console.error('Login error:', error);
                      }}
                    />
                  ) : (
                    <div className="animate-pulse bg-gray-800 h-48 rounded-lg" />
                  )}
                </div>

                {/* Step Indicator */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Step Progress</h4>
                  <StepIndicator
                    steps={[
                      { id: '1', label: 'Identity', status: currentStep > 0 ? 'complete' : currentStep === 0 ? 'active' : 'pending' },
                      { id: '2', label: 'Password', status: currentStep > 1 ? 'complete' : currentStep === 1 ? 'active' : 'pending' },
                      { id: '3', label: 'Backup', status: currentStep > 2 ? 'complete' : currentStep === 2 ? 'active' : 'pending' },
                      { id: '4', label: 'Complete', status: currentStep > 3 ? 'complete' : currentStep === 3 ? 'active' : 'pending' }
                    ]}
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                      className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TerminalCodeBlock
            code={`import { AuthFlowOrchestrator } from 'bitcoin-auth-ui';

<AuthFlowOrchestrator
  mode="unified" // unified | signin | signup | restore | import
  onSuccess={(backup) => {
    // Store decrypted backup in session
    sessionStorage.setItem('decryptedBackup', JSON.stringify(backup));
    router.push('/dashboard');
  }}
  onError={(error) => {
    toast.error(error.message);
  }}
  onNavigate={(path) => {
    router.push(path);
  }}
/>`}
            language="jsx"
            filename="UnifiedAuth.jsx"
          />

          <TerminalCodeBlock
            code={`import { 
  SignupFlow, 
  LoginForm, 
  OAuthRestoreFlow 
} from 'bitcoin-auth-ui';

// Custom auth page with individual components
function AuthPage() {
  const [mode, setMode] = useState('signin');
  
  return (
    <>
      {mode === 'signin' && (
        <LoginForm
          mode="signin"
          onSuccess={handleAuth}
          onModeChange={setMode}
        />
      )}
      
      {mode === 'signup' && (
        <SignupFlow
          onComplete={handleAuth}
          onCancel={() => setMode('signin')}
        />
      )}
      
      {mode === 'restore' && (
        <OAuthRestoreFlow
          onSuccess={handleAuth}
          onCancel={() => setMode('signin')}
        />
      )}
    </>
  );
}`}
            language="jsx"
            filename="CustomAuth.jsx"
          />
        </div>
      </div>
    </section>
  );
}