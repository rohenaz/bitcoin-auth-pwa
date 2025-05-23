'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BAP } from 'bsv-bap';
import { PrivateKey } from '@bsv/sdk';
import type { BapMasterBackup } from 'bitcoin-backup';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import ProfileEditor from '@/components/ProfileEditor';
import ProfileSwitcher from '@/components/ProfileSwitcher';
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
        <div className="animate-pulse text-center">
          <div className="h-8 bg-gray-800 rounded w-48 mx-auto mb-4" />
          <div className="h-4 bg-gray-800 rounded w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (initError || error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-600 rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-gray-300">{initError || (error as Error)?.message || 'Failed to load profile'}</p>
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
      alternateName: profileData.displayName || profileData.bapProfile?.identity?.alternateName || '',
      image: profileData.avatar || profileData.bapProfile?.identity?.image || '',
      description: profileData.description || profileData.bapProfile?.identity?.description || '',
    }
  } : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <ProfileSwitcher currentBapId={currentBapId} />
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 rounded-xl p-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center space-x-6">
              {/* Profile Image */}
              <div className="relative">
                {profile?.identity.image ? (
                  <img
                    src={profile.identity.image}
                    alt={profile.identity.alternateName || 'Profile'}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-medium text-gray-400">
                      {profile?.identity.alternateName?.charAt(0) || session?.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {profile?.identity.alternateName || session?.user?.name || 'Bitcoin User'}
                </h2>
                <p className="text-gray-400 text-sm mb-3">
                  BAP ID: {currentBapId}
                </p>
                {profile?.identity.description && (
                  <p className="text-gray-300 max-w-2xl">
                    {profile.identity.description}
                  </p>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setShowProfileEditor(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-800">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Bitcoin Address</h3>
              <p className="text-sm font-mono bg-gray-800 p-3 rounded break-all">
                {currentAddress}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">Identity Key</h3>
              <p className="text-sm font-mono bg-gray-800 p-3 rounded break-all">
                {currentBapId}
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="mt-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto" />
            </div>
          )}
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