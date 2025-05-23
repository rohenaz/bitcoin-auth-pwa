'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileEditor from '@/components/ProfileEditor';
import DeviceLinkQR from '@/components/DeviceLinkQR';
import ProfileSwitcher from '@/components/ProfileSwitcher';
import { BAP } from 'bsv-bap';
import { PrivateKey } from '@bsv/sdk';
import type { BapMasterBackup } from 'bitcoin-backup';

interface BAPProfile {
  idKey: string;
  currentAddress: string;
  identity: {
    '@context': string;
    '@type': string;
    '@id'?: string;
    name?: string;
    alternateName?: string;
    description?: string;
    image?: string;
    url?: string;
    email?: string;
    telephone?: string;
    address?: {
      '@type': string;
      addressCountry?: string;
      addressLocality?: string;
    };
  };
  block?: number;
  currentHeight?: number;
}

interface DashboardPageProps {
  params: Promise<{
    bapId?: string[];
  }>;
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bapProfile, setBapProfile] = useState<BAPProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [currentBapId, setCurrentBapId] = useState<string>('');
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [resolvedParams, setResolvedParams] = useState<{ bapId?: string[] } | null>(null);

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
        const decryptedBackupStr = sessionStorage.getItem('decryptedBackup');
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
          setError('Invalid backup format. Please sign in again.');
          router.push('/signin');
          return;
        }
        
        const ids = bap.listIds();
        
        // Get requested BAP ID from route or use first available
        const requestedBapId = resolvedParams.bapId?.[0];
        const targetBapId = requestedBapId || ids[0];
        
        if (!targetBapId) {
          setError('No identity found in backup');
          router.push('/signin');
          return;
        }
        
        // Verify user owns this BAP ID
        if (requestedBapId && !ids.includes(requestedBapId)) {
          setError('You do not have access to this profile');
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
        setError('Failed to load profile');
      }
    };
    
    initializeProfile();
  }, [session, resolvedParams, router]);

  const fetchBAPProfile = useCallback(async () => {
    if (!currentAddress) return;

    try {
      const response = await fetch(`/api/bap?address=${currentAddress}`);
      if (!response.ok) {
        if (response.status === 404) {
          // This is expected for unpublished BAP IDs or profiles not in cache
          console.log('BAP profile not found in cache');
          setBapProfile(null);
        } else {
          throw new Error('Failed to fetch BAP profile');
        }
      } else {
        const data = await response.json();
        setBapProfile(data.result);
      }
    } catch (err) {
      console.error('Error fetching BAP profile:', err);
      // Don't show error for expected cases
      if (err instanceof Error && !err.message.includes('fetch')) {
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  }, [currentAddress]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);


  useEffect(() => {
    if (currentAddress) {
      fetchBAPProfile();
    }
  }, [currentAddress, fetchBAPProfile]);

  const handleSignOut = async () => {
    // Only clear session storage, preserve encrypted backup in localStorage
    sessionStorage.removeItem('decryptedBackup');
    
    // Sign out
    await signOut({ callbackUrl: '/' });
  };

  const handleSaveProfile = async (profile: { alternateName: string; image: string; description: string }) => {
    try {
      // Get auth token for current profile
      const decryptedBackupStr = sessionStorage.getItem('decryptedBackup');
      if (!decryptedBackupStr) {
        throw new Error('No backup found');
      }

      const backup = JSON.parse(decryptedBackupStr) as BapMasterBackup;
      const bap = new BAP(backup.xprv);
      bap.importIds(backup.ids);
      
      const master = bap.getId(currentBapId);
      const memberBackup = master?.exportMemberBackup();
      
      if (!memberBackup?.derivedPrivateKey) {
        throw new Error('Invalid profile');
      }

      const { getAuthToken } = await import('bitcoin-auth');
      const requestBody = JSON.stringify({
        ...profile,
        bapId: currentBapId,
        address: currentAddress
      });
      
      const authToken = getAuthToken({
        privateKeyWif: memberBackup.derivedPrivateKey,
        requestPath: '/api/users/profile',
        body: requestBody
      });

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken,
          'X-Decrypted-Backup': decryptedBackupStr
        },
        body: requestBody
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Refresh the BAP profile
      await fetchBAPProfile();
      setShowProfileEditor(false);
      // Clear any errors
      setError('');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
    }
  };

  const handlePublishProfile = async () => {
    // TODO: Implement blockchain publishing
    console.log('Publishing profile to blockchain...');
    alert('Publishing to blockchain will be implemented soon!');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Bitcoin Auth</h1>
              <nav className="hidden sm:flex space-x-4">
                <Link href="/dashboard" className="text-blue-500">
                  Dashboard
                </Link>
                <Link href="/settings/security" className="text-gray-400 hover:text-white">
                  Settings
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <ProfileSwitcher currentBapId={currentBapId} />
              <button
                type="button"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Identity</h2>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setShowProfileEditor(true);
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
              >
                Edit Profile
              </button>
            </div>
            
            <div className="space-y-4">
              {bapProfile?.identity?.image && (
                <div className="flex justify-center mb-6">
                  <img 
                    src={bapProfile.identity.image} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-2 border-gray-700"
                  />
                </div>
              )}

              <div>
                <label className="text-sm text-gray-500">Display Name</label>
                <p className="font-medium">{bapProfile?.identity?.alternateName || session?.user?.name || 'Not set'}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Bio</label>
                <p className="text-sm">{bapProfile?.identity?.description || 'No bio yet'}</p>
              </div>

              <div>
                <label htmlFor="bitcoinAddress" className="text-sm text-gray-500">Bitcoin Address</label>
                <p className="font-mono text-sm break-all">{currentAddress || 'Loading...'}</p>
              </div>

              <div>
                <label htmlFor="identityKey" className="text-sm text-gray-500">Identity Key</label>
                <p className="font-mono text-sm break-all">{currentBapId || 'Loading...'}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link
                  href="/settings"
                  className="block w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-center transition-colors"
                >
                  Manage Linked Accounts
                </Link>
                
                <button
                  type="button"
                  onClick={() => {
                    const encryptedBackup = localStorage.getItem('encryptedBackup');
                    if (encryptedBackup) {
                      const blob = new Blob([encryptedBackup], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `bitcoin-auth-pwa-backup-${new Date().toISOString().split('T')[0]}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    } else {
                      setError('No backup found to download');
                    }
                  }}
                  className="block w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-center transition-colors"
                >
                  Download Backup
                </button>
                
                <button
                  type="button"
                  onClick={() => window.open('https://www.sigmaidentity.com/', '_blank')}
                  className="block w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-center transition-colors"
                >
                  Edit BAP Profile ↗
                </button>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-lg font-semibold mb-4">Account Status</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Authentication</span>
                  <span className="text-sm text-green-500">Active</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Backup Status</span>
                  <span className="text-sm text-green-500">Encrypted</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Session Type</span>
                  <span className="text-sm">Bitcoin Signature</span>
                </div>
              </div>
            </div>

            {/* Device Link QR */}
            <DeviceLinkQR />

            {/* Security Notice */}
            <div className="bg-amber-900/20 border border-amber-900 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <title>Remember</title>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm">
                  <p className="font-semibold text-amber-500 mb-1">Remember</p>
                  <p className="text-amber-400/80">
                    Your Bitcoin private key is your identity. Keep your encryption password safe and never share it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-red-900/20 border border-red-900 rounded-lg p-3 text-red-400 text-sm">
            {error}
          </div>
        )}
      </main>

      {/* Profile Editor Modal */}
      <ProfileEditor
        isOpen={showProfileEditor}
        onClose={() => setShowProfileEditor(false)}
        profile={{
          alternateName: bapProfile?.identity?.alternateName || '',
          image: bapProfile?.identity?.image || '',
          description: bapProfile?.identity?.description || ''
        }}
        onSave={handleSaveProfile}
        onPublish={handlePublishProfile}
      />
    </div>
  );
} 