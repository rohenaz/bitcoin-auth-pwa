'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BAPProfile {
  '@context': string;
  '@type': string;
  '@id': string;
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
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bapProfile, setBapProfile] = useState<BAPProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchBAPProfile = async () => {
      if (!session?.user?.address) return;

      try {
        const response = await fetch(`/api/bap?address=${session.user.address}`);
        if (!response.ok) {
          if (response.status === 404) {
            // This is expected for unpublished BAP IDs
            console.log('BAP profile not published on-chain yet');
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
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchBAPProfile();
    }
  }, [session]);

  const handleSignOut = async () => {
    // Only clear session storage, preserve encrypted backup in localStorage
    sessionStorage.removeItem('decryptedBackup');
    
    // Sign out
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-semibold mb-4">Your Identity</h2>
            
            <div className="space-y-4">
              {bapProfile?.image && (
                <div className="flex justify-center mb-6">
                  <img 
                    src={bapProfile.image} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-2 border-gray-700"
                  />
                </div>
              )}

              <div>
                <label className="text-sm text-gray-500">Name</label>
                <p className="font-medium">{bapProfile?.name || 'Not set'}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Handle</label>
                <p className="font-medium">{bapProfile?.alternateName || 'Not set'}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Description</label>
                <p className="text-sm">{bapProfile?.description || 'No description'}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Bitcoin Address</label>
                <p className="font-mono text-sm break-all">{session?.user?.address}</p>
              </div>

              <div>
                <label className="text-sm text-gray-500">Identity Key</label>
                <p className="font-mono text-sm break-all">{session?.user?.idKey}</p>
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
    </div>
  );
} 