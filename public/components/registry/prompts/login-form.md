# LoginForm

A complete Bitcoin wallet login form with support for multiple authentication modes including sign in, sign up, and wallet restoration.

## Installation

Install the bigblocks package which includes the LoginForm component:

```bash
npm install bigblocks
```

Or add just this component using the bigblocks CLI:

```bash
npx bigblocks add login-form
```

## Usage

```tsx
import { LoginForm, BitcoinAuthProvider } from 'bigblocks';

export default function LoginPage() {
  const handleSuccess = (result) => {
    console.log('Login successful:', result);
    // Navigate to dashboard or handle authentication
  };

  const handleError = (error) => {
    console.error('Login failed:', error);
  };

  return (
    <BitcoinAuthProvider config={{ apiUrl: '/api' }}>
      <LoginForm
        mode="signin"
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </BitcoinAuthProvider>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| mode | `'signin' \| 'signup' \| 'restore'` | `'signin'` | The form mode to display |
| onSuccess | `(result: AuthResult) => void` | - | Callback when authentication succeeds |
| onError | `(error: Error) => void` | - | Callback when authentication fails |
| redirectTo | `string` | - | URL to redirect after successful login |
| className | `string` | - | Additional CSS classes |

## Features

- **Multiple Modes**: Switch between sign in, sign up, and restore wallet modes
- **Bitcoin Authentication**: Uses Bitcoin keypairs for authentication
- **Password Encryption**: Client-side encryption of private keys
- **Session Management**: Automatic session handling with NextAuth
- **Error Handling**: Built-in error states and validation
- **Responsive Design**: Mobile-first responsive layout

## Examples

### Basic Sign In

```tsx
<LoginForm 
  mode="signin"
  onSuccess={(result) => router.push('/dashboard')}
/>
```

### Sign Up Flow

```tsx
<LoginForm 
  mode="signup"
  onSuccess={async (result) => {
    // Save user data
    await createUserProfile(result.user);
    router.push('/onboarding');
  }}
/>
```

### Wallet Restoration

```tsx
<LoginForm 
  mode="restore"
  onSuccess={(result) => {
    // Wallet restored successfully
    router.push('/dashboard');
  }}
  onError={(error) => {
    toast.error('Failed to restore wallet');
  }}
/>
```

### With Custom Styling

```tsx
<LoginForm 
  mode="signin"
  className="max-w-md mx-auto"
  onSuccess={handleSuccess}
/>
```

## API Integration

The LoginForm requires these API endpoints:

- `POST /api/auth/signin` - Handle sign in with Bitcoin signature
- `POST /api/auth/signup` - Create new wallet and user
- `POST /api/auth/restore` - Restore wallet from backup

## Security Considerations

- Private keys are never sent to the server
- All encryption happens client-side
- Passwords are used only for local encryption
- Authentication uses Bitcoin message signing

## Theming

The component respects the BitcoinThemeProvider theme:

```tsx
<BitcoinThemeProvider theme="orange" mode="dark">
  <LoginForm mode="signin" />
</BitcoinThemeProvider>
```

## Related Components

- [AuthButton](/components/auth-button) - Simple auth trigger
- [SignupFlow](/components/signup-flow) - Multi-step signup
- [OAuthProviders](/components/oauth-providers) - OAuth backup options