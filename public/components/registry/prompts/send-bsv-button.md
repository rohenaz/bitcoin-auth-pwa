# SendBSVButton

Send Bitcoin SV with a simple button interface. Handles transaction creation, signing, and broadcasting.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add send-bsv-button
```

## Usage

```tsx
import { SendBSVButton } from 'bigblocks';

export default function WalletActions() {
  return (
    <SendBSVButton
      address="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
      amount={0.001}
      onSuccess={(txid) => {
        console.log('Transaction sent:', txid);
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| address | `string` | - | Recipient Bitcoin address |
| amount | `number` | - | Amount in BSV to send |
| onSuccess | `(txid: string) => void` | - | Success callback with transaction ID |
| onError | `(error: Error) => void` | - | Error callback |
| label | `string` | `'Send BSV'` | Button label |
| memo | `string` | - | Optional transaction memo |
| disabled | `boolean` | `false` | Disable the button |
| requireConfirmation | `boolean` | `true` | Show confirmation dialog |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| className | `string` | - | Additional CSS classes |

## Features

- **Transaction Building**: Automatic UTXO selection
- **Fee Calculation**: Dynamic fee estimation
- **Confirmation Dialog**: Optional user confirmation
- **Error Handling**: Comprehensive error states
- **Loading States**: Transaction broadcasting feedback
- **Memo Support**: Add optional OP_RETURN data

## Examples

### Basic Send

```tsx
<SendBSVButton
  address="1BitcoinAddress..."
  amount={0.01}
  onSuccess={(txid) => {
    toast.success(`Sent! TX: ${txid}`);
  }}
/>
```

### With Memo

```tsx
<SendBSVButton
  address="1BitcoinAddress..."
  amount={0.001}
  memo="Payment for coffee"
  onSuccess={handleSuccess}
/>
```

### Skip Confirmation

```tsx
<SendBSVButton
  address={recipientAddress}
  amount={amount}
  requireConfirmation={false}
  onSuccess={handleSuccess}
/>
```

### Custom Label

```tsx
<SendBSVButton
  address={address}
  amount={0.1}
  label="Pay Invoice"
  onSuccess={handleSuccess}
/>
```

### Different Sizes

```tsx
// Small
<SendBSVButton size="sm" {...props} />

// Medium (default)
<SendBSVButton size="md" {...props} />

// Large
<SendBSVButton size="lg" {...props} />
```

### With Error Handling

```tsx
<SendBSVButton
  address={address}
  amount={amount}
  onSuccess={(txid) => {
    console.log('Success:', txid);
    router.push('/transactions');
  }}
  onError={(error) => {
    if (error.code === 'INSUFFICIENT_FUNDS') {
      toast.error('Not enough BSV');
    } else {
      toast.error(error.message);
    }
  }}
/>
```

### In Payment Form

```tsx
function PaymentForm() {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0);
  
  return (
    <form>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Recipient address"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Amount"
      />
      <SendBSVButton
        address={address}
        amount={amount}
        disabled={!address || !amount}
        onSuccess={(txid) => {
          toast.success('Payment sent!');
          setAddress('');
          setAmount(0);
        }}
      />
    </form>
  );
}
```

## Funding Requirements

This component requires BSV balance to function:
- Wallet must have sufficient funds
- Transaction fees are calculated automatically
- Insufficient funds will show error state

## Security

- Private keys never leave the browser
- Transactions signed client-side
- Confirmation dialog prevents accidents
- Address validation before sending

## Styling

```tsx
<SendBSVButton
  address={address}
  amount={amount}
  className="w-full bg-green-600 hover:bg-green-700"
  onSuccess={handleSuccess}
/>
```

## Integration

Works with wallet hooks:

```tsx
import { useWallet, SendBSVButton } from 'bigblocks';

function WalletUI() {
  const { balance } = useWallet();
  
  return (
    <div>
      <p>Balance: {balance} BSV</p>
      <SendBSVButton
        address="1Address..."
        amount={0.001}
        disabled={balance < 0.001}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
```

## Related Components

- [DonateButton](/components/donate-button) - Accept donations
- [QuickSendButton](/components/quick-send-button) - Quick send
- [WalletOverview](/components/wallet-overview) - Show balance