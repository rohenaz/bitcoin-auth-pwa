'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BAP } from 'bsv-bap';
import { PrivateKey } from '@bsv/sdk';
import type { BapMasterBackup } from 'bitcoin-backup';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import ProfileEditor from '@/components/ProfileEditor';
import ProfileSwitcher from '@/components/ProfileSwitcher';
import DeviceLinkQR from '@/components/DeviceLinkQR';
import MobileMemberExport from '@/components/MobileMemberExport';
import Modal from '@/components/Modal';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import type { APIIdentity } from '@/types/bap';
import { encryptBackup } from 'bitcoin-backup';
import { useBlockchainImage } from 'bitcoin-image/react';

interface DashboardPageProps {
  params: Promise<{ bapId?: string[] }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPassword, setExportPassword] = useState('');
  const [exportError, setExportError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [currentBapId, setCurrentBapId] = useState<string>('');
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [resolvedParams, setResolvedParams] = useState<{ bapId?: string[] } | null>(null);
  const [initError, setInitError] = useState<string>('');

  // Resolve async params
  useEffect(() => {
    params.then(p => setResolvedParams(p));
  }, [params]);

  // Initialize profile from route params
  useEffect(() => {
    if (!session?.user || !resolvedParams) return;
    
    const initializeProfile = async () => {
      try {
        // Get decrypted backup
        const decryptedBackupStr = sessionStorage.getItem(STORAGE_KEYS.DECRYPTED_BACKUP);
        if (!decryptedBackupStr) {
          router.push('/signin');
          return;
        }

        const backup = JSON.parse(decryptedBackupStr) as BapMasterBackup;
        const bap = new BAP(backup.xprv);
        
        try {
          bap.importIds(backup.ids);
        } catch (importError) {
          console.error('Error importing IDs:', importError);
          setInitError('Invalid backup format. Please sign in again.');
          router.push('/signin');
          return;
        }
        
        const ids = bap.listIds();
        
        // Get requested BAP ID from route or use first available
        const requestedBapId = resolvedParams.bapId?.[0];
        const targetBapId = requestedBapId || ids[0];
        
        if (!targetBapId) {
          setInitError('No identity found in backup');
          router.push('/signin');
          return;
        }
        
        // Verify user owns this BAP ID
        if (requestedBapId && !ids.includes(requestedBapId)) {
          setInitError('You do not have access to this profile');
          router.push('/dashboard');
          return;
        }
        
        // Get address for the target BAP ID
        const master = bap.getId(targetBapId);
        const memberBackup = master?.exportMemberBackup();
        
        if (!memberBackup?.derivedPrivateKey) {
          throw new Error('Invalid profile');
        }
        
        const pubkey = PrivateKey.fromWif(memberBackup.derivedPrivateKey).toPublicKey();
        const address = pubkey.toAddress().toString();
        
        setCurrentBapId(targetBapId);
        setCurrentAddress(address);
      } catch (err) {
        console.error('Error initializing profile:', err);
        setInitError('Failed to load profile');
      }
    };
    
    initializeProfile();
  }, [session, resolvedParams, router]);

  // Use React Query hooks
  const { data: profileData, isLoading, error } = useProfile(currentBapId);
  const updateProfileMutation = useUpdateProfile();
  const [bapProfile, setBapProfile] = useState<APIIdentity | null>(null);

  // Fetch BAP profile data separately to check if published
  useEffect(() => {
    if (!currentAddress) return;
    
    const fetchBapProfile = async () => {
      try {
        const response = await fetch(`/api/bap?address=${encodeURIComponent(currentAddress)}`);
        if (response.ok) {
          const data = await response.json();
          setBapProfile(data.result);
        }
      } catch (err) {
        console.error('Error fetching BAP profile:', err);
      }
    };
    
    fetchBapProfile();
  }, [currentAddress]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);
  
  // Merge BAP profile and user profile data
  const profile = profileData ? {
    idKey: currentBapId,
    currentAddress: currentAddress,
    identity: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      alternateName: profileData.alternateName || profileData.displayName || profileData.bapProfile?.identity?.alternateName || '',
      image: profileData.image || profileData.avatar || profileData.bapProfile?.identity?.image || '',
      description: profileData.description || profileData.bapProfile?.identity?.description || '',
    }
  } : null;

  // Process image URL for blockchain formats (hook must be called unconditionally)
  const profileImageUrl = profile?.identity.image || '';
  const { displayUrl: displayImageUrl } = useBlockchainImage(profileImageUrl);

  const handleSignOut = async () => {
    // Only clear session storage, preserve encrypted backup in localStorage
    sessionStorage.removeItem(STORAGE_KEYS.DECRYPTED_BACKUP);
    
    // Sign out
    await signOut({ callbackUrl: '/' });
  };

  const handleSaveProfile = async (profile: { alternateName: string; image: string; description: string }) => {
    try {
      await updateProfileMutation.mutateAsync({
        bapId: currentBapId,
        data: profile
      });
      
      setShowProfileEditor(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  };

  const handleExportMemberBackup = () => {
    // Show modal to choose export type
    setShowExportModal(true);
  };

  const exportMemberBackupDecrypted = async () => {
    try {
      // Get decrypted backup from session storage
      const decryptedBackupStr = sessionStorage.getItem(STORAGE_KEYS.DECRYPTED_BACKUP);
      if (!decryptedBackupStr) {
        alert('No backup found. Please sign in again.');
        return;
      }

      const backup = JSON.parse(decryptedBackupStr) as BapMasterBackup;
      const bap = new BAP(backup.xprv);
      bap.importIds(backup.ids);
      
      // Verify user owns this profile
      const ids = bap.listIds();
      if (!ids.includes(currentBapId)) {
        alert('You do not have access to this profile');
        return;
      }

      // Export the member backup for this specific profile (locally, no network)
      const master = bap.getId(currentBapId);
      const memberBackup = master?.exportMemberBackup();

      if (!memberBackup) {
        alert('Failed to export member backup');
        return;
      }

      // Create a downloadable file
      const blob = new Blob([JSON.stringify(memberBackup, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `member-backup-decrypted-${currentBapId.substring(0, 8)}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setShowExportModal(false);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export member backup');
    }
  };

  const exportMemberBackupEncrypted = async () => {
    if (!exportPassword) {
      setExportError('Please enter a password');
      return;
    }

    setExportLoading(true);
    setExportError('');

    try {
      // Get decrypted backup from session storage
      const decryptedBackupStr = sessionStorage.getItem(STORAGE_KEYS.DECRYPTED_BACKUP);
      if (!decryptedBackupStr) {
        setExportError('No backup found. Please sign in again.');
        return;
      }

      const backup = JSON.parse(decryptedBackupStr) as BapMasterBackup;
      const bap = new BAP(backup.xprv);
      bap.importIds(backup.ids);
      
      // Verify user owns this profile
      const ids = bap.listIds();
      if (!ids.includes(currentBapId)) {
        setExportError('You do not have access to this profile');
        return;
      }

      // Export the member backup for this specific profile
      const master = bap.getId(currentBapId);
      if (!master) {
        setExportError('Failed to get master identity');
        return;
      }

      // Use the new exportMember() method
      const memberExport = master.exportMember();

      // Create a BapMemberBackup structure for encryption
      const memberBackupForEncryption = {
        wif: memberExport.wif,
        id: currentBapId,
        label: master.idName || `Profile ${currentBapId.substring(0, 8)}`,
        createdAt: new Date().toISOString()
      };
      
      const encryptedMemberBackup = await encryptBackup(memberBackupForEncryption, exportPassword);

      // Create a downloadable file
      const blob = new Blob([JSON.stringify(encryptedMemberBackup, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `member-backup-encrypted-${currentBapId.substring(0, 8)}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Close modal and reset form
      setShowExportModal(false);
      setExportPassword('');
      setExportError('');
    } catch (error) {
      console.error('Export error:', error);
      setExportError('Failed to encrypt and export member backup');
    } finally {
      setExportLoading(false);
    }
  };

  if (status === 'loading' || !currentBapId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border border-gray-800 border-t-white mx-auto" />
          <p className="text-gray-400">Loading your identity...</p>
        </div>
      </div>
    );
  }

  if (initError || error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="border border-red-500/20 bg-red-500/5 rounded-lg p-6">
            <h2 className="text-lg font-medium mb-2">Error</h2>
            <p className="text-gray-400">{initError || (error as Error)?.message || 'Failed to load profile'}</p>
            <button 
              onClick={() => router.push('/signin')}
              className="mt-4 px-4 py-2 text-sm border border-gray-700 hover:border-gray-600 rounded-md transition-colors"
            >
              Return to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if BAP profile is published on-chain
  const isPublished = !!(bapProfile?.addresses && 
    bapProfile.addresses.length > 0 && 
    bapProfile.addresses[0] &&
    bapProfile.addresses[0].block > 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-lg font-medium">Dashboard</h1>
              <nav className="hidden sm:flex space-x-6">
                <Link href="/dashboard" className="text-white">
                  Identity
                </Link>
                <Link href="/settings" className="text-gray-400 hover:text-white transition-colors">
                  Settings
                </Link>
                <Link href="/quickstart" className="text-gray-400 hover:text-white transition-colors">
                  Quick Start
                </Link>
                <Link href="/themes" className="text-gray-400 hover:text-white transition-colors">
                  Themes
                </Link>
                <Link href="/mcp-server" className="text-gray-400 hover:text-white transition-colors">
                  MCP Server
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <ProfileSwitcher currentBapId={currentBapId} />
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Identity Card */}
            <div className="border border-gray-800/50 rounded-lg p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-start space-x-6">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    {displayImageUrl ? (
                      <img
                        src={displayImageUrl}
                        alt={profile?.identity.alternateName || 'Profile'}
                        className="w-20 h-20 rounded-lg object-cover border border-gray-800"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-medium text-gray-500">
                          {profile?.identity.alternateName?.charAt(0) || session?.user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-medium mb-2">
                      {profile?.identity.alternateName || session?.user?.name || 'Bitcoin User'}
                    </h2>
                    {profile?.identity.description && (
                      <p className="text-gray-400 leading-relaxed">
                        {profile.identity.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setShowProfileEditor(true)}
                  className="px-4 py-2 text-sm border border-gray-700 hover:border-gray-600 rounded-md transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              {/* Technical Details */}
              <div className="space-y-6 pt-6 border-t border-gray-800/50">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Bitcoin Address
                  </label>
                  <code className="block text-sm font-mono text-gray-300 bg-gray-900/50 border border-gray-800 rounded px-3 py-2 break-all">
                    {currentAddress}
                  </code>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Identity Key
                  </label>
                  <code className="block text-sm font-mono text-gray-300 bg-gray-900/50 border border-gray-800 rounded px-3 py-2 break-all">
                    {currentBapId}
                  </code>
                </div>
              </div>

              {isLoading && (
                <div className="mt-6 pt-6 border-t border-gray-800/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border border-gray-800 border-t-gray-400" />
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="border border-gray-800/50 rounded-lg p-8">
              <h3 className="text-lg font-medium mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.open('https://www.sigmaidentity.com/', '_blank')}
                  className="w-full p-4 text-left border border-gray-800 hover:border-gray-700 rounded-lg transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium group-hover:text-white transition-colors">Edit BAP Profile</div>
                      <div className="text-sm text-gray-400">Manage your on-chain identity</div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </button>
                
                <Link 
                  href="/settings/security"
                  className="block w-full p-4 text-left border border-gray-800 hover:border-gray-700 rounded-lg transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium group-hover:text-white transition-colors">Security Settings</div>
                      <div className="text-sm text-gray-400">Manage backups and encryption</div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
                
                <div className="space-y-3">
                  <button
                    onClick={handleExportMemberBackup}
                    className="w-full p-4 text-left border border-gray-800 hover:border-gray-700 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium group-hover:text-white transition-colors">Export Member Backup</div>
                        <div className="text-sm text-gray-400">Download backup for this identity only</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </button>
                  
                  <MobileMemberExport bapId={currentBapId} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-8">
            {/* Account Status */}
            <div className="border border-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-6">Account Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Authentication</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-400">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Backup Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-400">Encrypted</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">BAP Profile</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isPublished ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <span className={`text-sm ${isPublished ? 'text-green-400' : 'text-gray-400'}`}>
                      {isPublished ? 'Published' : 'Not Published'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Device Linking */}
            <DeviceLinkQR />

            {/* Security Notice */}
            <div className="border border-amber-500/20 bg-amber-500/5 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-amber-400 mb-1">Security Reminder</h4>
                  <p className="text-sm text-amber-400/80 leading-relaxed">
                    Your Bitcoin private key is your identity. Keep your encryption password safe and never share it with anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Profile Editor Modal */}
      {showProfileEditor && profile && (
        <ProfileEditor
          isOpen={showProfileEditor}
          profile={{
            alternateName: profile.identity.alternateName || '',
            image: profile.identity.image || '',
            description: profile.identity.description || ''
          }}
          onSave={handleSaveProfile}
          onClose={() => setShowProfileEditor(false)}
          onPublish={async () => {
            // Publishing to blockchain not implemented in this version
            console.log('Publishing to blockchain not yet implemented');
          }}
        />
      )}

      {/* Member Export Modal */}
      {showExportModal && (
        <Modal
          isOpen={showExportModal}
          onClose={() => {
            setShowExportModal(false);
            setExportPassword('');
            setExportError('');
          }}
          title="Export Member Backup"
        >
          <div className="space-y-6">
            <div className="text-sm text-gray-400">
              Choose how you want to export this member backup:
            </div>

            {/* Decrypted Option */}
            <div className="space-y-4">
              <button
                onClick={exportMemberBackupDecrypted}
                className="w-full p-4 text-left border border-gray-800 hover:border-gray-700 rounded-lg transition-colors group"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium group-hover:text-white transition-colors">Quick Export (Decrypted)</div>
                    <div className="text-sm text-gray-400">Download ready-to-use member backup</div>
                    <div className="text-xs text-amber-400 mt-1">⚠️ Private key will be visible in the file</div>
                  </div>
                </div>
              </button>

              {/* Encrypted Option */}
              <div className="border border-gray-800 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Secure Export (Encrypted)</div>
                    <div className="text-sm text-gray-400 mb-3">Password-protect the member backup file</div>
                    
                    <div className="space-y-3">
                      <input
                        type="password"
                        value={exportPassword}
                        onChange={(e) => {
                          setExportPassword(e.target.value);
                          setExportError('');
                        }}
                        placeholder="Enter encryption password"
                        className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                      
                      {exportError && (
                        <div className="text-xs text-red-400">{exportError}</div>
                      )}
                      
                      <button
                        onClick={exportMemberBackupEncrypted}
                        disabled={exportLoading || !exportPassword}
                        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium transition-colors text-sm"
                      >
                        {exportLoading ? 'Encrypting...' : 'Export Encrypted'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              <strong>Recommendation:</strong> Use encrypted export for maximum security. You'll need the password to import this backup later.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}