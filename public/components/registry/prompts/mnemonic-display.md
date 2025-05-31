# MnemonicDisplay

Securely display recovery phrases (mnemonic seed phrases) with acknowledgment and copy functionality.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add mnemonic-display
```

## Usage

```tsx
import { MnemonicDisplay } from 'bigblocks';

export default function BackupPhrase() {
  const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

  return (
    <MnemonicDisplay
      mnemonic={mnemonic}
      onAcknowledge={() => {
        console.log('User acknowledged backup');
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| mnemonic | `string` | - | Space-separated mnemonic phrase |
| onAcknowledge | `() => void` | - | Acknowledgment callback |
| onCopy | `() => void` | - | Copy callback |
| requireAcknowledge | `boolean` | `true` | Require user acknowledgment |
| showCopyButton | `boolean` | `true` | Show copy to clipboard |
| showWarning | `boolean` | `true` | Show security warning |
| blurInitially | `boolean` | `false` | Blur words initially |
| columns | `number` | `3` | Words per row |
| variant | `'grid' \| 'list' \| 'compact'` | `'grid'` | Display variant |
| className | `string` | - | Additional CSS classes |

## Features

- **Secure Display**: Numbered word grid
- **Copy Protection**: Optional blur/reveal
- **Acknowledgment**: User must confirm
- **Copy to Clipboard**: One-click copy
- **Security Warnings**: Best practices
- **Responsive Layout**: Mobile friendly

## Examples

### Basic Display

```tsx
<MnemonicDisplay
  mnemonic={seedPhrase}
  onAcknowledge={handleAcknowledge}
/>
```

### Without Acknowledgment

```tsx
<MnemonicDisplay
  mnemonic={mnemonic}
  requireAcknowledge={false}
  showWarning={false}
/>
```

### Blurred Initially

```tsx
<MnemonicDisplay
  mnemonic={mnemonic}
  blurInitially={true}
  onAcknowledge={handleAcknowledge}
/>
```

### List Variant

```tsx
<MnemonicDisplay
  mnemonic={mnemonic}
  variant="list"
  onAcknowledge={handleAcknowledge}
/>
```

### Compact Variant

```tsx
<MnemonicDisplay
  mnemonic={mnemonic}
  variant="compact"
  columns={4}
  onAcknowledge={handleAcknowledge}
/>
```

### Custom Columns

```tsx
<MnemonicDisplay
  mnemonic={mnemonic}
  columns={4} // 4 words per row
  onAcknowledge={handleAcknowledge}
/>
```

### Without Copy Button

```tsx
<MnemonicDisplay
  mnemonic={mnemonic}
  showCopyButton={false}
  onAcknowledge={handleAcknowledge}
/>
```

### In Backup Flow

```tsx
function BackupFlow() {
  const [step, setStep] = useState(1);
  const [acknowledged, setAcknowledged] = useState(false);
  const { mnemonic } = useWallet();
  
  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Your Recovery Phrase</h2>
          <p>Write down these words in order:</p>
          
          <MnemonicDisplay
            mnemonic={mnemonic}
            blurInitially={true}
            onAcknowledge={() => {
              setAcknowledged(true);
              setStep(2);
            }}
            onCopy={() => {
              toast.warning('Copied! Remember to store securely.');
            }}
          />
        </div>
      )}
      
      {step === 2 && (
        <div>
          <h2>Verify Your Backup</h2>
          <MnemonicVerification mnemonic={mnemonic} />
        </div>
      )}
    </div>
  );
}
```

### With Custom Warning

```tsx
<div>
  <MnemonicDisplay
    mnemonic={mnemonic}
    showWarning={false}
    onAcknowledge={handleAcknowledge}
  />
  
  <div className="mt-4 p-4 bg-red-50 rounded-lg">
    <h4 className="font-bold text-red-900">Critical Security Notice</h4>
    <ul className="text-sm text-red-700 mt-2">
      <li>• Never share these words with anyone</li>
      <li>• Never type them on any website</li>
      <li>• Store them offline in a secure location</li>
    </ul>
  </div>
</div>
```

## Security Guidelines

Default warning includes:
1. Write down on paper (not digital)
2. Store in multiple secure locations
3. Never share with anyone
4. Never enter on websites
5. These words control your funds

## Display Formats

### Grid (Default)
```
1. abandon    2. abandon    3. abandon
4. abandon    5. abandon    6. abandon
...
```

### List
```
1. abandon
2. abandon
3. abandon
...
```

### Compact
```
abandon abandon abandon abandon...
```

## Acknowledgment Flow

1. Words displayed (optionally blurred)
2. User reads and understands
3. Checkbox: "I have written down my recovery phrase"
4. Button enabled after acknowledgment
5. Callback triggered

## Styling

```tsx
<MnemonicDisplay
  mnemonic={mnemonic}
  className="bg-gray-50 p-6 rounded-xl"
  onAcknowledge={handleAcknowledge}
/>
```

## Best Practices

1. Always show security warnings
2. Require acknowledgment for new wallets
3. Blur initially for shoulder surfing protection
4. Verify user has written down phrase
5. Clear from screen after acknowledgment

## Related Components

- [SignupFlow](/components/signup-flow) - Uses for wallet creation
- [BackupDownload](/components/backup-download) - Alternative backup
- [IdentityGeneration](/components/identity-generation) - Generates mnemonics