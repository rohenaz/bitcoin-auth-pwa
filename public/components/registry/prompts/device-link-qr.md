# DeviceLinkQR

Generate QR codes for secure device-to-device wallet linking without cloud services.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add device-link-qr
```

## Usage

```tsx
import { DeviceLinkQR } from 'bigblocks';

export default function LinkNewDevice() {
  const [token, setToken] = useState('');
  
  useEffect(() => {
    // Generate linking token from API
    generateLinkToken().then(setToken);
  }, []);

  return (
    <DeviceLinkQR
      token={token}
      onExpire={() => {
        console.log('QR code expired');
        // Generate new token
      }}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| token | `string` | - | Device link token |
| onExpire | `() => void` | - | Token expiry callback |
| onRefresh | `() => void` | - | Refresh token callback |
| expiresIn | `number` | `600000` | Expiry time in ms (10 min) |
| size | `number` | `256` | QR code size in pixels |
| showTimer | `boolean` | `true` | Show countdown timer |
| showInstructions | `boolean` | `true` | Show linking instructions |
| logo | `string` | - | Center logo URL |
| variant | `'default' \| 'compact'` | `'default'` | Display variant |
| className | `string` | - | Additional CSS classes |

## Features

- **Secure Linking**: Time-limited tokens
- **QR Generation**: High-quality codes
- **Countdown Timer**: Visual expiry
- **Auto Refresh**: Token regeneration
- **Mobile Friendly**: Responsive sizing
- **Instructions**: Clear user guidance

## Examples

### Basic QR Code

```tsx
<DeviceLinkQR
  token="abc123def456"
  onExpire={handleExpire}
/>
```

### With Custom Expiry

```tsx
<DeviceLinkQR
  token={token}
  expiresIn={300000} // 5 minutes
  onExpire={regenerateToken}
/>
```

### Compact Variant

```tsx
<DeviceLinkQR
  token={token}
  variant="compact"
  showInstructions={false}
  size={200}
/>
```

### With Logo

```tsx
<DeviceLinkQR
  token={token}
  logo="/logo.png"
  onExpire={handleExpire}
/>
```

### Without Timer

```tsx
<DeviceLinkQR
  token={token}
  showTimer={false}
  onExpire={handleExpire}
/>
```

### Custom Size

```tsx
<DeviceLinkQR
  token={token}
  size={320} // Larger QR code
  onExpire={handleExpire}
/>
```

### With Refresh

```tsx
<DeviceLinkQR
  token={token}
  onExpire={handleExpire}
  onRefresh={async () => {
    const newToken = await generateLinkToken();
    setToken(newToken);
  }}
/>
```

### In Settings Page

```tsx
function DeviceLinking() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  
  const generateToken = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/device-link/generate', {
        method: 'POST'
      });
      const { token } = await response.json();
      setToken(token);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    generateToken();
  }, []);
  
  return (
    <div className="max-w-md mx-auto">
      <h2>Link New Device</h2>
      <p>Scan this QR code with your new device</p>
      
      {loading ? (
        <div>Generating secure link...</div>
      ) : (
        <DeviceLinkQR
          token={token}
          onExpire={generateToken}
          onRefresh={generateToken}
        />
      )}
    </div>
  );
}
```

## Default Instructions

1. Open app on new device
2. Select "Link existing wallet"
3. Scan this QR code
4. Enter your password on new device
5. Wallet will be synced

## Security Features

- **Time-limited**: Tokens expire after 10 minutes
- **Single-use**: Token invalid after use
- **Encrypted**: Contains encrypted backup
- **Password Required**: Decryption on new device
- **No Cloud**: Direct device transfer

## Token Format

```
bitcoinauth://link?token=abc123def456&expires=1234567890
```

## Countdown Timer

Shows remaining time:
- Green: > 5 minutes
- Yellow: 2-5 minutes  
- Red: < 2 minutes
- Expired: Shows refresh button

## Styling

```tsx
<DeviceLinkQR
  token={token}
  className="bg-white p-6 rounded-xl shadow-lg"
  onExpire={handleExpire}
/>
```

## Error States

- No token provided
- Token generation failed
- QR rendering error
- Network timeout

## Mobile Scanning

Optimized for mobile cameras:
- High contrast
- Error correction
- Appropriate sizing
- Clear quiet zone

## Related Components

- [QRCodeRenderer](/components/qr-code-renderer) - Generic QR codes
- [BackupDownload](/components/backup-download) - Alternative backup
- [OAuthProviders](/components/oauth-providers) - Cloud backup option