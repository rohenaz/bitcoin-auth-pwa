'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/site.config';
import { Footer } from '@/components/Footer';

export default function Home() {
  const router = useRouter();
  const [hasBackup, setHasBackup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Check if user has an encrypted backup
    const encryptedBackup = localStorage.getItem('encryptedBackup');
    if (encryptedBackup) {
      setHasBackup(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    if (hasBackup) {
      router.push('/signin');
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
            left: `${mousePosition.x - 400}px`,
            top: `${mousePosition.y - 400}px`,
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.3s ease-out',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      </div>

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Professional Bitcoin Development Platform
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300%">
                {siteConfig.name}
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl text-gray-300 font-light">
              {siteConfig.tagline}
            </p>
          </div>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {siteConfig.description}
          </p>

          <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            {/* Primary Action Button */}
            <div className="relative group">
              <button
                type="button"
                onClick={handleGetStarted}
                disabled={loading}
                className="relative w-full px-8 py-4 bg-gray-900/90 backdrop-blur-sm text-white rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-xl bg-gradient-conic from-blue-400 via-purple-500 to-pink-500 p-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-[2px] bg-gray-900 rounded-[10px]" />
                </div>
                
                {/* Rotating gradient overlay for border animation */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-xl bg-gradient-conic from-blue-400 via-purple-500 to-pink-500 animate-spin-slow" style={{
                    mask: 'radial-gradient(farthest-side at center, transparent calc(100% - 2px), black calc(100% - 2px))',
                    WebkitMask: 'radial-gradient(farthest-side at center, transparent calc(100% - 2px), black calc(100% - 2px))'
                  }} />
                </div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-r from-blue-400/30 via-purple-500/30 to-pink-500/30 scale-110" />
                
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {loading ? 'Loading...' : hasBackup ? 'Continue to Sign In' : 'Get Started'}
                </span>
              </button>
              
              {hasBackup && (
                <Link
                  href="/signup"
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-400 hover:text-white transition-colors underline-offset-4 hover:underline whitespace-nowrap"
                >
                  Create new identity instead
                </Link>
              )}
            </div>

            {/* Developer Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <Link
                href="/components"
                className="group relative px-6 py-3 bg-gray-900/50 backdrop-blur-sm text-gray-300 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
              >
                {/* Subtle orange border animation */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500/40 via-yellow-500/40 to-orange-500/40 p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-[1px] bg-gray-900/80 rounded-[7px]" />
                </div>
                
                {/* Orange glow */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-md bg-orange-500/20" />
                
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Component Library
                </span>
              </Link>
              
              <Link
                href="/mcp-server"
                className="group relative px-6 py-3 bg-gray-900/50 backdrop-blur-sm text-gray-300 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
              >
                {/* Subtle purple border animation */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-purple-500/40 p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-[1px] bg-gray-900/80 rounded-[7px]" />
                </div>
                
                {/* Purple glow */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-md bg-purple-500/20" />
                
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
                  </svg>
                  MCP Server
                </span>
              </Link>

              <a
                href="https://marketplace.visualstudio.com/items?itemName=Satchmo.bitcoin"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-6 py-3 bg-gray-900/50 backdrop-blur-sm text-gray-300 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
              >
                {/* Subtle blue border animation */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/40 via-cyan-500/40 to-blue-500/40 p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-[1px] bg-gray-900/80 rounded-[7px]" />
                </div>
                
                {/* Blue glow */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-md bg-blue-500/20" />
                
                <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  VS Code Extension
                </span>
              </a>

            </div>
          </div>

          {/* Developer Trust Indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mt-12">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <title>Open Source Icon</title>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <title>Production Ready Icon</title>
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Production Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <title>TypeScript Icon</title>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>TypeScript</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                Professional Bitcoin Development Tools
              </span>
            </h2>
            <p className="text-xl text-gray-400">Everything you need to build Bitcoin applications</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <title>Bitcoin Native Icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Bitcoin Development Tools</h3>
                <p className="text-gray-400 leading-relaxed">
                  Complete toolkit for building Bitcoin applications with authentication, wallets, and blockchain integration.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <title>Zero Knowledge Icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Component Library</h3>
                <p className="text-gray-400 leading-relaxed">
                  Production-ready React components for Bitcoin authentication, wallets, and social features.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <title>Cross-Device Sync Icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">VS Code Integration</h3>
                <p className="text-gray-400 leading-relaxed">
                  Professional Bitcoin development experience with syntax highlighting, snippets, and tools.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <title>Signature Auth Icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">MCP Server Support</h3>
                <p className="text-gray-400 leading-relaxed">
                  Model Context Protocol server for AI assistants to interact with Bitcoin blockchain and tools.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <title>Instant Setup Icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Production Ready</h3>
                <p className="text-gray-400 leading-relaxed">
                  Battle-tested components and tools ready for enterprise Bitcoin applications and real-world deployment.
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <title>Open Source Icon</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Open Source</h3>
                <p className="text-gray-400 leading-relaxed">
                  Fully open-source Bitcoin development platform. Contribute, customize, and build with transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-400">Four simple steps to self-sovereign identity</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 1 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-start space-x-4 bg-gray-900/50 backdrop-blur-xl rounded-lg p-6 border border-gray-800">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-white">Generate Bitcoin Identity</h3>
                  <p className="text-gray-400 leading-relaxed">
                    We create a unique Bitcoin keypair in your browser. This becomes your permanent identity - no registration required.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-start space-x-4 bg-gray-900/50 backdrop-blur-xl rounded-lg p-6 border border-gray-800">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-white">Encrypt with Password</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Your private key is encrypted with a password you choose. This happens entirely in your browser - we never see your keys.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-start space-x-4 bg-gray-900/50 backdrop-blur-xl rounded-lg p-6 border border-gray-800">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-white">Link Cloud Backup</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Connect your Google, GitHub, or X account to store your encrypted backup. These services act as storage only - not for authentication.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-start space-x-4 bg-gray-900/50 backdrop-blur-xl rounded-lg p-6 border border-gray-800">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-white">Sign Everything</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Every request to the server is signed with your Bitcoin private key. No passwords are ever transmitted or stored on servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-950/50 to-black" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Trusted by Bitcoiners
              </span>
            </h2>
            <p className="text-xl text-gray-400">What the community says about Bitcoin Auth</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/30 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={`star-${i}`} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <title>Star Rating</title>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">"Finally, authentication that respects my sovereignty. No more password databases!"</p>
              <p className="text-sm text-gray-500">- Anonymous Bitcoiner</p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={`star-${i}`} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <title>Star Rating</title>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">"The future of authentication is here. Bitcoin Auth just makes sense."</p>
              <p className="text-sm text-gray-500">- Satoshi Enthusiast</p>
            </div>
            
            <div className="bg-gray-900/30 backdrop-blur-xl rounded-xl p-6 border border-gray-800/50">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={`star-${i}`} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <title>Star Rating</title>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-4">"Clean implementation, great UX. This is how auth should work."</p>
              <p className="text-sm text-gray-500">- Privacy Advocate</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Own Your Identity?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the growing community of users who have taken control of their digital identity with Bitcoin Auth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              type="button"
              onClick={handleGetStarted}
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-medium text-xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl hover:shadow-blue-500/30"
            >
              <span className="relative z-10">
                {hasBackup ? 'Continue Your Journey' : 'Start Your Journey'}
              </span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
            </button>
            
            <a 
              href="https://github.com/b-open-io/bitcoin-auth" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 border border-gray-700 hover:border-gray-600 rounded-lg font-medium text-lg transition-all hover:bg-gray-900/50"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
