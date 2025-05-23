"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SecuritySettingsPage() {
  const { data: session } = useSession();
  const [showBackupData, setShowBackupData] = useState(false);
  const [cloudBackupStatus, setCloudBackupStatus] = useState<{
    lastUpdated?: string;
    hasCloudBackup: boolean;
    isOutdated?: boolean;
  }>({ hasCloudBackup: false });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (session?.user) {
      checkCloudBackupStatus();
    }
  }, [session]);

  const checkCloudBackupStatus = async () => {
    try {
      const response = await fetch('/api/backup/status');
      if (response.ok) {
        const status = await response.json();
        setCloudBackupStatus(status);
      }
    } catch (error) {
      console.error('Failed to check cloud backup status:', error);
    }
  };

  const handleUpdateCloudBackup = async () => {
    const encryptedBackup = localStorage.getItem('encryptedBackup');
    if (!encryptedBackup) {
      alert('No local backup found to upload');
      return;
    }

    setUpdating(true);
    try {
      // First check if user has any OAuth providers linked
      const accountsResponse = await fetch('/api/users/connected-accounts');
      const connectedAccounts = await accountsResponse.json();
      
      const hasOAuthLinked = connectedAccounts.some((acc: { connected: boolean; provider: string }) => 
        acc.connected && acc.provider !== 'credentials'
      );
      
      if (!hasOAuthLinked) {
        alert('Please link an OAuth provider (Google, GitHub, or X) in Settings first. This enables cloud backup restoration from other devices.');
        setUpdating(false);
        return;
      }
      
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          encryptedBackup,
          bapId: session?.user?.id 
        }),
      });

      if (response.ok) {
        alert('Cloud backup updated successfully');
        await checkCloudBackupStatus();
      } else {
        const error = await response.json();
        alert(`Failed to update cloud backup: ${error.error}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update cloud backup');
    } finally {
      setUpdating(false);
    }
  };

  const handleExportBackup = async () => {
    const encryptedBackup = localStorage.getItem('encryptedBackup');
    if (!encryptedBackup) {
      alert("No local backup found");
      return;
    }

    try {
      // Just download the already encrypted backup
      const blob = new Blob([encryptedBackup], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bitcoin-auth-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      alert("Export failed");
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please sign in to access security settings</p>
          <Link 
            href="/signin"
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/settings"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Back
              </Link>
              <h1 className="text-xl font-semibold">Security</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-2xl font-semibold mb-2">Security Settings</h1>
          <p className="text-gray-400">
            Manage your encryption settings and backup security
          </p>
        </div>

        <div className="space-y-8">
          {/* Security Status */}
          <div className="border border-gray-800/50 rounded-lg p-8">
            <h2 className="text-lg font-medium mb-8">Security Status</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 border border-gray-800/50 rounded-lg">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-medium mb-1">Bitcoin Authentication</h3>
                  <p className="text-sm text-gray-400">
                    Your identity is secured by Bitcoin cryptography
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 border border-gray-800/50 rounded-lg">
                <span className="text-2xl">🔐</span>
                <div>
                  <h3 className="font-medium mb-1">Client-Side Encryption</h3>
                  <p className="text-sm text-gray-400">
                    Private keys never leave your device unencrypted
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 border border-gray-800/50 rounded-lg">
                <span className="text-2xl">⏰</span>
                <div>
                  <h3 className="font-medium mb-1">Time-Bound Tokens</h3>
                  <p className="text-sm text-gray-400">
                    Authentication tokens expire after 10 minutes
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cloud Backup Management */}
          <div className="border border-gray-800/50 rounded-lg p-8">
            <h2 className="text-lg font-medium mb-2">Cloud Backup</h2>
            <p className="text-gray-400 text-sm mb-8">
              Manage your encrypted backup stored with OAuth providers.
            </p>

            <div className="border border-gray-800/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium">Backup Status</h3>
                {cloudBackupStatus.hasCloudBackup && (
                  <span className={`text-xs px-2 py-1 rounded border ${
                    cloudBackupStatus.isOutdated 
                      ? 'border-yellow-600 text-yellow-400' 
                      : 'border-green-600 text-green-400'
                  }`}>
                    {cloudBackupStatus.isOutdated ? 'Outdated' : 'Up to date'}
                  </span>
                )}
              </div>
              
              {cloudBackupStatus.hasCloudBackup ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    Last updated: {cloudBackupStatus.lastUpdated 
                      ? new Date(cloudBackupStatus.lastUpdated).toLocaleString()
                      : 'Unknown'}
                  </p>
                  {cloudBackupStatus.isOutdated && (
                    <div className="border border-yellow-600 rounded-lg p-4">
                      <p className="text-sm text-yellow-400">
                        Your local backup is newer than the cloud backup. Update it to ensure you can access your latest identity from other devices.
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleUpdateCloudBackup}
                    disabled={updating || !cloudBackupStatus.isOutdated}
                    className="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updating ? "Updating..." : cloudBackupStatus.isOutdated ? "Update Cloud Backup" : "Already Up to Date"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-400">
                    No cloud backup found. Create one to access your identity from other devices.
                  </p>
                  <button
                    onClick={handleUpdateCloudBackup}
                    disabled={updating}
                    className="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {updating ? "Creating..." : "Create Cloud Backup"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Local Backup Export */}
          <div className="border border-gray-800/50 rounded-lg p-8">
            <h2 className="text-lg font-medium mb-2">Local Backup</h2>
            <p className="text-gray-400 text-sm mb-8">
              Export your encrypted backup for safekeeping or manual restoration.
            </p>

            <div className="border border-gray-800/50 rounded-lg p-6">
              <h3 className="font-medium mb-2">Export Encrypted Backup</h3>
              <p className="text-sm text-gray-400 mb-6">
                Download a copy of your encrypted backup file. You'll need your original password to decrypt it when importing.
              </p>
              
              <button
                onClick={handleExportBackup}
                className="px-4 py-2 text-sm border border-gray-600 rounded-lg hover:border-gray-500 transition-colors"
              >
                Download Backup
              </button>
            </div>
          </div>

          {/* Technical Details */}
          <div className="border border-gray-800/50 rounded-lg p-8">
            <h2 className="text-lg font-medium mb-8">Technical Details</h2>
            
            <button
              onClick={() => setShowBackupData(!showBackupData)}
              className="w-full text-left border border-gray-800/50 rounded-lg p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">View Technical Information</h3>
                  <p className="text-sm text-gray-400">
                    Bitcoin address, public key, and encryption info
                  </p>
                </div>
                <span className="text-gray-400 text-sm">
                  {showBackupData ? "▼" : "▶"}
                </span>
              </div>
            </button>

            {showBackupData && (
              <div className="mt-6 border border-gray-800/50 rounded-lg p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Bitcoin Address</h4>
                  <p className="font-mono text-sm break-all">
                    {session.user.address || session.user.id}
                  </p>
                </div>
                
                {session.user.idKey && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">BAP Identity Key</h4>
                    <p className="font-mono text-sm break-all">
                      {session.user.idKey}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Session Type</h4>
                  <p className="text-sm">
                    {session.user.provider === 'credentials' ? 'Bitcoin Signature' : `OAuth (${session.user.provider})`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Security Reminders */}
          <div className="border border-yellow-600 rounded-lg p-8">
            <h2 className="text-lg font-medium mb-6 text-yellow-400">Security Reminders</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-400 mt-0.5">⚠️</span>
                <p className="text-sm text-gray-300">Your backup password cannot be recovered if lost</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-yellow-400 mt-0.5">⚠️</span>
                <p className="text-sm text-gray-300">Never share your private key or backup password</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-yellow-400 mt-0.5">⚠️</span>
                <p className="text-sm text-gray-300">Keep multiple backup copies in secure locations</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-yellow-400 mt-0.5">⚠️</span>
                <p className="text-sm text-gray-300">OAuth providers only store encrypted data - they cannot access your keys</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 