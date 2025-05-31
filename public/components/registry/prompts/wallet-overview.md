# WalletOverview

Display comprehensive wallet information including balance, recent transactions, and quick actions.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add wallet-overview
```

## Usage

```tsx
import { WalletOverview } from 'bigblocks';

export default function WalletPage() {
  const walletData = {
    balance: 1.234,
    address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    transactions: [
      { id: '1', type: 'received', amount: 0.5, date: '2024-01-15' },
      { id: '2', type: 'sent', amount: 0.1, date: '2024-01-14' }
    ]
  };

  return (
    <WalletOverview
      walletData={walletData}
      onSend={() => console.log('Send clicked')}
      onReceive={() => console.log('Receive clicked')}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| walletData | `WalletData` | - | Wallet information |
| onSend | `() => void` | - | Send button callback |
| onReceive | `() => void` | - | Receive button callback |
| onRefresh | `() => void` | - | Refresh button callback |
| showTransactions | `boolean` | `true` | Show transaction list |
| transactionLimit | `number` | `5` | Number of transactions to show |
| showQRCode | `boolean` | `true` | Show QR code for address |
| currency | `'BSV' \| 'USD'` | `'BSV'` | Display currency |
| theme | `'default' \| 'compact' \| 'detailed'` | `'default'` | Display theme |
| className | `string` | - | Additional CSS classes |

## WalletData Interface

```typescript
interface WalletData {
  balance: number;
  address: string;
  pendingBalance?: number;
  transactions?: Transaction[];
  tokens?: Token[];
  lastUpdate?: Date;
}

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: number;
  date: string;
  address?: string;
  memo?: string;
  status?: 'pending' | 'confirmed';
}
```

## Examples

### Basic Overview

```tsx
<WalletOverview
  walletData={{
    balance: 0.5,
    address: '1Address...'
  }}
/>
```

### With Actions

```tsx
<WalletOverview
  walletData={walletData}
  onSend={() => setShowSendModal(true)}
  onReceive={() => setShowReceiveModal(true)}
  onRefresh={refreshWallet}
/>
```

### Compact Theme

```tsx
<WalletOverview
  walletData={walletData}
  theme="compact"
  showTransactions={false}
/>
```

### USD Display

```tsx
<WalletOverview
  walletData={walletData}
  currency="USD"
  onSend={handleSend}
/>
```

### With Pending Balance

```tsx
<WalletOverview
  walletData={{
    balance: 1.0,
    pendingBalance: 0.5,
    address: '1Address...'
  }}
/>
```

### Limited Transactions

```tsx
<WalletOverview
  walletData={walletData}
  transactionLimit={3}
  onSend={handleSend}
/>
```

### Without QR Code

```tsx
<WalletOverview
  walletData={walletData}
  showQRCode={false}
  onReceive={handleReceive}
/>
```

### Detailed Theme

```tsx
<WalletOverview
  walletData={{
    ...walletData,
    tokens: [
      { name: 'TOKEN1', balance: 100 },
      { name: 'TOKEN2', balance: 50 }
    ]
  }}
  theme="detailed"
/>
```

### In Dashboard

```tsx
function Dashboard() {
  const { walletData, refreshWallet } = useWallet();
  
  return (
    <div className="container mx-auto p-6">
      <h1>My Wallet</h1>
      <WalletOverview
        walletData={walletData}
        onSend={() => router.push('/send')}
        onReceive={() => router.push('/receive')}
        onRefresh={refreshWallet}
        className="mt-6"
      />
    </div>
  );
}
```

## Features

- **Balance Display**: Shows available and pending
- **Transaction History**: Recent activity list
- **Quick Actions**: Send/Receive buttons
- **QR Code**: Easy address sharing
- **Token Support**: Display token balances
- **Refresh**: Update wallet data
- **Responsive**: Mobile-friendly layout

## Transaction Status

- **Pending**: Unconfirmed transactions
- **Confirmed**: Blockchain confirmed
- **Failed**: Transaction errors

## Styling

```tsx
<WalletOverview
  walletData={walletData}
  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6"
  onSend={handleSend}
/>
```

## Integration

Works with wallet hooks:

```tsx
import { useWallet, WalletOverview } from 'bigblocks';

function MyWallet() {
  const { 
    balance, 
    address, 
    transactions,
    sendBSV,
    refreshBalance 
  } = useWallet();
  
  return (
    <WalletOverview
      walletData={{
        balance,
        address,
        transactions
      }}
      onSend={() => {
        // Open send modal
      }}
      onRefresh={refreshBalance}
    />
  );
}
```

## Related Components

- [CompactWalletOverview](/components/compact-wallet-overview) - Minimal view
- [SendBSVButton](/components/send-bsv-button) - Send functionality
- [TokenBalance](/components/token-balance) - Token display