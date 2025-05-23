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
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="border border-gray-800/50 rounded-lg p-8">
            <h1 className="text-2xl font-medium mb-4">Access Denied</h1>
            <p className="text-gray-400 mb-6">Please sign in to access settings</p>
            <Link 
              href="/signin"
              className="inline-flex px-6 py-2 text-sm border border-gray-700 hover:border-gray-600 rounded-md transition-colors"
            >
              Sign In
            </Link>
          </div>
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
            <div className="flex items-center space-x-8">
              <h1 className="text-lg font-medium">Settings</h1>
              <nav className="hidden sm:flex space-x-6">
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/settings" className="text-white">
                  Settings
                </Link>
              </nav>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Account Overview */}
          <div className="border border-gray-800/50 rounded-lg p-8">
            <h2 className="text-xl font-medium mb-6">Account Overview</h2>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Signing Address
                  </label>
                  <code className="text-sm font-mono text-gray-300">
                    {session.user.address || session.user.id}
                  </code>
                </div>
              </div>
              
              {session.user.idKey && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      BAP Identity Key
                    </label>
                    <code className="text-sm font-mono text-gray-300">
                      {session.user.idKey.substring(0, 12)}...
                    </code>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Session Provider
                  </label>
                  <span className="text-sm capitalize text-gray-300">
                    {session.user.provider || 'Bitcoin'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Backup Anchors */}
          <div className="border border-gray-800/50 rounded-lg p-8">
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-2">Backup Anchors</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                OAuth providers used to store your encrypted backup across devices. 
                Link multiple providers for redundancy.
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border border-gray-800 border-t-gray-400" />
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
                      className="flex items-center justify-between p-6 border border-gray-800/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{provider.icon}</div>
                        <div>
                          <div className="font-medium text-gray-100">{provider.name}</div>
                          <div className="text-sm text-gray-400">
                            {isConnected ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Connected</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                                <span>Not connected</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isConnected ? (
                        <button
                          type="button"
                          onClick={() => handleDisconnectAccount(provider.id)}
                          disabled={disconnectMutation.isPending}
                          className="px-4 py-2 text-sm border border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/5 rounded-md transition-colors disabled:opacity-50"
                        >
                          {disconnectMutation.isPending ? 'Disconnecting...' : 'Disconnect'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleConnectAccount(provider.id)}
                          className="px-4 py-2 text-sm border border-gray-700 hover:border-gray-600 rounded-md transition-colors"
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
          <div className="border border-gray-800/50 rounded-lg p-8">
            <h2 className="text-xl font-medium mb-6">Security</h2>
            <Link
              href="/settings/security"
              className="flex items-center justify-between p-6 border border-gray-800/50 hover:border-gray-700/50 rounded-lg transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 border border-gray-700 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium group-hover:text-white transition-colors">Security Settings</div>
                  <div className="text-sm text-gray-400">Manage encryption and backup security</div>
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Danger Zone */}
          <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-8">
            <h2 className="text-xl font-medium text-red-400 mb-2">Danger Zone</h2>
            <p className="text-sm text-red-400/80 mb-6 leading-relaxed">
              These actions are permanent and cannot be undone.
            </p>
            
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 text-sm border border-red-500/30 text-red-400 hover:border-red-500/50 hover:bg-red-500/10 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </main>

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
            className="w-full py-2 px-4 border border-gray-700 hover:border-gray-600 rounded-md text-sm transition-colors"
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