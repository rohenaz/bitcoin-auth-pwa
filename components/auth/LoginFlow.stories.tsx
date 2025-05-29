import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import AuthLayout from './AuthLayout';
import PasswordInput from './PasswordInput';
import LoadingButton from './LoadingButton';
import ErrorDisplay from './ErrorDisplay';
import BackupImport from './BackupImport';
import WarningCard from './WarningCard';

// Mock component to demonstrate the login flow
function LoginFlowDemo() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasLocalBackup, setHasLocalBackup] = useState(true);
  const [showImportSuccess, setShowImportSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate async login
    setTimeout(() => {
      if (password === 'password123') {
        alert('Login successful! (In real app, would redirect to dashboard)');
      } else {
        setError('Incorrect password. Try "password123"');
      }
      setLoading(false);
    }, 1500);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setShowImportSuccess(true);
      setHasLocalBackup(true);
      setTimeout(() => setShowImportSuccess(false), 3000);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle={hasLocalBackup ? 'Enter your password to decrypt your wallet' : 'Import your backup to continue'}
    >
      <div className="space-y-4">
        <ErrorDisplay error={error} />
        
        {showImportSuccess && (
          <WarningCard
            title="Success"
            message="Backup imported successfully. You can now login."
            icon={
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            }
          />
        )}

        {hasLocalBackup ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              disabled={loading}
            />
            <LoadingButton
              loading={loading}
              loadingText="Unlocking..."
              disabled={!password}
            >
              Unlock Wallet
            </LoadingButton>
          </form>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No local backup found</p>
          </div>
        )}

        {!hasLocalBackup && (
          <BackupImport onImport={handleImport} />
        )}

        <div className="text-center text-sm text-gray-400 pt-4">
          <p>
            Need a new identity?{' '}
            <a href="#" className="text-blue-500 hover:text-blue-400">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

const meta = {
  title: 'Auth/Login Flow',
  component: LoginFlowDemo,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LoginFlowDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};