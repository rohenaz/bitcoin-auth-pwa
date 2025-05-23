'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [hasBackup, setHasBackup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has an encrypted backup
    const encryptedBackup = localStorage.getItem('encryptedBackup');
    if (encryptedBackup) {
      setHasBackup(true);
    }
    setLoading(false);
  }, []);

  const handleGetStarted = () => {
    if (hasBackup) {
      router.push('/signin');
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Bitcoin Auth
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300">
              Self-sovereign identity powered by Bitcoin
            </p>
          </div>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Your Bitcoin keys are your identity. No usernames, no passwords stored on servers. 
            Just pure cryptographic authentication with encrypted cloud backup.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleGetStarted}
              disabled={loading}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium text-lg transition-all transform hover:scale-105"
            >
              {loading ? 'Loading...' : hasBackup ? 'Continue to Sign In' : 'Get Started'}
            </button>
            
            {hasBackup && (
              <Link
                href="/signup"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Create new identity instead
              </Link>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Your Keys, Your Identity</h3>
              <p className="text-sm text-gray-400">
                Bitcoin keypairs as the fundamental identity primitive
              </p>
            </div>

            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Client-Side Encryption</h3>
              <p className="text-sm text-gray-400">
                Private keys never leave your browser unencrypted
              </p>
            </div>

            <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Multi-Device Sync</h3>
              <p className="text-sm text-gray-400">
                Encrypted backups via OAuth providers for seamless access
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Generate Bitcoin Identity</h3>
                <p className="text-gray-400">
                  We create a unique Bitcoin keypair in your browser. This becomes your permanent identity - no registration required.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Encrypt with Password</h3>
                <p className="text-gray-400">
                  Your private key is encrypted with a password you choose. This happens entirely in your browser - we never see your keys.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Link Cloud Backup</h3>
                <p className="text-gray-400">
                  Connect your Google, GitHub, or X account to store your encrypted backup. These services act as storage only - not for authentication.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Sign Everything</h3>
                <p className="text-gray-400">
                  Every request to the server is signed with your Bitcoin private key. No passwords are ever transmitted or stored on servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-900">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <p>Built with ❤️ for the decentralized web</p>
          <div className="mt-4 space-x-6">
            <Link href="/signin" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-white transition-colors">
              Sign Up
            </Link>
            <a 
              href="https://github.com/b-open-io/bitcoin-auth" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
