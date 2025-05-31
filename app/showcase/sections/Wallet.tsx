'use client';

import React from 'react';
import {
  SendBSVButton,
  WalletOverview,
  TokenBalance,
  DonateButton,
  QuickDonateButton
} from 'bitcoin-auth-ui';
import { TerminalCodeBlock } from '@/components/TerminalCodeBlock';
import { Wallet } from 'lucide-react';

interface WalletSectionProps {
  isClient: boolean;
}

export function WalletSection({ isClient }: WalletSectionProps) {
  // Mock wallet data
  const mockBalance = {
    confirmed: 1000000,
    unconfirmed: 0,
    total: 1000000
  };
  
  const mockTransactions = [
    {
      txid: 'abc123',
      type: 'send' as const,
      amount: -50000,
      to: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      timestamp: new Date().toISOString(),
      status: 'confirmed' as const
    },
    {
      txid: 'def456',
      type: 'receive' as const,
      amount: 100000,
      from: '1BitcoinEaterAddressDontSendf59kuE',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: 'confirmed' as const
    }
  ];

  return (
    <section id="wallet-demos" className="border-b border-gray-800/50 bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">💰 Wallet Components</h2>
          <p className="text-gray-400 text-lg">Send BSV, check balances, and manage transactions</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full">
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-medium">Real Bitcoin Transactions</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Wallet Overview Demo */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Wallet Overview</h3>
              <p className="text-gray-400 mb-4">Complete wallet dashboard component</p>
              
              {/* Backend Requirements */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-red-400 font-semibold mb-2">🔧 Required Backend APIs:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• <code className="text-orange-400">/api/wallet/balance</code> - Get current balance</li>
                  <li>• <code className="text-orange-400">/api/wallet/transactions</code> - Transaction history</li>
                  <li>• <code className="text-orange-400">/api/wallet/utxos</code> - Available UTXOs</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
                <p className="text-yellow-400 text-sm">💸 Demo: Mock wallet data - requires BSV to send!</p>
              </div>
              
              {isClient ? (
                <WalletOverview
                  balance={mockBalance}
                  showValues={true}
                  currency="BSV"
                  exchangeRate={150}
                  onSend={() => {
                    console.log('Send clicked');
                  }}
                  onReceive={() => {
                    console.log('Receive clicked');
                  }}
                />
              ) : (
                <div className="animate-pulse bg-gray-800 h-64 rounded-lg" />
              )}
            </div>
          </div>

          {/* Send & Donate Actions */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Transaction Actions</h3>
              <p className="text-gray-400 mb-4">Send BSV and donations</p>
              
              {/* Funding Notice */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <h4 className="text-yellow-400 font-semibold mb-2">💰 Requires BSV Funding</h4>
                <p className="text-sm text-gray-300">These components need real BSV to function</p>
              </div>
            </div>
            
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 space-y-6">
              {/* Send BSV */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Send BSV</h4>
                {isClient ? (
                  <SendBSVButton
                    onSuccess={(txid) => {
                      console.log('Sent:', txid);
                    }}
                    onError={(error) => {
                      console.error('Send error:', error);
                    }}
                    buttonText="Send BSV"
                    variant="solid"
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />
                )}
              </div>

              {/* Donate Buttons */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Donation Components</h4>
                <div className="space-y-3">
                  {isClient ? (
                    <>
                      <DonateButton
                        donationAddress="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                        onDonate={(amount, txid) => {
                          console.log('Donation sent:', amount, 'sats, txid:', txid);
                        }}
                        onError={(error) => {
                          console.error('Donation error:', error);
                        }}
                        buttonText="Donate with QR"
                        showQR={true}
                        variant="outline"
                      />
                      
                      <QuickDonateButton
                        donationAddress="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                        amount={100000}
                        onDonate={(amount, txid) => {
                          console.log('Quick donation sent:', amount, 'sats, txid:', txid);
                        }}
                        onError={(error) => {
                          console.error('Quick donation error:', error);
                        }}
                        variant="solid"
                      />
                    </>
                  ) : (
                    <>
                      <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />
                      <div className="animate-pulse bg-gray-800 h-12 rounded-lg" />
                    </>
                  )}
                </div>
              </div>

              {/* Token Balance */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Token Balance</h4>
                {isClient ? (
                  <TokenBalance
                    tokens={[{
                      id: 'PEPE',
                      symbol: 'PEPE',
                      name: 'Pepe Token',
                      decimals: 8,
                      balance: {
                        confirmed: '1000000',
                        unconfirmed: '0',
                        total: '1000000'
                      },
                      listed: {
                        confirmed: '0',
                        unconfirmed: '0',
                        total: '0'
                      },
                      price: 0.00001,
                      type: 'bsv20'
                    }]}
                    showValues={true}
                    currency="USD"
                  />
                ) : (
                  <div className="animate-pulse bg-gray-800 h-16 rounded-lg" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Code Examples */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TerminalCodeBlock
            code={`import { 
  SendBSVButton,
  DonateButton,
  QuickDonateButton 
} from 'bitcoin-auth-ui';

// Send BSV
<SendBSVButton
  onSuccess={(txid) => {
    toast.success(\`Transaction sent: \${txid}\`);
  }}
  onError={(error) => {
    toast.error(error.message);
  }}
  buttonText="Send BSV"
  showFeeEstimate={true}
  variant="solid"
/>

// Donation with QR
<DonateButton
  address={donationAddress}
  onSuccess={(txid) => {
    toast.success('Thank you for donating!');
  }}
  showQR={true}
  variant="outline"
/>

// Quick donation presets
<QuickDonateButton
  address={donationAddress}
  amounts={[100000, 500000, 1000000]}
  onSuccess={handleDonationSuccess}
/>`}
            language="jsx"
            filename="WalletActions.jsx"
          />

          <TerminalCodeBlock
            code={`import { 
  WalletOverview,
  TokenBalance,
  useSendBSV 
} from 'bitcoin-auth-ui';

function CustomWallet() {
  const { data: balance } = useWalletBalance();
  const { data: txs } = useTransactions();
  const sendBSV = useSendBSV();
  
  const handleSend = async (to, amount) => {
    try {
      const result = await sendBSV.mutateAsync({
        to,
        amount,
        fee: 1
      });
      console.log('Sent:', result.txid);
    } catch (error) {
      console.error('Send failed:', error);
    }
  };
  
  return (
    <WalletOverview
      balance={balance}
      recentTransactions={txs}
      onTransactionClick={(txid) => {
        window.open(\`https://whatsonchain.com/tx/\${txid}\`);
      }}
      showTokens={true}
      variant="default"
    />
  );
}`}
            language="jsx"
            filename="CustomWallet.jsx"
          />
        </div>
      </div>
    </section>
  );
}