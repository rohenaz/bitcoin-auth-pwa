'use client';

import React, { useState } from 'react';
import {
  LoadingButton,
  PasswordInput,
  StepIndicator,
  Modal,
  ErrorDisplay,
  WarningCard
} from 'bitcoin-auth-ui';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { Palette } from 'lucide-react';

interface UIPrimitivesSectionProps {
  isClient: boolean;
}

export function UIPrimitivesSection({ isClient }: UIPrimitivesSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const mockSteps = [
    { id: '1', label: 'Account', status: (currentStep > 1 ? 'complete' : currentStep === 1 ? 'active' : 'pending') as 'complete' | 'active' | 'pending' },
    { id: '2', label: 'Security', status: (currentStep > 2 ? 'complete' : currentStep === 2 ? 'active' : 'pending') as 'complete' | 'active' | 'pending' },
    { id: '3', label: 'Backup', status: (currentStep > 3 ? 'complete' : currentStep === 3 ? 'active' : 'pending') as 'complete' | 'active' | 'pending' },
    { id: '4', label: 'Complete', status: (currentStep === 4 ? 'active' : 'pending') as 'complete' | 'active' | 'pending' }
  ];

  return (
    <section id="ui-primitives-demos" className="border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🧩 UI Primitives</h2>
          <p className="text-gray-400 text-lg">Essential building blocks for Bitcoin applications</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full">
            <Palette className="w-4 h-4" />
            <span className="text-sm font-medium">Reusable Components</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Interactive Components */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Interactive Components</h3>
              <p className="text-gray-400 mb-4">Buttons, inputs, and progress indicators</p>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-6">
              {/* Loading Button */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Loading Button</h4>
                {isClient ? (
                  <LoadingButton
                    loading={isLoading}
                    onClick={async () => {
                      setIsLoading(true);
                      await new Promise(resolve => setTimeout(resolve, 2000));
                      setIsLoading(false);
                    }}
                    variant="solid"
                    size="3"
                  >
                    Click to Load
                  </LoadingButton>
                ) : (
                  <div className="animate-pulse bg-gray-800 h-10 w-32 rounded-lg" />
                )}
              </div>

              {/* Password Input */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Password Input</h4>
                {isClient ? (
                  <PasswordInput
                    value={password}
                    onChange={(value) => setPassword(value)}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    className="w-full"
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-10 rounded-lg" />
                )}
              </div>

              {/* Step Indicator */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Step Indicator</h4>
                {isClient ? (
                  <>
                    <StepIndicator
                      steps={mockSteps}
                      variant="horizontal"
                      className="mb-4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm"
                      >
                        Next
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="animate-pulse bg-gray-800 h-16 rounded-lg" />
                )}
              </div>
            </div>
          </div>

          {/* Feedback Components */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Feedback Components</h3>
              <p className="text-gray-400 mb-4">Modals, errors, and warnings</p>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-6">
              {/* Modal */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Modal</h4>
                {isClient ? (
                  <>
                    <button
                      onClick={() => setShowModal(true)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                      Open Modal
                    </button>
                    {showModal && (
                      <Modal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        title="Example Modal"
                      >
                        <div className="space-y-4">
                          <p className="text-gray-300">Modal content goes here</p>
                          <button
                            onClick={() => setShowModal(false)}
                            className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                          >
                            Close Modal
                          </button>
                        </div>
                      </Modal>
                    )}
                  </>
                ) : (
                  <div className="animate-pulse bg-gray-800 h-10 w-32 rounded-lg" />
                )}
              </div>

              {/* Error Display */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Error Display</h4>
                {isClient ? (
                  <ErrorDisplay
                    error="Failed to connect to wallet. Please check your connection and try again."
                    className="w-full"
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-20 rounded-lg" />
                )}
              </div>

              {/* Warning Card */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Warning Card</h4>
                {isClient ? (
                  <WarningCard
                    title="Security Notice"
                    message="Never share your private keys or recovery phrase with anyone."
                    className="w-full"
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-24 rounded-lg" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TerminalCodeBlock
            code={`import { 
  LoadingButton,
  PasswordInput,
  StepIndicator 
} from 'bitcoin-auth-ui';

function MultiStepForm() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { id: '1', label: 'Account', status: 'complete' },
    { id: '2', label: 'Security', status: 'active' },
    { id: '3', label: 'Backup', status: 'pending' }
  ];
  
  return (
    <>
      <StepIndicator 
        steps={steps} 
        variant="default" 
      />
      
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password"
        strength={true}
      />
      
      <LoadingButton
        loading={loading}
        onClick={handleSubmit}
        variant="solid"
        size="3"
      >
        Continue
      </LoadingButton>
    </>
  );
}`}
            language="jsx"
            filename="MultiStepForm.jsx"
          />

          <TerminalCodeBlock
            code={`import { 
  Modal,
  ErrorDisplay,
  WarningCard 
} from 'bitcoin-auth-ui';

function FeedbackComponents() {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  
  return (
    <>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Transaction"
        description="Review the details below"
      >
        <TransactionDetails />
        <ConfirmButton />
      </Modal>
      
      {error && (
        <ErrorDisplay
          error={error.message}
          onDismiss={() => setError(null)}
          variant="destructive"
        />
      )}
      
      <WarningCard
        title="Backup Reminder"
        message="Remember to save your backup file"
        icon={<AlertIcon />}
        variant="warning"
      />
    </>
  );
}`}
            language="jsx"
            filename="FeedbackComponents.jsx"
          />
        </div>
      </div>
    </section>
  );
}