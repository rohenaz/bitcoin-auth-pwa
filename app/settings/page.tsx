"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";
import OAuthConflictModal from "@/components/OAuthConflictModal";
import { ENABLED_PROVIDERS, type EnabledProvider } from "@/lib/env";
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { useConnectedAccounts, useDisconnectAccount } from '@/hooks/useConnectedAccounts';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { data: connectedAccounts = [], isLoading, refetch } = useConnectedAccounts();
  const disconnectMutation = useDisconnectAccount();
  
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; message: string; type: 'error' | 'warning' | 'info' }>({ 
    title: '', 
    message: '', 
    type: 'info' 
  });
  const [conflictModal, setConflictModal] = useState<{
    isOpen: boolean;
    provider: string;
    existingBapId: string;
  } | null>(null);
  
  const showMessage = useCallback((title: string, message: string, type: 'error' | 'warning' | 'info' = 'info') => {
    setModalContent({ title, message, type });
    setShowModal(true);
  }, []);

  const handleTransferComplete = useCallback(async () => {
    if (!conflictModal || !session?.user?.id) return;
    
    const provider = conflictModal.provider;
    setConflictModal(null);
    
    // OAuth link was transferred, refresh connected accounts
    await refetch();
    showMessage('Success', `Your ${provider} account has been linked successfully.`, 'info');
  }, [conflictModal, session, refetch, showMessage]);

  const handleSwitchAccount = useCallback(async () => {
    // User chose to switch to existing account - sign out and redirect
    await signOut({ redirect: false });
    window.location.href = '/signin';
  }, []);

  const ALL_PROVIDERS = [
    { id: 'google', name: 'Google', icon: '🔗' },
    { id: 'github', name: 'GitHub', icon: '🔗' },
    { id: 'twitter', name: 'X (Twitter)', icon: '🔗' },
  ];
  
  const providers = ALL_PROVIDERS.filter(p => ENABLED_PROVIDERS.includes(p.id as EnabledProvider));

  // Handle OAuth callback return messages
  const handleOAuthReturn = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Handle successful linking
    const linkedProvider = urlParams.get('linked');
    if (linkedProvider) {
      window.history.replaceState({}, '', '/settings');
      showMessage('Success', `${linkedProvider.charAt(0).toUpperCase() + linkedProvider.slice(1)} account linked successfully!`, 'info');
      refetch();
      return;
    }
    
    // Handle errors
    const error = urlParams.get('error');
    if (error) {
      window.history.replaceState({}, '', '/settings');
      
      // Handle OAuth conflict specially
      if (error === 'OAuthAlreadyLinked') {
        // Extract provider and existing BAP ID from URL if available
        const provider = urlParams.get('provider') || 'OAuth';
        const existingBapId = urlParams.get('existingBapId');
        
        if (existingBapId) {
          setConflictModal({
            isOpen: true,
            provider,
            existingBapId
          });
          return;
        }
      }
      
      const errorMessages: Record<string, string> = {
        'CredentialsRequired': 'You must be signed in with your Bitcoin credentials to link OAuth providers.',
        'InvalidProvider': 'Invalid OAuth provider specified.',
        'InvalidState': 'OAuth state validation failed. Please try again.',
        'OAuthDenied': 'OAuth authorization was denied.',
        'OAuthFailed': 'Failed to retrieve account information from OAuth provider.',
        'LinkFailed': 'Failed to link OAuth account. Please try again.',
        'SessionExpired': 'Your session has expired. Please sign in again.',
        'MissingParams': 'Missing required OAuth parameters.',
        'ProviderNotConfigured': 'This OAuth provider is not configured. Please check environment variables.',
        'ProviderDisabled': 'This OAuth provider is temporarily disabled.',
        'OAuthAlreadyLinked': 'This OAuth account is already linked to another Bitcoin identity. Each OAuth account can only be linked to one identity.',
      };
      
      const message = errorMessages[error] || 'An error occurred while linking your account.';
      showMessage('Error', message, 'error');
      
      // If session expired, redirect to signin
      if (error === 'SessionExpired') {
        setTimeout(() => {
          window.location.href = '/signin';
        }, 2000);
      }
    }
  }, [refetch, showMessage]);
    
  useEffect(() => {
    if (session?.user) {
      handleOAuthReturn();
    }
  }, [session, handleOAuthReturn]);

  const handleConnectAccount = async (provider: string) => {
    // IMPORTANT: We only support linking OAuth when signed in with credentials
    // The app architecture requires credentials provider as the base authentication
    if (session?.user?.id && session?.user?.provider === 'credentials') {
      const encryptedBackup = localStorage.getItem(STORAGE_KEYS.ENCRYPTED_BACKUP);
      if (encryptedBackup) {
        // Use our custom OAuth linking endpoint that doesn't create a new session
        const params = new URLSearchParams({
          provider,
          backup: encryptedBackup
        });
        
        // Redirect to our custom OAuth flow
        window.location.href = `/api/auth/link-provider?${params}`;
      } else {
        console.warn('No encrypted backup found when trying to connect OAuth provider');
        showMessage('No Backup Found', 'Please ensure you have a local backup before linking accounts.', 'warning');
        return;
      }
    } else {
      console.warn('Cannot connect OAuth provider - not signed in with credentials or no user ID');
      showMessage('Authentication Required', 'You must be signed in with your Bitcoin credentials to link OAuth providers.', 'warning');
      return;
    }
  };

  const handleDisconnectAccount = async (provider: string) => {
    try {
      await disconnectMutation.mutateAsync(provider);
      showMessage('Success', `${provider.charAt(0).toUpperCase() + provider.slice(1)} account disconnected.`, 'info');
    } catch (error) {
      console.error('Failed to disconnect account:', error);
      showMessage('Error', 'Failed to disconnect account. Please try again.', 'error');
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please sign in to access settings</p>
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
            href="/dashboard"
            className="text-gray-400 hover:text-white transition-colors mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-400 mt-2">
            Manage your account settings and connected backup anchors
          </p>
        </div>

        {/* Account Overview */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Signing Address</span>
              <span className="font-mono text-sm bg-gray-800 px-3 py-1 rounded">
                {session.user.address || session.user.id}
              </span>
            </div>
            {session.user.idKey && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">BAP Identity Key</span>
                <span className="font-mono text-sm bg-gray-800 px-3 py-1 rounded">
                  {session.user.idKey.substring(0, 12)}...
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Session Provider</span>
              <span className="capitalize text-orange-400">
                {session.user.provider || 'bitcoin'}
              </span>
            </div>
          </div>
        </div>

        {/* Connected Backup Anchors */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Backup Anchors</h2>
          <p className="text-gray-400 text-sm mb-6">
            OAuth providers used to store your encrypted backup across devices. 
            Link multiple providers for redundancy.
          </p>
          
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto" />
            </div>
          ) : (
            <div className="space-y-4">
              {providers.map((provider) => {
                const isConnected = connectedAccounts.some(
                  account => account.provider === provider.id
                );
                
                return (
                  <div 
                    key={provider.id}
                    className="flex items-center justify-between p-4 border border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-sm text-gray-400">
                          {isConnected ? 'Connected' : 'Not connected'}
                        </div>
                      </div>
                    </div>
                    
                    {isConnected ? (
                      <button
                        type="button"
                        onClick={() => handleDisconnectAccount(provider.id)}
                        disabled={disconnectMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleConnectAccount(provider.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Security Settings */}
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="space-y-4">
            <Link
              href="/settings/security"
              className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🔐</span>
                <div>
                  <div className="font-medium">Security Settings</div>
                  <div className="text-sm text-gray-400">
                    Manage encryption and backup security
                  </div>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2 text-red-400">Danger Zone</h2>
          <p className="text-gray-400 text-sm mb-4">
            These actions are permanent and cannot be undone.
          </p>
          
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Modal for messages */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent.title}
        size="sm"
      >
        <div className="space-y-4">
          <div className={`flex items-start space-x-3 ${
            modalContent.type === 'error' ? 'text-red-400' :
            modalContent.type === 'warning' ? 'text-amber-400' :
            'text-blue-400'
          }`}>
            {modalContent.type === 'error' && (
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <title>Error</title>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {modalContent.type === 'warning' && (
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <title>Warning</title>
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {modalContent.type === 'info' && (
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <title>Info</title>
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
            <p className="text-sm">{modalContent.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>

      {/* OAuth Conflict Modal */}
      {conflictModal && (
        <OAuthConflictModal
          isOpen={conflictModal.isOpen}
          onClose={() => setConflictModal(null)}
          provider={conflictModal.provider}
          existingBapId={conflictModal.existingBapId}
          currentBapId={session?.user?.id || ''}
          onTransferComplete={handleTransferComplete}
          onSwitchAccount={handleSwitchAccount}
        />
      )}
    </div>
  );
}