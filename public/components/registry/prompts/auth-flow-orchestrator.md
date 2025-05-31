# AuthFlowOrchestrator

Unified authentication flow manager that intelligently routes users through sign in, sign up, or wallet restoration.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add auth-flow-orchestrator
```

## Usage

```tsx
import { AuthFlowOrchestrator, BitcoinAuthProvider } from 'bigblocks';

export default function AuthPage() {
  return (
    <BitcoinAuthProvider config={{ apiUrl: '/api' }}>
      <AuthFlowOrchestrator
        mode="unified"
        onSuccess={(result) => {
          console.log('Auth successful:', result);
          router.push('/dashboard');
        }}
      />
    </BitcoinAuthProvider>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| mode | `'unified' \| 'signin' \| 'signup' \| 'restore'` | `'unified'` | Initial flow mode |
| onSuccess | `(result: AuthResult) => void` | - | Success callback |
| onError | `(error: Error) => void` | - | Error callback |
| onModeChange | `(mode: string) => void` | - | Mode change callback |
| allowModeSwitch | `boolean` | `true` | Allow switching between modes |
| showOAuthProviders | `boolean` | `true` | Show OAuth options |
| customSteps | `Step[]` | - | Custom flow steps |
| theme | `'default' \| 'minimal'` | `'default'` | Visual theme |
| className | `string` | - | Additional CSS classes |

## Features

- **Smart Detection**: Auto-detects new vs returning users
- **Unified Flow**: Single entry point for all auth
- **Mode Switching**: Seamless transitions
- **Error Recovery**: Intelligent error handling
- **State Persistence**: Maintains progress
- **Custom Steps**: Extensible flow system

## Flow Modes

### Unified (Default)
```tsx
<AuthFlowOrchestrator mode="unified" />
```
Automatically determines the best flow:
- New users → Signup
- Existing users → Sign in
- Has backup → Restore

### Sign In Only
```tsx
<AuthFlowOrchestrator 
  mode="signin"
  allowModeSwitch={false}
/>
```

### Sign Up Only
```tsx
<AuthFlowOrchestrator 
  mode="signup"
  allowModeSwitch={false}
/>
```

### Restore Only
```tsx
<AuthFlowOrchestrator 
  mode="restore"
  allowModeSwitch={false}
/>
```

## Examples

### Basic Implementation

```tsx
<AuthFlowOrchestrator
  onSuccess={(result) => {
    // Handle successful auth
    if (result.isNewUser) {
      router.push('/onboarding');
    } else {
      router.push('/dashboard');
    }
  }}
/>
```

### With Error Handling

```tsx
<AuthFlowOrchestrator
  onSuccess={handleSuccess}
  onError={(error) => {
    if (error.code === 'USER_EXISTS') {
      toast.error('Account already exists');
    } else if (error.code === 'INVALID_BACKUP') {
      toast.error('Invalid backup file');
    } else {
      toast.error(error.message);
    }
  }}
/>
```

### Track Mode Changes

```tsx
<AuthFlowOrchestrator
  onModeChange={(mode) => {
    analytics.track('auth_mode_changed', { mode });
  }}
  onSuccess={handleSuccess}
/>
```

### Custom Steps

```tsx
<AuthFlowOrchestrator
  customSteps={[
    {
      id: 'terms',
      component: TermsAcceptance,
      required: true
    },
    {
      id: 'kyc',
      component: KYCVerification,
      required: false
    }
  ]}
  onSuccess={handleSuccess}
/>
```

### Minimal Theme

```tsx
<AuthFlowOrchestrator
  theme="minimal"
  showOAuthProviders={false}
  onSuccess={handleSuccess}
/>
```

### In Modal

```tsx
function AuthModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <AuthFlowOrchestrator
        onSuccess={(result) => {
          handleAuthSuccess(result);
          onClose();
        }}
        onError={(error) => {
          console.error('Auth failed:', error);
        }}
      />
    </Modal>
  );
}
```

### With Loading State

```tsx
function AuthPage() {
  const [checking, setChecking] = useState(true);
  const [existingBackup, setExistingBackup] = useState(null);
  
  useEffect(() => {
    // Check for existing backup
    checkLocalBackup().then(backup => {
      setExistingBackup(backup);
      setChecking(false);
    });
  }, []);
  
  if (checking) return <LoadingSpinner />;
  
  return (
    <AuthFlowOrchestrator
      mode={existingBackup ? 'signin' : 'unified'}
      onSuccess={handleSuccess}
    />
  );
}
```

## Flow Steps

### Sign Up Flow
1. Welcome screen
2. Generate identity
3. Create password
4. Download backup
5. Link OAuth (optional)
6. Success

### Sign In Flow
1. Enter password
2. Decrypt backup
3. Verify identity
4. Success

### Restore Flow
1. Choose restore method
2. OAuth or file import
3. Enter password
4. Verify backup
5. Success

## State Management

The orchestrator manages:
- Current step
- Form data
- Error states
- Progress tracking
- Mode transitions

## Styling

```tsx
<AuthFlowOrchestrator
  className="max-w-md mx-auto p-8"
  onSuccess={handleSuccess}
/>
```

## Security

- Client-side key generation
- Password never sent to server
- Encrypted backup handling
- Secure OAuth flow
- CSRF protection

## Analytics Events

Default events tracked:
- `auth_flow_started`
- `auth_mode_selected`
- `auth_step_completed`
- `auth_flow_completed`
- `auth_flow_error`

## Related Components

- [LoginForm](/components/login-form) - Sign in component
- [SignupFlow](/components/signup-flow) - Sign up component
- [OAuthRestoreFlow](/components/oauth-restore-flow) - OAuth restore
- [BackupImport](/components/backup-import) - File restore