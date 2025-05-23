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
import { STORAGE_KEYS } from '@/lib/storage-keys';

interface DashboardPageProps {
  params: Promise<{ bapId?: string[] }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showProfileEditor, setShowProfileEditor] = useState(false);
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

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

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
                    {profile?.identity.image ? (
                      <img
                        src={profile.identity.image}
                        alt={profile.identity.alternateName || 'Profile'}
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
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-400">
                      {profile?.identity.alternateName ? 'Published' : 'Draft'}
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
    </div>
  );
}