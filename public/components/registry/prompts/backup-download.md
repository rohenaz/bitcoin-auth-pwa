# BackupDownload

Component for downloading encrypted wallet backups with progress tracking and security features.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add backup-download
```

## Usage

```tsx
import { BackupDownload } from 'bigblocks';

export default function BackupSettings() {
  const backup = {
    data: encryptedBackupData,
    filename: 'wallet-backup-2024.json',
    type: 'encrypted'
  };

  return (
    <BackupDownload
      backup={backup}
      onDownload={() => {
        console.log('Backup downloaded');
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| backup | `BackupData` | - | Backup data object |
| onDownload | `() => void` | - | Download complete callback |
| onError | `(error: Error) => void` | - | Error callback |
| showPreview | `boolean` | `false` | Show backup preview |
| showInstructions | `boolean` | `true` | Show safety instructions |
| variant | `'button' \| 'card'` | `'button'` | Display variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Component size |
| className | `string` | - | Additional CSS classes |

## BackupData Interface

```typescript
interface BackupData {
  data: string | object; // Encrypted string or JSON
  filename?: string;     // Custom filename
  type: 'encrypted' | 'plain' | 'wif';
  timestamp?: number;    // Backup creation time
  version?: string;      // Backup format version
}
```

## Features

- **Secure Download**: Client-side file generation
- **Progress Tracking**: Download progress indicator
- **Multiple Formats**: JSON, TXT, encrypted
- **Safety Instructions**: User guidance
- **Verification**: Checksum validation
- **Auto-naming**: Timestamp-based filenames

## Examples

### Basic Download

```tsx
<BackupDownload
  backup={{
    data: encryptedBackup,
    type: 'encrypted'
  }}
  onDownload={() => toast.success('Backup saved!')}
/>
```

### Card Variant

```tsx
<BackupDownload
  variant="card"
  backup={backupData}
  onDownload={handleDownload}
/>
```

### With Preview

```tsx
<BackupDownload
  backup={backup}
  showPreview={true}
  onDownload={handleDownload}
/>
```

### Custom Filename

```tsx
<BackupDownload
  backup={{
    data: backupData,
    filename: `bitcoin-wallet-${Date.now()}.json`,
    type: 'encrypted'
  }}
  onDownload={handleDownload}
/>
```

### Without Instructions

```tsx
<BackupDownload
  backup={backup}
  showInstructions={false}
  onDownload={handleDownload}
/>
```

### Different Sizes

```tsx
// Small
<BackupDownload size="sm" backup={backup} onDownload={handleDownload} />

// Medium (default)
<BackupDownload size="md" backup={backup} onDownload={handleDownload} />

// Large
<BackupDownload size="lg" backup={backup} onDownload={handleDownload} />
```

### With Error Handling

```tsx
<BackupDownload
  backup={backup}
  onDownload={() => {
    analytics.track('backup_downloaded');
    setBackupComplete(true);
  }}
  onError={(error) => {
    console.error('Backup failed:', error);
    toast.error('Failed to download backup');
  }}
/>
```

### In Backup Flow

```tsx
function BackupFlow() {
  const [step, setStep] = useState(1);
  const { backup } = useWallet();
  
  return (
    <div>
      <StepIndicator steps={3} current={step} />
      
      {step === 1 && (
        <div>
          <h3>Create Password</h3>
          <PasswordInput />
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <h3>Download Backup</h3>
          <BackupDownload
            backup={backup}
            variant="card"
            onDownload={() => setStep(3)}
          />
        </div>
      )}
      
      {step === 3 && (
        <div>
          <h3>Backup Complete!</h3>
          <p>Your wallet is now backed up safely.</p>
        </div>
      )}
    </div>
  );
}
```

## Safety Instructions

Default instructions shown:
1. Store backup in multiple secure locations
2. Never share backup file with anyone
3. Remember your password - it cannot be recovered
4. Test backup restoration on another device

## File Formats

### Encrypted (`.txt`)
```
U2FsdGVkX1+... (Base64 encrypted data)
```

### Plain JSON (`.json`)
```json
{
  "version": "1.0",
  "type": "BapMasterBackup",
  "data": {...}
}
```

### WIF (`.txt`)
```
L1aW4aubDFB7yfras2S1mN3bqg9nwySY8nkoLmJebSLD5BWuSGsV
```

## Security Best Practices

1. Always encrypt sensitive backups
2. Use strong passwords
3. Store backups offline
4. Make multiple copies
5. Test restoration process

## Styling

```tsx
<BackupDownload
  backup={backup}
  className="bg-blue-50 border-blue-200"
  onDownload={handleDownload}
/>
```

## Related Components

- [BackupImport](/components/backup-import) - Import backups
- [FileImport](/components/file-import) - Generic file import
- [SignupFlow](/components/signup-flow) - Includes backup step