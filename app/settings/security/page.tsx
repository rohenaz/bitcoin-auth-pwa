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
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Link 
            href="/settings"
            className="text-gray-400 hover:text-white transition-colors mb-4 inline-block"
          >
            ← Back to Settings
          </Link>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-gray-400 mt-2">
            Manage your encryption settings and backup security
          </p>
        </div>

        {/* Current Security Status */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Security Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <div>
                  <div className="font-medium">Bitcoin Authentication</div>
                  <div className="text-sm text-gray-400">
                    Your identity is secured by Bitcoin cryptography
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <div className="font-medium">Client-Side Encryption</div>
                  <div className="text-sm text-gray-400">
                    Private keys never leave your device unencrypted
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <div className="font-medium">Time-Bound Tokens</div>
                  <div className="text-sm text-gray-400">
                    Authentication tokens expire after 10 minutes
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Backup Status */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Cloud Backup</h2>
          <p className="text-gray-400 text-sm mb-6">
            Manage your encrypted backup stored with OAuth providers.
          </p>

          <div className="space-y-4">
            <div className="p-4 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Cloud Backup Status</h3>
                {cloudBackupStatus.hasCloudBackup && (
                  <span className={`text-sm px-2 py-1 rounded ${
                    cloudBackupStatus.isOutdated 
                      ? 'bg-yellow-900/50 text-yellow-400' 
                      : 'bg-green-900/50 text-green-400'
                  }`}>
                    {cloudBackupStatus.isOutdated ? 'Outdated' : 'Up to date'}
                  </span>
                )}
              </div>
              
              {cloudBackupStatus.hasCloudBackup ? (
                <>
                  <p className="text-sm text-gray-400 mb-2">
                    Last updated: {cloudBackupStatus.lastUpdated 
                      ? new Date(cloudBackupStatus.lastUpdated).toLocaleString()
                      : 'Unknown'}
                  </p>
                  {cloudBackupStatus.isOutdated && (
                    <div className="bg-yellow-900/20 border border-yellow-800 rounded p-3 mb-4">
                      <p className="text-sm text-yellow-400">
                        Your local backup is newer than the cloud backup. Update it to ensure you can access your latest identity from other devices.
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleUpdateCloudBackup}
                    disabled={updating || !cloudBackupStatus.isOutdated}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {updating ? "Updating..." : cloudBackupStatus.isOutdated ? "Update Cloud Backup" : "Already Up to Date"}
                  </button>
                </>
              ) : (
                <div>
                  <p className="text-sm text-gray-400 mb-4">
                    No cloud backup found. Create one to access your identity from other devices.
                  </p>
                  <button
                    onClick={handleUpdateCloudBackup}
                    disabled={updating}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {updating ? "Creating..." : "Create Cloud Backup"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Local Backup Management */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Local Backup</h2>
          <p className="text-gray-400 text-sm mb-6">
            Export your encrypted backup for safekeeping or manual restoration.
          </p>

          <div className="space-y-4">
            <div className="p-4 border border-gray-700 rounded-lg">
              <h3 className="font-medium mb-2">Export Encrypted Backup</h3>
              <p className="text-sm text-gray-400 mb-4">
                Download a copy of your encrypted backup file. You'll need your original password to decrypt it when importing.
              </p>
              
              <button
                onClick={handleExportBackup}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Download Backup
              </button>
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Security Information</h2>
          
          <button
            onClick={() => setShowBackupData(!showBackupData)}
            className="w-full text-left p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">View Technical Details</div>
                <div className="text-sm text-gray-400">
                  Bitcoin address, public key, and encryption info
                </div>
              </div>
              <span className="text-gray-400">
                {showBackupData ? "▼" : "▶"}
              </span>
            </div>
          </button>

          {showBackupData && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg space-y-3">
              <div>
                <div className="text-sm text-gray-400">Bitcoin Address</div>
                <div className="font-mono text-sm break-all">
                  {session.user.address || session.user.id}
                </div>
              </div>
              
              {session.user.idKey && (
                <div>
                  <div className="text-sm text-gray-400">BAP Identity Key</div>
                  <div className="font-mono text-sm break-all">
                    {session.user.idKey}
                  </div>
                </div>
              )}
              
              <div>
                <div className="text-sm text-gray-400">Session Type</div>
                <div className="text-sm">
                  {session.user.provider === 'credentials' ? 'Bitcoin Signature' : `OAuth (${session.user.provider})`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Warnings */}
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-yellow-400">Security Reminders</h2>
          <ul className="text-sm text-gray-300 space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-yellow-400 mt-1">⚠️</span>
              <span>Your backup password cannot be recovered if lost</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-400 mt-1">⚠️</span>
              <span>Never share your private key or backup password</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-400 mt-1">⚠️</span>
              <span>Keep multiple backup copies in secure locations</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-400 mt-1">⚠️</span>
              <span>OAuth providers only store encrypted data - they cannot access your keys</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 