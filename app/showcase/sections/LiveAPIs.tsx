'use client';

import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { getLatestBlockHeight } from '@/lib/block';

interface LiveAPIsSectionProps {
  blockHeight: number | null;
  setBlockHeight: (height: number | null) => void;
  bapProfile: Record<string, unknown> | null;
  setBapProfile: (profile: Record<string, unknown> | null) => void;
  apiLoading: boolean;
  setApiLoading: (loading: boolean) => void;
  bapAddress: string;
  setBapAddress: (address: string) => void;
}

export function LiveAPIsSection({ 
  blockHeight, 
  setBlockHeight, 
  bapProfile, 
  setBapProfile, 
  apiLoading, 
  setApiLoading,
  bapAddress,
  setBapAddress 
}: LiveAPIsSectionProps) {
  const lookupBapProfile = async (address: string) => {
    setApiLoading(true);
    try {
      const response = await fetch(`/api/bap?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setBapProfile(data);
      } else {
        setBapProfile({ error: 'Profile not found' });
      }
    } catch {
      setBapProfile({ error: 'Lookup failed' });
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <section id="api-demos" className="border-b border-gray-800/50 bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">🚀 Live API Demos</h2>
          <p className="text-gray-400 text-lg">Real public APIs integrated with Bitcoin Auth components</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* BSV Block Height */}
          <div className="bg-black border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              BSV Blockchain Height
            </h3>
            <p className="text-gray-400 mb-4">Live data from Bitcoin SV blockchain</p>
            <button
              type="button"
              onClick={async () => {
                setApiLoading(true);
                const { height } = await getLatestBlockHeight();
                setBlockHeight(height);
                setApiLoading(false);
              }}
              disabled={apiLoading}
              className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {apiLoading ? 'Fetching...' : 'Get Latest Block Height'}
            </button>
            {blockHeight && (
              <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700">
                <p className="text-green-400 font-mono text-lg">Block: {blockHeight.toLocaleString()}</p>
                <p className="text-gray-500 text-sm mt-1">Source: Block Headers Service</p>
              </div>
            )}
          </div>

          {/* BAP Profile Lookup */}
          <div className="bg-black border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              BAP Profile Lookup
            </h3>
            <p className="text-gray-400 mb-4">Query Bitcoin addresses for BAP profiles</p>
            <div className="space-y-3">
              <input
                type="text"
                value={bapAddress}
                onChange={(e) => setBapAddress(e.target.value)}
                placeholder="Enter Bitcoin address..."
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => lookupBapProfile(bapAddress)}
                disabled={apiLoading || !bapAddress}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {apiLoading ? 'Looking up...' : 'Lookup BAP Profile'}
              </button>
            </div>
            {bapProfile && (
              <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700">
                {'error' in bapProfile ? (
                  <p className="text-yellow-400">⚠️ {bapProfile.error as string}</p>
                ) : (
                  <>
                    <p className="text-green-400 text-sm">✅ Profile found!</p>
                    <pre className="text-gray-300 text-xs mt-2 overflow-x-auto">
                      {JSON.stringify(bapProfile, null, 2)}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 