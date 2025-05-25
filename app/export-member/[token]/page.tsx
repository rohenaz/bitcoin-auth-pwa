'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { BAP } from 'bsv-bap';
import { decryptBackup, type BapMasterBackup } from 'bitcoin-backup';

export default function ExportMemberPage() {
  const params = useParams();
  const token = params.token as string;
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenData, setTokenData] = useState<{ bapId: string } | null>(null);
  const [validating, setValidating] = useState(true);

  const validateToken = useCallback(async () => {
    try {
      const response = await fetch('/api/member-export/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Invalid or expired token');
      }

      const data = await response.json();
      setTokenData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid token');
    } finally {
      setValidating(false);
    }
  }, [token]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !tokenData) return;

    setLoading(true);
    setError('');

    try {
      // Get encrypted backup and validate password
      const response = await fetch('/api/member-export/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to export member backup');
      }

      const { encryptedBackup, bapId } = await response.json();
      
      // Decrypt to get member backup
      const decrypted = await decryptBackup(JSON.parse(encryptedBackup), password);
      
      // Check if it's a master backup
      if (!('mnemonic' in decrypted && 'xprv' in decrypted)) {
        throw new Error('Invalid backup format');
      }

      const masterBackup = decrypted as BapMasterBackup;
      const bap = new BAP(masterBackup.xprv);
      bap.importIds(masterBackup.ids);
      
      // Export the specific member backup
      const master = bap.getId(bapId);
      const memberBackup = master?.exportMemberBackup();

      if (!memberBackup) {
        throw new Error('Failed to export member backup');
      }

      // Download the member backup
      const blob = new Blob([JSON.stringify(memberBackup, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `member-backup-${bapId.substring(0, 8)}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Success message
      setError('');
      setTimeout(() => {
        window.close(); // Try to close if opened in new tab
      }, 2000);
    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Validating export token...</p>
        </div>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Invalid Export Link</h1>
          <p className="text-gray-400">
            This export link is invalid or has expired. Export links are only valid for 10 minutes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Export Member Backup</h1>
          <p className="text-gray-400">
            Enter your password to download this member backup
          </p>
        </div>

        <form onSubmit={handleExport} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter your backup password"
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-900 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Exporting...' : 'Download Member Backup'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>This link expires in 10 minutes</p>
        </div>
      </div>
    </div>
  );
}