# AuthButton

A simple authentication trigger button that initiates the Bitcoin wallet authentication flow.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add auth-button
```

## Usage

```tsx
import { AuthButton } from 'bigblocks';

export default function Header() {
  return (
    <nav>
      <AuthButton>
        Sign in with Bitcoin
      </AuthButton>
    </nav>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | `ReactNode` | `'Sign In'` | Button text content |
| onClick | `() => void` | - | Custom click handler |
| variant | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Button style variant |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| className | `string` | - | Additional CSS classes |
| disabled | `boolean` | `false` | Disable the button |

## Examples

### Basic Usage

```tsx
<AuthButton>Connect Wallet</AuthButton>
```

### With Custom Handler

```tsx
<AuthButton 
  onClick={() => {
    // Track analytics
    analytics.track('auth_button_clicked');
  }}
>
  Sign In
</AuthButton>
```

### Different Variants

```tsx
// Primary (default)
<AuthButton variant="primary">Sign In</AuthButton>

// Secondary
<AuthButton variant="secondary">Connect</AuthButton>

// Ghost
<AuthButton variant="ghost">Login</AuthButton>
```

### Different Sizes

```tsx
// Small
<AuthButton size="sm">Sign In</AuthButton>

// Medium (default)
<AuthButton size="md">Sign In</AuthButton>

// Large
<AuthButton size="lg">Sign In</AuthButton>
```

## Styling

The AuthButton can be styled using className:

```tsx
<AuthButton 
  className="w-full rounded-full"
>
  Sign In with Bitcoin
</AuthButton>
```

## Integration

The AuthButton works with the BitcoinAuthProvider:

```tsx
import { BitcoinAuthProvider, AuthButton } from 'bigblocks';

function App() {
  return (
    <BitcoinAuthProvider config={{ apiUrl: '/api' }}>
      <AuthButton>Sign In</AuthButton>
    </BitcoinAuthProvider>
  );
}
```

## Related Components

- [LoginForm](/components/login-form) - Full login form
- [SignupFlow](/components/signup-flow) - Complete signup flow
- [AuthFlowOrchestrator](/components/auth-flow-orchestrator) - Unified auth flow