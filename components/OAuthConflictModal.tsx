'use client';

import { useState } from 'react';
import Modal from './Modal';
import { decryptBackup, type BapMasterBackup } from 'bitcoin-backup';
import { extractIdentityFromBackup } from '@/lib/bap-utils';

interface OAuthConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: string;
  existingBapId: string;
  currentBapId: string;
  onTransferComplete: () => void;
  onSwitchAccount: () => void;
}

export default function OAuthConflictModal({
  isOpen,
  onClose,
  provider,
  existingBapId,
  currentBapId,
  onTransferComplete,
  onSwitchAccount,
}: OAuthConflictModalProps) {
  const [mode, setMode] = useState<'choose' | 'transfer' | 'switching'>('choose');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Fetch the backup for the existing account
      const response = await fetch(`/api/backup?bapid=${existingBapId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch existing account backup');
      }

      const { backup: encryptedBackup } = await response.json();
      
      // Try to decrypt it
      const decrypted = await decryptBackup(encryptedBackup, password) as BapMasterBackup;
      if (!decrypted || !decrypted.xprv) {
        throw new Error('Invalid password');
      }

      // Verify ownership by extracting identity
      const identity = extractIdentityFromBackup(decrypted);
      if (identity.id !== existingBapId) {
        throw new Error('Identity mismatch');
      }

      // Transfer the OAuth link
      const transferResponse = await fetch('/api/users/transfer-oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          fromBapId: existingBapId,
          toBapId: currentBapId,
          verificationPassword: password
        })
      });

      if (!transferResponse.ok) {
        const data = await transferResponse.json();
        throw new Error(data.error || 'Failed to transfer OAuth link');
      }

      // Success!
      onTransferComplete();
    } catch (err) {
      console.error('Transfer error:', err);
      setError(err instanceof Error ? err.message : 'Failed to transfer OAuth link');
      setLoading(false);
    }
  };

  const handleSwitchAccount = async () => {
    setMode('switching');
    setLoading(true);
    
    try {
      // Fetch the existing account backup
      const response = await fetch(`/api/backup?bapid=${existingBapId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch existing account');
      }

      const { backup: encryptedBackup } = await response.json();
      
      // Store it locally
      localStorage.setItem('encryptedBackup', encryptedBackup);
      
      // Redirect to signin to decrypt and use it
      onSwitchAccount();
    } catch (err) {
      console.error('Switch account error:', err);
      setError('Failed to switch accounts. Please try signing in manually.');
      setLoading(false);
      setMode('choose');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${provider} Account Already Linked`}
      size="md"
    >
      {mode === 'choose' && (
        <div className="space-y-6">
          <div className="bg-amber-900/20 border border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-300">
              This {provider} account is already linked to another Bitcoin identity.
              You have two options:
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setMode('transfer')}
              className="w-full p-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-left transition-colors"
            >
              <h3 className="font-semibold mb-1">Transfer {provider} Link</h3>
              <p className="text-sm text-gray-400">
                Move the {provider} connection from your other account to this one
                (requires password for the other account)
              </p>
            </button>

            <button
              type="button"
              onClick={handleSwitchAccount}
              className="w-full p-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg text-left transition-colors"
            >
              <h3 className="font-semibold mb-1">Use Existing Account</h3>
              <p className="text-sm text-gray-400">
                Discard this new identity and continue with your existing account
              </p>
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {mode === 'transfer' && (
        <form onSubmit={handleTransfer} className="space-y-6">
          <div>
            <p className="text-sm text-gray-400 mb-4">
              Enter the password for your other account to verify ownership and transfer
              the {provider} link to your current account.
            </p>
            
            <div className="bg-gray-900 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500">Transferring from:</p>
              <p className="font-mono text-xs">{existingBapId}</p>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password for Other Account
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter encryption password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-900 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                setMode('choose');
                setPassword('');
                setError('');
              }}
              disabled={loading}
              className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 rounded-lg text-sm transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading || !password}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Transferring...' : 'Transfer Link'}
            </button>
          </div>
        </form>
      )}

      {mode === 'switching' && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-400">Switching to your existing account...</p>
        </div>
      )}
    </Modal>
  );
}