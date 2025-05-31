# DonateButton

Accept Bitcoin donations with customizable preset amounts and a beautiful UI.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add donate-button
```

## Usage

```tsx
import { DonateButton } from 'bigblocks';

export default function SupportSection() {
  return (
    <DonateButton
      address="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
      amounts={[0.001, 0.01, 0.1]}
      onSuccess={(amount, txid) => {
        console.log(`Received ${amount} BSV! TX: ${txid}`);
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| address | `string` | - | Donation recipient address |
| amounts | `number[]` | `[0.001, 0.01, 0.1]` | Preset donation amounts |
| onSuccess | `(amount: number, txid: string) => void` | - | Success callback |
| onError | `(error: Error) => void` | - | Error callback |
| label | `string` | `'Donate'` | Button label |
| currency | `'BSV' \| 'USD'` | `'BSV'` | Display currency |
| allowCustom | `boolean` | `true` | Allow custom amounts |
| message | `string` | - | Default donation message |
| showQR | `boolean` | `false` | Show QR code option |
| theme | `'default' \| 'minimal' \| 'colorful'` | `'default'` | Visual theme |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| className | `string` | - | Additional CSS classes |

## Features

- **Preset Amounts**: Quick selection buttons
- **Custom Amounts**: Optional custom input
- **QR Code**: Optional QR display
- **Messages**: Donation messages support
- **Currency Display**: BSV or USD pricing
- **Beautiful UI**: Multiple theme options
- **Mobile Friendly**: Responsive design

## Examples

### Basic Donations

```tsx
<DonateButton
  address="1YourAddress..."
  amounts={[0.001, 0.01, 0.1]}
  onSuccess={(amount, txid) => {
    toast.success(`Thank you for donating ${amount} BSV!`);
  }}
/>
```

### USD Display

```tsx
<DonateButton
  address="1YourAddress..."
  amounts={[1, 5, 10]} // USD amounts
  currency="USD"
  onSuccess={handleDonation}
/>
```

### With Custom Amount

```tsx
<DonateButton
  address="1YourAddress..."
  amounts={[0.01, 0.1, 1]}
  allowCustom={true}
  onSuccess={handleDonation}
/>
```

### Minimal Theme

```tsx
<DonateButton
  address="1YourAddress..."
  theme="minimal"
  amounts={[0.001, 0.01]}
  onSuccess={handleDonation}
/>
```

### With QR Code

```tsx
<DonateButton
  address="1YourAddress..."
  showQR={true}
  amounts={[0.01, 0.1, 1]}
  onSuccess={handleDonation}
/>
```

### Custom Label

```tsx
<DonateButton
  address="1YourAddress..."
  label="Support This Project"
  amounts={[0.01, 0.05, 0.1]}
  onSuccess={handleDonation}
/>
```

### With Default Message

```tsx
<DonateButton
  address="1YourAddress..."
  message="Thanks for supporting open source!"
  amounts={[0.001, 0.01, 0.1]}
  onSuccess={handleDonation}
/>
```

### In Support Page

```tsx
function SupportPage() {
  const donationAddress = "1YourAddress...";
  
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2>Support Our Work</h2>
      <p>Your donations help keep this project running.</p>
      
      <DonateButton
        address={donationAddress}
        amounts={[0.01, 0.05, 0.1, 0.5]}
        allowCustom={true}
        showQR={true}
        message="Supporting open source development"
        onSuccess={(amount, txid) => {
          // Track donation
          analytics.track('donation_completed', {
            amount,
            txid
          });
          // Show thank you
          toast.success('Thank you for your support!');
        }}
      />
      
      <p className="mt-4 text-sm text-gray-600">
        All donations go directly to development costs.
      </p>
    </div>
  );
}
```

### Different Sizes

```tsx
// Small
<DonateButton size="sm" {...props} />

// Medium (default)
<DonateButton size="md" {...props} />

// Large
<DonateButton size="lg" {...props} />
```

## Donation Flow

1. User clicks donate button
2. Modal shows amount selection
3. User picks preset or enters custom
4. Optional: Add donation message
5. Confirm and send transaction
6. Success feedback with TX ID

## Styling

Customize appearance:

```tsx
<DonateButton
  address="1YourAddress..."
  className="bg-gradient-to-r from-yellow-400 to-orange-500"
  theme="colorful"
  onSuccess={handleDonation}
/>
```

## QR Code Integration

When `showQR` is enabled:
- Shows QR code with bitcoin: URI
- Includes amount in QR data
- Mobile wallet compatible
- Fallback to manual send

## Related Components

- [QuickDonateButton](/components/quick-donate-button) - One-click donate
- [SendBSVButton](/components/send-bsv-button) - General send button
- [WalletOverview](/components/wallet-overview) - Show balance