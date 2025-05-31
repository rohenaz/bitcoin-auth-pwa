# PasswordInput

Secure password input component with visibility toggle and strength indicator.

## Installation

Install the bigblocks package:

```bash
npm install bigblocks
```

Or add just this component:

```bash
npx bigblocks add password-input
```

## Usage

```tsx
import { PasswordInput } from 'bigblocks';

export default function LoginForm() {
  const [password, setPassword] = useState('');

  return (
    <PasswordInput
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter password"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | `string` | - | Password value |
| onChange | `(e: ChangeEvent) => void` | - | Change handler |
| placeholder | `string` | `'Password'` | Placeholder text |
| showToggle | `boolean` | `true` | Show visibility toggle |
| showStrength | `boolean` | `false` | Show strength indicator |
| minLength | `number` | - | Minimum length |
| maxLength | `number` | - | Maximum length |
| required | `boolean` | `false` | Required field |
| error | `string` | - | Error message |
| label | `string` | - | Field label |
| autoComplete | `string` | `'current-password'` | Autocomplete hint |
| disabled | `boolean` | `false` | Disable input |
| className | `string` | - | Additional CSS classes |

## Features

- **Visibility Toggle**: Show/hide password
- **Strength Indicator**: Visual password strength
- **Error States**: Validation feedback
- **Accessibility**: ARIA labels and states
- **Auto-complete**: Browser password managers
- **Secure Input**: Type="password" by default

## Examples

### Basic Password Input

```tsx
<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

### With Label

```tsx
<PasswordInput
  label="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>
```

### With Strength Indicator

```tsx
<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  showStrength={true}
  minLength={8}
/>
```

### With Error

```tsx
<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error="Password must be at least 8 characters"
/>
```

### New Password

```tsx
<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Create password"
  autoComplete="new-password"
  showStrength={true}
/>
```

### Confirm Password

```tsx
function PasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const passwordsMatch = password === confirmPassword;
  
  return (
    <>
      <PasswordInput
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showStrength
      />
      
      <PasswordInput
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={!passwordsMatch ? "Passwords don't match" : undefined}
      />
    </>
  );
}
```

### Without Toggle

```tsx
<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  showToggle={false}
/>
```

### In Login Form

```tsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={error}
        placeholder="Enter your password"
      />
      
      <button type="submit">Sign In</button>
    </form>
  );
}
```

## Password Strength

Strength is calculated based on:
- Length (8+ characters)
- Uppercase letters
- Lowercase letters
- Numbers
- Special characters

Strength levels:
- **Weak**: Red indicator
- **Fair**: Orange indicator
- **Good**: Yellow indicator
- **Strong**: Green indicator

## Styling

Customize appearance:

```tsx
<PasswordInput
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="border-2 border-blue-500 rounded-lg"
/>
```

## Accessibility

- Proper ARIA labels
- Keyboard navigation
- Screen reader support
- Error announcements
- Focus management

## Security Notes

- Never log password values
- Use HTTPS in production
- Implement rate limiting
- Hash passwords server-side
- Use secure session management

## Related Components

- [LoginForm](/components/login-form) - Uses PasswordInput
- [SignupFlow](/components/signup-flow) - Password creation
- [LoadingButton](/components/loading-button) - Submit buttons