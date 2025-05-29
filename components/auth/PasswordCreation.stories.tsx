import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import AuthLayout from './AuthLayout';
import PasswordInput from './PasswordInput';
import LoadingButton from './LoadingButton';
import ErrorDisplay from './ErrorDisplay';
import WarningCard from './WarningCard';

// Mock component to demonstrate password creation flow
function PasswordCreationDemo() {
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setStep('confirm');
  };

  const handleConfirmPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      alert('Password set successfully! (In real app, would continue with wallet creation)');
      setLoading(false);
    }, 1500);
  };

  if (step === 'confirm') {
    return (
      <AuthLayout
        title="Confirm Your Password"
        subtitle="Enter your password again to confirm"
      >
        <div className="space-y-4">
          <ErrorDisplay error={error} />
          
          <form onSubmit={handleConfirmPassword} className="space-y-4">
            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Re-enter your password"
              disabled={loading}
            />
            
            <LoadingButton
              loading={loading}
              loadingText="Creating wallet..."
              disabled={!confirmPassword}
            >
              Complete Setup
            </LoadingButton>
          </form>
          
          <button
            type="button"
            onClick={() => {
              setStep('create');
              setConfirmPassword('');
              setError('');
            }}
            className="w-full text-sm text-gray-400 hover:text-white"
          >
            ← Back to password creation
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set Your Password"
      subtitle="Create a password to encrypt your imported wallet"
    >
      <div className="space-y-4">
        <ErrorDisplay error={error} />
        
        <form onSubmit={handleCreatePassword} className="space-y-4">
          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="Create a strong password"
            showHint={true}
            autoComplete="new-password"
            disabled={loading}
          />
          
          <LoadingButton
            disabled={password.length < 8}
          >
            Continue
          </LoadingButton>
        </form>
        
        <WarningCard 
          message="This password cannot be recovered. If you forget it, you'll lose access to your Bitcoin identity."
        />
      </div>
    </AuthLayout>
  );
}

const meta = {
  title: 'Auth/Password Creation Flow',
  component: PasswordCreationDemo,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PasswordCreationDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};