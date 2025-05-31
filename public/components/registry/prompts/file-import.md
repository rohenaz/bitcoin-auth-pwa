# FileImport

Drag and drop file import component with validation and preview capabilities.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add file-import
```

## Usage

```tsx
import { FileImport } from 'bigblocks';

export default function ImportBackup() {
  const handleImport = (file) => {
    console.log('Imported file:', file.name);
    // Process file
  };

  return (
    <FileImport
      onImport={handleImport}
      accept=".json,.txt"
      maxSize={5 * 1024 * 1024} // 5MB
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onImport | `(file: File, content?: string) => void` | - | File import callback |
| onError | `(error: Error) => void` | - | Error callback |
| accept | `string` | - | Accepted file types |
| maxSize | `number` | `10485760` | Max file size (bytes) |
| multiple | `boolean` | `false` | Allow multiple files |
| readAsText | `boolean` | `true` | Read file content as text |
| validateContent | `(content: string) => boolean` | - | Content validator |
| label | `string` | `'Drop file or click'` | Drop zone label |
| description | `string` | - | Help text |
| showPreview | `boolean` | `true` | Show file preview |
| className | `string` | - | Additional CSS classes |

## Features

- **Drag & Drop**: Intuitive file dropping
- **Click to Browse**: Fallback file picker
- **File Validation**: Type and size checks
- **Content Preview**: Show file contents
- **Progress Indicator**: Upload progress
- **Error Handling**: Clear error messages
- **Multiple Files**: Batch import support

## Examples

### Basic Import

```tsx
<FileImport
  onImport={(file) => {
    console.log('File:', file);
  }}
/>
```

### With Content Reading

```tsx
<FileImport
  onImport={(file, content) => {
    console.log('File:', file.name);
    console.log('Content:', content);
    // Parse and process content
  }}
  readAsText={true}
/>
```

### Specific File Types

```tsx
<FileImport
  accept=".json,.bak"
  onImport={handleImport}
  description="JSON or BAK files only"
/>
```

### With Validation

```tsx
<FileImport
  accept=".json"
  validateContent={(content) => {
    try {
      const data = JSON.parse(content);
      return data.type === 'BitcoinBackup';
    } catch {
      return false;
    }
  }}
  onImport={handleImport}
  onError={(error) => {
    toast.error('Invalid backup file');
  }}
/>
```

### Multiple Files

```tsx
<FileImport
  multiple={true}
  onImport={(files) => {
    console.log('Imported files:', files);
  }}
  maxSize={1024 * 1024} // 1MB per file
/>
```

### Custom Styling

```tsx
<FileImport
  onImport={handleImport}
  className="border-dashed border-4 border-blue-500"
  label="Drop your backup file here"
  description="Supports encrypted and plain backups"
/>
```

### Image Import

```tsx
<FileImport
  accept="image/*"
  maxSize={10 * 1024 * 1024} // 10MB
  readAsText={false}
  onImport={(file) => {
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }}
  label="Drop image here"
/>
```

### In Restore Flow

```tsx
function RestoreWallet() {
  const [step, setStep] = useState('import');
  const [backup, setBackup] = useState(null);
  
  return (
    <div>
      {step === 'import' && (
        <FileImport
          accept=".json,.txt"
          onImport={(file, content) => {
            setBackup(content);
            setStep('password');
          }}
          validateContent={(content) => {
            // Check if valid backup format
            return content.includes('BitcoinBackup') || 
                   content.startsWith('U2FsdGVkX1');
          }}
          onError={(error) => {
            toast.error('Invalid backup file');
          }}
        />
      )}
      
      {step === 'password' && (
        <PasswordInput
          placeholder="Enter backup password"
          onSubmit={(password) => {
            decryptBackup(backup, password);
          }}
        />
      )}
    </div>
  );
}
```

### With Progress

```tsx
function LargeFileImport() {
  const [progress, setProgress] = useState(0);
  
  return (
    <FileImport
      onImport={async (file) => {
        // Simulate processing
        for (let i = 0; i <= 100; i += 10) {
          setProgress(i);
          await new Promise(r => setTimeout(r, 100));
        }
      }}
      maxSize={100 * 1024 * 1024} // 100MB
    >
      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </FileImport>
  );
}
```

## File Type Examples

### Backup Files
```tsx
<FileImport
  accept=".json,.txt,.bak"
  validateContent={(content) => {
    return isValidBackup(content);
  }}
/>
```

### CSV Import
```tsx
<FileImport
  accept=".csv"
  onImport={(file, content) => {
    const rows = parseCSV(content);
    importData(rows);
  }}
/>
```

## Error States

- File too large
- Invalid file type
- Content validation failed
- Read error
- No file selected

## Styling

```tsx
<FileImport
  className="bg-gray-50 border-gray-300 hover:bg-gray-100"
  onImport={handleImport}
/>
```

## Accessibility

- Keyboard navigation support
- ARIA labels and roles
- Screen reader announcements
- Focus management

## Related Components

- [BackupImport](/components/backup-import) - Specialized for backups
- [BackupDownload](/components/backup-download) - Export backups
- [Modal](/components/modal) - Often used together