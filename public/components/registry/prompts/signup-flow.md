# SignupFlow

A multi-step signup process for creating new Bitcoin wallets with built-in identity generation and backup management.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add signup-flow
```

## Usage

```tsx
import { SignupFlow, BitcoinAuthProvider } from 'bigblocks';

export default function SignupPage() {
  const handleSuccess = (result) => {
    console.log('Signup successful:', result);
    // Navigate to onboarding or dashboard
  };

  return (
    <BitcoinAuthProvider config={{ apiUrl: '/api' }}>
      <SignupFlow
        onSuccess={handleSuccess}
        onCancel={() => router.push('/')}
      />
    </BitcoinAuthProvider>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onSuccess | `(result: SignupResult) => void` | - | Callback when signup succeeds |
| onCancel | `() => void` | - | Callback when user cancels |
| onError | `(error: Error) => void` | - | Callback for error handling |
| showBackupStep | `boolean` | `true` | Show backup download step |
| showOAuthStep | `boolean` | `true` | Show OAuth linking step |
| className | `string` | - | Additional CSS classes |

## Features

- **Identity Generation**: Creates new Bitcoin keypairs
- **Password Encryption**: Client-side key encryption
- **Backup Creation**: Downloadable encrypted backups
- **OAuth Linking**: Optional cloud backup anchoring
- **Step Navigation**: Clear multi-step process
- **Error Recovery**: Handle failures gracefully

## Flow Steps

1. **Welcome**: Introduction and terms acceptance
2. **Identity Creation**: Generate Bitcoin wallet
3. **Password Setup**: Create encryption password
4. **Backup Download**: Save encrypted backup file
5. **OAuth Linking**: Optional cloud backup
6. **Completion**: Success confirmation

## Examples

### Basic Signup

```tsx
<SignupFlow 
  onSuccess={(result) => {
    router.push('/dashboard');
  }}
/>
```

### Skip OAuth Step

```tsx
<SignupFlow 
  showOAuthStep={false}
  onSuccess={(result) => {
    // User completed signup without OAuth
    router.push('/onboarding');
  }}
/>
```

### Custom Error Handling

```tsx
<SignupFlow 
  onSuccess={handleSuccess}
  onError={(error) => {
    if (error.code === 'USER_EXISTS') {
      toast.error('Account already exists');
      router.push('/signin');
    } else {
      toast.error(error.message);
    }
  }}
/>
```

### With Analytics

```tsx
<SignupFlow 
  onSuccess={(result) => {
    analytics.track('signup_completed', {
      method: 'bitcoin',
      hasOAuth: result.hasOAuthBackup
    });
    router.push('/welcome');
  }}
  onCancel={() => {
    analytics.track('signup_cancelled');
    router.push('/');
  }}
/>
```

## Styling

The component uses the theme from BitcoinThemeProvider:

```tsx
<BitcoinThemeProvider theme="orange" mode="dark">
  <SignupFlow className="max-w-lg mx-auto" />
</BitcoinThemeProvider>
```

## Security

- Private keys generated client-side only
- Password never sent to server
- Encrypted backups use strong encryption
- OAuth used only for backup storage

## API Requirements

- `POST /api/auth/signup` - Create new user
- `GET /api/backup/status` - Check backup status
- `POST /api/auth/link-provider` - Link OAuth provider

## Related Components

- [LoginForm](/components/login-form) - Sign in existing users
- [BackupDownload](/components/backup-download) - Backup management
- [OAuthProviders](/components/oauth-providers) - OAuth selection