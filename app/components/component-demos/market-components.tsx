/**
 * Market Component Demos
 */

import React from 'react';
import { 
  CreateListingButton,
  BuyListingButton,
  MarketTable,
  QuickListButton,
  QuickBuyButton,
  CompactMarketTable
} from 'bitcoin-auth-ui';
import type { ComponentDemo } from './index';

export const marketDemos: Array<[string, ComponentDemo]> = [
  [
    'create-listing-button',
    {
      id: 'create-listing-button',
      render: (props) => (
        <CreateListingButton
          onSuccess={(txid) => {
            console.log('Listing created, txid:', txid);
            props.onSuccess?.(txid);
          }}
          onError={(error) => {
            console.error('Listing error:', error);
            props.onError?.(error);
          }}
        />
      )
    }
  ],
  [
    'buy-listing-button',
    {
      id: 'buy-listing-button',
      render: (props) => (
        <BuyListingButton
          listing={{
            txid: 'demo-tx-123',
            vout: 0,
            priceSats: 1000,
            payAddress: '1BitcoinAddress...',
            ordAddress: '1OrdinalAddress...',
            assetType: 'ordinal' as any
          }}
          onSuccess={(txid) => {
            console.log('Purchase complete, txid:', txid);
            props.onSuccess?.(txid);
          }}
          onError={(error) => {
            console.error('Purchase error:', error);
            props.onError?.(error);
          }}
        />
      )
    }
  ],
  [
    'market-table',
    {
      id: 'market-table',
      render: () => (
        <MarketTable
          listings={[
            {
              txid: 'tx-1',
              vout: 0,
              priceSats: 10000,
              payAddress: '1PayAddress...',
              ordAddress: '1OrdAddress...',
              assetType: 'ordinal' as any,
              contentType: 'image/png',
              seller: '1BitcoinAddress...',
              createdAt: Date.now()
            },
            {
              txid: 'tx-2',
              vout: 0,
              priceSats: 50000,
              payAddress: '1PayAddress2...',
              ordAddress: '1OrdAddress2...',
              assetType: 'ordinal' as any,
              contentType: 'text/plain',
              seller: '1AnotherAddress...',
              createdAt: Date.now()
            }
          ]}
          onListingClick={(listing) => console.log('Selected:', listing)}
        />
      )
    }
  ],
  [
    'quick-list-button',
    {
      id: 'quick-list-button',
      render: (props) => (
        <div className="flex items-center gap-4">
          <QuickListButton
            asset={{
              type: 'ordinal' as any,
              id: 'demo-asset-123',
              utxo: {
                txid: 'asset-tx-123',
                vout: 0,
                satoshis: 1
              } as any
            }}
            onSuccess={(txid) => {
              console.log('Quick listing created:', txid);
              props.onSuccess?.(txid);
            }}
            onError={(error) => {
              console.error('Quick list error:', error);
              props.onError?.(error);
            }}
          />
          <span className="text-gray-500">One-click listing creation</span>
        </div>
      )
    }
  ],
  [
    'quick-buy-button',
    {
      id: 'quick-buy-button',
      render: (props) => (
        <div className="flex items-center gap-4">
          <QuickBuyButton
            listing={{
              txid: 'demo-tx-456',
              vout: 0,
              priceSats: 2500,
              payAddress: '1QuickPay...',
              ordAddress: '1QuickOrd...',
              assetType: 'ordinal' as any
            }}
            onSuccess={(txid) => {
              console.log('Quick purchase complete:', txid);
              props.onSuccess?.(txid);
            }}
            onError={(error) => {
              console.error('Quick buy error:', error);
              props.onError?.(error);
            }}
          />
          <span className="text-gray-500">Instant purchase button</span>
        </div>
      )
    }
  ],
  [
    'compact-market-table',
    {
      id: 'compact-market-table',
      render: () => (
        <CompactMarketTable
          listings={[
            {
              txid: 'compact-1',
              vout: 0,
              priceSats: 5000,
              payAddress: '1CompactPay...',
              ordAddress: '1CompactOrd...',
              assetType: 'ordinal' as any,
              contentType: 'image/png',
              seller: '1Seller1...',
              createdAt: Date.now()
            },
            {
              txid: 'compact-2',
              vout: 0,
              priceSats: 15000,
              payAddress: '1CompactPay2...',
              ordAddress: '1CompactOrd2...',
              assetType: 'token' as any,
              contentType: 'application/json',
              seller: '1Seller2...',
              createdAt: Date.now() - 3600000
            }
          ]}
        />
      )
    }
  ]
];