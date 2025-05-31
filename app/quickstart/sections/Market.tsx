'use client';

import React, { useState } from 'react';
import {
  CreateListingButton,
  BuyListingButton,
  MarketTable,
  type MarketListing,
  type AssetType
} from 'bigblocks';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { Store } from 'lucide-react';

interface MarketSectionProps {
  isClient: boolean;
}

export function MarketSection({ isClient }: MarketSectionProps) {
  const [selectedListing, setSelectedListing] = useState<MarketListing | null>(null);
  
  // Mock market data
  const mockListings: MarketListing[] = [
    {
      txid: '123abc',
      vout: 0,
      priceSats: 100000,
      payAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      ordAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
      assetType: 'ordinals' as AssetType,
      origin: '123abc_0',
      contentType: 'image/webp',
      createdAt: Date.now(),
      seller: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      height: 895234
    },
    {
      txid: '456def',
      vout: 0,
      priceSats: 500000,
      payAddress: '1BitcoinEaterAddressDontSendf59kuE',
      ordAddress: '1C5bSj1iEGUgSTbziymG7Cn18ENQuT36vv',
      assetType: 'bsv20' as AssetType,
      tokenId: 'PEPE',
      tokenAmount: '1000',
      symbol: 'PEPE',
      decimals: 8,
      createdAt: Date.now() - 86400000,
      seller: '1BitcoinEaterAddressDontSendf59kuE',
      height: 895100
    }
  ];

  return (
    <section className="border-b border-gray-800/50 bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">🛒 Marketplace Components</h2>
          <p className="text-gray-400 text-lg">Complete marketplace functionality with Bitcoin payments</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full">
            <Store className="w-4 h-4" />
            <span className="text-sm font-medium">Buy & Sell with BSV</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Market Table Demo */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Market Listings</h3>
              <p className="text-gray-400 mb-4">Browse and select items for purchase</p>
              
              {/* Backend Requirements */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend APIs:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <code className="text-orange-400">/api/market/listings</code> - Fetch active listings</li>
                  <li>• <code className="text-orange-400">/api/market/create</code> - Create new listing</li>
                  <li>• <code className="text-orange-400">/api/market/buy</code> - Process purchase transaction</li>
                  <li>• <code className="text-orange-400">/api/ordinals/utxos</code> - Get user's ordinals</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
                <p className="text-purple-400 text-sm">💰 Demo: Mock marketplace data - requires BSV to purchase!</p>
              </div>
              
              {isClient ? (
                <MarketTable
                  listings={mockListings}
                />
              ) : (
                <div className="animate-pulse bg-gray-800 h-64 rounded-lg" />
              )}
            </div>
          </div>

          {/* Create & Buy Actions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Market Actions</h3>
              <p className="text-gray-400 mb-4">Create listings and purchase items</p>
              
              {/* Funding Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-yellow-400 font-semibold mb-2">💰 Requires BSV Funding</h4>
                <p className="text-sm text-gray-300">These components need real BSV to create/buy listings</p>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-6">
              {/* Create Listing */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Create Listing</h4>
                {isClient ? (
                  <CreateListingButton
                    onSuccess={(result) => {
                      console.log('Listing created:', result);
                    }}
                    onError={(error) => {
                      console.error('Create listing error:', error);
                    }}
                    buttonText="List Item for Sale"
                    variant="solid"
                    size="3"
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />
                )}
              </div>

              {/* Buy Listing */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Buy Listing</h4>
                {isClient && selectedListing ? (
                  <BuyListingButton
                    listing={selectedListing}
                    onSuccess={(txid) => {
                      console.log('Purchase successful:', txid);
                    }}
                    onError={(error) => {
                      console.error('Purchase error:', error);
                    }}
                    buttonText="Buy Now"
                    showDetails={true}
                    className="w-full"
                  />
                ) : !isClient ? (
                  <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />
                ) : (
                  <div className="w-full bg-gray-700 text-gray-400 font-semibold py-3 px-6 rounded-lg text-center">
                    Select a listing from the table to buy
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TerminalCodeBlock
            code={`import { 
  CreateListingButton,
  BuyListingButton,
  useCreateListing,
  useBuyListing 
} from 'bigblocks';

// Create listing
<CreateListingButton
  onSuccess={(result) => {
    toast.success('Listing created!');
    router.push(\`/market/\${result.txid}\`);
  }}
  onError={(error) => {
    toast.error(error.message);
  }}
  buttonText="List Item for Sale"
  variant="solid"
  size="3"
/>

// Buy listing  
<BuyListingButton
  listing={selectedListing}
  onSuccess={(txid) => {
    toast.success('Purchase successful!');
    refetchListings();
  }}
  onError={(error) => {
    toast.error(error.message);
  }}
  buttonText="Buy Now"
  showDetails={true}
/>`}
            language="jsx"
            filename="MarketActions.jsx"
          />

          <TerminalCodeBlock
            code={`import { useCreateListing } from 'bigblocks';

function CustomCreateForm() {
  const createListing = useCreateListing();
  
  const handleSubmit = async (formData) => {
    try {
      const result = await createListing.mutateAsync({
        assetType: 'ordinals',
        price: formData.price,
        utxo: formData.selectedUtxo,
        payAddress: user.address,
        ordAddress: user.ordAddress
      });
      
      console.log('Created:', result.txid);
    } catch (error) {
      console.error('Failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Custom form UI */}
    </form>
  );
}`}
            language="jsx"
            filename="CustomMarketForm.jsx"
          />
        </div>
      </div>
    </section>
  );
}