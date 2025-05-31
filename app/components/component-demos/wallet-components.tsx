/**
 * Wallet Component Demos
 */

import React from 'react';
import { 
  SendBSVButton,
  WalletOverview,
  TokenBalance,
  DonateButton,
  CompactWalletOverview,
  QuickSendButton,
  QuickDonateButton
} from 'bigblocks';
import type { ComponentDemo } from './index';

export const walletDemos: Array<[string, ComponentDemo]> = [
  [
    'send-bsv-button',
    {
      id: 'send-bsv-button',
      render: (props) => (
        <SendBSVButton
          onSuccess={(result) => {
            console.log('Transaction sent:', result);
            props.onSuccess?.(result);
          }}
          onError={(error) => {
            console.error('Send error:', error);
            props.onError?.(error);
          }}
        />
      )
    }
  ],
  [
    'wallet-overview',
    {
      id: 'wallet-overview',
      render: () => (
        <WalletOverview />
      )
    }
  ],
  [
    'token-balance',
    {
      id: 'token-balance',
      render: () => (
        <TokenBalance
          tokens={[
            {
              id: 'bsv20-ordi',
              symbol: 'ORDI',
              name: 'Ordinals BSV',
              type: 'bsv20' as const,
              decimals: 8,
              balance: {
                confirmed: '1000000000000',
                unconfirmed: '200000000000', 
                total: '1200000000000'
              },
              listed: {
                confirmed: '100000000000',
                unconfirmed: '0',
                total: '100000000000'
              },
              price: 0.25,
              value: 3000
            },
            {
              id: '1sat-demo',
              symbol: '1SAT',
              name: '1Sat Ordinals',
              type: 'bsv21' as const,
              decimals: 0,
              balance: {
                confirmed: '5000',
                unconfirmed: '100',
                total: '5100'
              },
              listed: {
                confirmed: '0',
                unconfirmed: '0',
                total: '0'
              },
              price: 0.001,
              value: 5.1
            }
          ]}
          showValues={true}
          currency="USD"
          onToggleValues={() => console.log('Toggle values')}
          onViewDetails={(token) => console.log(`View ${token.symbol}`)}
          onSendToken={(token) => console.log(`Send ${token.symbol}`)}
        />
      )
    }
  ],
  [
    'donate-button',
    {
      id: 'donate-button',
      render: () => (
        <div className="space-y-4">
          <DonateButton />
          <p className="text-sm text-gray-500">Click to open donation modal with preset amounts</p>
        </div>
      )
    }
  ],
  [
    'compact-wallet-overview',
    {
      id: 'compact-wallet-overview',
      render: () => (
        <CompactWalletOverview />
      )
    }
  ],
  [
    'quick-send-button',
    {
      id: 'quick-send-button',
      render: () => (
        <div className="flex items-center gap-4">
          <QuickSendButton
            amount="0.001"
            recipient="1QuickRecipient..."
          />
          <span className="text-sm text-gray-500">Send 0.001 BSV instantly</span>
        </div>
      )
    }
  ],
  [
    'quick-donate-button',
    {
      id: 'quick-donate-button',
      render: () => (
        <div className="flex items-center gap-4">
          <QuickDonateButton />
          <span className="text-sm text-gray-500">Donate 0.01 BSV with one click</span>
        </div>
      )
    }
  ]
];